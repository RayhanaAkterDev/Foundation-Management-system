<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->text('about')->nullable()->after('description');
            $table->json('support_types')->nullable()->after('about');
            $table->text('image')->nullable()->after('support_types');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn([
                'about',
                'support_types',
                'image',
            ]);
        });
    }
};
