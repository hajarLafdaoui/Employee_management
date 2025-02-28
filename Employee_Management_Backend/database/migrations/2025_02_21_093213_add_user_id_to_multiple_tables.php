<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserIdToMultipleTables extends Migration
{
    public function up(): void
    {
        // Adding user_id to salaries table
        Schema::table('salaries', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        });

        // Adding user_id to leave_request table
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        });

        // Adding user_id to attestation table
        Schema::table('attestations', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        });

        // Adding user_id to attendance table
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Dropping user_id from salaries table
        Schema::table('salaries', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        // Dropping user_id from leave_request table
        Schema::table('leave_request', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        // Dropping user_id from attestation table
        Schema::table('attestation', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        // Dropping user_id from attendance table
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
}
