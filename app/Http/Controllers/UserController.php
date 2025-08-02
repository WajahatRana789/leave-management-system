<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->with('shift');

        // Role-based filtering
        if (auth()->user()->role === 'manager') {
            $query->whereHas('shift', fn($q) => $q->where('manager_id', auth()->id()));
        } elseif (auth()->user()->role === 'admin') {
            $query->where('role', '!=', 'admin'); // Hide other admins
        }
        // Super-admin sees all (no filter)

        // Server-side search
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        // Pagination (15 items per page by default)
        $users = $query->paginate($request->per_page ?? 15);

        return inertia('users/index', ['users' => $users]);
    }
}
