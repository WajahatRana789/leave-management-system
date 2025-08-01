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

        // Employees assigned to different shifts
        $employees = [
            ['name' => 'Employee A', 'email' => 'employee.a@example.com', 'shift_id' => 1],
            ['name' => 'Employee B', 'email' => 'employee.b@example.com', 'shift_id' => 2],
            ['name' => 'Employee C', 'email' => 'employee.c@example.com', 'shift_id' => 3],
        ];

        foreach ($employees as $emp) {
            User::create([
                'name' => $emp['name'],
                'email' => $emp['email'],
                'role' => 'employee',
                'shift_id' => $emp['shift_id'],
                'password' => bcrypt('password')
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
