<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_requests', function (Blueprint $table) {
            $table->id();

            // Individual who submitted the request
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('title');

            $table->text('description');

            $table->string('category');

            $table->string('district');

            $table->text('address')->nullable();

            $table->string('urgency')
                ->default('normal');

            // pending, verified, rejected, in_progress, completed
            $table->string('status')
                ->default('pending');

            $table->text('verification_note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('help_requests');
    }
};
