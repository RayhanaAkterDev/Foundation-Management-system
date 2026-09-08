<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\DonationAttempt;
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

            'cus_add1' => 'Bangladesh',

            'cus_city' => 'Dhaka',

            'cus_country' => 'Bangladesh',

            'shipping_method' => 'NO',

            'product_name' => $data['campaign_title'],

            'product_category' => 'donation',

            'product_profile' => 'general',

            /*
             * These values allow us to carry SP-specific
             * information through the gateway request.
             */
            'value_a' => (string) $data['campaign_id'],

            'value_b' => (string) $data['transaction_id'],
        ];

        $response = Http::asForm()
            ->timeout(30)
            ->post(
                $this->initiationUrl,
                $payload
            );

        if (!$response->successful()) {
            throw new RuntimeException(
                'SSLCOMMERZ payment initiation failed.'
            );
        }

        $result = $response->json();

        if (
            !is_array($result)
            || empty($result['GatewayPageURL'])
        ) {
            throw new RuntimeException(
                'SSLCOMMERZ did not return a payment gateway URL.'
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

        $response = Http::timeout(30)->get(
            $this->validationUrl,
            [
                'val_id' => $validationId,

                'store_id' => $this->storeId,

                'store_passwd' => $this->storePassword,

                'format' => 'json',
            ]
        );

        if (!$response->successful()) {
            return [
                'success' => false,

                'status' => DonationAttempt::STATUS_FAILED,

                'message' =>
                'Unable to validate payment with SSLCOMMERZ.',
            ];
        }

        $result = $response->json();

        if (!is_array($result)) {
            return [
                'success' => false,

                'status' => DonationAttempt::STATUS_FAILED,

                'message' =>
                'Invalid validation response from SSLCOMMERZ.',
            ];
        }

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

        $validatedTransactionId = (string) (
            $result['tran_id'] ?? ''
        );

        if (
            $validatedTransactionId !==
            $attempt->transaction_id
        ) {
            return [
                'success' => false,

                'status' => DonationAttempt::STATUS_FAILED,

                'message' =>
                'Validated transaction does not match the donation attempt.',
            ];
        }

        $gatewayAmount = (float) (
            $result['amount'] ?? 0
        );

        $attemptAmount = (float) $attempt->amount;

        if (
            abs($gatewayAmount - $attemptAmount) > 0.01
        ) {
            return [
                'success' => false,

                'status' => DonationAttempt::STATUS_FAILED,

                'message' =>
                'Payment amount does not match the donation amount.',
            ];
        }

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
        return DB::transaction(function () use (
            $attempt,
            $payment
        ) {
            $attempt->refresh();

            /*
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

            $campaign = $attempt->campaign()
                ->lockForUpdate()
                ->first();

            if (!$campaign) {
                throw new RuntimeException(
                    'Campaign associated with the donation attempt was not found.'
                );
            }

            if (
                $campaign->status !==
                Campaign::STATUS_ACTIVE
            ) {
                throw new RuntimeException(
                    'Campaign is no longer active.'
                );
            }

            /*
             * Create the real donation.
             */
            $donation = Donation::create([
                'user_id' => $attempt->user_id,

                'donor_name' => $attempt->donor_name,

                'donor_email' => $attempt->donor_email,

                'campaign_id' => $attempt->campaign_id,

                'amount' => $attempt->amount,

                'payment_method' =>
                $payment['payment_method'],

                'transaction_id' =>
                $attempt->transaction_id,
            ]);

            /*
             * Only confirmed payment changes campaign totals.
             */
            $campaign->increment(
                'collected_amount',
                $attempt->amount
            );

            /*
             * The unsuccessful-attempt record is no longer
             * needed once it has become a real donation.
             */
            $attempt->delete();

            return $donation->load('campaign');
        });
    }
}
