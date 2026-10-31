"use client";

/** Smooth scroll that respects reduced-motion. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

/**
 * Copies text to the clipboard with a legacy fallback for non-secure contexts.
 * Returns true only when the copy verifiably succeeded.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function lockScroll(locked: boolean) {
  const el = document.documentElement;
  if (locked) {
    const scrollbar = window.innerWidth - el.clientWidth;
    el.style.overflow = "hidden";
    if (scrollbar > 0) el.style.paddingRight = `${scrollbar}px`;
  } else {
    el.style.removeProperty("overflow");
    el.style.removeProperty("padding-right");
  }
}
