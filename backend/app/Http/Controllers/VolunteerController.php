<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Volunteer;
use App\Models\VolunteerRequest;
use App\Models\CampaignVolunteerAssignment;
use App\Services\Campaign\CampaignService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VolunteerController extends Controller
{
    /**
     * Ensure the authenticated user is an admin.
     */
    private function authorizeAdmin(Request $request): ?User
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return null;
        }

        return $user;
    }

    /**
     * Synchronize volunteer availability.
     *
     * Availability is derived from:
     * - volunteer status
     * - active campaign assignments
     *
     * CampaignVolunteerAssignment.volunteer_id stores users.id,
     * not volunteers.id.
     */
    private function syncVolunteerAvailability(int $userId): void
    {
        $volunteer = Volunteer::where('user_id', $userId)->first();

        if (!$volunteer) {
            return;
        }

        if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
            $volunteer->update([
                'availability' => null,
            ]);

            return;
        }

        $hasActiveCampaignAssignment =
            CampaignVolunteerAssignment::where(
                'volunteer_id',
                $userId
            )
            ->whereIn(
                'status',
                CampaignVolunteerAssignment::activeStatuses()
            )
            ->exists();

        $volunteer->update([
            'availability' => $hasActiveCampaignAssignment
                ? 'unavailable'
                : 'available',
        ]);
    }

    /**
     * Admin: View all volunteers and pending volunteer invitations.
     */
    public function index(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Existing volunteer records
        |--------------------------------------------------------------------------
        */

        $volunteers = Volunteer::with([
            'user:id,name,email,phone,status,email_verified_at',
            'organization:id,name',
        ])
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Pending volunteer requests
        |--------------------------------------------------------------------------
        |
        | A pending request does not create a Volunteer record yet.
        | Include those users in the same admin directory.
        |
        */

        $existingVolunteerUserIds = $volunteers
            ->pluck('user_id')
            ->filter()
            ->unique()
            ->values();

        $pendingRequestsQuery = VolunteerRequest::with([
            'user:id,name,email,phone,status,email_verified_at',
        ])
            ->where(
                'status',
                VolunteerRequest::STATUS_PENDING
            );

        if ($existingVolunteerUserIds->isNotEmpty()) {
            $pendingRequestsQuery->whereNotIn(
                'user_id',
                $existingVolunteerUserIds
            );
        }

        $pendingRequests = $pendingRequestsQuery
            ->latest()
            ->get()
            ->unique('user_id')
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Normalize pending requests
        |--------------------------------------------------------------------------
        */

        $pendingVolunteers = $pendingRequests->map(
            function (VolunteerRequest $volunteerRequest) {
                return [
                    'id' => null,
                    'request_id' => $volunteerRequest->id,
                    'user_id' => $volunteerRequest->user_id,
                    'user' => $volunteerRequest->user,
                    'organization' => null,

                    // Phone source of truth is users.phone.
                    'phone' => $volunteerRequest->user?->phone,

                    'district' => null,
                    'address' => null,
                    'skills' => null,
                    'availability' => null,
                    'status' => VolunteerRequest::STATUS_PENDING,
                    'created_at' => $volunteerRequest->created_at,
                    'updated_at' => $volunteerRequest->updated_at,
                ];
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Merge existing volunteers + pending requests
        |--------------------------------------------------------------------------
        */

        $directory = $volunteers
            ->concat($pendingVolunteers)
            ->sortByDesc(function ($item) {
                return data_get($item, 'created_at')
                    ?? data_get($item, 'updated_at')
                    ?? now();
            })
            ->values();

        return response()->json([
            'volunteers' => $directory,
        ]);
    }

    /**
     * Admin: Get eligible individual users who can be invited.
     */
    public function candidates(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $candidates = User::query()
            ->where('role', 'individual')
            ->where('status', 'active')
            ->whereNotNull('email_verified_at')
            ->whereDoesntHave('volunteer')
            ->whereDoesntHave('volunteerRequests', function ($query) {
                $query->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                );
            })
            ->select([
                'id',
                'name',
                'email',
                'phone',
                'status',
                'email_verified_at',
            ])
            ->latest()
            ->get();

        return response()->json([
            'users' => $candidates,
        ]);
    }

    /**
     * Admin: Send volunteer invitations to eligible individuals.
     */
    public function sendRequests(Request $request)
    {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'user_ids' => [
                'required',
                'array',
                'min:1',
            ],
            'user_ids.*' => [
                'integer',
                'distinct',
                'exists:users,id',
            ],
        ]);

        $userIds = $validated['user_ids'];

        $users = User::query()
            ->whereIn('id', $userIds)
            ->where('role', 'individual')
            ->where('status', 'active')
            ->whereNotNull('email_verified_at')
            ->whereDoesntHave('volunteer')
            ->whereDoesntHave('volunteerRequests', function ($query) {
                $query->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                );
            })
            ->get();

        if ($users->count() !== count($userIds)) {
            return response()->json([
                'message' =>
                'One or more selected users are no longer eligible for a volunteer request.',
            ], 422);
        }

        DB::transaction(function () use ($userIds, $admin) {
            foreach ($userIds as $userId) {
                VolunteerRequest::create([
                    'user_id' => $userId,
                    'requested_by' => $admin->id,
                    'status' => VolunteerRequest::STATUS_PENDING,
                ]);
            }
        });

        return response()->json([
            'message' => count($userIds) === 1
                ? 'Volunteer invitation sent successfully.'
                : 'Volunteer invitations sent successfully.',
            'sent_count' => count($userIds),
        ]);
    }

    /**
     * Individual: Submit a volunteer application.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can request to become volunteers.',
            ], 403);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' =>
                'Only active users can request to become volunteers.',
            ], 422);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'message' =>
                'Please verify your email address before requesting to become a volunteer.',
            ], 422);
        }

        if ($user->volunteer) {
            return response()->json([
                'message' => 'You are already a registered SP volunteer.',
                'status' => 'already_volunteer',
                'volunteer' => $user->volunteer,
            ], 422);
        }

        $volunteerRequest = DB::transaction(function () use ($user) {
            /*
            |--------------------------------------------------------------------------
            | Lock user row
            |--------------------------------------------------------------------------
            */

            $lockedUser = User::whereKey($user->id)
                ->lockForUpdate()
                ->first();

            if (!$lockedUser) {
                abort(
                    response()->json([
                        'message' => 'User account not found.',
                    ], 404)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Re-check eligibility inside transaction
            |--------------------------------------------------------------------------
            */

            if ($lockedUser->role !== 'individual') {
                abort(
                    response()->json([
                        'message' =>
                        'Only individual users can request to become volunteers.',
                    ], 403)
                );
            }

            if ($lockedUser->status !== 'active') {
                abort(
                    response()->json([
                        'message' =>
                        'Only active users can request to become volunteers.',
                    ], 422)
                );
            }

            if (!$lockedUser->email_verified_at) {
                abort(
                    response()->json([
                        'message' =>
                        'Please verify your email address before requesting to become a volunteer.',
                    ], 422)
                );
            }

            if ($lockedUser->volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are already a registered SP volunteer.',
                    ], 422)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Prevent duplicate pending application
            |--------------------------------------------------------------------------
            */

            $pendingRequest = VolunteerRequest::where(
                'user_id',
                $lockedUser->id
            )
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->latest()
                ->first();

            if ($pendingRequest) {
                abort(
                    response()->json([
                        'message' =>
                        'You already have a pending volunteer request.',
                        'status' => 'pending',
                        'request' => $pendingRequest,
                    ], 422)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Individual application
            |--------------------------------------------------------------------------
            |
            | requested_by == user_id means the individual created it.
            |
            */

            return VolunteerRequest::create([
                'user_id' => $lockedUser->id,
                'requested_by' => $lockedUser->id,
                'status' => VolunteerRequest::STATUS_PENDING,
            ]);
        });

        return response()->json([
            'message' => 'Volunteer request submitted successfully.',
            'status' => 'pending',
            'request' => $volunteerRequest->load(
                'user:id,name,email,phone,status,email_verified_at'
            ),
        ], 201);
    }

    /**
     * Individual: View own volunteer status, request, and campaign history.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can view volunteer information.',
            ], 403);
        }

        $volunteer = Volunteer::with([
            'user:id,name,email,phone,status,email_verified_at',
            'organization:id,name',
        ])
            ->where('user_id', $user->id)
            ->first();

        $volunteerRequest = VolunteerRequest::query()
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Campaign assignments
        |--------------------------------------------------------------------------
        |
        | campaign_volunteer_assignments.volunteer_id = users.id
        |
        */

        $assignments = CampaignVolunteerAssignment::query()
            ->where('volunteer_id', $user->id)
            ->with([
                'campaign',
                'assignedBy:id,name,email',
                'volunteer:id,name,email',
                'withdrawalReviewedBy:id,name,email',
            ])
            ->latest()
            ->get();

        return response()->json([
            'is_volunteer' => (bool) $volunteer,
            'volunteer' => $volunteer,
            'request' => $volunteerRequest,
            'assignments' => $assignments,
        ]);
    }

    /**
     * Individual: Accept an administrator volunteer invitation.
     */
    public function acceptVolunteerRequest(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can accept volunteer invitations.',
            ], 403);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' =>
                'Only active users can become volunteers.',
            ], 422);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'message' =>
                'Please verify your email address before accepting a volunteer invitation.',
            ], 422);
        }

        $volunteer = DB::transaction(function () use ($user, $id) {
            $lockedUser = User::whereKey($user->id)
                ->lockForUpdate()
                ->first();

            if (!$lockedUser) {
                abort(
                    response()->json([
                        'message' => 'User account not found.',
                    ], 404)
                );
            }

            $volunteerRequest = VolunteerRequest::where('id', $id)
                ->where('user_id', $lockedUser->id)
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->lockForUpdate()
                ->first();

            if (!$volunteerRequest) {
                abort(
                    response()->json([
                        'message' =>
                        'Volunteer invitation not found or already responded to.',
                    ], 404)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Only admin-created request can be accepted here
            |--------------------------------------------------------------------------
            */

            $requestedBy = User::find(
                $volunteerRequest->requested_by
            );

            if (!$requestedBy || $requestedBy->role !== 'admin') {
                abort(
                    response()->json([
                        'message' =>
                        'This request is not an administrator invitation.',
                    ], 422)
                );
            }

            if ($lockedUser->role !== 'individual') {
                abort(
                    response()->json([
                        'message' =>
                        'Only individual users can become volunteers.',
                    ], 422)
                );
            }

            if ($lockedUser->status !== 'active') {
                abort(
                    response()->json([
                        'message' =>
                        'Only active users can become volunteers.',
                    ], 422)
                );
            }

            if (!$lockedUser->email_verified_at) {
                abort(
                    response()->json([
                        'message' =>
                        'The user must verify their email before becoming a volunteer.',
                    ], 422)
                );
            }

            $existingVolunteer = Volunteer::where(
                'user_id',
                $lockedUser->id
            )
                ->lockForUpdate()
                ->first();

            if ($existingVolunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are already a registered SP volunteer.',
                    ], 422)
                );
            }

            $volunteer = Volunteer::create([
                'user_id' => $lockedUser->id,
                'organization_id' => null,
                'district' => null,
                'address' => null,
                'skills' => null,
                'availability' => null,
                'status' => Volunteer::STATUS_ACTIVE,
            ]);

            $volunteerRequest->update([
                'status' => VolunteerRequest::STATUS_ACCEPTED,
                'responded_at' => now(),
            ]);

            return $volunteer;
        });

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Volunteer invitation accepted successfully.',
            'status' => 'accepted',
            'volunteer' => $volunteer->load([
                'user:id,name,email,phone,status,email_verified_at',
                'organization:id,name',
            ]),
        ]);
    }

    /**
     * Individual: Reject an administrator volunteer invitation.
     */
    public function rejectVolunteerRequest(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can reject volunteer invitations.',
            ], 403);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' =>
                'Only active users can reject volunteer invitations.',
            ], 422);
        }

        $volunteerRequest = DB::transaction(function () use ($user, $id) {
            $volunteerRequest = VolunteerRequest::where('id', $id)
                ->where('user_id', $user->id)
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->lockForUpdate()
                ->first();

            if (!$volunteerRequest) {
                abort(
                    response()->json([
                        'message' =>
                        'Volunteer invitation not found or already responded to.',
                    ], 404)
                );
            }

            $requestedBy = User::find(
                $volunteerRequest->requested_by
            );

            if (!$requestedBy || $requestedBy->role !== 'admin') {
                abort(
                    response()->json([
                        'message' =>
                        'This request is not an administrator invitation.',
                    ], 422)
                );
            }

            $volunteerRequest->update([
                'status' => VolunteerRequest::STATUS_REJECTED,
                'responded_at' => now(),
            ]);

            return $volunteerRequest;
        });

        return response()->json([
            'message' =>
            'Volunteer invitation declined successfully.',
            'status' => 'rejected',
            'request' => $volunteerRequest->fresh(),
        ]);
    }

    /**
     * Admin: Accept an individual volunteer application.
     */
    public function acceptVolunteerApplication(
        Request $request,
        int $id
    ) {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteer = DB::transaction(function () use ($id) {
            $volunteerRequest = VolunteerRequest::where('id', $id)
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->lockForUpdate()
                ->first();

            if (!$volunteerRequest) {
                abort(
                    response()->json([
                        'message' =>
                        'Volunteer request not found or already responded to.',
                    ], 404)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Individual-created request
            |--------------------------------------------------------------------------
            |
            | requested_by == user_id
            |
            */

            if (
                $volunteerRequest->requested_by !==
                $volunteerRequest->user_id
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'This request is an administrator invitation, not an individual application.',
                    ], 422)
                );
            }

            $volunteerUser = User::whereKey(
                $volunteerRequest->user_id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteerUser) {
                abort(
                    response()->json([
                        'message' => 'Volunteer user not found.',
                    ], 404)
                );
            }

            if ($volunteerUser->role !== 'individual') {
                abort(
                    response()->json([
                        'message' =>
                        'Only individual users can become volunteers.',
                    ], 422)
                );
            }

            if ($volunteerUser->status !== 'active') {
                abort(
                    response()->json([
                        'message' =>
                        'Only active users can become volunteers.',
                    ], 422)
                );
            }

            if (!$volunteerUser->email_verified_at) {
                abort(
                    response()->json([
                        'message' =>
                        'The user must verify their email before becoming a volunteer.',
                    ], 422)
                );
            }

            $existingVolunteer = Volunteer::where(
                'user_id',
                $volunteerUser->id
            )
                ->lockForUpdate()
                ->first();

            if ($existingVolunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'This user is already a registered volunteer.',
                    ], 422)
                );
            }

            $volunteer = Volunteer::create([
                'user_id' => $volunteerUser->id,
                'organization_id' => null,
                'district' => null,
                'address' => null,
                'skills' => null,
                'availability' => null,
                'status' => Volunteer::STATUS_ACTIVE,
            ]);

            $volunteerRequest->update([
                'status' => VolunteerRequest::STATUS_ACCEPTED,
                'responded_at' => now(),
            ]);

            return $volunteer;
        });

        $this->syncVolunteerAvailability($volunteer->user_id);

        return response()->json([
            'message' =>
            'Volunteer application accepted successfully.',
            'volunteer' => $volunteer->load([
                'user:id,name,email,phone,status,email_verified_at',
                'organization:id,name',
            ]),
        ]);
    }

    /**
     * Admin: Reject an individual volunteer application.
     */
    public function rejectVolunteerApplication(
        Request $request,
        int $id
    ) {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteerRequest = DB::transaction(function () use ($id) {
            $volunteerRequest = VolunteerRequest::where('id', $id)
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->lockForUpdate()
                ->first();

            if (!$volunteerRequest) {
                abort(
                    response()->json([
                        'message' =>
                        'Volunteer request not found or already responded to.',
                    ], 404)
                );
            }

            if (
                $volunteerRequest->requested_by !==
                $volunteerRequest->user_id
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'This request is an administrator invitation, not an individual application.',
                    ], 422)
                );
            }

            $volunteerRequest->update([
                'status' => VolunteerRequest::STATUS_REJECTED,
                'responded_at' => now(),
            ]);

            return $volunteerRequest;
        });

        return response()->json([
            'message' =>
            'Volunteer application rejected successfully.',
            'request' => $volunteerRequest->fresh(),
        ]);
    }

    /**
     * Individual: View own campaign assignments.
     */
    public function assignments(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can view volunteer assignments.',
            ], 403);
        }

        $assignments = CampaignVolunteerAssignment::query()
            ->where('volunteer_id', $user->id)
            ->with([
                'campaign',
                'assignedBy:id,name,email',
                'volunteer:id,name,email',
                'withdrawalReviewedBy:id,name,email',
            ])
            ->latest()
            ->get();

        return response()->json([
            'assignments' => $assignments,
        ]);
    }

    /**
     * Individual: Accept an assigned campaign.
     */
    public function acceptCampaignAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can accept campaign assignments.',
            ], 403);
        }

        $assignment = DB::transaction(function () use ($user, $id) {
            $volunteer = Volunteer::where(
                'user_id',
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are not registered as a volunteer.',
                    ], 404)
                );
            }

            if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
                abort(
                    response()->json([
                        'message' =>
                        'Only active volunteers can accept campaign assignments.',
                    ], 422)
                );
            }

            $assignment = CampaignVolunteerAssignment::where('id', $id)
                ->where('volunteer_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$assignment) {
                abort(
                    response()->json([
                        'message' =>
                        'Campaign assignment not found.',
                    ], 404)
                );
            }

            if (
                $assignment->status !==
                CampaignVolunteerAssignment::STATUS_ASSIGNED
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'Only assigned campaign assignments can be accepted.',
                    ], 422)
                );
            }

            $assignment->update([
                'status' =>
                CampaignVolunteerAssignment::STATUS_ACCEPTED,
            ]);

            return $assignment;
        });

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Campaign assignment accepted successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Individual: Reject an assigned campaign.
     */
    public function rejectCampaignAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can reject campaign assignments.',
            ], 403);
        }

        $validated = $request->validate([
            'rejection_reason' => [
                'required',
                'string',
                'min:5',
            ],
        ]);

        $assignment = DB::transaction(function () use (
            $user,
            $id,
            $validated
        ) {
            $volunteer = Volunteer::where(
                'user_id',
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are not registered as a volunteer.',
                    ], 404)
                );
            }

            if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
                abort(
                    response()->json([
                        'message' =>
                        'Only active volunteers can reject campaign assignments.',
                    ], 422)
                );
            }

            $assignment = CampaignVolunteerAssignment::where('id', $id)
                ->where('volunteer_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$assignment) {
                abort(
                    response()->json([
                        'message' =>
                        'Campaign assignment not found.',
                    ], 404)
                );
            }

            if (
                $assignment->status !==
                CampaignVolunteerAssignment::STATUS_ASSIGNED
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'Only assigned campaign assignments can be rejected.',
                    ], 422)
                );
            }

            $assignment->update([
                'status' =>
                CampaignVolunteerAssignment::STATUS_REJECTED,
                'rejection_reason' =>
                $validated['rejection_reason'],
                'rejection_validated' => null,
            ]);

            return $assignment;
        });

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Campaign assignment rejected successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Individual: Start an accepted campaign assignment.
     */
    public function startCampaignAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can start campaign assignments.',
            ], 403);
        }

        $assignment = DB::transaction(function () use ($user, $id) {
            $volunteer = Volunteer::where(
                'user_id',
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are not registered as a volunteer.',
                    ], 404)
                );
            }

            if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
                abort(
                    response()->json([
                        'message' =>
                        'Only active volunteers can start campaign assignments.',
                    ], 422)
                );
            }

            $assignment = CampaignVolunteerAssignment::where('id', $id)
                ->where('volunteer_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$assignment) {
                abort(
                    response()->json([
                        'message' =>
                        'Campaign assignment not found.',
                    ], 404)
                );
            }

            if (
                $assignment->status !==
                CampaignVolunteerAssignment::STATUS_ACCEPTED
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'Only accepted campaign assignments can be started.',
                    ], 422)
                );
            }

            $assignment->update([
                'status' =>
                CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
            ]);

            return $assignment;
        });

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Campaign assignment marked as in progress.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Individual: Complete an in-progress campaign assignment.
     *
     * Completing the assignment triggers the campaign completion check.
     */
    public function completeCampaignAssignment(
        Request $request,
        int $id,
        CampaignService $campaignService
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can complete campaign assignments.',
            ], 403);
        }

        $result = DB::transaction(function () use (
            $user,
            $id,
            $campaignService
        ) {
            $volunteer = Volunteer::where(
                'user_id',
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are not registered as a volunteer.',
                    ], 404)
                );
            }

            if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
                abort(
                    response()->json([
                        'message' =>
                        'Only active volunteers can complete campaign assignments.',
                    ], 422)
                );
            }

            $assignment = CampaignVolunteerAssignment::where('id', $id)
                ->where('volunteer_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$assignment) {
                abort(
                    response()->json([
                        'message' =>
                        'Campaign assignment not found.',
                    ], 404)
                );
            }

            if (
                $assignment->status !==
                CampaignVolunteerAssignment::STATUS_IN_PROGRESS
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'Only in-progress campaign assignments can be completed.',
                    ], 422)
                );
            }

            $assignment->update([
                'status' =>
                CampaignVolunteerAssignment::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | Refresh campaign after assignment completion
            |--------------------------------------------------------------------------
            */

            $campaign = $assignment->campaign()->lockForUpdate()->first();

            $campaign = $campaignService->completeCampaignIfEligible(
                $campaign
            );

            return [
                'assignment' => $assignment,
                'campaign' => $campaign,
            ];
        });

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Campaign assignment completed successfully.',
            'assignment' => $result['assignment']
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
            'campaign' => $result['campaign'],
        ]);
    }

    /**
     * Individual: Request withdrawal from an accepted/in-progress campaign.
     */
    public function requestCampaignWithdrawal(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can request campaign withdrawal.',
            ], 403);
        }

        $validated = $request->validate([
            'withdrawal_reason' => [
                'required',
                'string',
                'min:5',
            ],
        ]);

        $assignment = DB::transaction(function () use (
            $user,
            $id,
            $validated
        ) {
            $volunteer = Volunteer::where(
                'user_id',
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'You are not registered as a volunteer.',
                    ], 404)
                );
            }

            if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
                abort(
                    response()->json([
                        'message' =>
                        'Only active volunteers can request campaign withdrawal.',
                    ], 422)
                );
            }

            $assignment = CampaignVolunteerAssignment::where('id', $id)
                ->where('volunteer_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (!$assignment) {
                abort(
                    response()->json([
                        'message' =>
                        'Campaign assignment not found.',
                    ], 404)
                );
            }

            if (
                !in_array(
                    $assignment->status,
                    [
                        CampaignVolunteerAssignment::STATUS_ACCEPTED,
                        CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
                    ],
                    true
                )
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'Only accepted or in-progress campaign assignments can be withdrawn.',
                    ], 422)
                );
            }

            $assignment->update([
                'status' =>
                CampaignVolunteerAssignment::STATUS_WITHDRAWAL_REQUESTED,
                'withdrawal_reason' =>
                $validated['withdrawal_reason'],
                'withdrawal_requested_at' => now(),
                'withdrawal_reviewed_at' => null,
                'withdrawal_reviewed_by' => null,
            ]);

            return $assignment;
        });

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Campaign withdrawal request submitted successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Admin: Review a volunteer campaign withdrawal request.
     *
     * Approved:
     * withdrawal_requested -> withdrawn
     *
     * Rejected:
     * withdrawal_requested -> in_progress
     */
    public function reviewCampaignWithdrawal(
        Request $request,
        int $id
    ) {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'decision' => [
                'required',
                'in:approved,rejected',
            ],
            'review_note' => [
                'nullable',
                'string',
            ],
        ]);

        $assignment = DB::transaction(function () use (
            $id,
            $validated,
            $admin
        ) {
            $assignment = CampaignVolunteerAssignment::where('id', $id)
                ->lockForUpdate()
                ->first();

            if (!$assignment) {
                abort(
                    response()->json([
                        'message' =>
                        'Campaign assignment not found.',
                    ], 404)
                );
            }

            if (
                $assignment->status !==
                CampaignVolunteerAssignment::STATUS_WITHDRAWAL_REQUESTED
            ) {
                abort(
                    response()->json([
                        'message' =>
                        'Only pending withdrawal requests can be reviewed.',
                    ], 422)
                );
            }

            if ($validated['decision'] === 'approved') {
                $assignment->update([
                    'status' =>
                    CampaignVolunteerAssignment::STATUS_WITHDRAWN,
                    'withdrawal_reviewed_at' => now(),
                    'withdrawal_reviewed_by' => $admin->id,
                ]);
            } else {
                $assignment->update([
                    'status' =>
                    CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
                    'withdrawal_reviewed_at' => now(),
                    'withdrawal_reviewed_by' => $admin->id,
                ]);
            }

            return $assignment;
        });

        $this->syncVolunteerAvailability(
            $assignment->volunteer_id
        );

        return response()->json([
            'message' =>
            $validated['decision'] === 'approved'
                ? 'Campaign withdrawal approved successfully.'
                : 'Campaign withdrawal rejected successfully.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                    'withdrawalReviewedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Admin: Validate a volunteer campaign rejection.
     *
     * Valid:
     * rejection_validated = true
     *
     * Invalid:
     * rejection_validated = false
     */
    public function validateCampaignRejection(
        Request $request,
        int $id
    ) {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'is_valid' => [
                'required',
                'boolean',
            ],
        ]);

        $assignment = CampaignVolunteerAssignment::find($id);

        if (!$assignment) {
            return response()->json([
                'message' =>
                'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_REJECTED
        ) {
            return response()->json([
                'message' =>
                'Only rejected campaign assignments can be validated.',
            ], 422);
        }

        $assignment->update([
            'rejection_validated' =>
            $validated['is_valid'],
        ]);

        return response()->json([
            'message' =>
            $validated['is_valid']
                ? 'Rejection marked as valid.'
                : 'Rejection marked as invalid.',
            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Admin: View a specific volunteer.
     *
     * IMPORTANT:
     * This endpoint receives volunteers.id,
     * not users.id.
     */
    public function adminShow(
        Request $request,
        int $id
    ) {
        if (!$this->authorizeAdmin($request)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteer = Volunteer::with([
            'user:id,name,email,phone,status,email_verified_at',
            'organization:id,name',
            'campaignVolunteerAssignments.campaign',
        ])->find($id);

        if (!$volunteer) {
            return response()->json([
                'message' =>
                'Volunteer not found.',
            ], 404);
        }

        return response()->json([
            'volunteer' => $volunteer,
        ]);
    }

    /**
     * Admin: Update volunteer status.
     *
     * Supported lifecycle:
     *
     * pending   -> active / rejected
     * active    -> active / suspended / removed
     * suspended -> active / removed
     * rejected  -> rejected
     * removed   -> removed
     *
     * A volunteer cannot be suspended or removed while they
     * have an active campaign assignment.
     */
    public function updateStatus(
        Request $request,
        int $id
    ) {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:' . implode(',', Volunteer::statuses()),
            ],
        ]);

        $result = DB::transaction(function () use (
            $id,
            $validated
        ) {
            $volunteer = Volunteer::whereKey($id)
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                        'Volunteer not found.',
                    ], 404)
                );
            }

            $newStatus = $validated['status'];
            $currentStatus = $volunteer->status;

            /*
            |--------------------------------------------------------------------------
            | Prevent invalid status transitions
            |--------------------------------------------------------------------------
            */

            $allowedTransitions = [
                Volunteer::STATUS_PENDING => [
                    Volunteer::STATUS_PENDING,
                    Volunteer::STATUS_ACTIVE,
                    Volunteer::STATUS_REJECTED,
                ],

                Volunteer::STATUS_ACTIVE => [
                    Volunteer::STATUS_ACTIVE,
                    Volunteer::STATUS_SUSPENDED,
                    Volunteer::STATUS_REMOVED,
                ],

                Volunteer::STATUS_SUSPENDED => [
                    Volunteer::STATUS_SUSPENDED,
                    Volunteer::STATUS_ACTIVE,
                    Volunteer::STATUS_REMOVED,
                ],

                Volunteer::STATUS_REJECTED => [
                    Volunteer::STATUS_REJECTED,
                ],

                Volunteer::STATUS_REMOVED => [
                    Volunteer::STATUS_REMOVED,
                ],
            ];

            $allowedStatuses =
                $allowedTransitions[$currentStatus]
                ?? [$currentStatus];

            if (!in_array($newStatus, $allowedStatuses, true)) {
                abort(
                    response()->json([
                        'message' =>
                        "Invalid volunteer status transition from {$currentStatus} to {$newStatus}.",
                    ], 422)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Prevent suspension/removal while actively assigned
            |--------------------------------------------------------------------------
            |
            | activeStatuses() should contain:
            | assigned
            | accepted
            | in_progress
            | withdrawal_requested
            |
            */

            if (
                in_array(
                    $newStatus,
                    [
                        Volunteer::STATUS_SUSPENDED,
                        Volunteer::STATUS_REMOVED,
                    ],
                    true
                )
            ) {
                $hasActiveCampaignAssignment =
                    CampaignVolunteerAssignment::where(
                        'volunteer_id',
                        $volunteer->user_id
                    )
                    ->whereIn(
                        'status',
                        CampaignVolunteerAssignment::activeStatuses()
                    )
                    ->exists();

                if ($hasActiveCampaignAssignment) {
                    abort(
                        response()->json([
                            'message' =>
                            'This volunteer cannot be suspended or removed while they have an active campaign assignment.',
                        ], 422)
                    );
                }
            }

            $volunteer->update([
                'status' => $newStatus,
            ]);

            return $volunteer;
        });

        $this->syncVolunteerAvailability(
            $result->user_id
        );

        $message = match ($result->status) {
            Volunteer::STATUS_ACTIVE =>
            'Volunteer approved successfully.',

            Volunteer::STATUS_REJECTED =>
            'Volunteer rejected successfully.',

            Volunteer::STATUS_SUSPENDED =>
            'Volunteer suspended successfully.',

            Volunteer::STATUS_REMOVED =>
            'Volunteer removed successfully.',

            Volunteer::STATUS_PENDING =>
            'Volunteer status changed to pending.',

            default =>
            'Volunteer status updated successfully.',
        };

        return response()->json([
            'message' => $message,
            'volunteer' => $result
                ->fresh()
                ->load([
                    'user:id,name,email,phone,status,email_verified_at',
                    'organization:id,name',
                ]),
        ]);
    }
}
