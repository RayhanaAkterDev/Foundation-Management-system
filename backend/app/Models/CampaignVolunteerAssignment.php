<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignVolunteerAssignment extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Assignment Statuses
    |--------------------------------------------------------------------------
    |
    | assigned
    |     Admin assigned the volunteer to a campaign.
    |     The assignment is waiting for the volunteer's response.
    |
    | accepted
    |     Volunteer accepted the assignment.
    |
    | rejected
    |     Volunteer rejected the assignment.
    |
    | in_progress
    |     Volunteer has started working on the campaign.
    |
    | completed
    |     Volunteer completed the campaign assignment.
    |
    | withdrawal_requested
    |     Volunteer requested withdrawal and Admin has not reviewed it.
    |
    | withdrawn
    |     Admin approved the withdrawal request.
    |
    */

    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_WITHDRAWAL_REQUESTED = 'withdrawal_requested';
    public const STATUS_WITHDRAWN = 'withdrawn';

    public static function statuses(): array
    {
        return [
            self::STATUS_ASSIGNED,
            self::STATUS_ACCEPTED,
            self::STATUS_REJECTED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_COMPLETED,
            self::STATUS_WITHDRAWAL_REQUESTED,
            self::STATUS_WITHDRAWN,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Occupied Assignment Statuses
    |--------------------------------------------------------------------------
    |
    | These statuses make a volunteer unavailable for another campaign.
    |
    | assigned
    |     Assignment has been offered and is still pending.
    |
    | accepted
    |     Volunteer accepted the assignment.
    |
    | in_progress
    |     Volunteer is actively working.
    |
    | withdrawal_requested
    |     Volunteer is still attached to the campaign until Admin
    |     approves the withdrawal.
    |
    */

    public static function activeStatuses(): array
    {
        return [
            self::STATUS_ASSIGNED,
            self::STATUS_ACCEPTED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_WITHDRAWAL_REQUESTED,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'campaign_id',
        'volunteer_id',
        'assigned_by',
        'status',
        'assignment_note',
        'rejection_reason',
        'rejection_validated',
        'assigned_at',
        'completed_at',
        'withdrawal_reason',
        'withdrawal_requested_at',
        'withdrawal_reviewed_at',
        'withdrawal_reviewed_by',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'rejection_validated' => 'boolean',
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
        'withdrawal_requested_at' => 'datetime',
        'withdrawal_reviewed_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Campaign
    |--------------------------------------------------------------------------
    */

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(
            Campaign::class,
            'campaign_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Volunteer
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | volunteer_id stores users.id, NOT volunteers.id.
    |
    */

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'volunteer_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Assigned By
    |--------------------------------------------------------------------------
    |
    | assigned_by stores users.id of the Admin who created
    | the campaign assignment.
    |
    */

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Withdrawal Reviewed By
    |--------------------------------------------------------------------------
    |
    | withdrawal_reviewed_by stores users.id of the Admin who
    | reviewed the withdrawal request.
    |
    */

    public function withdrawalReviewedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'withdrawal_reviewed_by'
        );
    }
}
