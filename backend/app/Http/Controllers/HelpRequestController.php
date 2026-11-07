<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\HelpRequest;
use App\Models\HelpRequestEvidence;
use App\Models\User;
use App\Notifications\PlatformNotification;
use App\Rules\HelpRequestEvidenceRules;
use App\Services\HelpRequestAiService;
use App\Services\HelpRequestEvidenceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class HelpRequestController extends Controller
{

    /**
     * Analyze a natural-language help request.
     *
     * This endpoint only analyzes the request.
     * It does NOT create a Help Request.
     */
    public function analyze(
        Request $request,
        HelpRequestAiService $aiService
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can analyze help requests.',
            ], 403);
        }

        $validated = $request->validate([
            'description' => [
                'required',
                'string',
                'min:10',
                'max:5000',
            ],
        ]);

        try {
            $analysis = $aiService->analyze(
                $validated['description']
            );

            return response()->json([
                'message' =>
                'Help request analyzed successfully.',
                'analysis' => $analysis,
            ], 200);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' =>
                'Unable to analyze the help request right now.',
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Submit Help Request
    |--------------------------------------------------------------------------
    |
    | Only authenticated individual users can submit Help Requests.
    |
    | New Help Request:
    |
    | pending
    |
    */



    public function store(
        Request $request,
        HelpRequestEvidenceService $evidenceService
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can submit help requests.',
            ], 403);
        }

        /*
    |--------------------------------------------------------------------------
    | Validate Request
    |--------------------------------------------------------------------------
    */

        $validated = $request->validate(array_merge([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'category' => [
                'required',
                'string',
                'max:100',
            ],

            'district' => [
                'required',
                'string',
                'max:100',
            ],

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'urgency' => [
                'nullable',
                'in:low,normal,high,critical',
            ],

            'contact_phone' => [
                'nullable',
                'string',
                'max:11',
            ],
        ], HelpRequestEvidenceRules::rules()));

        /*
    |--------------------------------------------------------------------------
    | Validate Combined Evidence File Size
    |--------------------------------------------------------------------------
    */

        $evidenceFiles = $request->file('evidences', []);

        if (!HelpRequestEvidenceRules::totalSizeIsValid($evidenceFiles)) {
            return response()->json([
                'message' => 'The combined evidence file size cannot exceed 35 MB.',
                'errors' => [
                    'evidences' => [
                        'The combined evidence file size cannot exceed 35 MB.',
                    ],
                ],
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Upload Evidence and Create Help Request
    |--------------------------------------------------------------------------
    */

        $uploadedFileIds = [];

        try {
            $helpRequest = DB::transaction(function () use (
                $user,
                $validated,
                $evidenceFiles,
                $evidenceService,
                &$uploadedFileIds
            ) {
                $helpRequest = HelpRequest::create([
                    'user_id' => $user->id,
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'category' => $validated['category'],
                    'district' => $validated['district'],
                    'address' => $validated['address'] ?? null,
                    'contact_phone' => $validated['contact_phone'] ?? null,
                    'urgency' => $validated['urgency'] ?? 'normal',
                    'status' => HelpRequest::STATUS_PENDING,
                    'verification_note' => null,
                ]);

                foreach ($evidenceFiles as $file) {
                    $uploadedEvidence = $evidenceService->uploadPrivateFile(
                        $file
                    );

                    $uploadedFileIds[] = $uploadedEvidence['file_id'];

                    $helpRequest->evidences()->create([
                        'uploaded_by' => $user->id,
                        'evidence_request_id' => null,
                        'source' => HelpRequestEvidence::SOURCE_ORIGINAL,
                        'file_name' => $uploadedEvidence['file_name'],
                        'file_id' => $uploadedEvidence['file_id'],
                        'file_path' => $uploadedEvidence['file_path'],
                        'mime_type' => $uploadedEvidence['mime_type'],
                        'file_size' => $uploadedEvidence['file_size'],
                    ]);
                }

                return $helpRequest;
            });
        } catch (Throwable $exception) {
            /*
        |--------------------------------------------------------------------------
        | Clean Up Uploaded ImageKit Files if Database Operation Fails
        |--------------------------------------------------------------------------
        */

            foreach ($uploadedFileIds as $fileId) {
                try {
                    $evidenceService->deleteFile($fileId);
                } catch (Throwable $cleanupException) {
                    report($cleanupException);
                }
            }

            report($exception);

            return response()->json([
                'message' => 'Unable to submit the help request right now.',
            ], 500);
        }

        /*
    |--------------------------------------------------------------------------
    | Automatically Analyze Potential Duplicates
    |--------------------------------------------------------------------------
    |
    | Duplicate detection only records possible matches for admin review.
    | It never blocks, rejects, or changes the new help request.
    |
    */

        try {
            app(\App\Services\HelpRequestDuplicateDetectionService::class)
                ->analyze($helpRequest);
        } catch (Throwable $exception) {
            \Illuminate\Support\Facades\Log::error(
                'Automatic help request duplicate analysis failed.',
                [
                    'help_request_id' => $helpRequest->id,
                    'error' => $exception->getMessage(),
                ]
            );
        }

        /*
    |--------------------------------------------------------------------------
    | Notify Active Admins
    |--------------------------------------------------------------------------
    */

        User::where('role', 'admin')
            ->where('status', 'active')
            ->get()
            ->each(function ($admin) use ($helpRequest, $user) {
                $admin->notify(new PlatformNotification(
                    'New help request submitted',
                    "{$user->name} has submitted a new help request.",
                    "/admin/dashboard/help-requests/{$helpRequest->id}",
                    'help_request'
                ));
            });

        /*
    |--------------------------------------------------------------------------
    | Return Response
    |--------------------------------------------------------------------------
    */

        return response()->json([
            'message' => 'Help request submitted successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                    'evidences' => function ($query) {
                        $query->select([
                            'id',
                            'help_request_id',
                            'uploaded_by',
                            'evidence_request_id',
                            'source',
                            'file_name',
                            'mime_type',
                            'file_size',
                            'created_at',
                        ]);
                    },

                    'evidenceRequests' => function ($query) {
                        $query->select([
                            'id',
                            'help_request_id',
                            'requested_by',
                            'message',
                            'status',
                            'submitted_at',
                            'created_at',
                        ])->latest();
                    },
                ]),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | My Help Requests
    |--------------------------------------------------------------------------
    |
    | An individual can see only their own Help Requests.
    |
    */

    public function myRequests(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can view their help requests.',
            ], 403);
        }

        $helpRequests = HelpRequest::with([
            'assignments.organization',
            'assignments.volunteer',
            'assignments.assignedBy',
            'evidences' => function ($query) {
                $query->select([
                    'id',
                    'help_request_id',
                    'uploaded_by',
                    'evidence_request_id',
                    'source',
                    'file_name',
                    'mime_type',
                    'file_size',
                    'created_at',
                ]);
            },

            'evidenceRequests' => function ($query) {
                $query->select([
                    'id',
                    'help_request_id',
                    'requested_by',
                    'message',
                    'status',
                    'submitted_at',
                    'created_at',
                ])->latest();
            },
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'help_requests' => $helpRequests,
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Show Specific Help Request
    |--------------------------------------------------------------------------
    |
    | The requester can view only their own Help Request.
    |
    */

    public function show(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can view help requests.',
            ], 403);
        }

        $helpRequest = HelpRequest::with([
            'user',
            'assignments.organization',
            'assignments.volunteer',
            'assignments.assignedBy',
            'evidences' => function ($query) {
                $query->select([
                    'id',
                    'help_request_id',
                    'uploaded_by',
                    'evidence_request_id',
                    'source',
                    'file_name',
                    'mime_type',
                    'file_size',
                    'created_at',
                ]);
            },
        ])->find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Ownership Check
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->user_id !== $user->id) {
            return response()->json([
                'message' =>
                'You are not authorized to view this help request.',
            ], 403);
        }

        return response()->json([
            'help_request' => $helpRequest,
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Help Request
    |--------------------------------------------------------------------------
    |
    | Only the owner of a pending Help Request can edit it.
    |
    | Once admin reviews it:
    |
    | pending -> verified
    | pending -> rejected
    |
    | the requester can no longer edit it.
    |
    */

    public function update(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can update help requests.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Find Request Owned By Current User
        |--------------------------------------------------------------------------
        */

        $helpRequest = HelpRequest::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Only Pending Requests Can Be Edited
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->status !== HelpRequest::STATUS_PENDING) {
            return response()->json([
                'message' =>
                'Only pending help requests can be edited.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate PATCH Data
        |--------------------------------------------------------------------------
        |
        | "sometimes" means the frontend can send only the
        | fields that were changed.
        |
        */

        $validated = $request->validate([
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'sometimes',
                'required',
                'string',
            ],

            'category' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'district' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'address' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],

            'urgency' => [
                'sometimes',
                'required',
                'in:low,normal,high,critical',
            ],

            'contact_phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:11',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Update Only Submitted Fields
        |--------------------------------------------------------------------------
        */

        $helpRequest->update($validated);

        return response()->json([
            'message' =>
            'Help request updated successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                ]),
        ], 200);
    }

    /*
|--------------------------------------------------------------------------
| Submit Additional Help Request Evidence
|--------------------------------------------------------------------------
|
| An individual can submit additional evidence only when an
| admin has explicitly requested it.
|
| Original evidence is never overwritten.
|
*/

    public function submitAdditionalEvidence(
        Request $request,
        int $id,
        int $evidenceRequestId,
        HelpRequestEvidenceService $evidenceService
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can submit additional evidence.',
            ], 403);
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to submit evidence for this request.',
            ], 403);
        }

        if ($helpRequest->status !== HelpRequest::STATUS_PENDING) {
            return response()->json([
                'message' => 'Additional evidence can only be submitted for pending help requests.',
            ], 422);
        }

        $evidenceRequest = $helpRequest->evidenceRequests()
            ->where('id', $evidenceRequestId)
            ->where('status', 'pending')
            ->first();

        if (!$evidenceRequest) {
            return response()->json([
                'message' => 'No pending evidence request was found.',
            ], 422);
        }

        $validated = $request->validate(
            HelpRequestEvidenceRules::rules()
        );

        $files = $validated['evidences'];

        if (!HelpRequestEvidenceRules::totalSizeIsValid($files)) {
            return response()->json([
                'message' => 'The combined evidence file size cannot exceed 35 MB.',
            ], 422);
        }

        $uploadedFileIds = [];

        try {
            DB::transaction(function () use (
                $files,
                $helpRequest,
                $evidenceRequestId,
                $user,
                $evidenceService,
                &$uploadedFileIds
            ) {
                $lockedHelpRequest = HelpRequest::where('id', $helpRequest->id)
                    ->lockForUpdate()
                    ->first();

                if (
                    !$lockedHelpRequest ||
                    $lockedHelpRequest->status !== HelpRequest::STATUS_PENDING
                ) {
                    throw new \RuntimeException(
                        'Additional evidence can only be submitted for pending help requests.'
                    );
                }

                $lockedEvidenceRequest = $lockedHelpRequest->evidenceRequests()
                    ->where('id', $evidenceRequestId)
                    ->where('status', 'pending')
                    ->lockForUpdate()
                    ->first();

                if (!$lockedEvidenceRequest) {
                    throw new \RuntimeException(
                        'This evidence request has already been submitted or is no longer available.'
                    );
                }

                foreach ($files as $file) {
                    $uploaded = $evidenceService->uploadPrivateFile($file);

                    $uploadedFileIds[] = $uploaded['file_id'];

                    HelpRequestEvidence::create([
                        'help_request_id' => $helpRequest->id,
                        'uploaded_by' => $user->id,
                        'evidence_request_id' => $evidenceRequestId,
                        'source' => HelpRequestEvidence::SOURCE_ADDITIONAL,
                        'file_name' => $uploaded['file_name'],
                        'file_id' => $uploaded['file_id'],
                        'file_path' => $uploaded['file_path'],
                        'mime_type' => $uploaded['mime_type'],
                        'file_size' => $uploaded['file_size'],
                    ]);
                }

                $lockedEvidenceRequest->update([
                    'status' => 'submitted',
                    'submitted_at' => now(),
                ]);
            });
        } catch (Throwable $exception) {
            foreach ($uploadedFileIds as $fileId) {
                try {
                    $evidenceService->deleteFile($fileId);
                } catch (Throwable $cleanupException) {
                    report($cleanupException);
                }
            }

            report($exception);

            return response()->json([
                'message' => 'Unable to submit additional evidence. Please try again.',
            ], 500);
        }

        return response()->json([
            'message' => 'Additional evidence submitted successfully.',
            'evidences' => $helpRequest->evidences()
                ->where('evidence_request_id', $evidenceRequestId)
                ->get([
                    'id',
                    'help_request_id',
                    'uploaded_by',
                    'evidence_request_id',
                    'source',
                    'file_name',
                    'mime_type',
                    'file_size',
                    'created_at',
                ]),
        ], 201);
    }

    /*
|--------------------------------------------------------------------------
| View Help Request Evidence
|--------------------------------------------------------------------------
|
| Admins can view all Help Request evidence.
| Individuals can view evidence belonging to their own requests.
|
*/

    public function viewEvidence(
        Request $request,
        int $id,
        int $evidenceId,
        HelpRequestEvidenceService $evidenceService
    ) {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        $isAdmin = $user->role === 'admin';

        $isOwner = (
            $user->role === 'individual' &&
            $helpRequest->user_id === $user->id
        );

        if (!$isAdmin && !$isOwner) {
            return response()->json([
                'message' => 'You are not authorized to view this evidence.',
            ], 403);
        }

        $evidence = HelpRequestEvidence::where(
            'help_request_id',
            $helpRequest->id
        )->find($evidenceId);

        if (!$evidence) {
            return response()->json([
                'message' => 'Evidence file not found.',
            ], 404);
        }

        try {
            $signedUrl = $evidenceService->generateSignedUrl(
                $evidence->file_path
            );

            return response()->json([
                'url' => $signedUrl,
                'expires_in' => 300,
            ], 200);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Unable to generate the evidence viewing link.',
            ], 500);
        }
    }

    /**
     * Stream private Help Request evidence for inline preview.
     *
     * Admins can preview all evidence.
     * Individuals can preview evidence belonging to their own requests.
     */
    public function previewEvidence(
        Request $request,
        int $id,
        int $evidenceId,
        HelpRequestEvidenceService $evidenceService
    ) {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        $isAdmin = $user->role === 'admin';

        $isOwner = (
            $user->role === 'individual' &&
            $helpRequest->user_id === $user->id
        );

        if (!$isAdmin && !$isOwner) {
            return response()->json([
                'message' => 'You are not authorized to view this evidence.',
            ], 403);
        }

        $evidence = HelpRequestEvidence::where(
            'help_request_id',
            $helpRequest->id
        )->find($evidenceId);

        if (!$evidence) {
            return response()->json([
                'message' => 'Evidence file not found.',
            ], 404);
        }

        $allowedMimeTypes = HelpRequestEvidenceRules::ALLOWED_MIME_TYPES;

        $mimeType = strtolower(
            trim($evidence->mime_type ?: 'application/octet-stream')
        );

        if (!in_array($mimeType, $allowedMimeTypes, true)) {
            return response()->json([
                'message' => 'This evidence file type is not supported.',
            ], 415);
        }

        $previewableMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf',
            'audio/mpeg',
            'audio/wav',
            'audio/x-wav',
            'audio/mp4',
            'audio/x-m4a',
            'video/mp4',
            'video/quicktime',
        ];

        $isPreviewable = in_array(
            $mimeType,
            $previewableMimeTypes,
            true
        );

        $fileName = basename($evidence->file_name ?: 'evidence');

        $fileName = str_replace(
            ["\r", "\n", '"'],
            '',
            $fileName
        );

        try {
            $file = $evidenceService->getPrivateFileContents(
                $evidence->file_path
            );

            return response(
                $file['contents'],
                200,
                [
                    'Content-Type' => $mimeType,
                    'Content-Disposition' => ($isPreviewable ? 'inline' : 'attachment') .
                        "; filename*=UTF-8''" . rawurlencode($fileName),
                    'Content-Length' => strlen($file['contents']),
                    'Cache-Control' => 'private, no-store, max-age=0',
                    'Pragma' => 'no-cache',
                    'X-Content-Type-Options' => 'nosniff',
                ]
            );
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => 'Unable to retrieve the evidence file.',
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Help Request
    |--------------------------------------------------------------------------
    |
    | Only the owner of a pending Help Request can delete it.
    |
    | Once the request has been reviewed, it becomes immutable
    | from the requester's side.
    |
    */

    public function destroy(
        Request $request,
        int $id,
        HelpRequestEvidenceService $evidenceService
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can delete help requests.',
            ], 403);
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to delete this help request.',
            ], 403);
        }

        if ($helpRequest->status !== HelpRequest::STATUS_PENDING) {
            return response()->json([
                'message' => 'This help request can no longer be deleted because it has already been reviewed.',
            ], 422);
        }

        // Collect ImageKit file IDs before cascading database deletion.
        $evidenceFileIds = $helpRequest->evidences()
            ->pluck('file_id')
            ->all();

        // Delete the request and its related database records.
        $helpRequest->delete();

        // Delete the corresponding private files from ImageKit.
        foreach ($evidenceFileIds as $fileId) {
            try {
                $evidenceService->deleteFile($fileId);
            } catch (Throwable $exception) {
                // Do not undo a successful database deletion.
                report($exception);
            }
        }

        return response()->json([
            'message' => 'Help request deleted successfully.',
        ], 200);
    }
}
