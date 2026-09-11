<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, int $id, int $hash)
    {
        if (! URL::hasValidSignature($request)) {
            return response()->json([
                'message' => 'This email verification link is invalid or has expired.',
            ], 403);
        }

        $user = User::findOrFail($id);

        if (! hash_equals(
            sha1($user->getEmailForVerification()),
            $hash
        )) {
            return response()->json([
                'message' => 'This email verification link is invalid.',
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email address is already verified.',
            ]);
        }

        $user->markEmailAsVerified();

        $user->update([
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Email address verified successfully. Your account is now active.',
            'user' => $user,
        ]);
    }

    public function verifyDemo(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        if ($user->verification_method !== 'demo') {
            return response()->json([
                'message' => 'This account does not use demo verification.',
            ], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'This demo account is already verified.',
            ]);
        }

        $user->markEmailAsVerified();

        $user->update([
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Demo account verified successfully. Your account is now active.',
            'user' => $user,
        ]);
    }

    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Your email address is already verified.',
            ], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'A new verification email has been sent.',
        ]);
    }
}
