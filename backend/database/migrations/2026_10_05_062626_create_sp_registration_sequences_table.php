<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_registration_numbers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('organization_id')
                ->constrained('organizations')
                ->cascadeOnDelete();

            $table->string('registration_number')->unique();

            $table->string('organization_type');

            $table->unsignedBigInteger('sequence_number');

            $table->unsignedSmallInteger('registration_year');

            $table->string('status')->default('active');

            $table->timestamp('issued_at');

            $table->timestamp('retired_at')->nullable();

            $table->timestamps();

            $table->index([
                'organization_id',
                'status',
            ]);

            $table->index('sequence_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_registration_numbers');
    }
};
