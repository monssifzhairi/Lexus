"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Recalculates ScrollTrigger positions once webfonts and images have settled —
 * prevents triggers from firing at the wrong offset after first paint.
 */
export function ScrollRefresh() {
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      timer = window.setTimeout(refresh, 60);
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    document.fonts?.ready.then(refresh).catch(() => undefined);

    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", refresh, { once: true });
        img.addEventListener("error", refresh, { once: true });
      }
    });

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
