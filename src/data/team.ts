import type { ImageMetadata } from 'astro';

import andresLara from '../assets/team/andres-lara.jpeg';
import andresRubiano from '../assets/team/andres-rubiano.jpeg';
import juanSebastianTorres from '../assets/team/juan-sebastian-torres.jpeg';
import germanEstrella from '../assets/team/german-estrella.jpeg';

/**
 * The four professionals behind the project, from the institutional document.
 * The mix of disciplines is the client's stated differentiator, so `field` is
 * surfaced in the UI rather than kept as an internal label.
 *
 * The portrait lives next to the name so the two can never drift apart — these
 * are real people, and a card showing the wrong face is worse than one showing
 * no face. `alt` is written per person for the same reason.
 *
 * All four files are pre-cropped to the same 4:5 geometry — head top at ~10%
 * of the frame, head height ~23% — so the row reads as one shoot and the
 * discipline badge never lands on a face. The two studio shots had no headroom
 * at all, so their backdrop was extended upward by a flat sample of its own
 * colour before cropping. Replacing a portrait means matching that geometry;
 * the component applies no per-image positioning.
 */
export type Member = {
  id: string;
  name: string;
  field: string;
  role: string;
  bio: string;
  portrait: ImageMetadata;
  alt: string;
};

export const team: Member[] = [
  {
    id: 'andres-lara',
    name: 'Andrés Lara',
    field: 'Entrenamiento',
    role: 'Entrenador deportivo · Licenciado en Educación Física',
    bio: 'Normalista Superior y licenciado en Educación Física, con experiencia en procesos de formación y competencia, especialmente en fútbol sala.',
    portrait: andresLara,
    alt: 'Andrés Lara de brazos cruzados, con la indumentaria del club, en fondo de estudio',
  },
  {
    id: 'andres-rubiano',
    name: 'Andrés Rubiano',
    field: 'Preparación física',
    role: 'Preparador físico · Licencias B y C',
    bio: 'Licenciado en Educación Física y preparador físico, con experiencia como preparador físico en niveles profesionales.',
    portrait: andresRubiano,
    alt: 'Andrés Rubiano sonriendo, de brazos cruzados y con la indumentaria del club, en fondo de estudio',
  },
  {
    id: 'juan-sebastian-torres',
    name: 'Juan Sebastián Torres',
    field: 'Fisioterapia',
    role: 'Fisioterapeuta',
    bio: 'Encargado del acompañamiento en procesos de prevención, recuperación y retorno progresivo a la actividad deportiva.',
    portrait: juanSebastianTorres,
    alt: 'Juan Sebastián Torres de brazos cruzados, con uniforme negro de fisioterapeuta, en fondo blanco',
  },
  {
    id: 'german-estrella',
    name: 'Germán Estrella',
    field: 'Comunicación',
    role: 'Comunicador social y periodista',
    bio: 'Amplia experiencia en medios digitales y fotografía. Fortalece la comunicación, la creación de contenidos y el registro visual del proyecto.',
    portrait: germanEstrella,
    alt: 'Germán Estrella con chaleco de fotógrafo y cámara en mano, a la entrada del estadio',
  },
];
