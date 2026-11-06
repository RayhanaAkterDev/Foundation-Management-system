<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpRequestEvidence extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Evidence Sources
    |--------------------------------------------------------------------------
    |
    | original  = Evidence submitted with the initial Help Request.
    | additional = Evidence submitted after an admin request.
    |
    */

    public const SOURCE_ORIGINAL = 'original';
    public const SOURCE_ADDITIONAL = 'additional';

    /*
    |--------------------------------------------------------------------------
    | Mass Assignable Attributes
    |--------------------------------------------------------------------------
    */

    protected $fillable = [
        'help_request_id',
        'uploaded_by',
        'evidence_request_id',
        'source',
        'file_name',
        'file_id',
        'file_path',
        'mime_type',
        'file_size',
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
    | User Who Uploaded the Evidence
    |--------------------------------------------------------------------------
    */

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'uploaded_by'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Related Additional Evidence Request
    |--------------------------------------------------------------------------
    */

    public function evidenceRequest(): BelongsTo
    {
        return $this->belongsTo(
            HelpRequestEvidenceRequest::class,
            'evidence_request_id'
        );
    }
}
