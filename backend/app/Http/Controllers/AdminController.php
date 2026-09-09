<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;

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

                'totalDonations' => Donation::sum('amount'),

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
                'phone',
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

        /*
    |--------------------------------------------------------------------------
    | Phone number permission
    |--------------------------------------------------------------------------
    |
    | Admin can update only their own phone number.
    | Admin can view another user's phone number, but cannot modify it.
    |
    */

        if (
            $targetUser->id !== $user->id &&
            $request->exists('phone')
        ) {
            return response()->json([
                'message' => 'You cannot change another user\'s phone number.',
            ], 403);
        }

        /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

        $validationRules = [
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
        ];

        /*
    |--------------------------------------------------------------------------
    | Phone validation
    |--------------------------------------------------------------------------
    |
    | Only the logged-in admin can update their own phone.
    |
    | Rules:
    | - Optional during an update
    | - Bangladesh number
    | - Exactly 11 digits
    | - Must start with 01
    | - Must be unique across users
    |
    */

        if ($targetUser->id === $user->id) {
            $validationRules['phone'] = [
                'sometimes',
                'nullable',
                'regex:/^01[0-9]{9}$/',
                Rule::unique('users', 'phone')->ignore($targetUser->id),
            ];
        }

        $validated = $request->validate($validationRules);

        /*
    |--------------------------------------------------------------------------
    | Role cannot be changed
    |--------------------------------------------------------------------------
    */

        if ($validated['role'] !== $targetUser->role) {
            return response()->json([
                'message' =>
                'User role cannot be changed after account creation.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Admin cannot remove their own admin role
    |--------------------------------------------------------------------------
    */

        if (
            $targetUser->id === $user->id &&
            $validated['role'] !== 'admin'
        ) {
            return response()->json([
                'message' => 'You cannot change your own admin role.',
            ], 422);
        }

        /*
    |--------------------------------------------------------------------------
    | Update basic user information
    |--------------------------------------------------------------------------
    */

        $targetUser->name = $validated['name'];
        $targetUser->email = $validated['email'];
        $targetUser->status = $validated['status'];

        /*
    |--------------------------------------------------------------------------
    | Update phone only when editing own account
    |--------------------------------------------------------------------------
    */

        if (
            $targetUser->id === $user->id &&
            array_key_exists('phone', $validated)
        ) {
            $targetUser->phone = $validated['phone'];
        }

        /*
    |--------------------------------------------------------------------------
    | Update password when provided
    |--------------------------------------------------------------------------
    */

        if (!empty($validated['password'])) {
            $targetUser->password = $validated['password'];
        }

        $targetUser->save();

        /*
    |--------------------------------------------------------------------------
    | Keep organization name synchronized
    |--------------------------------------------------------------------------
    */

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

            $organization->update([
                'verification_status' => $verificationStatus,
            ]);

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
            'message' =>
            'Organization verification status updated successfully.',

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
    | Assignment does not change this status.
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
    | Help Requests - Assign Organization
    |--------------------------------------------------------------------------
    |
    | Volunteers are NEVER assigned directly to Help Requests.
    |
    | Help Request assignment is exclusively for organizations.
    |
    | HelpRequest lifecycle:
    |
    | pending -> verified -> in_progress -> completed
    | pending -> rejected
    |
    | Organization assignment:
    |
    | pending -> accepted
    | pending -> rejected
    | accepted -> withdrawn
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

        if ($helpRequest->status !== HelpRequest::STATUS_VERIFIED) {
            return response()->json([
                'message' =>
                'Only verified help requests can be assigned.',
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
                HelpRequestAssignment::STATUS_ACCEPTED,
            ])
            ->exists();

        if ($organizationAlreadyAssigned) {
            return response()->json([
                'message' =>
                'This organization already has an active assignment for this help request.',
            ], 422);
        }

        $assignment = DB::transaction(function () use (
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
                'status' => HelpRequestAssignment::STATUS_PENDING,
                'assignment_note' =>
                $validated['assignment_note'] ?? null,
                'assigned_at' => now(),
            ]);
        });

        return response()->json([
            'message' =>
            'Help request organization assignment created successfully.',

            'assignment' => $assignment
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
    | Help Requests - Withdrawal Requests
    |--------------------------------------------------------------------------
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

    /*
    |--------------------------------------------------------------------------
    | Help Requests - Review Withdrawal
    |--------------------------------------------------------------------------
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

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' =>
                'Only accepted organization assignments can be withdrawn.',
            ], 422);
        }

        $validated = $request->validate([
            'decision' => [
                'required',
                'in:approved,rejected',
            ],
        ]);

        $decision = $validated['decision'];

        if (
            $decision ===
            HelpRequestAssignment::WITHDRAWAL_APPROVED
        ) {
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

    /*
    |--------------------------------------------------------------------------
    | Help Requests - Reassign Organization
    |--------------------------------------------------------------------------
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
                'status' => HelpRequestAssignment::STATUS_PENDING,
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

        if ($helpRequest->status !== HelpRequest::STATUS_IN_PROGRESS) {
            return response()->json([
                'message' =>
                'Only in-progress help requests can be completed.',
            ], 422);
        }

        $helpRequest->update([
            'status' => HelpRequest::STATUS_COMPLETED,
        ]);

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
                $campaign = DB::transaction(function () use (
                    $campaignService,
                    $campaign,
                    $user,
                    $validated
                ) {
                    $campaign = $campaignService->verifyCampaign(
                        $campaign,
                        $user->id,
                        $validated['verification_note'] ?? null
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Local Case -> Start Linked Help Request
                    |--------------------------------------------------------------------------
                    |
                    | A local-case campaign becomes active only for a
                    | verified help request. Once the campaign is activated,
                    | the linked help request moves to in_progress.
                    |
                    */

                    if (
                        $campaign->type === Campaign::TYPE_LOCAL_CASE &&
                        $campaign->help_request_id
                    ) {
                        $helpRequest = HelpRequest::find(
                            $campaign->help_request_id
                        );

                        if (!$helpRequest) {
                            throw ValidationException::withMessages([
                                'help_request_id' =>
                                'The help request linked to this local case campaign was not found.',
                            ]);
                        }

                        if (
                            $helpRequest->status !==
                            HelpRequest::STATUS_VERIFIED
                        ) {
                            throw ValidationException::withMessages([
                                'help_request_id' =>
                                'A local case campaign can only be activated for a verified help request.',
                            ]);
                        }

                        $helpRequest->update([
                            'status' =>
                            HelpRequest::STATUS_IN_PROGRESS,
                        ]);
                    }

                    return $campaign;
                });

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
    |
    | ONLY ADMIN can assign volunteers to campaigns.
    |
    | Volunteers are NEVER assigned directly to Help Requests.
    |
    | Campaign assignment lifecycle:
    |
    | assigned
    |     -> accepted
    |     -> in_progress
    |     -> completed
    |
    | assigned
    |     -> rejected
    |
    | accepted / in_progress
    |     -> withdrawal_requested
    |     -> withdrawn
    |     OR
    |     -> in_progress after admin rejects withdrawal
    |
    | The volunteer is occupied from the moment the assignment
    | is created, including the assigned and withdrawal_requested
    | states.
    |
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

        /*
        |--------------------------------------------------------------------------
        | Only Active Campaigns
        |--------------------------------------------------------------------------
        */

        if ($campaign->status !== Campaign::STATUS_ACTIVE) {
            return response()->json([
                'message' =>
                'Only active campaigns can have volunteers assigned.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Volunteer User
        |--------------------------------------------------------------------------
        */

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
                "Volunteer {$volunteerUser->name} is not an active user.",
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Volunteer Profile
        |--------------------------------------------------------------------------
        */

        $volunteer = Volunteer::where(
            'user_id',
            $volunteerUser->id
        )
            ->where(
                'status',
                Volunteer::STATUS_ACTIVE
            )
            ->first();

        if (!$volunteer) {
            return response()->json([
                'message' =>
                "{$volunteerUser->name} is not an active SP volunteer.",
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Sync Availability Before Checking
        |--------------------------------------------------------------------------
        |
        | Availability is derived from the actual campaign assignments.
        | This prevents stale availability values from allowing an
        | already-occupied volunteer to be assigned again.
        |
        */

        $hasActiveAssignment =
            CampaignVolunteerAssignment::where(
                'volunteer_id',
                $volunteerUser->id
            )
            ->whereIn(
                'status',
                CampaignVolunteerAssignment::activeStatuses()
            )
            ->exists();

        if ($hasActiveAssignment) {
            $volunteer->update([
                'availability' => 'unavailable',
            ]);

            return response()->json([
                'message' =>
                "{$volunteerUser->name} is currently assigned to another campaign.",
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Volunteer Must Be Available
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
        | Prevent Duplicate Historical/Active Assignment
        |--------------------------------------------------------------------------
        |
        | Rejected/completed/withdrawn assignments are historical records
        | and do not occupy the volunteer.
        |
        */

        $duplicateActiveAssignment =
            CampaignVolunteerAssignment::where(
                'campaign_id',
                $campaign->id
            )
            ->where(
                'volunteer_id',
                $volunteerUser->id
            )
            ->whereIn(
                'status',
                CampaignVolunteerAssignment::activeStatuses()
            )
            ->exists();

        if ($duplicateActiveAssignment) {
            return response()->json([
                'message' =>
                "{$volunteerUser->name} already has an active assignment for this campaign.",
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Create Campaign Assignment
        |--------------------------------------------------------------------------
        */

        try {
            $assignment = DB::transaction(function () use (
                $campaign,
                $volunteerUser,
                $validated,
                $user
            ) {
                $assignment = CampaignVolunteerAssignment::create([
                    'campaign_id' => $campaign->id,

                    /*
                    |--------------------------------------------------------------------------
                    | IMPORTANT
                    |--------------------------------------------------------------------------
                    |
                    | campaign_volunteer_assignments.volunteer_id points
                    | to users.id, not volunteers.id.
                    |
                    */

                    'volunteer_id' => $volunteerUser->id,

                    'assigned_by' => $user->id,

                    'status' =>
                    CampaignVolunteerAssignment::STATUS_ASSIGNED,

                    'assignment_note' =>
                    $validated['assignment_note'] ?? null,

                    'assigned_at' => now(),

                    'rejection_reason' => null,

                    'rejection_validated' => null,

                    'completed_at' => null,

                    'withdrawal_reason' => null,

                    'withdrawal_requested_at' => null,

                    'withdrawal_reviewed_at' => null,

                    'withdrawal_reviewed_by' => null,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Reserve Volunteer
                |--------------------------------------------------------------------------
                |
                | assigned already occupies the volunteer.
                | This prevents another campaign offer while the volunteer
                | has not yet responded to this assignment.
                |
                */

                Volunteer::where(
                    'user_id',
                    $volunteerUser->id
                )->update([
                    'availability' => 'unavailable',
                ]);

                return $assignment;
            });
        } catch (\Illuminate\Database\QueryException $e) {
            /*
            |--------------------------------------------------------------------------
            | Database Safety Net
            |--------------------------------------------------------------------------
            |
            | The PostgreSQL partial unique index also protects the
            | one-active-campaign rule against concurrent requests.
            |
            */

            if (
                str_contains(
                    $e->getMessage(),
                    'campaign_volunteer_assignments_one_active_campaign'
                )
            ) {
                return response()->json([
                    'message' =>
                    "{$volunteerUser->name} is already assigned to another active campaign.",
                ], 422);
            }

            throw $e;
        }

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

                'totalDonations' => Donation::sum('amount'),

                'totalVolunteers' => Volunteer::count(),

                'reportsGenerated' => 0,
            ],
        ]);
    }
}
