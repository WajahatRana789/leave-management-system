<?php

namespace App\Http\Controllers;

use App\Models\Shift;
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
            $query->whereNotIn('role', ['admin', 'super_admin']);
        }

        $query->whereNotIn('role', ['super_admin']);


        // Server-side search
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        // Pagination (15 items per page by default)
        $users = $query->paginate($request->per_page ?? 15);

        return inertia('users/index', ['users' => $users]);
    }

    public function create()
    {
        return inertia('users/create', [
            'shifts' => Shift::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:users,code',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:employee,manager,admin',
            'shift_id' => 'nullable|exists:shifts,id',
        ]);

        // Additional validation for roles
        if ($validated['role'] !== 'admin' && !$validated['shift_id']) {
            return redirect()->back()->withErrors(['shift_id' => 'Shift is required for employees.']);
        }

        User::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'shift_id' => $validated['shift_id'],
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully!');
    }

    public function edit(User $user)
    {
        return inertia('users/edit', [
            'user' => $user->load('shift'),
            'shifts' => Shift::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:users,code,' . $user->id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:employee,manager,admin',
            'shift_id' => 'nullable|exists:shifts,id',
        ]);

        // Require shift if not admin
        if ($validated['role'] !== 'admin' && !$validated['shift_id']) {
            return redirect()->back()->withErrors(['shift_id' => 'Shift is required for employees.']);
        }

        $user->update([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'shift_id' => $validated['shift_id'],
            'password' => $validated['password'] ? bcrypt($validated['password']) : $user->password,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully!');
    }
}
