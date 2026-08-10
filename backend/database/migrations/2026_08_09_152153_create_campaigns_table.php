<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();

            // Organization that owns/manages the campaign
            $table->foreignId('organization_id')
                ->nullable()
                ->constrained('organizations')
                ->nullOnDelete();

            // Optional: campaign created from a verified help request
            $table->foreignId('help_request_id')
                ->nullable()
                ->constrained('help_requests')
                ->nullOnDelete();

            $table->string('title');

            $table->text('description');

            $table->string('category');

            $table->string('district')->nullable();

            $table->text('location')->nullable();

            $table->decimal('target_amount', 12, 2)->nullable();

            $table->decimal('collected_amount', 12, 2)
                ->default(0);

            // draft, pending, active, completed, cancelled
            $table->string('status')
                ->default('draft');

            $table->date('start_date')->nullable();

            $table->date('end_date')->nullable();

            $table->string('cover_image')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
