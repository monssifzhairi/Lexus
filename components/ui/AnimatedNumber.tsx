"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  value: number;
  decimals?: number;
  className?: string;
  /** Slight delay before counting, in seconds. */
  delay?: number;
};

/**
 * Counts up once when scrolled into view. Under reduced motion the final
 * value renders immediately, so the figure is never lost.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  className = "",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) =>
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = format(value);
      return;
    }

    const state = { n: 0 };
    el.textContent = format(0);
    const ctx = gsap.context(() => {
      gsap.to(state, {
        n: value,
        duration: 1.9,
        delay,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(state.n);
        },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
    return () => ctx.revert();
  }, [value, decimals, delay]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
