/**
 * Single source of truth for brand + contact strings.
 * Anything marked TODO still needs to be confirmed with the client.
 */
export const site = {
  name: 'AF Training',
  // TODO: confirm the coach's full name and credentials.
  coach: {
    name: 'Andrés Fontalvo',
    role: 'Preparador físico · Entrenador de fútbol',
    credentials: [
      'Preparador físico de Elite Football Club',
      'Especialista en fútbol femenino y formativo',
      'Planificación de temporada y readaptación',
    ],
  },
  tagline: 'Pasión que nos une',
  description:
    'Planes de entrenamiento personalizados para futbolistas: fuerza, velocidad, resistencia y readaptación, con seguimiento semanal.',
  // TODO: confirm city + real contact details before launch.
  city: 'Barranquilla, Colombia',
  phone: '+57 300 000 0000',
  whatsapp: '573000000000',
  email: 'hola@aftraining.co',
  social: {
    instagram: 'https://instagram.com/aftraining',
    tiktok: 'https://tiktok.com/@aftraining',
  },
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const nav = [
  { label: 'Método', href: '#metodo' },
  { label: 'Planes', href: '#planes' },
  { label: 'Entrenador', href: '#entrenador' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Preguntas', href: '#faq' },
] as const;
