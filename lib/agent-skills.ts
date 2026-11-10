import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import matter from 'gray-matter';
import { createTar } from 'nanotar';

/**
 * Mesh's agent skills live in the MeshJS/skills repo. This module turns that
 * repo into the Agent Skills Discovery index (v0.2.0) and the archives it
 * points to, so nothing here needs updating when a skill is added or edited.
 * https://github.com/cloudflare/agent-skills-discovery-rfc
 *
 * Everything is pinned to one commit: every archive URL in the index names the
 * commit it was hashed from, and an archive is built only from the files at
 * that commit. A digest in the index therefore always matches the bytes its
 * URL serves, however long either has been cached.
 *
 * Each skill is a directory with SKILL.md plus files it links to by relative
 * path, so skills are distributed as `type: "archive"` (.tar.gz).
 */

const REPO = 'MeshJS/skills';
const BRANCH = 'main';
const SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

// Agent Skills naming rule: 1-64 characters, lowercase alphanumerics, single
// hyphens between them.
const SKILL_NAME = /^(?=.{1,64}$)[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMMIT_SHA = /^[0-9a-f]{40}$/;
const MAX_DESCRIPTION = 1024;

export const ARCHIVE_SUFFIX = '.tar.gz';

type Commit = { sha: string; time: number };

export type SkillEntry = {
  name: string;
  type: 'archive';
  description: string;
  url: string;
  digest: string;
};

export type SkillsIndex = { $schema: string; skills: SkillEntry[] };

export function archiveUrl(sha: string, name: string): string {
  return `/.well-known/agent-skills/${sha}/${name}${ARCHIVE_SUFFIX}`;
}

class NotFound extends Error {}

async function fetchOk(url: string, headers: HeadersInit = {}): Promise<Response> {
  const res = await fetch(url, { headers });
  if (res.status === 404) throw new NotFound(url);
  if (!res.ok) throw new Error(`GitHub request failed: ${res.status} ${url}`);
  return res;
}

function githubApi<T>(path: string): Promise<T> {
  // Unauthenticated calls are limited to 60 an hour per IP. A token is
  // optional; the index and archives make only a handful of calls each.
  const token = process.env.GITHUB_TOKEN;
  return fetchOk(`https://api.github.com/repos/${REPO}${path}`, {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }).then((res) => res.json() as Promise<T>);
}

async function readCommit(ref: string): Promise<Commit> {
  const commit = await githubApi<{ sha: string; commit: { committer: { date: string } } }>(
    `/commits/${encodeURIComponent(ref)}`,
  );
  return { sha: commit.sha, time: Date.parse(commit.commit.committer.date) };
}

/** Every file in the repo at `sha`, as repo-relative paths. */
async function listFiles(sha: string): Promise<string[]> {
  const tree = await githubApi<{ truncated: boolean; tree: { path: string; type: string }[] }>(
    `/git/trees/${sha}?recursive=1`,
  );
  if (tree.truncated) throw new Error(`Tree listing for ${REPO}@${sha} was truncated`);
  return tree.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path);
}

// raw.githubusercontent.com does not count against the API rate limit.
async function readFile(sha: string, path: string): Promise<Uint8Array> {
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  const res = await fetchOk(`https://raw.githubusercontent.com/${REPO}/${sha}/${encoded}`);
  return new Uint8Array(await res.arrayBuffer());
}

/** Skill directory name → its files, relative to the directory. */
function groupSkills(paths: string[]): Map<string, string[]> {
  const skills = new Map<string, string[]>();
  for (const path of paths) {
    const slash = path.indexOf('/');
    if (slash === -1) continue;
    const dir = path.slice(0, slash);
    if (!skills.has(dir)) skills.set(dir, []);
    skills.get(dir)!.push(path.slice(slash + 1));
  }
  for (const [dir, files] of skills) {
    if (!SKILL_NAME.test(dir) || !files.includes('SKILL.md')) skills.delete(dir);
  }
  return skills;
}

type PackedSkill = { archive: Uint8Array<ArrayBuffer>; skillMd: string };

/**
 * The one place an archive's bytes are produced, used by both the index (to
 * hash it) and the archive route (to serve it). Output depends only on the
 * commit, so the two always agree: files are sorted, every tar header uses
 * fixed ownership and permissions and the commit time, and the gzip header
 * carries no timestamp (zlib writes 0) or host OS.
 */
async function packSkill(commit: Commit, name: string, files: string[]): Promise<PackedSkill> {
  const sorted = [...files].sort();
  const contents = await Promise.all(sorted.map((file) => readFile(commit.sha, `${name}/${file}`)));

  const tar = createTar(
    sorted.map((file, i) => ({ name: file, data: contents[i] })),
    { attrs: { mode: '644', uid: 0, gid: 0, user: '', group: '', mtime: commit.time } },
  );
  const archive = gzipSync(tar, { level: 9 });
  // Byte 9 of a gzip header is the OS that wrote it, which differs between
  // macOS and Linux. 255 means "unknown" (RFC 1952) and is the same everywhere.
  archive[9] = 0xff;

  return { archive, skillMd: new TextDecoder().decode(contents[sorted.indexOf('SKILL.md')]) };
}

function sha256(bytes: Uint8Array): string {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}

/** Reads `name` and `description` from SKILL.md; null if either is unusable. */
function readFrontmatter(dir: string, skillMd: string): { description: string } | null {
  const { data } = matter(skillMd);
  if (data.name !== dir) {
    console.warn(`agent-skills: ${dir}/SKILL.md names itself "${data.name}"; skipped`);
    return null;
  }
  if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > MAX_DESCRIPTION) {
    console.warn(`agent-skills: ${dir}/SKILL.md has no usable description; skipped`);
    return null;
  }
  return { description: data.description.trim() };
}

/** The discovery index for the current head of MeshJS/skills. */
export async function buildSkillsIndex(): Promise<SkillsIndex> {
  const commit = await readCommit(BRANCH);
  const skills = groupSkills(await listFiles(commit.sha));

  const entries = await Promise.all(
    [...skills].map(async ([name, files]): Promise<SkillEntry | null> => {
      const { archive, skillMd } = await packSkill(commit, name, files);
      const meta = readFrontmatter(name, skillMd);
      if (!meta) return null;
      return {
        name,
        type: 'archive',
        description: meta.description,
        url: archiveUrl(commit.sha, name),
        digest: sha256(archive),
      };
    }),
  );

  return {
    $schema: SCHEMA,
    skills: entries.filter((entry): entry is SkillEntry => entry !== null).sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/**
 * The archive for skill `name` at commit `sha`, or null if there is no such
 * skill there. The SKILL.md check goes first because it is a raw-file fetch,
 * so a junk URL never spends the API rate limit.
 */
export async function buildSkillArchive(sha: string, name: string): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!COMMIT_SHA.test(sha) || !SKILL_NAME.test(name)) return null;
  try {
    await readFile(sha, `${name}/SKILL.md`);
    const commit = await readCommit(sha);
    const files = groupSkills(await listFiles(sha)).get(name);
    if (!files) return null;
    return (await packSkill(commit, name, files)).archive;
  } catch (error) {
    if (error instanceof NotFound) return null;
    throw error;
  }
}
