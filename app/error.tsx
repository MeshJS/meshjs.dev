'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-fd-foreground mb-4">Oops!</h1>
      <h2 className="text-2xl font-semibold text-fd-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-fd-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Please try again or return to the
        homepage.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-fd-border rounded-lg font-medium hover:bg-fd-accent transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
