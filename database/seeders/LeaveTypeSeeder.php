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
            ['name' => 'Casual Leave', 'default_days' => 8, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sick Leave', 'default_days' => 8, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
