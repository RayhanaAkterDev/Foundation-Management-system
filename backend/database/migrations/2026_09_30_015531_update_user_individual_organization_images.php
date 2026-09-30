<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        |
        | Every SP account can have one common identity image.
        |
        | Individual/admin:
        |     photo = profile photo
        |
        | Organization:
        |     photo = organization logo/avatar
        |
        */

        if (!Schema::hasColumn('users', 'photo')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('photo')->nullable()->after('phone');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | PRESERVE EXISTING INDIVIDUAL PROFILE PHOTOS
        |--------------------------------------------------------------------------
        |
        | If individuals.profile_photo currently contains a path,
        | move it to users.photo before removing the old column.
        |
        | We only copy when users.photo is empty so an existing
        | users.photo value is never overwritten.
        |
        */

        if (
            Schema::hasTable('individuals') &&
            Schema::hasColumn('individuals', 'profile_photo')
        ) {
            DB::statement(
                "
                UPDATE users
                SET photo = individuals.profile_photo
                FROM individuals
                WHERE users.id = individuals.user_id
                  AND users.photo IS NULL
                  AND individuals.profile_photo IS NOT NULL
                "
            );

            Schema::table('individuals', function (Blueprint $table) {
                $table->dropColumn('profile_photo');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | ORGANIZATIONS
        |--------------------------------------------------------------------------
        |
        | organizations.logo is being replaced by users.photo.
        |
        | Existing organization logos are preserved by copying them
        | into users.photo where that user does not already have a photo.
        |
        */

        if (
            Schema::hasTable('organizations') &&
            Schema::hasColumn('organizations', 'logo')
        ) {
            DB::statement(
                "
                UPDATE users
                SET photo = organizations.logo
                FROM organizations
                WHERE users.id = organizations.user_id
                  AND users.photo IS NULL
                  AND organizations.logo IS NOT NULL
                "
            );

            Schema::table('organizations', function (Blueprint $table) {
                $table->dropColumn('logo');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | ORGANIZATION BANNER
        |--------------------------------------------------------------------------
        |
        | This is separate from users.photo.
        |
        | users.photo:
        |     organization logo/avatar
        |
        | organizations.org_banner:
        |     wide organization banner
        |
        */

        if (!Schema::hasColumn('organizations', 'org_banner')) {
            Schema::table('organizations', function (Blueprint $table) {
                $table->string('org_banner')->nullable()->after('user_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Restore organizations.logo
        |--------------------------------------------------------------------------
        */

        if (
            Schema::hasTable('organizations') &&
            !Schema::hasColumn('organizations', 'logo')
        ) {
            Schema::table('organizations', function (Blueprint $table) {
                $table->string('logo')->nullable()->after('primary_activities');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Restore individuals.profile_photo
        |--------------------------------------------------------------------------
        */

        if (
            Schema::hasTable('individuals') &&
            !Schema::hasColumn('individuals', 'profile_photo')
        ) {
            Schema::table('individuals', function (Blueprint $table) {
                $table->string('profile_photo')->nullable();
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Restore old image values where possible
        |--------------------------------------------------------------------------
        */

        if (
            Schema::hasTable('individuals') &&
            Schema::hasColumn('individuals', 'profile_photo')
        ) {
            DB::statement(
                "
                UPDATE individuals
                SET profile_photo = users.photo
                FROM users
                WHERE individuals.user_id = users.id
                  AND individuals.profile_photo IS NULL
                  AND users.photo IS NOT NULL
                "
            );
        }

        if (
            Schema::hasTable('organizations') &&
            Schema::hasColumn('organizations', 'logo')
        ) {
            DB::statement(
                "
                UPDATE organizations
                SET logo = users.photo
                FROM users
                WHERE organizations.user_id = users.id
                  AND organizations.logo IS NULL
                  AND users.photo IS NOT NULL
                "
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Remove org_banner
        |--------------------------------------------------------------------------
        */

        if (
            Schema::hasTable('organizations') &&
            Schema::hasColumn('organizations', 'org_banner')
        ) {
            Schema::table('organizations', function (Blueprint $table) {
                $table->dropColumn('org_banner');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Remove users.photo
        |--------------------------------------------------------------------------
        */

        if (
            Schema::hasTable('users') &&
            Schema::hasColumn('users', 'photo')
        ) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('photo');
            });
        }
    }
};
