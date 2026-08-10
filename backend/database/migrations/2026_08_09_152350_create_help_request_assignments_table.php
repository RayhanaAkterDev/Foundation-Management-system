<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_request_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('help_request_id')
                ->constrained('help_requests')
                ->cascadeOnDelete();

            // Organization assigned to handle the request
            $table->foreignId('organization_id')
                ->nullable()
                ->constrained('organizations')
                ->nullOnDelete();

            // Individual volunteer assigned to help
            $table->foreignId('volunteer_id')
                ->nullable()
                ->constrained('volunteers')
                ->nullOnDelete();

            // pending, accepted, rejected, in_progress, completed
            $table->string('status')
                ->default('pending');

            $table->text('assignment_note')->nullable();

            $table->timestamp('assigned_at')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('help_request_assignments');
    }
};
