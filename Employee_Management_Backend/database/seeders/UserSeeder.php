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
            'name' => 'Olivia Lee',
            'email' => 'Olivia@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'department_id' => 1,
            'job_id' => 1,
            'username' => 'Olivia',
            'phone' => '1234567890',
            'profile_picture' => null,
            'country' => 'USA',
            'is_active' => true,
            'is_deleted' => false,
        ]);
    }
}
