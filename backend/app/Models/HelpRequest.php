<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HelpRequest extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Help Request Statuses
    |--------------------------------------------------------------------------
    |
    | Help Request lifecycle:
    |
    | pending -> verified -> in_progress -> completed
    |               |
    |               └──────> rejected
    |
    | Assignment statuses such as "assigned", "accepted",
    | "withdrawn", etc. do NOT belong here.
    |
    */

    public const STATUS_PENDING = 'pending';
    public const STATUS_VERIFIED = 'verified';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_COMPLETED = 'completed';

    /**
     * Get all valid Help Request statuses.
     */
    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_VERIFIED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_REJECTED,
            self::STATUS_COMPLETED,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Mass Assignable Attributes
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'district',
        'address',
        'urgency',
        'status',
        'verification_note',
        'contact_phone',
    ];

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    |
    | The individual who submitted the Help Request.
    |
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Assignments
    |--------------------------------------------------------------------------
    */

    public function assignments(): HasMany
    {
        return $this->hasMany(
            HelpRequestAssignment::class,
            'help_request_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Campaigns
    |--------------------------------------------------------------------------
    */

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Evidence Requests
    |--------------------------------------------------------------------------
    |
    | Admin requests for additional evidence.
    | These requests do not change the Help Request status.
    |
    */

    public function evidenceRequests(): HasMany
    {
        return $this->hasMany(
            HelpRequestEvidenceRequest::class,
            'help_request_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Evidences
    |--------------------------------------------------------------------------
    |
    | Original evidence and additional evidence uploaded
    | in response to admin requests.
    |
    */

    public function evidences(): HasMany
    {
        return $this->hasMany(
            HelpRequestEvidence::class,
            'help_request_id'
        );
    }
}
