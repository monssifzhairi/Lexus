"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navItems } from "@/lib/data";
import { scrollToId, scrollToTop } from "@/lib/client";
import { jetbrains } from "@/app/fonts";

const COLUMNS = [
  { label: "Atelier", value: "Modena, Italia", extra: "By appointment" },
  { label: "Enquiries", value: "Private viewings", extra: "Six per season" },
  { label: "Series", value: "One — MMXXVI", extra: "Three commissions" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline-soft bg-void">
      <div className="shell pt-14 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo size="md" />
            <p className="mt-7 max-w-xs text-pretty text-[0.875rem] leading-[1.75] text-ash">
              An uncompromising expression of automotive excellence. Three
              commissions, built once, never repeated.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <span className="red-dot" aria-hidden="true" />
              <span
                className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-ash`}
              >
                Atelier open — MMXXVI
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-7">
            <p className={`${jetbrains.className} eyebrow`}>Navigate</p>
            <ul className="mt-5 flex flex-col">
              {[...navItems, { label: "Studio", href: "#studio" }].map(
                (item, i) => (
                  <li
                    key={item.href}
                    className="border-t border-hairline-soft last:border-b"
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(item.href.replace("#", ""));
                      }}
                      className="group flex items-center justify-between py-3.5"
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`${jetbrains.className} text-[0.4375rem] tracking-[0.22em] text-ash/50`}
                        >
                          0{i + 1}
                        </span>
                        <span className="text-[0.875rem] text-silver transition-colors duration-300 group-hover:text-bone">
                          {item.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.25}
                        className="text-ash/50 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-11">
            <p className={`${jetbrains.className} eyebrow`}>Index</p>
            <div className="mt-5 flex flex-col gap-4">
              {COLUMNS.map((col) => (
                <div key={col.label}>
                  <p className={`${jetbrains.className} data-label`}>{col.label}</p>
                  <p className="mt-1 text-[0.8125rem] text-silver">{col.value}</p>
                  <p className={`${jetbrains.className} mt-1 text-[0.4375rem] uppercase tracking-[0.2em] text-ash/50`}>
                    {col.extra}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-hairline-soft py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p
              className={`${jetbrains.className} text-[0.5rem] uppercase leading-relaxed tracking-[0.24em] text-ash/70`}
            >
              © MMXXVI NOIR — fictional design study.
              <br className="sm:hidden" /> No vehicles are offered for sale.
            </p>
            <p
              className={`${jetbrains.className} max-w-2xl text-[0.4375rem] uppercase leading-relaxed tracking-[0.2em] text-ash/40`}
            >
              Imagery: synthetic studio renders. 3D study: Ferrari 458 Italia by
              vicent091036 via the three.js examples (CC BY 4.0), re-materialled
              as an obsidian concept.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-3 self-start md:self-auto"
            aria-label="Back to the top of the page"
          >
            <span
              className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-ash transition-colors group-hover:text-bone`}
            >
              Back to top
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-silver transition-colors duration-500 group-hover:border-bone group-hover:bg-bone group-hover:text-void">
              <ArrowUp size={14} strokeWidth={1.25} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      {/* Oversized wordmark, cropped as an editorial signature */}
      <div
        className="pointer-events-none relative select-none overflow-hidden pt-4"
        aria-hidden="true"
      >
        <div className="shell">
          <span
            className="display block whitespace-nowrap text-[clamp(4.5rem,18.4vw,16rem)] leading-[0.8] text-transparent"
            style={{ WebkitTextStroke: "1px rgba(191,194,199,0.15)" }}
          >
            NOIR
          </span>
        </div>
        <div className="h-6 bg-void md:h-10" />
      </div>
    </footer>
  );
}
