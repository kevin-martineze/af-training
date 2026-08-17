# Andrés Lara Entrenamientos

Landing page for a sports training project in Barranquilla, Colombia, built with
Astro. Content comes from the client's institutional document, kept in
[`docs/`](docs/) — that file is the source of truth for every claim, price and
credential on the page.

**Stack:** Astro 7 (static output) · Tailwind CSS 4 · GSAP 3 (ScrollTrigger,
SplitText) · Lenis smooth scroll · self-hosted variable fonts (Archivo + Inter).

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve the production build locally
```

The project is on pnpm. `sharp` is an explicit devDependency because pnpm does
not hoist it the way npm did, and Astro's image pipeline fails the build without
it.

If the dev server reports that another instance is already running, use
`npx astro dev stop` (or `astro dev --background` plus `astro dev status` /
`astro dev logs`).

## Project layout

```
src/
  assets/
    brand/        crest and the 2026 kit render
    sponsors/     supporter logos
    team/         marks belonging to individual team members
    training/     photography, imported through astro:assets so it gets
                  optimised into webp/avif with a responsive srcset
  components/     one file per page section
  data/
    site.ts       brand, contact details and navigation
    plans.ts      the three monthly plans
    services.ts   services, audience, capacities and the five-step method
    team.ts       the four professionals
    sponsors.ts   "marcas que confían en nosotros"
    media.ts      photo registry — alt text lives here, written once
  layouts/
  lib/motion.ts   all scroll animation, driven by data-* attributes
  styles/
public/
  videos/         hero loop (wide + portrait) and the vertical reels
  posters/        first-frame stills used as video posters
docs/             client's institutional document
media-source/     camera masters, gitignored
```

### The hero loop

The client supplied one 1080x1920, 23 s phone reel (`media-source/`). It is
already a fast-cut edit, so the hero is a curated montage of its seven strongest
beats rather than one continuous take — wide establishing shot, the club crest,
two open action beats, a stride, a save, and the keeper set in goal.

Cuts are hard throughout, matching the source's own grammar, which means the
loop seam is just another cut and needs no crossfade.

Two encodes ship:

| File | Size | Used for |
| --- | --- | --- |
| `hero-wide.mp4` / `.webm` | 1080x608 | ≥768px, the horizontal framing |
| `hero-portrait.mp4` | 720x1280 | <768px, the native vertical framing |

A small inline script in `Hero.astro` attaches the right `<source>` at parse
time, so phones never download the desktop cut. Under
`prefers-reduced-motion: reduce` nothing is fetched at all and the poster
stands in. 1080px is the source's ceiling, so the wide cut upscales on large
displays — the footage is night-graded with grain over it, which hides it.

To recut, edit the `BEATS` array and re-run the encode script (it needs
`ffmpeg-static`, whose binary pnpm does not install by default:
`node node_modules/ffmpeg-static/install.js`).

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

`src/assets/training/` holds two generations of files.

The first batch are WhatsApp exports capped at 1280px on the long edge. Wherever
they are still used the layout works around that ceiling: nothing is rendered
wider than roughly 900 CSS px at 1x, background photos are blurred so upscaling
is invisible, and a grain overlay masks compression artefacts.

The second batch are camera originals, re-encoded to a 2000px long edge on the
way into the repo (the largest arrived at 3650x5489 and 7 MB, which is more than
a landing page should carry in git). These carry the sections that matter most —
the project grid, the three service cards and all five method steps — and their
`widths` arrays request correspondingly larger variants.

Framing is declared next to the photo rather than left to `object-cover`'s
default: `Services.astro` and `Method.astro` each pair every image with an
`object-*` position, because two of the shots crop badly when centred. Add new
photos the same way.

Anything shot on a white studio backdrop also needs `scrim`, which lays a flat
wash over the image so the card sits at the same weight as the ones photographed
on location.

The crest arrived as an opaque PNG on a light backdrop. It ships with that
backdrop cut to transparency (flood fill seeded from the border, which stops at
the crest's navy ring and so never touches the whites inside it).

## Before launch

- Point `site` in `astro.config.mjs` at the production domain — the sitemap,
  canonical URLs and `og:image` are all built from it.
- Confirm the four marks sitting unused in `src/assets/sponsors/`
  (`clutch-turbinas-del-sur`, `ew-william-ortiz`, `gutysport`, `veinticinco`).
  The client sent them with the logo batch but none appears in the list they
  gave for `data/sponsors.ts`, so they are not on the page — adding a brand is a
  claim about a real relationship. One line each in `sponsors.ts` once confirmed.
- All ten brands now ship a logo, so the wordmark fallback in `Sponsors.astro`
  is currently unexercised. Keep it: it is what stops a new brand from leaving
  a hole in the grid before its file arrives.
- Add the plans PDF to `public/` and point `plansPdf` at it to enable the
  download CTA.
- Nothing on the page has been checked in a real browser at phone widths. The
  hero stat row had to be rebuilt once because of it; the rest of the layout is
  unverified below `lg`.
- The client mentioned testimonials. None have been supplied, so no testimonial
  section exists yet — inventing them was not an option.
