import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()] as any,
  build: {
    outDir: 'dist/ui',
    minify: 'esbuild',
    cssMinify: true,
  },
  server: {
    port: 5173,
  },
});
