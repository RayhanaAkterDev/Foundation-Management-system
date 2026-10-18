<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignVolunteerAssignment;
use App\Models\HelpRequestAssignment;
use App\Models\Organization;

use ImageKit\ImageKit;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;


class OrganizationController extends Controller
{
    /**
     * --------------------------------------------------------------------------
     * Public Organizations
     * --------------------------------------------------------------------------
     *
     * Returns verified and active organizations for the public website.
     *
     * Public directory rules:
     *
     * 1. Organization verification_status must be "verified".
     * 2. The connected user account must be active.
     * 3. The connected user must have a verified email/demo verification.
     * 4. Organization logo/avatar comes from users.photo.
     * 5. Organization banner comes from organizations.banner.
     *
     * This endpoint is intentionally public.
     */
    public function publicIndex()
    {
        $organizations = Organization::query()
            ->with([
                'user:id,name,email,phone,photo,role,status,email_verified_at',
            ])
            ->where('verification_status', 'verified')
            ->whereHas('user', function ($query) {
                $query
                    ->where('role', 'organization')
                    ->where('status', 'active')
                    ->whereNotNull('email_verified_at');
            })
            ->latest('organizations.updated_at')
            ->get()
            ->map(function ($organization) {
                return [
                    'id' => $organization->id,

                    'name' => $organization->name,

                    'organization_type' =>
                    $organization->organization_type,

                    'registration_number' =>
                    $organization->registration_number,

                    'phone' =>
                    $organization->phone,

                    'website' =>
                    $organization->website,

                    'address' =>
                    $organization->address,

                    'mission' =>
                    $organization->mission,

                    'focus_areas' =>
                    $organization->focus_areas,

                    'communities_served' =>
                    $organization->communities_served,

                    'team_size' =>
                    $organization->team_size,

                    'primary_activities' =>
                    $organization->primary_activities,

                    'banner' =>
                    $organization->banner,

                    'photo' =>
                    $organization->user?->photo,

                    'verification_status' =>
                    $organization->verification_status,

                    'user' => $organization->user
                        ? [
                            'id' => $organization->user->id,
                            'name' => $organization->user->name,
                            'photo' => $organization->user->photo,
                        ]
                        : null,
                ];
            })
            ->values();

        return response()->json([
            'organizations' => $organizations,
        ]);
    }

    /**
     * Organization: View assigned help requests.
     */
    public function assignments(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignments = HelpRequestAssignment::with([
            'helpRequest',
            'assignedBy:id,name,email',
        ])
            ->where(
                'organization_id',
                $organization->id
            )
            ->latest()
            ->get();

        return response()->json([
            'assignments' => $assignments,
        ]);
    }

