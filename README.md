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

The master is a single continuous 1920x1080 take of a pitchside briefing
(`media-source/hero-source.mp4`, gitignored). There is no montage to assemble
and no seam to hide: the loop cuts back to the start on a framing that barely
moves, which reads as a camera restart rather than a glitch.

Three encodes ship, all cut from a twelve-second window:

| File | Size | Used for |
| --- | --- | --- |
| `hero-wide.mp4` / `.webm` | 1920x1080 | ≥768px, the native framing |
| `hero-portrait.mp4` | 720x1280 | <768px, a 9:16 window out of the middle |

A small inline script in `Hero.astro` attaches the right `<source>` at parse
time, so phones never download the desktop cut. Under
`prefers-reduced-motion: reduce` nothing is fetched at all and the poster
stands in.

The loop is the heaviest thing on the page — 2.7 MB for the mp4, 1.7 MB for the
webm most browsers actually take. That budget is why it runs twelve seconds and
not the master's full twenty-eight; lengthening it is the first thing that will
cost first paint.

To recut, edit `TRIM` in the encode script and re-run it (it needs
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

Where a landscape frame has to fill a portrait card, the crop is baked into the
file rather than left to `object-cover`. CSS cropping throws away the discarded
pixels *after* Astro has already generated the variant, so a 4:5 card fed a 3:2
source receives barely half the width it asked for and looks soft. Pre-cropping
means the delivered width is all subject. `physio-service-card`,
`futsal-duel-court` and `locker-huddle-ball` are the three that need it, and
they carry their own `widths` arrays because their ceiling is the crop, not the
original.

The team portraits are pre-cropped for a different reason — shared framing
across the row. See the note in [`src/data/team.ts`](src/data/team.ts).

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
- Twenty-one photos from the original WhatsApp batch are still in
  `src/assets/training/` with nothing importing them. They no longer ship —
  Astro only emits what is imported — but they are dead weight in git. Removing
  them is a one-liner once someone confirms none are wanted back:
  `git rm $(comm -23 <(ls src/assets/training) <(grep -rho "training/[a-z0-9-]*\.jpeg" src | cut -d/ -f2 | sort -u) | sed 's|^|src/assets/training/|')`
- The client mentioned testimonials. None have been supplied, so no testimonial
  section exists yet — inventing them was not an option.
