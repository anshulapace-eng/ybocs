<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id', 'patient_id', 'therapist_id',
        'patient_name', 'patient_uid', 'patient_age', 'patient_gender', 'patient_mobile', 'patient_email',
        'consultant_name', 'date',
        'obsessions_current', 'obsessions_past', 'compulsions_current', 'compulsions_past',
        'principal_obsession', 'principal_compulsion',
        'answers', 'obsession_score', 'compulsion_score', 'total_score', 'severity',
        'ai_summary', 'manual_notes', 'include_ai_in_pdf',
    ];

    protected $casts = [
        'obsessions_current' => 'array',
        'obsessions_past' => 'array',
        'compulsions_current' => 'array',
        'compulsions_past' => 'array',
        'answers' => 'array',
        'ai_summary' => 'array',
        'include_ai_in_pdf' => 'boolean',
        'patient_age' => 'integer',
        'obsession_score' => 'integer',
        'compulsion_score' => 'integer',
        'total_score' => 'integer',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function therapist()
    {
        return $this->belongsTo(Therapist::class);
    }
}
