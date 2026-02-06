import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['server/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: false, // Don't clean since UI build also uses dist/
  splitting: false,
  sourcemap: true,
  outDir: 'dist/server',
});
