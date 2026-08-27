<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // assigned_by already exists in the original table migration.
    }

    public function down(): void
    {
        // Nothing to reverse.
    }
};
