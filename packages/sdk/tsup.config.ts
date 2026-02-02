import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/express.ts',
    'src/nextjs.ts',
    'src/fastify.ts',
    'src/koa.ts',
    'src/nestjs.ts',
    'src/hono.ts',
    'src/dashboard.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  outDir: 'dist',
});
