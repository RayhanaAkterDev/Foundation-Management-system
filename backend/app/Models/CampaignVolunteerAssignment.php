<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignVolunteerAssignment extends Model
{
    protected $fillable = [
        'campaign_id',
        'volunteer_id',
        'assigned_by',
        'status',
        'assignment_note',
        'assigned_at',
        'completed_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Campaign
    |--------------------------------------------------------------------------
    */

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Volunteer
    |--------------------------------------------------------------------------
    |
    | volunteer_id points to users.id.
    |
    */

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'volunteer_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Assigned By
    |--------------------------------------------------------------------------
    |
    | assigned_by points to users.id.
    |
    */

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
