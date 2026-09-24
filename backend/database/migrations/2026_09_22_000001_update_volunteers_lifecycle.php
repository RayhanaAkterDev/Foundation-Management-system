<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convert legacy volunteer statuses to the final lifecycle.
        DB::table('volunteers')
            ->whereIn('status', ['pending', 'rejected', 'removed'])
            ->update([
                'status' => 'inactive',
            ]);

        Schema::table('volunteers', function (Blueprint $table) {
            $table->string('status')
                ->default('inactive')
                ->change();
        });

        // Availability is calculated from volunteer status
        // and campaign assignments. It is no longer stored.
        if (Schema::hasColumn('volunteers', 'availability')) {
            Schema::table('volunteers', function (Blueprint $table) {
                $table->dropColumn('availability');
            });
        }
    }

    public function down(): void
    {
        // Restore the availability column if rolling back.
        if (!Schema::hasColumn('volunteers', 'availability')) {
            Schema::table('volunteers', function (Blueprint $table) {
                $table->string('availability')
                    ->nullable()
                    ->after('skills');
            });
        }

        // Map the final lifecycle back to the closest legacy statuses.
        DB::table('volunteers')
            ->where('status', 'active')
            ->update([
                'status' => 'approved',
            ]);

        DB::table('volunteers')
            ->whereIn('status', ['inactive', 'suspended'])
            ->update([
                'status' => 'inactive',
            ]);

        Schema::table('volunteers', function (Blueprint $table) {
            $table->string('status')
                ->default('pending')
                ->change();
        });
    }
};
