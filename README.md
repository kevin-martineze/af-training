# AF Training

Landing page for a football strength & conditioning coach, built with Astro.

**Stack:** Astro 7 (static output) · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis smooth scroll · self-hosted variable fonts (Archivo + Inter).

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the production build locally
```

If the dev server reports that another instance is already running, use
`npm run dev -- --force` to replace it, or `npx astro dev stop`.

## Project layout

```
src/
  assets/
    brand/        club crest
    training/     photography, imported through astro:assets so it gets
                  optimised into webp/avif with a responsive srcset
  components/     one file per page section
  data/
    site.ts       brand, contact details and navigation
    media.ts      photo registry — alt text lives here, written once
    plans.ts      training plans and pricing
  layouts/
  lib/motion.ts   all scroll animation, driven by data-* attributes
  styles/
public/
  videos/         short vertical clips
  posters/        first-frame stills used as video posters
```

### Animation

`src/lib/motion.ts` is the only place that touches GSAP. Components stay
declarative and opt into behaviour with attributes:

| Attribute | Effect |
| --- | --- |
| `data-split` | Headline lines rise out of a clipping mask |
| `data-reveal="up\|fade\|scale\|left"` | Enter animation, with `data-reveal-delay` |
| `data-parallax="12"` | Scroll-linked vertical drift, value is % of travel |
| `data-marquee="30"` | Seamless ticker; the track must be duplicated in markup |
| `data-rail` | Pinned horizontal scroll section (desktop only) |
| `data-count="120"` | Number counts up when scrolled into view |

Elements carrying `data-reveal` or `data-split` start at `opacity: 0`. If
anything in the boot sequence throws, `motion.ts` adds `no-motion` to `<html>`,
which restores full opacity — a JavaScript failure can never leave the page
blank. `prefers-reduced-motion` is honoured throughout.

### Working with the photography

The source photos are WhatsApp exports capped at 1280px on the long edge, and
the clips are 464x832. The layout is built around that ceiling: nothing is
rendered wider than roughly 900 CSS px at 1x, background photos are blurred so
upscaling is invisible, and a grain overlay masks compression artefacts. If
higher-resolution originals become available, replacing the files in
`src/assets/training/` is enough — the `widths` arrays already request larger
variants where they would help.

## Before launch

- Replace the placeholder values marked `TODO` in `src/data/site.ts` (coach
  name, phone, WhatsApp number, email, city, social links).
- Transcribe the real training plans into `src/data/plans.ts`, then drop the
  plans PDF into `public/` and point `plansPdf` at it to enable the download CTA.
- Update `site` in `astro.config.mjs` to the production domain so the sitemap
  and canonical URLs are correct.
