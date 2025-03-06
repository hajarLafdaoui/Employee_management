<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;



class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('companies')->insert([
            [
                'name' => 'Workio',
                'address' => '123 Tech Street, City',
                'email' => 'contact@workio.com',
                'phone' => '123-456-7890',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
