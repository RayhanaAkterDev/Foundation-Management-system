
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sp_registration_sequences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('next_number')->default(1);
            $table->timestamps();
        });

        DB::table('sp_registration_sequences')->insert([
            'id' => 1,
            'next_number' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('sp_registration_sequences');
    }
};
