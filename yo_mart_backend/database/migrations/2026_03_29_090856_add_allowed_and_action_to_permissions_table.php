<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            if (!Schema::hasColumn('permissions', 'action')) {
                $table->string('action', 50)->nullable()->after('code'); // e.g., view, edit, delete
            }

            if (!Schema::hasColumn('permissions', 'allowed')) {
                $table->boolean('allowed')->default(false)->after('action');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            if (Schema::hasColumn('permissions', 'action')) {
                $table->dropColumn('action');
            }
            if (Schema::hasColumn('permissions', 'allowed')) {
                $table->dropColumn('allowed');
            }
        });
    }
};
