<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Fetch existing users to associate with attendance records
        $users = DB::table('users')->pluck('id');

        // Seeding attendance data for each user
        foreach ($users as $userId) {
            DB::table('attendances')->insert([
                [
                    'user_id' => $userId,
                    'attendance_date' => Carbon::today()->subDays(rand(0, 30)),
                    'status' => $this->randomStatus(),  // Use the new status column
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'user_id' => $userId,
                    'attendance_date' => Carbon::today()->subDays(rand(0, 30)),
                    'status' => $this->randomStatus(),  // Use the new status column
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }

    /**
     * Get a random status for attendance.
     *
     * @return string
     */
    private function randomStatus()
    {
        $statuses = ['present', 'absent', 'late', 'excused'];
        return $statuses[array_rand($statuses)];
    }
}
