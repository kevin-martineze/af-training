import type { ImageMetadata } from 'astro';

/* The three survivors of the original WhatsApp-export batch, all used as
   backgrounds where the 1280px ceiling never shows. The rest of that batch has
   been replaced by camera originals and is no longer registered here. */
import coachTacticalBoard from '../assets/training/coach-tactical-board.jpeg';
import coachSprintDrill from '../assets/training/coach-sprint-drill.jpeg';
import huddleTunnel from '../assets/training/huddle-tunnel.jpeg';

import crest from '../assets/brand/crest-andres-lara.png';
import kit2026 from '../assets/brand/kit-2026.png';

/* Camera originals. See the note on `photos` below. */
import playerCrouchTurfNight from '../assets/training/player-crouch-turf-night.jpeg';
import playerWalkTurfNight from '../assets/training/player-walk-turf-night.jpeg';
import coachGuidingSprint from '../assets/training/coach-guiding-sprint.jpeg';
import stadiumWarmupPf from '../assets/training/stadium-warmup-pf.jpeg';
import physioServiceCard from '../assets/training/physio-service-card.jpeg';
import futsalDuelCourt from '../assets/training/futsal-duel-court.jpeg';
import teamCircleOverhead from '../assets/training/team-circle-overhead.jpeg';
import coachSidelineStadium from '../assets/training/coach-sideline-stadium.jpeg';
import coachPortraitBoard from '../assets/training/coach-portrait-board.jpeg';
import lockerHuddleBall from '../assets/training/locker-huddle-ball.jpeg';

/* Gallery: the kit shoot and the squads it was shot for. */
import studioPointingNavy from '../assets/training/studio-pointing-navy.jpeg';
import studio7White from '../assets/training/studio-7-white.jpeg';
import studio29Navy from '../assets/training/studio-29-navy.jpeg';
import studio26White from '../assets/training/studio-26-white.jpeg';
import studio13Celebrate from '../assets/training/studio-13-celebrate.jpeg';
import squadOrangeStadium from '../assets/training/squad-orange-stadium.jpeg';
import duoMedalFutsal from '../assets/training/duo-medal-futsal.jpeg';
import squadWomenOutdoor from '../assets/training/squad-women-outdoor.jpeg';
import squadYouthCourt from '../assets/training/squad-youth-court.jpeg';
import squadTrainingNight from '../assets/training/squad-training-night.jpeg';

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
 * Hero backdrop: three vertical clips side by side rather than one wide one.
 *
 * The footage is 464x832 phone video, and stretching a single clip across a
 * desktop viewport meant a 4x upscale. Three of them tile to 27:16 — near
 * enough to 16:9 that each panel only has to cover a third of the width, which
 * drops the upscale to about 1.4x. It also degrades cleanly: `minWidth` gates
 * how many panels exist at all, so a phone renders and downloads exactly one.
 *
 * Playback is staggered by `delay` so the three do not pulse in unison.
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
    src: '/videos/training-03.mp4',
    poster: '/posters/training-03.jpg',
    minWidth: 0,
    delay: 0,
    label: 'Circuito de coordinación y velocidad en un entrenamiento nocturno.',
  },
  {
    src: '/videos/training-02.mp4',
    poster: '/posters/training-02.jpg',
    minWidth: 768,
    delay: 1.2,
    label: 'Sesión de campo al mediodía.',
  },
  {
    src: '/videos/training-01.mp4',
    poster: '/posters/training-01.jpg',
    minWidth: 1024,
    delay: 2.4,
    label: 'Presentación de la indumentaria 2025/26.',
  },
];

/**
 * Every photo used on the site, with the alt text written once so it stays
 * consistent wherever the image is reused.
 *
 * Everything here is a camera original re-encoded to a 2000px long edge, with
 * three exceptions kept from the first WhatsApp-export batch: `coachBoard`,
 * `coachSprint` and `huddle`. Those three cap out at 1280px, which never shows
 * because all three are used blurred or heavily dimmed behind other content.
 * Anything new should come from the camera.
 *
 * A few entries are pre-cropped rather than full frames — `physioPortrait`,
 * `futsalDuel` and `lockerHuddle`. Their sources are landscape and the cards
 * that use them are portrait, so cropping in the file rather than in CSS is
 * what keeps the delivered pixels on the subject instead of throwing half of
 * them away off-frame.
 */
export const photos = {
  coachBoard: { src: coachTacticalBoard, alt: 'El entrenador arrodillado explicando una jugada en la pizarra táctica' },
  coachSprint: { src: coachSprintDrill, alt: 'El entrenador acompañando a una jugadora en un ejercicio de velocidad' },
  huddle: { src: huddleTunnel, alt: 'Jugador con el balón en el túnel antes de salir a la cancha' },

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
  futsalDuel: {
    src: futsalDuelCourt,
    alt: 'Dos jugadores disputando el balón durante un partido de fútbol sala',
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
  lockerHuddle: {
    src: lockerHuddleBall,
    alt: 'El entrenador con el balón en la mano hablando al equipo reunido en el camerino',
  },

  /* --- Gallery: the kit shoot and the squads it was shot for ----------- */
  studioPointing: {
    src: studioPointingNavy,
    alt: 'Jugadora en estudio señalando a cámara con la camiseta azul del club',
  },
  studio7: {
    src: studio7White,
    alt: 'Jugadora número 7 de perfil en estudio, con la indumentaria blanca y dorada',
  },
  studio29: {
    src: studio29Navy,
    alt: 'Jugadora número 29 de cuerpo entero en estudio, con la camiseta azul',
  },
  studio26: {
    src: studio26White,
    alt: 'Jugadora número 26 sonriendo en estudio, con la indumentaria blanca y dorada',
  },
  studio13: {
    src: studio13Celebrate,
    alt: 'Jugadora número 13 celebrando con los puños cerrados en estudio',
  },
  squadOrange: {
    src: squadOrangeStadium,
    alt: 'Plantel masculino posando sobre el césped del estadio antes de un partido',
  },
  duoMedal: {
    src: duoMedalFutsal,
    alt: 'Dos jugadores de fútbol sala mostrando la medalla de oro frente al arco',
  },
  squadWomen: {
    src: squadWomenOutdoor,
    alt: 'Plantel femenino junto al cuerpo técnico y la mascota del club al borde de la cancha',
  },
  squadYouth: {
    src: squadYouthCourt,
    alt: 'Plantel juvenil de fútbol sala celebrando en la cancha techada',
  },
  squadNight: {
    src: squadTrainingNight,
    alt: 'Grupo de entrenamiento posando en la cancha al terminar la sesión nocturna',
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
    label: 'Conoce mucho más sobre nosotros',
    caption: 'La identidad con la que se entrena',
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
    src: '/videos/training-03.mp4',
    poster: '/posters/training-03.jpg',
    label: 'Jornadas AM y nocturnas',
    caption: 'En distintos espacios deportivos de la ciudad',
  },
];
