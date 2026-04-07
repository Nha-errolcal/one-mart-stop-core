<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->string('store_no')->unique()->nullable()->after('company_name');
        });
    }

    public function down(): void
    {
        Schema::table('admins', function (Blueprint $table) {
            $table->dropUnique(['store_no']); // drop unique first
            $table->dropColumn('store_no');   // then drop column
        });
    }
};
