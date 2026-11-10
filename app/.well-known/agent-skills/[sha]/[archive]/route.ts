import { ARCHIVE_SUFFIX, buildSkillArchive } from '@/lib/agent-skills';

// One skill at one commit of MeshJS/skills, as linked from the index. The
// bytes for a commit never change, so each archive is built once on first
// request and cached for good.
export const revalidate = false;
export const dynamicParams = true;

export function generateStaticParams(): { sha: string; archive: string }[] {
  return [];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sha: string; archive: string }> },
) {
  const { sha, archive } = await params;
  const name = archive.endsWith(ARCHIVE_SUFFIX) ? archive.slice(0, -ARCHIVE_SUFFIX.length) : '';
  const bytes = await buildSkillArchive(sha, name);

  if (!bytes) {
    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/gzip',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
