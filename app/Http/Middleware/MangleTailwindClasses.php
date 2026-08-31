<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Rewrites Tailwind class names in the rendered HTML to the mangled names
 * produced by `unplugin-tailwindcss-mangle` at build time.
 *
 * The mangle plugin obfuscates the Tailwind classes inside the compiled CSS
 * (e.g. `text-4xl` -> `tw-ab`). Because Blade is rendered server-side, Vite
 * cannot rewrite the class attributes itself, so we apply the mapping at
 * runtime using the `public/build/tw-mapping.json` file emitted by the plugin.
 *
 * In development (Vite dev server) the CSS is not mangled and this file does
 * not exist, so this middleware is a no-op.
 */
class MangleTailwindClasses
{
    private ?array $mapping = null;

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Skip while the Vite dev server is running: the CSS served in dev is
        // not mangled, so applying the mapping would break the styling.
        if (file_exists(public_path('hot'))) {
            return $response;
        }

        $content = $response->getContent();
        if (! is_string($content) || $content === '') {
            return $response;
        }

        $mapping = $this->mapping();
        if ($mapping === []) {
            return $response;
        }

        $content = preg_replace_callback(
            '/class="([^"]*)"/',
            function (array $matches) use ($mapping): string {
                $classes = preg_split('/\s+/', trim($matches[1]));
                foreach ($classes as $i => $class) {
                    if (isset($mapping[$class])) {
                        $classes[$i] = $mapping[$class];
                    }
                }

                return 'class="'.implode(' ', $classes).'"';
            },
            $content
        );

        return $response->setContent($content);
    }

    /**
     * @return array<string, string> original => mangled
     */
    private function mapping(): array
    {
        if ($this->mapping !== null) {
            return $this->mapping;
        }

        $file = public_path('build/tw-mapping.json');
        if (! is_file($file)) {
            return $this->mapping = [];
        }

        $data = json_decode((string) file_get_contents($file), true);
        $map = [];
        foreach ($data as $entry) {
            if (isset($entry['original'], $entry['mangled'])) {
                $map[$entry['original']] = $entry['mangled'];
            }
        }

        return $this->mapping = $map;
    }
}
