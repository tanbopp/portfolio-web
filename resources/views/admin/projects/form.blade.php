@extends('admin.layouts.app')

@section('title', $project ? 'Edit Project' : 'New Project')

@section('content')
    <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-thin tracking-tight">{{ $project ? 'Edit Project' : 'New Project' }}</h1>
        @if ($project)
            <a href="{{ route('projects.show', $project) }}" target="_blank" class="text-sm text-neutral-300 hover:text-white">View detail →</a>
        @endif
    </div>

    <form method="POST"
          action="{{ $project ? route('admin.projects.update', $project) : route('admin.projects.store') }}"
          enctype="multipart/form-data"
          class="space-y-8">
        @csrf
        @if ($project)
            @method('PUT')
        @endif

        {{-- Basic --}}
        <section class="rounded-xl border border-neutral-800 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Basic</h2>
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm text-neutral-300">Title *</label>
                    <input type="text" name="title" value="{{ old('title', $project->title ?? '') }}" required
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 outline-none focus:border-neutral-500">
                </div>
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm text-neutral-300">Deskripsi singkat</label>
                    <textarea name="description" rows="2" placeholder="Deskripsi singkat project yang muncul tepat di bawah judul"
                              class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500">{{ old('description', $project->description ?? '') }}</textarea>
                </div>
                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Slug (biarkan kosong untuk auto)</label>
                    <input type="text" name="slug" value="{{ old('slug', $project->slug ?? '') }}"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 outline-none focus:border-neutral-500">
                </div>
                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Year</label>
                    <input type="text" name="year" value="{{ old('year', $project->year ?? '') }}" placeholder="2026"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 outline-none focus:border-neutral-500">
                </div>
                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Work for</label>
                    <input type="text" name="work_for" value="{{ old('work_for', $project->work_for ?? '') }}"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 outline-none focus:border-neutral-500">
                </div>
                <div>
                    <label class="mb-1 block text-sm text-neutral-300">Platform</label>
                    <div id="platform-container" class="flex flex-wrap gap-2"></div>
                    <div class="mt-2 flex gap-2">
                        <input type="text" id="platform-new" placeholder="mis. Web"
                               class="flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-white outline-none focus:border-neutral-500">
                        <button type="button" id="platform-insert" class="btn btn--secondary whitespace-nowrap">Insert</button>
                    </div>
                    <textarea name="platform" id="platform-input" class="hidden">{{ old('platform', $project ? implode("\n", $project->platform ?? []) : '') }}</textarea>
                </div>
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm text-neutral-300">Deliverables (pisahkan dengan koma)</label>
                    <input type="text" name="deliverables" value="{{ old('deliverables', $project ? implode(', ', $project->deliverables ?? []) : '') }}"
                           placeholder="UI/UX Design, Frontend, Backend, API"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 outline-none focus:border-neutral-500">
                </div>
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm text-neutral-300">Technologies / Tags (pisahkan dengan koma)</label>
                    <input type="text" name="technologies" value="{{ old('technologies', $project ? implode(', ', $project->technologies ?? []) : '') }}"
                           placeholder="Laravel, Vue, PostgreSQL"
                           class="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2.5 outline-none focus:border-neutral-500">
                </div>
                <div class="md:col-span-2">
                    <label class="mb-1 block text-sm text-neutral-300">Action Buttons</label>
                    <div id="actions-container" class="space-y-3"></div>
                    <button type="button" id="actions-add" class="mt-3 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white">
                        <span class="material-symbols-outlined text-base">add</span> Tambah button
                    </button>
                    <textarea name="actions" id="actions-input" class="hidden">{{ old('actions', $project ? implode("\n", array_map(fn ($a) => ($a['label'] ?? '').' | '.($a['url'] ?? '#'), $project->actions ?? [])) : '') }}</textarea>
                </div>
            </div>
        </section>

        {{-- Media --}}
        <section class="rounded-xl border border-neutral-800 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Media</h2>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <x-image-dropzone id="hero" name="hero_image" label="Hero Image (16:8)" removeName="remove_hero"
                    :src="$project && $project->hero_image ? asset('storage/'.$project->hero_image) : ''"
                    aspect="aspect-[16/8]" />

                <x-image-dropzone id="card" name="card_image" label="Card Image (16:9)" removeName="remove_card"
                    :src="$project && $project->card_image ? asset('storage/'.$project->card_image) : ''"
                    aspect="aspect-video" />
            </div>

            <div class="mt-6">
                <label class="mb-1 block text-sm text-neutral-300">Gallery (gif, jpg/png, webp, mp4 — multi)</label>
                <div id="gallery-dropzone" class="flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-neutral-700 bg-neutral-950">
                    <span class="material-symbols-outlined text-5xl text-neutral-600">add_photo_alternate</span>
                </div>
                <input type="file" id="gallery-input" name="gallery[]" multiple class="hidden"
                       accept="image/jpeg,image/png,image/webp,image/gif,video/mp4">

                <div id="gallery-preview" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"></div>
            </div>

            @if ($project && $project->galleries->isNotEmpty())
                <div class="mt-6">
                    <p class="mb-2 text-sm text-neutral-400">Galeri saat ini (klik × untuk hapus):</p>
                    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        @foreach ($project->galleries as $gallery)
                            <div class="gallery-item relative overflow-hidden rounded-md border border-neutral-700">
                                <input type="checkbox" name="remove_gallery[]" value="{{ $gallery->id }}" class="hidden">
                                @if ($gallery->isVideo())
                                    <video src="{{ asset('storage/'.$gallery->media) }}" controls class="h-28 w-full object-cover"></video>
                                @else
                                    <img src="{{ asset('storage/'.$gallery->media) }}" alt="Gallery" class="h-28 w-full object-cover">
                                @endif
                                <button type="button" class="gallery-remove-btn absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                                    <span class="material-symbols-outlined text-base">close</span>
                                </button>
                                <span class="block truncate px-2 py-1 text-xs text-neutral-300">{{ basename($gallery->media) }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </section>

        {{-- WYSIWYG content --}}
        <section class="rounded-xl border border-neutral-800 p-6">
            <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Content</h2>

            <div class="mb-6">
                <label class="mb-1 block text-sm text-neutral-300">Project Showcase</label>
                <div id="showcase-editor" data-ckeditor="showcase-input"></div>
                <textarea name="showcase" id="showcase-input" class="hidden">{{ old('showcase', $project ? $project->showcase : '<h2>Challenge</h2><p><br></p><h2>Solution</h2><p><br></p>') }}</textarea>
            </div>

            <div>
                <label class="mb-1 block text-sm text-neutral-300">Article</label>
                <div id="article-editor" data-ckeditor="article-input"></div>
                <textarea name="article" id="article-input" class="hidden">{{ old('article', $project->article ?? '') }}</textarea>
            </div>
        </section>

        {{-- Publish --}}
        <section class="flex items-center justify-between rounded-xl border border-neutral-800 p-6">
            <label class="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" name="published" value="1" @checked(old('published', $project->published ?? true)) class="h-4 w-4 accent-emerald-600">
                Published
            </label>
            <button type="submit" class="btn btn--primary">
                {{ $project ? 'Simpan Perubahan' : 'Buat Project' }}
            </button>
        </section>
    </form>
@endsection
