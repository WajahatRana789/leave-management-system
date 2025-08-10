<?php

namespace App\Http\Controllers;

use App\Models\LieuOff;
use App\Models\User;
use Carbon\Carbon;
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

    public function store(Request $request)
    {
        $authUser = auth()->user();

        // 1. Authorize
        if (!in_array($authUser->role, ['manager', 'admin', 'super_admin'])) {
            abort(403, 'You are not authorized to grant lieu leave.');
        }

        // 2. Validate
        $validated = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'work_date'   => 'required|date',
            'expiry_date' => 'nullable|date|after_or_equal:work_date',
            'reason'      => 'nullable|string|max:1000',
        ]);

        // 3. Set expiry date if not provided
        if (empty($validated['expiry_date'])) {
            $validated['expiry_date'] = Carbon::parse($validated['work_date'])->addDays(60)->toDateString();
        }

        // 4. Manager restriction
        if ($authUser->role === 'manager') {
            $isTeamMember = User::where('id', $validated['user_id'])
                ->whereHas('shift', fn($q) => $q->where('manager_id', $authUser->id))
                ->exists();

            if (!$isTeamMember) {
                abort(403, 'You can only grant lieu leave to members of your team.');
            }
        }

        // 5. Prevent duplicate record for same work_date
        $duplicateExists = LieuOff::where('user_id', $validated['user_id'])
            ->whereDate('work_date', $validated['work_date'])
            ->exists();

        if ($duplicateExists) {
            return redirect()->back()
                ->withErrors(['work_date' => 'A lieu leave for this employee on the same work date already exists.'])
                ->withInput();
        }

        // 6. Create record
        LieuOff::create([
            'user_id'     => $validated['user_id'],
            'granted_by'  => $authUser->id,
            'work_date'   => $validated['work_date'],
            'expiry_date' => $validated['expiry_date'],
            'status'      => 'available',
            'remarks'     => $validated['reason'],
        ]);

        // 7. Redirect success
        return redirect()->route('lieu-leaves.index')->with('success', 'Lieu leave granted successfully.');
    }

    public function destroy(LieuOff $lieuOff)
    {
        $authUser = auth()->user();

        // 1. Authorize
        if (!in_array($authUser->role, ['manager', 'admin', 'super_admin'])) {
            abort(403, 'You are not authorized to delete lieu leave.');
        }

        // 2. Check if record exists and is available
        $query = LieuOff::where('id', $lieuOff->id)
            ->where('status', 'available');

        // 3. If user is manager, restrict to their team
        if ($authUser->role === 'manager') {
            $query->whereHas('user', function ($q) use ($authUser) {
                $q->whereHas('shift', function ($q) use ($authUser) {
                    $q->where('manager_id', $authUser->id);
                });
            });
        }

        $lieuOff = $query->first();

        if (!$lieuOff) {
            return redirect()->back()
                ->with('error', 'Record not found or cannot be deleted.');
        }

        // 4. Check if linked to any leave request
        // if ($lieuOff->leaveRequests()->exists()) {
        //     return redirect()->back()
        //         ->with('error', 'This Lieu Off is already used in a leave request and cannot be deleted.');
        // }

        // 5. Delete the record
        $lieuOff->delete();

        // 6. Redirect with success message
        return redirect()->route('lieu-leaves.index')
            ->with('success', 'Lieu Off deleted successfully.');
    }
}
