<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteers', function (Blueprint $table) {
            $table->id();

            // Volunteer is always connected to a user account
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Optional: volunteer may belong to an organization
            $table->foreignId('organization_id')
                ->nullable()
                ->constrained('organizations')
                ->nullOnDelete();

            $table->string('phone')->nullable();

            $table->string('district')->nullable();

            $table->text('address')->nullable();

            $table->text('skills')->nullable();

            $table->text('availability')->nullable();

            // pending, approved, inactive
            $table->string('status')
                ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};
