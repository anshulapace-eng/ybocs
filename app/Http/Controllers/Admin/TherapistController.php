<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Therapist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class TherapistController extends Controller
{
    public function index()
    {
        $rows = Therapist::orderBy('created_at')->get()->map(function (Therapist $r) {
            return [
                'id' => $r->id,
                'email' => $r->email,
                'name' => $r->name,
                'role' => $r->role,
                'created_at' => $r->created_at?->toIso8601String(),
                'patients_count' => Patient::where('therapist_id', $r->id)->count(),
            ];
        })->values();

        return Inertia::render('Therapists', [
            'therapists' => $rows,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|in:therapist,admin',
        ]);

        $email = strtolower(trim($data['email']));

        if (Therapist::where('email', $email)->exists()) {
            return back()->withErrors(['email' => 'Email already exists']);
        }

        Therapist::create([
            'email' => $email,
            'name' => trim($data['name']),
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'therapist',
        ]);

        return back()->with('success', 'Therapist added.');
    }

    public function destroy(Request $request, string $id)
    {
        if ($id === $request->user()->id) {
            return back()->withErrors(['id' => 'Cannot delete yourself']);
        }

        Therapist::where('id', $id)->delete();

        return back()->with('success', 'Therapist removed.');
    }
}
