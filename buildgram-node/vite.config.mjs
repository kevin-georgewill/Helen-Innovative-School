import { defineConfig } from 'vite';
import { transformWithEsbuild } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(here, '..'),
  publicDir: false,
  plugins: [{
    name: 'buildgram-jsx-in-js',
    enforce: 'pre',
    async transform(code, id) {
      const file = id.split('?')[0];
      if (!file.endsWith('.js') || file.includes('/node_modules/')) return null;
      return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
    },
  }],
  resolve: {
    alias: {
      '@': path.resolve(here, '..'),
      'next/dynamic': path.join(here, 'dynamic.js'),
      'next/image': path.join(here, 'image.js'),
      'next/link': path.join(here, 'link.js'),
      'next/navigation': path.join(here, 'navigation.js'),
    },
  },
  build: {
    outDir: path.resolve(here, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(here, '../index.html'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
