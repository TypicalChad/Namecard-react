<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comps', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->text('aboutus')->nullable();
            $table->string('website')->nullable();
            $table->string('address')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->string('create_user')->nullable();
            $table->string('update_user')->nullable();
            $table->string('linkedin_company')->nullable();
            $table->string('services')->nullable();
            $table->string('cbm_link')->nullable();
            $table->string('coy_logo')->nullable();
            $table->string('coy_banner')->nullable();
            $table->string('coy_subsidiaries')->nullable();
            $table->string('coy_banner_link')->nullable();
            $table->string('product_image')->nullable();
            $table->string('product_link')->nullable();
            $table->string('product_title')->nullable();
            $table->string('coy_subsidiaries_link')->nullable();
            $table->string('longitude')->nullable();
            $table->string('altitude')->nullable();
            $table->text('map_link')->nullable();
            $table->string('background')->nullable();
            $table->string('misc')->nullable();
            $table->string('default_image')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comps');
    }
};
