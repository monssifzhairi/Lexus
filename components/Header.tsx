"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Portal } from "@/components/ui/Portal";
import { ConfigureDialog } from "@/components/ConfigureDialog";
import { useIntro } from "@/components/IntroProvider";
import { navItems } from "@/lib/data";
import { lockScroll, scrollToId } from "@/lib/client";
import { jetbrains } from "@/app/fonts";

export function Header() {
  const { revealed } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /* Scroll state + reading progress (rAF-throttled) */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  /* Active section tracking */
  useEffect(() => {
    const ids = navItems.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Mobile menu: scroll lock, Esc to close, focus management */
  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    const panel = document.getElementById("mobile-menu");
    const nav = panel?.querySelector<HTMLElement>("nav");
    if (nav) nav.scrollTop = 0;
    // `preventScroll` keeps the panel from jumping when focus lands.
    const t = window.setTimeout(
      () => closeRef.current?.focus({ preventScroll: true }),
      30
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      lockScroll(false);
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [menuOpen, closeMenu]);

  const goto = (href: string) => {
    setMenuOpen(false);
    scrollToId(href.replace("#", ""));
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-[transform,opacity] duration-700 ${
          revealed ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div
          className={`relative transition-colors duration-500 ${
            scrolled
              ? "border-b border-hairline-soft bg-void/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div className="shell flex h-[4.25rem] items-center justify-between gap-4 md:h-[5.5rem]">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("top");
              }}
              aria-label="NOIR — back to the top"
              className="shrink-0 py-2"
            >
              <Logo size="sm" />
            </a>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-9">
                {navItems.map((item, i) => {
                  const isActive = active === item.href.slice(1);
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          goto(item.href);
                        }}
                        aria-current={isActive ? "true" : undefined}
                        className={`group flex items-baseline gap-2 py-2 font-mono text-[0.5625rem] uppercase tracking-[0.3em] transition-colors duration-300 ${
                          isActive ? "text-bone" : "text-ash hover:text-bone"
                        }`}
                      >
                        <span
                          className={`text-[0.4375rem] tracking-[0.2em] transition-colors duration-300 ${
                            isActive
                              ? "text-crimson"
                              : "text-ash/50 group-hover:text-ash"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setConfigureOpen(true)}
                className="hairline-btn hidden sm:inline-flex"
              >
                <span className="red-dot" aria-hidden="true" />
                Configure
              </button>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="hairline-btn !border-transparent !px-2.5 lg:hidden"
              >
                <Menu size={17} strokeWidth={1.25} aria-hidden="true" />
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-crimson/70 transition-transform duration-150"
            style={{ transform: `scaleX(${scrolled ? progress : 0})` }}
          />
        </div>
      </header>

      {menuOpen && (
        <Portal>
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-0 z-[100] flex flex-col bg-void lg:hidden"
          >
            <div className="shell flex h-[4.25rem] items-center justify-between border-b border-hairline-soft">
              <Logo size="sm" />
              <button
                ref={closeRef}
                type="button"
                onClick={closeMenu}
                className="hairline-btn !border-transparent !px-2.5"
              >
                <X size={17} strokeWidth={1.25} aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile" className="shell flex-1 overflow-y-auto py-10">
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <li key={item.href} className="border-b border-hairline-soft">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        goto(item.href);
                      }}
                      className="group flex items-center justify-between py-6"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          className={`${jetbrains.className} text-[0.5625rem] tracking-[0.24em] text-ash`}
                        >
                          0{i + 1}
                        </span>
                        <span className="display text-[2.25rem] text-bone">
                          {item.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={20}
                        strokeWidth={1}
                        className="text-ash transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-bone"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfigureOpen(true);
                  }}
                  className="btn-primary w-full"
                >
                  <span className="red-dot" aria-hidden="true" />
                  Configure your NOIR
                </button>
                <p
                  className={`${jetbrains.className} text-[0.5625rem] uppercase leading-relaxed tracking-[0.28em] text-ash`}
                >
                  Atelier Modena · Private viewings by appointment
                </p>
              </div>
            </nav>
          </div>
        </Portal>
      )}

      <ConfigureDialog
        open={configureOpen}
        onClose={() => setConfigureOpen(false)}
      />
    </>
  );
}
