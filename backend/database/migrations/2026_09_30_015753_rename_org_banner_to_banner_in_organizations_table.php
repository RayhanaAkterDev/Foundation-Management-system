<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (
            Schema::hasTable('organizations') &&
            Schema::hasColumn('organizations', 'org_banner') &&
            !Schema::hasColumn('organizations', 'banner')
        ) {
            Schema::table('organizations', function (Blueprint $table) {
                $table->renameColumn('org_banner', 'banner');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (
            Schema::hasTable('organizations') &&
            Schema::hasColumn('organizations', 'banner') &&
            !Schema::hasColumn('organizations', 'org_banner')
        ) {
            Schema::table('organizations', function (Blueprint $table) {
                $table->renameColumn('banner', 'org_banner');
            });
        }
    }
};
