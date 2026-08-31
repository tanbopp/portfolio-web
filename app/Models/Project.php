<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'slug',
        'work_for',
        'year',
        'deliverables',
        'platform',
        'technologies',
        'actions',
        'showcase',
        'article',
        'hero_image',
        'card_image',
        'published',
    ];

    protected $casts = [
        'deliverables' => 'array',
        'platform'     => 'array',
        'technologies' => 'array',
        'actions'      => 'array',
        'published'    => 'boolean',
    ];

    public function galleries(): HasMany
    {
        return $this->hasMany(ProjectGallery::class)->orderBy('sort_order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
