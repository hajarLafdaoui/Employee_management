<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        DB::table('departments')->insert([
            [
                'name' => 'HR',
                'logo' => 'departments/hr.png',
                'description' => 'Handles employee relations and HR operations',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'IT',
                'logo' => 'departments/it.png',
                'description' => 'Manages technology infrastructure and IT support',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Marketing',
                'logo' => 'departments/marketing.png',
                'description' => 'Oversees brand campaigns and promotions',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Sales',
                'logo' => 'departments/sales.png',
                'description' => 'Handles client acquisition and deals',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Finance',
                'logo' => 'departments/finance.png',
                'description' => 'Manages budgeting and accounting',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}