import { defineConfig } from '@tailwindcss-mangle/config';

export default defineConfig({
  // tailwindcss-patch: capture the class list Tailwind v4 can generate
  registry: {
    projectRoot: process.cwd(),
    extract: {
      write: true,
      file: '.tw-patch/tw-class-list.json',
      format: 'json',
    },
    tailwindcss: {
      version: 4,
      packageName: 'tailwindcss',
      v4: {
        cssEntries: ['resources/css/app.css'],
        sources: [{ base: 'resources', pattern: '**/*.{blade.php,php,js,css}', negated: false }],
      },
    },
  },
  // unplugin-tailwindcss-mangle: write the original -> mangled mapping for the Blade runtime bridge
  transformer: {
    registry: {
      mapping: {
        file: 'public/build/tw-mapping.json',
      },
    },
  },
});
