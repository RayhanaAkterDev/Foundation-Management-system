<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpRequestDuplicateMatch extends Model
{
    protected $table = 'help_request_duplicate_matches';

    protected $fillable = [
        'help_request_id',
        'matched_help_request_id',
        'similarity_score',
        'match_reasons',
        'analysis_status',
    ];

    protected function casts(): array
    {
        return [
            'similarity_score' => 'decimal:2',
            'match_reasons' => 'array',
        ];
    }

    public function helpRequest(): BelongsTo
    {
        return $this->belongsTo(
            HelpRequest::class,
            'help_request_id'
        );
    }

    public function matchedHelpRequest(): BelongsTo
    {
        return $this->belongsTo(
            HelpRequest::class,
            'matched_help_request_id'
        );
    }
}
