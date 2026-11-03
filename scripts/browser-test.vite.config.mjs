import { resolve } from 'node:path';
const core = process.env.CUBIT_CORE;
export default {
  root: process.cwd(),
  logLevel: 'warn',
  build: {
    outDir: process.env.OUT || 'bundle', emptyOutDir: true, minify: false,
    lib: { entry: resolve(core, 'src/index.ts'), formats: ['es'], fileName: () => 'cubit-core.js' },
  },
};
