@props(['name' => '', 'image' => '', 'caption' => null, 'bordered' => true])

<div class="group">
    <div class="overflow-hidden aspect-[3/4] bg-neutral-900">
        <img src="{{ $image }}" alt="{{ $name }}" class="w-full h-full object-cover" loading="lazy" />
    </div>
    <div class="mt-5">
        <span @class([
            'text-base font-semibold text-white',
            'border-[0.5px] border-neutral-700 px-1.5 rounded' => $bordered,
        ])>{{ $name }}</span>
        @if ($caption)
            <p class="mt-1 text-neutral-500 leading-relaxed text-sm sm:text-base">{{ $caption }}</p>
        @endif
    </div>
</div>
