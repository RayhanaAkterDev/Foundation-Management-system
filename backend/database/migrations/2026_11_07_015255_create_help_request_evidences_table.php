<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_request_evidences', function (Blueprint $table) {
            $table->id();

            $table->foreignId('help_request_id')
                ->constrained('help_requests')
                ->cascadeOnDelete();

            $table->foreignId('uploaded_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('evidence_request_id')
                ->nullable()
                ->constrained('help_request_evidence_requests')
                ->nullOnDelete();

            $table->string('source')->default('original');

            $table->string('file_name');
            $table->string('file_id')->unique();
            $table->string('file_path');
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('help_request_evidences');
    }
};
