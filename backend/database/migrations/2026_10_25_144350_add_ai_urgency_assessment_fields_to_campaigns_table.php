
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('ai_urgency', 20)->nullable();
            $table->unsignedTinyInteger('ai_urgency_priority')->nullable();
            $table->text('ai_urgency_reason')->nullable();
            $table->timestamp('ai_urgency_assessed_at')->nullable();
            $table->timestamp('ai_urgency_reviewed_at')->nullable();
            $table->foreignId('ai_urgency_reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ai_urgency_reviewed_by');

            $table->dropColumn([
                'ai_urgency',
                'ai_urgency_priority',
                'ai_urgency_reason',
                'ai_urgency_assessed_at',
                'ai_urgency_reviewed_at',
            ]);
        });
    }
};
