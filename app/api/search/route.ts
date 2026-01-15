import { source } from '@/lib/source';
import { createFromSource, type SortedResult } from 'fumadocs-core/search/server';
import { NextRequest } from 'next/server';

const searchAPI = createFromSource(source, {
  language: 'english',
});

/**
 * Simple stemming: normalize singular/plural forms
 * Returns base form for comparison (e.g., "wallets" -> "wallet")
 */
function stem(word: string): string {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('es')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/**
 * Check if two words match accounting for pluralization
 */
function stemMatch(a: string, b: string): boolean {
  return stem(a) === stem(b);
}

/**
 * Re-rank search results using multiple signals:
 * 1. URL match quality (exact > stemmed > contains)
 * 2. URL depth (shallower pages are more authoritative)
 * 3. Section type (/apis/ is primary documentation)
 */
function reRankResults(results: SortedResult[], query: string): SortedResult[] {
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '');
  const stemmedQuery = stem(normalizedQuery);

  // Group results by page URL (remove hash fragments)
  const pageGroups = new Map<string, SortedResult[]>();
  for (const result of results) {
    const pageUrl = result.url.split('#')[0];
    if (!pageGroups.has(pageUrl)) {
      pageGroups.set(pageUrl, []);
    }
    pageGroups.get(pageUrl)!.push(result);
  }

  // Calculate composite score for each page
  const pageScores = new Map<string, number>();
  for (const pageUrl of pageGroups.keys()) {
    const urlPath = pageUrl.toLowerCase();
    const urlSegments = urlPath.split('/').filter(Boolean);
    const depth = urlSegments.length;

    // --- URL Match Score ---
    let matchScore = 0;
    const lastSegment = urlSegments[urlSegments.length - 1] ?? '';

    // Exact segment match (highest)
    if (urlSegments.some((seg) => seg === normalizedQuery)) {
      matchScore = 1000;
    }
    // Stemmed match (e.g., "wallet" matches "wallets")
    else if (urlSegments.some((seg) => stemMatch(seg, normalizedQuery))) {
      matchScore = 900;
    }
    // Last segment contains query
    else if (lastSegment.includes(normalizedQuery) || lastSegment.includes(stemmedQuery)) {
      matchScore = 500;
    }
    // Any segment contains query
    else if (urlSegments.some((seg) => seg.includes(normalizedQuery) || seg.includes(stemmedQuery))) {
      matchScore = 100;
    }
    // URL path contains query anywhere
    else if (urlPath.includes(normalizedQuery) || urlPath.includes(stemmedQuery)) {
      matchScore = 50;
    }

    // --- Depth Bonus (shallower = more authoritative) ---
    let depthBonus = 0;
    if (depth === 1) depthBonus = 200;
    else if (depth === 2) depthBonus = 150;
    else if (depth === 3) depthBonus = 100;
    else depthBonus = 50;

    // --- Section Bonus (primary documentation sections rank higher) ---
    let sectionBonus = 0;
    const firstSegment = urlSegments[0] ?? '';
    if (firstSegment === 'apis') sectionBonus = 300;
    else if (firstSegment === 'guides') sectionBonus = 100;
    else if (firstSegment === 'getting-started') sectionBonus = 150;

    // Only apply depth/section bonuses if there's a URL match
    // This prevents non-matching results from jumping ahead
    const totalScore = matchScore > 0
      ? matchScore + depthBonus + sectionBonus
      : 0;

    pageScores.set(pageUrl, totalScore);
  }

  // Sort page groups by score (descending), preserving original order for ties
  const sortedPageUrls = [...pageGroups.keys()].sort((a, b) => {
    const scoreA = pageScores.get(a) ?? 0;
    const scoreB = pageScores.get(b) ?? 0;
    return scoreB - scoreA;
  });

  // Flatten back to results array, maintaining order within each page group
  const reRanked: SortedResult[] = [];
  for (const pageUrl of sortedPageUrls) {
    reRanked.push(...pageGroups.get(pageUrl)!);
  }

  return reRanked;
}

export async function GET(request: NextRequest): Promise<Response> {
  const response = await searchAPI.GET(request);

  // Parse the response to apply re-ranking
  const data = await response.json();

  // Extract query from URL search params
  const query = request.nextUrl.searchParams.get('query') ?? '';

  if (query && Array.isArray(data)) {
    const reRanked = reRankResults(data, query);
    return Response.json(reRanked);
  }

  return Response.json(data);
}
