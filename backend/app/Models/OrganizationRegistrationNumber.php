<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationRegistrationNumber extends Model
{
    protected $fillable = [
        'organization_id',
        'registration_number',
        'organization_type',
        'sequence_number',
        'registration_year',
        'status',
        'issued_at',
        'retired_at',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
            'retired_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
