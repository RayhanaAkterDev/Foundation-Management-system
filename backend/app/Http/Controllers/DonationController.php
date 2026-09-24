<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\DonationAttempt;
use App\Services\Campaign\CampaignService;
use App\Services\SSLCOMMERZService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    /**
     * Start a donation payment.
     *
     * This does NOT create a Donation record.
     * A real Donation is created only after SSLCOMMERZ
     * confirms the payment through the server-side flow.
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

        $campaign = Campaign::where(
            'status',
            Campaign::STATUS_ACTIVE
        )->find($validated['campaign_id']);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found or is not active.',
            ], 404);
        }

        $user = $request->user();

        /*
         * Admin, individual and organization accounts may donate.
         *
         * For authenticated users, use the phone number stored
         * on users.phone unless a donor_phone was explicitly supplied.
         *
         * For guests, donor_phone must be supplied because
         * SSLCOMMERZ requires cus_phone.
         */
        $donorPhone = $validated['donor_phone']
            ?? $user?->phone;

        if (!$donorPhone) {
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
        } catch (\Throwable $exception) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_FAILED,
            ]);

            /*
             * TEMPORARY DEBUG RESPONSE
             */
            return response()->json([
                'message' => 'Unable to start the payment process.',
                'error' => $exception->getMessage(),
                'exception' => get_class($exception),
            ], 502);
        }

        if (
            empty($payment['success'])
            || empty($payment['gateway_url'])
        ) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_FAILED,
            ]);

            /*
             * TEMPORARY DEBUG RESPONSE
             */
            return response()->json([
                'message' => 'Unable to start the payment process.',
                'payment_response' => $payment,
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
     * SSLCOMMERZ success callback.
     *
     * The payment is still validated server-side before
     * the user is redirected to the frontend.
     */
    public function success(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService
    ) {
        $response = $this->processGatewayResult(
            $request,
            $paymentService,
            $campaignService,
            'success'
        );

        /*
         * Do not redirect if payment processing failed.
         */
        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        /*
         * Payment was successfully confirmed and the
         * Donation record was created.
         */
        return $this->frontendPaymentRedirect(
            'success',
            $request->input('tran_id')
        );
    }

    /**
     * SSLCOMMERZ failure callback.
     */
    public function fail(Request $request)
    {
        $attempt = DonationAttempt::where(
            'transaction_id',
            $request->input('tran_id')
        )->first();

        if ($attempt) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_FAILED,
            ]);
        }

        return $this->frontendPaymentRedirect(
            'failed',
            $request->input('tran_id')
        );
    }

    /**
     * SSLCOMMERZ cancellation callback.
     */
    public function cancel(Request $request)
    {
        $attempt = DonationAttempt::where(
            'transaction_id',
            $request->input('tran_id')
        )->first();

        if ($attempt) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_CANCELLED,
            ]);
        }

        return $this->frontendPaymentRedirect(
            'cancelled',
            $request->input('tran_id')
        );
    }

    /**
     * SSLCOMMERZ IPN endpoint.
     *
     * This is the important server-to-server confirmation path.
     */
    public function ipn(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService
    ) {
        return $this->processGatewayResult(
            $request,
            $paymentService,
            $campaignService,
            'ipn'
        );
    }

    /**
     * Process a confirmed SSLCOMMERZ transaction.
     */
    private function processGatewayResult(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService,
        string $source
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

        if (!$attempt) {
            return response()->json([
                'message' => 'Donation attempt not found.',
            ], 404);
        }

        /*
         * Idempotency:
         *
         * If the IPN/callback is received more than once,
         * do not create another donation.
         */
        if (
            $attempt->status !==
            DonationAttempt::STATUS_PENDING
        ) {
            return response()->json([
                'message' => 'Donation attempt already processed.',
            ], 200);
        }

        $validation = $paymentService->validatePayment(
            $request->all(),
            $attempt
        );

        if (!$validation['success']) {
            $attempt->update([
                'status' => $validation['status']
                    ?? DonationAttempt::STATUS_FAILED,
            ]);

            return response()->json([
                'message' => $validation['message']
                    ?? 'Payment could not be confirmed.',
            ], 200);
        }

        /*
         * Only the validated payment reaches this point.
         *
         * The payment service has already verified:
         * - transaction identity
         * - payment status
         * - amount
         * - currency
         */
        $donation = $paymentService->completeDonation(
            $attempt,
            $validation
        );

        /*
         * Donation has now increased collected_amount.
         *
         * Let CampaignService determine whether the campaign
         * has become eligible for completion.
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
     * Redirect the browser back to the frontend after
     * the payment callback has been processed.
     */
    private function frontendPaymentRedirect(
        string $status,
        ?string $transactionId = null
    ) {
        $frontendUrl = rtrim(
            (string) config('app.frontend_url'),
            '/'
        );

        $url = $frontendUrl .
            '/individual/dashboard/donation/payment-result?status=' .
            urlencode($status);

        if ($transactionId) {
            $url .= '&transaction_id=' .
                urlencode($transactionId);
        }

        return redirect()->away($url);
    }
}
