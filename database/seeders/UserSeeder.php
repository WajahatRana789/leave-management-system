<?php

namespace Database\Seeders;

use App\Models\Shift;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
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
            ['name' => 'Manager Morning', 'email' => 'morning.manager@example.com', 'role' => 'manager', 'shift_id' => 1],
            ['name' => 'Manager Evening', 'email' => 'evening.manager@example.com', 'role' => 'manager', 'shift_id' => 2],
            ['name' => 'Manager Night', 'email' => 'night.manager@example.com', 'role' => 'manager', 'shift_id' => 3],
        ];

        foreach ($managers as $i => $manager) {
            $user = User::create([
                'code' => 'MGR' . str_pad($i + 1, 3, '0', STR_PAD_LEFT), // Unique code for each manager
                'name' => $manager['name'],
                'email' => $manager['email'],
                'role' => $manager['role'],
                'password' => bcrypt('password')
            ]);

            // Assign manager to shift (assuming shift IDs start from 1)
            Shift::where('id', $i + 1)->update(['manager_id' => $user->id]);
        }

        // Generate 100 employees distributed over 3 shifts

        for ($i = 1; $i <= 10; $i++) {
            $shiftId = (($i - 1) % 3) + 1; // Cycle through shift_id 1, 2, 3

            User::create([
                'code' => 'EMP' . str_pad($i, 3, '0', STR_PAD_LEFT), // Unique code for each employee
                'name' => "Employee $i",
                'email' => "employee$i@example.com",
                'role' => 'employee',
                'shift_id' => $shiftId,
                'password' => bcrypt('password'),
            ]);
        }


        // Admin
        User::create([
            'code' => 'ADMIN001',
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => bcrypt('password')
        ]);


        // Insert leave requests for morning shift users (shift_id = 1)
        $morningShiftUsers = User::where('shift_id', 1)->get();

        foreach ($morningShiftUsers as $user) {
            // Random start day between today and 25th of this month
            $startDate = Carbon::now()->startOfMonth()->addDays(rand(0, 25));

            // Random leave duration: 1 to 4 days
            $duration = rand(1, 4);
            $endDate = (clone $startDate)->addDays($duration - 1);

            // Ensure leave stays within the same month
            if ($endDate->month !== $startDate->month) {
                $endDate = $startDate->copy()->endOfMonth();
                $duration = $startDate->diffInDays($endDate) + 1;
            }

            // $user->leaveRequests()->create([
            //     'user_id' => $user->id,
            //     'leave_type_id' => rand(1, 1),
            //     'from_date' => $startDate->toDateString(),
            //     'to_date' => $endDate->toDateString(),
            //     'total_days' => $duration,
            //     'reason' => '',
            //     'status' => Arr::random(['pending', 'approved', 'rejected']),
            // ]);
        }
    }
}
