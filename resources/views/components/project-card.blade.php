@props(['title' => '', 'year' => '', 'image' => '', 'alt' => '', 'href' => ''])

@php
    $class = 'group flex-shrink-0 w-[80vw] sm:w-[420px] md:w-[480px] snap-start cursor-pointer overflow-hidden rounded-md';
@endphp

@if ($href)
    <a href="{{ $href }}" class="{{ $class }} block">
@else
    <article class="{{ $class }}">
@endif
    <div class="relative">
        <img src="{{ $image }}" alt="{{ $alt }}" class="w-full aspect-video object-cover" loading="lazy" />
        <div class="absolute w-full bottom-0 group-hover:opacity-0 transition duration-300">
            <div class="h-28 bg-gradient-to-t from-black/85 to-transparent"></div>
        </div>
    </div>
    <div class="mt-5">
        <h3 class="text-xl font-semibold mb-3">{{ $title }}</h3>
        <p class="text-sm text-neutral-300 font-medium">{{ $year }}</p>
    </div>
@if ($href)
    </a>
@else
    </article>
@endif
