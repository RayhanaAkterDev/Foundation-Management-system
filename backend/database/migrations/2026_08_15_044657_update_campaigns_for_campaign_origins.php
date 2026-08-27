<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // The campaigns.type column already exists
        // in the existing database schema.
    }

    public function down(): void
    {
        // Nothing to reverse.
    }
};
