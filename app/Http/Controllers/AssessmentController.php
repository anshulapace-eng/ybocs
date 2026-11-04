<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Patient;
use App\Services\AiSummaryService;
use App\Services\YbocsData;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    public function __construct(private AiSummaryService $ai) {}

    /** GET /assessments/new/{patient} — renders the assessment flow for a patient. */
    public function create(Request $request, string $patient)
    {
        $p = Patient::where('id', $patient)->where('therapist_id', $request->user()->id)->firstOrFail();

        return Inertia::render('Assessments/New', [
            'patient' => $p,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_id' => 'required|string',
            'obsessions_current' => 'array',
            'obsessions_past' => 'array',
            'compulsions_current' => 'array',
            'compulsions_past' => 'array',
            'principal_obsession' => 'nullable|string',
            'principal_compulsion' => 'nullable|string',
            'answers' => 'required|array',
        ]);

        $therapist = $request->user();
        $patient = Patient::where('id', $data['patient_id'])->where('therapist_id', $therapist->id)->firstOrFail();

        $answers = $data['answers'];
        for ($i = 1; $i <= 10; $i++) {
            $key = "q{$i}";
            if (! array_key_exists($key, $answers) || $answers[$key] < 0 || $answers[$key] > 4) {
                return back()->withErrors(['answers' => "Missing or invalid answer for {$key}"]);
            }
        }

        $obsessionScore = collect(range(1, 5))->sum(fn ($i) => (int) $answers["q{$i}"]);
        $compulsionScore = collect(range(6, 10))->sum(fn ($i) => (int) $answers["q{$i}"]);
        $total = $obsessionScore + $compulsionScore;

        $payload = [
            'id' => (string) Str::uuid(),
            'patient_id' => $patient->id,
            'therapist_id' => $therapist->id,
            'patient_name' => $patient->name,
            'patient_uid' => $patient->uid ?? '',
            'patient_age' => $patient->age ?? 0,
            'patient_gender' => $patient->gender ?? '',
            'patient_mobile' => $patient->mobile ?? '',
            'patient_email' => $patient->email ?? '',
            'consultant_name' => $patient->consultant_name ?: $therapist->name,
            'date' => now()->toIso8601String(),
            'obsessions_current' => $data['obsessions_current'] ?? [],
            'obsessions_past' => $data['obsessions_past'] ?? [],
            'compulsions_current' => $data['compulsions_current'] ?? [],
            'compulsions_past' => $data['compulsions_past'] ?? [],
            'principal_obsession' => $data['principal_obsession'] ?? '',
            'principal_compulsion' => $data['principal_compulsion'] ?? '',
            'answers' => $answers,
            'obsession_score' => $obsessionScore,
            'compulsion_score' => $compulsionScore,
            'total_score' => $total,
            'severity' => YbocsData::severityBand($total),
            'manual_notes' => '',
            'include_ai_in_pdf' => true,
        ];

        $payload['ai_summary'] = $this->ai->generate($patient, $payload);

        $assessment = Assessment::create($payload);

        return redirect()->route('assessments.show', $assessment->id)->with('success', 'Assessment saved.');
    }

    public function show(Request $request, string $id)
    {
        $assessment = Assessment::where('id', $id)->where('therapist_id', $request->user()->id)->firstOrFail();

        return Inertia::render('Assessments/Show', [
            'assessment' => $assessment,
        ]);
    }

    public function updateNotes(Request $request, string $id)
    {
        $data = $request->validate(['manual_notes' => 'required|string']);

        $assessment = Assessment::where('id', $id)->where('therapist_id', $request->user()->id)->firstOrFail();
        $assessment->update(['manual_notes' => $data['manual_notes']]);

        return back()->with('success', 'Clinical notes saved.');
    }

    public function updatePrefs(Request $request, string $id)
    {
        $data = $request->validate(['include_ai_in_pdf' => 'required|boolean']);

        $assessment = Assessment::where('id', $id)->where('therapist_id', $request->user()->id)->firstOrFail();
        $assessment->update(['include_ai_in_pdf' => $data['include_ai_in_pdf']]);

        return back();
    }
}
