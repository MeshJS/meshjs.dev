import { source } from '@/lib/source';

export async function GET() {
  const baseUrl = 'https://meshjs.dev';
  const currentDate = new Date().toUTCString();

  const pages = source.getPages();

  const items = pages
    .map((page) => {
      const title = page.data.title || 'Untitled';
      const description = page.data.description || '';
      const url = `${baseUrl}${page.url}`;

      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${currentDate}</pubDate>
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mesh SDK Documentation</title>
    <link>${baseUrl}</link>
    <description>Open-source TypeScript SDK for Cardano blockchain development. Build dApps faster with React components, wallet integrations, and transaction builders.</description>
    <language>en-US</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
