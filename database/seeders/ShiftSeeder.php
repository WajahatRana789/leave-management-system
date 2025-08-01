<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Shift::insert([
            ['name' => 'Morning', 'manager_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Evening', 'manager_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Night', 'manager_id' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
