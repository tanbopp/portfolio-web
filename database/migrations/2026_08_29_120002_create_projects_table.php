<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('work_for')->nullable();
            $table->string('year')->nullable();
            $table->json('deliverables')->nullable();
            $table->string('platform')->nullable();
            $table->json('technologies')->nullable();
            $table->json('actions')->nullable();
            $table->text('showcase')->nullable();
            $table->text('article')->nullable();
            $table->string('hero_image')->nullable();
            $table->boolean('published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
