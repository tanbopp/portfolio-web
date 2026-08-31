@props(['class' => ''])

<div {{ $attributes->merge(['class' => 'w-full max-w-6xl mx-auto px-8 ' . $class]) }}>
    {{ $slot }}
</div>
