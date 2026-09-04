<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add withdrawal workflow fields to help request assignments.
     */
    public function up(): void
    {
        Schema::table('help_request_assignments', function (Blueprint $table) {
            /*
             * Withdrawal state is separate from assignment status.
             *
             * null     = no withdrawal request
             * pending  = organization requested withdrawal
             * approved = admin approved withdrawal
             * rejected = admin rejected withdrawal
             */
            $table->string('withdrawal_status')
                ->nullable()
                ->after('status');

            /*
             * Reason provided by the organization.
             */
            $table->text('withdrawal_reason')
                ->nullable()
                ->after('withdrawal_status');

            /*
             * When the organization submitted the withdrawal request.
             */
            $table->timestamp('withdrawal_requested_at')
                ->nullable()
                ->after('withdrawal_reason');

            /*
             * When an admin approved/rejected the request.
             */
            $table->timestamp('withdrawal_reviewed_at')
                ->nullable()
                ->after('withdrawal_requested_at');

            /*
             * Admin who reviewed the withdrawal request.
             */
            $table->foreignId('withdrawal_reviewed_by')
                ->nullable()
                ->after('withdrawal_reviewed_at')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Remove withdrawal workflow fields.
     */
    public function down(): void
    {
        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->dropForeign(['withdrawal_reviewed_by']);

            $table->dropColumn([
                'withdrawal_status',
                'withdrawal_reason',
                'withdrawal_requested_at',
                'withdrawal_reviewed_at',
                'withdrawal_reviewed_by',
            ]);
        });
    }
};
