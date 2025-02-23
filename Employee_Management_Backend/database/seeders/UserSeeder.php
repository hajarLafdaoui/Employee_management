<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all departments and map them by name
        // Example: $departments = DB::table('departments')->pluck('id', 'name')->toArray();

        $adminProfilePicture = 'storage/profile_pictures/gRKQT7kjtcgVYFvDyJ9NY3llObvmUbfZ6xKeSXC7.png'; // Ensure this path is correct

        // Users to be inserted
        $users = [
            [
                'department_id' => 1,
                'role' => 'employee',
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password'), // Encrypted password
                'username' => 'john.doe',
                'phone' => '1234567890',
                'profile_picture' => null,
                'base_salary' => 50000,
                'is_deleted' => 0,
            ],
            [
                'department_id' => 2,
                'role' => 'admin',
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password'), // Encrypted password
                'username' => 'jane.smith',
                'phone' => '0987654321',
                'profile_picture' => $adminProfilePicture,
                'base_salary' => 70000,
                'is_deleted' => 0,
            ],
            [
                'department_id' => 3,
                'role' => 'employee',
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com',
                'password' => Hash::make('password'),
                'username' => 'alice.johnson',
                'phone' => '1122334455',
                'profile_picture' => null,
                'base_salary' => 55000,
                'is_deleted' => 0,
            ],
            [
                'department_id' => 4,
                'role' => 'employee',
                'name' => 'Bob Lee',
                'email' => 'bob.lee@example.com',
                'password' => Hash::make('password'),
                'username' => 'bob.lee',
                'phone' => '2233445566',
                'profile_picture' => null,
                'base_salary' => 52000,
                'is_deleted' => 0,
            ],
            [
                'department_id' => 3,
                'role' => 'employee',
                'name' => 'Sarah Williams',
                'email' => 'sarah.williams@example.com',
                'password' => Hash::make('password'),
                'username' => 'sarah.williams',
                'phone' => '3344556677',
                'profile_picture' => null,
                'base_salary' => 58000,
                'is_deleted' => 0,
            ],
            [
                'department_id' => 2,
                'role' => 'employee',
                'name' => 'David Miller',
                'email' => 'david.miller@example.com',
                'password' => Hash::make('password'),
                'username' => 'david.miller',
                'phone' => '4455667788',
                'profile_picture' => null,
                'base_salary' => 59000,
                'is_deleted' => 0,
            ],
        ];

        // Insert users into the database
        DB::table('users')->insert($users);
    }
}
