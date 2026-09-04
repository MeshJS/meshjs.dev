import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkInclude } from 'fumadocs-mdx/config';
import { source } from '@/lib/source';
import type { InferPageType } from 'fumadocs-core/source';
import { readFile } from 'fs/promises';

/**
 * Strips MDX machinery from the tree so the text served to language models is
 * prose rather than source. Without this the corpus ships import statements and
 * className attributes as if they were documentation.
 *
 * - `mdxjsEsm` holds import/export statements: dropped entirely.
 * - `mdxFlowExpression` / `mdxTextExpression` hold `{...}` JS: dropped.
 * - JSX elements are unwrapped to their children, so content written inside a
 *   <Card> or <Callout> survives while the tag and its props do not.
 */
function remarkStripMdx() {
  const DROP = new Set(['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression']);
  const UNWRAP = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

  function clean(nodes: any[]): any[] {
    const out: any[] = [];
    for (const node of nodes) {
      if (DROP.has(node.type)) continue;
      if (Array.isArray(node.children)) node.children = clean(node.children);
      if (UNWRAP.has(node.type)) {
        out.push(...(node.children ?? []));
        continue;
      }
      out.push(node);
    }
    return out;
  }

  return (tree: any) => {
    tree.children = clean(tree.children ?? []);
  };
}

const processor = remark()
  .use(remarkMdx)
  // needed for Fumadocs MDX
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkStripMdx);

export async function getLLMText(page: InferPageType<typeof source>) {
  if (!page.absolutePath) {
    throw new Error(`Page ${page.url} has no absolutePath`);
  }

  const content = await readFile(page.absolutePath, 'utf-8');
  const processed = await processor.process({
    path: page.absolutePath,
    value: content,
  });

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed.value}`;
}
