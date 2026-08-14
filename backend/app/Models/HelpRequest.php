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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(HelpRequestAssignment::class);
    }

    public function syncStatusFromAssignments(): void
    {
        $assignments = $this->assignments()->get();

        if ($assignments->isEmpty()) {
            return;
        }

        if ($assignments->contains('status', 'in_progress')) {
            $this->update([
                'status' => 'in_progress',
            ]);

            return;
        }

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

        $completedAssignments = $assignments->where('status', 'completed');

        if ($completedAssignments->isNotEmpty()) {
            $this->update([
                'status' => 'completed',
            ]);

            return;
        }

        $this->update([
            'status' => 'verified',
        ]);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }
}
