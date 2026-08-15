/**
 * Single source of truth for brand + contact strings.
 *
 * Everything here comes from the client's institutional document
 * (src/questions/) — the earlier placeholder identity ("AF Training",
 * "Andrés Fontalvo") was a guess and has been replaced.
 */
export const site = {
  name: 'Andrés Lara Entrenamientos',
  shortName: 'Andrés Lara',
  /** Used where the full name would wrap badly — header lockup, footer mark. */
  initials: 'AL',
  tagline: 'Más que entrenar, evolucionar',
  /** Secondary line from the document, used on the closing CTA band. */
  motto: 'Transforma tu esfuerzo en rendimiento',
  description:
    'Proyecto deportivo en Barranquilla enfocado en el desarrollo integral del deportista: entrenamiento, preparación física, fisioterapia y seguimiento. Valoración inicial gratuita.',

  city: 'Barranquilla, Colombia',
  /** "Nosotros llegamos a tu zona" — sessions are coordinated per location. */
  coverage: 'Barranquilla y alrededores · Modalidad online a otras ciudades y países',

  phone: '+57 321 204 2949',
  whatsapp: '573212042949',
  email: 'laraorozcoandres@gmail.com',
  social: {
    instagram: 'https://instagram.com/andreslara_',
    tiktok: 'https://tiktok.com/@andres99k',
  },
  /** Handles as the client writes them, for display next to the icons. */
  handles: {
    instagram: '@Andreslara_',
    tiktok: '@Andres99k',
  },

  /** The document names this as the primary call to action. */
  cta: 'Agenda tu valoración',
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const nav = [
  { label: 'Proyecto', href: '#proyecto' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Método', href: '#metodo' },
  { label: 'Planes', href: '#planes' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Preguntas', href: '#faq' },
] as const;
