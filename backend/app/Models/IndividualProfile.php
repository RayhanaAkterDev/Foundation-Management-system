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
        'profile_photo',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
