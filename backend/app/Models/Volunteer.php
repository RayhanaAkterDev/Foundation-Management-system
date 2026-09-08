<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Volunteer extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_SUSPENDED = 'suspended';
    public const STATUS_REMOVED = 'removed';

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_ACTIVE,
            self::STATUS_REJECTED,
            self::STATUS_SUSPENDED,
            self::STATUS_REMOVED,
        ];
    }

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
    | Campaign Volunteer Assignments
    |--------------------------------------------------------------------------
    |
    | Volunteers are assigned to campaigns, never directly to Help Requests.
    |
    | campaign_volunteer_assignments.volunteer_id stores users.id.
    |
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
