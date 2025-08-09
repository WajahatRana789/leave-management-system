<?php

namespace App\Http\Controllers;

use App\Models\LieuOff;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LieuOffController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $query = LieuOff::with(['user', 'grantedByUser']);

        if ($user->role === 'manager') {
            $query->where('granted_by', $user->id);
        }

        $lieuLeaves = $query->latest()->paginate(10);

        return Inertia::render('lieu-leaves/index', [
            'lieuLeaves' => $lieuLeaves
        ]);
    }

    public function create(Request $request)
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

        return inertia('lieu-leaves/create', [
            'users' => $users
        ]);
    }
}
