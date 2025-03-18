<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Hajar',
            'email' => 'hajar@example.com',
            'password' => Hash::make('password123'), // Hash the password
            'role' => 'admin', // Assuming 'admin' is a valid role in your system
            'department_id' => 1, // Set to null or a valid department ID
            'job_id' => 1, // Set to null or a valid job ID
            'username' => 'hajar_admin',
            'phone' => '1234567890',
            'profile_picture' => null, // Set to null or a valid image path
            'country' => 'Morocco',
            'is_active' => true,
            'is_deleted' => false,
        ]);
    }
}
