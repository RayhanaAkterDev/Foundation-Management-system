<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);

            $table->unsignedBigInteger('user_id')
                ->nullable()
                ->change();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            $table->string('donor_name')
                ->nullable()
                ->after('user_id');

            $table->string('donor_email')
                ->nullable()
                ->after('donor_name');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropForeign(['user_id']);

            $table->unsignedBigInteger('user_id')
                ->nullable(false)
                ->change();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->dropColumn([
                'donor_name',
                'donor_email',
            ]);
        });
    }
};
