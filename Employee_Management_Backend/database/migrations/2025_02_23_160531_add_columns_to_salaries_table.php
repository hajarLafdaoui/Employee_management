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
        Schema::table('salaries', function (Blueprint $table) {
            $table->integer('attendances')->default(0)->after('end_date');  // Add attendances column
            $table->integer('leaves')->default(0)->after('attendances');     // Add leaves column
            $table->decimal('attendance_bonus', 10, 2)->default(0)->after('leaves'); // Add attendance bonus column
            $table->decimal('leave_deduction', 10, 2)->default(0)->after('attendance_bonus'); // Add leave deduction column
            $table->decimal('tva_rate', 5, 2)->default(0)->after('leave_deduction'); // Add TVA rate column
            $table->decimal('tva_amount', 10, 2)->default(0)->after('tva_rate'); // Add TVA amount column
                });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salaries', function (Blueprint $table) {
            $table->dropColumn([
                'attendances',
                'leaves',
                'attendance_bonus',
                'leave_deduction',
                'tva_rate',
                'tva_amount',
            ]);
        });
    }
};
