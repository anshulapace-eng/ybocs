<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_id');
            $table->uuid('therapist_id');

            // Snapshot of patient details at the time of assessment
            $table->string('patient_name');
            $table->string('patient_uid')->nullable()->default('');
            $table->unsignedInteger('patient_age')->default(0);
            $table->string('patient_gender')->nullable()->default('');
            $table->string('patient_mobile')->nullable()->default('');
            $table->string('patient_email')->nullable()->default('');
            $table->string('consultant_name')->nullable()->default('');

            $table->string('date'); // ISO8601 string, kept for parity with previous API

            $table->json('obsessions_current')->nullable();
            $table->json('obsessions_past')->nullable();
            $table->json('compulsions_current')->nullable();
            $table->json('compulsions_past')->nullable();
            $table->string('principal_obsession')->nullable()->default('');
            $table->string('principal_compulsion')->nullable()->default('');

            $table->json('answers'); // {"q1": 2, ... "q10": 3}
            $table->unsignedTinyInteger('obsession_score');
            $table->unsignedTinyInteger('compulsion_score');
            $table->unsignedTinyInteger('total_score');
            $table->string('severity');

            $table->json('ai_summary')->nullable();
            $table->text('manual_notes')->nullable()->default('');
            $table->boolean('include_ai_in_pdf')->default(true);

            $table->timestamps();

            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('therapist_id')->references('id')->on('therapists')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
