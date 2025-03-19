<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobSeeder extends Seeder
{
    public function run()
    {
        $jobs = [
            // HR Department (id: 1)
            [
                'name' => 'Recruiter',
                'description' => 'Talent acquisition specialist',
                'salary' => 50000.00,
                'department_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'HR-Manager',
                'description' => 'Oversee HR operations',
                'salary' => 75000.00,
                'department_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // IT Department (id: 2)
            [
                'name' => 'Developer',
                'description' => 'Software development',
                'salary' => 85000.00,
                'department_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'SysAdmin',
                'description' => 'System administration',
                'salary' => 65000.00,
                'department_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Marketing Department (id: 3)
            [
                'name' => 'Designer',
                'description' => 'Graphic design',
                'salary' => 55000.00,
                'department_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Analyst',
                'description' => 'Marketing analytics',
                'salary' => 60000.00,
                'department_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Sales Department (id: 4)
            [
                'name' => 'Executive',
                'description' => 'Sales operations',
                'salary' => 45000.00,
                'department_id' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Manager',
                'description' => 'Sales team lead',
                'salary' => 68000.00,
                'department_id' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],

            // Finance Department (id: 5)
            [
                'name' => 'Accountant',
                'description' => 'Financial reporting',
                'salary' => 62000.00,
                'department_id' => 5,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Auditor',
                'description' => 'Financial audits',
                'salary' => 58000.00,
                'department_id' => 5,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        DB::table('jobs')->insert($jobs);
    }
}