"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGsapScene } from "@/lib/gsap";
import { SectionMeta } from "@/components/ui/SectionMeta";
import { VehicleDrawer } from "@/components/VehicleDrawer";
import { vehicles } from "@/lib/data";
import { jetbrains, cormorant } from "@/app/fonts";

const CARD_LAYOUT = [
  {
    wrapper: "col-span-12 lg:col-span-7",
    aspect: "aspect-[4/4.5] sm:aspect-[5/5.2]",
    focus: "object-[50%_74%] sm:object-[50%_68%]",
  },
  {
    wrapper: "col-span-12 lg:col-span-4 lg:col-start-9 lg:mt-[16vh]",
    aspect: "aspect-[4/4.4] sm:aspect-[4/4.4]",
    focus: "object-[50%_60%] sm:object-[50%_58%]",
  },
  {
    wrapper: "col-span-12 lg:col-span-9 lg:col-start-3 lg:mt-[6vh]",
    aspect: "aspect-[4/3.4] sm:aspect-[16/9]",
    focus: "object-[50%_78%] sm:object-[50%_70%]",
  },
];

export function Collection() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGsapScene(({ reduced }) => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const lines = gsap.utils.toArray<HTMLElement>("[data-col-line]", root);
    gsap.set(lines, { yPercent: 112 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-col-head]"),
        start: "top 80%",
        once: true,
      },
    });

    gsap.from(root.querySelectorAll("[data-col-fade]"), {
      opacity: 0,
      y: 24,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root.querySelector("[data-col-head]"),
        start: "top 76%",
        once: true,
      },
    });

    root.querySelectorAll<HTMLElement>("[data-vehicle-card]").forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 56,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 90%", once: true },
      });
      gsap.from(card.querySelector("[data-card-image]"), {
        scale: 1.12,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 92%", once: true },
      });
    });

    gsap.from(root.querySelectorAll("[data-col-rule]"), {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.4,
      stagger: 0.08,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: root.querySelector("[data-col-head]"),
        start: "top 82%",
        once: true,
      },
    });
  }, []);

  return (
    <>
      {/* Dark → light scene transition */}
      <div
        aria-hidden="true"
        className="h-[18vh] w-full bg-[linear-gradient(to_bottom,#050505_0%,#161514_52%,#E9E9E7_100%)] md:h-[24vh]"
      />

      <section
        ref={rootRef}
        id="collection"
        aria-labelledby="collection-title"
        className="relative overflow-hidden bg-[#E9E9E7] pb-24 pt-14 text-[#0A0A0A] md:pb-36 md:pt-20"
      >
        <div className="shell">
          <SectionMeta
            index="05"
            label="The Collection"
            right="Three commissions — MMXXVI"
            tone="light"
          />

          <div
            data-col-head
            className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end"
          >
            <h2
              id="collection-title"
              className="display text-[clamp(3rem,10.5vw,9rem)] leading-[0.84] lg:col-span-8"
            >
              <span className="mask-line">
                <span data-col-line>The</span>
              </span>
              <span className="mask-line">
                <span data-col-line>
                  Collection
                  <span className="text-[#B51224]">.</span>
                </span>
              </span>
            </h2>

            <div data-col-fade className="lg:col-span-4 lg:pb-4">
              <div data-col-rule className="h-px w-full bg-[rgba(10,10,10,0.2)]" />
              <p className="mt-5 max-w-sm text-pretty text-[0.9375rem] leading-[1.8] text-[#4A4A4A]">
                Three commissions, one philosophy. Each NOIR is a distinct
                answer to the same question: how little can be said, and still
                say everything?
              </p>
              <p
                className={`${cormorant.className} mt-4 text-[1.1875rem] italic text-[#0A0A0A]/70`}
              >
                Only three will ever be built.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16 md:mt-20 md:gap-x-8 md:gap-y-24">
            {vehicles.map((vehicle, i) => {
              const layout = CARD_LAYOUT[i];
              return (
                <article
                  key={vehicle.id}
                  data-vehicle-card
                  className={`group relative ${layout.wrapper}`}
                >
                  <div className="relative">
                    <div
                      className={`relative ${layout.aspect} overflow-hidden bg-[#DCDCDA]`}
                    >
                      <Image
                        data-card-image
                        src={vehicle.image}
                        alt={vehicle.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 60vw, 92vw"
                        className={`object-cover ${layout.focus} will-change-transform transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]`}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.55)_0%,rgba(5,5,5,0.12)_32%,transparent_62%)]" />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(181,18,36,0.16),transparent_58%)]" />
                      </div>

                      <span
                        className={`${jetbrains.className} absolute left-4 top-4 text-[0.5625rem] tracking-[0.28em] text-white/85 md:left-6 md:top-6`}
                      >
                        {vehicle.index}
                      </span>
                      <span
                        className={`${jetbrains.className} absolute right-4 top-4 text-[0.5rem] uppercase tracking-[0.26em] text-white/60 md:right-6 md:top-6`}
                      >
                        {vehicle.model}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
                        <div>
                          <span
                            className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-white/70`}
                          >
                            {vehicle.eyebrow}
                          </span>
                          <h3 className="display mt-2 text-[clamp(1.75rem,4.2vw,3rem)] text-white">
                            {vehicle.name}
                          </h3>
                        </div>
                        <span
                          aria-hidden="true"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-700 group-hover:border-white group-hover:bg-white group-hover:text-[#0A0A0A]"
                        >
                          <ArrowUpRight size={15} strokeWidth={1.25} />
                        </span>
                      </div>
                    </div>

                    {/* Whole-card action */}
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Explore the NOIR ${vehicle.name}, ${vehicle.eyebrow}`}
                      className="absolute inset-0 z-10 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-4 focus-visible:ring-offset-[#E9E9E7]"
                    >
                      <span className="sr-only">Explore vehicle</span>
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-[rgba(10,10,10,0.18)] pt-4">
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`${jetbrains.className} text-[0.5rem] tracking-[0.26em] text-[#B51224]`}
                      >
                        {vehicle.index}
                      </span>
                      <h4
                        className={`${jetbrains.className} text-[0.625rem] uppercase tracking-[0.24em] sm:text-[0.5625rem] sm:tracking-[0.3em]`}
                      >
                        {vehicle.tagline}
                      </h4>
                    </div>
                    <span
                      className={`${jetbrains.className} hidden shrink-0 text-[0.5rem] uppercase tracking-[0.24em] text-[#6B6B6B] sm:block`}
                    >
                      {vehicle.finish}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    {vehicle.specs.map((spec) => (
                      <span
                        key={spec.label}
                        className={`${jetbrains.className} flex items-baseline gap-1.5 text-[0.5625rem] uppercase tracking-[0.18em] text-[#6B6B6B] sm:text-[0.5rem]`}
                      >
                        <span>{spec.label}</span>
                        <span className="text-[0.625rem] tracking-[0.12em] text-[#0A0A0A]">
                          {spec.value}
                        </span>
                        <span>{spec.unit}</span>
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className={`${jetbrains.className} text-[0.5625rem] uppercase tracking-[0.26em]`}
                    >
                      Explore vehicle
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px w-8 bg-[#B51224] transition-all duration-700 group-hover:w-16"
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-20 flex flex-col gap-4 border-t border-[rgba(10,10,10,0.18)] pt-6 md:mt-28 md:flex-row md:items-center md:justify-between">
            <p
              className={`${jetbrains.className} text-[0.5rem] uppercase leading-relaxed tracking-[0.26em] text-[#6B6B6B]`}
            >
              Fictional concept studies · Not available for purchase.
              <br className="hidden sm:block" /> All imagery is illustrative.
            </p>
            <a
              href="#finale"
              className="group inline-flex items-center gap-3 self-start border border-[rgba(10,10,10,0.28)] px-5 py-3 font-mono text-[0.5625rem] uppercase tracking-[0.24em] transition-colors duration-500 hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F3F3F3] md:self-auto"
            >
              Continue the story
              <ArrowUpRight
                size={13}
                strokeWidth={1.4}
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Light → dark scene transition */}
      <div
        aria-hidden="true"
        className="h-[18vh] w-full bg-[linear-gradient(to_bottom,#E9E9E7_0%,#2A2927_58%,#050505_100%)] md:h-[24vh]"
      />

      <VehicleDrawer
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={(next) => setActiveIndex(next)}
      />
    </>
  );
}
