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
    brand/        crest, the two 2026 kit renders and the kit as worn
    community/    players at the kit launch, for "Visten el proceso"
    sponsors/     supporter logos
    team/         marks belonging to individual team members
    training/     photography, imported through astro:assets so it gets
                  optimised into webp/avif with a responsive srcset
  components/     one file per page section
  data/
    site.ts       brand, contact details and navigation
    plans.ts      the three monthly plans
    services.ts   services, audience, capacities and the five-step method
    team.ts       the five professionals
    sponsors.ts   "marcas que confían en nosotros"
    media.ts      photo registry — alt text lives here, written once
    entrega.ts    the kit-launch story: chapters and their timed captions
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

### The coach band

`CoachFilm.astro` is the one section built around a finished piece rather than
raw footage. The client supplied a single 23s take of Andrés Lara correcting
movement on the pitch, already edited: it opens on a title card and carries
burned-in kinetic captions for its whole length. Nothing is recut.
`scripts/encode-coach.sh` downscales it to 1080p and keeps the audio.

The settled decision is not to crop the captions out. Shaving the bottom band
would remove them, but the ball and both his hands go with them, and the
captions are the reason the clip reads with the sound off. Instead the page
stays out of their way: the section's own type sits above the video, the only
control inside the frame is a sound pill in the top-right, and the play badge
sits bottom-left on the poster's title card rather than over it.

The same captions are the source of the chip row under the video — those terms
are transcribed from the clip, which is why the wording reads as the coach's
and not ours. They also carry the meaning on phones, where a letterboxed 16:9
frame renders the burned-in captions at roughly 9px. The video switches to a 4:5
`object-cover` crop below `md`: that keeps the full height of the shot, captions
included, and crops the towers instead.

The band is `preload="none"` behind its poster and only fetches the file once it
is half on screen, so it adds nothing to first paint. At 3.9 MB it is the
heaviest single video in the repo; if that has to come down, the encode is
CRF 25 and the source is 4K, so there is room in the rate before the picture
starts to show it.

### The kit band

`Kit.astro` is a five-frame product sequence. Frame one, at the client's
request, is the squad: three players in the navy kit, the one landscape photo,
so the stage opens as a wide 16:10 frame as wide as the column and morphs into
the 2:3 portrait as frame two wipes in — Andrés Lara in the navy shirt. Then a
circle opens on his crest into a macro of the crest (shot on the white shirt,
which is how the sequence crosses colourways); an angled wipe turns to the back
of a player's shirt, the 00 and the sponsor marks; and both renders wipe up
from below. The morph animates the stage inside a fixed 2:3 box, so nothing
around it reflows. Scroll plays it all. From `lg` the whole section pins for
300% of the viewport; below `lg` only the stage pins, centred, for 210% —
scrubbing it unpinned spent the first frame while the stage was still sliding
in. The step list doubles as navigation and is the only way through under
reduced motion. That is also why the section sits outside the vertical rhythm
table below: from `lg` it is `min-h-svh` and centres itself.

Filters in the timeline are always tweened from an explicit value. From
`none`, GSAP interpolates through garbage and the frame flashes black.

The circle opens at `brand.worn.origin` in `media.ts`, which is where the crest
sits in `kit-worn-navy.jpeg`. Recrop that file and the origin has to be
re-measured, or the zoom lands beside the crest.

Two sections pin now, so `motion.ts` calls `ScrollTrigger.sort()` once every
feature has booted. Triggers refresh in creation order, and a trigger created
before a pin above it measures its start without that pin's spacing.

### Día de entrega

`Entrega.astro` is a story player for the 61 s kit-launch piece the client
shot at the Parque del Golf. The piece is already edited and opens and closes
on Andrés Lara with Andrés Rubiano in the middle, so it is cut into three
chapters along those speakers, between words, at 11.8 s and 47.4 s. Each is
720x1280 at 30 fps, CRF 26, with audio; together they are 10.8 MB, and nothing
loads until a chapter is about to play (the next one warms at 50%).

