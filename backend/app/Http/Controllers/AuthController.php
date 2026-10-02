<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Passwords\PasswordBroker;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use ImageKit\ImageKit;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate(
            [
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
                */

                'profile.profilePhoto' => [
                    'nullable',
                    'image',
                    'mimes:jpeg,jpg,png,webp',
                    'max:5120',
                ],

                /*
                |--------------------------------------------------------------------------
                | Individual participation preferences
                |--------------------------------------------------------------------------
                */

                'preferences.participationTypes' => [
                    'nullable',
                    'array',
                ],

                'preferences.participationTypes.*' => [
                    'string',
                    'in:hr,volunteer,donor',
                ],

                /*
                |--------------------------------------------------------------------------
                | Individual category preferences
                |--------------------------------------------------------------------------
                */

                'preferences.causes' => [
                    'nullable',
                    'array',
                ],

                'preferences.causes.*' => [
                    'string',
                    'max:100',
                ],

                /*
                |--------------------------------------------------------------------------
                | Organization profile
                |--------------------------------------------------------------------------
                */

                'profile.organizationType' => [
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
                */

                'profile.organizationLogo' => [
                    'nullable',
                    'image',
                    'mimes:jpeg,jpg,png,webp',
                    'max:5120',
                ],
            ],
            [
                'accountType.required' =>
                'অ্যাকাউন্টের ধরন নির্বাচন করুন।',

                'accountType.in' =>
                'সঠিক অ্যাকাউন্টের ধরন নির্বাচন করুন।',

                'credentials.name.required' =>
                'নাম লিখুন.',

                'credentials.name.string' =>
                'নাম অবশ্যই সঠিকভাবে লিখতে হবে।',

                'credentials.name.max' =>
                'নাম সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে।',

                'credentials.email.required' =>
                'ইমেইল ঠিকানা লিখুন।',

                'credentials.email.email' =>
                'সঠিক ইমেইল ঠিকানা লিখুন।',

                'credentials.email.unique' =>
                'এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।',

                'credentials.password.required' =>
                'পাসওয়ার্ড লিখুন।',

                'credentials.password.string' =>
                'পাসওয়ার্ড সঠিক ফরম্যাটে দিতে হবে।',

                'credentials.password.min' =>
                'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',

                'credentials.password.confirmed' =>
                'পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না।',

                'profile.phone.regex' =>
                'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।',

                'profile.phone.unique' =>
                'এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।',

                'profile.address.string' =>
                'ঠিকানাটি সঠিকভাবে লিখুন।',

                'profile.address.max' =>
                'ঠিকানা সর্বোচ্চ ৫০০ অক্ষরের হতে পারে।',

                'profile.district.required_if' =>
                'জেলা নির্বাচন বা লিখুন।',

                'profile.district.string' =>
                'জেলার তথ্য সঠিকভাবে দিন।',

                'profile.district.max' =>
                'জেলার নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে।',

                'profile.dob.date' =>
                'সঠিক জন্মতারিখ দিন।',

                'profile.profilePhoto.image' =>
                'প্রোফাইল ছবিটি অবশ্যই একটি ছবি হতে হবে।',

                'profile.profilePhoto.mimes' =>
                'প্রোফাইল ছবির ফরম্যাট JPEG, JPG, PNG অথবা WebP হতে হবে।',

                'profile.profilePhoto.max' =>
                'প্রোফাইল ছবির আকার সর্বোচ্চ ৫ MB হতে পারে।',

                'preferences.participationTypes.array' =>
                'অংশগ্রহণের পছন্দগুলো সঠিকভাবে নির্বাচন করুন।',

                'preferences.participationTypes.*.string' =>
                'অংশগ্রহণের পছন্দের তথ্য সঠিক নয়।',

                'preferences.participationTypes.*.in' =>
                'নির্বাচিত অংশগ্রহণের পছন্দটি সঠিক নয়।',

                'preferences.causes.array' =>
                'আগ্রহের বিষয়গুলো সঠিকভাবে নির্বাচন করুন।',

                'preferences.causes.*.string' =>
                'আগ্রহের বিষয়ের তথ্য সঠিক নয়।',

                'preferences.causes.*.max' =>
                'আগ্রহের বিষয়ের নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে।',

                'profile.organizationType.required_if' =>
                'প্রতিষ্ঠানের ধরন লিখুন।',

                'profile.organizationType.string' =>
                'প্রতিষ্ঠানের ধরন সঠিকভাবে দিন।',

                'profile.organizationType.max' =>
                'প্রতিষ্ঠানের ধরন সর্বোচ্চ ১০০ অক্ষরের হতে পারে।',

                'profile.website.url' =>
                'সঠিক ওয়েবসাইট ঠিকানা দিন।',

                'profile.website.max' =>
                'ওয়েবসাইটের ঠিকানা সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে।',

                'details.mission.required_if' =>
                'প্রতিষ্ঠানের উদ্দেশ্য লিখুন।',

                'details.mission.string' =>
                'প্রতিষ্ঠানের উদ্দেশ্য সঠিকভাবে লিখুন।',

                'details.mission.max' =>
                'প্রতিষ্ঠানের উদ্দেশ্য সর্বোচ্চ ১০০০ অক্ষরের হতে পারে।',

                'details.focusAreas.array' =>
                'কাজের ক্ষেত্রগুলো সঠিকভাবে নির্বাচন করুন।',

                'details.communitiesServed.array' =>
                'সেবাপ্রাপ্ত কমিউনিটির তথ্য সঠিকভাবে দিন।',

                'details.teamSize.string' =>
                'দলের আকার সঠিকভাবে দিন।',

                'details.teamSize.max' =>
                'দলের আকার সর্বোচ্চ ২০ অক্ষরের হতে পারে।',

                'details.primaryActivities.array' =>
                'প্রধান কার্যক্রমগুলো সঠিকভাবে নির্বাচন করুন।',

                'profile.organizationLogo.image' =>
                'প্রতিষ্ঠানের লোগো অবশ্যই একটি ছবি হতে হবে।',

                'profile.organizationLogo.mimes' =>
                'প্রতিষ্ঠানের লোগোর ফরম্যাট JPEG, JPG, PNG অথবা WebP হতে হবে।',

                'profile.organizationLogo.max' =>
                'প্রতিষ্ঠানের লোগোর আকার সর্বোচ্চ ৫ MB হতে পারে।',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | ImageKit
        |--------------------------------------------------------------------------
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
                        'প্রোফাইল ছবিটি পড়া যায়নি।'
                    );
                }

                if (!str_starts_with($mimeType, 'image/')) {
                    throw new \RuntimeException(
                        "আপলোড করা প্রোফাইল ছবির ধরন {$mimeType}, যা একটি ছবি নয়।"
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
                            'প্রোফাইল ছবি আপলোড করা যায়নি।'
                    );
                }

                $photoUrl = $uploadResponse->result->url ?? null;

                if (!$photoUrl) {
                    throw new \RuntimeException(
                        'প্রোফাইল ছবি আপলোড হয়েছে, কিন্তু ছবির ঠিকানা পাওয়া যায়নি।'
                    );
                }

                Log::info('Profile photo uploaded to ImageKit.', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'size' => $file->getSize(),
                    'imagekit_file_type' =>
                    $uploadResponse->result->fileType ?? null,
                    'imagekit_url' => $photoUrl,
                ]);
            }

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
                        'প্রতিষ্ঠানের লোগোটি পড়া যায়নি।'
                    );
                }

                if (!str_starts_with($mimeType, 'image/')) {
                    throw new \RuntimeException(
                        "আপলোড করা প্রতিষ্ঠানের লোগোর ধরন {$mimeType}, যা একটি ছবি নয়।"
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
                            'প্রতিষ্ঠানের লোগো আপলোড করা যায়নি।'
                    );
                }

                $photoUrl = $uploadResponse->result->url ?? null;

                if (!$photoUrl) {
                    throw new \RuntimeException(
                        'প্রতিষ্ঠানের লোগো আপলোড হয়েছে, কিন্তু ছবির ঠিকানা পাওয়া যায়নি।'
                    );
                }

                Log::info('Organization logo uploaded to ImageKit.', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $mimeType,
                    'size' => $file->getSize(),
                    'imagekit_file_type' =>
                    $uploadResponse->result->fileType ?? null,
                    'imagekit_url' => $photoUrl,
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
                    'verification_method' => 'demo',
                    'status' => 'inactive',
                    'phone' =>
                    $validated['profile']['phone'] ?? null,
                    'photo' => $photoUrl,
                ]);

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

                        'participation_preferences' =>
                        array_values(
                            $validated['preferences']['participationTypes'] ?? []
                        ),

                        'category_preferences' =>
                        array_values(
                            $validated['preferences']['causes'] ?? []
                        ),
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

        return response()->json([
            'message' =>
            'নিবন্ধন সফল হয়েছে। লগইন করলে আপনার ইমেইল যাচাইয়ের লিংক পাঠানো হবে।',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate(
            [
                'email' => 'required|email',
                'password' => 'required|string',
                'role' => 'required|in:individual,organization,admin',
                'remember' => 'nullable|boolean',
            ],
            [
                'email.required' =>
                'ইমেইল ঠিকানা লিখুন।',

                'email.email' =>
                'সঠিক ইমেইল ঠিকানা লিখুন।',

                'password.required' =>
                'পাসওয়ার্ড লিখুন।',

                'password.string' =>
                'পাসওয়ার্ড সঠিক ফরম্যাটে দিতে হবে।',

                'role.required' =>
                'অ্যাকাউন্টের ধরন নির্বাচন করুন।',

                'role.in' =>
                'সঠিক অ্যাকাউন্টের ধরন নির্বাচন করুন।',
            ]
        );

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
                'message' =>
                'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।',
            ], 401);
        }

        if ($user->role !== $validated['role']) {
            return response()->json([
                'message' =>
                'এই অ্যাকাউন্টটি নির্বাচিত অ্যাকাউন্টের ধরনের সঙ্গে মিলছে না।',
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
                    'লগইন করার আগে এই ডেমো অ্যাকাউন্টটি যাচাই করুন।',

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

            if (!$user->verification_email_sent_at) {
                try {
                    Log::info('MAIL BEFORE VERIFICATION', [
                        'default' => config('mail.default'),
                        'host' =>
                        config('mail.mailers.smtp.host'),
                        'port' =>
                        config('mail.mailers.smtp.port'),
                        'scheme' =>
                        config('mail.mailers.smtp.scheme'),
                        'url' =>
                        config('mail.mailers.smtp.url'),
                    ]);

                    $user->sendEmailVerificationNotification();

                    $user->verification_email_sent_at = now();
                    $user->save();

                    $verificationEmailSent = true;
                } catch (\Throwable $e) {
                    return response()->json([
                        'message' =>
                        'ইমেইল যাচাইকরণ বার্তা পাঠানো যায়নি।',

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

            return response()->json([
                'message' =>
                'লগইন করার আগে আপনার ইমেইল ঠিকানা যাচাই করুন।',

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
            'message' => 'লগইন সফল হয়েছে।',
            'user' => $user,
            'token' => $token,
            'remember' => $request->boolean('remember'),
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json([
            'message' => 'লগআউট সফল হয়েছে।',
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

        $validated = $request->validate(
            [
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

                /*
                |--------------------------------------------------------------------------
                | Individual participation preferences
                |--------------------------------------------------------------------------
                */

                'participation_preferences' => [
                    'nullable',
                    'array',
                ],

                'participation_preferences.*' => [
                    'string',
                    'in:hr,volunteer,donor',
                ],

                /*
                |--------------------------------------------------------------------------
                | Individual category preferences
                |--------------------------------------------------------------------------
                */

                'category_preferences' => [
                    'nullable',
                    'array',
                ],

                'category_preferences.*' => [
                    'string',
                    'max:100',
                ],
            ],
            [
                'name.required' =>
                'নাম লিখুন।',

                'name.string' =>
                'নাম সঠিকভাবে লিখুন।',

                'name.max' =>
                'নাম সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে।',

                'email.required' =>
                'ইমেইল ঠিকানা লিখুন।',

                'email.email' =>
                'সঠিক ইমেইল ঠিকানা লিখুন।',

                'email.max' =>
                'ইমেইল ঠিকানা সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে।',

                'email.unique' =>
                'এই ইমেইল ঠিকানা দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।',

                'phone.regex' =>
                'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।',

                'phone.unique' =>
                'এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।',

                'district.string' =>
                'জেলার তথ্য সঠিকভাবে দিন।',

                'district.max' =>
                'জেলার নাম সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে।',

                'address.string' =>
                'ঠিকানাটি সঠিকভাবে লিখুন।',

                'date_of_birth.date' =>
                'সঠিক জন্মতারিখ দিন।',

                'participation_preferences.array' =>
                'অংশগ্রহণের পছন্দগুলো সঠিকভাবে নির্বাচন করুন।',

                'participation_preferences.*.string' =>
                'অংশগ্রহণের পছন্দের তথ্য সঠিক নয়।',

                'participation_preferences.*.in' =>
                'নির্বাচিত অংশগ্রহণের পছন্দটি সঠিক নয়।',

                'category_preferences.array' =>
                'আগ্রহের বিষয়গুলো সঠিকভাবে নির্বাচন করুন।',

                'category_preferences.*.string' =>
                'আগ্রহের বিষয়ের তথ্য সঠিক নয়।',

                'category_preferences.*.max' =>
                'আগ্রহের বিষয়ের নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে।',
            ]
        );

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

            $user->email_verified_at = null;

            $user->status = 'inactive';

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

                    'participation_preferences' =>
                    array_values(
                        $validated['participation_preferences'] ?? []
                    ),

                    'category_preferences' =>
                    array_values(
                        $validated['category_preferences'] ?? []
                    ),
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
                ? 'প্রোফাইল আপডেট হয়েছে। নতুন ইমেইল ঠিকানা যাচাই করার জন্য লগইন করুন।'
                : 'প্রোফাইল সফলভাবে আপডেট হয়েছে।',

            'user' => $user,
        ]);
    }

    /**
     * Send or generate a password reset link.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(
            [
                'email' => 'required|email',
            ],
            [
                'email.required' => 'ইমেইল দেওয়া আবশ্যক।',
                'email.email' => 'সঠিক ইমেইল ঠিকানা দিন।',
            ]
        );

        $email = trim($request->email);

        $user = User::where('email', $email)->first();

        /*
    |--------------------------------------------------------------------------
    | Demo account
    |--------------------------------------------------------------------------
    |
    | Demo accounts do not depend on real email delivery.
    | Generate a temporary Laravel password-reset token and return
    | the reset URL directly for the manual/demo flow.
    |
    */

        if ($user && $user->verification_method === 'demo') {
            /** @var PasswordBroker $broker */
            $broker = Password::broker('users');

            $token = $broker->createToken($user);

            $frontendUrl = rtrim(
                config(
                    'app.frontend_url',
                    env('FRONTEND_URL', 'http://localhost:5173')
                ),
                '/'
            );

            $resetUrl = $frontendUrl
                . '/reset-password?token='
                . urlencode($token)
                . '&email='
                . urlencode($user->email);

            return response()->json([
                'message' => 'ডেমো অ্যাকাউন্টের জন্য পাসওয়ার্ড রিসেট লিংক তৈরি হয়েছে।',
                'reset_url' => $resetUrl,
            ], 200);
        }

        /*
    |--------------------------------------------------------------------------
    | Real-email account
    |--------------------------------------------------------------------------
    |
    | Keep Laravel's existing password broker for accounts that use
    | actual email-based password reset.
    |
    */

        Password::broker('users')->sendResetLink([
            'email' => $email,
        ]);

        return response()->json([
            'message' => 'যদি এই ইমেইল ঠিকানায় একটি অ্যাকাউন্ট থাকে, তাহলে পাসওয়ার্ড রিসেট করার নির্দেশনা পাঠানো হয়েছে।',
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate(
            [
                'token' => 'required|string',
                'email' => 'required|email',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'confirmed',
                ],
            ],
            [
                'token.required' => 'পাসওয়ার্ড রিসেট টোকেন প্রয়োজন।',
                'email.required' => 'ইমেইল দেওয়া আবশ্যক।',
                'email.email' => 'সঠিক ইমেইল ঠিকানা দিন।',
                'password.required' => 'নতুন পাসওয়ার্ড দেওয়া আবশ্যক।',
                'password.min' => 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
                'password.confirmed' => 'পাসওয়ার্ড নিশ্চিতকরণ মিলছে না।',
            ]
        );

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => match ($status) {
                    Password::INVALID_TOKEN => 'পাসওয়ার্ড রিসেট লিংকটি অবৈধ অথবা মেয়াদ শেষ হয়ে গেছে।',
                    Password::INVALID_USER => 'এই ইমেইল ঠিকানার জন্য কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
                    default => 'পাসওয়ার্ড রিসেট করা যায়নি। আবার চেষ্টা করুন।',
                },
            ], 422);
        }

        return response()->json([
            'message' => 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।',
        ], 200);
    }
}
