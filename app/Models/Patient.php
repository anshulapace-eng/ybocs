<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'id', 'therapist_id', 'name', 'uid', 'age', 'gender', 'mobile', 'email',
        'consultant_name', 'assessment_date', 'notes',
    ];

    protected $casts = [
        'age' => 'integer',
    ];

    public function therapist()
    {
        return $this->belongsTo(Therapist::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class)->orderByDesc('date');
    }

    /** Attach last_score / last_severity / sessions_count, mirroring the old FastAPI response shape. */
    public function withSessionSummary(): array
    {
        $sessions = $this->assessments()->get();
        $last = $sessions->first();

        return array_merge($this->toArray(), [
            'last_score' => $last?->total_score,
            'last_severity' => $last?->severity,
            'sessions_count' => $sessions->count(),
        ]);
    }
}
