<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::insert([
            ['name' => 'IT Department', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'HR Department', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Finance Department', 'created_at' => now(), 'updated_at' => now()],

        ]);
    }
}
