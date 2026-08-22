<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HelpRequest extends Model
{
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
        return $this->hasMany(HelpRequestAssignment::class);
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
    | Synchronize status from assignments
    |--------------------------------------------------------------------------
    */

    public function syncStatusFromAssignments(): void
    {
        $assignments = $this->assignments()->get();

        if ($assignments->isEmpty()) {
            return;
        }

        // Any assignment currently in progress
        if ($assignments->contains('status', 'in_progress')) {
            $this->update([
                'status' => 'in_progress',
            ]);

            return;
        }

        // At least one assignment is assigned or accepted
        $activeAssignments = $assignments->whereIn('status', [
            'assigned',
            'accepted',
        ]);

        if ($activeAssignments->isNotEmpty()) {
            $this->update([
                'status' => 'assigned',
            ]);

            return;
        }

        // At least one assignment has been completed
        $completedAssignments = $assignments->where(
            'status',
            'completed'
        );

        if ($completedAssignments->isNotEmpty()) {
            $this->update([
                'status' => 'completed',
            ]);

            return;
        }

        // If assignments exist but none are active/completed,
        // keep the help request verified.
        $this->update([
            'status' => 'verified',
        ]);
    }
}
