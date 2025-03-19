<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['employee', 'admin', 'sub-admin'])->default('employee'); 
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('cascade');  // Made nullable
            $table->foreignId('job_id')->nullable()->constrained()->onDelete('cascade');  // Added job_id            $table->string('name'); 
            $table->string('email')->unique(); 
            $table->enum('gender', ['male', 'female'])->nullable(); // FIXED: Removed 'after email'
            $table->string('password'); 
            $table->string('username')->unique(); 
            $table->string('phone')->nullable();
            $table->string('profile_picture')->nullable(); 
            $table->string('nationality')->nullable(); // NEW
            $table->string('country')->nullable(); // NEW
            $table->boolean('is_active')->default(false); // FIXED: Used boolean instead of tinyint(1)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
