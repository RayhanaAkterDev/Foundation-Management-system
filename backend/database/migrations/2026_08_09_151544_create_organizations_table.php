<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();

            // The user account that owns this organization
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('organization_type')->nullable();

            $table->string('registration_number')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();

            $table->text('address')->nullable();
            $table->text('mission')->nullable();

            $table->text('focus_areas')->nullable();
            $table->text('communities_served')->nullable();

            $table->unsignedInteger('team_size')->nullable();

            $table->text('primary_activities')->nullable();

            $table->string('logo')->nullable();

            // Organization verification
            $table->string('verification_status')
                ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
