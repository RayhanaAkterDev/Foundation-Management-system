<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaign_volunteer_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('campaign_id')
                ->constrained('campaigns')
                ->onDelete('cascade');

            $table->foreignId('volunteer_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('assigned_by')
                ->constrained('users')
                ->onDelete('restrict');

            $table->string('status')->default('assigned');

            $table->text('assignment_note')->nullable();

            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_volunteer_assignments');
    }
};
