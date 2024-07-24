import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      resolve: {
        alias: {
           '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      plugins: [
        vue({
          template: { transformAssetUrls },
        }),
        quasar()
      ],
      server: {
        open: '/src/demo/index.html',
        https: false,
        port: 8082,
        proxy: {
          '/ActionServlet': 'http://localhost',
          '/ows': 'http://localhost',
          '/api': 'http://localhost',
          '/wfe': 'http://192.168.0.230:8080',
          '/maps': 'http://localhost',
        },
      },
    };
  } else {
    return {
      resolve: {
        alias: {
          src: path.resolve(__dirname, './src'),
        },
      },
      plugins: [
        vue(),
        dts({
          insertTypesEntry: true,
        }),
      ],
      build: {
        minify: false,
        lib: {
          entry: path.resolve(__dirname, 'src/main.ts'),
          name: 'GeeBuisnesModules',
          formats: ['es', 'umd'],
          fileName: format => `gee-buisnes.${format}.js`,
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
      exclude: ['demo/**'],
    }
  }
});
