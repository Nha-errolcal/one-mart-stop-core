<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->foreignId('category_id')
                ->constrained('category')
                ->nullOnDelete();

            $table->integer('qty')->default(0);

            $table->string('image')->nullable();

            $table->decimal('product_in', 10, 2)->default(0);
            $table->decimal('product_out', 10, 2)->default(0);

            $table->text('description')->nullable();

            // % discount
            $table->decimal('discount', 5, 2)->default(0);

            $table->string('create_by')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
