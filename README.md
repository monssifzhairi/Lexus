# NOIR — Beyond Luxury

A cinematic, single-page luxury automotive experience built with Next.js (App Router), TypeScript,
Tailwind CSS v4, GSAP + ScrollTrigger, and a real-time Three.js / React Three Fiber vehicle studio.

All vehicles, specifications and the maison itself are **fictional concept studies**.
No vehicles are offered for sale and there is no backend.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (binds 0.0.0.0)
```

Production:

```bash
npm run build
npm start          # http://localhost:3000
```

Quality gates:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

---

## Feature summary

**Art direction** — Obsidian `#050505` canvas, titanium-silver display type (Archivo variable,
width axis for editorial compression), Cormorant Garamond italic accents, mono technical labels,
one crimson accent `#B51224`. Hairline rules, huge negative space, no gradients-as-decoration.

**Hero** — Full-bleed cinematic studio plate, line-masked headline reveal (`POWER. / WITHOUT /
COMPROMISE.`), outlined second line, staggered supporting copy, primary + secondary CTA,
integrated technical metadata, scroll cue, mobile-specific vehicle band that keeps the car
visible instead of cropping the type.

**Motion system** — Intro counter + masked wordmark + curtain lift (`Preloader`), then a hero
timeline handed over through `IntroProvider`. Scroll choreography via GSAP `matchMedia` scopes
(`useGsapScene`) so every tween/ScrollTrigger is created inside a revertible context — no leaked
triggers, no conflicts, automatic cleanup on unmount and breakpoint change. Parallax, clip-path
image reveals, staggered line masks, count-up specifications, dark→light→dark scene transitions
between sections. `prefers-reduced-motion` is fully honoured: the intro is skipped, all reveals
render at their final state, the marquee stops and numbers render immediately.

**3D studio** — A real GLB (`public/models/noir-gt.glb`, 1.7 MB) rendered with React Three Fiber:
PBR materials re-authored as obsidian clearcoat (body), graphite forged wheels, crimson calipers,
emissive taillights, plus a procedural studio HDRI built from `Lightformer`s — no external HDRI
download. Drag to orbit (pointer events, `touch-pan-y` so vertical page scroll is untouched),
arrow keys, an orbit slider, auto-rotate toggle and reset. Loading indicator driven by
`useProgress`, error boundary + timeout fallback to a static render, WebGL feature detection,
device-class gating (small screens / low cores / data-saver get the static study with an explicit
"Load 3D anyway" opt-in), capped DPR, and full geometry/material disposal plus `useGLTF.clear`
on unmount.

**Engineering** — `ENGINEERED TO BE UNFORGETTABLE.` Full-bleed rear scene with a three-column
specification plate (1,000 HP / 2.5 s / 350 KM/H, explicitly labelled concept figures), macro
detail figure with parallax, and a numbered dossier.

**Collection** — Light editorial gallery (`#E9E9E7`) with an asymmetrical 3-vehicle grid
(VANTA / SPECTRE / ECLIPSE), individual art direction per card, hover scale + crimson wash, and a
side drawer per vehicle with specifications, previous/next navigation, keyboard trapping,
Esc to close and copy-to-clipboard.

**Finale** — `THE ROAD IS ONLY THE BEGINNING.` over a rain-soaked night plate, crimson accent,
collection CTA, and a minimal footer with navigation, index, attribution, back-to-top and an
oversized outlined wordmark.

**Accessibility** — Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`), skip link,
labelled controls, `aria-current` section tracking, focus-visible rings, focus trapping + focus
restoration in every overlay, scroll locking, escape handling, `noscript` guard so the intro
curtain can never block a JS-less render, and readable contrast on all body copy.

**Performance** — Zero third-party asset requests at runtime (fonts, Draco decoder, model and
imagery are all self-hosted). `next/image` with AVIF/WebP, priority only on the hero,
inspector-driven lazy mount of the WebGL canvas, DPR caps, `ContactShadows` with a single frame,
128/64px environment resolution on desktop/mobile.

---

## Project structure

```
app/
  layout.tsx            fonts, metadata, viewport, noscript guard
  page.tsx              composition root
  globals.css           design tokens (@theme), type scale, components
  fonts.ts              self-hosted localFont definitions
  icon.svg              favicon
