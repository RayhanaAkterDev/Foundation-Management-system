<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    protected $fillable = [
        'organization_id',
        'help_request_id',
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
}
