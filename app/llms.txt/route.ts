import { getLLMIndex } from '@/lib/llms-index';

// cached forever
export const revalidate = false;

export async function GET() {
  return new Response(getLLMIndex(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
