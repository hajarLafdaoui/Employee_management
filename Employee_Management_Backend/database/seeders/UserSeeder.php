<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all departments and map them by name
        $departments = DB::table('departments')->pluck('id', 'name')->toArray();

        // Users to be inserted
        $users = [
            [
                'department_name' => 'IT Department',
                'role' => 'employee',
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'password' => 'password',  // Plain text password for testing
                'username' => 'john.doe',
                'phone' => '1234567890',
                'profile_picture' => null,
            ],
            [
                'department_name' => 'HR Department',
                'role' => 'admin',
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => 'password',  // Plain text password for testing
                'username' => 'jane.smith',
                'phone' => '0987654321',
                'profile_picture' => null,
            ],
            [
                'department_name' => 'IT Department',
                'role' => 'employee',
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com',
                'password' => 'password',  // Plain text password for testing
                'username' => 'alice.johnson',
                'phone' => '1122334455',
                'profile_picture' => null,
            ],
            [
                'department_name' => 'Finance Department',
                'role' => 'employee',
                'name' => 'Bob Lee',
                'email' => 'bob.lee@example.com',
                'password' => 'password',  // Plain text password for testing
                'username' => 'bob.lee',
                'phone' => '2233445566',
                'profile_picture' => null,
            ],
            [
                'department_name' => 'HR Department',
                'role' => 'employee',
                'name' => 'Sarah Williams',
                'email' => 'sarah.williams@example.com',
                'password' => 'password',  // Plain text password for testing
                'username' => 'sarah.williams',
                'phone' => '3344556677',
                'profile_picture' => null,
            ],
            [
                'department_name' => 'Finance Department',
                'role' => 'employee',
                'name' => 'David Miller',
                'email' => 'david.miller@example.com',
                'password' => 'password',  // Plain text password for testing
                'username' => 'david.miller',
                'phone' => '4455667788',
                'profile_picture' => null,
            ],
        ];

        // Insert users with correct department IDs
        foreach ($users as $user) {
            $departmentId = $departments[$user['department_name']] ?? null;

            if ($departmentId) {
                DB::table('users')->insert([
                    'department_id' => $departmentId,
                    'role' => $user['role'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'password' => bcrypt($user['password']), // Hashing the password for security
                    'username' => $user['username'],
                    'phone' => $user['phone'],
                    'profile_picture' => $user['profile_picture'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
