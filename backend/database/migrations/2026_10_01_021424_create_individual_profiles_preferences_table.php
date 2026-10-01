<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('individual_profiles', function (Blueprint $table) {
            $table->dropColumn('profile_photo');

            $table->json('participation_preferences')
                ->nullable()
                ->after('date_of_birth');

            $table->json('category_preferences')
                ->nullable()
                ->after('participation_preferences');
        });
    }

    public function down(): void
    {
        Schema::table('individual_profiles', function (Blueprint $table) {
            $table->string('profile_photo')
                ->nullable()
                ->after('date_of_birth');

            $table->dropColumn([
                'participation_preferences',
                'category_preferences',
            ]);
        });
    }
};
