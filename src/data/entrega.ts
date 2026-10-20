/**
 * "Día de entrega": the kit launch at the Parque del Golf, as three story
 * chapters cut from one 61s vertical piece the client supplied (master kept out
 * of the repo, like every other camera file).
 *
 * The piece is already edited — it opens and closes on Andrés Lara and gives
 * the middle to Andrés Rubiano — so the chapters follow its own speakers rather
 * than imposing a structure. Cuts sit between words: 11.8s and 47.4s. The
 * posters for chapters one and three are b-roll on purpose, so the index does
 * not show the same face twice.
 *
 * `cues` are what each person says, in seconds from the start of that chapter.
 * They were machine-transcribed and then corrected by hand where the
 * transcription was plainly wrong ("iluminaria" for "indumentaria"). Three
 * lines are a best reading of unclear audio and are marked below; the client
 * should hear them once before launch — see the README.
 *
 * Every cue is also rendered as a plain transcript in the markup, so the words
 * reach screen readers and search engines whether or not the video plays.
 */
export type Cue = [start: number, end: number, text: string];

export type Chapter = {
  id: string;
  /** What the chapter is about. The list and the chapter card lead with this
   *  rather than the speaker, who would otherwise read twice — Andrés Lara
   *  opens and closes the piece. */
  title: string;
  /** One line under the title in the chapter list. */
  teaser: string;
  src: string;
  poster: string;
  speaker: string;
  role: string;
  /** Seconds. Used to size the progress bar before metadata arrives. */
  duration: number;
  cues: Cue[];
};

export const entrega = {
  place: 'Parque del Golf',
  title: 'Día de entrega',
};

export const chapters: Chapter[] = [
  {
    id: 'apertura',
    title: 'La bienvenida',
    teaser: 'El evento y sus invitados',
    src: '/videos/entrega-01-lara.mp4',
    poster: '/posters/entrega-01-bienvenida.jpg',
    speaker: 'Andrés Lara',
    role: 'Entrenador',
    duration: 11.8,
    cues: [
      [2.9, 7.4, 'Muy contentos por el evento realizado por el proyecto Andrés Lara Entrenamientos.'],
      [7.9, 11.6, 'Tuvimos invitados especiales, como el preparador físico Andrés Rubiano.'],
    ],
  },
  {
    id: 'invitado',
    title: 'El invitado',
    teaser: 'Andrés Rubiano, preparador físico',
    src: '/videos/entrega-02-rubiano.mp4',
    poster: '/posters/entrega-02-rubiano.jpg',
    speaker: 'Andrés Rubiano',
    role: 'Preparador físico',
    duration: 35.6,
    cues: [
      [10.3, 14.5, 'Hola, ¿qué tal? Mi nombre es Andrés Rubiano, soy preparador físico de profesión.'],
      [14.5, 18.2, 'Actualmente trabajo con el equipo profesional Junior de Barranquilla Femenino.'],
      // Unclear audio: "entrega uniforme" — read as "entrega de uniformes".
      [18.6, 24.2, 'Nos encontramos acá en el Parque del Golf, en la entrega de uniformes de este gran proyecto.'],
      [24.5, 28.4, 'Disfrutando esta mañana maravillosa, aportando el granito de arena,'],
      [28.4, 31.6, 'compartiendo con cada una de las personas que hacen parte de este proyecto.'],
      // Unclear audio: "que sean lo mejor al profe" — read as "desearle lo mejor".
      [31.9, 35.5, 'Desearle lo mejor al profe: muchos éxitos y abundancia para lo que viene.'],
    ],
  },
  {
    id: 'cierre',
    title: 'La invitación',
    teaser: 'Esfuerzo, humildad y sacrificio',
    src: '/videos/entrega-03-lara.mp4',
    poster: '/posters/entrega-03-invitacion.jpg',
    speaker: 'Andrés Lara',
    role: 'Entrenador',
    duration: 13.5,
    cues: [
      // Unclear audio: "Nosotros celebramos … sino" — read as "No solo celebramos".
      [0.3, 2.6, 'No solo celebramos el estreno de la indumentaria,'],
      [2.8, 4.9, 'sino el gran avance que hemos tenido como proyecto,'],
      [5.0, 7.3, 'con esfuerzo, humildad y sacrificio.'],
      [7.3, 11.4, 'Te extendemos la invitación para que cambies tus hábitos y entrenes con los mejores.'],
    ],
  },
];
