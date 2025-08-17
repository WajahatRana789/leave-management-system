<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\LieuOffController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function (Request $request) {
        $user = Auth::user();
        return match ($user->role) {
            'employee' => redirect()->route('employee.dashboard'),
            'shift_incharge' => redirect()->route('shift_incharge.dashboard'),
            'admin' => redirect()->route('admin.dashboard'),
            'super_admin' => redirect()->route('superadmin.dashboard'),
            default => abort(403, 'Unauthorized'),
        };
    })->name('dashboard');

    Route::middleware(['role:super_admin'])->group(function () {
        // Dashboard
        Route::get('/dashboard/superadmin', [DashboardController::class, 'superAdminDashboard'])->name('superadmin.dashboard');

        // Users
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Shifts
        Route::get('/shifts', [ShiftController::class, 'index'])->name('shifts.index');
        Route::get('/shifts/create', [ShiftController::class, 'create'])->name('shifts.create');
        Route::post('/shifts', [ShiftController::class, 'store'])->name('shifts.store');
        Route::get('/shifts/{shift}/edit', [ShiftController::class, 'edit'])->name('shifts.edit');
        Route::put('/shifts/{shift}', [ShiftController::class, 'update'])->name('shifts.update');
        Route::delete('/shifts/{shift}', [ShiftController::class, 'destroy'])->name('shifts.destroy');

        // Leave Types
        Route::get('/leave-types', [LeaveTypeController::class, 'index'])->name('leave-types.index');
        Route::get('/leave-types/create', [LeaveTypeController::class, 'create'])->name('leave-types.create');
        Route::post('/leave-types', [LeaveTypeController::class, 'store'])->name('leave-types.store');
        Route::get('/leave-types/{leaveType}/edit', [LeaveTypeController::class, 'edit'])->name('leave-types.edit');
        Route::put('/leave-types/{leaveType}', [LeaveTypeController::class, 'update'])->name('leave-types.update');
        Route::delete('/leave-types/{leaveType}', [LeaveTypeController::class, 'destroy'])->name('leave-types.destroy');
    });


    // Super Admin, Admin, Shift Incharge
    Route::middleware(['role:super_admin,admin,shift_incharge'])->group(function () {
        // Users
        Route::get('/users', [UserController::class, 'index'])->name('users.index');


        // Leave Requests
        Route::get('/employee-leave-requests', [LeaveRequestController::class, 'employeeLeaveRequests'])->name('leave-requests.employee.index');
        Route::get('/employee-leave-requests/{leaveRequest}', [LeaveRequestController::class, 'employeeLeaveRequestShow'])->name('leave-requests.employee.show');

        // Lieu Leaves
        Route::get('/lieu-leaves', [LieuOffController::class, 'index'])->name('lieu-leaves.index');
        Route::get('/lieu-leaves/create', [LieuOffController::class, 'create'])->name('lieu-leaves.create');
        Route::post('/lieu-leaves', [LieuOffController::class, 'store'])->name('lieu-leaves.store');
        Route::get('/lieu-leaves/{lieuOff}/edit', [LieuOffController::class, 'edit'])->name('lieu-leaves.edit');
        Route::delete('/lieu-leaves/{lieuOff}', [LieuOffController::class, 'destroy'])->name('lieu-leaves.destroy');

        // Approve/Reject Leave Request
        Route::post('/leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leave-requests.approve');
        Route::post('/leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leave-requests.reject');
    });

    Route::middleware(['role:admin'])->group(function () {
        Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard'])->name('admin.dashboard');
    });

    Route::middleware(['role:shift_incharge'])->group(function () {
        Route::get('/dashboard/shift-incharge', [DashboardController::class, 'shiftInchargeDashboard'])->name('shift_incharge.dashboard');
    });

    Route::middleware(['role:employee'])->group(function () {
        Route::get('/dashboard/employee', [DashboardController::class, 'employeeDashboard'])->name('employee.dashboard');
    });


    // Shift Incharge & Employee
    Route::middleware(['role:shift_incharge,employee'])->group(function () {
        Route::get('/my-leave-requests', [LeaveRequestController::class, 'index'])->name('leave-requests.index');
        Route::get('/my-leave-requests/{leaveRequest}', [LeaveRequestController::class, 'show'])->name('leave-requests.show');
        Route::get('/my-lieu-offs', [LieuOffController::class, 'mylieuOffs'])->name('my-lieu-offs.index');
        Route::get('/leave-requests/create', [LeaveRequestController::class, 'create'])->name('leave-requests.create');
        Route::post('/leave-requests', [LeaveRequestController::class, 'store'])->name('leave-requests.store');
        Route::delete('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'destroy'])->name('leave-requests.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
