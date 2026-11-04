<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiSummaryService
{
    public function generate(Patient $patient, array $assessment): array
    {
        $apiKey = env('ANTHROPIC_API_KEY');

        if (! $apiKey) {
            return $this->fallback($assessment, '');
        }

        try {
            $prompt = $this->buildPrompt($patient, $assessment);

            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->timeout(30)->post('https://api.anthropic.com/v1/messages', [
                'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-4-5-20250929'),
                'max_tokens' => 800,
                'system' => 'You are an expert clinical psychologist specializing in OCD assessment. '
                    .'Provide concise, structured clinical interpretation of Y-BOCS scores. '
                    .'Be empathetic, evidence-based, and reference standard CBT/ERP approaches. '
                    .'Respond strictly as compact JSON only, no prose around it.',
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

            if (! $response->successful()) {
                Log::warning('AI summary request failed: '.$response->body());

                return $this->fallback($assessment, ' AI summary unavailable.');
            }

            $text = collect($response->json('content', []))
                ->where('type', 'text')
                ->pluck('text')
                ->implode("\n");

            if (preg_match('/\{.*\}/s', $text, $m)) {
                $decoded = json_decode($m[0], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return $decoded;
                }
            }

            return [
                'interpretation' => $text ?: "Patient scored {$assessment['total_score']}/40 ({$assessment['severity']}).",
                'key_concerns' => [],
                'recommendations' => [],
                'risk_flags' => [],
            ];
        } catch (\Throwable $e) {
            Log::warning('AI summary failed: '.$e->getMessage());

            return $this->fallback($assessment, ' AI summary unavailable.');
        }
    }

    private function fallback(array $assessment, string $suffix): array
    {
        return [
            'interpretation' => "Patient scored {$assessment['total_score']}/40 ({$assessment['severity']}).{$suffix}",
            'key_concerns' => [],
            'recommendations' => [],
            'risk_flags' => [],
        ];
    }

    private function buildPrompt(Patient $patient, array $a): string
    {
        $current = fn (array $arr) => $arr ? implode(', ', array_slice($arr, 0, 8)) : 'none';

        return <<<PROMPT
Patient: {$patient->name}, {$patient->age}y, {$patient->gender}
Y-BOCS Total Score: {$a['total_score']}/40 ({$a['severity']})
Obsession sub-score: {$a['obsession_score']}/20
Compulsion sub-score: {$a['compulsion_score']}/20
Principal obsession: {$a['principal_obsession']}
Principal compulsion: {$a['principal_compulsion']}
Current obsessions: {$current($a['obsessions_current'] ?? [])}
Past obsessions: {$current($a['obsessions_past'] ?? [])}
Current compulsions: {$current($a['compulsions_current'] ?? [])}
Past compulsions: {$current($a['compulsions_past'] ?? [])}
Per-question answers (0-4): {$this->jsonSafe($a['answers'])}

Return ONLY JSON with this exact shape:
{
  "interpretation": "2-3 sentence clinical interpretation of severity & impact",
  "key_concerns": ["concern 1", "concern 2", "concern 3"],
  "recommendations": ["recommended next step 1", "recommended next step 2", "recommended next step 3"],
  "risk_flags": ["flag if any, else empty array"]
}
PROMPT;
    }

    private function jsonSafe(array $arr): string
    {
        return json_encode($arr);
    }
}
