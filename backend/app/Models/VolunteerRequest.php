<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolunteerRequest extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Volunteer Request Statuses
    |--------------------------------------------------------------------------
    |
    | pending
    |     Waiting for the receiver to respond.
    |
    | accepted
    |     Receiver accepted the request.
    |     A Volunteer profile is created/activated.
    |
    | rejected
    |     Receiver rejected the request.
    |
    | cancelled
    |     Sender cancelled the pending request.
    |
    */

    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_ACCEPTED,
            self::STATUS_REJECTED,
            self::STATUS_CANCELLED,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'user_id',
        'requested_by',
        'status',
        'response_note',
        'responded_at',
    ];

    /*
    |--------------------------------------------------------------------------
    | Casts
    |--------------------------------------------------------------------------
    */

    protected $casts = [
        'responded_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Volunteer User
    |--------------------------------------------------------------------------
    |
    | user_id always identifies the individual who is:
    |
    | - applying to become a volunteer, OR
    | - receiving an admin volunteer invitation.
    |
    */

    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Request Sender
    |--------------------------------------------------------------------------
    |
    | requested_by identifies who SENT the request.
    |
    | Individual application:
    |
    |   user_id     = individual
    |   requested_by = same individual
    |
    |   Individual = sender
    |   Admin      = receiver
    |
    | Admin invitation:
    |
    |   user_id     = individual
    |   requested_by = admin
    |
    |   Admin       = sender
    |   Individual  = receiver
    |
    | Therefore:
    |
    |   sender   -> may cancel while pending
    |   receiver -> may accept or reject while pending
    |
    */

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'requested_by'
        );
    }
}
