<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['employee', 'admin'])->default('employee'); 
            $table->foreignId('department_id')->constrained()->onDelete('cascade'); 
            $table->string('name'); 
            $table->string('email')->unique(); 
            $table->string('password'); 
            $table->string('username')->unique(); 
            $table->string('phone')->nullable();
            $table->string('profile_picture')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
