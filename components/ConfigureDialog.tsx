"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { copyText, lockScroll } from "@/lib/client";
import { jetbrains } from "@/app/fonts";

type Group = {
  id: string;
  index: string;
  label: string;
  options: string[];
};

const GROUPS: Group[] = [
  {
    id: "finish",
    index: "01",
    label: "Finish",
    options: ["Obsidian Satin", "Liquid Titanium", "Eclipse Violet"],
  },
  {
    id: "wheels",
    index: "02",
    label: "Wheels",
    options: ["21″ Forged", "22″ Aero Disc", "21″ Carbon Split"],
  },
  {
    id: "interior",
    index: "03",
    label: "Interior",
    options: ["Black Alcantara", "Bone Leather", "Crimson Stitch"],
  },
];

const MODEL = "NOIR N—01 / VANTA";

export function ConfigureDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Record<string, string>>({
    finish: GROUPS[0].options[0],
    wheels: GROUPS[1].options[0],
    interior: GROUPS[2].options[0],
  });
  const [copied, setCopied] = useState(false);

  const summary = useMemo(
    () =>
      [MODEL, selection.finish, selection.wheels, selection.interior].join(
        " / "
      ),
    [selection]
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll(true);
    setCopied(false);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
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
    };

    document.addEventListener("keydown", onKeyDown);
    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("button, [href]")
        ?.focus();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(t);
      lockScroll(false);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[110] flex items-stretch justify-center md:items-center">
        <button
          type="button"
          aria-label="Close configurator"
          onClick={onClose}
          className="absolute inset-0 h-full w-full cursor-default bg-void/85 backdrop-blur-md"
          tabIndex={-1}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="configure-title"
          className="drawer-scroll relative z-10 max-h-[100dvh] w-full overflow-y-auto border-hairline bg-carbon md:max-w-3xl md:border"
        >
          <div className="flex items-start justify-between border-b border-hairline px-5 py-5 md:px-8 md:py-6">
            <div>
              <p className={`${jetbrains.className} eyebrow`}>Atelier · Commission</p>
              <h2
                id="configure-title"
                className="display mt-3 text-[1.75rem] text-bone md:text-[2.25rem]"
              >
                Configure your NOIR
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="hairline-btn !border-transparent !p-2.5 text-ash hover:!border-hairline"
              aria-label="Close configurator"
            >
              <X size={16} strokeWidth={1.25} />
            </button>
          </div>

          <div className="grid gap-px bg-hairline-soft md:grid-cols-[1.1fr_1fr]">
            <div className="bg-carbon p-5 md:p-8">
              <div className="flex flex-col gap-7">
                {GROUPS.map((group) => (
                  <fieldset key={group.id}>
                    <legend
                      className={`${jetbrains.className} flex w-full items-center gap-3 text-[0.5625rem] uppercase tracking-[0.3em] text-ash`}
                    >
                      <span className="text-crimson">{group.index}</span>
                      {group.label}
                    </legend>
                    <div className="mt-4 flex flex-col">
                      {group.options.map((option) => {
                        const active = selection[group.id] === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setSelection((s) => ({ ...s, [group.id]: option }))
                            }
                            className={`flex items-center justify-between border-t border-hairline-soft px-1 py-3 text-left text-[0.8125rem] transition-colors duration-300 ${
                              active
                                ? "text-bone"
                                : "text-ash hover:text-silver"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                aria-hidden="true"
                                className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                                  active ? "bg-crimson" : "bg-white/20"
                                }`}
                              />
                              {option}
                            </span>
                            {active && (
                              <Check
                                size={13}
                                strokeWidth={1.25}
                                className="text-crimson"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between bg-void p-5 md:p-8">
              <div>
                <p className={`${jetbrains.className} eyebrow`}>Specification</p>
                <dl className="mt-5 flex flex-col gap-4">
                  <div>
                    <dt className="data-label">Model</dt>
                    <dd className="mt-1.5 text-sm text-bone">N—01 · Vanta</dd>
                  </div>
                  {GROUPS.map((group) => (
                    <div key={group.id}>
                      <dt className="data-label">{group.label}</dt>
                      <dd className="mt-1.5 text-sm text-bone">
                        {selection[group.id]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-8">
                <p
                  className={`${jetbrains.className} text-[0.5625rem] uppercase leading-relaxed tracking-[0.2em] text-ash/80`}
                >
                  Concept configurator · fictional vehicles.
                  <br />
                  No order is placed and no data is transmitted.
                </p>
                <button
                  type="button"
                  className="btn-primary mt-5 w-full"
                  onClick={async () => {
                    const ok = await copyText(summary);
                    setCopied(ok);
                    window.setTimeout(() => setCopied(false), 2400);
                  }}
                >
                  {copied ? "Specification copied" : "Copy specification"}
                  {copied ? (
                    <Check size={14} strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </button>
                <p aria-live="polite" className="sr-only">
                  {copied ? "Specification copied to clipboard" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
