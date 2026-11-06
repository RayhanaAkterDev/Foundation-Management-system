<?php

namespace App\Rules;

class HelpRequestEvidenceRules
{
    /**
     * Maximum number of files per upload submission.
     */
    public const MAX_FILES = 5;

    /**
     * Maximum individual file size: 20 MB.
     */
    public const MAX_FILE_SIZE_KB = 20480;

    /**
     * Maximum combined upload size: 35 MB.
     */
    public const MAX_TOTAL_SIZE_KB = 35840;

    /**
     * Allowed MIME types.
     */
    public const ALLOWED_MIME_TYPES = [
        // Images
        'image/jpeg',
        'image/png',
        'image/webp',

        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

        // Audio
        'audio/mpeg',
        'audio/wav',
        'audio/x-wav',
        'audio/mp4',
        'audio/x-m4a',

        // Video
        'video/mp4',
        'video/quicktime',
    ];

    /**
     * Allowed file extensions.
     */
    public const ALLOWED_EXTENSIONS = [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'pdf',
        'doc',
        'docx',
        'mp3',
        'wav',
        'm4a',
        'mp4',
        'mov',
    ];

    /**
     * Laravel validation rules for multiple evidence files.
     */
    public static function rules(): array
    {
        return [
            'evidences' => [
                'required',
                'array',
                'min:1',
                'max:' . self::MAX_FILES,
            ],

            'evidences.*' => [
                'required',
                'file',
                'max:' . self::MAX_FILE_SIZE_KB,
                'mimetypes:' . implode(',', self::ALLOWED_MIME_TYPES),
                'extensions:' . implode(',', self::ALLOWED_EXTENSIONS),
            ],
        ];
    }

    /**
     * Validate the combined upload size.
     */
    public static function totalSizeIsValid(array $files): bool
    {
        $totalSize = 0;

        foreach ($files as $file) {
            if (!$file || !$file->isValid()) {
                return false;
            }

            $totalSize += $file->getSize();
        }

        return $totalSize <= self::MAX_TOTAL_SIZE_KB * 1024;
    }
}
