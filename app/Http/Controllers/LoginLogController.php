<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
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
}
