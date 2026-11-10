import { buildSkillsIndex } from '@/lib/agent-skills';

// Agent Skills Discovery index, built from the MeshJS/skills repo (see
// lib/agent-skills.ts). Refreshed hourly; a refresh that fails throws, so the
// last good index keeps serving instead of an error.
export const revalidate = 3600;

export async function GET() {
  return Response.json(await buildSkillsIndex(), {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
