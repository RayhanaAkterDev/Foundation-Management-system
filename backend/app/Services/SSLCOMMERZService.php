<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\DonationAttempt;
use App\Models\User;
use App\Notifications\PlatformNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SSLCOMMERZService
{
    private string $storeId;
    private string $storePassword;
    private string $initiationUrl;
    private string $validationUrl;
    private string $callbackUrl;

    public function __construct()
    {
        $this->storeId = (string) config(
            'services.sslcommerz.store_id'
        );

        $this->storePassword = (string) config(
            'services.sslcommerz.store_password'
        );

        $this->initiationUrl = (string) config(
            'services.sslcommerz.initiation_url'
        );

        $this->validationUrl = (string) config(
            'services.sslcommerz.validation_url'
        );

        $this->callbackUrl = rtrim(
            (string) config('services.sslcommerz.callback_url'),
            '/'
        );
    }

    /**
     * Start an SSLCOMMERZ payment session.
     */
    public function initiatePayment(array $data): array
    {
        if (
            $this->storeId === ''
            || $this->storePassword === ''
            || $this->initiationUrl === ''
            || $this->callbackUrl === ''
        ) {
            throw new RuntimeException(
                'SSLCOMMERZ configuration is incomplete.'
            );
        }

        if (empty($data['donor_phone'])) {
            throw new RuntimeException(
                'Donor phone number is required to initiate SSLCOMMERZ payment.'
            );
        }

        $payload = [
            'store_id' => $this->storeId,
            'store_passwd' => $this->storePassword,

            'total_amount' => number_format(
                (float) $data['amount'],
                2,
                '.',
                ''
            ),

            'currency' => 'BDT',

            'tran_id' => $data['transaction_id'],

            'success_url' =>
            $this->callbackUrl .
                '/api/donations/payment/success',

            'fail_url' =>
            $this->callbackUrl .
                '/api/donations/payment/fail',

            'cancel_url' =>
            $this->callbackUrl .
                '/api/donations/payment/cancel',

            'ipn_url' =>
            $this->callbackUrl .
                '/api/donations/payment/ipn',

            'cus_name' => $data['donor_name'],
            'cus_email' => $data['donor_email'],
            'cus_phone' => $data['donor_phone'],

            'cus_add1' => 'Bangladesh',
            'cus_city' => 'Dhaka',
            'cus_country' => 'Bangladesh',

            'shipping_method' => 'NO',

            'product_name' => $data['campaign_title'],
            'product_category' => 'donation',
            'product_profile' => 'general',

            'value_a' => (string) $data['campaign_id'],
            'value_b' => (string) $data['transaction_id'],
        ];

        try {
            $response = Http::asForm()
                ->acceptJson()
                ->timeout(30)
                ->post(
                    $this->initiationUrl,
                    $payload
                );
        } catch (\Throwable $exception) {
            throw new RuntimeException(
                'Unable to connect to SSLCOMMERZ: ' .
                    $exception->getMessage(),
                0,
                $exception
            );
        }

        if (!$response->successful()) {
            throw new RuntimeException(
                'SSLCOMMERZ payment initiation failed. ' .
                    'HTTP ' . $response->status() .
                    '. Response: ' . $response->body()
            );
        }

        $result = $response->json();

        if (!is_array($result)) {
            throw new RuntimeException(
                'SSLCOMMERZ returned an invalid response. ' .
                    'Raw response: ' . $response->body()
            );
        }

        if (empty($result['GatewayPageURL'])) {
            throw new RuntimeException(
                'SSLCOMMERZ did not return a payment gateway URL. ' .
                    'Response: ' . json_encode($result)
            );
        }

        return [
            'success' => true,
            'gateway_url' => $result['GatewayPageURL'],
            'session_key' => $result['sessionkey'] ?? null,
        ];
    }

    /**
     * Validate an SSLCOMMERZ payment notification.
     *
     * This method does not trust the browser callback.
     * It asks SSLCOMMERZ's Order Validation API to verify
     * the transaction.
     */
    public function validatePayment(
        array $notification,
        DonationAttempt $attempt
    ): array {
        $status = strtoupper(
            (string) ($notification['status'] ?? '')
        );

        if ($status === 'CANCELLED') {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_CANCELLED,
                'message' => 'Payment was cancelled.',
            ];
        }

        if ($status !== 'VALID') {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' => 'Payment was not successful.',
            ];
        }

        $transactionId = (string) (
            $notification['tran_id'] ?? ''
        );

        if (
            $transactionId === ''
            || $transactionId !== $attempt->transaction_id
        ) {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' => 'Invalid transaction ID.',
            ];
        }

        $validationId = (string) (
            $notification['val_id'] ?? ''
        );

        if ($validationId === '') {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' => 'Payment validation ID is missing.',
            ];
        }

        /*
     * Validate the transaction directly with SSLCOMMERZ.
     * Network failures are retryable because the payment
     * may already have been completed by the gateway.
     */
        try {
            $response = Http::timeout(30)->get(
                $this->validationUrl,
                [
                    'val_id' => $validationId,
                    'store_id' => $this->storeId,
                    'store_passwd' => $this->storePassword,
                    'format' => 'json',
                ]
            );
        } catch (\Throwable $exception) {
            report($exception);

            return [
                'success' => false,
                'retryable' => true,
                'status' => DonationAttempt::STATUS_PENDING,
                'message' =>
                'Unable to reach SSLCOMMERZ for payment validation.',
            ];
        }

        /*
     * Retry rate limits and server-side failures.
     * Other HTTP errors are treated as definitive failures.
     */
        if (!$response->successful()) {
            $httpStatus = $response->status();

            $retryable = $httpStatus === 429
                || $httpStatus >= 500;

            return [
                'success' => false,
                'retryable' => $retryable,
                'status' => $retryable
                    ? DonationAttempt::STATUS_PENDING
                    : DonationAttempt::STATUS_FAILED,
                'message' =>
                'Unable to validate payment with SSLCOMMERZ.',
            ];
        }

        /*
     * A successful HTTP status does not guarantee that
     * the gateway returned a valid JSON response.
     */
        $result = $response->json();

        if (!is_array($result)) {
            return [
                'success' => false,
                'retryable' => true,
                'status' => DonationAttempt::STATUS_PENDING,
                'message' =>
                'Invalid validation response from SSLCOMMERZ.',
            ];
        }

        /*
     * Only accept a transaction confirmed by the
     * SSLCOMMERZ validation API.
     */
        $validatedStatus = strtoupper(
            (string) ($result['status'] ?? '')
        );

        if (
            !in_array(
                $validatedStatus,
                ['VALID', 'VALIDATED'],
                true
            )
        ) {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' =>
                'SSLCOMMERZ did not validate the payment.',
            ];
        }

        /*
     * Ensure the validated transaction matches the
     * original donation attempt.
     */
        $validatedTransactionId = (string) (
            $result['tran_id'] ?? ''
        );

        if (
            $validatedTransactionId === ''
            || $validatedTransactionId !== $attempt->transaction_id
        ) {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' =>
                'Validated transaction does not match the donation attempt.',
            ];
        }

        /*
     * Require a valid amount and compare it with the
     * amount originally requested.
     */
        if (
            !isset($result['amount'])
            || !is_numeric($result['amount'])
        ) {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' =>
                'SSLCOMMERZ returned an invalid payment amount.',
            ];
        }

        $gatewayAmount = (float) $result['amount'];
        $attemptAmount = (float) $attempt->amount;

        if (
            !is_finite($gatewayAmount)
            || $gatewayAmount <= 0
            || abs($gatewayAmount - $attemptAmount) > 0.01
        ) {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' =>
                'Payment amount does not match the donation amount.',
            ];
        }

        /*
     * Donations on this platform are processed in BDT.
     */
        $currency = strtoupper(
            (string) ($result['currency'] ?? '')
        );

        if ($currency !== 'BDT') {
            return [
                'success' => false,
                'status' => DonationAttempt::STATUS_FAILED,
                'message' => 'Invalid payment currency.',
            ];
        }

        return [
            'success' => true,
            'status' => DonationAttempt::STATUS_PENDING,
            'transaction_id' => $validatedTransactionId,
            'validation_id' => $validationId,
            'amount' => $gatewayAmount,
            'currency' => $currency,
            'payment_method' =>
            $result['card_type']
                ?? $result['card_brand']
                ?? 'SSLCOMMERZ',
            'gateway_response' => $result,
        ];
    }

    /**
     * Convert a validated payment attempt into an actual donation.
     *
     * This is the ONLY point where:
     *
     * 1. Donation is created.
     * 2. Campaign collected_amount increases.
     *
     * Both operations happen in one database transaction.
     */
    public function completeDonation(
        DonationAttempt $attempt,
        array $payment
    ): Donation {
        $donation = DB::transaction(function () use (
            $attempt,
            $payment
        ) {
            /**
             * Lock the attempt to prevent concurrent callbacks
             * from processing the same payment simultaneously.
             */
            $attempt = DonationAttempt::whereKey($attempt->id)
                ->lockForUpdate()
                ->firstOrFail();

            /**
             * Prevent duplicate IPN/callback processing.
             */
            if (
                $attempt->status !==
                DonationAttempt::STATUS_PENDING
            ) {
                throw new RuntimeException(
                    'Donation attempt has already been processed.'
                );
            }

            /**
             * Lock the campaign while recording the donation.
             */
            $campaign = $attempt->campaign()
                ->lockForUpdate()
                ->first();

            if (!$campaign) {
                throw new RuntimeException(
                    'Campaign associated with the donation attempt was not found.'
                );
            }

            /**
             * Do not reject an already-confirmed payment because
             * the campaign deadline passed or its status changed
             * after the payment was initiated.
             *
             * New donation attempts are still restricted by the
             * campaign eligibility check in DonationController.
             */

            /**
             * Create the real donation.
             */
            $donation = Donation::create([
                'user_id' => $attempt->user_id,
                'donor_name' => $attempt->donor_name,
                'donor_email' => $attempt->donor_email,
                'campaign_id' => $attempt->campaign_id,
                'amount' => $attempt->amount,
                'payment_method' => $payment['payment_method'],
                'transaction_id' => $attempt->transaction_id,
            ]);

            /**
             * Only confirmed payments change campaign totals.
             */
            $campaign->increment(
                'collected_amount',
                $attempt->amount
            );

            /**
             * Remove the completed donation attempt.
             */
            $attempt->delete();

            return $donation->load('campaign');
        });

        /**
         * Notify registered donors after the transaction commits.
         * Guest donations have no associated user account.
         */
        if ($donation->user) {
            $donation->user->notify(new PlatformNotification(
                'Donation successful',
                "Your donation of {$donation->amount} to {$donation->campaign->title} was successful. Thank you for supporting our cause!",
                '/individual/dashboard/donations',
                'donation'
            ));
        }

        /**
         * Notify active administrators.
         */
        User::where('role', 'admin')
            ->where('status', 'active')
            ->get()
            ->each(function (User $admin) use ($donation) {
                $admin->notify(new PlatformNotification(
                    'New donation received',
                    "A donation of {$donation->amount} was received for {$donation->campaign->title}.",
                    '/admin/dashboard/donations',
                    'donation'
                ));
            });

        /**
         * Notify the campaign's organization.
         */
        $donation->campaign->loadMissing('organization.user');

        if ($donation->campaign->organization?->user) {
            $donation->campaign->organization->user->notify(
                new PlatformNotification(
                    'New donation received',
                    "A donation of {$donation->amount} was received for your campaign \"{$donation->campaign->title}\".",
                    '/organization/dashboard/donations',
                    'donation'
                )
            );
        }

        return $donation;
    }
}
