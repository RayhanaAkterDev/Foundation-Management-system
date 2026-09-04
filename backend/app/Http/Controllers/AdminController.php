<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Organization;
use App\Models\IndividualProfile;
use App\Models\HelpRequest;
use App\Models\HelpRequestAssignment;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Volunteer;
use App\Models\CampaignVolunteerAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Admin Authorization Helper
    |--------------------------------------------------------------------------
    */

    private function authorizeAdmin(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return $user;
    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    public function dashboard(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        /*
        |--------------------------------------------------------------------------
        | Recent Activity
        |--------------------------------------------------------------------------
        */

        $recentActivity = collect()
            ->merge(
                User::whereIn('role', [
                    'individual',
                    'organization',
                    'admin',
                ])
                    ->latest()
                    ->take(5)
                    ->get([
                        'id',
                        'name',
                        'role',
                        'created_at',
                    ])
                    ->map(function ($item) {
                        return [
                            'id' => 'user-' . $item->id,
                            'type' => 'user',
                            'text' => "{$item->name} registered as {$item->role}.",
                            'time' => $item->created_at->diffForHumans(),
                            'created_at' => $item->created_at,
                        ];
                    })
            )
            ->merge(
                Organization::latest()
                    ->take(5)
                    ->get([
                        'id',
                        'name',
                        'verification_status',
                        'created_at',
                    ])
                    ->map(function ($item) {
                        return [
                            'id' => 'organization-' . $item->id,
                            'type' => 'organization',
                            'text' => "{$item->name} registered as an organization.",
                            'time' => $item->created_at->diffForHumans(),
                            'created_at' => $item->created_at,
                        ];
                    })
            )
            ->merge(
                HelpRequest::latest()
                    ->take(5)
                    ->get([
                        'id',
                        'title',
                        'status',
                        'created_at',
                    ])
                    ->map(function ($item) {
                        return [
                            'id' => 'help-request-' . $item->id,
                            'type' => 'helpRequest',
                            'text' => "Help request \"{$item->title}\" was submitted.",
                            'time' => $item->created_at->diffForHumans(),
                            'created_at' => $item->created_at,
                        ];
                    })
            )
            ->merge(
                Donation::latest()
                    ->take(5)
                    ->get([
                        'id',
                        'amount',
                        'status',
                        'created_at',
                    ])
                    ->map(function ($item) {
                        return [
                            'id' => 'donation-' . $item->id,
                            'type' => 'donation',
                            'text' => 'Donation of ৳' .
                                number_format((float) $item->amount, 2) .
                                ' was recorded.',
                            'time' => $item->created_at->diffForHumans(),
                            'created_at' => $item->created_at,
                        ];
                    })
            )
            ->merge(
                Volunteer::latest()
                    ->take(5)
                    ->get([
                        'id',
                        'status',
                        'created_at',
                    ])
                    ->map(function ($item) {
                        return [
                            'id' => 'volunteer-' . $item->id,
                            'type' => 'volunteer',
                            'text' => "A volunteer application was {$item->status}.",
                            'time' => $item->created_at->diffForHumans(),
                            'created_at' => $item->created_at,
                        ];
                    })
            )
            ->merge(
                Campaign::latest()
                    ->take(5)
                    ->get([
                        'id',
                        'title',
                        'status',
                        'created_at',
                    ])
                    ->map(function ($item) {
                        return [
                            'id' => 'campaign-' . $item->id,
                            'type' => 'campaign',
                            'text' => "Campaign \"{$item->title}\" was created.",
                            'time' => $item->created_at->diffForHumans(),
                            'created_at' => $item->created_at,
                        ];
                    })
            )
            ->sortByDesc('created_at')
            ->take(8)
            ->values();

        return response()->json([
            'stats' => [
                'totalUsers' => User::count(),

                'totalOrganizations' => Organization::count(),

                'pendingVerification' => Organization::where(
                    'verification_status',
                    'pending'
                )->count(),

                'totalHelpRequests' => HelpRequest::count(),

                'pendingHelpRequests' => HelpRequest::where(
                    'status',
                    HelpRequest::STATUS_PENDING
                )->count(),

                'activeCampaigns' => Campaign::where(
                    'status',
                    Campaign::STATUS_ACTIVE
                )->count(),

                'totalDonations' => Donation::where(
                    'status',
                    'completed'
                )->sum('amount'),

                'totalVolunteers' => Volunteer::count(),

                'reportsGenerated' => 0,
            ],

            'pendingHelpRequests' => HelpRequest::where(
                'status',
                HelpRequest::STATUS_PENDING
            )
                ->latest()
                ->take(5)
                ->get(),

            'pendingVerifications' => Organization::where(
                'verification_status',
                'pending'
            )
                ->latest()
                ->take(5)
                ->get(),

            'recentUsers' => User::latest()
                ->take(5)
                ->get([
                    'id',
                    'name',
                    'email',
                    'role',
                    'status',
                    'created_at',
                ]),

            'recentActivity' => $recentActivity,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Users - List
    |--------------------------------------------------------------------------
    */

    public function users(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $users = User::with([
            'individualProfile',
            'organization',
        ])
            ->latest()
            ->get([
                'id',
                'name',
                'email',
                'role',
                'status',
                'email_verified_at',
                'created_at',
            ]);

        return response()->json([
            'users' => $users,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Users - View
    |--------------------------------------------------------------------------
    */

    public function showUser(Request $request, int $id)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $targetUser = User::with([
            'individualProfile',
            'organization',
        ])->find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => $targetUser,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Users - Add
    |--------------------------------------------------------------------------
    */

    public function storeUser(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],

            'role' => [
                'required',
                'in:individual,organization,admin',
            ],

            'status' => [
                'nullable',
                'in:active,inactive,suspended',
            ],

            'organization_type' => [
                'nullable',
                'string',
                'max:255',
            ],

            'registration_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'website' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'mission' => [
                'nullable',
                'string',
            ],

            'focus_areas' => [
                'nullable',
            ],

            'communities_served' => [
                'nullable',
            ],

            'team_size' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'primary_activities' => [
                'nullable',
            ],
        ]);

        $result = DB::transaction(function () use ($validated) {
            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
                'status' => $validated['status'] ?? 'active',
            ]);

            $individualProfile = null;
            $organization = null;

            if ($validated['role'] === 'individual') {
                $individualProfile = IndividualProfile::create([
                    'user_id' => $newUser->id,
                ]);
            }

            if ($validated['role'] === 'organization') {
                $organization = Organization::create([
                    'user_id' => $newUser->id,
                    'name' => $validated['name'],

                    'organization_type' =>
                    $validated['organization_type'] ?? null,

                    'registration_number' =>
                    $validated['registration_number'] ?? null,

                    'phone' =>
                    $validated['phone'] ?? null,

                    'website' =>
                    $validated['website'] ?? null,

                    'address' =>
                    $validated['address'] ?? null,

                    'mission' =>
                    $validated['mission'] ?? null,

                    'focus_areas' =>
                    $validated['focus_areas'] ?? null,

                    'communities_served' =>
                    $validated['communities_served'] ?? null,

                    'team_size' =>
                    $validated['team_size'] ?? null,

                    'primary_activities' =>
                    $validated['primary_activities'] ?? null,

                    'verification_status' => 'pending',
                ]);
            }

            return [
                'user' => $newUser,
                'individualProfile' => $individualProfile,
                'organization' => $organization,
            ];
        });

        return response()->json([
            'message' => 'User created successfully.',

            'user' => $result['user']
                ->fresh()
                ->load([
                    'individualProfile',
                    'organization',
                ]),

            'individualProfile' => $result['individualProfile'],

            'organization' => $result['organization'],
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Users - Edit
    |--------------------------------------------------------------------------
    |
    | Existing user roles cannot be changed.
    |
    */

    public function updateUser(Request $request, int $id)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email,' . $targetUser->id,
            ],

            'role' => [
                'required',
                'in:individual,organization,admin',
            ],

            'status' => [
                'required',
                'in:active,inactive,suspended',
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
            ],
        ]);

        if ($validated['role'] !== $targetUser->role) {
            return response()->json([
                'message' =>
                'User role cannot be changed after account creation.',
            ], 422);
        }

        if (
            $targetUser->id === $user->id &&
            $validated['role'] !== 'admin'
        ) {
            return response()->json([
                'message' => 'You cannot change your own admin role.',
            ], 422);
        }

        $targetUser->name = $validated['name'];
        $targetUser->email = $validated['email'];
        $targetUser->status = $validated['status'];


        if (!empty($validated['password'])) {
            $targetUser->password = $validated['password'];
        }

        $targetUser->save();

        if ($targetUser->role === 'organization') {
            Organization::where(
                'user_id',
                $targetUser->id
            )->update([
                'name' => $targetUser->name,
            ]);
        }

        return response()->json([
            'message' => 'User updated successfully.',

            'user' => $targetUser
                ->fresh()
                ->load([
                    'individualProfile',
                    'organization',
                ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Users - Delete
    |--------------------------------------------------------------------------
    */

    public function destroyUser(Request $request, int $id)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($targetUser->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account.',
            ], 422);
        }

        if ($targetUser->role === 'admin') {
            return response()->json([
                'message' =>
                'Admin accounts cannot be deleted from user management.',
            ], 422);
        }

        $targetUser->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Organizations - Add
    |--------------------------------------------------------------------------
    */

    public function storeOrganization(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'organization_type' => [
                'nullable',
                'string',
                'max:255',
            ],

            'registration_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'website' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
        ]);

        $temporaryPassword = Str::random(12);

        $result = DB::transaction(function () use (
            $validated,
            $temporaryPassword
        ) {
            $organizationUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $temporaryPassword,
                'role' => 'organization',
                'status' => 'active',
            ]);

            $organization = Organization::create([
                'user_id' => $organizationUser->id,
                'name' => $validated['name'],

                'organization_type' =>
                $validated['organization_type'] ?? null,

                'registration_number' =>
                $validated['registration_number'] ?? null,

                'phone' =>
                $validated['phone'] ?? null,

                'website' =>
                $validated['website'] ?? null,

                'address' =>
                $validated['address'] ?? null,

                'verification_status' => 'pending',
            ]);

            return [
                'user' => $organizationUser,
                'organization' => $organization,
            ];
        });

        return response()->json([
            'message' => 'Organization added successfully.',

            'organization' => $result['organization']
                ->fresh()
                ->load('user'),

            'temporary_password' => $temporaryPassword,
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Organizations - List
    |--------------------------------------------------------------------------
    */

    public function organizations(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $organizations = Organization::with('user')
            ->latest()
            ->get();

        return response()->json([
            'organizations' => $organizations,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Organizations - View
    |--------------------------------------------------------------------------
    */

    public function showOrganization(Request $request, int $id)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $organization = Organization::with('user')->find($id);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found.',
            ], 404);
        }

        return response()->json([
            'organization' => $organization,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Organizations - Edit
    |--------------------------------------------------------------------------
    */

    public function updateOrganization(Request $request, int $id)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $organization = Organization::find($id);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'organization_type' => [
                'nullable',
                'string',
                'max:255',
            ],

            'registration_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],

            'website' => [
                'nullable',
                'string',
                'max:255',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'mission' => [
                'nullable',
                'string',
            ],

            'focus_areas' => [
                'nullable',
            ],

            'communities_served' => [
                'nullable',
            ],

            'team_size' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'primary_activities' => [
                'nullable',
            ],
        ]);

        $organization->update($validated);

        if ($organization->user) {
            $organization->user->update([
                'name' => $organization->name,
            ]);
        }

        return response()->json([
            'message' => 'Organization updated successfully.',

            'organization' => $organization
                ->fresh()
                ->load('user'),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Organizations - Verification
    |--------------------------------------------------------------------------
    */

    public function updateOrganizationVerification(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $organization = Organization::find($id);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found.',
            ], 404);
        }

        $validated = $request->validate([
            'verification_status' => [
                'required',
                'in:pending,verified,rejected',
            ],
        ]);

        DB::transaction(function () use ($organization, $validated) {
            $verificationStatus = $validated['verification_status'];

            // Update organization verification status.
            $organization->update([
                'verification_status' => $verificationStatus,
            ]);

            // Update the linked organization owner's account status.
            $accountStatus = $verificationStatus === 'rejected'
                ? 'inactive'
                : 'active';

            User::where('id', $organization->user_id)->update([
                'status' => $accountStatus,
            ]);
        });

        $organization = $organization
            ->fresh()
            ->load('user');

        return response()->json([
            'message' => 'Organization verification status updated successfully.',
            'organization' => $organization,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Organizations - Delete
    |--------------------------------------------------------------------------
    */

    public function destroyOrganization(Request $request, int $id)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $organization = Organization::with('user')->find($id);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found.',
            ], 404);
        }

        $organizationUser = $organization->user;

        DB::transaction(function () use (
            $organization,
            $organizationUser
        ) {
            $organization->delete();

            if ($organizationUser) {
                $organizationUser->delete();
            }
        });

        return response()->json([
            'message' =>
            'Organization and its user account deleted successfully.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Help Requests - List
    |--------------------------------------------------------------------------
    */

    public function helpRequests(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $helpRequests = HelpRequest::with([
            'user',
            'assignments.organization',
            'assignments.volunteer',
            'assignments.assignedBy',
        ])
            ->latest()
            ->get();

        return response()->json([
            'helpRequests' => $helpRequests,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Help Requests - Verify / Reject
    |--------------------------------------------------------------------------
    |
    | FINAL HELP REQUEST LIFECYCLE
    |
    | pending -> verified
    | pending -> rejected
    |
    | Assignment DOES NOT change this status.
    |
    */

    public function updateHelpRequestVerification(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->status !== HelpRequest::STATUS_PENDING) {
            return response()->json([
                'message' =>
                'Only pending help requests can be reviewed.',
            ], 422);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:verified,rejected',
            ],

            'verification_note' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $helpRequest->update([
            'status' => $validated['status'],

            'verification_note' =>
            $validated['verification_note'] ?? null,
        ]);

        return response()->json([
            'message' =>
            $validated['status'] === HelpRequest::STATUS_VERIFIED
                ? 'Help request verified successfully.'
                : 'Help request rejected successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Help Requests - Set Priority
    |--------------------------------------------------------------------------
    */

    public function updateHelpRequestUrgency(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->status !== HelpRequest::STATUS_VERIFIED) {
            return response()->json([
                'message' =>
                'Only verified help requests can have their priority set.',
            ], 422);
        }

        $validated = $request->validate([
            'urgency' => [
                'required',
                'in:low,normal,high,critical',
            ],
        ]);

        $helpRequest->update([
            'urgency' => $validated['urgency'],
        ]);

        return response()->json([
            'message' =>
            'Help request priority updated successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Help Requests - Assign Organization / Volunteer
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | HelpRequest.status and HelpRequestAssignment.status
    | are completely separate.
    |
    | HelpRequest:
    |
    | pending -> verified -> completed
    | pending -> rejected
    |
    | Assignment:
    |
    | assigned -> accepted -> in_progress -> completed
    | assigned -> rejected
    |
    | The Help Request is NEVER changed to "assigned".
    |
    */

    public function assignHelpRequest(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
    |--------------------------------------------------------------------------
    | Only Verified Help Requests Can Be Assigned
    |--------------------------------------------------------------------------
    */

        if ($helpRequest->status !== HelpRequest::STATUS_VERIFIED) {
            return response()->json([
                'message' =>
                'Only verified help requests can be assigned.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Validate Request
    |--------------------------------------------------------------------------
    */

        $validated = $request->validate([
            'organization_id' => [
                'nullable',
                'integer',
                'exists:organizations,id',
            ],

            'volunteer_ids' => [
                'nullable',
                'array',
            ],

            'volunteer_ids.*' => [
                'integer',
                'distinct',
                'exists:users,id',
            ],

            'assignment_note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $organizationId = $validated['organization_id'] ?? null;

        $volunteerIds = $validated['volunteer_ids'] ?? [];

        /*
    |--------------------------------------------------------------------------
    | At Least One Assignment Target Required
    |--------------------------------------------------------------------------
    */

        if (!$organizationId && empty($volunteerIds)) {
            return response()->json([
                'message' =>
                'Select an organization or at least one volunteer.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Validate Organization
    |--------------------------------------------------------------------------
    */

        if ($organizationId) {

            $organization = Organization::find($organizationId);

            if (
                !$organization ||
                $organization->verification_status !== 'verified'
            ) {
                return response()->json([
                    'message' =>
                    'The selected organization is not verified.',
                ], 422);
            }

            /*
        |--------------------------------------------------------------------------
        | Prevent Invalid Organization Reassignment
        |--------------------------------------------------------------------------
        |
        | Once an organization rejects a help request, that same
        | organization must never receive the same help request again.
        |
        | The rejected assignment remains in the database as history.
        |
        */

            $organizationPreviouslyRejected =
                HelpRequestAssignment::where(
                    'help_request_id',
                    $helpRequest->id
                )
                ->where(
                    'organization_id',
                    $organizationId
                )
                ->where(
                    'status',
                    HelpRequestAssignment::STATUS_REJECTED
                )
                ->exists();

            if ($organizationPreviouslyRejected) {
                return response()->json([
                    'message' =>
                    'This organization has already rejected this help request and cannot be assigned to it again.',
                ], 422);
            }

            /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Active Assignment
        |--------------------------------------------------------------------------
        |
        | pending is included here so Admin cannot send another
        | assignment while the existing assignment is waiting
        | for organization response.
        |
        */

            $organizationAlreadyAssigned =
                HelpRequestAssignment::where(
                    'help_request_id',
                    $helpRequest->id
                )
                ->where(
                    'organization_id',
                    $organizationId
                )
                ->whereIn('status', [
                    HelpRequestAssignment::STATUS_PENDING,
                    HelpRequestAssignment::STATUS_ASSIGNED,
                    HelpRequestAssignment::STATUS_ACCEPTED,
                    HelpRequestAssignment::STATUS_IN_PROGRESS,
                    HelpRequestAssignment::STATUS_COMPLETED,
                ])
                ->exists();

            if ($organizationAlreadyAssigned) {
                return response()->json([
                    'message' =>
                    'This organization already has an active assignment for this help request.',
                ], 422);
            }
        }

        /*
    |--------------------------------------------------------------------------
    | Validate Volunteers
    |--------------------------------------------------------------------------
    */

        foreach ($volunteerIds as $volunteerId) {

            /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | volunteer_id in help_request_assignments references
        | users.id, NOT volunteers.id.
        |
        */

            $volunteerUser = User::find($volunteerId);

            if (!$volunteerUser) {
                return response()->json([
                    'message' =>
                    "Volunteer user #{$volunteerId} not found.",
                ], 422);
            }

            if ($volunteerUser->role !== 'individual') {
                return response()->json([
                    'message' =>
                    "User #{$volunteerId} is not an individual user.",
                ], 422);
            }

            if ($volunteerUser->status !== 'active') {
                return response()->json([
                    'message' =>
                    "Volunteer {$volunteerUser->name} is not active.",
                ], 422);
            }

            /*
        |--------------------------------------------------------------------------
        | Approved SP Volunteer Profile
        |--------------------------------------------------------------------------
        */

            $volunteer = Volunteer::where(
                'user_id',
                $volunteerId
            )
                ->where('status', 'approved')
                ->first();

            if (!$volunteer) {
                return response()->json([
                    'message' =>
                    "{$volunteerUser->name} is not an approved SP volunteer.",
                ], 422);
            }

            /*
        |--------------------------------------------------------------------------
        | Volunteer Availability
        |--------------------------------------------------------------------------
        */

            if ($volunteer->availability !== 'available') {
                return response()->json([
                    'message' =>
                    "{$volunteerUser->name} is currently unavailable.",
                ], 422);
            }

            /*
        |--------------------------------------------------------------------------
        | Existing Active Assignment
        |--------------------------------------------------------------------------
        */

            $hasActiveAssignment =
                HelpRequestAssignment::where(
                    'volunteer_id',
                    $volunteerId
                )
                ->whereIn('status', [
                    HelpRequestAssignment::STATUS_ASSIGNED,
                    HelpRequestAssignment::STATUS_ACCEPTED,
                    HelpRequestAssignment::STATUS_IN_PROGRESS,
                ])
                ->exists();

            if ($hasActiveAssignment) {
                return response()->json([
                    'message' =>
                    "{$volunteerUser->name} is currently unavailable.",
                ], 422);
            }

            /*
        |--------------------------------------------------------------------------
        | Duplicate Assignment For This Help Request
        |--------------------------------------------------------------------------
        |
        | Rejected assignments can be recreated.
        |
        */

            $alreadyAssigned =
                HelpRequestAssignment::where(
                    'help_request_id',
                    $helpRequest->id
                )
                ->where(
                    'volunteer_id',
                    $volunteerId
                )
                ->whereIn('status', [
                    HelpRequestAssignment::STATUS_ASSIGNED,
                    HelpRequestAssignment::STATUS_ACCEPTED,
                    HelpRequestAssignment::STATUS_IN_PROGRESS,
                    HelpRequestAssignment::STATUS_COMPLETED,
                ])
                ->exists();

            if ($alreadyAssigned) {
                return response()->json([
                    'message' =>
                    "{$volunteerUser->name} is already assigned to this help request.",
                ], 422);
            }
        }

        /*
    |--------------------------------------------------------------------------
    | Create Assignments
    |--------------------------------------------------------------------------
    */

        $assignments = DB::transaction(function () use (
            $helpRequest,
            $organizationId,
            $volunteerIds,
            $validated,
            $user
        ) {

            $createdAssignments = collect();

            /*
        |--------------------------------------------------------------------------
        | Organization Assignment
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Organization assignments start as PENDING.
        |
        | The organization must accept the assignment before it becomes
        | an accepted/active assignment.
        |
        */

            if ($organizationId) {

                $createdAssignments->push(
                    HelpRequestAssignment::create([
                        'help_request_id' => $helpRequest->id,

                        'organization_id' => $organizationId,

                        'volunteer_id' => null,

                        'assigned_by' => $user->id,

                        'status' =>
                        HelpRequestAssignment::STATUS_PENDING,

                        'assignment_note' =>
                        $validated['assignment_note'] ?? null,

                        'assigned_at' => now(),
                    ])
                );
            }

            /*
        |--------------------------------------------------------------------------
        | Volunteer Assignments
        |--------------------------------------------------------------------------
        |
        | Volunteer workflow remains unchanged.
        |
        */

            foreach ($volunteerIds as $volunteerId) {

                $createdAssignments->push(
                    HelpRequestAssignment::create([
                        'help_request_id' => $helpRequest->id,

                        'organization_id' => null,

                        /*
                    |--------------------------------------------------------------------------
                    | IMPORTANT:
                    |--------------------------------------------------------------------------
                    |
                    | This is users.id.
                    |
                    */

                        'volunteer_id' => $volunteerId,

                        'assigned_by' => $user->id,

                        'status' =>
                        HelpRequestAssignment::STATUS_ASSIGNED,

                        'assignment_note' =>
                        $validated['assignment_note'] ?? null,

                        'assigned_at' => now(),
                    ])
                );

                /*
            |--------------------------------------------------------------------------
            | Volunteer becomes unavailable while assignment is active.
            |--------------------------------------------------------------------------
            */

                Volunteer::where(
                    'user_id',
                    $volunteerId
                )->update([
                    'availability' => 'unavailable',
                ]);
            }

            /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        |--------------------------------------------------------------------------
        |
        | Do NOT update HelpRequest.status here.
        |
        | It remains "verified".
        |
        */

            return $createdAssignments;
        });

        /*
    |--------------------------------------------------------------------------
    | Load Relationships
    |--------------------------------------------------------------------------
    */

        $assignments = $assignments->map(function ($assignment) {

            return $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'organization',
                    'volunteer',
                    'assignedBy',
                ]);
        });

        return response()->json([
            'message' =>
            'Help request assignment created successfully.',

            'assignments' => $assignments,

        ], 201);
    }

/*
|--------------------------------------------------------------------------
| Help Requests - Withdrawal Requests
|--------------------------------------------------------------------------
*/

    /**
     * Get all pending organization withdrawal requests.
     *
     * Admin uses this to see organizations that have requested
     * to withdraw from their current help request.
     */
    public function withdrawalRequests(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $assignments = HelpRequestAssignment::with([
            'helpRequest.user',
            'organization.user',
            'assignedBy',
        ])
            ->where(
                'withdrawal_status',
                HelpRequestAssignment::WITHDRAWAL_PENDING
            )
            ->whereNotNull('organization_id')
            ->latest('withdrawal_requested_at')
            ->get();

        return response()->json([
            'withdrawalRequests' => $assignments,
        ]);
    }


    /**
     * Approve or reject an organization's withdrawal request.
     *
     * APPROVE:
     *
     * assignment.status
     *     accepted/in_progress
     *          ↓
     *     withdrawn
     *
     * assignment.withdrawal_status
     *     pending
     *          ↓
     *     approved
     *
     *
     * REJECT:
     *
     * assignment.status
     *     remains accepted/in_progress
     *
     * assignment.withdrawal_status
     *     pending
     *          ↓
     *     rejected
     *
     * The organization remains assigned when the withdrawal
     * request is rejected.
     */
    public function reviewWithdrawal(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $assignment = HelpRequestAssignment::with([
            'helpRequest.user',
            'organization.user',
            'assignedBy',
        ])->find($id);

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if (!$assignment->organization_id) {
            return response()->json([
                'message' =>
                'This assignment does not belong to an organization.',
            ], 422);
        }

        if (
            $assignment->withdrawal_status !==
            HelpRequestAssignment::WITHDRAWAL_PENDING
        ) {
            return response()->json([
                'message' =>
                'This assignment does not have a pending withdrawal request.',
            ], 422);
        }

        $validated = $request->validate([
            'decision' => [
                'required',
                'in:approved,rejected',
            ],
        ]);

        $decision = $validated['decision'];

        if ($decision === HelpRequestAssignment::WITHDRAWAL_APPROVED) {
            /*
        |--------------------------------------------------------------------------
        | Approve Withdrawal
        |--------------------------------------------------------------------------
        |
        | Preserve the assignment as history.
        |
        | Do NOT delete it.
        |
        */

            $assignment->update([
                'status' =>
                HelpRequestAssignment::STATUS_WITHDRAWN,

                'withdrawal_status' =>
                HelpRequestAssignment::WITHDRAWAL_APPROVED,

                'withdrawal_reviewed_at' => now(),

                'withdrawal_reviewed_by' => $user->id,
            ]);

            return response()->json([
                'message' =>
                'Organization withdrawal approved successfully.',

                'assignment' => $assignment
                    ->fresh()
                    ->load([
                        'helpRequest.user',
                        'organization.user',
                        'assignedBy',
                        'withdrawalReviewedBy',
                    ]),
            ]);
        }

        /*
    |--------------------------------------------------------------------------
    | Reject Withdrawal
    |--------------------------------------------------------------------------
    |
    | Keep the assignment active.
    |
    */

        $assignment->update([
            'withdrawal_status' =>
            HelpRequestAssignment::WITHDRAWAL_REJECTED,

            'withdrawal_reviewed_at' => now(),

            'withdrawal_reviewed_by' => $user->id,
        ]);

        return response()->json([
            'message' =>
            'Organization withdrawal rejected successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest.user',
                    'organization.user',
                    'assignedBy',
                    'withdrawalReviewedBy',
                ]),
        ]);
    }


    /**
     * Reassign a help request to another organization after
     * the previous organization's withdrawal has been approved.
     *
     * IMPORTANT:
     *
     * The old assignment is NEVER deleted.
     *
     * Example:
     *
     * Assignment #10
     * Organization A
     * status = withdrawn
     *
     * Assignment #11
     * Organization B
     * status = pending
     */
    public function reassignHelpRequest(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->status !== HelpRequest::STATUS_VERIFIED) {
            return response()->json([
                'message' =>
                'Only verified help requests can be reassigned.',
            ], 422);
        }

        $validated = $request->validate([
            'organization_id' => [
                'required',
                'integer',
                'exists:organizations,id',
            ],

            'assignment_note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $organizationId = $validated['organization_id'];

        /*
    |--------------------------------------------------------------------------
    | Validate Selected Organization
    |--------------------------------------------------------------------------
    */

        $organization = Organization::find($organizationId);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found.',
            ], 404);
        }

        if ($organization->verification_status !== 'verified') {
            return response()->json([
                'message' =>
                'The selected organization is not verified.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Find Current Assignment
    |--------------------------------------------------------------------------
    |
    | There must be an organization whose withdrawal was approved.
    |
    */

        $withdrawnAssignment = HelpRequestAssignment::where(
            'help_request_id',
            $helpRequest->id
        )
            ->whereNotNull('organization_id')
            ->where(
                'status',
                HelpRequestAssignment::STATUS_WITHDRAWN
            )
            ->where(
                'withdrawal_status',
                HelpRequestAssignment::WITHDRAWAL_APPROVED
            )
            ->latest('withdrawal_reviewed_at')
            ->first();

        if (!$withdrawnAssignment) {
            return response()->json([
                'message' =>
                'No approved organization withdrawal was found for this help request.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Prevent Reassigning To The Same Organization
    |--------------------------------------------------------------------------
    |
    | This is the important backend protection.
    |
    | The organization that previously handled this help request
    | cannot be selected again.
    |
    */

        $organizationPreviouslyUsed =
            HelpRequestAssignment::where(
                'help_request_id',
                $helpRequest->id
            )
            ->where(
                'organization_id',
                $organizationId
            )
            ->exists();

        if ($organizationPreviouslyUsed) {
            return response()->json([
                'message' =>
                'This organization has already been assigned to this help request and cannot be selected again.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Prevent Another Pending Organization Assignment
    |--------------------------------------------------------------------------
    */

        $pendingAssignmentExists =
            HelpRequestAssignment::where(
                'help_request_id',
                $helpRequest->id
            )
            ->where(
                'status',
                HelpRequestAssignment::STATUS_PENDING
            )
            ->whereNotNull('organization_id')
            ->exists();

        if ($pendingAssignmentExists) {
            return response()->json([
                'message' =>
                'This help request already has a pending organization assignment.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Create New Assignment
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | The new organization starts as PENDING.
    |
    | Admin has assigned the request to the organization,
    | but the organization has not accepted it yet.
    |
    */

        $newAssignment = DB::transaction(function () use (
            $helpRequest,
            $organizationId,
            $validated,
            $user
        ) {
            return HelpRequestAssignment::create([
                'help_request_id' => $helpRequest->id,

                'organization_id' => $organizationId,

                'volunteer_id' => null,

                'assigned_by' => $user->id,

                'status' =>
                HelpRequestAssignment::STATUS_PENDING,

                'assignment_note' =>
                $validated['assignment_note'] ?? null,

                'assigned_at' => now(),

                'withdrawal_status' => null,

                'withdrawal_reason' => null,

                'withdrawal_requested_at' => null,

                'withdrawal_reviewed_at' => null,

                'withdrawal_reviewed_by' => null,
            ]);
        });

        /*
    |--------------------------------------------------------------------------
    | Return New Assignment
    |--------------------------------------------------------------------------
    */

        return response()->json([
            'message' =>
            'Help request reassigned successfully.',

            'assignment' => $newAssignment
                ->fresh()
                ->load([
                    'helpRequest.user',
                    'organization.user',
                    'assignedBy',
                ]),
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Help Requests - Complete
    |--------------------------------------------------------------------------
    |
    | Help Request completion is separate from Assignment completion.
    |
    | verified -> completed
    |
    | This method DOES NOT:
    |
    | - change assignment statuses
    | - automatically complete assignments
    | - automatically release volunteers
    |
    | Those belong to the Assignment workflow.
    |
    */

    public function completeHelpRequest(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Only Verified Help Requests Can Be Completed
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->status !== HelpRequest::STATUS_VERIFIED) {
            return response()->json([
                'message' =>
                'Only verified help requests can be completed.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Mark Help Request Completed
        |--------------------------------------------------------------------------
        |
        | No completion_note is used because the current
        | HelpRequest model/migration does not contain such a field.
        |
        */

        $helpRequest->update([
            'status' => HelpRequest::STATUS_COMPLETED,
        ]);

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | Do NOT release volunteers here.
        |
        | Assignment completion is independent.
        |
        | Example:
        |
        | HelpRequest = completed
        | Assignment = in_progress
        |
        | The assignment must later be completed through its own
        | assignment workflow before the volunteer becomes available.
        |
        */

        return response()->json([
            'message' =>
            'Help request completed successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                ]),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Donations
    |--------------------------------------------------------------------------
    */

    public function donations(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $donations = Donation::with([
            'user:id,name,email',
            'campaign:id,title',
        ])
            ->latest()
            ->get();

        return response()->json([
            'donations' => $donations,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Volunteers
    |--------------------------------------------------------------------------
    */

    public function volunteers(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $volunteers = Volunteer::with([
            'user:id,name,email',
            'organization:id,name',
        ])
            ->latest()
            ->get();

        return response()->json([
            'volunteers' => $volunteers,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Campaigns - List
    |--------------------------------------------------------------------------
    */

    public function campaigns(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $campaigns = Campaign::with([
            'organization:id,user_id,name,organization_type,registration_number,phone,website,address,mission',
            'organization.user:id,name,email',
            'creator:id,name,email',
            'verifier:id,name,email',
            'helpRequest:id,user_id,title,description,category,urgency,status,district,address,created_at',
            'helpRequest.user:id,name,email',
        ])
            ->latest()
            ->get();

        return response()->json([
            'campaigns' => $campaigns,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Campaigns - Verify / Reject
    |--------------------------------------------------------------------------
    */

    public function updateCampaignVerification(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $campaign = Campaign::find($id);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:active,rejected',
            ],

            'verification_note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        try {
            $campaignService = app(
                \App\Services\Campaign\CampaignService::class
            );

            if ($validated['status'] === Campaign::STATUS_ACTIVE) {
                $campaign = $campaignService->verifyCampaign(
                    $campaign,
                    $user->id,
                    $validated['verification_note'] ?? null
                );

                return response()->json([
                    'message' =>
                    'Campaign verified successfully.',

                    'campaign' => $campaign
                        ->fresh()
                        ->load([
                            'organization:id,name',
                            'creator:id,name,email',
                            'verifier:id,name,email',
                            'helpRequest:id,title,status',
                        ]),
                ]);
            }

            $campaign = $campaignService->rejectCampaign(
                $campaign,
                $user->id,
                $validated['verification_note'] ?? null
            );

            return response()->json([
                'message' =>
                'Campaign rejected successfully.',

                'campaign' => $campaign
                    ->fresh()
                    ->load([
                        'organization:id,name',
                        'creator:id,name,email',
                        'verifier:id,name,email',
                        'helpRequest:id,title,status',
                    ]),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' =>
                'Campaign verification failed.',

                'errors' => $e->errors(),
            ], 422);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Campaigns - Update Status
    |--------------------------------------------------------------------------
    */

    public function updateCampaignStatus(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $campaign = Campaign::find($id);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:completed,cancelled',
            ],
        ]);

        try {
            $campaignService = app(
                \App\Services\Campaign\CampaignService::class
            );

            $campaign = $campaignService->updateStatus(
                $campaign,
                $validated['status']
            );

            return response()->json([
                'message' =>
                'Campaign status updated successfully.',

                'campaign' => $campaign
                    ->fresh()
                    ->load([
                        'organization:id,name',
                        'creator:id,name,email',
                        'verifier:id,name,email',
                        'helpRequest:id,title,status',
                    ]),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' =>
                'Campaign status update failed.',

                'errors' => $e->errors(),
            ], 422);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Campaigns - Assign Volunteer
    |--------------------------------------------------------------------------
    */

    public function assignCampaignVolunteer(
        Request $request,
        int $id
    ) {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $validated = $request->validate([
            'volunteer_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],

            'assignment_note' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $campaign = Campaign::find($id);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found.',
            ], 404);
        }

        if ($campaign->status !== Campaign::STATUS_ACTIVE) {
            return response()->json([
                'message' =>
                'Only active campaigns can have volunteers assigned.',
            ], 422);
        }

        $volunteerUser = User::find(
            $validated['volunteer_id']
        );

        if (!$volunteerUser) {
            return response()->json([
                'message' => 'Volunteer user not found.',
            ], 422);
        }

        if ($volunteerUser->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can be assigned as volunteers.',
            ], 422);
        }

        if ($volunteerUser->status !== 'active') {
            return response()->json([
                'message' =>
                "Volunteer {$volunteerUser->name} is not active.",
            ], 422);
        }

        $volunteer = Volunteer::where(
            'user_id',
            $volunteerUser->id
        )
            ->where('status', 'approved')
            ->first();

        if (!$volunteer) {
            return response()->json([
                'message' =>
                "{$volunteerUser->name} is not an approved SP volunteer.",
            ], 422);
        }

        if ($volunteer->availability !== 'available') {
            return response()->json([
                'message' =>
                "{$volunteerUser->name} is currently unavailable.",
            ], 422);
        }

        $hasActiveAssignment =
            CampaignVolunteerAssignment::where(
                'volunteer_id',
                $volunteerUser->id
            )
            ->whereIn('status', [
                'assigned',
                'accepted',
                'in_progress',
            ])
            ->exists();

        if ($hasActiveAssignment) {
            return response()->json([
                'message' =>
                "{$volunteerUser->name} is currently unavailable.",
            ], 422);
        }

        $duplicateAssignment =
            CampaignVolunteerAssignment::where(
                'campaign_id',
                $campaign->id
            )
            ->where(
                'volunteer_id',
                $volunteerUser->id
            )
            ->whereIn('status', [
                'assigned',
                'accepted',
                'in_progress',
            ])
            ->exists();

        if ($duplicateAssignment) {
            return response()->json([
                'message' =>
                "{$volunteerUser->name} already has an active assignment for this campaign.",
            ], 422);
        }

        $assignment = DB::transaction(function () use (
            $campaign,
            $volunteerUser,
            $validated,
            $user
        ) {
            $assignment = CampaignVolunteerAssignment::create([
                'campaign_id' => $campaign->id,

                'volunteer_id' => $volunteerUser->id,

                'assigned_by' => $user->id,

                'status' => 'assigned',

                'assignment_note' =>
                $validated['assignment_note'] ?? null,

                'assigned_at' => now(),
            ]);

            Volunteer::where(
                'user_id',
                $volunteerUser->id
            )->update([
                'availability' => 'unavailable',
            ]);

            return $assignment;
        });

        return response()->json([
            'message' =>
            'Volunteer assigned to campaign successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'campaign:id,title',
                    'volunteer:id,name,email',
                    'assignedBy:id,name,email',
                ]),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */

    public function reports(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        return response()->json([
            'stats' => [
                'totalUsers' => User::count(),

                'totalOrganizations' => Organization::count(),

                'pendingVerification' => Organization::where(
                    'verification_status',
                    'pending'
                )->count(),

                'totalHelpRequests' => HelpRequest::count(),

                'pendingHelpRequests' => HelpRequest::where(
                    'status',
                    HelpRequest::STATUS_PENDING
                )->count(),

                'activeCampaigns' => Campaign::where(
                    'status',
                    Campaign::STATUS_ACTIVE
                )->count(),

                'totalDonations' => Donation::where(
                    'status',
                    'completed'
                )->sum('amount'),

                'totalVolunteers' => Volunteer::count(),

                'reportsGenerated' => 0,
            ],
        ]);
    }
}
