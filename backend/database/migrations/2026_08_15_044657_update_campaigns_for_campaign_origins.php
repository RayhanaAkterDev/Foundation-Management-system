<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('type')
                ->default('global_situation')
                ->after('help_request_id');

            $table->foreignId('verified_by')
                ->nullable()
                ->after('created_by')
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('verified_at')
                ->nullable()
                ->after('verified_by');

            $table->text('verification_note')
                ->nullable()
                ->after('verified_at');

            $table->string('scope')
                ->nullable()
                ->after('district');

            $table->text('affected_areas')
                ->nullable()
                ->after('scope');

            $table->date('proposal_date')
                ->nullable()
                ->after('end_date');

            $table->dropColumn('source_type');
        });
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('source_type')
                ->default('direct')
                ->after('help_request_id');

            $table->dropForeign(['verified_by']);

            $table->dropColumn([
                'type',
                'verified_by',
                'verified_at',
                'verification_note',
                'scope',
                'affected_areas',
                'proposal_date',
            ]);
        });
    }
};
