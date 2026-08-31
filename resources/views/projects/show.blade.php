@extends('layouts.app')

@section('content')

    {{-- Title (above hero) --}}
    <section class="relative w-full overflow-hidden border-b border-neutral-800/80 bg-black">
        <div class="absolute inset-0 pointer-events-none" style="background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px); background-size: 26px 26px;"></div>
        <x-container class="relative pt-32 pb-16">
            <p class="mb-3 text-sm uppercase tracking-widest text-neutral-400">{{ $project->deliverables[0] ?? 'Project' }}</p>
            <h1 class="text-3xl font-semibold tracking-[-1.5%] sm:text-5xl">{{ $project->title }}</h1>
            @if ($project->description)
                <p class="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-400 font-medium">{{ $project->description }}</p>
            @endif
        </x-container>
    </section>

    {{-- Hero --}}
    <section class="relative w-full aspect-[16/8] overflow-hidden">
        @if ($project->hero_image)
            <img src="{{ asset('storage/'.$project->hero_image) }}" alt="{{ $project->title }}"
                 class="absolute inset-0 h-full w-full object-cover">
        @endif
    </section>

    {{-- Meta + actions --}}
    <section class="w-full py-8">
        <x-container class="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div class="space-y-8">
                @if ($project->work_for)
                    <div>
                        <span class="text-xs uppercase tracking-widest text-neutral-500">Work for</span>
                        <p class="mt-1 text-2xl font-thin">{{ $project->work_for }}</p>
                    </div>
                @endif

                @if ($project->year)
                    <div>
                        <span class="text-xs uppercase tracking-widest text-neutral-500">Year</span>
                        <p class="mt-1 text-2xl font-thin">{{ $project->year }}</p>
                    </div>
                @endif

                @if (! empty($project->platform))
                    <div>
                        <span class="text-xs uppercase tracking-widest text-neutral-500">Platform</span>
                        <div class="mt-1 space-y-1">
                            @foreach ($project->platform as $plat)
                                <p class="text-2xl font-thin">{{ $plat }}</p>
                            @endforeach
                        </div>
                    </div>
                @endif

                @if (! empty($project->deliverables))
                    <div>
                        <span class="text-xs uppercase tracking-widest text-neutral-500">Deliverables</span>
                        @if (count($project->deliverables) === 1)
                            <p class="mt-1 text-2xl font-thin">{{ $project->deliverables[0] }}</p>
                        @else
                            <ul class="mt-3 space-y-2">
                                @foreach ($project->deliverables as $item)
                                    <li class="flex items-start gap-3 text-neutral-300">
                                        <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500"></span>
                                        {{ $item }}
                                    </li>
                                @endforeach
                            </ul>
                        @endif
                    </div>
                @endif
            </div>

            <div>
                @if (! empty($project->technologies))
                    <span class="text-xs uppercase tracking-widest text-neutral-500">Technologies</span>
                    <div class="mt-3 flex flex-wrap gap-2">
                        @foreach ($project->technologies as $tag)
                            <span class="rounded-full border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200">
                                {{ $tag }}
                            </span>
                        @endforeach
                    </div>
                @endif

                @if (! empty($project->actions))
                    <div class="mt-10 flex flex-wrap gap-3">
                        @foreach ($project->actions as $action)
                            <x-button
                                href="{{ $action['url'] ?? '#' }}"
                                target="_blank"
                                rel="noopener"
                                variant="{{ $loop->first ? 'primary' : 'secondary' }}"
                                icon="open_in_new"
                            >
                                {{ $action['label'] ?? 'Visit' }}
                            </x-button>
                        @endforeach
                    </div>
                @endif
            </div>
        </x-container>
    </section>

    {{-- Showcase --}}
    @if ($project->showcase)
        <section class="w-full bg-black py-8">
            <x-container>
                <div class="wysiwyg-content max-w-3xl !text-white">{!! \App\Support\HtmlFormatter::renderArticle($project->showcase) !!}</div>
            </x-container>
        </section>
    @endif

    {{-- Gallery (2 columns) --}}
    @if ($project->galleries->isNotEmpty())
        <section class="w-full border-t border-neutral-800/80 bg-black py-8">
            <x-container>
                <x-section-heading class="mb-8 text-3xl sm:text-4xl">Gallery</x-section-heading>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    @foreach ($project->galleries as $gallery)
                        @if ($gallery->isVideo())
                            <video src="{{ asset('storage/'.$gallery->media) }}" controls
                                   class="aspect-video w-full rounded-md object-cover"></video>
                        @else
                            <img src="{{ asset('storage/'.$gallery->media) }}" alt="{{ $project->title }}"
                                 loading="lazy" class="h-full w-full rounded-md object-cover">
                        @endif
                    @endforeach
                </div>
            </x-container>
        </section>
    @endif

    {{-- Article --}}
    @if ($project->article)
        <section class="w-full border-t border-neutral-800/80 py-8">
            <x-container>
                <x-section-heading class="mb-8 text-3xl sm:text-4xl">Article</x-section-heading>
                <div class="wysiwyg-content max-w-3xl !text-white">{!! \App\Support\HtmlFormatter::renderArticle($project->article) !!}</div>
            </x-container>
        </section>
    @endif

    <section class="w-full pb-20">
        <x-container>
            <x-button href="{{ url('/') }}" variant="secondary" icon="chevron_left">Back to Home</x-button>
        </x-container>
    </section>

@endsection
