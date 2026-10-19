import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolio/',
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
