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
    brand/        crest and the two 2026 kit renders
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
  videos/         the three hero panels and the vertical reels
  posters/        first-frame stills used as video posters
docs/             client's institutional document
media-source/     camera masters, gitignored
```

### The hero backdrop

Three vertical clips side by side, not one wide one. Three of them tile to
27:16 — near enough to 16:9 that each panel covers only a third of the width,
which is what makes vertical footage usable as a wide backdrop at all.

The panel count is responsive: one column below `md`, two to `lg`, three above.
A panel only receives a `<source>` once its breakpoint actually matches, so a
phone downloads one clip rather than three. Playback is staggered by `delay` so
the three never cut in unison. Under `prefers-reduced-motion: reduce` nothing is
fetched and the posters stand in.

Panels one and three are two windows of the same 23 s master, cut from scenes
far enough apart that they read as different clips, and separated by panel two
so they are never side by side. That master's last second is a logo card and
sits outside both cuts on purpose.

All three encode to 900x1600 with `hqdn3d` ahead of x264. Night footage is noisy
and noise is expensive to encode; the denoise pass costs nothing visible under
the hero veil and saves roughly a third of the bytes. One master arrives with a
rotation matrix, so `ffprobe` reports 3840x2160 until something actually decodes
a frame — do not trust the header when recutting.

Masters live in `media-source/`, which is gitignored. Keep them out of
`public/`: everything there is copied verbatim into `dist`, so one stray
147 MB `.MOV` takes the build from 19 MB to 159 MB.

`scripts/encode-hero.sh` is dormant. It cuts a wide loop from a 1920x1080
master, which is what the hero used until the client asked to replace that
footage. It is kept ready for the reshoot.

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
- Two marks are still unused in `src/assets/sponsors/`: `clutch-turbinas-del-sur`
  and `veinticinco`. Both are printed on the navy kit, so the relationship is
  real, but their files are weak — Clutch is 224px square and Veinticinco is a
  photograph of a neon sign rather than a mark. `gutysport` is also unused and
  is the kit manufacturer rather than a supporter; the file is an Instagram
  screenshot with the comment bar still in it. Ask for proper artwork before
  adding any of the three.
- Every brand on the page ships a logo, so the wordmark fallback in
  `Sponsors.astro` is currently unexercised. Keep it: it is what stops a new
  brand from leaving a hole in the grid before its file arrives.
- Add the plans PDF to `public/` and point `plansPdf` at it to enable the
  download CTA.
- Desktop pulls all three hero panels, about 5.6 MB of video; phones pull only
  the first, 1.8 MB. If the desktop figure has to come down, the panels are
  already denoised and downscaled — the next lever is shortening them below
  nine seconds.
- `media-source/night-session-4k.MP4` is a second 2160x3840 night clip that no
  panel currently uses. It is the obvious swap if one of the three starts to
  feel stale.
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
