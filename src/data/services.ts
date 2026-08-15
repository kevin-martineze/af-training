/**
 * Services, audience and the capacities worked on — all transcribed from the
 * institutional document. Grouped the way the client presents them so the
 * copy on the page never drifts from what they actually offer.
 */

/** The ten services, grouped so the section reads as three intents. */
export const serviceGroups = [
  {
    id: 'entrenamiento',
    title: 'Entrenamiento',
    items: [
      'Entrenamientos personalizados',
      'Entrenamientos semipersonalizados',
      'Entrenamientos grupales',
      'Entrenamientos para equipos y grupos deportivos',
    ],
  },
  {
    id: 'rendimiento',
    title: 'Rendimiento',
    items: [
      'Preparación física',
      'Procesos de desarrollo deportivo',
      'Planes de entrenamiento online',
    ],
  },
  {
    id: 'salud',
    title: 'Salud y seguimiento',
    items: [
      'Valoraciones y seguimiento',
      'Acompañamiento fisioterapéutico',
      'Procesos de prevención y recuperación deportiva',
    ],
  },
] as const;

/** Who the training is for. */
export const audience = [
  'Niños y niñas',
  'Jóvenes',
  'Adultos',
  'Deportistas en formación',
  'Deportistas que buscan mejorar su rendimiento',
  'Jugadores que quieren complementar sus entrenamientos',
  'Equipos y clubes deportivos',
  'Personas que quieren mejorar sus capacidades físicas',
] as const;

/** Capacities worked on inside a personalised process. */
export const capacities = [
  'Velocidad',
  'Fuerza',
  'Resistencia',
  'Coordinación',
  'Agilidad',
  'Potencia',
  'Técnica',
  'Toma de decisiones',
  'Capacidad física',
  'Rendimiento deportivo',
  'Aspectos mentales y de confianza',
] as const;

/** The five-step methodology. */
export const method = [
  {
    n: '01',
    title: 'Valoración',
    body: 'Conocemos al deportista y analizamos sus características.',
  },
  {
    n: '02',
    title: 'Planificación',
    body: 'Diseñamos el entrenamiento de acuerdo con sus objetivos.',
  },
  {
    n: '03',
    title: 'Ejecución',
    body: 'Desarrollamos sesiones dinámicas y específicas.',
  },
  {
    n: '04',
    title: 'Seguimiento',
    body: 'Analizamos la evolución y realizamos los ajustes necesarios.',
  },
  {
    n: '05',
    title: 'Reevaluación',
    body: 'Medimos los avances y establecemos nuevos objetivos.',
  },
] as const;
