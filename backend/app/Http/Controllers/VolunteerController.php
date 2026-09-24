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

    /*
    |--------------------------------------------------------------------------
    | VOLUNTEER AVAILABILITY
    |--------------------------------------------------------------------------
    */

    /**
     * Calculate current volunteer availability.
     */
    private function calculateAvailability(
        int $userId,
        string $volunteerStatus
    ): string {
        if ($volunteerStatus !== Volunteer::STATUS_ACTIVE) {
            return 'unavailable';
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

        return $hasActiveCampaignAssignment
            ? 'unavailable'
            : 'available';
    }

    /**
     * Convert a volunteer model into an API payload
     * with calculated availability.
     */
    private function volunteerWithAvailability(
        Volunteer $volunteer
    ): array {
        $data = $volunteer->toArray();

        $data['availability'] =
            $this->calculateAvailability(
                (int) $volunteer->user_id,
                $volunteer->status
            );

        return $data;
    }

    /**
     * Check whether a volunteer currently has
     * an active campaign assignment.
     */
    private function hasActiveCampaignAssignment(
        int $userId
    ): bool {
        return CampaignVolunteerAssignment::where(
            'volunteer_id',
            $userId
        )
            ->whereIn(
                'status',
                CampaignVolunteerAssignment::activeStatuses()
            )
            ->exists();
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — VOLUNTEER DIRECTORY
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: View registered volunteers and pending
     * administrator invitations.
     *
     * Individual applications are returned separately
     * by /admin/volunteers/requests.
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
        | Registered volunteers
        |--------------------------------------------------------------------------
        */

        $volunteers = Volunteer::with([
            'user:id,name,email,phone,status,email_verified_at',
        ])
            ->latest()
            ->get();

        $volunteerRows = $volunteers->map(
            function (Volunteer $volunteer) {
                return array_merge(
                    $this->volunteerWithAvailability($volunteer),
                    [
                        'request_type' => null,
                        'request_direction' => null,
                    ]
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Pending administrator invitations
        |--------------------------------------------------------------------------
        |
        | Admin invitation:
        |
        | requested_by = admin
        | requested_by != user_id
        |
        */

        $existingVolunteerUserIds = $volunteers
            ->pluck('user_id')
            ->filter()
            ->unique()
            ->values();

        $pendingInvitationsQuery = VolunteerRequest::with([
            'user:id,name,email,phone,status,email_verified_at',
        ])
            ->where(
                'status',
                VolunteerRequest::STATUS_PENDING
            )
            ->whereColumn(
                'requested_by',
                '!=',
                'user_id'
            );

        if ($existingVolunteerUserIds->isNotEmpty()) {
            $pendingInvitationsQuery->whereNotIn(
                'user_id',
                $existingVolunteerUserIds
            );
        }

        $pendingInvitations = $pendingInvitationsQuery
            ->latest()
            ->get()
            ->unique('user_id')
            ->values();

        $pendingInvitationRows = $pendingInvitations->map(
            function (VolunteerRequest $volunteerRequest) {
                return [
                    'id' => null,

                    'request_id' =>
                        $volunteerRequest->id,

                    'user_id' =>
                        $volunteerRequest->user_id,

                    'user' =>
                        $volunteerRequest->user,

                    'organization' => null,

                    'phone' =>
                        $volunteerRequest->user?->phone,

                    'district' => null,

                    'address' => null,

                    'skills' => null,

                    'availability' => null,

                    'status' =>
                        VolunteerRequest::STATUS_PENDING,

                    'request_type' =>
                        'invitation',

                    'request_direction' =>
                        'admin_to_user',

                    'response_note' =>
                        $volunteerRequest->response_note,

                    'responded_at' =>
                        $volunteerRequest->responded_at,

                    'created_at' =>
                        $volunteerRequest->created_at,

                    'updated_at' =>
                        $volunteerRequest->updated_at,
                ];
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Merge directory
        |--------------------------------------------------------------------------
        */

        $directory = $volunteerRows
            ->concat($pendingInvitationRows)
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

    /*
    |--------------------------------------------------------------------------
    | ADMIN — CANDIDATES
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: Get eligible individual users who can
     * receive an administrator volunteer invitation.
     */
    public function candidates(Request $request)
    {
        if (!$this->authorizeAdmin($request)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteerUserIds = Volunteer::query()
            ->pluck('user_id');

        $pendingRequestUserIds = VolunteerRequest::query()
            ->where(
                'status',
                VolunteerRequest::STATUS_PENDING
            )
            ->pluck('user_id');

        $candidates = User::query()
            ->where('role', 'individual')
            ->where('status', 'active')
            ->whereNotNull('email_verified_at')
            ->whereNotIn('id', $volunteerUserIds)
            ->whereNotIn('id', $pendingRequestUserIds)
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

  /*
|--------------------------------------------------------------------------
| ADMIN — VOLUNTEER REQUESTS
|--------------------------------------------------------------------------
*/

/**
 * Admin: View pending individual volunteer applications
 * and pending admin invitations.
 *
 * Directions:
 * - user_to_admin = individual applied to become a volunteer
 * - admin_to_user = admin invited an individual to become a volunteer
 *
 * Inactive volunteer reactivation requests are also
 * user_to_admin requests and are marked as request_type = reactivation.
 */
public function requests(Request $request)
{
    if (!$this->authorizeAdmin($request)) {
        return response()->json([
            'message' => 'Unauthorized.',
        ], 403);
    }

    $requests = VolunteerRequest::query()
        ->with([
            'user:id,name,email,phone,status,email_verified_at',
        ])
        ->where(
            'status',
            VolunteerRequest::STATUS_PENDING
        )
        ->latest()
        ->get();

    $userIds = $requests
        ->pluck('user_id')
        ->filter()
        ->unique()
        ->values();

    $volunteers = Volunteer::query()
        ->whereIn('user_id', $userIds)
        ->get()
        ->keyBy('user_id');

    $requests = $requests->map(
        function (VolunteerRequest $volunteerRequest) use ($volunteers) {

            $volunteer = $volunteers->get(
                $volunteerRequest->user_id
            );

            /*
             * User -> Admin
             *
             * The requester and recipient are the same user.
             */
            $isUserToAdmin =
                (int) $volunteerRequest->requested_by ===
                (int) $volunteerRequest->user_id;

            /*
             * Existing inactive volunteer means this
             * is a reactivation request rather than a
             * first-time volunteer application.
             */
            $isReactivation =
                $isUserToAdmin &&
                $volunteer &&
                $volunteer->status === Volunteer::STATUS_INACTIVE;

            /*
             * Admin -> User
             *
             * Admin invited this individual.
             */
            $requestDirection = $isUserToAdmin
                ? 'user_to_admin'
                : 'admin_to_user';

            /*
             * Determine the request type.
             */
            if ($requestDirection === 'admin_to_user') {
                $requestType = 'invitation';
            } elseif ($isReactivation) {
                $requestType = 'reactivation';
            } else {
                $requestType = 'application';
            }

            return [
                'id' =>
                    $volunteerRequest->id,

                'request_id' =>
                    $volunteerRequest->id,

                'user_id' =>
                    $volunteerRequest->user_id,

                'user' =>
                    $volunteerRequest->user,

                'volunteer' =>
                    $volunteer,

                'status' =>
                    $volunteerRequest->status,

                'request_type' =>
                    $requestType,

                'request_direction' =>
                    $requestDirection,

                'response_note' =>
                    $volunteerRequest->response_note,

                'responded_at' =>
                    $volunteerRequest->responded_at,

                'created_at' =>
                    $volunteerRequest->created_at,

                'updated_at' =>
                    $volunteerRequest->updated_at,
            ];
        }
    )->values();

    return response()->json([
        'requests' =>
            $requests,
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | ADMIN — SEND INVITATIONS
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: Send volunteer invitations.
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

        $volunteerUserIds = Volunteer::query()
            ->whereIn('user_id', $userIds)
            ->pluck('user_id');

        if ($volunteerUserIds->isNotEmpty()) {
            return response()->json([
                'message' =>
                    'One or more selected users are already volunteers.',
            ], 422);
        }

        $pendingRequestUserIds = VolunteerRequest::query()
            ->whereIn('user_id', $userIds)
            ->where(
                'status',
                VolunteerRequest::STATUS_PENDING
            )
            ->pluck('user_id');

        if ($pendingRequestUserIds->isNotEmpty()) {
            return response()->json([
                'message' =>
                    'One or more selected users already have a pending volunteer request.',
            ], 422);
        }

        $users = User::query()
            ->whereIn('id', $userIds)
            ->where('role', 'individual')
            ->where('status', 'active')
            ->whereNotNull('email_verified_at')
            ->get();

        if ($users->count() !== count($userIds)) {
            return response()->json([
                'message' =>
                    'One or more selected users are no longer eligible for a volunteer invitation.',
            ], 422);
        }

        DB::transaction(function () use (
            $userIds,
            $admin
        ) {
            foreach ($userIds as $userId) {
                VolunteerRequest::create([
                    'user_id' =>
                        $userId,

                    'requested_by' =>
                        $admin->id,

                    'status' =>
                        VolunteerRequest::STATUS_PENDING,
                ]);
            }
        });

        return response()->json([
            'message' =>
                count($userIds) === 1
                    ? 'Volunteer invitation sent successfully.'
                    : 'Volunteer invitations sent successfully.',

            'sent_count' =>
                count($userIds),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — CANCEL INVITATION
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: Cancel an administrator-created invitation.
     */
    public function cancelVolunteerInvitation(
        Request $request,
        int $id
    ) {
        $admin = $this->authorizeAdmin($request);

        if (!$admin) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteerRequest = DB::transaction(
            function () use ($admin, $id) {
                $volunteerRequest = VolunteerRequest::where(
                    'id',
                    $id
                )
                    ->where(
                        'requested_by',
                        $admin->id
                    )
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

                if (
                    (int) $volunteerRequest->requested_by ===
                    (int) $volunteerRequest->user_id
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This request is an individual application, not an administrator invitation.',
                        ], 422)
                    );
                }

                $volunteerRequest->update([
                    'status' =>
                        VolunteerRequest::STATUS_CANCELLED,

                    'responded_at' =>
                        now(),
                ]);

                return $volunteerRequest;
            }
        );

        return response()->json([
            'message' =>
                'Volunteer invitation cancelled successfully.',

            'status' =>
                VolunteerRequest::STATUS_CANCELLED,

            'request' =>
                $volunteerRequest->fresh(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — APPLY
    |--------------------------------------------------------------------------
    */

    /**
 * Individual: Submit a volunteer application.
 *
 * This endpoint is only for users who do NOT already have
 * a Volunteer profile.
 *
 * Existing inactive volunteers must use requestReactivation().
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

    $volunteer = Volunteer::where(
        'user_id',
        $user->id
    )->first();

    /*
    |--------------------------------------------------------------------------
    | Existing volunteer profile
    |--------------------------------------------------------------------------
    */

    if ($volunteer) {
        if ($volunteer->status === Volunteer::STATUS_INACTIVE) {
            return response()->json([
                'message' =>
                    'You already have an inactive volunteer profile. Please request reactivation instead.',
                'status' =>
                    'inactive_volunteer',
            ], 422);
        }

        if ($volunteer->status === Volunteer::STATUS_SUSPENDED) {
            return response()->json([
                'message' =>
                    'Your volunteer profile is suspended. You cannot submit a new volunteer request.',
                'status' =>
                    'suspended_volunteer',
            ], 422);
        }

        return response()->json([
            'message' =>
                'You are already a registered SP volunteer.',
            'status' =>
                'already_volunteer',
        ], 422);
    }

    $volunteerRequest = DB::transaction(
        function () use ($user) {
            $lockedUser = User::whereKey(
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$lockedUser) {
                abort(
                    response()->json([
                        'message' =>
                            'User account not found.',
                    ], 404)
                );
            }

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
                            'You already have a volunteer profile. Please use the appropriate volunteer status action.',
                    ], 422)
                );
            }

            $pendingRequest = VolunteerRequest::where(
                'user_id',
                $lockedUser->id
            )
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->lockForUpdate()
                ->first();

            if ($pendingRequest) {
                abort(
                    response()->json([
                        'message' =>
                            'You already have a pending volunteer request.',

                        'status' =>
                            VolunteerRequest::STATUS_PENDING,

                        'request' =>
                            $pendingRequest,
                    ], 422)
                );
            }

            return VolunteerRequest::create([
                'user_id' =>
                    $lockedUser->id,

                'requested_by' =>
                    $lockedUser->id,

                'status' =>
                    VolunteerRequest::STATUS_PENDING,
            ]);
        }
    );

    return response()->json([
        'message' =>
            'Volunteer request submitted successfully.',

        'status' =>
            VolunteerRequest::STATUS_PENDING,

        'request' =>
            $volunteerRequest->load(
                'user:id,name,email,phone,status,email_verified_at'
            ),
    ], 201);
}

/*
|--------------------------------------------------------------------------
| INDIVIDUAL — REQUEST VOLUNTEER REACTIVATION
|--------------------------------------------------------------------------
*/

/**
 * Individual: Request reactivation of an inactive volunteer profile.
 *
 * Existing Volunteer profile is preserved.
 *
 * inactive -> pending reactivation request -> admin approval -> active
 *
 * Suspended volunteers are not allowed to request reactivation.
 */
public function requestReactivation(Request $request)
{
    $user = $request->user();

    if (!$user || $user->role !== 'individual') {
        return response()->json([
            'message' =>
                'Only individual users can request volunteer reactivation.',
        ], 403);
    }

    if ($user->status !== 'active') {
        return response()->json([
            'message' =>
                'Only active users can request volunteer reactivation.',
        ], 422);
    }

    if (!$user->email_verified_at) {
        return response()->json([
            'message' =>
                'Please verify your email address before requesting volunteer reactivation.',
        ], 422);
    }

    $volunteerRequest = DB::transaction(
        function () use ($user) {
            $lockedUser = User::whereKey(
                $user->id
            )
                ->lockForUpdate()
                ->first();

            if (!$lockedUser) {
                abort(
                    response()->json([
                        'message' =>
                            'User account not found.',
                    ], 404)
                );
            }

            $volunteer = Volunteer::where(
                'user_id',
                $lockedUser->id
            )
                ->lockForUpdate()
                ->first();

            if (!$volunteer) {
                abort(
                    response()->json([
                        'message' =>
                            'You do not have a volunteer profile. Please submit a volunteer application instead.',
                        'status' =>
                            'no_volunteer_profile',
                    ], 422)
                );
            }

            if (
                $volunteer->status ===
                Volunteer::STATUS_SUSPENDED
            ) {
                abort(
                    response()->json([
                        'message' =>
                            'Your volunteer profile is suspended. You cannot request reactivation.',
                        'status' =>
                            'suspended_volunteer',
                    ], 422)
                );
            }

            if (
                $volunteer->status ===
                Volunteer::STATUS_ACTIVE
            ) {
                abort(
                    response()->json([
                        'message' =>
                            'Your volunteer profile is already active.',
                        'status' =>
                            'active_volunteer',
                    ], 422)
                );
            }

            $pendingRequest = VolunteerRequest::where(
                'user_id',
                $lockedUser->id
            )
                ->where(
                    'requested_by',
                    $lockedUser->id
                )
                ->where(
                    'status',
                    VolunteerRequest::STATUS_PENDING
                )
                ->lockForUpdate()
                ->first();

            if ($pendingRequest) {
                abort(
                    response()->json([
                        'message' =>
                            'You already have a pending volunteer reactivation request.',

                        'status' =>
                            VolunteerRequest::STATUS_PENDING,

                        'request' =>
                            $pendingRequest,
                    ], 422)
                );
            }

            return VolunteerRequest::create([
                'user_id' =>
                    $lockedUser->id,

                'requested_by' =>
                    $lockedUser->id,

                'status' =>
                    VolunteerRequest::STATUS_PENDING,
            ]);
        }
    );

    return response()->json([
        'message' =>
            'Volunteer reactivation request submitted successfully.',

        'status' =>
            VolunteerRequest::STATUS_PENDING,

        'request' =>
            $volunteerRequest->load(
                'user:id,name,email,phone,status,email_verified_at'
            ),
    ], 201);
}

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — VIEW VOLUNTEER
    |--------------------------------------------------------------------------
    */

    /**
     * Individual: View own volunteer information,
     * request history and campaign assignments.
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
        ])
            ->where(
                'user_id',
                $user->id
            )
            ->first();

        $volunteerRequest = VolunteerRequest::query()
            ->where(
                'user_id',
                $user->id
            )
            ->latest()
            ->first();

        $assignments = CampaignVolunteerAssignment::query()
            ->where(
                'volunteer_id',
                $user->id
            )
            ->with([
                'campaign',
                'assignedBy:id,name,email',
                'volunteer:id,name,email',
                'withdrawalReviewedBy:id,name,email',
            ])
            ->latest()
            ->get();

        return response()->json([
            'is_volunteer' =>
                (bool) $volunteer,

            'volunteer' =>
                $volunteer
                    ? $this->volunteerWithAvailability(
                        $volunteer
                    )
                    : null,

            'request' =>
                $volunteerRequest,

            'assignments' =>
                $assignments,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — ACCEPT ADMIN INVITATION
    |--------------------------------------------------------------------------
    */

    /**
     * Individual: Accept an administrator invitation.
     */
    public function acceptVolunteerRequest(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                    'Only individual users can accept volunteer invitations.',
            ], 403);
        }

        $volunteer = DB::transaction(
            function () use ($user, $id) {
                $lockedUser = User::whereKey(
                    $user->id
                )
                    ->lockForUpdate()
                    ->first();

                if (!$lockedUser) {
                    abort(
                        response()->json([
                            'message' =>
                                'User account not found.',
                        ], 404)
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
                                'Please verify your email address before accepting a volunteer invitation.',
                        ], 422)
                    );
                }

                $volunteerRequest = VolunteerRequest::where(
                    'id',
                    $id
                )
                    ->where(
                        'user_id',
                        $lockedUser->id
                    )
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

                if (
                    (int) $volunteerRequest->requested_by ===
                    (int) $volunteerRequest->user_id
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This is an individual application, not an administrator invitation.',
                        ], 422)
                    );
                }

                $requestedBy = User::whereKey(
                    $volunteerRequest->requested_by
                )->first();

                if (
                    !$requestedBy ||
                    $requestedBy->role !== 'admin'
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This volunteer invitation is not valid.',
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

                /*
                |--------------------------------------------------------------------------
                | Create volunteer profile.
                |--------------------------------------------------------------------------
                |
                | Current volunteers table:
                |
                | user_id
                | skills
                | status
                |
                */

                $volunteer = Volunteer::create([
                    'user_id' =>
                        $lockedUser->id,

                    'skills' =>
                        null,

                    'status' =>
                        Volunteer::STATUS_ACTIVE,
                ]);

                $volunteerRequest->update([
                    'status' =>
                        VolunteerRequest::STATUS_ACCEPTED,

                    'responded_at' =>
                        now(),
                ]);

                return $volunteer;
            }
        );

        $volunteer = $volunteer
            ->fresh()
            ->load([
                'user:id,name,email,phone,status,email_verified_at',
            ]);

        return response()->json([
            'message' =>
                'Volunteer invitation accepted successfully.',

            'status' =>
                VolunteerRequest::STATUS_ACCEPTED,

            'volunteer' =>
                $this->volunteerWithAvailability(
                    $volunteer
                ),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — REJECT ADMIN INVITATION
    |--------------------------------------------------------------------------
    */

    /**
     * Individual: Reject an administrator invitation.
     */
    public function rejectVolunteerRequest(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                    'Only individual users can reject volunteer invitations.',
            ], 403);
        }

        $volunteerRequest = DB::transaction(
            function () use ($user, $id) {
                $volunteerRequest = VolunteerRequest::where(
                    'id',
                    $id
                )
                    ->where(
                        'user_id',
                        $user->id
                    )
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

                if (
                    (int) $volunteerRequest->requested_by ===
                    (int) $volunteerRequest->user_id
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This is your own volunteer application. You can cancel it while it is pending.',
                        ], 422)
                    );
                }

                $requestedBy = User::whereKey(
                    $volunteerRequest->requested_by
                )->first();

                if (
                    !$requestedBy ||
                    $requestedBy->role !== 'admin'
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This volunteer invitation is not valid.',
                        ], 422)
                    );
                }

                $volunteerRequest->update([
                    'status' =>
                        VolunteerRequest::STATUS_REJECTED,

                    'responded_at' =>
                        now(),
                ]);

                return $volunteerRequest;
            }
        );

        return response()->json([
            'message' =>
                'Volunteer invitation rejected successfully.',

            'status' =>
                VolunteerRequest::STATUS_REJECTED,

            'request' =>
                $volunteerRequest->fresh(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — CANCEL OWN APPLICATION
    |--------------------------------------------------------------------------
    */

    /**
     * Individual: Cancel their own pending application.
     */
    public function cancelVolunteerRequest(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                    'Only individual users can cancel their volunteer application.',
            ], 403);
        }

        $volunteerRequest = DB::transaction(
            function () use ($user, $id) {
                $volunteerRequest = VolunteerRequest::where(
                    'id',
                    $id
                )
                    ->where(
                        'user_id',
                        $user->id
                    )
                    ->where(
                        'requested_by',
                        $user->id
                    )
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
                                'Volunteer application not found or already responded to.',
                        ], 404)
                    );
                }

                $volunteerRequest->update([
                    'status' =>
                        VolunteerRequest::STATUS_CANCELLED,

                    'responded_at' =>
                        now(),
                ]);

                return $volunteerRequest;
            }
        );

        return response()->json([
            'message' =>
                'Volunteer request cancelled successfully.',

            'status' =>
                VolunteerRequest::STATUS_CANCELLED,

            'request' =>
                $volunteerRequest->fresh(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — ACCEPT INDIVIDUAL APPLICATION
    |--------------------------------------------------------------------------
    */

    /**
 * Admin: Accept an individual volunteer application
 * or reactivate an inactive volunteer.
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

    $result = DB::transaction(
        function () use ($id) {
            $volunteerRequest = VolunteerRequest::where(
                'id',
                $id
            )
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
            | This endpoint is only for user -> admin requests.
            |--------------------------------------------------------------------------
            */

            if (
                (int) $volunteerRequest->requested_by !==
                (int) $volunteerRequest->user_id
            ) {
                abort(
                    response()->json([
                        'message' =>
                            'This request is an administrator invitation, not an individual request.',
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
                        'message' =>
                            'Volunteer user not found.',
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

            /*
            |--------------------------------------------------------------------------
            | REACTIVATION
            |--------------------------------------------------------------------------
            */

            if ($existingVolunteer) {
                if (
                    $existingVolunteer->status ===
                    Volunteer::STATUS_SUSPENDED
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This volunteer is suspended and cannot be reactivated through a request.',
                        ], 422)
                    );
                }

                if (
                    $existingVolunteer->status ===
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This volunteer is already active.',
                        ], 422)
                    );
                }

                $existingVolunteer->update([
                    'status' =>
                        Volunteer::STATUS_ACTIVE,
                ]);

                $volunteerRequest->update([
                    'status' =>
                        VolunteerRequest::STATUS_ACCEPTED,

                    'responded_at' =>
                        now(),
                ]);

                return [
                    'type' =>
                        'reactivation',

                    'volunteer' =>
                        $existingVolunteer,
                ];
            }

            /*
            |--------------------------------------------------------------------------
            | NEW VOLUNTEER APPLICATION
            |--------------------------------------------------------------------------
            */

            $volunteer = Volunteer::create([
                'user_id' =>
                    $volunteerUser->id,

                'skills' =>
                    null,

                'status' =>
                    Volunteer::STATUS_ACTIVE,
            ]);

            $volunteerRequest->update([
                'status' =>
                    VolunteerRequest::STATUS_ACCEPTED,

                'responded_at' =>
                    now(),
            ]);

            return [
                'type' =>
                    'application',

                'volunteer' =>
                    $volunteer,
            ];
        }
    );

    $volunteer = $result['volunteer']
        ->fresh()
        ->load([
            'user:id,name,email,phone,status,email_verified_at',
        ]);

    $message =
        $result['type'] === 'reactivation'
            ? 'Volunteer reactivation approved successfully.'
            : 'Volunteer application accepted successfully.';

    return response()->json([
        'message' =>
            $message,

        'status' =>
            VolunteerRequest::STATUS_ACCEPTED,

        'request_type' =>
            $result['type'],

        'volunteer' =>
            $this->volunteerWithAvailability(
                $volunteer
            ),
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | ADMIN — REJECT INDIVIDUAL APPLICATION
    |--------------------------------------------------------------------------
    */

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

        $validated = $request->validate([
            'response_note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $volunteerRequest = DB::transaction(
            function () use (
                $id,
                $validated
            ) {
                $volunteerRequest = VolunteerRequest::where(
                    'id',
                    $id
                )
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
                                'Volunteer application not found or already responded to.',
                        ], 404)
                    );
                }

                if (
                    (int) $volunteerRequest->requested_by !==
                    (int) $volunteerRequest->user_id
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'This request is an administrator invitation, not an individual application.',
                        ], 422)
                    );
                }

                $volunteerRequest->update([
                    'status' =>
                        VolunteerRequest::STATUS_REJECTED,

                    'response_note' =>
                        $validated['response_note'] ?? null,

                    'responded_at' =>
                        now(),
                ]);

                return $volunteerRequest;
            }
        );

        return response()->json([
            'message' =>
                'Volunteer application rejected successfully.',

            'status' =>
                VolunteerRequest::STATUS_REJECTED,

            'request' =>
                $volunteerRequest
                    ->fresh()
                    ->load([
                        'user:id,name,email,phone,status,email_verified_at',
                    ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — VIEW SINGLE VOLUNTEER
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: View a registered volunteer.
     *
     * Route ID = volunteers.id
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
            'campaignVolunteerAssignments',
        ])
            ->whereKey($id)
            ->first();

        if (!$volunteer) {
            return response()->json([
                'message' =>
                    'Volunteer not found.',
            ], 404);
        }

        return response()->json([
            'volunteer' =>
                $this->volunteerWithAvailability(
                    $volunteer
                ),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — UPDATE VOLUNTEER STATUS
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: Update volunteer status.
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

        $volunteer = DB::transaction(
            function () use (
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

                $newStatus =
                    $validated['status'];

                $currentStatus =
                    $volunteer->status;

                $allowedTransitions = [
                    Volunteer::STATUS_ACTIVE => [
                        Volunteer::STATUS_ACTIVE,
                        Volunteer::STATUS_INACTIVE,
                        Volunteer::STATUS_SUSPENDED,
                    ],

                    Volunteer::STATUS_INACTIVE => [
                        Volunteer::STATUS_INACTIVE,
                        Volunteer::STATUS_ACTIVE,
                    ],

                    Volunteer::STATUS_SUSPENDED => [
                        Volunteer::STATUS_SUSPENDED,
                        Volunteer::STATUS_ACTIVE,
                        Volunteer::STATUS_INACTIVE,
                    ],
                ];

                if (
                    !isset(
                        $allowedTransitions[$currentStatus]
                    )
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                "Volunteer has an unsupported legacy status: {$currentStatus}. Run the volunteer lifecycle migration first.",
                        ], 422)
                    );
                }

                if (
                    !in_array(
                        $newStatus,
                        $allowedTransitions[$currentStatus],
                        true
                    )
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                "Invalid volunteer status transition from {$currentStatus} to {$newStatus}.",
                        ], 422)
                    );
                }

                if (
                    in_array(
                        $newStatus,
                        [
                            Volunteer::STATUS_INACTIVE,
                            Volunteer::STATUS_SUSPENDED,
                        ],
                        true
                    ) &&
                    $currentStatus !== $newStatus
                ) {
                    if (
                        $this->hasActiveCampaignAssignment(
                            (int) $volunteer->user_id
                        )
                    ) {
                        abort(
                            response()->json([
                                'message' =>
                                    'This volunteer cannot be made inactive or suspended while they have an active campaign assignment.',
                            ], 422)
                        );
                    }
                }

                $volunteer->update([
                    'status' =>
                        $newStatus,
                ]);

                return $volunteer;
            }
        );

        $message = match ($volunteer->status) {
            Volunteer::STATUS_ACTIVE =>
                'Volunteer status updated to active.',

            Volunteer::STATUS_INACTIVE =>
                'Volunteer status updated to inactive.',

            Volunteer::STATUS_SUSPENDED =>
                'Volunteer suspended successfully.',

            default =>
                'Volunteer status updated successfully.',
        };

        $volunteer = $volunteer
            ->fresh()
            ->load([
                'user:id,name,email,phone,status,email_verified_at',
            ]);

        return response()->json([
            'message' =>
                $message,

            'volunteer' =>
                $this->volunteerWithAvailability(
                    $volunteer
                ),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — RESIGN
    |--------------------------------------------------------------------------
    */

    /**
     * Individual: Resign as a volunteer.
     *
     * Pending application:
     *     pending -> cancelled
     *
     * Existing volunteer:
     *     active -> inactive
     */
    public function resign(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                    'Only individual users can resign as volunteers.',
            ], 403);
        }

        $volunteer = DB::transaction(
            function () use ($user) {
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

                if (
                    $volunteer->status !==
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'Only active volunteers can resign.',
                        ], 422)
                    );
                }

                if (
                    $this->hasActiveCampaignAssignment(
                        (int) $volunteer->user_id
                    )
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'You cannot resign while you have an active campaign assignment.',
                        ], 422)
                    );
                }

                $volunteer->update([
                    'status' =>
                        Volunteer::STATUS_INACTIVE,
                ]);

                return $volunteer;
            }
        );

        $volunteer = $volunteer
            ->fresh()
            ->load([
                'user:id,name,email,phone,status,email_verified_at',
            ]);

        return response()->json([
            'message' =>
                'You have resigned as a volunteer successfully.',

            'status' =>
                Volunteer::STATUS_INACTIVE,

            'volunteer' =>
                $this->volunteerWithAvailability(
                    $volunteer
                ),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — CAMPAIGN ASSIGNMENTS
    |--------------------------------------------------------------------------
    */

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
            ->where(
                'volunteer_id',
                $user->id
            )
            ->with([
                'campaign',
                'assignedBy:id,name,email',
                'volunteer:id,name,email',
                'withdrawalReviewedBy:id,name,email',
            ])
            ->latest()
            ->get();

        return response()->json([
            'assignments' =>
                $assignments,
        ]);
    }

    /**
     * Individual: Accept an assigned campaign.
     *
     * assigned -> accepted
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

        $assignment = DB::transaction(
            function () use (
                $user,
                $id
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

                if (
                    $volunteer->status !==
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'Only active volunteers can accept campaign assignments.',
                        ], 422)
                    );
                }

                $hasAnotherActiveAssignment =
                    CampaignVolunteerAssignment::where(
                        'volunteer_id',
                        $user->id
                    )
                        ->whereIn(
                            'status',
                            CampaignVolunteerAssignment::activeStatuses()
                        )
                        ->where(
                            'id',
                            '!=',
                            $id
                        )
                        ->exists();

                if ($hasAnotherActiveAssignment) {
                    abort(
                        response()->json([
                            'message' =>
                                'You already have an active campaign assignment.',
                        ], 422)
                    );
                }

                $assignment =
                    CampaignVolunteerAssignment::where(
                        'id',
                        $id
                    )
                        ->where(
                            'volunteer_id',
                            $user->id
                        )
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
            }
        );

        return response()->json([
            'message' =>
                'Campaign assignment accepted successfully.',

            'assignment' =>
                $assignment
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
     *
     * assigned -> rejected
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

        $assignment = DB::transaction(
            function () use (
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

                if (
                    $volunteer->status !==
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'Only active volunteers can reject campaign assignments.',
                        ], 422)
                    );
                }

                $assignment =
                    CampaignVolunteerAssignment::where(
                        'id',
                        $id
                    )
                        ->where(
                            'volunteer_id',
                            $user->id
                        )
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

                    'rejection_validated' =>
                        null,
                ]);

                return $assignment;
            }
        );

        return response()->json([
            'message' =>
                'Campaign assignment rejected successfully.',

            'assignment' =>
                $assignment
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
     *
     * accepted -> in_progress
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

        $assignment = DB::transaction(
            function () use (
                $user,
                $id
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

                if (
                    $volunteer->status !==
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'Only active volunteers can start campaign assignments.',
                        ], 422)
                    );
                }

                $assignment =
                    CampaignVolunteerAssignment::where(
                        'id',
                        $id
                    )
                        ->where(
                            'volunteer_id',
                            $user->id
                        )
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
            }
        );

        return response()->json([
            'message' =>
                'Campaign assignment marked as in progress.',

            'assignment' =>
                $assignment
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
     * in_progress -> completed
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

        $result = DB::transaction(
            function () use (
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

                if (
                    $volunteer->status !==
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'Only active volunteers can complete campaign assignments.',
                        ], 422)
                    );
                }

                $assignment =
                    CampaignVolunteerAssignment::where(
                        'id',
                        $id
                    )
                        ->where(
                            'volunteer_id',
                            $user->id
                        )
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

                    'completed_at' =>
                        now(),
                ]);

                $campaign = $assignment
                    ->campaign()
                    ->lockForUpdate()
                    ->first();

                $campaign =
                    $campaignService
                        ->completeCampaignIfEligible(
                            $campaign
                        );

                return [
                    'assignment' =>
                        $assignment,

                    'campaign' =>
                        $campaign,
                ];
            }
        );

        return response()->json([
            'message' =>
                'Campaign assignment completed successfully.',

            'assignment' =>
                $result['assignment']
                    ->fresh()
                    ->load([
                        'campaign',
                        'volunteer:id,name,email',
                        'assignedBy:id,name,email',
                    ]),

            'campaign' =>
                $result['campaign'],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL — REQUEST CAMPAIGN WITHDRAWAL
    |--------------------------------------------------------------------------
    */

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

        $assignment = DB::transaction(
            function () use (
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

                if (
                    $volunteer->status !==
                    Volunteer::STATUS_ACTIVE
                ) {
                    abort(
                        response()->json([
                            'message' =>
                                'Only active volunteers can request campaign withdrawal.',
                        ], 422)
                    );
                }

                $assignment =
                    CampaignVolunteerAssignment::where(
                        'id',
                        $id
                    )
                        ->where(
                            'volunteer_id',
                            $user->id
                        )
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

                    'withdrawal_requested_at' =>
                        now(),

                    'withdrawal_reviewed_at' =>
                        null,

                    'withdrawal_reviewed_by' =>
                        null,
                ]);

                return $assignment;
            }
        );

        return response()->json([
            'message' =>
                'Campaign withdrawal request submitted successfully.',

            'assignment' =>
                $assignment
                    ->fresh()
                    ->load([
                        'campaign',
                        'volunteer:id,name,email',
                        'assignedBy:id,name,email',
                    ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — REVIEW CAMPAIGN WITHDRAWAL
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: Review a volunteer withdrawal request.
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

        $assignment = DB::transaction(
            function () use (
                $id,
                $validated,
                $admin
            ) {
                $assignment =
                    CampaignVolunteerAssignment::where(
                        'id',
                        $id
                    )
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

                if (
                    $validated['decision'] ===
                    'approved'
                ) {
                    $assignment->update([
                        'status' =>
                            CampaignVolunteerAssignment::STATUS_WITHDRAWN,

                        'withdrawal_reviewed_at' =>
                            now(),

                        'withdrawal_reviewed_by' =>
                            $admin->id,
                    ]);
                } else {
                    $assignment->update([
                        'status' =>
                            CampaignVolunteerAssignment::STATUS_IN_PROGRESS,

                        'withdrawal_reviewed_at' =>
                            now(),

                        'withdrawal_reviewed_by' =>
                            $admin->id,
                    ]);
                }

                return $assignment;
            }
        );

        return response()->json([
            'message' =>
                $validated['decision'] === 'approved'
                    ? 'Campaign withdrawal approved successfully.'
                    : 'Campaign withdrawal rejected successfully.',

            'assignment' =>
                $assignment
                    ->fresh()
                    ->load([
                        'campaign',
                        'volunteer:id,name,email',
                        'assignedBy:id,name,email',
                        'withdrawalReviewedBy:id,name,email',
                    ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ADMIN — VALIDATE CAMPAIGN REJECTION
    |--------------------------------------------------------------------------
    */

    /**
     * Admin: Validate a volunteer's campaign rejection.
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

        $assignment =
            CampaignVolunteerAssignment::find($id);

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

            'assignment' =>
                $assignment
                    ->fresh()
                    ->load([
                        'campaign',
                        'volunteer:id,name,email',
                        'assignedBy:id,name,email',
                    ]),
        ]);
    }
}
