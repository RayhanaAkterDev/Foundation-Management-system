<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->text('rejection_note')
                ->nullable()
                ->after('assignment_note');
        });
    }

    public function down(): void
    {
        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->dropColumn('rejection_note');
        });
    }
};