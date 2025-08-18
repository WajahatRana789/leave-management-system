<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LeaveRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all leave types
        $leaveTypes = LeaveType::all();

        // Get all users except super admins
        $users = User::where('role', '!=', 'super_admin')->get();

        // Current year for date generation
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        // Generate leave requests for each user
        foreach ($users as $user) {
            // Generate 2-5 random leave requests per user
            $leaveCount = rand(2, 5);

            for ($i = 0; $i < $leaveCount; $i++) {
                $leaveType = $leaveTypes->random();
                $status = $this->getRandomStatus($user);

                // Generate random request creation date (spread over last 12 months)
                $createdAt = Carbon::now()
                    ->subMonths(rand(0, 11))
                    ->subDays(rand(0, 30))
                    ->subHours(rand(0, 23))
                    ->subMinutes(rand(0, 59));

                // Generate random leave dates (can be future dates for pending requests)
                $startDate = (clone $createdAt)
                    ->addDays(rand(0, 60)) // Leave starts 0-60 days after request
                    ->startOfDay();

                // Ensure start date is within current year
                if ($startDate->year != $currentYear) {
                    $startDate = Carbon::create($currentYear, rand(1, $currentMonth), rand(1, 28))->startOfDay();
                }

                $endDate = (clone $startDate)->addDays(rand(1, 5));
                $totalDays = $startDate->diffInDays($endDate) + 1;

                // For approved leaves, ensure they don't extend into future
                if ($status === 'approved' && $endDate->gt(Carbon::now())) {
                    $endDate = Carbon::now()->subDays(rand(1, 5));
                    $startDate = (clone $endDate)->subDays(rand(1, 5));
                    $totalDays = $startDate->diffInDays($endDate) + 1;
                }

                // Set reviewed_at date if not pending (1-7 days after creation)
                $reviewedAt = null;
                if ($status !== 'pending') {
                    $reviewedAt = (clone $createdAt)
                        ->addDays(rand(1, 7))
                        ->addHours(rand(0, 23))
                        ->addMinutes(rand(0, 59));
                }

                // Create the leave request
                LeaveRequest::create([
                    'user_id' => $user->id,
                    'leave_type_id' => $leaveType->id,
                    'from_date' => $startDate,
                    'to_date' => $endDate,
                    'total_days' => $totalDays,
                    'reason' => $this->getRandomReason(),
                    'status' => $status,
                    'reviewed_by' => $status !== 'pending' ? $this->getReviewerId($user) : null,
                    'reviewed_at' => $reviewedAt,
                    'remarks' => $status !== 'pending' ? $this->getRandomRemarks($status) : null,
                    'created_at' => $createdAt,
                    'updated_at' => $status !== 'pending' ? $reviewedAt : $createdAt,
                ]);
            }
        }
    }

    /**
     * Get random status for leave request
     */
    private function getRandomStatus(User $user): string
    {
        // Shift incharges have higher chance of approved/rejected status
        if ($user->role === 'shift_incharge') {
            return ['approved', 'rejected', 'pending'][rand(0, 2)];
        }

        // Employees have more pending requests
        $random = rand(1, 10);
        if ($random <= 2) {
            return 'approved';
        } elseif ($random <= 4) {
            return 'rejected';
        } else {
            return 'pending';
        }
    }

    /**
     * Get random reason for leave
     */
    private function getRandomReason(): string
    {
        $reasons = [
            'Family emergency',
            'Medical appointment',
            'Personal health issues',
            'Family function',
            'Wedding ceremony',
            'Vacation',
            'Mental health break',
            'Childcare needs',
            'Home repair emergency',
            'Religious observance',
        ];

        return $reasons[array_rand($reasons)];
    }

    /**
     * Get random remarks based on status
     */
    private function getRandomRemarks(string $status): string
    {
        if ($status === 'approved') {
            $remarks = [
                'Request approved as per policy',
                'Approved for personal reasons',
                'Granted based on available leave balance',
                'Approved for medical reasons',
                'Leave granted as requested',
            ];
        } else {
            $remarks = [
                'Insufficient leave balance',
                'Request doesn\'t comply with policy',
                'Peak work period - cannot approve',
                'Reason not sufficient for approval',
                'Team has critical deliverables during this period',
            ];
        }

        return $remarks[array_rand($remarks)];
    }

    /**
     * Get reviewer ID (shift incharge or admin)
     */
    private function getReviewerId(User $user): ?int
    {
        // If user is in a shift, get shift incharge
        if ($user->shift_id) {
            $shiftIncharge = User::where('shift_id', $user->shift_id)
                ->where('role', 'shift_incharge')
                ->first();

            if ($shiftIncharge) {
                return $shiftIncharge->id;
            }
        }

        // Fallback to random admin
        $admin = User::where('role', 'admin')->inRandomOrder()->first();
        return $admin ? $admin->id : null;
    }
}
