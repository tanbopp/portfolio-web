<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\View\View;

class ProjectController extends Controller
{
    public function show(string $slug): View
    {
        $project = Project::where('slug', $slug)
            ->where('published', true)
            ->with('galleries')
            ->firstOrFail();

        return view('projects.show', compact('project'));
    }
}
