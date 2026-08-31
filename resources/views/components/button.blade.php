@props([
    'variant' => 'primary', // primary | secondary
    'href' => null,
    'icon' => null,
])

@php
    $classes = 'btn ' . ($variant === 'secondary' ? 'btn--secondary' : 'btn--primary');
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
        @if ($icon)
            <span class="material-symbols-outlined !text-xl">{{ $icon }}</span>
        @endif
    </a>
@else
    <button type="button" {{ $attributes->merge(['class' => $classes]) }}>
        {{ $slot }}
        @if ($icon)
            <span class="material-symbols-outlined !text-xl">{{ $icon }}</span>
        @endif
    </button>
@endif
