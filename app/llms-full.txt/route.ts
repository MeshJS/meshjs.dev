import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

// cached forever
export const revalidate = false;

/**
 * The complete documentation corpus as one plain-text file, per the llms.txt
 * convention. The short curated index lives at /llms.txt.
 */
export async function GET() {
  const scanned = await Promise.all(source.getPages().map(getLLMText));

  return new Response(scanned.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
