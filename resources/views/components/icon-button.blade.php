@props(['icon' => '', 'ariaLabel' => '', 'id' => null])

<button
    @if ($id) id="{{ $id }}" @endif
    {{ $attributes->merge([
        'class' => 'w-12 h-12 flex items-center justify-center bg-neutral-950 hover:bg-neutral-900 rounded-md transition duration-300',
        'aria-label' => $ariaLabel,
    ]) }}
>
    <span class="material-symbols-outlined text-[24px] text-neutral-300">{{ $icon }}</span>
</button>
