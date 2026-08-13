<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'organization_type',
        'registration_number',
        'phone',
        'website',
        'address',
        'mission',
        'focus_areas',
        'communities_served',
        'team_size',
        'primary_activities',
        'logo',
        'verification_status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function helpRequestAssignments(): HasMany
    {
        return $this->hasMany(HelpRequestAssignment::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }
}
