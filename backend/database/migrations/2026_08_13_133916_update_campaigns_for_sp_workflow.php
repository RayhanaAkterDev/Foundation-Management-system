<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('source_type')
                ->default('direct')
                ->after('help_request_id');

            $table->foreignId('created_by')
                ->nullable()
                ->after('organization_id')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'created_by',
                'source_type',
            ]);
        });
    }
};