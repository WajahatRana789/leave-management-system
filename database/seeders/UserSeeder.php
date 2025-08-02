<?php

namespace Database\Seeders;

use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Managers for each shift (assuming 3 shifts already seeded)
        $managers = [
            ['name' => 'Manager Morning', 'email' => 'morning.manager@example.com', 'role' => 'manager'],
            ['name' => 'Manager Evening', 'email' => 'evening.manager@example.com', 'role' => 'manager'],
            ['name' => 'Manager Night', 'email' => 'night.manager@example.com', 'role' => 'manager'],
        ];

        foreach ($managers as $i => $manager) {
            $user = User::create([
                'name' => $manager['name'],
                'email' => $manager['email'],
                'role' => $manager['role'],
                'password' => bcrypt('password')
            ]);

            // Assign manager to shift (assuming shift IDs start from 1)
            Shift::where('id', $i + 1)->update(['manager_id' => $user->id]);
        }

        // Generate 100 employees distributed over 3 shifts

        for ($i = 1; $i <= 100; $i++) {
            $shiftId = (($i - 1) % 3) + 1; // Cycle through shift_id 1, 2, 3

            User::create([
                'name' => "Employee $i",
                'email' => "employee$i@example.com",
                'role' => 'employee',
                'shift_id' => $shiftId,
                'password' => bcrypt('password'),
            ]);
        }


        // Admin
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => bcrypt('password')
        ]);
    }
}
