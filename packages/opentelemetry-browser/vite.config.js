import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.js'),
            name: 'otel-browser',
            fileName: (format) => `otel-browser.${format}.js`
        },
    }
});
