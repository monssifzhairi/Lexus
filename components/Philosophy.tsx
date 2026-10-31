"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGsapScene } from "@/lib/gsap";
import { SectionMeta } from "@/components/ui/SectionMeta";
import { principles } from "@/lib/data";
import { jetbrains, cormorant } from "@/app/fonts";

const MARQUEE = [
  "Power",
  "Precision",
  "Restraint",
  "Proportion",
  "Silence",
  "Intent",
];

export function Philosophy() {
  const rootRef = useRef<HTMLElement>(null);

  useGsapScene(({ reduced }) => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const lines = gsap.utils.toArray<HTMLElement>("[data-phil-line]", root);
    gsap.set(lines, { yPercent: 115 });

    gsap.to(lines, {
      yPercent: 0,
      duration: 1.4,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-phil-statement]"),
        start: "top 82%",
        once: true,
      },
    });

    gsap.from(root.querySelectorAll("[data-phil-fade]"), {
      opacity: 0,
      y: 26,
      duration: 1.2,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-phil-statement]"),
        start: "top 78%",
        once: true,
      },
    });

    gsap.fromTo(
      root.querySelector("[data-phil-image]"),
      { clipPath: "inset(14% 8% 14% 8%)", scale: 1.16 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root.querySelector("[data-phil-figure]"),
          start: "top 88%",
          once: true,
        },
      }
    );

    /* Parallax inside the frame */
    gsap.to(root.querySelector("[data-phil-parallax]"), {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: root.querySelector("[data-phil-figure]"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.from(root.querySelectorAll("[data-principle]"), {
      opacity: 0,
      y: 34,
      duration: 1.1,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-principles]"),
        start: "top 88%",
        once: true,
      },
    });

    gsap.from(root.querySelectorAll("[data-section-rule]"), {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.4,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: root,
        start: "top 90%",
        once: true,
      },
    });
  }, []);

  return (
    <section
      ref={rootRef}
      id="philosophy"
      className="relative overflow-hidden bg-void pb-24 pt-20 md:pb-36 md:pt-28"
      aria-labelledby="philosophy-title"
    >
      <div className="shell">
        <SectionMeta index="02" label="Philosophy" right="Est. MMXXVI — Modena" />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-20">
          <div data-phil-statement>
            <h2
              id="philosophy-title"
              className="display text-[clamp(2.5rem,7.4vw,6.5rem)] leading-[0.9] text-bone"
            >
              <span className="mask-line">
                <span data-phil-line className="text-silver-gradient">
                  Luxury is not
                </span>
              </span>
              <span className="mask-line">
                <span data-phil-line className="text-silver-gradient">
                  what we add.
                </span>
              </span>
              <span className="mask-line mt-2 md:mt-4">
                <span
                  data-phil-line
                  className={`${cormorant.className} serif-accent block text-[clamp(2.6rem,8vw,7.2rem)] leading-[0.86] text-silver/85`}
                >
                  It is what we refuse.
                </span>
              </span>
            </h2>
          </div>

          <div
            data-phil-fade
            className="flex flex-col justify-end gap-6 lg:pb-3"
          >
            <div className="spec-rule" />
            <p className="max-w-md text-pretty text-[0.9375rem] leading-[1.75] text-ash">
              NOIR was founded on a single conviction: that true luxury is
              subtractive. Every panel, every seam, every gram is interrogated
              until only the essential remains — and the essential is
              extraordinary.
            </p>
            <p
              className={`${jetbrains.className} text-[0.5625rem] uppercase leading-relaxed tracking-[0.28em] text-ash/70`}
            >
              One atelier. Three commissions.
              <br />
              Twelve engineers. No shortcuts.
            </p>
          </div>
        </div>

        {/* Full-bleed architectural frame */}
        <figure
          data-phil-figure
          className="relative mt-16 md:mt-24"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/10] md:aspect-[16/8]">
            <div
              data-phil-image
              className="absolute inset-0 will-change-transform"
            >
              <div data-phil-parallax className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src="/images/philosophy-side.jpg"
                  alt="NOIR hypercar in strict side profile inside a monumental dark hall with concrete columns"
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.85),transparent_46%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.55),transparent_30%)]" />
          </div>

          <figcaption className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <span
              className={`${jetbrains.className} max-w-[22rem] text-[0.5625rem] uppercase leading-relaxed tracking-[0.26em] text-ash`}
            >
              Fig. 01 — Vanta, side elevation.
              <br />
              Atelier Modena, north gallery.
            </span>
            <span
              className={`${cormorant.className} text-[1.125rem] italic text-silver/70 sm:text-right`}
            >
              “Stillness is a form of speed.”
            </span>
          </figcaption>
        </figure>

        {/* Principles */}
        <div data-principles className="mt-20 md:mt-28">
          <div className="grid gap-px bg-hairline-soft md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.index}
                data-principle
                className="group relative bg-void p-6 transition-colors duration-500 hover:bg-carbon md:p-8"
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={`${jetbrains.className} text-[0.5625rem] tracking-[0.28em] text-crimson`}
                  >
                    {principle.index}
                  </span>
                  <span className="h-px w-8 bg-white/15 transition-all duration-700 group-hover:w-14 group-hover:bg-white/40" />
                </div>
                <h3 className="display mt-8 text-[1.5rem] text-bone md:mt-12 md:text-[1.75rem]">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-xs text-pretty text-[0.875rem] leading-[1.7] text-ash">
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial marquee ribbon */}
      <div
        className="relative mt-20 flex overflow-hidden border-y border-hairline-soft py-5 md:mt-28 md:py-6"
        aria-hidden="true"
      >
        <div className="marquee-track items-center gap-10 pr-10 md:gap-16 md:pr-16">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex items-center gap-10 md:gap-16"
            >
              {MARQUEE.map((word) => (
                <span
                  key={`${copy}-${word}`}
                  className="display flex items-center gap-10 whitespace-nowrap text-[1.5rem] text-transparent md:gap-16 md:text-[2rem]"
                  style={{ WebkitTextStroke: "1px rgba(191,194,199,0.28)" }}
                >
                  {word}
                  <span className="h-1 w-1 rounded-full bg-crimson/80" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
