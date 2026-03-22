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
        Schema::create('attend_file', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id'); // link to product
            $table->string('filename'); // original file name
            $table->string('file_path'); // stored file path
            $table->bigInteger('length')->nullable(); // file size in bytes
            $table->integer('chunkSize')->nullable(); // optional chunk size
            $table->string('contentType');
            $table->timestamp('uploadDate')->useCurrent(); // upload timestamp
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attend_file');
    }
};
