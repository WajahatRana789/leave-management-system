<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginLogController extends Controller
{
    public function index(Request $request)
    {
        $query = LoginLog::with('user');

        // Filter by event type if requested
        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        // Server-side search (by user email or name)
        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $logs = $query->orderByDesc('created_at')->paginate($request->per_page ?? 15);

        return inertia('login-logs/index', [
            'logs'   => $logs,
            'filter' => $request->only(['event', 'search']),
        ]);
    }

    public function employeeLogs(Request $request, $userId = null)
    {
        // First get distinct user_ids from login_logs
        $userIdsWithLogs = LoginLog::query()
            ->select('user_id')
            ->distinct()
            ->pluck('user_id')
            ->toArray();

        // Then get only those users who have logs
        $employees = User::whereIn('id', $userIdsWithLogs)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $query = LoginLog::with('user');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereBetween('created_at', [
                $request->from_date . " 00:00:00",
                $request->to_date . " 23:59:59"
            ]);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%$search%")
                    ->orWhere('user_agent', 'like', "%$search%");
            });
        }

        $logs = $query->latest()->paginate($request->per_page ?? 15)->withQueryString();

        return Inertia::render('login-logs/employee-logs', [
            'logs'      => $logs,
            'employees' => $employees,
            'selectedUserId' => $userId,
            'filters'   => $request->only(['event', 'from_date', 'to_date', 'search']),
        ]);
    }
}
