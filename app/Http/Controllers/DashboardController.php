<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function employeeDashboard(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today();
        $currentYear = $today->year;

        // Regular leave balance by type (excluding lieu_leave)
        $leaveTypes = LeaveType::where('key', '!=', 'lieu_leave')->get();
        $usedDays = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->whereYear('from_date', $currentYear)
            ->whereYear('to_date', $currentYear)
            ->select('leave_type_id', DB::raw('SUM(total_days) as used'))
            ->groupBy('leave_type_id')
            ->pluck('used', 'leave_type_id');

        $leaveBalances = $leaveTypes->map(function ($type) use ($usedDays) {
            $used = $usedDays[$type->id] ?? 0;
            return [
                'id' => $type->id,
                'name' => $type->name,
                'key' => $type->key,
                'default_days' => $type->default_days,
                'used_days' => $used,
                'remaining_days' => max(0, $type->default_days - $used),
            ];
        });

        // Calculate lieu_off balance separately
        $lieuOffBalance = [
            'available' => DB::table('lieu_offs')
                ->where('user_id', $user->id)
                ->where('status', 'available')
                ->where('expiry_date', '>=', $today)
                ->count(),
            'pending' => DB::table('lieu_offs')
                ->where('user_id', $user->id)
                ->where('status', 'pending_approval')
                ->count(),
            'expired' => DB::table('lieu_offs')
                ->where('user_id', $user->id)
                ->where('status', 'expired')
                ->count(),
            'used' => DB::table('lieu_offs')
                ->where('user_id', $user->id)
                ->where('status', 'used')
                ->count(),
        ];

        // Recent applications (current year only)
        $recentLeaves = LeaveRequest::with('leaveType')
            ->where('user_id', $user->id)
            ->whereYear('created_at', $currentYear)
            ->latest()
            ->take(5)
            ->get();

        // Team members on leave today (same shift)
        $teamOnLeaveToday = LeaveRequest::with('user', 'leaveType')
            ->whereDate('from_date', '<=', $today)
            ->whereDate('to_date', '>=', $today)
            ->whereHas('user', fn($q) => $q->where('shift_id', $user->shift_id)->where('id', '!=', $user->id))
            ->where('status', 'approved')
            ->get();

        // Shift and manager info
        $shift = Shift::with('manager')->find($user->shift_id);

        // Personal leaves for calendar
        $calendarLeaves = LeaveRequest::with('leaveType')
            ->where('user_id', $user->id)
            ->whereYear('from_date', $currentYear)
            ->whereYear('to_date', $currentYear)
            ->get();

        // Team leaves for calendar
        $teamCalendarLeaves = LeaveRequest::with(['user', 'leaveType'])
            ->whereHas('user', fn($q) => $q->where('shift_id', $user->shift_id)->where('id', '!=', $user->id))
            ->whereIn('status', ['approved', 'pending'])
            ->whereYear('from_date', $currentYear)
            ->whereYear('to_date', $currentYear)
            ->get()
            ->map(function ($leave) {
                return [
                    'id' => $leave->id,
                    'user_id' => $leave->user_id,
                    'user' => ['name' => $leave->user->name],
                    'leave_type_id' => $leave->leave_type_id,
                    'leave_type' => ['name' => $leave->leaveType->name],
                    'from_date' => $leave->from_date,
                    'to_date' => $leave->to_date,
                    'total_days' => $leave->total_days,
                    'reason' => $leave->reason,
                    'status' => $leave->status,
                    'reviewed_by' => $leave->reviewed_by,
                    'reviewed_at' => $leave->reviewed_at,
                    'remarks' => $leave->remarks,
                    'created_at' => $leave->created_at,
                    'updated_at' => $leave->updated_at,
                ];
            });

        return Inertia::render('dashboards/employee-dashboard', [
            'today' => $today->format('D d M, Y'),
            'leaveBalances' => $leaveBalances,
            'lieuOffBalance' => $lieuOffBalance,
            'recentLeaves' => $recentLeaves,
            'teamOnLeaveToday' => $teamOnLeaveToday,
            'calendarLeaves' => $calendarLeaves,
            'teamCalendarLeaves' => $teamCalendarLeaves,
            'shiftInfo' => $shift ? [
                'name' => $shift->name,
                'manager' => [
                    'name' => $shift->manager?->name,
                    'email' => $shift->manager?->email,
                ],
            ] : null,
        ]);
    }

    public function managerDashboard(Request $request)
    {
        return Inertia::render('dashboards/manager-dashboard', []);
    }

    public function adminDashboard(Request $request)
    {
        return Inertia::render('dashboards/admin-dashboard', []);
    }

    public function superAdminDashboard(Request $request)
    {
        return Inertia::render('dashboards/super-admin-dashboard', []);
    }
}
