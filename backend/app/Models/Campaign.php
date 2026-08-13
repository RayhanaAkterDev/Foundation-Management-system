<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    protected $fillable = [
        'organization_id',
        'help_request_id',
        'source_type',
        'created_by',
        'title',
        'description',
        'category',
        'district',
        'location',
        'target_amount',
        'collected_amount',
        'status',
        'start_date',
        'end_date',
        'cover_image',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function helpRequest(): BelongsTo
    {
        return $this->belongsTo(HelpRequest::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function volunteerAssignments(): HasMany
    {
        return $this->hasMany(CampaignVolunteerAssignment::class);
    }
}
