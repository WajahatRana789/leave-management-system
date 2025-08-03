<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = LeaveType::query();

        // Server-side search
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Pagination (15 items per page by default)
        $leaveTypes = $query->paginate($request->per_page ?? 15);

        return inertia('leave-types/index', ['leaveTypes' => $leaveTypes]);
    }

    public function create()
    {
        return inertia('leave-types/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:leave_types,name',
            'default_days' => 'required|numeric|min:0',
        ]);

        LeaveType::create([
            'name' => $request->name,
            'default_days' => $request->default_days,
        ]);

        return redirect()->route('leave-types.index')->with('success', 'Leave type created successfully.');
    }

    public function edit(LeaveType $leaveType)
    {
        return Inertia::render('leave-types/edit', [
            'leaveType' => $leaveType
        ]);
    }


    public function update(Request $request, LeaveType $leaveType)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:leave_types,name,' . $leaveType->id,
            'default_days' => 'required|numeric|min:0',
        ]);

        $leaveType->update([
            'name' => $request->name,
            'default_days' => $request->default_days,
        ]);

        return redirect()->route('leave-types.index')->with('success', 'Leave type updated successfully.');
    }

    public function destroy(LeaveType $leaveType)
    {
        $leaveType->delete();

        return redirect()->route('leave-types.index')->with('success', 'Leave type deleted successfully.');
    }
}
