<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Default profile picture path (for example purposes)
        $adminProfilePicture = 'storage/profile_pictures/gRKQT7kjtcgVYFvDyJ9NY3llObvmUbfZ6xKeSXC7.png'; // Ensure this path is correct

        // Data for users
        $users = [
            [
                'department_id' => 1,
                'role' => 'employee',
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'gender' => 'male',
                'password' => Hash::make('password'),
                'username' => 'john.doe',
                'phone' => '1234567890',
                'profile_picture' => null,
                'country' => 'USA',
                'is_active' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'is_deleted' => 0,
            ],
            [
                'department_id' => 2,
                'role' => 'admin',
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'gender' => 'female',
                'password' => Hash::make('password'),
                'username' => 'jane.smith',
                'phone' => '0987654321',
                'profile_picture' => $adminProfilePicture,
                'country' => 'UK',
                'is_active' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'is_deleted' => 0,
            ],
            [
                'department_id' => 3,
                'role' => 'employee',
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com',
                'gender' => 'female',
                'password' => Hash::make('password'),
                'username' => 'alice.johnson',
                'phone' => '1122334455',
                'profile_picture' => null,
                'country' => 'Australia',
                'is_active' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'is_deleted' => 0,
            ],
            [
                'department_id' => 4,
                'role' => 'employee',
                'name' => 'Bob Lee',
                'email' => 'bob.lee@example.com',
                'gender' => 'male',
                'password' => Hash::make('password'),
                'username' => 'bob.lee',
                'phone' => '2233445566',
                'profile_picture' => null,
                'country' => 'Canada',
                'is_active' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'is_deleted' => 0,
            ],
            [
                'department_id' => 3,
                'role' => 'employee',
                'name' => 'Sarah Williams',
                'email' => 'sarah.williams@example.com',
                'gender' => 'female',
                'password' => Hash::make('password'),
                'username' => 'sarah.williams',
                'phone' => '3344556677',
                'profile_picture' => null,
                'country' => 'Germany',
                'is_active' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'is_deleted' => 0,
            ],
            [
                'department_id' => 2,
                'role' => 'employee',
                'name' => 'David Miller',
                'email' => 'david.miller@example.com',
                'gender' => 'male',
                'password' => Hash::make('password'),
                'username' => 'david.miller',
                'phone' => '4455667788',
                'profile_picture' => null,
                'country' => 'France',
                'is_active' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
                'is_deleted' => 0,
            ],
        ];

        // Insert or update users ensuring unique email and username
        foreach ($users as $user) {
            DB::table('users')->updateOrInsert(
                ['email' => $user['email'], 'username' => $user['username']],
                $user
            );
        }
    }
}
