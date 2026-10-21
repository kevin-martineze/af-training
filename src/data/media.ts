import type { ImageMetadata } from 'astro';

import crest from '../assets/brand/crest-andres-lara.png';
import kitHome from '../assets/brand/kit-2026-home.png';
import kitAway from '../assets/brand/kit-2026-away.jpeg';
import kitWornNavy from '../assets/brand/kit-worn-navy.jpeg';
import kitCrestDetail from '../assets/brand/kit-crest-detail.jpeg';
import kitBackSponsors from '../assets/brand/kit-back-sponsors.jpeg';
import kitBack21 from '../assets/brand/kit-back-21.jpeg';

/* The kit-launch shoot: players in the 2026 navy kit. */
import trioWomen from '../assets/community/trio-women.jpeg';
import player00Ball from '../assets/community/player-00-ball.jpeg';
import player19Braid from '../assets/community/player-19-braid.jpeg';
import playerThumbsCrest from '../assets/community/player-thumbs-crest.jpeg';
import playerGlasses from '../assets/community/player-glasses.jpeg';
import playerFists from '../assets/community/player-fists.jpeg';
import playerPointingCrest from '../assets/community/player-pointing-crest.jpeg';

/* Camera originals from the October 2026 AL-kit session. */
import trioHug from '../assets/community/trio-hug.jpeg';
import player01873 from '../assets/community/player-01873.jpeg';

/* The wall: eighteen more portraits from that session, for Rostros.astro. */
import wall01834 from '../assets/community/muro/wall-01834.jpeg';
import wall01840 from '../assets/community/muro/wall-01840.jpeg';
import wall01850 from '../assets/community/muro/wall-01850.jpeg';
import wall01874 from '../assets/community/muro/wall-01874.jpeg';
import wall01877 from '../assets/community/muro/wall-01877.jpeg';
import wall01880 from '../assets/community/muro/wall-01880.jpeg';
import wall01884 from '../assets/community/muro/wall-01884.jpeg';
import wall01887 from '../assets/community/muro/wall-01887.jpeg';
import wall01890 from '../assets/community/muro/wall-01890.jpeg';
import wall01893 from '../assets/community/muro/wall-01893.jpeg';
import wall01896 from '../assets/community/muro/wall-01896.jpeg';
import wall01904 from '../assets/community/muro/wall-01904.jpeg';
import wall01908 from '../assets/community/muro/wall-01908.jpeg';
import wall01910 from '../assets/community/muro/wall-01910.jpeg';
import wall01913 from '../assets/community/muro/wall-01913.jpeg';
import wall01914 from '../assets/community/muro/wall-01914.jpeg';
import wall01915 from '../assets/community/muro/wall-01915.jpeg';
import wall01918 from '../assets/community/muro/wall-01918.jpeg';

import coachGuidingSprint from '../assets/training/coach-guiding-sprint.jpeg';
import stadiumWarmupPf from '../assets/training/stadium-warmup-pf.jpeg';
import assessment from '../assets/training/assessment.jpeg';
import plansBackground from '../assets/training/plans-background.jpeg';
import ctaBackground from '../assets/training/cta-background.jpeg';

export type Photo = { src: ImageMetadata; alt: string };

export const brand = {
  crest: {
    src: crest,
    alt: 'Escudo de Andrés Lara Entrenamientos',
  } satisfies Photo,
  /* Two colourways. The navy one carries every sponsor mark and is what the
     "todas van en la indumentaria" claim points at, so it leads; the white one
     is the coach's own kit and carries only his crest and signature. */
  kits: [
    {
      src: kitHome,
      label: 'Azul',
      alt: 'Indumentaria 2026 azul: camiseta y pantaloneta con los logos de las marcas que acompañan el proyecto',
    },
    {
      src: kitAway,
      label: 'Blanca',
      alt: 'Indumentaria 2026 blanca: camiseta con el escudo al frente y la firma de Andrés Lara en la espalda',
    },
  ] satisfies (Photo & { label: string })[],
  /* The kit as worn, from the October 2026 shoot on the pitch. Both are camera
     originals cut to 2:3 so they share the stage in Kit.astro frame for frame.
     `origin` is where the crest sits in the navy shot, as a CSS position: the
     scroll sequence opens its circle there, so the zoom reads as moving into
     that crest. Recropping the navy file means re-measuring it. */
  worn: {
    src: kitWornNavy,
    alt: 'Andrés Lara sonriendo en la cancha con la camiseta azul 2026, el escudo al pecho',
    origin: '67% 52%',
  },
  crestDetail: {
    src: kitCrestDetail,
    alt: 'Primer plano del escudo de Andrés Lara Entrenamientos sobre la camiseta blanca 2026, con un dedo señalándolo',
  } satisfies Photo,
  back: {
    src: kitBack21,
    alt: 'Un jugador sostiene a la espalda la camiseta azul 2026 con el número 21 y las marcas Clutch y Turbinas del Sur, AARCI y Clínica Cure',
  } satisfies Photo,
};

