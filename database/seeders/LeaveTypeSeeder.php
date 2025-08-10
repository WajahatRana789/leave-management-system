<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LeaveType::insert([
            [
                'key' => 'casual_leave',
                'name' => 'Casual Leave',
                'default_days' => 20,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        LeaveType::insert([
            [
                'key' => 'lieu_leave',
                'name' => 'Lieu Leave',
                'default_days' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
