<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpRequestAssignment extends Model
{
    protected $fillable = [
        'help_request_id',
        'organization_id',
        'volunteer_id',
        'assigned_by',
        'status',
        'notes',
    ];

    public function helpRequest(): BelongsTo
    {
        return $this->belongsTo(HelpRequest::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(Volunteer::class);
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