/**
 * "Visten el proceso": players at the kit launch and the October AL session.
 * The portraits are 3:4 because that is the card in the fan; the lead trio is
 * cropped to 16:10 in the file. None of them is named on the page — the client
 * supplied the photos, not the names — so the alt text describes and never
 * identifies.
 */
/* Anonymous athletes, so one shared alt describes the lot without naming
   anyone. The wall is decorative — a long strip of faces — so the alt text
   stays short and generic rather than trying to distinguish one crop from
   another that only differ by the person in them. */
const wallAlt = 'Deportista del proyecto Andrés Lara Entrenamientos';

export const community = {
  lead: {
    src: trioHug,
    alt: 'Tres jugadores abrazados con la camiseta azul 2026 en la cancha',
  } satisfies Photo,
  players: [
    { src: playerThumbsCrest, alt: 'Una jugadora sonriente señala con los pulgares el escudo de su camiseta azul 2026' },
    { src: player19Braid, alt: 'Una jugadora con trenzas y la camiseta azul 2026 posa en la cancha' },
    { src: playerFists, alt: 'Un jugador con la camiseta azul 2026 aprieta los puños y sonríe' },
    { src: player00Ball, alt: 'Un jugador con el número 00 a la espalda conduce el balón en la cancha' },
    { src: playerGlasses, alt: 'Una jugadora con gafas y la camiseta azul 2026 ríe acomodándose los lentes' },
    { src: player01873, alt: 'Un jugador con la camiseta azul 2026 posa en la cancha' },
  ] satisfies Photo[],
  wall: [
    { src: wall01834, alt: wallAlt },
    { src: wall01840, alt: wallAlt },
    { src: wall01850, alt: wallAlt },
    { src: wall01874, alt: wallAlt },
    { src: wall01877, alt: wallAlt },
    { src: wall01880, alt: wallAlt },
    { src: wall01884, alt: wallAlt },
    { src: wall01887, alt: wallAlt },
    { src: wall01890, alt: wallAlt },
    { src: wall01893, alt: wallAlt },
    { src: wall01896, alt: wallAlt },
    { src: wall01904, alt: wallAlt },
    { src: wall01908, alt: wallAlt },
    { src: wall01910, alt: wallAlt },
    { src: wall01913, alt: wallAlt },
    { src: wall01914, alt: wallAlt },
    { src: wall01915, alt: wallAlt },
    { src: wall01918, alt: wallAlt },
  ] satisfies Photo[],
};

/**
 * Hero backdrop: three vertical clips side by side rather than one wide one.
 *
 * Three clips tile to 27:16 — near enough to 16:9 that each panel only has to
 * cover a third of the viewport width, which is what makes vertical footage
 * usable as a wide backdrop at all. `minWidth` gates how many panels exist, so
 * a phone renders and downloads exactly one, and playback is staggered by
 * `delay` so the three never cut in unison.
 *
 * The three are windows of the same 61s "Día de entrega" master — Andrés Lara's
 * welcome, Andrés Rubiano's guest spot, and Lara's closing invitation — so the
 * backdrop is the client's own launch-day footage. Each window sits inside a
 * single speaker's segment to avoid a mid-word cut. All three are encoded to
 * 900x1600 from the 1080x1920 master (no crop — the source is already 9:16),
 * halved to 30fps.
 */
export type HeroPanel = {
  src: string;
  poster: string;
  /** Viewport width at which this panel appears. 0 means always. */
  minWidth: number;
  /** Seconds into the clip to start, so the three never move together. */
  delay: number;
  label: string;
};

