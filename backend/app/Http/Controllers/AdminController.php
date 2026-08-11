<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Organization;
use App\Models\HelpRequest;
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

            'recentActivity' => [],
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

            // Optional when creating.
            // New users will automatically become active.
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

            // Status is required when editing.
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

        // Prevent an admin from deleting their own account.
        if ($targetUser->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own admin account.',
            ], 422);
        }

        // Do not allow deleting another admin
        // through the user-management page.
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
