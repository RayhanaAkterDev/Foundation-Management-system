<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'accountType' => 'required|in:individual,organization',

            'credentials.name' => 'required|string|max:255',
            'credentials.email' => 'required|email|unique:users,email',
            'credentials.password' => 'required|string|min:8|confirmed',

            'profile.phone' => [
                'required',
                'string',
                'regex:/^01[0-9]{9}$/',
                Rule::unique('users', 'phone'),
            ],

            'profile.address' => 'nullable|string|max:500',

            'profile.district' =>
                'required_if:accountType,individual|nullable|string|max:100',

            'profile.dob' => 'nullable|date',

            'profile.profilePhoto' =>
                'nullable|string|max:255',

            'preferences.participationTypes' =>
                'nullable|array',

            'preferences.causes' =>
                'nullable|array',

            'profile.organizationType' =>
                'required_if:accountType,organization|nullable|string|max:100',

            'profile.registrationNumber' =>
                'required_if:accountType,organization|nullable|string|max:100',

            'profile.website' =>
                'nullable|url|max:255',

            'details.mission' =>
                'required_if:accountType,organization|nullable|string|max:1000',

            'details.focusAreas' =>
                'nullable|array',

            'details.communitiesServed' =>
                'nullable|array',

            'details.teamSize' =>
                'nullable|string|max:20',

            'details.primaryActivities' =>
                'nullable|array',

            'profile.organizationLogo' =>
                'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            $role = $validated['accountType'];

            $user = User::create([
                'name' => $validated['credentials']['name'],
                'email' => $validated['credentials']['email'],
                'password' => Hash::make(
                    $validated['credentials']['password']
                ),
                'role' => $role,
                'phone' => $validated['profile']['phone'],
            ]);

            if ($role === 'individual') {
                $user->individualProfile()->create([
                    'district' =>
                        $validated['profile']['district'] ?? null,

                    'address' =>
                        $validated['profile']['address'] ?? null,

                    'date_of_birth' =>
                        $validated['profile']['dob'] ?? null,

                    'profile_photo' =>
                        $validated['profile']['profilePhoto'] ?? null,
                ]);
            }

            if ($role === 'organization') {
                $user->organization()->create([
                    'name' =>
                        $validated['credentials']['name'],

                    'organization_type' =>
                        $validated['profile']['organizationType'] ?? null,

                    'registration_number' =>
                        $validated['profile']['registrationNumber'] ?? null,

                    'website' =>
                        $validated['profile']['website'] ?? null,

                    'address' =>
                        $validated['profile']['address'] ?? null,

                    'mission' =>
                        $validated['details']['mission'] ?? null,

                    'focus_areas' =>
                        !empty($validated['details']['focusAreas'])
                            ? json_encode(
                                $validated['details']['focusAreas']
                            )
                            : null,

                    'communities_served' =>
                        !empty(
                            $validated['details']['communitiesServed']
                        )
                            ? json_encode(
                                $validated['details']['communitiesServed']
                            )
                            : null,

                    'team_size' =>
                        $validated['details']['teamSize'] ?? null,

                    'primary_activities' =>
                        !empty(
                            $validated['details']['primaryActivities']
                        )
                            ? json_encode(
                                $validated['details']['primaryActivities']
                            )
                            : null,

                    'logo' =>
                        $validated['profile']['organizationLogo'] ?? null,
                ]);
            }

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

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (
            !$user ||
            !Hash::check(
                $validated['password'],
                $user->password
            )
        ) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->role !== $validated['role']) {
            return response()->json([
                'message' =>
                    'This account does not belong to the selected account type.',
            ], 403);
        }

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

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' =>
                'required|string|max:255',

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($user->id),
            ],

            'phone' => [
                'required',
                'string',
                'regex:/^01[0-9]{9}$/',
                Rule::unique('users', 'phone')
                    ->ignore($user->id),
            ],

            'district' =>
                'nullable|string|max:255',

            'address' =>
                'nullable|string',

            'date_of_birth' =>
                'nullable|date',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Update account-level information
        |--------------------------------------------------------------------------
        |
        | Phone belongs to users now.
        | It must NOT be stored in individual_profiles anymore.
        |
        */
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Update individual profile information
        |--------------------------------------------------------------------------
        |
        | Phone is intentionally excluded because users.phone
        | is now the single source of truth for the account phone.
        |
        */
        $user->individualProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'district' =>
                    $validated['district'] ?? null,

                'address' =>
                    $validated['address'] ?? null,

                'date_of_birth' =>
                    $validated['date_of_birth'] ?? null,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Reload relationships so the frontend receives fresh data
        |--------------------------------------------------------------------------
        */
        $user->load([
            'individualProfile',
            'organization',
            'volunteer',
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }
}