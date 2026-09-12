<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    /**
     * Verify email address.
     *
     * Verification links are valid for 60 minutes.
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
        |
        | First check whether the signature itself is correct.
        | This ignores expiration so we can distinguish:
        |
        | - Invalid/tampered link
        | - Expired link
        |
        */

        if (! URL::hasCorrectSignature($request)) {
            return redirect(
                $frontendUrl . '/email-verification?status=error&message=' .
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
                $frontendUrl . '/email-verification?status=expired'
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
        | Verify email hash
        |--------------------------------------------------------------------------
        |
        | This makes sure the verification link belongs to this
        | user's current email address.
        |
        */

        if (! hash_equals(
            sha1($user->getEmailForVerification()),
            $hash
        )) {
            return redirect(
                $frontendUrl . '/email-verification?status=error&message=' .
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
                $frontendUrl . '/email-verification?status=already-verified'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Mark email as verified
        |--------------------------------------------------------------------------
        */

        $user->markEmailAsVerified();

        /*
        |--------------------------------------------------------------------------
        | Activate account
        |--------------------------------------------------------------------------
        */

        $user->update([
            'status' => 'active',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Redirect to frontend
        |--------------------------------------------------------------------------
        */

        return redirect(
            $frontendUrl . '/email-verification?status=success'
        );
    }


    /**
     * Demo verification.
     *
     * Kept separate from real email verification.
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
        | Make sure this is a demo account
        |--------------------------------------------------------------------------
        */

        if ($user->verification_method !== 'demo') {
            return redirect(
                $frontendUrl . '/email-verification?status=error&message=' .
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
                $frontendUrl . '/email-verification?status=already-verified'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Verify and activate
        |--------------------------------------------------------------------------
        */

        $user->markEmailAsVerified();

        $user->update([
            'status' => 'active',
        ]);

        return redirect(
            $frontendUrl . '/email-verification?status=success&method=demo'
        );
    }


    /**
     * Resend verification email.
     *
     * This endpoint is intentionally PUBLIC because the user
     * is not authenticated yet.
     *
     * Works for:
     * - individual
     * - organization
     * - admin
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

        $user = User::where('email', $validated['email'])
            ->where('role', $validated['role'])
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Do not reveal whether an account exists
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
            ], 400);
        }

        /*
        |--------------------------------------------------------------------------
        | Send fresh email verification link
        |--------------------------------------------------------------------------
        |
        | Laravel's verification notification will generate a
        | fresh signed verification URL.
        |
        */

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' =>
            'A new verification email has been sent to your email address.',
            'verification_method' => 'email',
        ]);
    }
}
