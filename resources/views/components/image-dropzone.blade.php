@props([
    'id' => '',
    'name' => '',
    'label' => '',
    'src' => '',
    'aspect' => 'aspect-video',
    'removeName' => 'remove_hero',
    'remove' => false,
])

@php
    $hasImage = filled($src);
@endphp

<div>
    @if ($label)
        <label class="mb-1 block text-sm text-neutral-300">{{ $label }}</label>
    @endif
    <div id="{{ $id }}-dropzone"
         class="group relative w-full overflow-hidden rounded-lg border border-dashed border-neutral-700 bg-neutral-950 cursor-pointer {{ $aspect }}">
        <input type="file" id="{{ $id }}-input" name="{{ $name }}"
               accept="image/jpeg,image/png,image/webp,image/gif" class="hidden">
        <div class="absolute inset-0 flex items-center justify-center {{ $hasImage ? 'opacity-0 transition-opacity group-hover:opacity-100' : '' }}">
            <span class="material-symbols-outlined text-5xl text-neutral-600">{{ $hasImage ? 'edit' : 'add' }}</span>
        </div>
        @if ($hasImage)
            <img id="{{ $id }}-preview" src="{{ $src }}" alt="" class="absolute inset-0 h-full w-full object-cover">
        @else
            <img id="{{ $id }}-preview" src="" alt="" class="absolute inset-0 h-full w-full object-cover hidden">
        @endif
        <button type="button" id="{{ $id }}-clear"
                class="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white {{ $hasImage ? '' : 'hidden' }}">
            <span class="material-symbols-outlined text-lg">close</span>
        </button>
        <input type="checkbox" id="{{ $id }}-remove" name="{{ $removeName }}" value="1" class="hidden" @checked($remove)>
    </div>
</div>
