@props(['as' => 'h2', 'class' => ''])

<{{ $as }} {{ $attributes->merge(['class' => 'font-thin tracking-[-2%] ' . $class]) }}>
    {{ $slot }}
</{{ $as }}>
