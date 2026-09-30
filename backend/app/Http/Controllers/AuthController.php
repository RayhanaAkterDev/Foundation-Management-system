<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use ImageKit\ImageKit;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'accountType' => 'required|in:individual,organization',

            'credentials.name' => 'required|string|max:255',

            'credentials.email' => [
                'required',
                'email',
                'unique:users,email',
            ],

            'credentials.password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'profile.phone' => [
                'nullable',
                'string',
                'regex:/^01[0-9]{9}$/',
                Rule::unique('users', 'phone'),
            ],

            'profile.address' => 'nullable|string|max:500',

            'profile.district' => [
                'required_if:accountType,individual',
                'nullable',
                'string',
                'max:100',
            ],

            'profile.dob' => 'nullable|date',

            /*
            |--------------------------------------------------------------------------
            | Individual profile photo
            |--------------------------------------------------------------------------
            |
            | The frontend sends an actual uploaded image file.
            |
            */

            'profile.profilePhoto' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],

            'preferences.participationTypes' => 'nullable|array',
            'preferences.causes' => 'nullable|array',

            'profile.organizationType' => [
                'required_if:accountType,organization',
                'nullable',
                'string',
                'max:100',
            ],

            'profile.registrationNumber' => [
                'required_if:accountType,organization',
                'nullable',
                'string',
                'max:100',
            ],

            'profile.website' => 'nullable|url|max:255',

            'details.mission' => [
                'required_if:accountType,organization',
                'nullable',
                'string',
                'max:1000',
            ],

            'details.focusAreas' => 'nullable|array',
            'details.communitiesServed' => 'nullable|array',
            'details.teamSize' => 'nullable|string|max:20',
            'details.primaryActivities' => 'nullable|array',

            /*
            |--------------------------------------------------------------------------
            | Organization logo
            |--------------------------------------------------------------------------
            |
            | The organization logo is stored in users.photo because
            | users.photo is the common identity image for all account types.
            |
            */

            'profile.organizationLogo' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | ImageKit
        |--------------------------------------------------------------------------
        |
        | Both individuals and organizations use users.photo.
        |
        | Individual:
        |     profile.profilePhoto
        |
        | Organization:
        |     profile.organizationLogo
        |
        | The actual image is uploaded to ImageKit.
        | The database stores the ImageKit file URL.
        |
        */

        $photoUrl = null;

        try {
            $imageKit = new ImageKit(
                config('services.imagekit.public_key'),
                config('services.imagekit.private_key'),
                config('services.imagekit.url_endpoint')
            );

            /*
            |--------------------------------------------------------------------------
            | Individual photo
            |--------------------------------------------------------------------------
            */

            /*
|--------------------------------------------------------------------------
| Individual photo
|--------------------------------------------------------------------------
*/

            if (
                $request->hasFile('profile.profilePhoto') &&
                $request->file('profile.profilePhoto')->isValid()
            ) {
                $file = $request->file('profile.profilePhoto');

                $realPath = $file->getRealPath();
                $mimeType = $file->getMimeType();
                $fileContents = file_get_contents($realPath);

                if ($fileContents === false) {
                    throw new \RuntimeException(
                        'Could not read the uploaded profile photo.'
                    );
                }

                if (!str_starts_with($mimeType, 'image/')) {
                    throw new \RuntimeException(
                        "Uploaded profile photo was detected as {$mimeType}, not an image."
                    );
                }

                $uploadResponse = $imageKit->uploadFile([
                    'file' => base64_encode($fileContents),
                    'fileName' => $file->getClientOriginalName(),
                    'folder' => '/users/photos',
                    'useUniqueFileName' => true,
                ]);

                if ($uploadResponse->error) {
                    throw new \RuntimeException(
                        $uploadResponse->error->message ??
                            'Failed to upload profile photo to ImageKit.'
                    );
                }

                $photoUrl = $uploadResponse->result->url ?? null;

                if (!$photoUrl) {
                    throw new \RuntimeException(
                        'ImageKit uploaded the profile photo but did not return a URL.'
                    );
                }

                Log::info('Profile photo uploaded to ImageKit.', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'size' => $file->getSize(),
                    'imagekit_file_type' =>
                    $uploadResponse->result->fileType ?? null,
                    'imagekit_url' =>
                    $photoUrl,
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Organization logo
            |--------------------------------------------------------------------------
            */

            /*
|--------------------------------------------------------------------------
| Organization logo
|--------------------------------------------------------------------------
*/

            if (
                $request->hasFile('profile.organizationLogo') &&
                $request->file('profile.organizationLogo')->isValid()
            ) {
                $file = $request->file('profile.organizationLogo');

                $realPath = $file->getRealPath();
                $mimeType = $file->getMimeType();
                $fileContents = file_get_contents($realPath);

                if ($fileContents === false) {
                    throw new \RuntimeException(
                        'Could not read the uploaded organization logo.'
                    );
                }

                if (!str_starts_with($mimeType, 'image/')) {
                    throw new \RuntimeException(
                        "Uploaded organization logo was detected as {$mimeType}, not an image."
                    );
                }

                $uploadResponse = $imageKit->uploadFile([
                    'file' => base64_encode($fileContents),
                    'fileName' => $file->getClientOriginalName(),
                    'folder' => '/users/photos',
                    'useUniqueFileName' => true,
                ]);

                if ($uploadResponse->error) {
                    throw new \RuntimeException(
                        $uploadResponse->error->message ??
                            'Failed to upload organization logo to ImageKit.'
                    );
                }

                $photoUrl = $uploadResponse->result->url ?? null;

                if (!$photoUrl) {
                    throw new \RuntimeException(
                        'ImageKit uploaded the organization logo but did not return a URL.'
                    );
                }

                Log::info('Organization logo uploaded to ImageKit.', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'size' => $file->getSize(),
                    'imagekit_file_type' =>
                    $uploadResponse->result->fileType ?? null,
                    'imagekit_url' =>
                    $photoUrl,
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Database transaction
            |--------------------------------------------------------------------------
            */

            $user = DB::transaction(function () use (
                $validated,
                $photoUrl
            ) {
                $role = $validated['accountType'];

                $user = User::create([
                    'name' => $validated['credentials']['name'],
                    'email' => $validated['credentials']['email'],
                    'password' => Hash::make(
                        $validated['credentials']['password']
                    ),
                    'role' => $role,

                    // Public registration currently uses the demo verification flow.
                    'verification_method' => 'demo',

                    // Account remains inactive until demo verification is completed.
                    'status' => 'inactive',

                    'phone' =>
                    $validated['profile']['phone'] ?? null,

                    'photo' => $photoUrl,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Explicitly reset verification state.
                |--------------------------------------------------------------------------
                */

                $user->email_verified_at = null;
                $user->verification_email_sent_at = null;
                $user->save();

                /*
                |--------------------------------------------------------------------------
                | Individual Profile
                |--------------------------------------------------------------------------
                */

                if ($role === 'individual') {
                    $user->individualProfile()->create([
                        'district' =>
                        $validated['profile']['district'] ?? null,

                        'address' =>
                        $validated['profile']['address'] ?? null,

                        'date_of_birth' =>
                        $validated['profile']['dob'] ?? null,
                    ]);
                }

                /*
                |--------------------------------------------------------------------------
                | Organization Profile
                |--------------------------------------------------------------------------
                */

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
                        !empty($validated['details']['communitiesServed'])
                            ? json_encode(
                                $validated['details']['communitiesServed']
                            )
                            : null,

                        'team_size' =>
                        $validated['details']['teamSize'] ?? null,

                        'primary_activities' =>
                        !empty($validated['details']['primaryActivities'])
                            ? json_encode(
                                $validated['details']['primaryActivities']
                            )
                            : null,
                    ]);
                }

                return $user;
            });
        } catch (\Throwable $e) {
            Log::error('Registration failed.', [
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ]);

            throw $e;
        }

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        |
        | Do NOT send verification email here.
        |
        | The first login attempt triggers verification email.
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'message' =>
            'Registration successful. Please sign in to receive your email verification link.',

            'user' => $user,
        ], 201);
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

        /*
        |--------------------------------------------------------------------------
        | Email verification / account activation
        |--------------------------------------------------------------------------
        */

        if (
            !$user->hasVerifiedEmail() ||
            $user->status !== 'active'
        ) {
            /*
            |--------------------------------------------------------------------------
            | Demo verification
            |--------------------------------------------------------------------------
            */

            if ($user->verification_method === 'demo') {
                return response()->json([
                    'message' =>
                    'Please verify this demo account before logging in.',

                    'verification_method' => 'demo',

                    'user_id' => $user->id,

                    'email' => $user->email,

                    'email_verified' =>
                    $user->hasVerifiedEmail(),

                    'status' => $user->status,

                    'verification_email_sent' => false,
                ], 403);
            }

            /*
            |--------------------------------------------------------------------------
            | Real email verification
            |--------------------------------------------------------------------------
            */

            $verificationEmailSent = false;

            /*
            |--------------------------------------------------------------------------
            | FIRST LOGIN:
            |
            | No verification email has ever been sent.
            | Send it now.
            |--------------------------------------------------------------------------
            */

            if (!$user->verification_email_sent_at) {
                try {
                    Log::info('MAIL BEFORE VERIFICATION', [
                        'default' => config('mail.default'),
                        'host' => config('mail.mailers.smtp.host'),
                        'port' => config('mail.mailers.smtp.port'),
                        'scheme' => config('mail.mailers.smtp.scheme'),
                        'url' => config('mail.mailers.smtp.url'),
                    ]);

                    $user->sendEmailVerificationNotification();

                    $user->verification_email_sent_at = now();
                    $user->save();

                    $verificationEmailSent = true;
                } catch (\Throwable $e) {
                    return response()->json([
                        'message' =>
                        'Failed to send verification email.',

                        'error' => $e->getMessage(),

                        'exception' => get_class($e),

                        'mail_config' => [
                            'default' =>
                            config('mail.default'),

                            'smtp_host' =>
                            config('mail.mailers.smtp.host'),

                            'smtp_port' =>
                            config('mail.mailers.smtp.port'),

                            'smtp_scheme' =>
                            config('mail.mailers.smtp.scheme'),

                            'smtp_url' =>
                            config('mail.mailers.smtp.url'),
                        ],
                    ], 500);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Existing unverified account:
            |
            | Do NOT automatically send another email.
            | User must use Resend Verification.
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'message' =>
                'Please verify your email address before logging in.',

                'verification_method' => 'email',

                'user_id' => $user->id,

                'email' => $user->email,

                'email_verified' =>
                $user->hasVerifiedEmail(),

                'status' => $user->status,

                'verification_email_sent' =>
                $verificationEmailSent,

                'can_resend' => true,
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Verified + active account
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

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
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',

                Rule::unique('users', 'email')
                    ->ignore($user->id),
            ],

            'phone' => [
                'nullable',
                'string',
                'regex:/^01[0-9]{9}$/',

                Rule::unique('users', 'phone')
                    ->ignore($user->id),
            ],

            'district' => 'nullable|string|max:255',

            'address' => 'nullable|string',

            'date_of_birth' => 'nullable|date',
        ]);

        $emailChanged =
            $user->email !== $validated['email'];

        /*
        |--------------------------------------------------------------------------
        | Update account information
        |--------------------------------------------------------------------------
        */

        $user->name = $validated['name'];
        $user->phone = $validated['phone'] ?? null;

        if ($emailChanged) {
            $user->email = $validated['email'];

            /*
            |--------------------------------------------------------------------------
            | New email must be verified again.
            |
            | Keep the current verification method.
            |--------------------------------------------------------------------------
            */

            $user->email_verified_at = null;
            $user->status = 'inactive';

            /*
            |--------------------------------------------------------------------------
            | A new email means the previous verification email
            | is no longer relevant.
            |--------------------------------------------------------------------------
            */

            $user->verification_email_sent_at = null;
        }

        $user->save();

        /*
        |--------------------------------------------------------------------------
        | Individual profile
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'individual') {
            $user->individualProfile()->updateOrCreate(
                [
                    'user_id' => $user->id,
                ],
                [
                    'district' =>
                    $validated['district'] ?? null,

                    'address' =>
                    $validated['address'] ?? null,

                    'date_of_birth' =>
                    $validated['date_of_birth'] ?? null,
                ]
            );
        }

        $user->load([
            'individualProfile',
            'organization',
            'volunteer',
        ]);

        return response()->json([
            'message' => $emailChanged
                ? 'Profile updated. Please sign in to receive a verification link for your new email address.'
                : 'Profile updated successfully.',

            'user' => $user,
        ]);
    }
}
