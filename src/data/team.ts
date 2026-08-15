/**
 * The four professionals behind the project, from the institutional document.
 * The mix of disciplines is the client's stated differentiator, so `field` is
 * surfaced in the UI rather than kept as an internal label.
 */
export type Member = {
  id: string;
  name: string;
  field: string;
  role: string;
  bio: string;
};

export const team: Member[] = [
  {
    id: 'andres-lara',
    name: 'Andrés Lara',
    field: 'Entrenamiento',
    role: 'Entrenador deportivo · Licenciado en Educación Física',
    bio: 'Normalista Superior y licenciado en Educación Física, con experiencia en procesos de formación y competencia, especialmente en fútbol sala.',
  },
  {
    id: 'andres-rubiano',
    name: 'Andrés Rubiano',
    field: 'Preparación física',
    role: 'Preparador físico · Licencias B y C',
    bio: 'Licenciado en Educación Física y preparador físico, con experiencia como preparador físico en niveles profesionales.',
  },
  {
    id: 'juan-sebastian-torres',
    name: 'Juan Sebastián Torres',
    field: 'Fisioterapia',
    role: 'Fisioterapeuta',
    bio: 'Encargado del acompañamiento en procesos de prevención, recuperación y retorno progresivo a la actividad deportiva.',
  },
  {
    id: 'german-estrella',
    name: 'Germán Estrella',
    field: 'Comunicación',
    role: 'Comunicador social y periodista',
    bio: 'Amplia experiencia en medios digitales y fotografía. Fortalece la comunicación, la creación de contenidos y el registro visual del proyecto.',
  },
];
