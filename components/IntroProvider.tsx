"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type IntroContextValue = {
  /** True once the intro curtain has started lifting (hero may animate). */
  revealed: boolean;
  /** True once the curtain is fully gone. */
  finished: boolean;
  markRevealed: () => void;
  markFinished: () => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const markRevealed = useCallback(() => setRevealed(true), []);
  const markFinished = useCallback(() => setFinished(true), []);

  // Fallback: never let a failed animation strand the page behind the curtain.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setRevealed(true);
      setFinished(true);
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);

  const value = useMemo(
    () => ({ revealed, finished, markRevealed, markFinished }),
    [revealed, finished, markRevealed, markFinished]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro(): IntroContextValue {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used inside <IntroProvider>");
  }
  return ctx;
}
