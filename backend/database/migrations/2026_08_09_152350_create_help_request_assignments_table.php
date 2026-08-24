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
        Schema::create('help_request_assignments', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Help Request
            |--------------------------------------------------------------------------
            |
            | Every assignment belongs to a Help Request.
            |
            */

            $table->foreignId('help_request_id')
                ->constrained('help_requests')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Organization
            |--------------------------------------------------------------------------
            |
            | Nullable because a Help Request may be handled by:
            |
            | - SP volunteer(s) only
            | - Organization only
            | - Organization + SP volunteer(s)
            |
            */

            $table->foreignId('organization_id')
                ->nullable()
                ->constrained('organizations')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Volunteer
            |--------------------------------------------------------------------------
            |
            | IMPORTANT:
            |
            | volunteer_id references users.id, NOT volunteers.id.
            |
            | A volunteer is an activity/profile of an existing
            | individual user, not a separate account identity.
            |
            */

            $table->foreignId('volunteer_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Assigned By
            |--------------------------------------------------------------------------
            |
            | Stores the admin user who created the assignment.
            |
            */

            $table->foreignId('assigned_by')
                ->constrained('users')
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Assignment Status
            |--------------------------------------------------------------------------
            |
            | These statuses belong to the ASSIGNMENT.
            |
            | They are completely separate from HelpRequest.status.
            |
            | Valid assignment statuses:
            |
            | assigned
            | accepted
            | rejected
            | in_progress
            | completed
            |
            */

            $table->string('status')
                ->default('assigned');

            /*
            |--------------------------------------------------------------------------
            | Assignment Note
            |--------------------------------------------------------------------------
            */

            $table->text('assignment_note')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Assignment Timestamps
            |--------------------------------------------------------------------------
            */

            $table->timestamp('assigned_at')
                ->nullable();

            $table->timestamp('completed_at')
                ->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('help_request_assignments');
    }
};
