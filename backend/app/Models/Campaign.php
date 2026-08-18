<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    public const TYPE_LOCAL_CASE = 'local_case';
    public const TYPE_ORGANIZATION_PROPOSED = 'organization_proposed';
    public const TYPE_GLOBAL_SITUATION = 'global_situation';

    public const STATUS_PENDING_REVIEW = 'pending_review';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'organization_id',
        'help_request_id',
        'type',
        'created_by',
        'verified_by',
        'verified_at',
        'verification_note',
        'title',
        'description',
        'category',
        'scope',
        'district',
        'location',
        'affected_areas',
        'target_amount',
        'collected_amount',
        'status',
        'start_date',
        'end_date',
        'proposal_date',
        'cover_image',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'proposal_date' => 'date',
        'verified_at' => 'datetime',
        'target_amount' => 'decimal:2',
        'collected_amount' => 'decimal:2',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function helpRequest(): BelongsTo
    {
        return $this->belongsTo(HelpRequest::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function volunteerAssignments(): HasMany
    {
        return $this->hasMany(CampaignVolunteerAssignment::class);
    }

    public static function types(): array
    {
        return [
            self::TYPE_LOCAL_CASE,
            self::TYPE_ORGANIZATION_PROPOSED,
            self::TYPE_GLOBAL_SITUATION,
        ];
    }

    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING_REVIEW,
            self::STATUS_PUBLISHED,
            self::STATUS_ACTIVE,
            self::STATUS_IN_PROGRESS,
            self::STATUS_COMPLETED,
            self::STATUS_REJECTED,
            self::STATUS_CANCELLED,
        ];
    }
}
