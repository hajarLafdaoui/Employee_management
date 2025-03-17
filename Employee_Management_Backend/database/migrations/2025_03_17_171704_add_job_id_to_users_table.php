<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Add the job_id column as a foreign key
            $table->unsignedBigInteger('job_id')->nullable()->after('department_id');
            $table->foreign('job_id')->references('id')->on('jobs')->onDelete('set null');
        });
    }
    
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the foreign key constraint and the column
            $table->dropForeign(['job_id']);
            $table->dropColumn('job_id');
        });
    }
};
