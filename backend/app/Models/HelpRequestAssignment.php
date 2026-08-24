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
    | These statuses belong ONLY to an assignment.
    |
    | They must NOT be added to HelpRequest statuses.
    |
    */

    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';

    /**
     * Get all valid assignment statuses.
     */
    public static function statuses(): array
    {
        return [
            self::STATUS_ASSIGNED,
            self::STATUS_ACCEPTED,
            self::STATUS_REJECTED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_COMPLETED,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Mass Assignable Attributes
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'help_request_id',
        'organization_id',
        'volunteer_id',
        'assigned_by',
        'status',
        'assignment_note',
        'assigned_at',
        'completed_at',
    ];

    /*
    |--------------------------------------------------------------------------
    | Attribute Casting
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
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
    | Organization
    |--------------------------------------------------------------------------
    |
    | Optional.
    |
    | An assignment can be:
    |
    | 1. Organization only
    | 2. Volunteer only
    | 3. Organization + volunteer
    |
    */

    public function organization(): BelongsTo
    {
        return $this->belongsTo(
            Organization::class,
            'organization_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Volunteer
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | volunteer_id stores users.id, NOT volunteers.id.
    |
    | Volunteer is a profile/activity belonging to an
    | individual User.
    |
    | help_request_assignments.volunteer_id
    |              ↓
    | users.id
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
    | assigned_by stores users.id of the admin who created
    | the assignment.
    |
    */

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_by'
        );
    }
}
