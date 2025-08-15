<?php

namespace Database\Seeders;

use App\Models\Designation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $designations = [
            ['title' => 'CDI', 'short_code' => 'CDI'],
            ['title' => 'Shift Incharge', 'short_code' => 'SI'],
            ['title' => 'Sr. Journalist', 'short_code' => 'SJ'],
            ['title' => 'Sr. Sub-Editor/Reporter', 'short_code' => 'SSE'],
            ['title' => 'Sub-Editor/Reporter', 'short_code' => 'SE'],
            ['title' => 'Editorial Assistant', 'short_code' => 'EA'],
        ];

        foreach ($designations as $designation) {
            Designation::create($designation);
        }
    }
}
