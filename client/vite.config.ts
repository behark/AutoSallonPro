import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
    ],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared/schema': path.resolve(__dirname, 'src/shared/schema'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
      },
    },
    
    // Base URL configuration
    base: '/',
    
    // Build options
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            router: ['wouter'],
            ui: ['@headlessui/react', '@radix-ui/react-dialog', '@radix-ui/react-label'],
            query: ['@tanstack/react-query', 'axios'],
          },
        },
      },
      // Minification options
      minify: 'terser',
      // Using compatible terser options format
      terserOptions: {
        compress: mode === 'production',
      },
    },
    
    // Server options
    server: {
      port: 5173,
      strictPort: true,
      open: true,
      host: true,
    },
    
    // Preview options for production build testing
    preview: {
      port: 8080,
      strictPort: true,
      open: true,
    },
    
    // Define env variables
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  };
});
