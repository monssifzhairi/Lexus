"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, X } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { vehicles } from "@/lib/data";
import { copyText, lockScroll } from "@/lib/client";
import { jetbrains, cormorant } from "@/app/fonts";

type Props = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function VehicleDrawer({ index, onClose, onNavigate }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const open = index !== null;
  const vehicle = index !== null ? vehicles[index] : null;

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll(true);
    setCopied(false);
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(t);
      lockScroll(false);
      previouslyFocused?.focus?.();
    };
  }, [open, handleClose]);

  if (!vehicle || index === null) return null;

  const nextIndex = (index + 1) % vehicles.length;

  const specText = [
    `NOIR ${vehicle.name} ${vehicle.model}`,
    vehicle.finish,
    ...vehicle.specs.map(
      (s) => `${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`
    ),
    ...vehicle.notes.map((n) => `${n.label}: ${n.value}`),
    "Fictional concept study — not a production vehicle.",
  ].join("\n");

  return (
    <Portal>
      <div className="fixed inset-0 z-[105] flex justify-end">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close vehicle details"
          onClick={handleClose}
          className="absolute inset-0 h-full w-full cursor-default bg-void/70 backdrop-blur-sm"
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="vehicle-drawer-title"
          className="drawer-scroll relative z-10 h-full w-full overflow-y-auto border-l border-hairline bg-[#080808] sm:max-w-[34rem]"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-[#080808]/95 px-5 py-4 backdrop-blur-md md:px-7">
            <div className="flex items-baseline gap-3">
              <span className={`${jetbrains.className} text-[0.5rem] tracking-[0.26em] text-crimson`}>
                {vehicle.index}
              </span>
              <span className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.28em] text-ash`}>
                {vehicle.eyebrow} · {vehicle.year}
              </span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              className="hairline-btn !border-transparent !px-2.5"
            >
              <X size={16} strokeWidth={1.25} aria-hidden="true" />
              <span className="sr-only">Close vehicle details</span>
            </button>
          </div>

          <div className="relative aspect-[4/3.4] w-full overflow-hidden">
            <Image
              src={vehicle.image}
              alt={vehicle.imageAlt}
              fill
              sizes="(min-width: 640px) 34rem, 100vw"
              className="object-cover object-center"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#080808_1%,rgba(8,8,8,0.35)_38%,transparent_70%)]" />
            <span
              className={`${jetbrains.className} absolute left-5 top-4 text-[0.5rem] uppercase tracking-[0.3em] text-silver/80`}
            >
              {vehicle.code}
            </span>
          </div>

          <div className="px-5 pb-10 pt-2 md:px-7">
            <h2
              id="vehicle-drawer-title"
              className="display -mt-6 text-[clamp(2.5rem,7vw,3.5rem)] leading-none text-silver-gradient"
            >
              {vehicle.name}
            </h2>
            <p className={`${cormorant.className} mt-3 text-[1.25rem] italic text-silver/80`}>
              {vehicle.tagline}
            </p>

            <div className="mt-6 spec-rule" />
            <p className="mt-5 text-pretty text-[0.9375rem] leading-[1.8] text-ash">
              {vehicle.description}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-px bg-hairline-soft">
              {vehicle.specs.map((spec) => (
                <div key={spec.label} className="bg-[#080808] px-3 py-4">
                  <span className={`${jetbrains.className} data-label`}>
                    {spec.label}
                  </span>
                  <p className="mt-2 flex items-baseline gap-1">
                    <span className="display text-[1.5rem] tabular-nums text-bone">
                      {spec.value}
                    </span>
                    <span className={`${jetbrains.className} text-[0.4375rem] uppercase tracking-[0.2em] text-ash`}>
                      {spec.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <dl className="mt-8">
              {vehicle.notes.map((note) => (
                <div
                  key={note.label}
                  className="flex items-baseline justify-between gap-4 border-t border-hairline-soft py-3"
                >
                  <dt className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.26em] text-ash`}>
                    {note.label}
                  </dt>
                  <dd className="text-right text-[0.8125rem] text-silver">
                    {note.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={async () => {
                  const ok = await copyText(specText);
                  setCopied(ok);
                  window.setTimeout(() => setCopied(false), 2400);
                }}
                className="btn-primary flex-1"
              >
                {copied ? "Specification copied" : "Copy specification"}
                {copied ? (
                  <Check size={14} strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onNavigate(nextIndex)}
                className="hairline-btn justify-center !px-5 !py-3"
              >
                Next
                <ArrowRight size={13} strokeWidth={1.4} aria-hidden="true" />
              </button>
            </div>
            <p aria-live="polite" className="sr-only">
              {copied ? "Specification copied to clipboard" : ""}
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-hairline-soft pt-5">
              <button
                type="button"
                onClick={() =>
                  onNavigate((index - 1 + vehicles.length) % vehicles.length)
                }
                className="group flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.26em] text-ash transition-colors hover:text-bone"
              >
                <ArrowLeft
                  size={12}
                  strokeWidth={1.4}
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-x-1"
                />
                Previous commission
              </button>
              <span className={`${jetbrains.className} text-[0.5rem] tracking-[0.26em] text-ash/60`}>
                {vehicle.index} / 0{vehicles.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
