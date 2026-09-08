<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE UNIQUE INDEX campaign_volunteer_assignments_one_active_campaign
            ON campaign_volunteer_assignments (volunteer_id)
            WHERE status IN (
                'assigned',
                'accepted',
                'in_progress',
                'withdrawal_requested'
            )
        ");
    }

    public function down(): void
    {
        DB::statement("
            DROP INDEX IF EXISTS
            campaign_volunteer_assignments_one_active_campaign
        ");
    }
};
