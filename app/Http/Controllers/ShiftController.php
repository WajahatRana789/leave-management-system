<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        $query = Shift::with('shift_incharge');

        // Server-side search
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Pagination (15 items per page by default)
        $shifts = $query->paginate($request->per_page ?? 15);

        return inertia('shifts/index', ['shifts' => $shifts]);
    }

    public function create()
    {
        // Get only users who are shift_incharges
        $shift_incharges = User::where('role', 'shift_incharge')->get(['id', 'name', 'email']);
        return inertia('shifts/create', ['shift_incharges' => $shift_incharges]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'shift_incharge_id' => ['required', 'exists:users,id'],
        ]);

        Shift::create([
            'name' => $request->name,
            'shift_incharge_id' => $request->shift_incharge_id,
        ]);

        return redirect()->route('shifts.index')->with('success', 'Shift created successfully!');
    }

    public function edit(Shift $shift)
    {
        $shift_incharges = User::where('role', 'shift_incharge')->select('id', 'name')->get();

        return inertia('shifts/edit', [
            'shift' => $shift,
            'shift_incharges' => $shift_incharges,
        ]);
    }

    public function update(Request $request, Shift $shift)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'shift_incharge_id' => 'nullable|exists:users,id',
        ]);

        $shift->update([
            'name' => $request->name,
            'shift_incharge_id' => $request->shift_incharge_id,
        ]);

        return redirect()->route('shifts.index')->with('success', 'Shift updated successfully!');
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();

        return redirect()->route('shifts.index')->with('success', 'Shift deleted successfully.');
    }
}
