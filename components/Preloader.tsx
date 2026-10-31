"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { useIntro } from "@/components/IntroProvider";
import { jetbrains } from "@/app/fonts";

const WORD = ["N", "O", "I", "R"];

/**
 * Cinematic intro: counter, masked wordmark reveal, then a hard curtain lift
 * that hands over to the hero timeline.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const { markRevealed, markFinished } = useIntro();
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const finish = () => {
      setRemoved(true);
      markFinished();
      ScrollTrigger.refresh();
      document.documentElement.style.removeProperty("overflow");
    };

    if (reduced) {
      markRevealed();
      finish();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const letters = root.querySelectorAll<HTMLElement>("[data-letter]");
    const meta = root.querySelectorAll<HTMLElement>("[data-fade]");
    const rules = root.querySelectorAll<HTMLElement>("[data-rule]");
    const counter = { value: 0 };

    const setCounter = () => {
      if (counterRef.current) {
        counterRef.current.textContent = String(
          Math.round(counter.value)
        ).padStart(3, "0");
      }
    };

    const ctx = gsap.context(() => {
      gsap.set(letters, { yPercent: 118 });
      gsap.set(meta, { opacity: 0, y: 10 });
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ onComplete: finish });

      tl.to(letters, {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.075,
        ease: "expo.out",
      })
        .to(rules, { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, 0.25)
        .to(meta, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.55)
        .to(
          counter,
          {
            value: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: setCounter,
          },
          0.15
        )
        .call(markRevealed, undefined, 2.05)
        .to(meta, { opacity: 0, duration: 0.35, ease: "power2.in" }, 2.0)
        .to(
          letters,
          { yPercent: -118, duration: 0.75, stagger: 0.05, ease: "expo.inOut" },
          2.05
        )
        .to(rules, { scaleX: 0, duration: 0.5, ease: "power3.inOut" }, 2.05)
        .to(
          root,
          { yPercent: -100, duration: 1.15, ease: "expo.inOut" },
          2.25
        );
    }, root);

    return () => {
      ctx.revert();
      document.documentElement.style.removeProperty("overflow");
    };
    // markRevealed / markFinished are stable useCallback references
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (removed) return null;

  return (
    <div
      ref={rootRef}
      data-preloader
      aria-hidden="true"
      className="fixed inset-0 z-[120] flex flex-col justify-between bg-void px-5 py-6 md:px-10 md:py-8"
    >
      <div className="flex items-start justify-between">
        <span
          data-fade
          className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.5em] text-ash`}
        >
          Maison Noir
        </span>
        <span
          data-fade
          className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.5em] text-ash`}
        >
          MMXXVI
        </span>
      </div>

      <div className="relative">
        <div className="flex flex-col items-center">
          <div className="flex overflow-hidden leading-[0.8]">
            {WORD.map((letter) => (
              <span key={letter} className="block overflow-hidden">
                <span
                  data-letter
                  className="display block text-[clamp(4.5rem,17vw,13rem)] text-silver-gradient"
                >
                  {letter}
                </span>
              </span>
            ))}
          </div>
          <div
            data-rule
            className="mt-6 h-px w-[min(38rem,72vw)] bg-hairline"
          />
          <span
            data-fade
            className={`${jetbrains.className} mt-6 text-[0.5rem] uppercase tracking-[0.62em] text-ash`}
          >
            Beyond Luxury
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span
          data-fade
          className={`${jetbrains.className} hidden text-[0.5rem] uppercase leading-relaxed tracking-[0.34em] text-ash sm:block`}
        >
          Atelier
          <br />
          Modena — Italia
        </span>
        <div className="flex items-baseline gap-3">
          <span
            ref={counterRef}
            className={`${jetbrains.className} text-[0.75rem] tabular-nums tracking-[0.3em] text-bone`}
          >
            000
          </span>
          <span
            className={`${jetbrains.className} text-[0.5rem] tracking-[0.34em] text-ash`}
          >
            / 100
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-crimson/60"
      />
    </div>
  );
}
