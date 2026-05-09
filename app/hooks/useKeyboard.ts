'use client';

import { useEffect, useCallback, RefObject } from 'react';

interface UseKeyboardOptions {
  onSlash?: () => void;
  onEscape?: () => void;
  searchRef?: RefObject<HTMLInputElement | null>;
}

export function useKeyboard({ onSlash, onEscape, searchRef }: UseKeyboardOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === '/') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          onSlash?.();
          searchRef?.current?.focus();
        }
      }

      if (event.key === 'Escape') {
        onEscape?.();
        searchRef?.current?.blur();
      }
    },
    [onSlash, onEscape, searchRef]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
