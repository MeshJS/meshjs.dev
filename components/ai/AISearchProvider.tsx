'use client';

import { createContext, useState, type ReactNode, useMemo } from 'react';

/**
 * Lightweight context that only manages open/close state.
 * No AI SDK imports - those are deferred to when the panel actually opens.
 */
export const AISearchContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

/**
 * Minimal provider that loads instantly on every page.
 * The heavy AI infrastructure (useChat, AI SDK) is lazy-loaded in AISearchLazy.tsx
 */
export function AISearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <AISearchContext value={value}>
      {children}
    </AISearchContext>
  );
}
