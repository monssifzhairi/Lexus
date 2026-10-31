"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SceneStatus } from "@/components/studio/VehicleScene";
import { gsap, useGsapScene } from "@/lib/gsap";
import { SectionMeta } from "@/components/ui/SectionMeta";
import { jetbrains, cormorant } from "@/app/fonts";

const VehicleScene = dynamic(() => import("@/components/studio/VehicleScene"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function Studio() {
  const rootRef = useRef<HTMLElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [mount, setMount] = useState(false);
  const [status, setStatus] = useState<SceneStatus>("loading");
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [lowPower, setLowPower] = useState(false);

  /* Skip live WebGL on small / low-core / data-saver devices. */
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData ?? false;
    const small = window.matchMedia("(max-width: 767px)").matches;
    // Phones with a modern SoC still get the live studio; weaker or
    // data-saving devices get the static study (with an opt-in button).
    setLowPower(saveData || cores < 3 || (small && cores < 6));
  }, []);

  /* Feature check runs on the client only. */
  useEffect(() => {
    setSupported(supportsWebGL());
  }, []);

  /* Only pay for WebGL once the studio is close to the viewport. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px 0px" }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /* Fail safe if the asset never resolves. */
  useEffect(() => {
    if (!mount || failed) return;
    if (status === "ready") return;
    const t = window.setTimeout(() => setFailed(true), 24000);
    return () => window.clearTimeout(t);
  }, [mount, status, failed, attempt]);

  const handleStatus = useCallback((next: SceneStatus) => setStatus(next), []);
  const handleProgress = useCallback((value: number) => setProgress(value), []);
  const handleFail = useCallback(() => setFailed(true), []);

  const showFallback = supported === false || failed || lowPower;

  useGsapScene(({ reduced }) => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const lines = gsap.utils.toArray<HTMLElement>("[data-studio-line]", root);
    gsap.set(lines, { yPercent: 112 });
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.4,
      stagger: 0.1,
      ease: "expo.out",
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });

    gsap.from(root.querySelectorAll("[data-studio-fade]"), {
      opacity: 0,
      y: 22,
      duration: 1.1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 74%", once: true },
    });

    gsap.from(root.querySelector("[data-studio-frame]"), {
      opacity: 0,
      scale: 0.985,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 76%", once: true },
    });
  }, []);

  const loading = !showFallback && status !== "ready";

  return (
    <section
      ref={rootRef}
      id="studio"
      aria-labelledby="studio-title"
      className="relative overflow-hidden bg-void py-20 md:py-32"
    >
      <div className="shell">
        <SectionMeta index="04" label="The Studio" right="Real-time — WebGL" />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2
              id="studio-title"
              className="display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[0.9] text-bone"
            >
              <span className="mask-line">
                <span data-studio-line className="text-silver-gradient">
                  Study the
                </span>
              </span>
              <span className="mask-line">
                <span data-studio-line className="text-silver-gradient">
                  machine.
                </span>
              </span>
            </h2>

            <div data-studio-fade className="mt-6">
              <div className="spec-rule" />
              <p className="mt-5 max-w-sm text-pretty text-[0.9375rem] leading-[1.75] text-ash">
                Rotate the NOIR N—01 in real time. The paint is a physical
                material — obsidian clearcoat over carbon, catching a crimson
                light rig as the body turns.
              </p>
              <p
                className={`${jetbrains.className} mt-5 text-[0.5625rem] uppercase leading-relaxed tracking-[0.26em] text-ash/70`}
              >
                Drag horizontally to orbit.
                <br />
                Arrow keys rotate. Vertical scroll stays natural.
              </p>
            </div>

            <div data-studio-fade className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="red-dot" aria-hidden="true" />
                <span
                  className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-ash`}
                >
                  {showFallback ? "Static render" : "Live shader"}
                </span>
              </div>
              <span
                className={`${cormorant.className} text-[1.0625rem] italic leading-snug text-silver/75`}
              >
                “Look long enough and the machine looks back.”
              </span>
            </div>

            <p
              data-studio-fade
              className={`${jetbrains.className} mt-10 max-w-xs border-t border-hairline-soft pt-4 text-[0.5rem] uppercase leading-relaxed tracking-[0.22em] text-ash/50`}
            >
              3D study: external CC BY asset (Ferrari 458 Italia by vicent091036)
              re-materialled as an obsidian concept. Not a production NOIR design.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div
              data-studio-frame
              className="relative border border-hairline bg-[#070708]"
            >
              <div className="relative aspect-[4/4.6] w-full overflow-hidden sm:aspect-[16/11]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(115%_85%_at_50%_42%,transparent_45%,rgba(5,5,5,0.72)_100%)]"
                />
                {supported && mount && !failed && (
                  <VehicleScene
                    key={attempt}
                    onStatus={handleStatus}
                    onProgress={handleProgress}
                    failed={failed}
                    onFail={handleFail}
                  />
                )}

                {/* Static fallback — honest about not being 3D */}
                {showFallback && (
                  <div className="absolute inset-0">
                    <Image
                      src="/images/car-vanta.jpg"
                      alt="Static studio render of the NOIR Vanta concept hypercar"
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover object-[50%_62%]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.85),transparent_60%)]" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between">
                      <p
                        className={`${jetbrains.className} max-w-[19rem] text-[0.5rem] uppercase leading-relaxed tracking-[0.24em] text-silver/90`}
                      >
                        {supported === false
                          ? "WebGL is unavailable on this device — showing a static studio render."
                          : failed
                            ? "The 3D model could not be loaded — showing a static studio render."
                            : "The live 3D studio is paused for this device class to save power and data. This is a static studio render."}
                      </p>
                      {lowPower && !failed && supported !== false ? (
                        <button
                          type="button"
                          onClick={() => setLowPower(false)}
                          className="hairline-btn !bg-void/70 shrink-0 self-start sm:self-auto"
                        >
                          Load 3D anyway
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setFailed(false);
                            setStatus("loading");
                            setProgress(0);
                            setAttempt((n) => n + 1);
                          }}
                          className="hairline-btn !bg-void/70 shrink-0 self-start sm:self-auto"
                        >
                          Retry 3D
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#070708]">
                    <span className={`${jetbrains.className} eyebrow`}>
                      Initialising studio
                    </span>
                    <div className="h-px w-40 overflow-hidden bg-white/10">
                      <div
                        className="h-full bg-bone transition-[width] duration-500 ease-out"
                        style={{
                          width: `${Math.max(6, Math.round(progress))}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`${jetbrains.className} text-[0.5rem] tracking-[0.3em] text-ash`}
                    >
                      {String(Math.round(progress)).padStart(3, "0")} %
                    </span>
                  </div>
                )}
              </div>

              {/* Technical corner marks */}
              <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-white/40" />
              <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-white/40" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-white/40" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-white/40" />

              <div className="flex items-center justify-between border-t border-hairline bg-void px-4 py-3">
                <span
                  className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.28em] text-ash`}
                >
                  N—01 / Vanta — live render
                </span>
                <span
                  className={`${jetbrains.className} flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.28em] text-ash`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1 w-1 rounded-full ${
                      status === "ready" && !showFallback
                        ? "bg-crimson"
                        : "bg-white/30"
                    }`}
                  />
                  {showFallback
                    ? "Offline"
                    : status === "ready"
                      ? "Streaming"
                      : "Buffering"}
                </span>
              </div>
            </div>

            <p
              className={`${jetbrains.className} mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.5rem] uppercase tracking-[0.24em] text-ash/60`}
            >
              <span>GLB · 1.7 MB</span>
              <span>PBR clearcoat</span>
              <span>Procedural studio HDRI</span>
              <span className="hidden sm:inline">Three.js / R3F</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
