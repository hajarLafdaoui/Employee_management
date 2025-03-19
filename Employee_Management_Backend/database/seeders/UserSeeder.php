<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin user
        User::create([
            'name' => 'Hajar',
            'email' => 'hajar@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'department_id' => 1,
            'job_id' => 1,
            'username' => 'hajar_admin',
            'phone' => '1234567890',
            'profile_picture' => null,
            'country' => 'Morocco',
            'is_active' => true,
            'is_deleted' => false,
        ]);

    }
}