Captions are not burned in. They live in `src/data/entrega.ts` as timed cues,
render word by word over the video, and are repeated as a plain transcript in
the markup. Autoplay is muted, like any feed, and only with motion allowed;
"Ver con sonido" is the way in with audio and the only way in under reduced
motion. The glow behind the card is a 24x42 canvas sampled from the playing
frame and blurred.

Chapters change on a cube turn: both faces share an edge, the outgoing one
swings back on it while the incoming one swings in, each darkening as it turns
away, and the card dips slightly while it happens. Mid-turn, the chapter
number and title rise out of a mask at the centre of the frame and leave again
a second later. Chapters are named for what happens in them ("La bienvenida",
"El invitado", "La invitación") rather than for who speaks, because Andrés
Lara opens and closes the piece and the index read his name twice.

Reduced motion is not the same as no motion. With it on, the kit steps and the
chapter changes still crossfade; what goes is the zoom, the wipes, the cube and
the pins. Worth knowing when reviewing on a Mac: with *Reduce motion* enabled
in System Settings → Accessibility → Display, every effect on this page is
deliberately off.

### ¿Qué estás esperando? (the players)

`Comunidad.astro` gives the players from the kit launch their own band, headed
"¿Qué estás esperando?" at the client's request: the
trio of players as a wide lead image, unveiled by a curtain rising off it while
the photo settles from a zoom, then six portraits laid out as a hand of cards.

The fan is the cards' resting place in CSS, so it is there without script.
`initFan` deals it once the row is well in view: the pile rises out of a soft
blur, then opens from the centre outwards on a long expo curve. It is played on
its own clock rather than scrubbed — tied to the wheel it moved in steps. GSAP
folds the CSS `rotate` and `translate` properties into its own transform the
first time it touches a card, so the deal ends on the fan's tilt and drop
rather than on zero, which would flatten the hand into a row. Phones tilt 3°
per card instead of 5°, or the outer corners leave the screen.

Hover is on a second layer (`[data-fan-float]`) so it never undoes the fan: the
card under the pointer straightens and lifts, its neighbours lean away, further
ones less. Fine pointers only.

Nobody in these photos is named on the page. The client sent the pictures, not
the names, and the alt text describes without identifying.

Headless Chrome reports `prefers-reduced-motion: reduce` by default. Anything
that screenshots this page headless has to emulate `no-preference`, or it
captures the static fallback — no pins, no autoplay — and reads it as broken.

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

The kit sequence and the story player are wired by their own `data-kit-*` and
`data-story-*` hooks rather than generic attributes — see the two sections
above.

Elements carrying `data-reveal` or `data-split` start at `opacity: 0`. If
anything in the boot sequence throws, `motion.ts` adds `no-motion` to `<html>`,
which restores full opacity — a JavaScript failure can never leave the page
blank. `prefers-reduced-motion` is honoured throughout.

### The team row

Five cards do not divide evenly into two or three tracks at any width, so every
breakpoint below `xl` has to do something with its remainder. The row runs one
track, then two, then three, then five: `sm:grid-cols-2 lg:grid-cols-3
xl:grid-cols-5`.

Five across waits for `xl` rather than arriving at `lg`. The shell caps at
96rem, so a five-track row at 1024px puts each card at ~172px — narrower than
the four-track row this section used to run, and too narrow for a two-sentence
bio. At `xl` the same row lands at 220px and up.

On the two-track layout the remainder is a single card, which would sit alone in
the left column with an empty track beside it. That one card spans both tracks
at a sibling's width and centres itself, so the last row reads as deliberate.
Three and five tracks absorb their remainder on their own and need no help.

Two of the five cards carry the same `FISIOTERAPIA` badge and sit next to each
other, which is the honest reading rather than a mistake: `field` names the
discipline, and the section's "four areas" now has two professionals behind one
of them.

### The logo grid

Every mark renders 120px wide and as tall as its own file, and nothing in
`Sponsors.astro` is doing that. The `<Image>` there carries `h-14 w-auto
object-contain`, and none of the three lands: Astro's responsive-image
stylesheet is unlayered while Tailwind 4 puts utilities inside `@layer
utilities`, and unlayered rules win over layered ones whatever their
specificity. The class still supplies the greyscale and the rounded corners,
which is why it reads as if it were working.

