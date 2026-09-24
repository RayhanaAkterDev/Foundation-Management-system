<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Volunteer extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Volunteer Statuses
    |--------------------------------------------------------------------------
    |
    | active
    |     Volunteer is currently active and may receive campaign
    |     assignments when eligible.
    |
    | inactive
    |     Volunteer is not currently active. The volunteer record and
    |     campaign history are preserved.
    |
    | suspended
    |     Volunteer is suspended by Admin and cannot receive new
    |     campaign assignments.
    |
    */

    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_SUSPENDED = 'suspended';

    public static function statuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_SUSPENDED,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment
    |--------------------------------------------------------------------------
    |
    | Volunteers are fully owned and managed by Stand For People.
    |
    | A volunteer belongs only to an individual user.
    | Organizations have no involvement in the volunteer system.
    |
    | Actual volunteers table columns:
    |
    | id
    | user_id
    | skills
    | status
    | created_at
    | updated_at
    |
    */

    protected $fillable = [
        'user_id',
        'skills',
        'status',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Volunteer belongs to an individual user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    /**
     * Campaign assignments use users.id as volunteer_id,
     * not volunteers.id.
     */
    public function campaignVolunteerAssignments(): HasMany
    {
        return $this->hasMany(
            CampaignVolunteerAssignment::class,
            'volunteer_id',
            'user_id'
        );
    }
}
