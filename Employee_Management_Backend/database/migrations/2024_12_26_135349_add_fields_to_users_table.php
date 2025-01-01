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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('email');
            $table->string('phone')->nullable()->after('username');
            $table->string('profile_picture')->nullable()->after('phone');
            $table->string('job_title')->nullable()->after('profile_picture');
            $table->string('company')->nullable()->after('job_title');
            $table->string('department')->nullable()->after('company');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('role');
            $table->timestamp('last_login')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'phone',
                'profile_picture',
                'job_title',
                'company',
                'department',
                'status',
                'last_login'
            ]);
        });
    }
};
