@extends('admin.layouts.app')

@section('title', 'Projects')

@section('content')
    <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-thin tracking-tight">Projects</h1>
        <a href="{{ route('admin.projects.create') }}" class="btn btn--primary">+ New Project</a>
    </div>

    @if ($projects->isEmpty())
        <div class="rounded-xl border border-dashed border-neutral-800 p-12 text-center text-neutral-400">
            Belum ada project. Buat project pertama Anda.
        </div>
    @else
        <div class="overflow-hidden rounded-xl border border-neutral-800">
            <table class="w-full text-left text-sm">
                <thead class="bg-neutral-900 text-neutral-400">
                    <tr>
                        <th class="px-4 py-3 font-medium">Title</th>
                        <th class="px-4 py-3 font-medium">Work For</th>
                        <th class="px-4 py-3 font-medium">Year</th>
                        <th class="px-4 py-3 font-medium">Media</th>
                        <th class="px-4 py-3 font-medium">Status</th>
                        <th class="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-neutral-800">
                    @foreach ($projects as $project)
                        <tr class="hover:bg-neutral-900/40">
                            <td class="px-4 py-3 font-medium">
                                <a href="{{ route('projects.show', $project) }}" target="_blank" class="hover:text-neutral-300">
                                    {{ $project->title }}
                                </a>
                            </td>
                            <td class="px-4 py-3 text-neutral-400">{{ $project->work_for ?? '—' }}</td>
                            <td class="px-4 py-3 text-neutral-400">{{ $project->year ?? '—' }}</td>
                            <td class="px-4 py-3 text-neutral-400">{{ $project->galleries_count }} files</td>
                            <td class="px-4 py-3">
                                <span class="rounded px-2 py-0.5 text-xs {{ $project->published ? 'bg-emerald-900/50 text-emerald-300' : 'bg-neutral-800 text-neutral-400' }}">
                                    {{ $project->published ? 'Published' : 'Draft' }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <a href="{{ route('admin.projects.edit', $project) }}" class="text-neutral-300 hover:text-white">Edit</a>
                                    <form method="POST" action="{{ route('admin.projects.destroy', $project) }}" onsubmit="return confirm('Hapus project ini?');">
                                        @csrf
                                        @method('DELETE')
                                        <button class="text-red-400 hover:text-red-300">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
@endsection
