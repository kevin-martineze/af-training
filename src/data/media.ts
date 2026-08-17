import type { ImageMetadata } from 'astro';

import coachPortraitElite from '../assets/training/coach-portrait-elite.jpeg';
import coachSeatedTurf from '../assets/training/coach-seated-turf.jpeg';
import coachTacticalBoard from '../assets/training/coach-tactical-board.jpeg';
import coachTeamCircle from '../assets/training/coach-team-circle.jpeg';
import coachSprintDrill from '../assets/training/coach-sprint-drill.jpeg';
import teamTalkLocker from '../assets/training/team-talk-locker.jpeg';
import huddleTunnel from '../assets/training/huddle-tunnel.jpeg';
import matchWalkoutNight from '../assets/training/match-walkout-night.jpeg';
import matchActionBall from '../assets/training/match-action-ball.jpeg';
import staffLockerTrio from '../assets/training/staff-locker-trio.jpeg';
import staffTrioStanding from '../assets/training/staff-trio-standing.jpeg';
import staffDuoNight from '../assets/training/staff-duo-night.jpeg';
import lockerDuoHeadbands from '../assets/training/locker-duo-headbands.jpeg';
import lockerBenchDuo from '../assets/training/locker-bench-duo.jpeg';
import standsTrio from '../assets/training/stands-trio.jpeg';
import portrait13Celebrate from '../assets/training/portrait-13-celebrate.jpeg';
import portrait13Badge from '../assets/training/portrait-13-badge.jpeg';
import portrait29Up from '../assets/training/portrait-29-up.jpeg';
import portrait90Silence from '../assets/training/portrait-90-silence.jpeg';
import portraitFlex from '../assets/training/portrait-flex.jpeg';
import portraitPointing from '../assets/training/portrait-pointing.jpeg';
import portraitKitAwayFull from '../assets/training/portrait-kit-away-full.jpeg';
import portraitDtArmsCrossed from '../assets/training/portrait-dt-arms-crossed.jpeg';
import crest from '../assets/brand/crest-andres-lara.png';
import kit2026 from '../assets/brand/kit-2026.png';

/* Second drop from the client. Unlike the first batch these are camera
   originals, so they carry real detail — see the note on `photos` below. */
import playerCrouchTurfNight from '../assets/training/player-crouch-turf-night.jpeg';
import playerWalkTurfNight from '../assets/training/player-walk-turf-night.jpeg';
import coachGuidingSprint from '../assets/training/coach-guiding-sprint.jpeg';
import stadiumWarmupPf from '../assets/training/stadium-warmup-pf.jpeg';
import physioServiceCard from '../assets/training/physio-service-card.jpeg';
import futsalTunnelFocus from '../assets/training/futsal-tunnel-focus.jpeg';
import teamCircleOverhead from '../assets/training/team-circle-overhead.jpeg';
import coachSidelineStadium from '../assets/training/coach-sideline-stadium.jpeg';
import coachPortraitBoard from '../assets/training/coach-portrait-board.jpeg';
import lockerHuddleBall from '../assets/training/locker-huddle-ball.jpeg';

export type Photo = { src: ImageMetadata; alt: string };

export const brand = {
  crest: {
    src: crest,
    alt: 'Escudo de Andrés Lara Entrenamientos',
  } satisfies Photo,
  kit: {
    src: kit2026,
    alt: 'Indumentaria 2026: camiseta, pantaloneta y los logos de las marcas que acompañan el proyecto',
  } satisfies Photo,
};

/**
 * Hero loop. Cut from the client's 1080x1920 training reel: the wide beats are
 * cropped to 16:9 for desktop, and phones get the untouched vertical framing
 * instead of a sliver of the middle. Posters are each file's own first frame.
 */
export const heroVideo = {
  wide: { mp4: '/videos/hero-wide.mp4', webm: '/videos/hero-wide.webm', poster: '/posters/hero-wide.jpg' },
  portrait: { mp4: '/videos/hero-portrait.mp4', poster: '/posters/hero-portrait.jpg' },
  /** Describes the loop for anyone who cannot see it. */
  label:
    'Entrenamiento nocturno en cancha sintética: trabajo con balón, atajadas y el grupo reunido antes de la sesión.',
} as const;

/**
 * Every photo used on the site, with the alt text written once so it stays
 * consistent wherever the image is reused.
 *
 * Two generations live here. The originals are WhatsApp exports capped at
 * 1280px on the long edge, so anything using them still has to stay under
 * ~900 CSS px at 1x. The second batch (grouped at the bottom) are camera
 * originals re-encoded to a 2000px long edge, so those can be rendered larger
 * and requested at higher `widths` without going soft.
 */
