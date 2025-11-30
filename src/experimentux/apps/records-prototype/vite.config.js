import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
        demo: './demo.html'
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      'react-grid-layout',
      'react-selecto',
      'recharts',
      'react-calendar-heatmap',
      'date-fns',
      '@uiw/react-signature',
      'emoji-picker-react',
      'prop-types'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
});
