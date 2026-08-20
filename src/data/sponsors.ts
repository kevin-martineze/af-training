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
import vergara from '../assets/sponsors/vergara.png';
import ewWilliamOrtiz from '../assets/sponsors/ew-william-ortiz.png';
import juanSebastianTorres from '../assets/sponsors/juan-sebastian-torres.png';

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
  { name: 'Mencova Tech', logo: mencovaTech },
  { name: 'Clínica Cure', note: 'Odontología integral', logo: clinicaCure },
  { name: 'Phone Import', logo: ocPhoneImport },
  { name: 'Nick Insignares', note: 'Abogado', logo: nickInsignares },
  { name: 'PEDS', logo: peds },
  { name: 'Vergara', note: 'Entertainment', logo: vergara },
  { name: 'Droguerías Renacer JW', logo: drogueriaRenacerJw },
  {
    name: 'Dra. Marinela Mejía',
    note: 'Odontología general y especializada',
    logo: draMarinelaMejia,
  },
  { name: 'AARCI', logo: aarci },
  { name: 'EW William Ortiz', logo: ewWilliamOrtiz },
  {
    name: 'Juan Sebastián Torres',
    note: 'Fisioterapeuta',
    logo: juanSebastianTorres,
  },
];
