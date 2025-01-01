<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Disable foreign key checks to allow truncating the table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear the users table before seeding
        DB::table('users')->truncate();

        // Enable foreign key checks back
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Fetching department IDs to associate with users
        $departments = DB::table('departments')->pluck('id');

        // Seeding user data with associated department_id and additional fields
        DB::table('users')->insert([
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
                'username' => 'johndoe',
                'phone' => '123-456-7890',
                'profile_picture' => asset('uploads/profile1.jpg'),
                'job_title' => 'Software Engineer',
                'company' => 'Tech Solutions',
                'department' => 'IT',
                'status' => 'active',
                'last_login' => Carbon::now()->subDays(1),
                'department_id' => $departments->random(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'username' => 'janesmith',
                'phone' => '987-654-3210',
                'profile_picture' => asset('uploads/profile2.jpg'),
                'job_title' => 'HR Manager',
                'company' => 'Business Corp',
                'department' => 'Human Resources',
                'status' => 'active',
                'last_login' => Carbon::now()->subDays(2),
                'department_id' => $departments->random(),
            ],
            [
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
                'username' => 'alicejohnson',
                'phone' => '555-123-4567',
                'profile_picture' => asset('uploads/profile3.jpg'),
                'job_title' => 'Marketing Specialist',
                'company' => 'Ad Ventures',
                'department' => 'Marketing',
                'status' => 'inactive',
                'last_login' => Carbon::now()->subDays(3),
                'department_id' => $departments->random(),
            ],
            [
                'name' => 'Bob Brown',
                'email' => 'bob.brown@example.com',
                'role' => 'admin',
                'password' => Hash::make('password123'),
                'username' => 'bobbrown',
                'phone' => '333-444-5555',
                'profile_picture' => asset('uploads/profile4.jpg'),
                'job_title' => 'Sales Director',
                'company' => 'Global Sales Inc.',
                'department' => 'Sales',
                'status' => 'active',
                'last_login' => Carbon::now()->subDays(5),
                'department_id' => $departments->random(),
            ],
        ]);
    }
}
