<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('company_id')->nullable();
            $table->string('department', 255)->nullable();
            $table->string('acronym', 255)->nullable();
            $table->timestamps();
            $table->string('create_user', 255)->nullable();
            $table->string('update_user', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
