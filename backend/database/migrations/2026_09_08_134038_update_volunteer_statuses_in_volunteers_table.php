<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convert existing statuses to the new volunteer lifecycle.
        DB::table('volunteers')
            ->where('status', 'approved')
            ->update([
                'status' => 'active',
            ]);

        DB::table('volunteers')
            ->where('status', 'inactive')
            ->update([
                'status' => 'suspended',
            ]);

        Schema::table('volunteers', function (Blueprint $table) {
            $table->string('status')
                ->default('pending')
                ->change();
        });
    }

    public function down(): void
    {
        DB::table('volunteers')
            ->where('status', 'active')
            ->update([
                'status' => 'approved',
            ]);

        DB::table('volunteers')
            ->where('status', 'suspended')
            ->update([
                'status' => 'inactive',
            ]);

        DB::table('volunteers')
            ->whereIn('status', ['rejected', 'removed'])
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
