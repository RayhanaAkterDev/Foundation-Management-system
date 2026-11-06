<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HelpRequestEvidenceRequest extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Mass Assignable Attributes
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'help_request_id',
        'requested_by',
        'message',
        'status',
        'submitted_at',
    ];

    /*
    |--------------------------------------------------------------------------
    | Help Request
    |--------------------------------------------------------------------------
    */

    public function helpRequest(): BelongsTo
    {
        return $this->belongsTo(
            HelpRequest::class,
            'help_request_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Admin Who Requested Evidence
    |--------------------------------------------------------------------------
    */

    public function requester(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'requested_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Submitted Evidence Files
    |--------------------------------------------------------------------------
    */

    public function evidences(): HasMany
    {
        return $this->hasMany(
            HelpRequestEvidence::class,
            'evidence_request_id'
        );
    }
}
