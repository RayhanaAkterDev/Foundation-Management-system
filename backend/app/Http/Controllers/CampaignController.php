<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Services\Campaign\CampaignService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with([
            'organization:id,name',
        ])
            ->where('status', Campaign::STATUS_ACTIVE)
            ->latest()
            ->get();

        return response()->json([
            'campaigns' => $campaigns,
        ]);
    }

    public function organizationCampaigns(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can access organization campaigns.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Your organization profile could not be found.',
            ], 403);
        }

        $campaigns = Campaign::with([
            'organization:id,name',
            'helpRequest:id,title',
            'creator:id,name',
        ])
            ->where('organization_id', $organization->id)
            ->latest()
            ->get();

        return response()->json([
            'campaigns' => $campaigns,
        ]);
    }

    public function updateOrganizationCampaign(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'You do not have permission to update campaigns.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 403);
        }

        // Ensure the campaign belongs to the authenticated organization.
        $campaign = Campaign::where('id', $id)
            ->where('organization_id', $organization->id)
            ->first();

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found or you do not have permission to edit it.',
            ], 404);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'scope' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'affected_areas' => ['nullable', 'string'],
            'target_amount' => ['required', 'numeric', 'min:1'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
            'remove_cover_image' => ['nullable', 'boolean'],
        ]);

        // Keep the existing cover unless a replacement or removal is requested.
        $coverImagePath = $campaign->cover_image;

        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $fileContents = file_get_contents($file->getRealPath());

            if ($fileContents === false) {
                return response()->json([
                    'message' => 'The campaign cover could not be read.',
                ], 500);
            }

            try {
                $imageKit = new \ImageKit\ImageKit(
                    config('services.imagekit.public_key'),
                    config('services.imagekit.private_key'),
                    config('services.imagekit.url_endpoint')
                );

                $uploadResponse = $imageKit->uploadFile([
                    'file' => base64_encode($fileContents),
                    'fileName' => $file->getClientOriginalName(),
                    'folder' => '/campaigns',
                    'useUniqueFileName' => true,
                ]);
            } catch (\Throwable $exception) {
                report($exception);

                return response()->json([
                    'message' => 'The campaign cover could not be uploaded. Please try again.',
                ], 500);
            }

            if (
                !isset($uploadResponse->result) ||
                !isset($uploadResponse->result->url)
            ) {
                return response()->json([
                    'message' => 'ImageKit did not return a campaign cover URL.',
                ], 500);
            }

            $coverImagePath = $uploadResponse->result->url;
        } elseif (!empty($validated['remove_cover_image'])) {
            $coverImagePath = null;
        }

        $campaign->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'scope' => $validated['scope'] ?? null,
            'district' => $validated['district'] ?? null,
            'location' => $validated['location'] ?? null,
            'affected_areas' => $validated['affected_areas'] ?? null,
            'target_amount' => $validated['target_amount'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'cover_image' => $coverImagePath,
        ]);

        return response()->json([
            'message' => 'Campaign updated successfully.',
            'campaign' => $campaign->fresh()->load([
                'organization:id,name',
                'creator:id,name,email',
                'verifier:id,name,email',
                'helpRequest:id,title,status',
            ]),
        ]);
    }

    public function show(int $id)
    {
        $campaign = Campaign::with([
            'organization:id,name',
        ])
            ->where('status', Campaign::STATUS_ACTIVE)
            ->find($id);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found.',
            ], 404);
        }

        return response()->json([
            'campaign' => $campaign,
        ]);
    }

    public function store(
        Request $request,
        CampaignService $campaignService
    ) {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication is required to create a campaign.',
            ], 401);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate campaign type first
        |--------------------------------------------------------------------------
        */

        $validatedType = $request->validate([
            'type' => [
                'required',
                'string',
                Rule::in(Campaign::types()),
            ],
        ]);

        $type = $validatedType['type'];

        /*
        |--------------------------------------------------------------------------
        | Creation permissions
        |--------------------------------------------------------------------------
        |
        | Admin:
        |   local_case
        |   organization_proposed
        |   global_situation
        |
        | Organization:
        |   local_case
        |   organization_proposed
        |
        */

        $isAdmin = $user->role === 'admin';
        $isOrganization = $user->role === 'organization';

        if (!$isAdmin && !$isOrganization) {
            return response()->json([
                'message' => 'You are not allowed to create campaigns.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Organization validation
        |--------------------------------------------------------------------------
        |
        | An organization must be verified before it can create
        | either type of organization-created campaign.
        |
        */

        $organization = null;

        if ($isOrganization) {
            $organization = $user->organization;

            if (!$organization) {
                return response()->json([
                    'message' => 'Your organization profile could not be found.',
                ], 403);
            }

            if ($organization->verification_status !== 'verified') {
                return response()->json([
                    'message' => 'Your organization must be verified before creating a campaign.',
                ], 403);
            }

            if ($type === Campaign::TYPE_GLOBAL_SITUATION) {
                return response()->json([
                    'message' => 'Only administrators can create global situation campaigns.',
                ], 403);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Common campaign fields
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'scope' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string'],
            'affected_areas' => ['nullable', 'string'],
            'target_amount' => ['required', 'numeric', 'min:1'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cover_image' => ['nullable', 'string'],

            /*
            |--------------------------------------------------------------------------
            | Type-specific identifiers
            |--------------------------------------------------------------------------
            */

            'help_request_id' => [
                'nullable',
                'integer',
                'exists:help_requests,id',
            ],

            'organization_id' => [
                'nullable',
                'integer',
                'exists:organizations,id',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Never trust client-supplied ownership for organization users
        |--------------------------------------------------------------------------
        */

        if ($isOrganization) {
            $validated['organization_id'] = $organization->id;
        }

        /*
        |--------------------------------------------------------------------------
        | LOCAL CASE
        |--------------------------------------------------------------------------
        |
        | Must have a Help Request.
        |
        | Organization-created local campaigns are additionally
        | validated inside CampaignService to ensure the selected
        | Help Request is actually assigned to that organization.
        |
        */

        if ($type === Campaign::TYPE_LOCAL_CASE) {
            if (empty($validated['help_request_id'])) {
                return response()->json([
                    'message' => 'A local case campaign must be linked to a help request.',
                ], 422);
            }

            /*
            | For an organization-created local campaign,
            | organization_id is always the authenticated organization's ID.
            |
            | For an admin-created local campaign, organization_id may be
            | supplied or left null because the fundamental requirement
            | is the Help Request itself.
            */

            $campaign = $campaignService->createLocalCaseCampaign([
                ...$validated,
                'created_by' => $user->id,
            ]);

            return response()->json([
                'message' => 'Local case campaign created successfully and is waiting for admin review.',
                'campaign' => $campaign->load([
                    'organization',
                    'helpRequest',
                    'creator',
                ]),
            ], 201);
        }

        /*
        |--------------------------------------------------------------------------
        | ORGANIZATION PROPOSED
        |--------------------------------------------------------------------------
        |
        | Must NOT be connected to a Help Request.
        |
        | Organization:
        |   organization_id is automatically taken from authenticated user.
        |
        | Admin:
        |   organization_id must be supplied because this campaign type
        |   represents an organization-proposed campaign.
        |
        */

        if ($type === Campaign::TYPE_ORGANIZATION_PROPOSED) {
            if (!empty($validated['help_request_id'])) {
                return response()->json([
                    'message' => 'An organization-proposed campaign cannot be linked to a help request.',
                ], 422);
            }

            if (empty($validated['organization_id'])) {
                return response()->json([
                    'message' => 'An organization-proposed campaign must belong to an organization.',
                ], 422);
            }

            $campaign = $campaignService->proposeOrganizationCampaign([
                ...$validated,
                'help_request_id' => null,
                'created_by' => $user->id,
            ]);

            return response()->json([
                'message' => 'Organization-proposed campaign created successfully and is waiting for admin review.',
                'campaign' => $campaign->load([
                    'organization',
                    'creator',
                ]),
            ], 201);
        }

        /*
        |--------------------------------------------------------------------------
        | GLOBAL SITUATION
        |--------------------------------------------------------------------------
        |
        | Admin only.
        |
        | A global situation campaign is not owned by an organization
        | and cannot be connected to a Help Request.
        |
        */

        if ($type === Campaign::TYPE_GLOBAL_SITUATION) {
            if (!$isAdmin) {
                return response()->json([
                    'message' => 'Only administrators can create global situation campaigns.',
                ], 403);
            }

            if (
                !empty($validated['help_request_id']) ||
                !empty($validated['organization_id'])
            ) {
                return response()->json([
                    'message' => 'A global situation campaign cannot be linked to a help request or organization.',
                ], 422);
            }

            $campaign = $campaignService->createGlobalCampaign([
                ...$validated,
                'help_request_id' => null,
                'organization_id' => null,
                'created_by' => $user->id,
            ]);

            return response()->json([
                'message' => 'Global situation campaign created successfully and is waiting for admin review.',
                'campaign' => $campaign->load([
                    'creator',
                ]),
            ], 201);
        }

        /*
        |--------------------------------------------------------------------------
        | Safety fallback
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'message' => 'Unsupported campaign type.',
        ], 422);
    }
}
