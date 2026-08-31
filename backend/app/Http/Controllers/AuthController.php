<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'accountType' => 'required|in:individual,organization',

            // Credentials
            'credentials.name' => 'required|string|max:255',
            'credentials.email' => 'required|email|unique:users,email',
            'credentials.password' => 'required|string|min:8|confirmed',

            // Common profile fields
            'profile.phone' => 'nullable|string|max:30',
            'profile.address' => 'nullable|string|max:500',

            // Individual profile
            'profile.district' => 'required_if:accountType,individual|nullable|string|max:100',
            'profile.dob' => 'nullable|date',
            'profile.profilePhoto' => 'nullable|string|max:255',

            // Individual preferences
            'preferences.participationTypes' => 'nullable|array',
            'preferences.causes' => 'nullable|array',

            // Organization profile
            'profile.organizationType' =>
            'required_if:accountType,organization|nullable|string|max:100',

            'profile.registrationNumber' =>
            'required_if:accountType,organization|nullable|string|max:100',

            'profile.website' => 'nullable|url|max:255',

            // Organization details
            'details.mission' =>
            'required_if:accountType,organization|nullable|string|max:1000',

            'details.focusAreas' => 'nullable|array',

            'details.communitiesServed' => 'nullable|array',

            'details.teamSize' => 'nullable|string|max:20',

            'details.primaryActivities' => 'nullable|array',

            'profile.organizationLogo' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {

            $role = $validated['accountType'];

            /*
            |--------------------------------------------------------------------------
            | Create User
            |--------------------------------------------------------------------------
            */

            $user = User::create([
                'name' => $validated['credentials']['name'],
                'email' => $validated['credentials']['email'],
                'password' => Hash::make(
                    $validated['credentials']['password']
                ),
                'role' => $role,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Individual Registration
            |--------------------------------------------------------------------------
            */

            if ($role === 'individual') {

                $user->individualProfile()->create([
                    'phone' => $validated['profile']['phone'] ?? null,

                    'district' => $validated['profile']['district'] ?? null,

                    'address' => $validated['profile']['address'] ?? null,

                    'date_of_birth' => $validated['profile']['dob'] ?? null,

                    'profile_photo' =>
                    $validated['profile']['profilePhoto'] ?? null,
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Organization Registration
            |--------------------------------------------------------------------------
            */

            if ($role === 'organization') {

                $user->organization()->create([

                    // organizations.name is required
                    'name' => $validated['credentials']['name'],

                    'organization_type' =>
                    $validated['profile']['organizationType'] ?? null,

                    'registration_number' =>
                    $validated['profile']['registrationNumber'] ?? null,

                    'phone' =>
                    $validated['profile']['phone'] ?? null,

                    'website' =>
                    $validated['profile']['website'] ?? null,

                    'address' =>
                    $validated['profile']['address'] ?? null,

                    'mission' =>
                    $validated['details']['mission'] ?? null,

                    // Database columns are TEXT
                    'focus_areas' => !empty($validated['details']['focusAreas'])
                        ? json_encode($validated['details']['focusAreas'])
                        : null,

                    'communities_served' => !empty($validated['details']['communitiesServed'])
                        ? json_encode($validated['details']['communitiesServed'])
                        : null,

                    'team_size' =>
                    $validated['details']['teamSize'] ?? null,

                    'primary_activities' => !empty($validated['details']['primaryActivities'])
                        ? json_encode($validated['details']['primaryActivities'])
                        : null,

                    'logo' =>
                    $validated['profile']['organizationLogo'] ?? null,
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Create Sanctum Token
            |--------------------------------------------------------------------------
            */

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful.',
                'user' => $user,
                'token' => $token,
            ], 201);
        });
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'role' => 'required|in:individual,organization,admin',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Check email + password
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Check whether selected account type matches user's role
        if ($user->role !== $validated['role']) {
            return response()->json([
                'message' => 'This account does not belong to the selected account type.',
            ], 403);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful.',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load([
                'individualProfile',
                'organization',
                'volunteer',
            ]),
        ]);
    }
}
