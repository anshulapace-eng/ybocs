<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Patient;
use App\Services\YbocsData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $therapistId = $request->user()->id;

        $patientsCount = Patient::where('therapist_id', $therapistId)->count();
        $assessments = Assessment::where('therapist_id', $therapistId)->get();

        $sessionsCount = $assessments->count();
        $avgScore = $sessionsCount ? round($assessments->avg('total_score'), 1) : 0;

        $dist = collect(YbocsData::severityBands())->mapWithKeys(fn ($b) => [$b['label'] => 0]);
        foreach ($assessments as $a) {
            $dist[$a->severity] = ($dist[$a->severity] ?? 0) + 1;
        }

        $recent = $assessments->sortByDesc('date')->take(8)->map(fn (Assessment $a) => [
            'id' => $a->id,
            'patient_id' => $a->patient_id,
            'patient_name' => $a->patient_name,
            'total_score' => $a->total_score,
            'severity' => $a->severity,
            'date' => $a->date,
        ])->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'patients_count' => $patientsCount,
                'sessions_count' => $sessionsCount,
                'avg_score' => $avgScore,
                'severity_distribution' => $dist->map(fn ($count, $label) => ['label' => $label, 'count' => $count])->values(),
                'recent_assessments' => $recent,
            ],
        ]);
    }
}
