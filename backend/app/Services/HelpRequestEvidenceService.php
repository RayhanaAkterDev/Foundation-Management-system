<?php

namespace App\Services;

use ImageKit\ImageKit;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

class HelpRequestEvidenceService
{
    private function imageKit(): ImageKit
    {
        $publicKey = config('services.imagekit.public_key');
        $privateKey = config('services.imagekit.private_key');
        $urlEndpoint = config('services.imagekit.url_endpoint');

        if (!$publicKey || !$privateKey || !$urlEndpoint) {
            throw new RuntimeException(
                'ImageKit configuration is incomplete.'
            );
        }

        return new ImageKit(
            $publicKey,
            $privateKey,
            $urlEndpoint
        );
    }

    /**
     * Upload a private help request evidence file.
     */
    public function uploadPrivateFile(UploadedFile $file): array
    {
        $fileContents = file_get_contents($file->getRealPath());

        if ($fileContents === false) {
            throw new RuntimeException(
                'Unable to read the uploaded evidence file.'
            );
        }

        $extension = strtolower(
            $file->getClientOriginalExtension()
        );

        $storedFileName = (string) Str::uuid();

        if ($extension !== '') {
            $storedFileName .= '.' . $extension;
        }

        $response = $this->imageKit()->uploadFile([
            'file' => base64_encode($fileContents),
            'fileName' => $storedFileName,
            'folder' => '/help-request-evidence',
            'useUniqueFileName' => true,
            'isPrivateFile' => true,
        ]);

        if (!$response || $response->error !== null) {
            throw new RuntimeException(
                'ImageKit evidence upload failed.'
            );
        }

        $result = $response->result ?? null;

        if (
            !is_object($result) ||
            empty($result->fileId) ||
            empty($result->filePath)
        ) {
            throw new RuntimeException(
                'ImageKit returned an incomplete upload response.'
            );
        }

        return [
            'file_id' => $result->fileId,
            'file_path' => $result->filePath,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType()
                ?: 'application/octet-stream',
            'file_size' => (int) $file->getSize(),
        ];
    }

    /**
     * Generate a temporary signed URL for private evidence access.
     */
    public function generateSignedUrl(string $filePath): string
    {
        if (trim($filePath) === '') {
            throw new RuntimeException(
                'A valid ImageKit file path is required.'
            );
        }

        $url = $this->imageKit()->url([
            'path' => ltrim($filePath, '/'),
            'signed' => true,
            'expireSeconds' => 300,
        ]);

        if (
            !is_string($url) ||
            !filter_var($url, FILTER_VALIDATE_URL)
        ) {
            throw new RuntimeException(
                'Unable to generate a signed evidence URL.'
            );
        }

        return $url;
    }

    /**
     * Delete a previously uploaded ImageKit file.
     */
    public function deleteFile(string $fileId): void
    {
        if ($fileId === '') {
            throw new RuntimeException(
                'A valid ImageKit file ID is required.'
            );
        }

        $response = $this->imageKit()->deleteFile($fileId);

        if (!$response || $response->error !== null) {
            throw new RuntimeException(
                'Unable to delete the ImageKit evidence file.'
            );
        }
    }
}
