import { execFileSync } from 'child_process';
import path from 'path';

/**
 * Last-modified dates for content files, resolved once per build.
 *
 * Git commit time is the only stable source available here: the docs carry no
 * date frontmatter, and filesystem mtime is set by `git clone`, so on a CI
 * build every file appears modified at checkout time. That made every RSS item
 * and sitemap entry change on every deploy, which is why feed readers
 * re-announced all 129 pages each time.
 *
 * If git history is unavailable — a shallow clone, or no .git at all — we fall
 * back to a fixed constant rather than mtime. A date that is stable and
 * approximate is strictly better here than one that is precise and churns.
 */
const FALLBACK = new Date('2026-01-01T00:00:00Z');

let cache: Map<string, number> | null = null;

function buildDateMap(): Map<string, number> {
  const map = new Map<string, number>();
  try {
    // One pass over the log. Output is newest-first, so the first time a path
    // appears is its most recent commit.
    const out = execFileSync(
      'git',
      ['log', '--name-only', '--format=%x00%aI', '--', 'content'],
      { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024, cwd: process.cwd() },
    );

    let commitTime = FALLBACK.getTime();
    for (const line of out.split('\n')) {
      if (line.startsWith('\0')) {
        const parsed = Date.parse(line.slice(1));
        if (!Number.isNaN(parsed)) commitTime = parsed;
        continue;
      }
      const file = line.trim();
      if (file && !map.has(file)) map.set(file, commitTime);
    }
  } catch {
    // git unavailable; every lookup falls through to FALLBACK.
  }
  return map;
}

export function getContentDate(absolutePath: string | undefined): Date {
  if (!absolutePath) return FALLBACK;
  cache ??= buildDateMap();

  const relative = path.relative(process.cwd(), absolutePath).split(path.sep).join('/');
  const timestamp = cache.get(relative);
  return timestamp === undefined ? FALLBACK : new Date(timestamp);
}
