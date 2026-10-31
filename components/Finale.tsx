"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGsapScene } from "@/lib/gsap";
import { scrollToId } from "@/lib/client";
import { jetbrains, cormorant } from "@/app/fonts";

export function Finale() {
  const rootRef = useRef<HTMLElement>(null);

  useGsapScene(({ reduced }) => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const lines = gsap.utils.toArray<HTMLElement>("[data-fin-line]", root);
    gsap.set(lines, { yPercent: 112 });

    gsap.to(lines, {
      yPercent: 0,
      duration: 1.6,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: root, start: "top 72%", once: true },
    });

    gsap.from(root.querySelectorAll("[data-fin-fade]"), {
      opacity: 0,
      y: 24,
      duration: 1.2,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 68%", once: true },
    });

    gsap.fromTo(
      root.querySelector("[data-fin-image]"),
      { scale: 1.16 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    gsap.to(root.querySelector("[data-fin-content]"), {
      opacity: 0.35,
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "bottom bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={rootRef}
      id="finale"
      aria-labelledby="finale-title"
      className="grain relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-void"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div data-fin-image className="absolute inset-0 will-change-transform">
          <Image
            src="/images/finale-road.jpg"
            alt="NOIR hypercar on a rain-soaked night road, crimson light trail reflecting on the asphalt"
            fill
            sizes="100vw"
            className="object-cover object-[46%_58%]"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#050505_0%,rgba(5,5,5,0.86)_28%,rgba(5,5,5,0.28)_58%,rgba(5,5,5,0.55)_82%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_18%_28%,rgba(181,18,36,0.14),transparent_60%)] mix-blend-screen" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,#050505,transparent)]" />
      </div>

      <div data-fin-content className="shell relative py-24 md:py-32">
        <div
          data-fin-fade
          className={`${jetbrains.className} flex items-center gap-3 text-[0.5rem] uppercase tracking-[0.36em] text-ash`}
        >
          <span className="red-dot" aria-hidden="true" />
          Finale — MMXXVI
        </div>

        <h2
          id="finale-title"
          className="display mt-8 max-w-[62rem] text-[clamp(2.3rem,7.8vw,6.6rem)] leading-[0.9] text-bone md:mt-10"
        >
          <span className="mask-line">
            <span data-fin-line className="text-silver-gradient">
              The road is
            </span>
          </span>
          <span className="mask-line">
            <span data-fin-line className="text-silver-gradient">
              only the
            </span>
          </span>
          <span className="mask-line">
            <span
              data-fin-line
              className={`${cormorant.className} serif-accent block overflow-visible pb-[0.16em] text-[1.02em] leading-[1.02] text-silver/90`}
            >
              beginning.
            </span>
          </span>
        </h2>

        <div data-fin-fade className="mt-9 max-w-[22rem] md:mt-11">
          <div className="h-px w-24 bg-crimson/70" />
          <p className="mt-5 text-pretty text-[0.9375rem] leading-relaxed text-ash md:text-base">
            Discover a different perspective on automotive excellence.
          </p>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("collection");
            }}
            className="btn-primary group mt-7 w-full xs:w-auto"
          >
            Explore the collection
            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="shell relative mt-auto pb-6" aria-hidden="true">
        <div className="flex items-center justify-between">
          <span
            className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-ash/60`}
          >
            44.6471° N — 10.9252° E
          </span>
          <span className={`${cormorant.className} text-[1rem] italic text-ash/60`}>
            Beyond luxury.
          </span>
        </div>
      </div>
    </section>
  );
}
