<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __invoke(Request $request)
    {
        $therapistId = $request->user()->id;

        return Inertia::render('Reports', [
            'assessments' => Assessment::where('therapist_id', $therapistId)->orderByDesc('date')->get(),
            'patients' => Patient::where('therapist_id', $therapistId)->orderBy('name')->get(),
        ]);
    }
}
