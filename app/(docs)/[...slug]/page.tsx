import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { sectionTitle } from '@/lib/sections';

const BASE_URL = 'https://meshjs.dev';

function generateBreadcrumbSchema(url: string, title: string) {
  const segments = url.split('/').filter(Boolean);
  let path = '';

  const trail = [{ name: 'Home', item: BASE_URL }];
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    trail.push({
      name: i === segments.length - 1 ? title : sectionTitle(segment),
      item: `${BASE_URL}${path}`,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

function generateArticleSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    url: `https://meshjs.dev${url}`,
    author: {
      '@type': 'Organization',
      name: 'MeshJS',
      url: 'https://meshjs.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MeshJS',
      logo: {
        '@type': 'ImageObject',
        url: 'https://meshjs.dev/logo-mesh/mesh.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://meshjs.dev${url}`,
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const markdownUrl = `/llms.mdx${page.url}`;

  // Emitted for every documentation page. This was previously gated to
  // /guides, leaving the API, React, provider and resource pages — the
  // large majority of the site — with no article schema at all.
  const pageSchema = [
    generateArticleSchema(page.data.title, page.data.description || '', page.url),
    generateBreadcrumbSchema(page.url, page.data.title),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="!mb-2">
          {page.data.description}
        </DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <LLMCopyButton markdownUrl={markdownUrl} />
          <ViewOptions
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/MeshJS/mimir/tree/main/apps/docs/content/docs/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDXContent
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const image = ['/docs-og', ...slug, 'image.png'].join('/');
  return {
    metadataBase: new URL("https://meshjs.dev"),
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `https://meshjs.dev${page.url}`,
    },
    openGraph: {
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      images: image,
    },
  };
}