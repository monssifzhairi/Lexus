import type { Metadata, Viewport } from "next";
import { archivo, cormorant, jetbrains } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://noir.example.com"),
  title: {
    default: "NOIR — Beyond Luxury",
    template: "%s — NOIR",
  },
  description:
    "NOIR is a fictional hypercar maison. An uncompromising expression of automotive excellence — power without compromise.",
  keywords: [
    "NOIR",
    "hypercar",
    "luxury automotive",
    "concept vehicle",
    "cinematic design",
  ],
  openGraph: {
    title: "NOIR — Beyond Luxury",
    description:
      "An uncompromising expression of automotive excellence. Explore the NOIR machine.",
    type: "website",
    images: [
      {
        url: "/images/hero-car.jpg",
        width: 1672,
        height: 941,
        alt: "Obsidian black NOIR hypercar in a dark architectural studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOIR — Beyond Luxury",
    description: "An uncompromising expression of automotive excellence.",
    images: ["/images/hero-car.jpg"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${cormorant.variable} ${jetbrains.variable}`}
    >
      <head>
        <noscript>
          {/* Without JS the intro curtain can never lift — hide it entirely. */}
          <style>{`[data-preloader]{display:none !important}`}</style>
        </noscript>
      </head>
      <body className="bg-void text-bone antialiased">
        <a
          href="#collection"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-hairline focus:bg-void focus:px-4 focus:py-3 focus:text-[0.625rem] focus:uppercase focus:tracking-[0.24em]"
        >
          Skip to collection
        </a>
        {children}
      </body>
    </html>
  );
}
