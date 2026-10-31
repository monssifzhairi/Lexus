"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 * Registering more than once is harmless, but keeping it here means every
 * component imports the same, already-configured instance.
 */
let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger };

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Reactive `prefers-reduced-motion` hook (SSR-safe, defaults to `false`). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Reactive media query hook with a safe server fallback. */
export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * Runs a GSAP setup inside a gsap.matchMedia scope so every tween and
 * ScrollTrigger created within it is reverted automatically on cleanup and on
 * breakpoint changes. No orphaned ScrollTriggers, no leaked tweens.
 */
export function useGsapScene(
  setup: (context: { reduced: boolean }) => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: `(prefers-reduced-motion: no-preference)`,
        reduced: REDUCED_MOTION_QUERY,
      },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        setup({ reduced });
      }
    );
    // Refresh after layout/fonts settle so trigger positions are accurate.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.status !== "loaded") {
      document.fonts?.ready.then(refresh).catch(() => undefined);
    }
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
