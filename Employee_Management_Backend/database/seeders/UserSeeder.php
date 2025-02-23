<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Insert only one admin user and a few employee users
        DB::table('users')->insert([
            [
                'name' => 'Alice Johnson',
                'email' => 'alicejohnson@example.com',
                'password' => Hash::make('aliceSecure789'), // Hashed password
                'role' => 'admin',
                'department_id' => 1,
                'username' => 'alicejohnson',
                'phone' => '5556667777',
                'profile_picture' => null,
                'nationality' => 'British',
                'country' => 'UK',
                'is_active' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'John Doe',
                'email' => 'johndoe@example.com',
                'password' => Hash::make('password123'),
                'role' => 'employee',
                'department_id' => 1,
                'username' => 'johndoe',
                'phone' => '1234567890',
                'profile_picture' => null,
                'nationality' => 'American',
                'country' => 'USA',
                'is_active' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'janesmith@example.com',
                'password' => Hash::make('securePass456'),
                'role' => 'employee',
                'department_id' => 1,
                'username' => 'janesmith',
                'phone' => '9876543210',
                'profile_picture' => null,
                'nationality' => 'Canadian',
                'country' => 'Canada',
                'is_active' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Robert Brown',
                'email' => 'robertbrown@example.com',
                'password' => Hash::make('robertPass321'),
                'role' => 'employee',
                'department_id' => 1,
                'username' => 'robertbrown',
                'phone' => '4445556666',
                'profile_picture' => null,
                'nationality' => 'Australian',
                'country' => 'Australia',
                'is_active' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
