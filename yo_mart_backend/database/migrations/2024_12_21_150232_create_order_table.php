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
        Schema::create('order', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customer', 'id');
            $table->foreignId('user_id')->constrained('users', 'id');
            $table->string('order_num')->unique();
            $table->decimal('paid_amount', 7, 2)->default(0.00);
            $table->string('payment_method', 125);
            $table->text('remark')->nullable();
            $table->string('create_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
