import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import utwm from 'unplugin-tailwindcss-mangle/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/admin.js'],
            refresh: true,
        }),
        tailwindcss(),
        utwm({
            registry: {
                mapping: {
                    enabled: true,
                    file: 'public/build/tw-mapping.json',
                },
            },
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
