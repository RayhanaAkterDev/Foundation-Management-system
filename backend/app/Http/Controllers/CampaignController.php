<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Services\Campaign\CampaignService;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with([
            'organization:id,name',
        ])
            ->whereIn('status', [
                Campaign::STATUS_PUBLISHED,
                Campaign::STATUS_ACTIVE,
                Campaign::STATUS_IN_PROGRESS,
            ])
            ->latest()
            ->get();

        return response()->json([
            'campaigns' => $campaigns,
        ]);
    }

    public function show(int $id)
    {
        $campaign = Campaign::with([
            'organization:id,name',
        ])
            ->whereIn('status', [
                Campaign::STATUS_PUBLISHED,
                Campaign::STATUS_ACTIVE,
                Campaign::STATUS_IN_PROGRESS,
            ])
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

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can propose campaigns.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization || $organization->verification_status !== 'verified') {
            return response()->json([
                'message' => 'Your organization must be verified before proposing a campaign.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'scope' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string'],
            'affected_areas' => ['nullable', 'string'],
            'target_amount' => ['nullable', 'numeric', 'min:1'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cover_image' => ['nullable', 'string'],
        ]);

        $campaign = $campaignService->proposeOrganizationCampaign([
            ...$validated,
            'organization_id' => $organization->id,
            'created_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Campaign proposal submitted successfully and is waiting for admin review.',
            'campaign' => $campaign->load([
                'organization',
                'creator',
            ]),
        ], 201);
    }
}