    /**
     * Organization: Accept a help request assignment.
     *
     * assigned -> accepted
     */
    public function acceptAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_PENDING
        ) {
            return response()->json([
                'message' =>
                'Only pending assignments can be accepted.',
            ], 422);
        }

        $assignment->update([
            'status' =>
            HelpRequestAssignment::STATUS_ACCEPTED,
        ]);

        return response()->json([
            'message' =>
            'Help request assignment accepted successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: Reject a pending help request assignment.
     *
     * pending -> rejected
     */
    public function rejectAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_PENDING
        ) {
            return response()->json([
                'message' =>
                'Only pending assignments can be rejected.',
            ], 422);
        }

        $validated = $request->validate([
            'rejection_note' => [
                'required',
                'string',
                'max:2000',
            ],
        ]);

        $assignment->update([
            'status' =>
            HelpRequestAssignment::STATUS_REJECTED,
            'rejection_note' =>
            trim($validated['rejection_note']),
        ]);

        return response()->json([
            'message' =>
            'Help request assignment rejected successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Compatibility endpoint for the old assignment workflow.
     *
     * Assignment status no longer has an in_progress state.
     *
     * The Help Request itself owns the in_progress state.
     */
    public function startAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'message' =>
            'Starting an assignment is no longer supported. An accepted assignment remains accepted.',
        ], 422);
    }

    /**
     * Compatibility endpoint for the old assignment workflow.
     *
     * Assignment status no longer has a completed state.
     *
     * Completion belongs to HelpRequest.status.
     */
    public function completeAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'message' =>
            'Completing an assignment is no longer supported. Completion belongs to the help request workflow.',
        ], 422);
    }

    /**
     * Organization: Request withdrawal from an accepted assignment.
     *
     * accepted
     *     ↓
     * withdrawal_status = pending
     *
     * The assignment remains accepted until Admin approves
     * the withdrawal request.
     */
    public function requestWithdrawal(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->with('helpRequest')
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        /**
         * Only Accepted Assignments Can Request Withdrawal
         *
         * pending   -> cannot withdraw
         * accepted  -> can request withdrawal
         * rejected  -> cannot withdraw
         * withdrawn -> cannot withdraw again
         */
        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' =>
                'Only accepted assignments can be withdrawn.',
            ], 422);
        }

        /**
         * Prevent Duplicate Pending Request
         */
        if (
            $assignment->withdrawal_status ===
            HelpRequestAssignment::WITHDRAWAL_PENDING
        ) {
            return response()->json([
                'message' =>
                'A withdrawal request is already pending for this assignment.',
            ], 422);
        }

        /**
         * Validate Withdrawal Reason
         */
        $validated = $request->validate([
            'withdrawal_reason' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
        ]);

        /**
         * Create Withdrawal Request
         *
         * The assignment status remains accepted.
         *
         * It changes to withdrawn only after Admin approves
         * the withdrawal request.
         */
        $assignment->update([
            'withdrawal_status' =>
            HelpRequestAssignment::WITHDRAWAL_PENDING,
            'withdrawal_reason' =>
            trim($validated['withdrawal_reason']),
            'withdrawal_requested_at' => now(),
            'withdrawal_reviewed_at' => null,
            'withdrawal_reviewed_by' => null,
        ]);

        return response()->json([
            'message' =>
            'Withdrawal request submitted successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'organization',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: Update selected fields of an accepted help request.
     *
     * Organizations can only modify:
     * - category
     * - urgency / priority
     *
     * Protected:
     * - title
     * - description
     * - requester
     * - district
     * - address
     * - people affected
     * - amount needed
     * - assignment information
     * - verification information
     */
    public function updateAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->with('helpRequest')
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        /**
         * Only Accepted Assignments Can Be Edited
         */
        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' =>
                'Only accepted assignments can be edited.',
            ], 422);
        }

        /**
         * Make Sure Help Request Exists
         */
        $helpRequest = $assignment->helpRequest;

        if (!$helpRequest) {
            return response()->json([
                'message' =>
                'Help request not found for this assignment.',
            ], 404);
        }

        /**
         * Validate Only Organization-Editable Fields
         *
         * Valid urgency values:
         * low, normal, high, critical
         */
        $validated = $request->validate([
            'category' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],
            'urgency' => [
                'sometimes',
                'required',
                'string',
                'in:low,normal,high,critical',
            ],
        ]);

        /**
         * Make Sure At Least One Editable Field Was Sent
         */
        if (empty($validated)) {
            return response()->json([
                'message' =>
                'No changes were provided.',
            ], 422);
        }

        /**
         * Update Help Request
         */
        $helpRequest->update($validated);

        return response()->json([
            'message' =>
            'Help request updated successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: View volunteers assigned to active campaigns.
     *
     * Only volunteers assigned to this organization's ACTIVE
     * campaigns are returned.
     *
     * Rejected and withdrawn assignments are not considered
     * current volunteer assignments.
     */
    public function volunteers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        /**
         * Get volunteer assignments belonging to this organization
         * and its ACTIVE campaigns only.
         */
        $assignments = CampaignVolunteerAssignment::query()
            ->whereHas('campaign', function ($query) use ($organization) {
                $query
                    ->where(
                        'organization_id',
                        $organization->id
                    )
                    ->where(
                        'status',
                        Campaign::STATUS_ACTIVE
                    );
            })
            ->whereNotIn('status', [
                CampaignVolunteerAssignment::STATUS_REJECTED,
                CampaignVolunteerAssignment::STATUS_WITHDRAWN,
            ])
            ->with([
                'volunteer:id,name,email,phone,status,email_verified_at',
                'campaign:id,organization_id,title,status,start_date,end_date',
            ])
            ->latest('assigned_at')
            ->get();

        /**
         * Summary
         */
        $totalVolunteers = $assignments
            ->pluck('volunteer_id')
            ->unique()
            ->count();

        $activeCampaigns = Campaign::query()
            ->where(
                'organization_id',
                $organization->id
            )
            ->where(
                'status',
                Campaign::STATUS_ACTIVE
            )
            ->count();

        $activeAssignments = $assignments
            ->whereIn('status', [
                CampaignVolunteerAssignment::STATUS_ASSIGNED,
                CampaignVolunteerAssignment::STATUS_ACCEPTED,
                CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
            ])
            ->count();

        return response()->json([
            'volunteers' => $assignments,
            'summary' => [
                'total' => $totalVolunteers,
                'active_campaigns' => $activeCampaigns,
                'active_assignments' => $activeAssignments,
            ],
        ]);
    }

    /**
     * Organization: Dashboard overview.
     *
     * Returns only data belonging to the authenticated organization.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        /**
         * Help Request Assignments
         */
        $assignments = HelpRequestAssignment::query()
            ->where(
                'organization_id',
                $organization->id
            )
            ->with([
                'helpRequest',
                'assignedBy:id,name,email',
            ])
            ->latest()
            ->get();

        $assignedRequests = $assignments->count();

        $activeRequests = $assignments
            ->filter(function ($assignment) {
                return $assignment->helpRequest
                    && $assignment->helpRequest->status === 'verified';
            })
            ->count();

        $completedRequests = $assignments
            ->filter(function ($assignment) {
                return $assignment->helpRequest
                    && $assignment->helpRequest->status === 'completed';
            })
            ->count();

        /**
         * Organization Campaigns
         */
        $campaigns = Campaign::query()
            ->where(
                'organization_id',
                $organization->id
            )
            ->latest()
            ->get();

        $activeCampaigns = $campaigns
            ->where(
                'status',
                Campaign::STATUS_ACTIVE
            )
            ->values();

        /**
         * Volunteers
         */
        $volunteerAssignments = CampaignVolunteerAssignment::query()
            ->whereHas('campaign', function ($query) use ($organization) {
                $query
                    ->where(
                        'organization_id',
                        $organization->id
                    )
                    ->where(
                        'status',
                        Campaign::STATUS_ACTIVE
                    );
            })
            ->whereNotIn('status', [
                CampaignVolunteerAssignment::STATUS_REJECTED,
                CampaignVolunteerAssignment::STATUS_WITHDRAWN,
            ])
            ->with([
                'volunteer:id,name,email,phone,status,email_verified_at',
                'campaign:id,organization_id,title,status,start_date,end_date',
            ])
            ->latest('assigned_at')
            ->get();

        $totalVolunteers = $volunteerAssignments
            ->pluck('volunteer_id')
            ->unique()
            ->count();

        $activeVolunteerAssignments = $volunteerAssignments
            ->whereIn('status', [
                CampaignVolunteerAssignment::STATUS_ASSIGNED,
                CampaignVolunteerAssignment::STATUS_ACCEPTED,
                CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
            ])
            ->count();

        /**
         * Recent Requests
         */
        $recentRequests = $assignments
            ->take(5)
            ->map(function ($assignment) {
                $request = $assignment->helpRequest;

                return [
                    'id' => $assignment->id,
                    'help_request_id' => $request?->id,
                    'title' => $request?->title ?? 'Help request',
                    'district' => $request?->district,
                    'urgency' => $request?->urgency,
                    'status' => $request?->status,
                    'assignment_status' => $assignment->status,
                    'withdrawal_status' => $assignment->withdrawal_status,
                    'updated_at' => $request?->updated_at,
                ];
            })
            ->values();

        /**
         * Recent Campaigns
         */
        $recentCampaigns = $campaigns
            ->take(5)
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'status' => $campaign->status,
                    'type' => $campaign->type,
                    'start_date' => $campaign->start_date,
                    'end_date' => $campaign->end_date,
                    'created_at' => $campaign->created_at,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'organization' => [
                    'id' => $organization->id,
                    'name' => $organization->name,
                    'type' => $organization->type,
                    'location' => $organization->location,
                    'verification_status' =>
                    $organization->verification_status,
                ],

                'overview' => [
                    'assigned_requests' => $assignedRequests,
                    'active_requests' => $activeRequests,
                    'completed_requests' => $completedRequests,
                    'active_campaigns' => $activeCampaigns->count(),
                    'total_volunteers' => $totalVolunteers,
                    'active_volunteer_assignments' =>
                    $activeVolunteerAssignments,
                ],

                'requests' => $recentRequests,

                'campaigns' => $recentCampaigns,

                'volunteers' => [
                    'total' => $totalVolunteers,
                    'active_assignments' =>
                    $activeVolunteerAssignments,
                ],
            ],
        ]);
    }

    /**
     * Get the authenticated organization's profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $startedAt = microtime(true);

        $organization = Organization::where('user_id', $user->id)
            ->first();

        Log::info('[ORG PROFILE TIMING]', [
            'organization_query_ms' => round(
                (microtime(true) - $startedAt) * 1000,
                2
            ),
            'organization_found' => (bool) $organization,
        ]);

        $organization = Organization::where('user_id', $user->id)
            ->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        return response()->json([
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'email' => $user->email,
                'phone' => $organization->phone,
                'website' => $organization->website,
                'address' => $organization->address,
                'mission' => $organization->mission,
                'organization_type' => $organization->organization_type,
                'registration_number' => $organization->registration_number,
                'focus_areas' => $organization->focus_areas,
                'communities_served' => $organization->communities_served,
                'team_size' => $organization->team_size,
                'primary_activities' => $organization->primary_activities,
                'banner' => $organization->banner,
                'photo' => $user->photo,
                'verification_status' => $organization->verification_status,
            ],
        ]);
    }

    /**
     * Update editable fields of the authenticated organization's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where('user_id', $user->id)->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'phone' => ['nullable', 'string', 'max:30'],
            'website' => ['nullable', 'url', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'mission' => ['nullable', 'string', 'max:5000'],

            'focus_areas' => ['nullable', 'array'],
            'focus_areas.*' => ['string', 'max:100'],

            'communities_served' => ['nullable', 'array'],
            'communities_served.*' => ['string', 'max:100'],

            // Existing database values include "11-50" and "51-200".
            'team_size' => ['nullable', 'string', 'max:50'],

            'primary_activities' => ['nullable', 'array'],
            'primary_activities.*' => ['string', 'max:255'],
        ]);

        $emailChanged = $user->email !== $validated['email'];

        DB::transaction(function () use (
            $user,
            $organization,
            $validated,
            $emailChanged
        ) {
            $organization->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'] ?? null,
                'website' => $validated['website'] ?? null,
                'address' => $validated['address'] ?? null,
                'mission' => $validated['mission'] ?? null,

                'focus_areas' => $validated['focus_areas'] ?? [],
                'communities_served' => $validated['communities_served'] ?? [],
                'team_size' => $validated['team_size'] ?? null,
                'primary_activities' => $validated['primary_activities'] ?? [],
            ]);

            $user->name = $validated['name'];

            if ($emailChanged) {
                $user->email = $validated['email'];
                $user->verification_method = 'demo';
                $user->email_verified_at = null;
                $user->status = 'inactive';
                $user->verification_email_sent_at = null;
            }

            $user->save();
        });

        $organization->refresh();
        $user->refresh();

        return response()->json([
            'message' => $emailChanged
                ? 'Profile updated. Please verify your new email address.'
                : 'Organization profile updated successfully.',

            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'email' => $user->email,
                'phone' => $organization->phone,
                'website' => $organization->website,
                'address' => $organization->address,
                'mission' => $organization->mission,
                'organization_type' => $organization->organization_type,
                'registration_number' => $organization->registration_number,
                'focus_areas' => $organization->focus_areas ?? [],
                'communities_served' => $organization->communities_served ?? [],
                'team_size' => $organization->team_size,
                'primary_activities' => $organization->primary_activities ?? [],
                'banner' => $organization->banner,
                'photo' => $user->photo,
                'verification_status' => $organization->verification_status,
                'created_at' => $organization->created_at,
                'updated_at' => $organization->updated_at,
            ],
        ]);
    }

    /**
     * Upload the authenticated organization's profile photo.
     * The image URL is stored in users.photo.
     * ImageKit folder: /users
     */
    public function uploadProfilePhoto(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'photo' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
        ]);

        $photoUrl = $this->uploadToImageKit(
            $validated['photo'],
            '/users/photos'
        );

        if (!$photoUrl) {
            return response()->json([
                'message' => 'The organization profile photo could not be uploaded.',
            ], 500);
        }

        $user->photo = $photoUrl;
        $user->save();

        return response()->json([
            'message' => 'Organization profile photo updated successfully.',
            'photo' => $user->photo,
        ]);
    }

    /**
     * Upload the authenticated organization's banner.
     * The image URL is stored in organizations.banner.
     * ImageKit folder: /organizations
     */
    public function uploadProfileBanner(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $validated = $request->validate([
            'banner' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
        ]);

        $bannerUrl = $this->uploadToImageKit(
            $validated['banner'],
            '/organizations/banners'
        );

        if (!$bannerUrl) {
            return response()->json([
                'message' => 'The organization banner could not be uploaded.',
            ], 500);
        }

        $organization->banner = $bannerUrl;
        $organization->save();

        return response()->json([
            'message' => 'Organization banner updated successfully.',
            'banner' => $organization->banner,
        ]);
    }

    /**
     * Upload a validated image using the project's existing ImageKit setup.
     */
    private function uploadToImageKit(
        UploadedFile $file,
        string $folder
    ): ?string {
        $imageKit = new ImageKit(
            config('services.imagekit.public_key'),
            config('services.imagekit.private_key'),
            config('services.imagekit.url_endpoint')
        );

        $fileContents = file_get_contents($file->getRealPath());

        if ($fileContents === false) {
            return null;
        }

        $uploadResponse = $imageKit->uploadFile([
            'file' => base64_encode($fileContents),
            'fileName' => $file->getClientOriginalName(),
            'folder' => $folder,
            'useUniqueFileName' => true,
        ]);

        if (
            !isset($uploadResponse->result) ||
            !isset($uploadResponse->result->url)
        ) {
            return null;
        }

        return $uploadResponse->result->url;
    }
}
