import { defineConfig } from 'vite';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ emitCss: false })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CubitSvelte',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^svelte/, /^@cubit-ui\//],
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});
