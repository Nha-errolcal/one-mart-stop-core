<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('permission_role', function (Blueprint $table) {
            // Only add 'action' if it doesn't exist
            if (!Schema::hasColumn('permission_role', 'action')) {
                $table->string('action', 20)->nullable()->after('permission_id');
            }

            // Only add 'allowed' if it doesn't exist
            if (!Schema::hasColumn('permission_role', 'allowed')) {
                $table->boolean('allowed')->default(false)->after('action');
            }
        });
    }

    public function down(): void
    {
        Schema::table('permission_role', function (Blueprint $table) {
            if (Schema::hasColumn('permission_role', 'action')) {
                $table->dropColumn('action');
            }
            if (Schema::hasColumn('permission_role', 'allowed')) {
                $table->dropColumn('allowed');
            }
        });
    }
};
