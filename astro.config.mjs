// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: point at the production domain before launch — the sitemap, canonical
  // URLs and the og:image URL are all built from this.
  site: 'https://andreslaraentrenamientos.com',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: {
    // The source photos top out at 1280px, so never upscale past their native size.
    responsiveStyles: true,
    layout: 'constrained',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
