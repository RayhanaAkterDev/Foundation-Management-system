<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_request_evidence_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('help_request_id')
                ->constrained('help_requests')
                ->cascadeOnDelete();

            $table->foreignId('requested_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('message');

            $table->string('status')->default('pending');

            $table->timestamp('submitted_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('help_request_evidence_requests');
    }
};
