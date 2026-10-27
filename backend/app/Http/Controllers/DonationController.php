<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\DonationAttempt;
use App\Models\User;
use App\Services\Campaign\CampaignService;
use App\Services\SSLCOMMERZService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class DonationController extends Controller
{
    /**
     * Start a donation payment.
     *
     * A real Donation record is created only after
     * server-side payment confirmation.
     */
    public function store(
        Request $request,
        SSLCOMMERZService $paymentService
    ) {
        $validated = $request->validate([
            'campaign_id' => [
                'required',
                'integer',
                'exists:campaigns,id',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:10',
            ],
            'donor_name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'donor_email' => [
                'nullable',
                'email',
                'max:255',
            ],
            'donor_phone' => [
                'nullable',
                'string',
                'regex:/^01\d{9}$/',
            ],
        ]);

        $campaign = Campaign::find($validated['campaign_id']);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found.',
            ], 404);
        }

        /*
         * Prevent new payment attempts when the campaign
         * is inactive, its target has been reached, or
         * its deadline has passed.
         */
        if (!$campaign->acceptsDonations()) {
            return response()->json([
                'message' =>
                'This campaign is no longer accepting donations.',
            ], 422);
        }

        // Resolve the authenticated user through Sanctum.
        $user = auth('sanctum')->user();

        /*
         * Registered users may use their saved phone number.
         * Guests must provide a valid Bangladesh mobile number.
         */
        $donorPhone = $validated['donor_phone']
            ?? $user?->phone;

        if (
            !$donorPhone ||
            !preg_match('/^01\d{9}$/', $donorPhone)
        ) {
            return response()->json([
                'message' =>
                'A valid donor phone number is required to start the payment.',
            ], 422);
        }

        $donorName = $validated['donor_name']
            ?? $user?->name
            ?? 'Guest Donor';

        $donorEmail = $validated['donor_email']
            ?? $user?->email
            ?? 'guest@example.com';

        /*
         * Prevent guests from using an email address
         * already registered to an account.
         */
        if (
            !$user &&
            User::whereRaw(
                'LOWER(email) = ?',
                [strtolower(trim($donorEmail))]
            )->exists()
        ) {
            return response()->json([
                'message' =>
                'এই ইমেইল দিয়ে একটি অ্যাকাউন্ট রয়েছে। অনুদানটি আপনার অ্যাকাউন্টের সঙ্গে যুক্ত করতে অনুগ্রহ করে লগইন করে আবার চেষ্টা করুন।',
            ], 409);
        }

        $transactionId = 'SP-DON-' . Str::upper(
            Str::random(20)
        );

        $attempt = DonationAttempt::create([
            'user_id' => $user?->id,
            'campaign_id' => $campaign->id,
            'amount' => $validated['amount'],
            'status' => DonationAttempt::STATUS_PENDING,
            'payment_method' => 'sslcommerz',
            'transaction_id' => $transactionId,
            'donor_name' => $donorName,
            'donor_email' => $donorEmail,
        ]);

        try {
            $payment = $paymentService->initiatePayment([
                'transaction_id' => $transactionId,
                'amount' => $validated['amount'],
                'donor_name' => $donorName,
                'donor_email' => $donorEmail,
                'donor_phone' => $donorPhone,
                'campaign_id' => $campaign->id,
                'campaign_title' => $campaign->title,
            ]);
        } catch (Throwable $exception) {
            Log::error('SSLCOMMERZ payment initiation failed.', [
                'attempt_id' => $attempt->id,
                'transaction_id' => $transactionId,
                'exception' => get_class($exception),
                'message' => $exception->getMessage(),
            ]);

            /*
             * Only change an attempt that is still pending.
             * A callback may already have processed it.
             */
            DonationAttempt::whereKey($attempt->id)
                ->where(
                    'status',
                    DonationAttempt::STATUS_PENDING
                )
                ->update([
                    'status' => DonationAttempt::STATUS_FAILED,
                ]);

            return response()->json([
                'message' =>
                'Unable to start the payment process. Please try again.',
            ], 502);
        }

        if (
            empty($payment['success']) ||
            empty($payment['gateway_url'])
        ) {
            Log::warning(
                'SSLCOMMERZ returned an unsuccessful initiation response.',
                [
                    'attempt_id' => $attempt->id,
                    'transaction_id' => $transactionId,
                ]
            );

            DonationAttempt::whereKey($attempt->id)
                ->where(
                    'status',
                    DonationAttempt::STATUS_PENDING
                )
                ->update([
                    'status' => DonationAttempt::STATUS_FAILED,
                ]);

            return response()->json([
                'message' => 'Unable to start the payment process.',
            ], 502);
        }

        return response()->json([
            'message' => 'Payment initiated successfully.',
            'payment_url' => $payment['gateway_url'],
            'transaction_id' => $transactionId,
            'attempt_id' => $attempt->id,
        ], 200);
    }

    /**
     * Return donations made by the authenticated user.
     */
    public function myDonations(Request $request)
    {
        $donations = Donation::with('campaign')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'donations' => $donations,
            'summary' => [
                'totalDonated' => $donations->sum(
                    fn($donation) => (float) $donation->amount
                ),
                'donationCount' => $donations->count(),
                'lastDonation' => $donations->first()?->created_at
                    ?->format('M d, Y'),
            ],
        ]);
    }

    /**
     * SSLCOMMERZ browser success callback.
     *
     * Redirect according to the actual payment result,
     * not merely the HTTP response status.
     */
    public function success(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService
    ) {
        $response = $this->processGatewayResult(
            $request,
            $paymentService,
            $campaignService
        );

        // A payment that could not be verified must not be reported
        // as successful.
        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        $transactionId = $request->input('tran_id');

        // A successful donation must exist in the donations table.
        // The attempt may already have been deleted after completion.
        $donationExists = Donation::where(
            'transaction_id',
            $transactionId
        )->exists();

        if (!$donationExists) {
            return $this->frontendPaymentRedirect(
                'failed',
                $transactionId
            );
        }

        return $this->frontendPaymentRedirect(
            'success',
            $transactionId
        );
    }

    /**
     * SSLCOMMERZ failure callback.
     */
    public function fail(Request $request)
    {
        $transactionId = $request->input('tran_id');

        if ($transactionId) {
            DonationAttempt::where(
                'transaction_id',
                $transactionId
            )
                ->where(
                    'status',
                    DonationAttempt::STATUS_PENDING
                )
                ->update([
                    'status' => DonationAttempt::STATUS_FAILED,
                ]);
        }

        return $this->frontendPaymentRedirect(
            'failed',
            $transactionId
        );
    }

    /**
     * SSLCOMMERZ cancellation callback.
     */
    public function cancel(Request $request)
    {
        $transactionId = $request->input('tran_id');

        if ($transactionId) {
            DonationAttempt::where(
                'transaction_id',
                $transactionId
            )
                ->where(
                    'status',
                    DonationAttempt::STATUS_PENDING
                )
                ->update([
                    'status' => DonationAttempt::STATUS_CANCELLED,
                ]);
        }

        return $this->frontendPaymentRedirect(
            'cancelled',
            $transactionId
        );
    }

    /**
     * SSLCOMMERZ server-to-server IPN endpoint.
     */
    public function ipn(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService
    ) {
        return $this->processGatewayResult(
            $request,
            $paymentService,
            $campaignService
        );
    }

    /**
     * Process a gateway callback or IPN.
     */
    private function processGatewayResult(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService
    ) {
        $transactionId = $request->input('tran_id');

        if (!$transactionId) {
            return response()->json([
                'message' => 'Transaction ID is required.',
            ], 422);
        }

        $attempt = DonationAttempt::where(
            'transaction_id',
            $transactionId
        )->first();

        /*
         * The IPN may complete a payment and delete its attempt
         * before the browser success callback arrives.
         */
        if (!$attempt) {
            $donation = Donation::with('campaign')
                ->where('transaction_id', $transactionId)
                ->first();

            if ($donation) {
                return response()->json([
                    'message' =>
                    'Donation payment already confirmed successfully.',
                    'donation' => $donation,
                ], 200);
            }

            return response()->json([
                'message' => 'Donation attempt not found.',
            ], 404);
        }

        /*
         * A previously processed attempt must not create
         * another donation.
         */
        if (
            $attempt->status !== DonationAttempt::STATUS_PENDING
        ) {
            return response()->json([
                'message' => 'Donation attempt already processed.',
            ], 200);
        }

        $validation = $paymentService->validatePayment(
            $request->all(),
            $attempt
        );

        if (empty($validation['success'])) {
            /*
             * Do not permanently fail an attempt when the
             * gateway validation service is temporarily unavailable.
             *
             * SSLCOMMERZService must explicitly return
             * retryable=true for temporary infrastructure or
             * validation-service errors.
             */
            if (!empty($validation['retryable'])) {
                Log::warning(
                    'SSLCOMMERZ payment validation is temporarily unavailable.',
                    [
                        'attempt_id' => $attempt->id,
                        'transaction_id' => $transactionId,
                        'message' => $validation['message'] ?? null,
                    ]
                );

                return response()->json([
                    'message' =>
                    'Payment verification is temporarily unavailable. Please retry verification.',
                ], 503);
            }

            /*
             * Only definitive validation outcomes should change
             * the pending attempt's status.
             */
            $newStatus = $validation['status']
                ?? DonationAttempt::STATUS_FAILED;

            DonationAttempt::whereKey($attempt->id)
                ->where(
                    'status',
                    DonationAttempt::STATUS_PENDING
                )
                ->update([
                    'status' => $newStatus,
                ]);

            return response()->json([
                'message' => $validation['message']
                    ?? 'Payment could not be confirmed.',
            ], 200);
        }

        /*
         * Only a server-validated payment reaches this point.
         * A deadline passing after payment initiation must not
         * automatically invalidate a payment already confirmed
         * by the gateway.
         */
        $donation = $paymentService->completeDonation(
            $attempt,
            $validation
        );

        /*
         * Re-evaluate completion after recording the donation.
         */
        $campaignService->completeCampaignIfEligible(
            $donation->campaign->fresh()
        );

        return response()->json([
            'message' => 'Donation payment confirmed successfully.',
            'donation' => $donation->load('campaign'),
        ], 200);
    }

    /**
     * Redirect the browser to the frontend payment result page.
     */
    private function frontendPaymentRedirect(
        string $status,
        ?string $transactionId = null
    ) {
        $frontendUrl = rtrim(
            (string) config('app.frontend_url'),
            '/'
        );

        /*
         * The attempt may have been deleted after a successful
         * IPN. Use the Donation record as a fallback.
         */
        $attempt = null;
        $donation = null;

        if ($transactionId) {
            $attempt = DonationAttempt::where(
                'transaction_id',
                $transactionId
            )->first();

            if (!$attempt) {
                $donation = Donation::where(
                    'transaction_id',
                    $transactionId
                )->first();
            }
        }

        $isRegisteredUser = $attempt
            ? (bool) $attempt->user_id
            : (bool) $donation?->user_id;

        $path = $isRegisteredUser
            ? '/individual/dashboard/donation/payment-result'
            : '/donation/payment-result';

        $url = $frontendUrl
            . $path
            . '?status='
            . urlencode($status);

        if ($transactionId) {
            $url .= '&transaction_id='
                . urlencode($transactionId);
        }

        return redirect()->away($url);
    }
}
