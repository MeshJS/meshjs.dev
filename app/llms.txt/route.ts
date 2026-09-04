import { source } from '@/lib/source';
import { SECTION_ORDER, sectionOf, sectionTitle } from '@/lib/sections';

// cached forever
export const revalidate = false;

const BASE_URL = 'https://meshjs.dev';


/**
 * The llms.txt convention asks for a short, curated index of the site so a
 * language model can decide what to read. The full corpus belongs at
 * /llms-full.txt, which is where it now lives.
 */
export async function GET() {
  const groups = new Map<string, { title: string; url: string; description: string }[]>();

  for (const page of source.getPages()) {
    const key = sectionOf(page.url);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({
      title: page.data.title,
      url: `${BASE_URL}${page.url}`,
      description: page.data.description ?? '',
    });
  }

  const sorted = [...groups.keys()].sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a);
    const bi = SECTION_ORDER.indexOf(b);
    return (ai === -1 ? SECTION_ORDER.length : ai) - (bi === -1 ? SECTION_ORDER.length : bi) || a.localeCompare(b);
  });

  const body = [
    '# Mesh — Cardano TypeScript SDK',
    '',
    '> Open-source TypeScript SDK for building Cardano applications: transaction builders, wallet connectors, React components, NFT minting and smart contract tooling.',
    '',
    'Install with `npm install @meshsdk/core`. Every page below is also available as plain markdown by appending `.md` to its URL.',
    '',
    ...sorted.flatMap((key) => [
      `## ${sectionTitle(key)}`,
      '',
      ...groups
        .get(key)!
        .sort((a, b) => a.url.localeCompare(b.url))
        .map((p) => (p.description ? `- [${p.title}](${p.url}): ${p.description}` : `- [${p.title}](${p.url})`)),
      '',
    ]),
    '## Optional',
    '',
    `- [Full documentation](${BASE_URL}/llms-full.txt): every page above concatenated as plain text`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
