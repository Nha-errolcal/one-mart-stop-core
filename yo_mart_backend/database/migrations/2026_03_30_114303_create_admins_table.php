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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();

            // Basic Info
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();

            // Address (Cambodia structure)
            $table->string('province')->nullable();     // ខេត្ត/រាជធានី
            $table->string('district')->nullable();     // ខណ្ឌ/ស្រុក
            $table->string('village')->nullable();      // ភូមិ
            $table->string('street')->nullable();       // លេខផ្លូវ
            $table->string('house_no')->nullable();     // លេខផ្ទះ
            $table->text('address_note')->nullable();   // ផ្សារ, supermarket, etc.

            // Business / Organization
            $table->string('branch')->nullable();       // សាខា
            $table->string('company_name')->nullable(); //

            $table->string('logo')->nullable();         // uploads/logos/xxx.png
            $table->boolean('status')->default(true);   // true = active, false = inactive

            $table->foreignId('created_by')->nullable()->constrained('admins')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('admins')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
