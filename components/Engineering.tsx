"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGsapScene } from "@/lib/gsap";
import { SectionMeta } from "@/components/ui/SectionMeta";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { performanceSpecs } from "@/lib/data";
import { jetbrains, cormorant } from "@/app/fonts";

const DOSSIER = [
  { label: "Architecture", value: "Mid-engine · carbon monocoque" },
  { label: "Aerodynamics", value: "1,180 kg downforce at 250 km/h" },
  { label: "Transmission", value: "8-speed dual-clutch" },
  { label: "Braking", value: "Carbon-ceramic · 410 mm" },
  { label: "Dry mass", value: "1,356 kg" },
  { label: "Hybrid", value: "48 V torque fill · e-diff" },
];

export function Engineering() {
  const rootRef = useRef<HTMLElement>(null);

  useGsapScene(({ reduced }) => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const lines = gsap.utils.toArray<HTMLElement>("[data-eng-line]", root);
    gsap.set(lines, { yPercent: 112 });

    gsap.to(lines, {
      yPercent: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-eng-head]"),
        start: "top 84%",
        once: true,
      },
    });

    gsap.from(root.querySelectorAll("[data-eng-fade]"), {
      opacity: 0,
      y: 24,
      duration: 1.1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-eng-head]"),
        start: "top 80%",
        once: true,
      },
    });

    /* Slow image scale as the figure enters */
    gsap.fromTo(
      root.querySelector("[data-eng-figure]"),
      { scale: 1.14 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector("[data-eng-scene]"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    /* Parallax on the macro detail */
    gsap.to(root.querySelector("[data-eng-macro]"), {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: root.querySelector("[data-eng-macro-frame]"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    root
      .querySelectorAll<HTMLElement>("[data-dossier-row]")
      .forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 18,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 94%", once: true },
        });
      });
  }, []);

  return (
    <section
      ref={rootRef}
      id="engineering"
      aria-labelledby="engineering-title"
      className="relative overflow-hidden bg-carbon pt-20 md:pt-32"
    >
      <div className="shell">
        <SectionMeta index="03" label="Engineering" right="Fig. 02 — Aerodynamics" />

        <div
          data-eng-head
          className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end"
        >
          <h2
            id="engineering-title"
            className="display text-[clamp(2.35rem,7vw,6.75rem)] leading-[0.88] text-bone lg:col-span-8"
          >
            <span className="mask-line">
              <span data-eng-line className="text-silver-gradient">
                Engineered
              </span>
            </span>
            <span className="mask-line">
              <span data-eng-line className="text-silver-gradient">
                to be{" "}
                <span className={`${cormorant.className} serif-accent text-[1.02em] text-bone/90`}>
                  unforgettable
                </span>
                .
              </span>
            </span>
          </h2>

          <div data-eng-fade className="lg:col-span-4 lg:pb-3">
            <div className="spec-rule" />
            <p className="mt-5 max-w-sm text-pretty text-[0.9375rem] leading-[1.75] text-ash">
              A hybrid V12, a chassis milled to the gram, and aerodynamics
              shaped over four thousand hours of simulation. Every figure below
              is a promise — not a compromise.
            </p>
            <p
              className={`${jetbrains.className} mt-5 text-[0.5625rem] uppercase leading-relaxed tracking-[0.26em] text-ash/70`}
            >
              Concept study figures.
              <br />
              Not verified production specifications.
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed rear scene with specification overlay */}
      <div
        data-eng-scene
        className="relative mt-14 md:mt-20"
      >
        <div className="relative h-[64vh] min-h-[26rem] w-full overflow-hidden md:h-[78vh]">
          <div data-eng-figure className="absolute inset-0 will-change-transform">
            <Image
              src="/images/engineering-rear.jpg"
              alt="Rear three-quarter view of a black NOIR hypercar with a glowing crimson light bar in an industrial hall"
              fill
              sizes="100vw"
              className="object-cover object-[62%_center]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#0A0A0A_2%,rgba(10,10,10,0.82)_26%,rgba(10,10,10,0.12)_62%,rgba(10,10,10,0.45)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,5,0.72),transparent_45%)]" />

          <div className="shell absolute inset-x-0 bottom-0 pb-6 md:pb-9">
            <div className="mb-6 flex items-end justify-between gap-6">
              <span
                className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-ash`}
              >
                Fig. 02 / Rear diffuser — carbon weave
              </span>
              <span className={`${cormorant.className} hidden text-[1.125rem] italic text-silver/70 sm:block`}>
                Form follows force.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-px bg-hairline-soft sm:grid-cols-3">
              {performanceSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="group relative bg-void/55 px-4 py-5 backdrop-blur-[2px] transition-colors duration-500 hover:bg-void/80 sm:px-6 sm:py-7"
                >
                  <div className="flex items-center justify-between">
                    <span className={`${jetbrains.className} data-label`}>
                      {spec.label}
                    </span>
                    <span
                      className={`${jetbrains.className} text-[0.5rem] tracking-[0.24em] text-crimson`}
                    >
                      {spec.index}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <AnimatedNumber
                      value={spec.value}
                      decimals={spec.decimals ?? 0}
                      className="display text-[clamp(2.1rem,4.4vw,4rem)] tabular-nums text-bone"
                    />
                    <span
                      className={`${jetbrains.className} text-[0.5625rem] uppercase tracking-[0.26em] text-ash`}
                    >
                      {spec.unit}
                    </span>
                  </div>
                  <div className="mt-4 h-px w-full origin-left bg-white/10 transition-colors duration-500 group-hover:bg-crimson/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail + dossier */}
      <div className="shell grid items-start gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <figure
          data-eng-macro-frame
          className="relative lg:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <div data-eng-macro className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src="/images/detail-macro.jpg"
                alt="Macro detail of a glossy black NOIR fender, carbon splitter and a crimson LED light blade"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.6),transparent_55%)]" />
          </div>
          <figcaption className="mt-4 flex items-start justify-between gap-4">
            <span
              className={`${jetbrains.className} text-[0.5rem] uppercase leading-relaxed tracking-[0.28em] text-ash`}
            >
              Detail 07 — Headlight blade.
              <br />
              Hand-finished titanium inlay.
            </span>
            <span
              className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.28em] text-ash/60`}
            >
              1:1
            </span>
          </figcaption>
        </figure>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="display text-[clamp(1.6rem,3vw,2.6rem)] text-bone">
            The dossier.
          </h3>
          <dl className="mt-8">
            {DOSSIER.map((row, i) => (
              <div
                key={row.label}
                data-dossier-row
                className="group flex items-baseline justify-between gap-6 border-t border-hairline-soft py-4 md:py-5"
              >
                <dt className="flex items-baseline gap-4">
                  <span
                    className={`${jetbrains.className} text-[0.5rem] tracking-[0.24em] text-ash/60`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`${jetbrains.className} text-[0.5625rem] uppercase tracking-[0.26em] text-ash transition-colors duration-300 group-hover:text-bone`}
                  >
                    {row.label}
                  </span>
                </dt>
                <dd className="text-right text-[0.875rem] text-silver transition-colors duration-300 group-hover:text-bone">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-center gap-3">
            <span className="red-dot" aria-hidden="true" />
            <p
              className={`${jetbrains.className} text-[0.5rem] uppercase leading-relaxed tracking-[0.26em] text-ash/70`}
            >
              Figures represent the N—01 concept platform, MMXXVI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
