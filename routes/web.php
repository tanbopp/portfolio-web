<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\ProjectController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $projects = Project::where('published', true)
        ->orderBy('year', 'desc')
        ->get();

    return view('home', compact('projects'));
});

// Public project detail
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])
    ->name('projects.show');

// Admin (cPanel) — served from the cpanel subdomain, login at /auth
Route::domain('cpanel.tanbopp.my.id')->name('admin.')->group(function () {
    Route::get('auth', [AuthController::class, 'showLogin'])->name('login');
    Route::post('auth', [AuthController::class, 'login'])->name('login.attempt');
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    Route::middleware('admin')->group(function () {
        Route::get('/', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::get('projects/create', [AdminProjectController::class, 'create'])->name('projects.create');
        Route::post('projects', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::get('projects/{project}/edit', [AdminProjectController::class, 'edit'])->name('projects.edit');
        Route::put('projects/{project}', [AdminProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [AdminProjectController::class, 'destroy'])->name('projects.destroy');

        // WYSIWYG image upload
        Route::post('uploads/images', [UploadController::class, 'storeImage'])->name('uploads.image');
    });
});
