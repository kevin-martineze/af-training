/**
 * Training plans, transcribed from the client's institutional document.
 * All plans are monthly and include 8 sessions; the per-session figure is what
 * the client leads with, so it is kept alongside the monthly price.
 */
export type Plan = {
  id: string;
  name: string;
  kicker: string;
  price: number;
  /** Per-session price the client quotes for this plan. */
  perSession: number;
  /** Previous per-session price, shown struck through. Null when there is none. */
  perSessionWas: number | null;
  currency: string;
  period: string;
  sessions: number;
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
    id: 'basico',
    name: 'Plan Básico',
    kicker: '01',
    price: 200000,
    perSession: 25000,
    perSessionWas: null,
    currency: 'COP',
    period: '/ mes',
    sessions: 8,
    summary: 'Ideal para quienes quieren comenzar un proceso de entrenamiento.',
    includes: [
      '8 sesiones mensuales',
      'Valoración inicial gratuita',
      'Trabajo de capacidades físicas base',
      'Acompañamiento del cuerpo técnico',
    ],
  },
  {
    id: 'intermedio',
    name: 'Plan Intermedio',
    kicker: '02',
    price: 304000,
    perSession: 38000,
    perSessionWas: null,
    currency: 'COP',
    period: '/ mes',
    sessions: 8,
    summary: 'Una opción con mayor seguimiento y planificación.',
    includes: [
      '8 sesiones mensuales',
      'Valoración inicial gratuita',
      'Planificación según tus objetivos',
      'Seguimiento y ajustes del proceso',
      'Reevaluación de avances',
    ],
    featured: true,
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    kicker: '03',
    price: 600000,
    perSession: 75000,
    perSessionWas: 100000,
    currency: 'COP',
    period: '/ mes',
    sessions: 8,
    summary:
      'Diseñado para quienes buscan un proceso mucho más exclusivo y personalizado.',
    includes: [
      '8 sesiones completamente personalizadas',
      'Valoración inicial gratuita',
      'Planificación individual y exclusiva',
      'Acompañamiento fisioterapéutico',
      'Seguimiento y reevaluación continua',
    ],
  },
];

/** Path to the downloadable PDF. Null hides the download CTA. */
export const plansPdf: string | null = null;

/**
 * The 2026 kit, sold on its own rather than folded into a plan.
 *
 * Unlike everything else in this file the price did not come from the
 * institutional document — the client gave it directly — so there is nothing to
 * check it against. `includes` is what the render in src/assets/brand actually
 * shows, which is the only claim the page makes about what the money buys.
 */
export const kit = {
  name: 'Indumentaria 2026',
  price: 90000,
  currency: 'COP',
  includes: ['Camiseta', 'Pantaloneta'],
} as const;
