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
        /*
        |--------------------------------------------------------------------------
        | Fix volunteer_id Foreign Key
        |--------------------------------------------------------------------------
        |
        | OLD:
        |
        | volunteer_id -> volunteers.id
        |
        | FINAL:
        |
        | volunteer_id -> users.id
        |
        */

        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->dropForeign([
                'volunteer_id',
            ]);
        });

        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->foreign('volunteer_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });

        /*
        |--------------------------------------------------------------------------
        | Add assigned_by
        |--------------------------------------------------------------------------
        |
        | assigned_by stores the ID of the admin who created
        | the assignment.
        |
        */

        if (!Schema::hasColumn('help_request_assignments', 'assigned_by')) {
            Schema::table('help_request_assignments', function (Blueprint $table) {
                $table->foreignId('assigned_by')
                    ->nullable()
                    ->after('volunteer_id');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Add assigned_by Foreign Key
        |--------------------------------------------------------------------------
        */

        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->foreign('assigned_by')
                ->references('id')
                ->on('users')
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Remove assigned_by Foreign Key
        |--------------------------------------------------------------------------
        */

        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->dropForeign([
                'assigned_by',
            ]);
        });

        /*
        |--------------------------------------------------------------------------
        | Remove assigned_by Column
        |--------------------------------------------------------------------------
        */

        if (Schema::hasColumn('help_request_assignments', 'assigned_by')) {
            Schema::table('help_request_assignments', function (Blueprint $table) {
                $table->dropColumn('assigned_by');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Restore Old volunteer_id Foreign Key
        |--------------------------------------------------------------------------
        */

        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->dropForeign([
                'volunteer_id',
            ]);
        });

        Schema::table('help_request_assignments', function (Blueprint $table) {
            $table->foreign('volunteer_id')
                ->references('id')
                ->on('volunteers')
                ->nullOnDelete();
        });
    }
};
