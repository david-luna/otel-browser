import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        lib: {
            // entry: resolve(__dirname, 'lib/bundle.js'),
            // formats: ['umd', 'es'],
            // name: 'otel-browser',
            // fileName: (format) => `otel-browser-bundle.${format}.js`
            entry: resolve(__dirname, 'lib/_mini.js'),
            formats: ['umd', 'es'],
            name: 'otel-browser-mini',
            fileName: (format) => `otel-browser-mini.${format}.js`
        },
        sourcemap: true,
    }
});
