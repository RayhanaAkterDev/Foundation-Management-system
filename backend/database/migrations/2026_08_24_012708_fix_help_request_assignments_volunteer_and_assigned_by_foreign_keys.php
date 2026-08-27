<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // The volunteer_id and assigned_by foreign key constraints
        // already exist in the current database schema.
    }

    public function down(): void
    {
        // Nothing to reverse.
    }
};
