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

        // Leave balance by type
        $leaveTypes = LeaveType::all();
        $usedDays = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->select('leave_type_id', DB::raw('SUM(total_days) as used'))
            ->groupBy('leave_type_id')
            ->pluck('used', 'leave_type_id');

        $leaveBalances = $leaveTypes->map(function ($type) use ($usedDays) {
            $used = $usedDays[$type->id] ?? 0;
            return [
                'id' => $type->id,
                'name' => $type->name,
                'default_days' => $type->default_days,
                'used_days' => $used,
                'remaining_days' => max(0, $type->default_days - $used),
            ];
        });

        // Recent applications
        $recentLeaves = LeaveRequest::with('leaveType')
            ->where('user_id', $user->id)
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

        $calendarLeaves = LeaveRequest::with('leaveType')
            ->where('user_id', $user->id)
            ->get();

        return Inertia::render('dashboards/employee-dashboard', [
            'leaveBalances' => $leaveBalances,
            'recentLeaves' => $recentLeaves,
            'teamOnLeaveToday' => $teamOnLeaveToday,
            'calendarLeaves' => $calendarLeaves,
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