components/
  IntroProvider.tsx     intro state handshake (revealed / finished)
  Preloader.tsx         counter + masked wordmark + curtain
  Header.tsx            nav, configure trigger, scroll progress, mobile menu
  Hero.tsx              cinematic opening + hero timeline
  Philosophy.tsx        statement, architectural figure, principles, marquee
  Engineering.tsx       headline, spec plate, macro detail, dossier
  Studio.tsx            3D section shell, gating, loading + fallback
  studio/
    VehicleScene.tsx    R3F canvas, materials, orbit interaction, disposal
    ModelErrorBoundary.tsx
  Collection.tsx        light gallery, asymmetrical grid
  VehicleDrawer.tsx     vehicle dossier drawer
  ConfigureDialog.tsx   atelier configurator (copy spec)
  Finale.tsx            closing scene
  Footer.tsx            footer + back to top
  ScrollRefresh.tsx     ScrollTrigger refresh after fonts/images
  ui/Logo.tsx, ui/SectionMeta.tsx, ui/AnimatedNumber.tsx, ui/Portal.tsx
lib/
  data.ts               vehicles, specs, principles, nav
  gsap.ts               plugin registration, matchMedia scene helper, motion hooks
  client.ts             scroll, clipboard, scroll lock helpers
fonts/                  Archivo VF, Cormorant Garamond, JetBrains Mono (+ OFL licences)
public/
  images/               8 art-directed campaign plates
  models/               noir-gt.glb (+ AO map)
  draco/                self-hosted Draco decoder
```

---

## Asset credits & limitations

- **Imagery** — all 8 photographs are synthetic studio renders generated for this concept. They are
  static art direction, not renderings of a production car.
- **3D model** — `public/models/noir-gt.glb` is the three.js example asset *Ferrari 458 Italia* by
  **vicent091036** (Sketchfab), licensed **CC BY 4.0**. It has been re-materialled (brand colours
  removed, obsidian clearcoat applied) purely as a **material and lighting study** for the NOIR
  N—01. It is **not** a NOIR design, and no interactive 3D model of the concept cars in the
  photography exists — the studio section is honest about this in the UI and footer.
- **Draco decoder** — self-hosted from the `three` package (`three/examples/jsm/libs/draco/gltf`)
  so the scene never calls a third-party CDN.
- **Fonts** — Archivo (SIL OFL), Cormorant Garamond (SIL OFL) and JetBrains Mono (SIL OFL).
  Licence texts are in `fonts/`.
- **GSAP** — used under its standard licence; no bonus plugins are required.
- No analytics, no cookies, no backend calls. "Copy specification" only writes to the clipboard.

---

## Verified test results

Checked in headless Chromium (SwiftShader) at 1440×900, 1280×820, 834×1112 (tablet), 390×844
(mobile, DPR 2) and with `prefers-reduced-motion: reduce` emulated:

| Check | Result |
| --- | --- |
| `tsc --noEmit` | pass, 0 errors |
| `next build` | pass, all routes static, 174 kB first load JS |
| `eslint .` | pass, 0 errors / 0 warnings |
| Console / page errors | none (after self-hosting the Draco decoder) |
| Failed network requests | none |
| Horizontal overflow | none — `scrollWidth === innerWidth` at 1440, 834 and 390 |
| Intro → hero handover | pass, header/hero reveal, no scroll lock left behind |
| Nav + footer anchor scroll | pass, active-section tracking works |
| Vehicle drawer | opens, previous/next swaps content, Esc closes, focus restored |
| Configure dialog | opens, option selection updates the spec panel, copy works, Esc closes |
| Mobile menu | opens at the top of the list, draws above the header, Esc closes |
| 3D studio | GLB loads, canvas renders at three-quarter / front / profile angles, orbit slider + keyboard rotate, auto-rotate toggle, "Streaming" state — verified on desktop **and** on a 390 px mobile viewport via the opt-in |
| 3D fallback | verified static-render fallback with explicit messaging and a working "Load 3D anyway" opt-in (low-power path); WebGL-off and load-failure paths covered by the same component |
| Reduced motion | intro skipped, no masked transforms, marquee halted, numbers render final values immediately |
