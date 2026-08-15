import type { ImageMetadata } from 'astro';

import pfTraining from '../assets/sponsors/pf-training.jpeg';

/**
 * "Marcas que confían en nosotros" — the client explicitly asked for this
 * wording over "Patrocinadores", and for a clean section that gives the brands
 * visibility without competing with the main mark.
 *
 * `logo` is optional on purpose: brands without a file render as a typographic
 * wordmark, which reads as deliberate rather than as a gap. Dropping a logo
 * into src/assets/sponsors/ and adding the import here is the only change
 * needed to upgrade one — the layout does not move.
 */
export type Sponsor = {
  name: string;
  /** Second line, for brands whose descriptor is part of the name. */
  note?: string;
  logo?: ImageMetadata;
};

export const sponsors: Sponsor[] = [
  { name: 'PF Training', logo: pfTraining },
  { name: 'Mencova Tech' },
  { name: 'Clínica Cure', note: 'Odontología integral' },
  { name: 'Phone Import' },
  { name: 'Nick Insignares', note: 'Abogado' },
  { name: 'PEDS' },
  { name: 'Vergara' },
  { name: 'Droguerías Renacer JW' },
  { name: 'Dra. Marinela Mejía', note: 'Odontología general y especializada' },
  { name: 'AARCI' },
];
