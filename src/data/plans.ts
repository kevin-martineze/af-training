/**
 * Training plans.
 *
 * PLACEHOLDER DATA — replace with the contents of the client's plans PDF.
 * Drop the PDF at `public/planes-af-training.pdf` so the "descargar" CTA works,
 * then transcribe each plan here. Keep the shape; the section reads from it.
 */
export type Plan = {
  id: string;
  name: string;
  kicker: string;
  price: number | null;
  currency: string;
  period: string;
  summary: string;
  includes: string[];
  featured?: boolean;
};

export const currencyFormat = (value: number, currency: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const plans: Plan[] = [
  {
    id: 'base',
    name: 'Plan Base',
    kicker: '01',
    price: 120000,
    currency: 'COP',
    period: '/ mes',
    summary:
      'Para quien arranca. Rutina estructurada de fuerza y acondicionamiento con corrección técnica por video.',
    includes: [
      'Plan mensual de 4 sesiones semanales',
      'Videos explicativos de cada ejercicio',
      'Ajuste de cargas cada 4 semanas',
      'Soporte por WhatsApp en horario laboral',
    ],
  },
  {
    id: 'rendimiento',
    name: 'Plan Rendimiento',
    kicker: '02',
    price: 220000,
    currency: 'COP',
    period: '/ mes',
    summary:
      'Para jugadoras y jugadores en competencia. Periodización real alrededor del calendario de partidos.',
    includes: [
      'Periodización semanal según partidos',
      'Trabajo de velocidad, potencia y cambio de dirección',
      'Control de carga y test cada 4 semanas',
      'Videollamada quincenal de seguimiento',
      'Pautas de nutrición e hidratación',
    ],
    featured: true,
  },
  {
    id: 'elite',
    name: 'Plan Élite',
    kicker: '03',
    price: 380000,
    currency: 'COP',
    period: '/ mes',
    summary:
      'Acompañamiento 1 a 1. Presencial o híbrido, con readaptación de lesiones y análisis de partido.',
    includes: [
      'Sesiones presenciales individuales',
      'Readaptación y prevención de lesiones',
      'Análisis de video de tus partidos',
      'Plan de fuerza en gimnasio + campo',
      'Contacto directo con el entrenador',
    ],
  },
];

/** Path to the downloadable PDF. Null hides the download CTA. */
export const plansPdf: string | null = null;
