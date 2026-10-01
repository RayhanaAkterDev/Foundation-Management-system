<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndividualProfile extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'district',
        'address',
        'date_of_birth',
        'participation_preferences',
        'category_preferences',
    ];

    protected function casts(): array
    {
        return [
            'participation_preferences' => 'array',
            'category_preferences' => 'array',
            'date_of_birth' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
