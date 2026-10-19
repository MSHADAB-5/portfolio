import { defineConfig } from 'vite';
import { AWARDS, PROJECTS, SKILL_CATEGORIES } from './src/data/content.ts';

function escape(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

export default defineConfig({
  base: '/portfolio/',
  plugins: [{
    name: 'static-resume-fallback',
    transformIndexHtml(html) {
      const fallback = [
        ...PROJECTS.map((project) => `<article><h3>${escape(project.title)}</h3><p>${escape(project.description)}</p></article>`),
        ...SKILL_CATEGORIES.map((category) => `<article><h3>${escape(category.title)}</h3><p>${category.items.map((item) => escape(item.name)).join(' / ')}</p></article>`),
        ...AWARDS.map((award) => `<article><h3>${escape(award.year ?? 'Certification')} / ${escape(award.title)}</h3><p>${escape(award.description)}</p></article>`),
      ].join('');
      return html.replace('<!-- STATIC_RESUME -->',
        `<noscript><section class="container static-resume"><h2>Projects, Skills &amp; Recognition</h2>${fallback}</section></noscript>`);
    },
  }],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/postprocessing')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/cobe')) {
            return 'vendor-globe';
          }
          return undefined;
        },
      },
    },
  },
});
