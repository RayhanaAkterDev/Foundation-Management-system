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

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    |
    | Every volunteer belongs to an existing individual User.
    |
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Organization
    |--------------------------------------------------------------------------
    |
    | Optional. A volunteer may or may not belong to an organization.
    |
    */

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Help Request Assignments
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | help_request_assignments.volunteer_id
    | stores users.id.
    |
    | This Volunteer model stores:
    |
    | volunteers.user_id
    |
    | Therefore:
    |
    | volunteers.user_id
    |          ↓
    | help_request_assignments.volunteer_id
    |
    | Example:
    |
    | Volunteer #2
    | user_id = 21
    |
    | Assignment:
    | volunteer_id = 21
    |
    */

    public function helpRequestAssignments(): HasMany
    {
        return $this->hasMany(
            HelpRequestAssignment::class,
            'volunteer_id',
            'user_id'
        );
    }
}
