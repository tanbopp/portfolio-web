<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectGallery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ProjectController extends Controller
{
    public function index(): View
    {
        // Avoid selecting the large WYSIWYG columns (article/showcase) for the list.
        $projects = Project::withCount('galleries')
            ->select(['id', 'title', 'slug', 'work_for', 'year', 'published', 'created_at'])
            ->orderByDesc('created_at')
            ->get();

        return view('admin.projects.index', compact('projects'));
    }

    public function create(): View
    {
        return view('admin.projects.form', ['project' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $project = Project::create($this->validatedData($request));

        $this->storeHero($project, $request);
        $this->storeCard($project, $request);
        $this->storeGallery($project, $request);

        return redirect()->route('admin.projects.edit', $project)
            ->with('status', 'Proyek berhasil dibuat.');
    }

    public function edit(Project $project): View
    {
        return view('admin.projects.form', compact('project'));
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $project->update($this->validatedData($request));

        $this->storeHero($project, $request);
        $this->storeCard($project, $request);
        $this->deleteRemovedGallery($request);
        $this->storeGallery($project, $request);

        return redirect()->route('admin.projects.edit', $project)
            ->with('status', 'Proyek berhasil diperbarui.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        Storage::disk('public')->deleteDirectory('projects/'.$project->id);
        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('status', 'Proyek berhasil dihapus.');
    }

    protected function validatedData(Request $request): array
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string|max:1000',
            'slug'         => 'nullable|string|max:255',
            'work_for'     => 'nullable|string|max:255',
            'year'         => 'nullable|string|max:20',
            'platform'     => 'nullable|string',
            'deliverables' => 'nullable|string',
            'technologies' => 'nullable|string',
            'actions'      => 'nullable|string',
            'showcase'     => 'nullable|string',
            'article'      => 'nullable|string',
            'published'    => 'sometimes|boolean',
            'hero_image'   => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'card_image'   => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:5120',
            'gallery.*'    => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,mp4|max:51200',
        ]);

        return [
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'slug'         => $validated['slug'] ?: Str::slug($validated['title']),
            'work_for'     => $validated['work_for'] ?? null,
            'year'         => $validated['year'] ?? null,
            'platform'     => $this->toLines($validated['platform'] ?? null),
            'deliverables' => $this->toList($validated['deliverables'] ?? null),
            'technologies' => $this->toList($validated['technologies'] ?? null),
            'actions'      => $this->toActions($validated['actions'] ?? null),
            'showcase'     => $validated['showcase'] ?? null,
            'article'      => $validated['article'] ?? null,
            'published'    => $request->boolean('published'),
        ];
    }

    protected function storeHero(Project $project, Request $request): void
    {
        if ($request->hasFile('hero_image')) {
            if ($project->hero_image) {
                Storage::disk('public')->delete($project->hero_image);
            }

            $project->hero_image = $request->file('hero_image')
                ->store('projects/'.$project->id, 'public');
            $project->save();
        }

        if ($request->boolean('remove_hero') && $project->hero_image) {
            Storage::disk('public')->delete($project->hero_image);
            $project->hero_image = null;
            $project->save();
        }
    }

    protected function storeCard(Project $project, Request $request): void
    {
        if ($request->hasFile('card_image')) {
            if ($project->card_image) {
                Storage::disk('public')->delete($project->card_image);
            }

            $project->card_image = $request->file('card_image')
                ->store('projects/'.$project->id, 'public');
            $project->save();
        }

        if ($request->boolean('remove_card') && $project->card_image) {
            Storage::disk('public')->delete($project->card_image);
            $project->card_image = null;
            $project->save();
        }
    }

    protected function storeGallery(Project $project, Request $request): void
    {
        if (! $request->hasFile('gallery')) {
            return;
        }

        $sort = $project->galleries()->count();

        foreach ($request->file('gallery') as $file) {
            $mediaType = str_starts_with($file->getMimeType(), 'video/') ? 'video' : 'image';

            ProjectGallery::create([
                'project_id' => $project->id,
                'media'      => $file->store('projects/'.$project->id, 'public'),
                'media_type' => $mediaType,
                'sort_order' => $sort++,
            ]);
        }
    }

    protected function deleteRemovedGallery(Request $request): void
    {
        if (! $request->has('remove_gallery')) {
            return;
        }

        foreach ((array) $request->input('remove_gallery') as $id) {
            $item = ProjectGallery::find($id);
            if ($item) {
                Storage::disk('public')->delete($item->media);
                $item->delete();
            }
        }
    }

    protected function toList(?string $value): array
    {
        if ($value === null || trim($value) === '') {
            return [];
        }

        return array_values(array_filter(
            array_map('trim', explode(',', $value)),
            fn ($item) => $item !== ''
        ));
    }

    protected function toLines(?string $value): array
    {
        if ($value === null || trim($value) === '') {
            return [];
        }

        return array_values(array_filter(
            array_map('trim', preg_split('/\r\n|\r|\n/', $value)),
            fn ($item) => $item !== ''
        ));
    }

    protected function toActions(?string $value): array
    {
        if ($value === null || trim($value) === '') {
            return [];
        }

        $actions = [];

        foreach (preg_split('/\r\n|\r|\n/', $value) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $parts = array_map('trim', explode('|', $line, 2));
            $actions[] = ['label' => $parts[0], 'url' => $parts[1] ?? '#'];
        }

        return $actions;
    }
}