export const heroPanels: HeroPanel[] = [
  {
    src: '/videos/hero-entrega-lara.mp4',
    poster: '/posters/hero-entrega-lara.jpg',
    minWidth: 0,
    delay: 0,
    label: 'Andrés Lara da la bienvenida en el día de entrega de la indumentaria.',
  },
  {
    src: '/videos/hero-entrega-rubiano.mp4',
    poster: '/posters/hero-entrega-rubiano.jpg',
    minWidth: 768,
    delay: 1.2,
    label: 'Andrés Rubiano, preparador físico, habla del proyecto.',
  },
  {
    src: '/videos/hero-entrega-cierre.mp4',
    poster: '/posters/hero-entrega-cierre.jpg',
    minWidth: 1024,
    delay: 3.5,
    label: 'Andrés Lara cierra invitando a entrenar con los mejores.',
  },
];

/**
 * Every photo used on the site, with the alt text written once so it stays
 * consistent wherever the image is reused.
 *
 * Everything here is a camera original re-encoded to a 2000px long edge, except
 * `assessment`, which is pre-cropped: its source is a portrait WhatsApp export
 * and the card that uses it is 16:10, so cropping in the file rather than in
 * CSS keeps the delivered pixels on the subject.
 *
 * `plansBackground` and `ctaBackground` are decorative backdrops — they render
 * with `alt=""` behind cards and gradients — so their alts here are placeholders
 * for the registry, never read on the page.
 */
export const photos = {
  plansBackground: { src: plansBackground, alt: 'El grupo entrenando en cancha con la indumentaria azul 2026' },
  ctaBackground: { src: ctaBackground, alt: 'Sesión de entrenamiento del proyecto Andrés Lara Entrenamientos' },

  /* The three photos the client supplied for "01 — El proyecto". The same
     frames were the kit-launch lead and fan before the October shoot, so they
     now live here to avoid repeating them in Kit.astro and Comunidad.astro. */
  trioWomen: {
    src: trioWomen,
    alt: 'Tres jugadoras con la camiseta azul 2026 posando juntas en la cancha, sonriendo',
  },
  playerPointingCrest: {
    src: playerPointingCrest,
    alt: 'Un jugador sonriente señala el escudo de su camiseta azul 2026',
  },
  kitBack00: {
    src: kitBackSponsors,
    alt: 'Un jugador sostiene a la espalda la camiseta azul 2026 con el número 00 y las marcas Clutch y Turbinas del Sur, AARCI y Clínica Cure',
  },

  coachGuiding: {
    src: coachGuidingSprint,
    alt: 'El entrenador acompañando a una jugadora con la mano en la espalda durante un ejercicio de carrera',
  },
  stadiumWarmup: {
    src: stadiumWarmupPf,
    alt: 'Calentamiento con balón en el estadio, supervisado por el preparador físico',
  },
  assessment: {
    src: assessment,
    alt: 'Valoración física: un deportista con sensores en los muslos sostiene un balón entre las rodillas mientras se registra la prueba',
  },
} satisfies Record<string, Photo>;

/**
 * Short vertical clips (464x832) shown in a stories-style rail — blowing them
 * up would look broken. Reels one and three are the client's launch-day
 * footage, cut from the "Día de entrega" master; reel two stays as the field
 * session in the middle.
 *
 * The welcome leads as `featured`: it carries the launch, so it gets the wider
 * card and the `note` line the other two then show in the field.
 */
export type Reel = {
  src: string;
  poster: string;
  label: string;
  caption: string;
  /** Extra line rendered under the card. Only the featured reel uses it. */
  note?: string;
  featured?: boolean;
};

export const reels: Reel[] = [
  {
    src: '/videos/reel-entrega-lara.mp4',
    poster: '/posters/reel-entrega-lara.jpg',
    label: 'Conoce mucho más sobre nosotros',
    caption: 'El día en que estrenamos la indumentaria 2026',
    note: 'Entrenamiento de calidad, con método, seguimiento y respaldo profesional.',
    featured: true,
  },
  {
    src: '/videos/training-02.mp4',
    poster: '/posters/training-02.jpg',
    label: 'Desarrolla tus habilidades',
    caption: 'Trabajo aeróbico al mediodía',
  },
  {
    src: '/videos/reel-entrega-rubiano.mp4',
    poster: '/posters/reel-entrega-rubiano.jpg',
    label: 'Respaldo profesional',
    caption: 'Andrés Rubiano, preparador físico, con el proyecto',
  },
];
