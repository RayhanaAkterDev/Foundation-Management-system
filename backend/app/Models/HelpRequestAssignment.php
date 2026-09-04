<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpRequestAssignment extends Model
{
    use HasFactory;

    /*
    |--------------------------------------------------------------------------
    | Assignment Statuses
    |--------------------------------------------------------------------------
    |
    | Organization:
    |
    | pending -> accepted -> in_progress -> completed
    | pending -> rejected
    |
    | Withdrawal:
    |
    | accepted/in_progress
    |        ↓
    | withdrawal_status = pending
    |        ↓
    | Admin approves
    |        ↓
    | status = withdrawn
    |
    | "pending" means Admin has sent the assignment to the
    | organization but the organization has not accepted it yet.
    |
    | "accepted" means the organization has accepted the assignment
    | and is therefore considered assigned.
    |
    | "withdrawn" means Admin has approved the organization's
    | withdrawal request and this assignment is no longer active.
    |
    */

    public const STATUS_PENDING = 'pending';

    public const STATUS_ASSIGNED = 'assigned';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_WITHDRAWN = 'withdrawn';

    /*
    |--------------------------------------------------------------------------
    | Withdrawal Statuses
    |--------------------------------------------------------------------------
    |
    | null     -> no withdrawal request
    | pending  -> organization requested withdrawal
    | approved -> admin approved withdrawal
    | rejected -> admin rejected withdrawal
    |
    */

    public const WITHDRAWAL_PENDING = 'pending';

    public const WITHDRAWAL_APPROVED = 'approved';

    public const WITHDRAWAL_REJECTED = 'rejected';

    /**
     * Return all valid assignment statuses.
     */
    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_ASSIGNED,
            self::STATUS_ACCEPTED,
            self::STATUS_REJECTED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_COMPLETED,
            self::STATUS_WITHDRAWN,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'help_request_id',
        'organization_id',
        'volunteer_id',
        'assigned_by',
        'status',
        'assignment_note',
        'rejection_note',
        'assigned_at',
        'completed_at',

        // Withdrawal fields
        'withdrawal_status',
        'withdrawal_reason',
        'withdrawal_requested_at',
        'withdrawal_reviewed_at',
        'withdrawal_reviewed_by',
    ];

    /*
    |--------------------------------------------------------------------------
    | Attribute Casting
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
        'withdrawal_requested_at' => 'datetime',
        'withdrawal_reviewed_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Help request associated with this assignment.
     */
    public function helpRequest(): BelongsTo
    {
        return $this->belongsTo(
            HelpRequest::class,
            'help_request_id'
        );
    }

    /**
     * Organization associated with this assignment.
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(
            Organization::class,
            'organization_id'
        );
    }

    /**
     * Volunteer associated with this assignment.
     *
     * IMPORTANT:
     * volunteer_id stores users.id, not volunteers.id.
     */
    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'volunteer_id'
        );
    }

    /**
     * Admin who created the assignment.
     *
     * assigned_by stores users.id.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_by'
        );
    }

    /**
     * Admin who reviewed the withdrawal request.
     *
     * withdrawal_reviewed_by stores users.id.
     */
    public function withdrawalReviewedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'withdrawal_reviewed_by'
        );
    }
}
