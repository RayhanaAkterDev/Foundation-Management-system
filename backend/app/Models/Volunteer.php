<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Volunteer extends Model
{
    protected $fillable = [
        'user_id',
        'organization_id',
        'phone',
        'district',
        'address',
        'skills',
        'availability',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function helpRequestAssignments(): HasMany
    {
        return $this->hasMany(
            HelpRequestAssignment::class,
            'volunteer_id',
            'user_id'
        );
    }
}
