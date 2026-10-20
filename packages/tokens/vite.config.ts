import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFile, mkdir } from 'node:fs/promises';

// src/css/*.css를 dist/css로 복사하는 플러그인 (exports 서브패스 용)
function copyCss() {
  return {
    name: 'copy-css',
    apply: 'build' as const,
    closeBundle: async () => {
      const src = resolve(__dirname, 'src/css');
      const dest = resolve(__dirname, 'dist/css');
      await mkdir(dest, { recursive: true });
      await copyFile(resolve(src, 'tokens.css'), resolve(dest, 'tokens.css'));
      await copyFile(resolve(src, 'dark.css'), resolve(dest, 'dark.css'));
    },
  };
}

export default defineConfig({
  plugins: [copyCss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CubitTokens',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});
