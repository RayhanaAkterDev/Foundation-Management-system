<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('help_request_duplicate_matches', function (Blueprint $table) {
            $table->id();

            $table->foreignId('help_request_id')
                ->constrained('help_requests')
                ->cascadeOnDelete();

            $table->foreignId('matched_help_request_id')
                ->constrained('help_requests')
                ->cascadeOnDelete();

            $table->decimal('similarity_score', 5, 2);

            $table->json('match_reasons');

            $table->string('analysis_status', 20)->default('completed');

            $table->timestamps();

            $table->unique(
                ['help_request_id', 'matched_help_request_id'],
                'hr_duplicate_match_unique'
            );

            $table->index(
                ['help_request_id', 'similarity_score'],
                'hr_duplicate_score_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('help_request_duplicate_matches');
    }
};
