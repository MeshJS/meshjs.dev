/**
 * Human-readable names for the top-level docs sections, in the order they
 * should appear. Shared by the llms.txt index and the per-page breadcrumb
 * schema so the two can never disagree about what a section is called.
 *
 * A segment that is not listed falls back to its capitalised form and sorts
 * to the end, so adding a docs folder never makes it silently disappear.
 */
export const SECTIONS: Record<string, string> = {
  guides: 'Guides',
  apis: 'APIs',
  react: 'React Components',
  svelte: 'Svelte Components',
  providers: 'Providers',
  'smart-contracts': 'Smart Contracts',
  aiken: 'Aiken',
  nft: 'NFTs',
  hydra: 'Hydra',
  midnight: 'Midnight',
  yaci: 'Yaci',
  ai: 'AI Integration',
  resources: 'Resources',
  about: 'About',
};

export const SECTION_ORDER = Object.keys(SECTIONS);

export function sectionOf(url: string): string {
  return url.split('/').filter(Boolean)[0] ?? '';
}

export function sectionTitle(key: string): string {
  return SECTIONS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}