export const photos = {
  coachPortrait: { src: coachPortraitElite, alt: 'El entrenador de perfil junto a la cancha, camiseta Elite' },
  coachSeated: { src: coachSeatedTurf, alt: 'El entrenador sentado al borde de la cancha de grama sintética' },
  coachBoard: { src: coachTacticalBoard, alt: 'El entrenador arrodillado explicando una jugada en la pizarra táctica' },
  coachCircle: { src: coachTeamCircle, alt: 'El entrenador dirigiendo una charla con las jugadoras sentadas en el campo' },
  coachSprint: { src: coachSprintDrill, alt: 'El entrenador acompañando a una jugadora en un ejercicio de velocidad' },
  teamTalk: { src: teamTalkLocker, alt: 'Charla de equipo en el camerino antes del partido' },
  huddle: { src: huddleTunnel, alt: 'Jugador con el balón en el túnel antes de salir a la cancha' },
  walkout: { src: matchWalkoutNight, alt: 'Jugadora saliendo al campo en un partido nocturno' },
  matchAction: { src: matchActionBall, alt: 'Jugada en disputa durante un partido de fútbol sala' },
  staffLocker: { src: staffLockerTrio, alt: 'Cuerpo técnico en el camerino' },
  staffStanding: { src: staffTrioStanding, alt: 'Cuerpo técnico completo posando junto a la cancha' },
  staffNight: { src: staffDuoNight, alt: 'Dos miembros del cuerpo técnico tras un entrenamiento nocturno' },
  lockerDuo: { src: lockerDuoHeadbands, alt: 'Dos jugadoras concentradas en el camerino' },
  lockerBench: { src: lockerBenchDuo, alt: 'Jugadoras esperando en la banca del camerino' },
  stands: { src: standsTrio, alt: 'Tres jugadoras sentadas en la tribuna del estadio' },
  p13Celebrate: { src: portrait13Celebrate, alt: 'Retrato de estudio de la jugadora número 13 celebrando' },
  p13Badge: { src: portrait13Badge, alt: 'Retrato de estudio de la jugadora número 13 señalando el escudo' },
  p29Up: { src: portrait29Up, alt: 'Retrato de estudio de la jugadora número 29 señalando al cielo' },
  p90Silence: { src: portrait90Silence, alt: 'Retrato de estudio de la jugadora número 90' },
  pFlex: { src: portraitFlex, alt: 'Retrato de estudio de una jugadora mostrando fuerza' },
  pPointing: { src: portraitPointing, alt: 'Retrato de estudio de una jugadora señalando a cámara' },
  pKitAway: { src: portraitKitAwayFull, alt: 'Retrato de estudio de cuerpo entero con la camiseta visitante' },
  pDt: { src: portraitDtArmsCrossed, alt: 'Retrato de estudio del director técnico' },

  /* --- Camera originals, 2000px long edge ------------------------------ */
  playerCrouch: {
    src: playerCrouchTurfNight,
    alt: 'Jugadora en cuclillas sobre la grama sintética, sonriendo tras el entrenamiento nocturno',
  },
  playerWalk: {
    src: playerWalkTurfNight,
    alt: 'Jugadora caminando sobre la grama sintética durante un partido nocturno, con la tribuna al fondo',
  },
  coachGuiding: {
    src: coachGuidingSprint,
    alt: 'El entrenador acompañando a una jugadora con la mano en la espalda durante un ejercicio de carrera',
  },
  stadiumWarmup: {
    src: stadiumWarmupPf,
    alt: 'Calentamiento con balón en el estadio, supervisado por el preparador físico',
  },
  /* Cropped tight from the studio portrait: at full length the face landed too
     small in the 16:10 service card to read at all. */
  physioPortrait: {
    src: physioServiceCard,
    alt: 'Retrato de estudio del fisioterapeuta del equipo, con uniforme negro',
  },
  futsalTunnel: {
    src: futsalTunnelFocus,
    alt: 'Jugador concentrado con el balón antes de saltar a la cancha de fútbol sala',
  },
  teamCircleOverhead: {
    src: teamCircleOverhead,
    alt: 'Vista cenital del entrenador hablando con las jugadoras sentadas en círculo sobre la grama',
  },
  coachSideline: {
    src: coachSidelineStadium,
    alt: 'El entrenador dando indicaciones desde la banda durante un partido en el estadio',
  },
  coachBoardPortrait: {
    src: coachPortraitBoard,
    alt: 'Retrato del entrenador con la pizarra táctica en la mano, observando el entrenamiento',
  },
  /** The only landscape frame in the set — see the note in `Method.astro`. */
  lockerHuddle: {
    src: lockerHuddleBall,
    alt: 'El entrenador con el balón en la mano hablando al equipo reunido en el camerino',
  },
} satisfies Record<string, Photo>;

/**
 * Short vertical clips shot on phone (464x832). They are deliberately shown
 * small, in a stories-style rail — blowing them up would look broken.
 *
 * The kit clip leads the rail as `featured`: it is the only studio-clean
 * footage in the set, so it gets the wider card and carries the standard the
 * other two then show in the field. `note` is the line inside its card.
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
    src: '/videos/training-01.mp4',
    poster: '/posters/training-01.jpg',
    label: 'Uniforme 25/26',
    caption: 'La identidad con la que se entrena',
    note: 'Entrenamiento de calidad, con método, seguimiento y respaldo profesional.',
    featured: true,
  },
  {
    src: '/videos/training-02.mp4',
    poster: '/posters/training-02.jpg',
    label: 'Sesión de campo',
    caption: 'Trabajo aeróbico al mediodía',
  },
  {
    src: '/videos/training-03.mp4',
    poster: '/posters/training-03.jpg',
    label: 'Entreno nocturno',
    caption: 'Circuito de coordinación y velocidad',
  },
];
