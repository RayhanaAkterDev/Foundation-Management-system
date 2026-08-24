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
    | Assignment statuses such as "assigned", "accepted", etc.
    | do NOT belong here.
    |
    */

    public const STATUS_PENDING = 'pending';
    public const STATUS_VERIFIED = 'verified';
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
    |
    | One Help Request can have multiple assignment rows.
    |
    | Examples:
    |
    | Organization only:
    |   organization_id = 10
    |   volunteer_id = null
    |
    | Volunteer only:
    |   organization_id = null
    |   volunteer_id = 21
    |
    | Organization + volunteers:
    |   multiple assignment rows
    |
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
    |
    | A Help Request may be used as the basis for campaigns.
    |
    */

    public function campaigns(): HasMany
    {
        return $this->hasMany(
            Campaign::class
        );
    }
}
