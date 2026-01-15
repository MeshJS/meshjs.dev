'use client';

import { use, useEffect, lazy, Suspense, type ComponentProps } from 'react';
import { AISearchContext, AISearchProvider } from './AISearchProvider';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { MessageCircleIcon } from 'lucide-react';

// TRUE lazy load - only loads when panel opens (includes useChat, AI SDK, markdown processing)
const AISearchPanelContent = lazy(() =>
  import('./searchAI').then((mod) => ({ default: mod.AISearchPanelContent }))
);

/**
 * Lazy-loaded AI Search Panel wrapper.
 * - Keyboard shortcuts (Cmd+/, Escape) work immediately
 * - Heavy panel content (useChat, AI SDK, markdown) loads only when opened
 */
function AISearchPanel({ className }: { className?: string }) {
  const ctx = use(AISearchContext);
  if (!ctx) throw new Error('AISearchPanel must be used within AISearchProvider');

  const { open, setOpen } = ctx;

  // Register keyboard shortcuts immediately (before panel loads)
  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        e.preventDefault();
      }
      if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
        setOpen(true);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyPress);
    return () => window.removeEventListener('keydown', onKeyPress);
  }, [open, setOpen]);

  // Don't render anything until panel is open - this is the key optimization
  if (!open) return null;

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <AISearchPanelContent className={className} />
    </Suspense>
  );
}

/**
 * Minimal loading state while AI panel loads
 */
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-30 bg-fd-overlay/50 backdrop-blur-xs flex items-center justify-center">
      <div className="animate-pulse text-fd-muted-foreground">Loading AI...</div>
    </div>
  );
}

/**
 * Trigger button for opening AI search.
 * Uses lightweight context - no AI SDK dependency.
 */
function AISearchTrigger({ className, children, ...props }: ComponentProps<'button'>) {
  const ctx = use(AISearchContext);
  if (!ctx) throw new Error('AISearchTrigger must be used within AISearchProvider');

  const { open, setOpen } = ctx;

  return (
    <button
      className={cn(
        buttonVariants({
          color: 'secondary',
        }),
        'fixed bottom-4 gap-3 end-[calc(theme(spacing.4)+var(--removed-body-scroll-bar-size,0px))] text-fd-muted-foreground rounded-2xl shadow-lg z-20 transition-[translate,opacity]',
        open && 'translate-y-10 opacity-0',
        className
      )}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children || (
        <>
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </>
      )}
    </button>
  );
}

// Re-export provider with AISearch alias for backward compatibility
export { AISearchProvider as AISearch, AISearchPanel, AISearchTrigger };
