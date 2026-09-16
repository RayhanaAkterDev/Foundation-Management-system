<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    /**
     * Verify real email address.
     */
    public function verify(Request $request, int $id, string $hash)
    {
        $frontendUrl = env(
            'FRONTEND_URL',
            'http://localhost:5173'
        );

        /*
        |--------------------------------------------------------------------------
        | Check signature
        |--------------------------------------------------------------------------
        */

        if (!URL::hasCorrectSignature($request)) {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=error&message=' .
                    urlencode(
                        'This email verification link is invalid.'
                    )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Check expiration
        |--------------------------------------------------------------------------
        */

        $expires = $request->query('expires');

        if (
            !$expires ||
            !is_numeric($expires) ||
            now()->timestamp >= (int) $expires
        ) {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=expired'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find user
        |--------------------------------------------------------------------------
        */

        $user = User::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Make sure this is a real-email account
        |--------------------------------------------------------------------------
        */

        if ($user->verification_method !== 'email') {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=error&message=' .
                    urlencode(
                        'This account does not use email verification.'
                    )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Make sure hash belongs to current email
        |--------------------------------------------------------------------------
        */

        if (
            !hash_equals(
                sha1($user->getEmailForVerification()),
                $hash
            )
        ) {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=error&message=' .
                    urlencode(
                        'This email verification link is invalid.'
                    )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Already verified
        |--------------------------------------------------------------------------
        */

        if ($user->hasVerifiedEmail()) {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=already-verified'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Verify email
        |--------------------------------------------------------------------------
        */

        $user->markEmailAsVerified();

        /*
        |--------------------------------------------------------------------------
        | Activate account
        |--------------------------------------------------------------------------
        |
        | Email verification is what makes the account eligible
        | to become active.
        |
        */

        $user->status = 'active';
        $user->verification_email_sent_at = null;
        $user->save();

        return redirect(
            $frontendUrl .
                '/email-verification?status=success'
        );
    }

    /**
     * Demo verification.
     */
    public function verifyDemo(Request $request, int $id)
    {
        $frontendUrl = env(
            'FRONTEND_URL',
            'http://localhost:5173'
        );

        $user = User::findOrFail($id);

        /*
        |--------------------------------------------------------------------------
        | Must be a demo account
        |--------------------------------------------------------------------------
        */

        if ($user->verification_method !== 'demo') {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=error&message=' .
                    urlencode(
                        'This account does not use demo verification.'
                    )
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Already verified
        |--------------------------------------------------------------------------
        */

        if ($user->hasVerifiedEmail()) {
            return redirect(
                $frontendUrl .
                    '/email-verification?status=already-verified'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Verify and activate
        |--------------------------------------------------------------------------
        */

        $user->markEmailAsVerified();

        $user->status = 'active';
        $user->verification_email_sent_at = null;
        $user->save();

        return redirect(
            $frontendUrl .
                '/email-verification?status=success&method=demo'
        );
    }

    /**
     * Resend verification email.
     *
     * Public endpoint because the user is not authenticated.
     */
    public function resend(Request $request)
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
            ],

            'role' => [
                'required',
                'in:individual,organization,admin',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Find account
        |--------------------------------------------------------------------------
        */

        $user = User::where(
            'email',
            $validated['email']
        )
            ->where(
                'role',
                $validated['role']
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Do not reveal whether account exists
        |--------------------------------------------------------------------------
        */

        if (!$user) {
            return response()->json([
                'message' =>
                'If an unverified account exists with these details, a verification email will be sent.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Already verified
        |--------------------------------------------------------------------------
        */

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' =>
                'Your email address is already verified.',

                'already_verified' => true,
            ], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | Demo account
        |--------------------------------------------------------------------------
        */

        if ($user->verification_method === 'demo') {
            return response()->json([
                'message' =>
                'This account uses demo verification.',

                'verification_method' => 'demo',

                'user_id' => $user->id,
            ], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | Send fresh verification email
        |--------------------------------------------------------------------------
        */

        $user->sendEmailVerificationNotification();

        /*
        |--------------------------------------------------------------------------
        | Record that a verification email was sent.
        |--------------------------------------------------------------------------
        */

        $user->verification_email_sent_at = now();
        $user->save();

        return response()->json([
            'message' =>
            'A new verification email has been sent to your email address.',

            'verification_method' => 'email',

            'verification_email_sent' => true,
        ]);
    }
}
