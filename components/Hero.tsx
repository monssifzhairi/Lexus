"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/components/IntroProvider";
import { scrollToId } from "@/lib/client";
import { jetbrains, cormorant } from "@/app/fonts";

const META = [
  { label: "Chassis", value: "Carbon Monocoque" },
  { label: "Output", value: "1,000 HP" },
  { label: "Series", value: "One — MMXXVI" },
];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const { revealed } = useIntro();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      const rules = gsap.utils.toArray<HTMLElement>("[data-hero-rule]");
      const media = root.querySelector<HTMLElement>("[data-hero-media]");
      const mediaAlt = root.querySelector<HTMLElement>("[data-hero-media-alt]");

      gsap.set(lines, { yPercent: 112 });
      gsap.set(fades, { opacity: 0, y: 22 });
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
      if (media) gsap.set(media, { scale: 1.14, opacity: 0 });
      if (mediaAlt) gsap.set(mediaAlt, { scale: 1.08, opacity: 0 });

      if (!revealed) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(fades[0], { opacity: 1, y: 0, duration: 1.2 }, 0)
        .to(
          lines,
          { yPercent: 0, duration: 1.5, stagger: 0.13, ease: "expo.out" },
          0.12
        )
        .to(rules, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.35)
        .to(
          fades.slice(1),
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 },
          0.62
        )
        .to(
          [media, mediaAlt].filter(Boolean),
          { scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" },
          0
        );

      /* Scroll choreography: slow parallax + content drift on exit */
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.to(media, {
            yPercent: 9,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(root.querySelector("[data-hero-content]"), {
            y: -70,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [revealed]);

  return (
    <section
      id="top"
      ref={rootRef}
      aria-label="NOIR — Power without compromise"
      className="grain relative isolate w-full overflow-hidden bg-void"
    >
      {/* Desktop cinematic backdrop */}
      <div className="absolute inset-0 hidden md:block" aria-hidden="true">
        <div
          data-hero-media
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/hero-car.jpg"
            alt="NOIR hypercar in obsidian black, lit by silver studio light with crimson reflections"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_50%]"
          />
        </div>
        {/* Left reading scrim */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#050505_1%,rgba(5,5,5,0.93)_24%,rgba(5,5,5,0.5)_44%,rgba(5,5,5,0.04)_62%,rgba(5,5,5,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#050505_1%,rgba(5,5,5,0.55)_18%,transparent_44%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_74%_48%,transparent_38%,rgba(5,5,5,0.6)_86%)]" />
        {/* Tablet-only scrim: keeps the outline + secondary CTA readable over the car */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.5)_40%,rgba(5,5,5,0.06)_66%,transparent_100%)] md:block lg:hidden" />
        <div className="absolute right-[6%] top-[16%] hidden h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(181,18,36,0.16),transparent_62%)] blur-2xl mix-blend-screen lg:block" />
      </div>

      {/* Mobile scrim */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.92),rgba(5,5,5,0.62)_46%,#050505_92%)] md:hidden"
        aria-hidden="true"
      />

      <div className="shell relative flex min-h-[100svh] flex-col pb-5 pt-[5.25rem] md:pb-8 md:pt-[6.5rem]">
        <div
          data-hero-content
          className="flex flex-1 flex-col justify-center py-8 md:py-4"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div>
              <div
                data-hero-fade
                className={`${jetbrains.className} flex items-center gap-3 text-[0.5rem] uppercase tracking-[0.4em] text-ash`}
              >
                <span className="red-dot" aria-hidden="true" />
                <span>Series One</span>
                <span className="h-px w-8 bg-white/25" aria-hidden="true" />
                <span className="text-silver">2026</span>
              </div>

              <h1 className="display mt-7 text-[clamp(2.9rem,12.6vw,4.6rem)] leading-[0.86] text-bone md:mt-9 md:text-[clamp(4.2rem,6.9vw,7.6rem)]">
                <span className="mask-line">
                  <span data-hero-line className="text-silver-gradient">
                    Power.
                  </span>
                </span>
                <span className="mask-line">
                  <span
                    data-hero-line
                    className="text-transparent"
                    style={{ WebkitTextStroke: "1px rgba(191,194,199,0.42)" }}
                  >
                    Without
                  </span>
                </span>
                <span className="mask-line">
                  <span data-hero-line className="text-silver-gradient">
                    Compromise.
                  </span>
                </span>
              </h1>

              <div
                data-hero-rule
                className="mt-7 h-px w-full max-w-[26rem] bg-hairline md:mt-9"
              />

              <p
                data-hero-fade
                className="mt-6 max-w-[24rem] text-pretty text-[0.9375rem] leading-relaxed text-ash md:mt-7 md:text-[1.0625rem]"
              >
                An uncompromising expression of automotive excellence.
                <span className={`${cormorant.className} mt-2 block text-[1.125rem] italic text-silver/80`}>
                  Engineered in silence. Built for the extraordinary.
                </span>
              </p>

              <div
                data-hero-fade
                className="mt-8 flex flex-col gap-2.5 xs:flex-row xs:items-center xs:gap-3 md:mt-10"
              >
                <a href="#studio" onClick={(e) => { e.preventDefault(); scrollToId("studio"); }} className="btn-primary group">
                  Explore the machine
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>
                <a href="#philosophy" onClick={(e) => { e.preventDefault(); scrollToId("philosophy"); }} className="btn-ghost">
                  Discover NOIR
                </a>
              </div>
            </div>

            {/* Small technical metadata, desktop */}
            <div
              data-hero-fade
              className="relative hidden lg:flex lg:flex-col lg:gap-4 lg:rounded-sm lg:border lg:border-hairline-soft lg:bg-[#050505]/78 lg:p-4 lg:pb-5"
            >
              <div className="spec-rule" />
              {META.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-4">
                  <span className={`${jetbrains.className} data-label`}>
                    {item.label}
                  </span>
                  <span className={`${jetbrains.className} text-[0.5625rem] uppercase tracking-[0.2em] text-silver`}>
                    {item.value}
                  </span>
                </div>
              ))}
              <div className="spec-rule" />
              <span className={`${jetbrains.className} text-[0.5rem] uppercase leading-relaxed tracking-[0.28em] text-ash/70`}>
                44.6471° N — 10.9252° E
                <br />
                Atelier Modena
              </span>
            </div>
          </div>
        </div>

        {/* Mobile vehicle band — keeps the car prominent without cropping the type */}
        <div
          className="relative -mx-5 mt-2 md:hidden"
          aria-hidden="true"
        >
          <div data-hero-media-alt className="relative aspect-[5/3.2] w-full">
            <Image
              src="/images/hero-car.jpg"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[54%_64%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#050505_0%,transparent_22%,transparent_80%,#050505_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#050505_0%,transparent_26%,transparent_74%,#050505_100%)]" />
          </div>
        </div>

        {/* Baseline row: scroll cue + metadata */}
        <div className="mt-4 flex items-end justify-between gap-6 md:mt-0">
          <a
            href="#philosophy"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("philosophy");
            }}
            className="group flex items-center gap-3 py-3"
          >
            <span
              className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.4em] text-ash transition-colors group-hover:text-bone`}
            >
              Scroll
            </span>
            <span className="relative block h-10 w-px overflow-hidden bg-white/15" aria-hidden="true">
              <span
                data-scroll-cue
                className="absolute left-0 top-0 block h-3 w-px bg-silver"
              />
            </span>
            <ArrowDown
              size={12}
              strokeWidth={1.2}
              className="text-ash transition-transform duration-500 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </a>

          <div className="flex items-end gap-6">
            <p className={`${jetbrains.className} hidden text-right text-[0.5rem] uppercase leading-relaxed tracking-[0.28em] text-ash/70 sm:block`}>
              A fictional concept study
              <br />
              Not a production vehicle
            </p>
            <span className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.34em] text-ash`}>
              N—01
            </span>
          </div>
        </div>
      </div>

      {/* Vertical edge annotation */}
      <span
        className={`${jetbrains.className} pointer-events-none absolute bottom-24 right-6 hidden origin-right rotate-180 text-[0.5rem] uppercase tracking-[0.5em] text-ash/50 [writing-mode:vertical-rl] xl:block`}
        aria-hidden="true"
      >
        Beyond Luxury — Maison Noir
      </span>
    </section>
  );
}
