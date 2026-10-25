<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_urgent')->default(false);
            $table->unsignedTinyInteger('urgency_priority')->default(2);
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn([
                'is_featured',
                'is_urgent',
                'urgency_priority',
            ]);
        });
    }
};
