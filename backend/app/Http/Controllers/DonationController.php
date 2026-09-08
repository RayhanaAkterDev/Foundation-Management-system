<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
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
         * Guests are also allowed.
         */
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
            'donor_name' => $validated['donor_name']
                ?? $user?->name,
            'donor_email' => $validated['donor_email']
                ?? $user?->email,
        ]);

        try {
            $payment = $paymentService->initiatePayment([
                'transaction_id' => $transactionId,
                'amount' => $validated['amount'],
                'donor_name' => $validated['donor_name']
                    ?? $user?->name
                    ?? 'Guest Donor',
                'donor_email' => $validated['donor_email']
                    ?? $user?->email
                    ?? 'guest@example.com',
                'campaign_id' => $campaign->id,
                'campaign_title' => $campaign->title,
            ]);
        } catch (\Throwable $exception) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_FAILED,
            ]);

            return response()->json([
                'message' =>
                'Unable to start the payment process.',
            ], 502);
        }

        if (
            empty($payment['success'])
            || empty($payment['gateway_url'])
        ) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_FAILED,
            ]);

            return response()->json([
                'message' =>
                'Unable to start the payment process.',
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
     * SSLCOMMERZ success callback.
     *
     * The browser redirect itself is NOT trusted as proof of payment.
     * The payment service validates the transaction with SSLCOMMERZ.
     */
    public function success(
        Request $request,
        SSLCOMMERZService $paymentService,
        CampaignService $campaignService
    ) {
        return $this->processGatewayResult(
            $request,
            $paymentService,
            $campaignService,
            'success'
        );
    }

    /**
     * SSLCOMMERZ failure callback.
     */
    public function fail(
        Request $request,
        SSLCOMMERZService $paymentService
    ) {
        $attempt = DonationAttempt::where(
            'transaction_id',
            $request->input('tran_id')
        )->first();

        if ($attempt) {
            $attempt->update([
                'status' => DonationAttempt::STATUS_FAILED,
            ]);
        }

        return response()->json([
            'message' => 'Donation payment failed.',
        ], 200);
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

        return response()->json([
            'message' => 'Donation payment cancelled.',
        ], 200);
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
         * If the IPN/callback is received more than once,
         * do not create another donation.
         */
        if ($attempt->status !== DonationAttempt::STATUS_PENDING) {
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
}
