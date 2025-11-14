<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('namecards', function (Blueprint $table) {
            $table->id();
            $table->string('office_number', 255)->nullable();
            $table->string('mobile_number', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('name', 255)->nullable();
            $table->string('position', 255)->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('comps')->onDelete('set null');
            $table->string('image', 255)->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps(); // created_at, updated_at
            $table->string('create_user', 255)->nullable();
            $table->string('update_user', 255)->nullable();
            $table->string('linkedin_personal', 255)->nullable();
            $table->string('first_name', 255)->nullable();
            $table->string('last_name', 255)->nullable();
            $table->string('vcard', 255)->nullable();
            $table->string('certification', 255)->nullable();
            $table->string('uid', 255)->nullable();
            $table->integer('department_id')->nullable();
            $table->string('misc', 255)->nullable();
            $table->string('name_right', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('namecards');
    }
};
