<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'about',
        'support_types',
        'image',
        'active',
        'featured',
    ];

    protected $casts = [
        'active' => 'boolean',
        'featured' => 'boolean',
        'support_types' => 'array',
    ];

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class, 'category', 'name');
    }
}
