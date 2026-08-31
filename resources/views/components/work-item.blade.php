@props(['company' => '', 'role' => '', 'description1', 'description2' => ''])

<div class="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16 py-6">
    <div class="flex flex-col gap-3">
        <span class="text-xl sm:text-2xl font-semibold text-white">{{ $company }}</span>
        <p class="text-base text-neutral-400 font-medium">{{ $role }}</p>
    </div>
    <div class="flex flex-col md:flex-row gap-6 md:gap-8 tracking-wide">
        <p class="text-neutral-400 leading-relaxed max-w-2xl mb-5">{{ $description1 }}</p>
        <p class="text-neutral-400 leading-relaxed max-w-2xl mb-5">{{ $description2 }}</p>
    </div>
</div>
