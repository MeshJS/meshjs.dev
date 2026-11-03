import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/get-llm-text';
import { getLLMIndex } from '@/lib/llms-index';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

// Reached through `<page>.md` and through `Accept: text/markdown` on the page
// itself (see rewrites in next.config.mjs). The homepage is not a docs page,
// so its markdown version is the site index.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug = [] } = await params;
  let body: string;
  if (slug.length === 0) {
    body = getLLMIndex();
  } else {
    const page = source.getPage(slug);
    if (!page) notFound();
    body = await getLLMText(page);
  }

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  });
}

export function generateStaticParams() {
  return [{ slug: [] }, ...source.generateParams()];
}
