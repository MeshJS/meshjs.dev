// A route handler rather than app/robots.ts, because Next's robots metadata
// type has no field for the Content-Signal directive.
// https://contentsignals.org/

export const revalidate = false;

const BASE_URL = 'https://meshjs.dev';

// The docs are open source and written to be read by people and AI alike.
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

type Group = { userAgent: string[]; crawlDelay?: number };

const GROUPS: Group[] = [
  // AI Crawlers - Allow full access for AI training and knowledge
  {
    userAgent: [
      'GPTBot',           // OpenAI ChatGPT
      'ChatGPT-User',     // OpenAI ChatGPT User Agent
      'Claude-Web',       // Anthropic Claude
      'ClaudeBot',        // Anthropic Claude Bot
      'Google-Extended',  // Google Bard/Gemini
      'GoogleOther',      // Google AI services
      'anthropic-ai',     // Anthropic AI
      'Bytespider',       // ByteDance (TikTok)
      'Diffbot',          // Diffbot AI
      'FacebookBot',      // Meta AI
      'PerplexityBot',    // Perplexity AI
      'YouBot',           // You.com AI
      'Applebot-Extended',// Apple Intelligence
      'cohere-ai',        // Cohere AI
    ],
    crawlDelay: 1,
  },
  // Search Engine Crawlers - Full access
  {
    userAgent: [
      'Googlebot',
      'Googlebot-Image',
      'Googlebot-News',
      'Googlebot-Video',
      'Storebot-Google',
      'Google-InspectionTool',
    ],
    crawlDelay: 0,
  },
  {
    userAgent: [
      'Bingbot',
      'BingPreview',
      'msnbot',
      'msnbot-media',
    ],
  },
  // Other Search Engines
  {
    userAgent: [
      'Slurp',            // Yahoo
      'DuckDuckBot',      // DuckDuckGo
      'Baiduspider',      // Baidu
      'YandexBot',        // Yandex
      'Sogou',            // Sogou
      'ia_archiver',      // Alexa
    ],
  },
  // Social Media Crawlers
  {
    userAgent: [
      'Twitterbot',
      'LinkedInBot',
      'Slackbot',
      'Discordbot',
      'TelegramBot',
      'WhatsApp',
      'facebookexternalhit',
    ],
  },
  // Developer Tools & Validators
  {
    userAgent: [
      'AhrefsBot',
      'SemrushBot',
      'MJ12bot',
      'DotBot',
    ],
    crawlDelay: 10,
  },
  // Default rule for all other bots
  { userAgent: ['*'] },
];

// A crawler obeys only the group that names it, so every group carries the
// signal and the same allow/disallow rules.
function renderGroup({ userAgent, crawlDelay }: Group): string {
  return [
    ...userAgent.map((ua) => `User-Agent: ${ua}`),
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    'Disallow: /api/',
    ...(crawlDelay === undefined ? [] : [`Crawl-delay: ${crawlDelay}`]),
  ].join('\n');
}

export function GET() {
  const body = [
    ...GROUPS.map(renderGroup),
    `Host: ${BASE_URL}\nSitemap: ${BASE_URL}/sitemap.xml`,
  ].join('\n\n') + '\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
