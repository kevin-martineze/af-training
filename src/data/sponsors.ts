import type { ImageMetadata } from 'astro';

import pfTraining from '../assets/sponsors/pf-training.jpeg';
import mencovaTech from '../assets/sponsors/mencova-tech.png';
import clinicaCure from '../assets/sponsors/clinica-cure.png';
import ocPhoneImport from '../assets/sponsors/oc-phone-import.jpeg';
import nickInsignares from '../assets/sponsors/nick-insignares.jpeg';
import peds from '../assets/sponsors/peds.png';
import drogueriaRenacerJw from '../assets/sponsors/drogueria-renacer-jw.png';
import draMarinelaMejia from '../assets/sponsors/dra-marinela-mejia.png';
import aarci from '../assets/sponsors/aarci.png';

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
  /**
   * The background the brand delivered its mark on. The files are flattened
   * images, not transparent cut-outs, so the section cannot treat them alike:
   * `dark` art is screened straight onto the cell and the black drops out,
   * while `light` art keeps its colours on a bone plate. Guessing wrong shows
   * up as a white slab in the grid, so it is declared per brand.
   */
  tone?: 'dark' | 'light';
};

export const sponsors: Sponsor[] = [
  { name: 'PF Training', logo: pfTraining, tone: 'dark' },
  { name: 'Mencova Tech', logo: mencovaTech, tone: 'light' },
  { name: 'Clínica Cure', note: 'Odontología integral', logo: clinicaCure, tone: 'dark' },
  { name: 'Phone Import', logo: ocPhoneImport, tone: 'light' },
  { name: 'Nick Insignares', note: 'Abogado', logo: nickInsignares, tone: 'dark' },
  { name: 'PEDS', logo: peds, tone: 'dark' },
  { name: 'Vergara' },
  { name: 'Droguerías Renacer JW', logo: drogueriaRenacerJw, tone: 'light' },
  {
    name: 'Dra. Marinela Mejía',
    note: 'Odontología general y especializada',
    logo: draMarinelaMejia,
    tone: 'dark',
  },
  { name: 'AARCI', logo: aarci, tone: 'dark' },
];
