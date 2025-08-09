<?php

namespace App\Http\Controllers;

use App\Models\LieuOff;
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
}
