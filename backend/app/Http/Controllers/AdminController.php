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
                User::whereIn('role', ['individual', 'organization', 'admin'])
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
                    'pending'
                )->count(),

                'activeCampaigns' => Campaign::where(
                    'status',
                    'active'
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
                'pending'
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

            /*
            |--------------------------------------------------------------------------
            | Organization fields
            |--------------------------------------------------------------------------
            */

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

            /*
            |--------------------------------------------------------------------------
            | Individual Account
            |--------------------------------------------------------------------------
            */

            if ($validated['role'] === 'individual') {
                $individualProfile = IndividualProfile::create([
                    'user_id' => $newUser->id,
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Organization Account
            |--------------------------------------------------------------------------
            */

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

            'user' => $result['user']->fresh()->load([
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
    | IMPORTANT:
    | Existing user roles are not changed here.
    |
    | Changing an existing individual into an organization, or an
    | organization into an individual, can break organization records,
    | campaigns, help-request assignments, volunteer records, etc.
    |
    | Role is therefore treated as the account's identity.
    |--------------------------------------------------------------------------
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

        /*
        |--------------------------------------------------------------------------
        | Prevent role switching
        |--------------------------------------------------------------------------
        */

        if ($validated['role'] !== $targetUser->role) {
            return response()->json([
                'message' => 'User role cannot be changed after account creation.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent editing yourself into a non-admin account
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

        $targetUser->name = $validated['name'];
        $targetUser->email = $validated['email'];
        $targetUser->status = $validated['status'];

        if (!empty($validated['password'])) {
            $targetUser->password = $validated['password'];
        }

        $targetUser->save();

        /*
        |--------------------------------------------------------------------------
        | Keep organization name synchronized with user name
        |--------------------------------------------------------------------------
        */

        if ($targetUser->role === 'organization') {
            Organization::where('user_id', $targetUser->id)->update([
                'name' => $targetUser->name,
            ]);
        }

        return response()->json([
            'message' => 'User updated successfully.',

            'user' => $targetUser->fresh()->load([
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
                'message' => 'Admin accounts cannot be deleted from user management.',
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

        /*
        |--------------------------------------------------------------------------
        | Keep organization account name synchronized
        |--------------------------------------------------------------------------
        */

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

        $organization->update([
            'verification_status' => $validated['verification_status'],
        ]);

        return response()->json([
            'message' => 'Organization verification status updated successfully.',

            'organization' => $organization
                ->fresh()
                ->load('user'),
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
            'message' => 'Organization and its user account deleted successfully.',
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

        $helpRequests = HelpRequest::with('user')
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

        if ($helpRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending help requests can be reviewed.',
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
            'message' => $validated['status'] === 'verified'
                ? 'Help request verified successfully.'
                : 'Help request rejected successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load('user'),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Help Requests - Assign Organization / Volunteer
    |--------------------------------------------------------------------------
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

        if (!in_array($helpRequest->status, ['verified', 'assigned'])) {
            return response()->json([
                'message' => 'Only verified help requests can be assigned.',
            ], 422);
        }

        $validated = $request->validate([
            'organization_id' => [
                'nullable',
                'integer',
                'exists:organizations,id',
            ],

            'volunteer_ids' => [
                'nullable',
                'array',
                'min:1',
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
        | At least one target required
        |--------------------------------------------------------------------------
        */

        if (!$organizationId && empty($volunteerIds)) {
            return response()->json([
                'message' => 'Select an organization or at least one volunteer.',
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
                    'message' => 'The selected organization is not verified.',
                ], 422);
            }

            $organizationAlreadyAssigned =
                HelpRequestAssignment::where(
                    'help_request_id',
                    $helpRequest->id
                )
                ->where(
                    'organization_id',
                    $organizationId
                )
                ->exists();

            if ($organizationAlreadyAssigned) {
                return response()->json([
                    'message' => 'This organization is already assigned to the help request.',
                ], 422);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Volunteers
        |--------------------------------------------------------------------------
        */

        foreach ($volunteerIds as $volunteerId) {

            $volunteerUser = User::find($volunteerId);

            if (!$volunteerUser) {
                return response()->json([
                    'message' => "Volunteer user #{$volunteerId} not found.",
                ], 422);
            }

            if ($volunteerUser->role !== 'individual') {
                return response()->json([
                    'message' => "User #{$volunteerId} is not an individual user.",
                ], 422);
            }

            if ($volunteerUser->status !== 'active') {
                return response()->json([
                    'message' => "Volunteer {$volunteerUser->name} is not active.",
                ], 422);
            }

            /*
            |--------------------------------------------------------------------------
            | Approved Volunteer
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
            | Existing Active Help Request Assignment
            |--------------------------------------------------------------------------
            */

            $hasActiveAssignment =
                HelpRequestAssignment::where(
                    'volunteer_id',
                    $volunteerId
                )
                ->whereIn('status', [
                    'assigned',
                    'pending',
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

            /*
            |--------------------------------------------------------------------------
            | Duplicate Assignment
            |--------------------------------------------------------------------------
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
            */

            if ($organizationId) {
                $createdAssignments->push(
                    HelpRequestAssignment::create([
                        'help_request_id' => $helpRequest->id,
                        'organization_id' => $organizationId,
                        'volunteer_id' => null,
                        'assigned_by' => $user->id,
                        'status' => 'assigned',
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
            */

            foreach ($volunteerIds as $volunteerId) {

                $createdAssignments->push(
                    HelpRequestAssignment::create([
                        'help_request_id' => $helpRequest->id,
                        'organization_id' => null,
                        'volunteer_id' => $volunteerId,
                        'assigned_by' => $user->id,
                        'status' => 'assigned',
                        'assignment_note' =>
                        $validated['assignment_note'] ?? null,
                        'assigned_at' => now(),
                    ])
                );

                Volunteer::where(
                    'user_id',
                    $volunteerId
                )->update([
                    'availability' => 'unavailable',
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Update Help Request Status
            |--------------------------------------------------------------------------
            */

            $helpRequest->update([
                'status' => 'assigned',
            ]);

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
            'message' => 'Help request assigned successfully.',

            'assignments' => $assignments,
        ], 201);
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
    | Campaigns
    |--------------------------------------------------------------------------
    */

    public function campaigns(Request $request)
    {
        $user = $this->authorizeAdmin($request);

        if ($user instanceof \Illuminate\Http\JsonResponse) {
            return $user;
        }

        $campaigns = Campaign::with([
            'organization:id,name',
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

        if ($campaign->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending campaigns can be verified.',
            ], 422);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:active,rejected',
            ],
        ]);

        $campaign->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => $validated['status'] === 'active'
                ? 'Campaign approved successfully.'
                : 'Campaign rejected successfully.',

            'campaign' => $campaign
                ->fresh()
                ->load([
                    'organization:id,name',
                    'creator:id,name,email',
                ]),
        ]);
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

        /*
        |--------------------------------------------------------------------------
        | Campaign must be active
        |--------------------------------------------------------------------------
        */

        if ($campaign->status !== 'active') {
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
                "Volunteer {$volunteerUser->name} is not active.",
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Approved SP Volunteer
        |--------------------------------------------------------------------------
        */

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
        | Prevent Active Campaign Assignment
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Assignment
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | Create Assignment
        |--------------------------------------------------------------------------
        */

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
                    'pending'
                )->count(),

                'activeCampaigns' => Campaign::where(
                    'status',
                    'active'
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
