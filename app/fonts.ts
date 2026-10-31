import localFont from "next/font/local";

/**
 * Self-hosted variable fonts — no external network dependency, no layout shift.
 * Archivo VF carries both weight (100–900) and width (62%–125%) axes,
 * which gives the editorial display type its compressed authority.
 */
export const archivo = localFont({
  src: "../fonts/archivo-variable-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  adjustFontFallback: false,
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const cormorant = localFont({
  src: [
    {
      path: "../fonts/cormorant-300-latin.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/cormorant-italic-300-latin.woff2",
      weight: "300",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-cormorant",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const jetbrains = localFont({
  src: "../fonts/jetbrains-mono-variable-latin.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-mono-data",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});
