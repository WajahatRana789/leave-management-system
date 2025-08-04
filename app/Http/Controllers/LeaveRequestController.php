<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Shift;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $requests = LeaveRequest::with(['leaveType', 'reviewedBy'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        return inertia('leave-requests/index', [
            'requests' => $requests,
            'authUser' => [
                'id' => $user->id,
                'role' => $user->role,
            ],
        ]);
    }

    public function employeeLeaveRequests()
    {
        $user = auth()->user();

        // Employees cannot access this route at all
        if ($user->role === 'employee') {
            abort(403, 'Unauthorized action.');
        }

        $query = LeaveRequest::with([
            'user:id,name',
            'leaveType:id,name',
            'reviewedBy:id,name'
        ]);

        // Managers can only see their team's requests
        if ($user->role === 'manager') {
            $shiftIds = Shift::where('manager_id', $user->id)->pluck('id');
            $teamUserIds = User::whereIn('shift_id', $shiftIds)->pluck('id');

            $query->whereIn('user_id', $teamUserIds);
        }

        // Admins and super_admins can see all requests
        // No additional query constraints needed

        $requests = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('leave-requests/employee-index', [
            'requests' => $requests,
            'canReview' => $user->role !== 'employee', // All non-employees can review
            'authUser' => [
                'id' => $user->id,
                'role' => $user->role,
                'name' => $user->name,
            ],
        ]);
    }

    public function show(LeaveRequest $leaveRequest)
    {
        // Authorization - user can only view their own requests
        if (auth()->id() !== $leaveRequest->user_id) {
            abort(403);
        }

        $leaveRequest->load([
            'leaveType',
            'reviewedBy:id,name',
            'user:id,name'
        ]);

        return inertia('leave-requests/show', [
            'request' => $leaveRequest,
            'canDelete' => $leaveRequest->status === 'pending',
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        $leaveTypes = LeaveType::all()->map(function ($type) use ($user) {
            $usedDays = LeaveRequest::where('user_id', $user->id)
                ->where('leave_type_id', $type->id)
                ->whereIn('status', ['approved', 'pending'])
                ->sum('total_days');

            return [
                'id' => $type->id,
                'name' => $type->name,
                'allocated' => $type->default_days,
                'used' => $usedDays,
                'remaining' => max(0, $type->default_days - $usedDays),
            ];
        });

        return Inertia::render('leave-requests/create', [
            'leaveTypes' => $leaveTypes,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // Step 1: Validate input
        $validated = Validator::make($request->all(), [
            'leave_type_id' => 'required|exists:leave_types,id',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'reason' => 'nullable|string|max:255',
        ])->validate();

        $fromDate = Carbon::parse($validated['from_date']);
        $toDate = Carbon::parse($validated['to_date']);
        $totalDays = $fromDate->diffInDays($toDate) + 1;

        // Step 2: Check for overlapping leave requests (only if pending)
        $hasOverlap = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where(function ($query) use ($fromDate, $toDate) {
                $query->whereBetween('from_date', [$fromDate, $toDate])
                    ->orWhereBetween('to_date', [$fromDate, $toDate])
                    ->orWhere(function ($query) use ($fromDate, $toDate) {
                        $query->where('from_date', '<=', $fromDate)
                            ->where('to_date', '>=', $toDate);
                    });
            })
            ->exists();

        if ($hasOverlap) {
            throw ValidationException::withMessages([
                'from_date' => 'You already have a pending leave request in this date range.',
            ]);
        }

        // Step 3: Check leave balance (only if type has a limited balance)
        $leaveType = LeaveType::find($validated['leave_type_id']);
        $usedLeaveDays = LeaveRequest::where('user_id', $user->id)
            ->where('leave_type_id', $leaveType->id)
            ->whereIn('status', ['approved', 'pending'])
            ->sum('total_days');

        $remainingDays = $leaveType->default_days - $usedLeaveDays;

        if ($totalDays > $remainingDays) {
            throw ValidationException::withMessages([
                'to_date' => "You only have {$remainingDays} {$leaveType->name} days left.",
            ]);
        }

        // Step 4: Create the leave request
        LeaveRequest::create([
            'user_id' => $user->id,
            'leave_type_id' => $leaveType->id,
            'from_date' => $fromDate->toDateString(),
            'to_date' => $toDate->toDateString(),
            'reason' => $validated['reason'],
            'total_days' => $totalDays,
        ]);

        return redirect()->route('leave-requests.index')->with('success', 'Leave request submitted.');
    }

    public function destroy(LeaveRequest $leaveRequest)
    {
        $user = auth()->user();

        // Allow only if it's the user's own request and it's still pending
        if (
            $user->id === $leaveRequest->user_id &&
            $leaveRequest->status === 'pending'
        ) {
            $leaveRequest->delete();
            return redirect()->back()->with('success', 'Leave request deleted.');
        }

        abort(403, 'You are not authorized to delete this leave request.');
    }

    public function approve(LeaveRequest $leaveRequest)
    {
        $user = auth()->user();

        // Authorization - only managers/admins can approve, and only for their team if manager
        if ($user->role === 'employee') {
            abort(403, 'Unauthorized action.');
        }

        if ($user->role === 'manager') {
            $shiftIds = Shift::where('manager_id', $user->id)->pluck('id');
            $teamUserIds = User::whereIn('shift_id', $shiftIds)->pluck('id');

            if (!in_array($leaveRequest->user_id, $teamUserIds->toArray())) {
                abort(403, 'You can only approve leave requests for your team members.');
            }
        }

        // Only allow approving pending requests
        if ($leaveRequest->status !== 'pending') {
            return back()->with('error', 'Only pending leave requests can be approved.');
        }

        $leaveRequest->update([
            'status' => 'approved',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        // Send approval notification (optional)
        // Mail::to($leaveRequest->user->email)->send(new LeaveRequestApproved($leaveRequest));

        return back()->with('success', 'Leave request has been approved.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $request->validate([
            'remarks' => 'required|string|max:1000',
        ]);

        $user = auth()->user();

        // Authorization - same as approve
        if ($user->role === 'employee') {
            abort(403, 'Unauthorized action.');
        }

        if ($user->role === 'manager') {
            $shiftIds = Shift::where('manager_id', $user->id)->pluck('id');
            $teamUserIds = User::whereIn('shift_id', $shiftIds)->pluck('id');

            if (!in_array($leaveRequest->user_id, $teamUserIds->toArray())) {
                abort(403, 'You can only reject leave requests for your team members.');
            }
        }

        // Only allow rejecting pending requests
        if ($leaveRequest->status !== 'pending') {
            return back()->with('error', 'Only pending leave requests can be rejected.');
        }

        $leaveRequest->update([
            'status' => 'rejected',
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
            'remarks' => $request->input('remarks')
        ]);

        // Send rejection notification (optional)
        // Mail::to($leaveRequest->user->email)->send(new LeaveRequestRejected($leaveRequest));

        return back()->with('success', 'Leave request has been rejected.');
    }
}