So the files themselves are the layout. A square source is a square tile and a
3:1 source is a short one, which is why the row looks the way it does. Two
consequences worth knowing before touching this section:

- Adding `layout="none"` — which is what `Team.astro` passes, and why its
  `sizes` behaves — would not restore `h-14` so much as replace width
  normalisation with height normalisation. Tall marks would go narrow instead of
  short. Fix the intent deliberately, not by deleting the prop.
- Because width is capped rather than height, cropping a mark's own padding
  changes almost nothing on screen. `clutch-turbinas-del-sur.png` was cropped
  from a square to 1080x602 and the drawn mark is identical either way; the crop
  is there to drop dead pixels, not to resize anything.

`blanksBase` and `blanksSm` are what keep the grid's hairlines closed. The `ul`
paints the edge colour and each `li` covers it, leaving 1px gaps as the rules —
so an uncovered last cell shows as a pale block of that colour rather than as a
missing rule. The blanks are the same `bg-ink-950` as a real cell, so they read
as an empty tile with the frame complete around it.

### Vertical rhythm

Sections space themselves on three steps, and the middle one is the default:

| Step | Class | Where |
| --- | --- | --- |
| standard | `py-16 lg:py-20` | manifest, services, method, plans, team, gallery, faq |
| surfaced | `py-16 lg:py-24` | bands carrying their own background or border — coach, marks, entrega |
| tight | `py-14 lg:py-16` | the reel strip, which is just a `border-y` band |

Every section used to be `lg:py-40`, which put 320px of nothing between one
section's content and the next's. Two adjacent 160px paddings do that, and the
page read as though it were full of holes. On the scale above the same gaps are
160–177px on desktop and 128–144px on mobile. Kit was already at `lg:py-24`
inside its wrapper; the rest of the page moved down to meet it rather than the
other way round. `Method` only takes the mobile half — on desktop it is a pinned
rail, `lg:min-h-screen lg:py-0`.

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

- The "Día de entrega" captions were machine-transcribed and corrected by hand.
  Three lines are a best reading of unclear audio and are marked in
  `src/data/entrega.ts` ("entrega de uniformes", "Desearle lo mejor al profe",
  "No solo celebramos"). Play them once with sound and fix any that are off.
  Get the client's sign-off on the section too: it puts Andrés Rubiano's own
  words on the page, including that he works with Junior de Barranquilla
  Femenino.
- Andrés Lara's team portrait is now from the October 2026 pitch shoot. The
  source is a close 9:16 frame, so his head runs larger in the 4:5 card than
  the others' — see the note on his entry in `data/team.ts`. A wider frame
  from the same shoot would fix it.

- Luis Fernando Carbonell's card carries the one name on the page that
  contradicts its own photograph: the lab coat he is wearing is embroidered
  "Luis Orlando Valencia". He was asked and confirmed the name on the card, so
  it ships as given — but confirm it once more with the client, and ask whether
  the coat is even his. If the surname is wrong, it is wrong on a real person's
  face, which is the failure this repo's portrait note exists to prevent. His
  portrait is also the only one from a different shoot, so it will not match the
  row exactly; see `data/team.ts`.
- The coach band's copy is the only prose on the page that did not come from the
  institutional document. It describes what the clip visibly shows, and the
  fútbol sala line rests on Andrés Lara's own bio, but the client has not read
  it — get it signed off, and confirm they are happy for the piece to run on the
  site at all rather than only on social.
- Point `site` in `astro.config.mjs` at the production domain — the sitemap,
  canonical URLs and `og:image` are all built from it.
- Two marks are still unused in `src/assets/sponsors/`: `veinticinco` and
  `gutysport`. Both are printed on the navy kit, so the relationship is real,
  but the files are weak — Veinticinco is a photograph of a neon sign rather
  than a mark, and Gutysport is an Instagram screenshot with the comment bar
  still in it. It is also the kit manufacturer rather than a supporter. Ask for
  proper artwork before adding either. Clutch used to be the third on this list
  and came off it the same way: the placeholder was a 224px square and the
  client sent a 1254px replacement.
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
