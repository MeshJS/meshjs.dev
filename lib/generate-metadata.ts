import { Metadata } from 'next';

export function generateMetadata({
  title,
  keywords,
  description,
  image,
}: {
  title?: string;
  keywords?: string;
  description?: string;
  image?: string;
}): Metadata {
  if (description === undefined) {
    description =
      "Intuitive and easy-to-use Web3 development framework to build amazing applications on Cardano.";
  }

  if (keywords === undefined) {
    keywords =
      "developer, tools, cardano, bitcoin, hydra, blockchain, sdk, plutus, crypto, web3, metaverse, gaming, ecommerce, nfts, apis, aiken";
  }

  if (title === undefined) {
    title = "Web3 TypeScript SDK & Off-Chain Framework";
  }

  const formattedTitle = `${title} - Mesh JS`;
  const ogImageUrl = image 
    ? `${image}`
    : `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title: formattedTitle,
    description,
    keywords: keywords.split(',').map(keyword => keyword.trim()),
    openGraph: {
      title: formattedTitle,
      description,
      siteName: title,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@meshsdk',
      creator: '@meshsdk',
      title: formattedTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          alt: title,
        },
      ],
    },
    icons: {
      icon: '/favicon/favicon-32x32.png',
      shortcut: '/favicon/favicon-16x16.png',
      apple: '/favicon/apple-touch-icon.png',
      other: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          url: '/favicon/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/favicon/favicon-16x16.png',
        },
        {
          rel: 'mask-icon',
          url: '/favicon/safari-pinned-tab.svg',
          color: '#333333',
        },
      ],
    },
    manifest: '/site.webmanifest',
    themeColor: '#eeeeee',
    metadataBase: new URL('https://meshjs.dev'),
  };
}
