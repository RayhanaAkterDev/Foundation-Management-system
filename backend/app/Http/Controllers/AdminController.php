<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Organization;
use App\Models\HelpRequest;
use App\Models\HelpRequestAssignment;
use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Volunteer;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Recent Activity
        |--------------------------------------------------------------------------
        | Build the activity feed from the latest records across the platform.
        | No mock/static activity is used.
        */

        $recentActivity = collect()
            ->merge(
                User::whereIn('role', ['individual', 'admin'])
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
                            'text' => "Donation of ৳" .
                                number_format((float) $item->amount, 2) .
                                " was recorded.",
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

    // ---------------------------------------------------------
    // Users - List
    // ---------------------------------------------------------

    public function users(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $users = User::latest()
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

    // ---------------------------------------------------------
    // Users - View
    // ---------------------------------------------------------

    public function showUser(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $targetUser = User::find($id);

        if (!$targetUser) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => $targetUser->only([
                'id',
                'name',
                'email',
                'role',
                'status',
                'email_verified_at',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    // ---------------------------------------------------------
    // Users - Add
    // ---------------------------------------------------------

    public function storeUser(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],

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
        ]);

        $newUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'User created successfully.',

            'user' => $newUser->only([
                'id',
                'name',
                'email',
                'role',
                'status',
                'email_verified_at',
                'created_at',
                'updated_at',
            ]),
        ], 201);
    }

    // ---------------------------------------------------------
    // Users - Edit
    // ---------------------------------------------------------

    public function updateUser(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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

        $targetUser->name = $validated['name'];
        $targetUser->email = $validated['email'];
        $targetUser->role = $validated['role'];
        $targetUser->status = $validated['status'];

        if (!empty($validated['password'])) {
            $targetUser->password = $validated['password'];
        }

        $targetUser->save();

        return response()->json([
            'message' => 'User updated successfully.',

            'user' => $targetUser->only([
                'id',
                'name',
                'email',
                'role',
                'status',
                'email_verified_at',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    // ---------------------------------------------------------
    // Users - Delete
    // ---------------------------------------------------------

    public function destroyUser(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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

    // ---------------------------------------------------------
    // Organizations - Add
    // ---------------------------------------------------------

    public function storeOrganization(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'organization_type' => ['nullable', 'string', 'max:255'],
            'registration_number' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],
        ]);

        $temporaryPassword = \Illuminate\Support\Str::random(12);

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
            'organization_type' => $validated['organization_type'] ?? null,
            'registration_number' => $validated['registration_number'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'address' => $validated['address'] ?? null,
            'verification_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Organization added successfully.',
            'organization' => $organization->fresh()->load('user'),
            'temporary_password' => $temporaryPassword,
        ], 201);
    }

    // ---------------------------------------------------------
    // Organizations
    // ---------------------------------------------------------

    public function organizations(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organizations = Organization::with('user')
            ->latest()
            ->get();

        return response()->json([
            'organizations' => $organizations,
        ]);
    }

    // ---------------------------------------------------------
    // Help Requests
    // ---------------------------------------------------------

    public function helpRequests(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $helpRequests = HelpRequest::with('user')
            ->latest()
            ->get();

        return response()->json([
            'helpRequests' => $helpRequests,
        ]);
    }

    // ---------------------------------------------------------
    // Help Requests - Assign Organization / Volunteer
    // ---------------------------------------------------------

    public function assignHelpRequest(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->status !== 'verified') {
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
        | At least one assignment target is required
        |--------------------------------------------------------------------------
        */

        if (!$organizationId && empty($volunteerIds)) {
            return response()->json([
                'message' => 'Select an organization or at least one volunteer.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate organization
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
        }

        /*
        |--------------------------------------------------------------------------
        | Validate volunteers
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
            | Volunteer application must be approved
            |--------------------------------------------------------------------------
            */

            $volunteer = Volunteer::where('user_id', $volunteerId)
                ->where('status', 'approved')
                ->first();

            if (!$volunteer) {
                return response()->json([
                    'message' => "{$volunteerUser->name} is not an approved SP volunteer.",
                ], 422);
            }

            /*
            |--------------------------------------------------------------------------
            | Volunteer must currently be available
            |--------------------------------------------------------------------------
            */

            if ($volunteer->availability !== 'available') {
                return response()->json([
                    'message' => "{$volunteerUser->name} is currently unavailable.",
                ], 422);
            }

            /*
            |--------------------------------------------------------------------------
            | Volunteer must not already have an active assignment
            |--------------------------------------------------------------------------
            |
            | "assigned" is included because an assignment immediately starts
            | in the assigned state.
            |
            */

            $hasActiveAssignment = HelpRequestAssignment::where(
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
                    'message' => "{$volunteerUser->name} is currently unavailable.",
                ], 422);
            }

            /*
            |--------------------------------------------------------------------------
            | Prevent duplicate assignment to the same help request
            |--------------------------------------------------------------------------
            */

            $alreadyAssigned = HelpRequestAssignment::where(
                'help_request_id',
                $helpRequest->id
            )
                ->where('volunteer_id', $volunteerId)
                ->exists();

            if ($alreadyAssigned) {
                return response()->json([
                    'message' => "{$volunteerUser->name} is already assigned to this help request.",
                ], 422);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent duplicate organization assignment
        |--------------------------------------------------------------------------
        */

        if ($organizationId) {
            $organizationAlreadyAssigned = HelpRequestAssignment::where(
                'help_request_id',
                $helpRequest->id
            )
                ->where('organization_id', $organizationId)
                ->exists();

            if ($organizationAlreadyAssigned) {
                return response()->json([
                    'message' => 'This organization is already assigned to the help request.',
                ], 422);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Create assignments
        |--------------------------------------------------------------------------
        */

        $assignments = collect();

        if ($organizationId) {
            $assignments->push(
                HelpRequestAssignment::create([
                    'help_request_id' => $helpRequest->id,
                    'organization_id' => $organizationId,
                    'volunteer_id' => null,
                    'assigned_by' => $user->id,
                    'status' => 'assigned',
                    'assignment_note' => $validated['assignment_note'] ?? null,
                    'assigned_at' => now(),
                ])
            );
        }

        foreach ($volunteerIds as $volunteerId) {
            $assignments->push(
                HelpRequestAssignment::create([
                    'help_request_id' => $helpRequest->id,
                    'organization_id' => null,
                    'volunteer_id' => $volunteerId,
                    'assigned_by' => $user->id,
                    'status' => 'assigned',
                    'assignment_note' => $validated['assignment_note'] ?? null,
                    'assigned_at' => now(),
                ])
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Move help request from verified → assigned
        |--------------------------------------------------------------------------
        */

        $helpRequest->update([
            'status' => 'assigned',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Return assignments with relationships
        |--------------------------------------------------------------------------
        |
        | $assignments is a normal Collection, so we must load each
        | Eloquent model individually.
        |
        */

        $assignments = $assignments->map(function ($assignment) {
            return $assignment->fresh()->load([
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

    // ---------------------------------------------------------
    // Help Requests - Verify / Reject
    // ---------------------------------------------------------

    public function updateHelpRequestVerification(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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
            'verification_note' => $validated['verification_note'] ?? null,
        ]);

        return response()->json([
            'message' => $validated['status'] === 'verified'
                ? 'Help request verified successfully.'
                : 'Help request rejected successfully.',

            'help_request' => $helpRequest->fresh()->load('user'),
        ]);
    }

    // ---------------------------------------------------------
    // Organizations - View
    // ---------------------------------------------------------

    public function showOrganization(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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

    // ---------------------------------------------------------
    // Organizations - Edit
    // ---------------------------------------------------------

    public function updateOrganization(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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
                'string',
            ],

            'communities_served' => [
                'nullable',
                'string',
            ],

            'team_size' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'primary_activities' => [
                'nullable',
                'string',
            ],
        ]);

        $organization->update($validated);

        return response()->json([
            'message' => 'Organization updated successfully.',
            'organization' => $organization->fresh()->load('user'),
        ]);
    }

    // ---------------------------------------------------------
    // Organizations - Verification
    // ---------------------------------------------------------

    public function updateOrganizationVerification(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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
            'organization' => $organization->fresh()->load('user'),
        ]);
    }

    // ---------------------------------------------------------
    // Organizations - Delete
    // ---------------------------------------------------------

    public function destroyOrganization(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::find($id);

        if (!$organization) {
            return response()->json([
                'message' => 'Organization not found.',
            ], 404);
        }

        $organization->delete();

        return response()->json([
            'message' => 'Organization deleted successfully.',
        ]);
    }

    // ---------------------------------------------------------
    // Donations
    // ---------------------------------------------------------

    public function donations(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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

    // ---------------------------------------------------------
    // Volunteers
    // ---------------------------------------------------------

    public function volunteers(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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

    // ---------------------------------------------------------
    // Campaigns
    // ---------------------------------------------------------

    public function campaigns(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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

    // ---------------------------------------------------------
    // Reports
    // ---------------------------------------------------------

    public function reports(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
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
