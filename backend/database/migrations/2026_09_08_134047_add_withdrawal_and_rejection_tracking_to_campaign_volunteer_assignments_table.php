<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaign_volunteer_assignments', function (Blueprint $table) {
            $table->text('rejection_reason')
                ->nullable()
                ->after('assignment_note');

            $table->boolean('rejection_validated')
                ->nullable()
                ->after('rejection_reason');

            $table->text('withdrawal_reason')
                ->nullable()
                ->after('completed_at');

            $table->timestamp('withdrawal_requested_at')
                ->nullable()
                ->after('withdrawal_reason');

            $table->timestamp('withdrawal_reviewed_at')
                ->nullable()
                ->after('withdrawal_requested_at');

            $table->foreignId('withdrawal_reviewed_by')
                ->nullable()
                ->after('withdrawal_reviewed_at')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('campaign_volunteer_assignments', function (Blueprint $table) {
            $table->dropForeign([
                'withdrawal_reviewed_by',
            ]);

            $table->dropColumn([
                'rejection_reason',
                'rejection_validated',
                'withdrawal_reason',
                'withdrawal_requested_at',
                'withdrawal_reviewed_at',
                'withdrawal_reviewed_by',
            ]);
        });
    }
};
