<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $patients = Patient::where('therapist_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Patient $p) => $p->withSessionSummary())
            ->values();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'uid' => 'nullable|string',
            'age' => 'required|integer',
            'gender' => 'required|string',
            'mobile' => 'nullable|string',
            'email' => 'nullable|string',
            'consultant_name' => 'nullable|string',
            'assessment_date' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $therapist = $request->user();

        Patient::create([
            'therapist_id' => $therapist->id,
            'name' => trim($data['name']),
            'uid' => trim($data['uid'] ?? ''),
            'age' => $data['age'],
            'gender' => $data['gender'],
            'mobile' => trim($data['mobile'] ?? ''),
            'email' => trim($data['email'] ?? ''),
            'consultant_name' => trim($data['consultant_name'] ?? '') ?: $therapist->name,
            'assessment_date' => $data['assessment_date'] ?? '',
            'notes' => $data['notes'] ?? '',
        ]);

        return redirect()->route('patients.index')->with('success', 'Patient added.');
    }

    public function show(Request $request, string $id)
    {
        $patient = Patient::where('id', $id)->where('therapist_id', $request->user()->id)->firstOrFail();

        $sessions = Assessment::where('patient_id', $patient->id)
            ->where('therapist_id', $request->user()->id)
            ->orderByDesc('date')
            ->get();

        return Inertia::render('Patients/Show', [
            'patient' => $patient->withSessionSummary(),
            'sessions' => $sessions,
        ]);
    }
}
