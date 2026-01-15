import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-fd-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-fd-foreground mb-2">
        Page Not Found
      </h2>
      <p className="text-fd-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
        <Link
          href="/guides"
          className="px-6 py-3 border border-fd-border rounded-lg font-medium hover:bg-fd-accent transition-colors"
        >
          Browse Guides
        </Link>
      </div>
    </div>
  );
}
