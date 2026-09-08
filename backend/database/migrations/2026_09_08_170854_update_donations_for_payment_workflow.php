<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * The donations table represents only successfully
         * confirmed donations.
         *
         * Failed/cancelled payment attempts are stored separately
         * in donation_attempts.
         */
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::create('donation_attempts', function (Blueprint $table) {
            $table->id();

            // Authenticated account that attempted the donation.
            // Null for guest attempts.
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Campaign the user attempted to donate to.
            $table->foreignId('campaign_id')
                ->constrained('campaigns')
                ->cascadeOnDelete();

            $table->decimal('amount', 12, 2);

            /*
             * Only payment attempts that did not become successful
             * donations remain here.
             *
             * pending   = payment has been started but not resolved
             * failed    = gateway/payment failed
             * cancelled = user/gateway cancelled the payment
             */
            $table->string('status');

            $table->string('payment_method')
                ->nullable();

            $table->string('transaction_id')
                ->nullable()
                ->unique();

            $table->string('donor_name')
                ->nullable();

            $table->string('donor_email')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_attempts');

        Schema::table('donations', function (Blueprint $table) {
            $table->string('status')
                ->default('pending');
        });
    }
};
