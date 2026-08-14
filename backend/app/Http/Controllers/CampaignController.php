<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /**
     * Get active campaigns for the public website.
     */
    public function index()
    {
        $campaigns = Campaign::with([
            'organization:id,name',
        ])
            ->where('status', 'active')
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
            ->where('status', 'active')
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

    /**
     * Create a direct campaign by an organization.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Only organization users can create direct campaigns.
        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can create campaigns.'
            ], 403);
        }

        // Organization must be verified.
        $organization = $user->organization;

        if (!$organization || $organization->verification_status !== 'verified') {
            return response()->json([
                'message' => 'Your organization must be verified before creating a campaign.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string'],
            'target_amount' => ['required', 'numeric', 'min:1'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cover_image' => ['nullable', 'string'],
        ]);

        $campaign = Campaign::create([
            'organization_id' => $organization->id,
            'created_by' => $user->id,

            // This campaign is not connected to a help request.
            'help_request_id' => null,
            'source_type' => 'direct',

            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'district' => $validated['district'] ?? null,
            'location' => $validated['location'] ?? null,
            'target_amount' => $validated['target_amount'],

            'status' => 'pending',

            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'cover_image' => $validated['cover_image'] ?? null,
        ]);

        return response()->json([
            'message' => 'Campaign submitted successfully and is waiting for admin verification.',
            'campaign' => $campaign->load([
                'organization',
                'creator',
            ]),
        ], 201);
    }
}
