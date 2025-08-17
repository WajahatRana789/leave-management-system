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
            ['name' => 'Morning', 'shift_incharge_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Evening', 'shift_incharge_id' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
