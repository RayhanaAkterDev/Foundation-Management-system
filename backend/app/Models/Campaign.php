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

    public const STATUS_UNVERIFIED = 'unverified';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const URGENCY_PRIORITY_LOW = 1;
    public const URGENCY_PRIORITY_MEDIUM = 2;
    public const URGENCY_PRIORITY_HIGH = 3;
    public const URGENCY_PRIORITY_CRITICAL = 4;

    /**
     * AI urgency labels.
     *
     * These are recommendations only. They do not replace the
     * admin-approved is_urgent and urgency_priority fields.
     */
    public const AI_URGENCY_LOW = 'low';
    public const AI_URGENCY_NORMAL = 'normal';
    public const AI_URGENCY_HIGH = 'high';
    public const AI_URGENCY_CRITICAL = 'critical';

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

        // Admin-approved public campaign classification.
        'is_featured',
        'is_urgent',
        'urgency_priority',

        // AI-generated urgency recommendation.
        'ai_urgency',
        'ai_urgency_priority',
        'ai_urgency_reason',
        'ai_urgency_assessed_at',

        // Admin review of the AI recommendation.
        'ai_urgency_reviewed_at',
        'ai_urgency_reviewed_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'proposal_date' => 'date',
        'verified_at' => 'datetime',
        'target_amount' => 'decimal:2',
        'collected_amount' => 'decimal:2',

        // Admin-approved public campaign classification.
        'is_featured' => 'boolean',
        'is_urgent' => 'boolean',
        'urgency_priority' => 'integer',

        // AI urgency assessment.
        'ai_urgency_priority' => 'integer',
        'ai_urgency_assessed_at' => 'datetime',

        // Admin review.
        'ai_urgency_reviewed_at' => 'datetime',
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

    public function aiUrgencyReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ai_urgency_reviewed_by');
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
            self::STATUS_UNVERIFIED,
            self::STATUS_ACTIVE,
            self::STATUS_REJECTED,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
        ];
    }

    public static function urgencyPriorities(): array
    {
        return [
            self::URGENCY_PRIORITY_LOW,
            self::URGENCY_PRIORITY_MEDIUM,
            self::URGENCY_PRIORITY_HIGH,
            self::URGENCY_PRIORITY_CRITICAL,
        ];
    }

    public static function aiUrgencies(): array
    {
        return [
            self::AI_URGENCY_LOW,
            self::AI_URGENCY_NORMAL,
            self::AI_URGENCY_HIGH,
            self::AI_URGENCY_CRITICAL,
        ];
    }
}
