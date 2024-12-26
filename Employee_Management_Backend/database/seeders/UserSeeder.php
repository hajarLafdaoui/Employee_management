<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

        // Seeding user data with associated department_id
        DB::table('users')->insert([
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'password' => Hash::make('password123'),
                'role' => 'employee', // Set this user as admin

                'department_id' => $departments->random(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin', // Set this user as admin
                'department_id' => $departments->random(),
            ],
            [
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com',
                'password' => Hash::make('password123'),
                'role' => 'employee', // Set this user as admin

                'department_id' => $departments->random(),
            ],
            [
                'name' => 'Bob Brown',
                'email' => 'bob.brown@example.com',
                'role' => 'admin', // Bob can still be an admin, if needed
                'password' => Hash::make('password123'),
                'department_id' => $departments->random(),
            ],
        ]);
    }
    }

