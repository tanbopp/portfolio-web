<?php

namespace App\Support;

class HtmlFormatter
{
    /**
     * Render WYSIWYG article/showcase HTML, wrapping any image that has a
     * non-empty alt caption in a <figure> so the caption shows below the image.
     */
    public static function renderArticle(?string $html): string
    {
        if ($html === null || $html === '') {
            return '';
        }

        // Protect existing <figure>...</figure> blocks (e.g. produced by the
        // captioned-image blot) so they are never double-wrapped below.
        $figures = [];
        $html = preg_replace_callback(
            '/<figure\b[^>]*>.*?<\/figure>/is',
            function (array $m) use (&$figures): string {
                $key = '{{FIG'.count($figures).'}}';
                $figures[$key] = $m[0];

                return $key;
            },
            $html
        );

        $html = preg_replace_callback(
            '/<img([^>]*)>/i',
            function (array $match): string {
                $tag = $match[0];

                if (preg_match('/alt="([^"]*)"/i', $match[1], $alt) && trim($alt[1]) !== '') {
                    $caption = htmlspecialchars($alt[1], ENT_QUOTES, 'UTF-8');

                    return '<figure>'.$tag.'<figcaption>'.$caption.'</figcaption></figure>';
                }

                return $tag;
            },
            $html
        );

        return strtr($html, $figures);
    }
}
