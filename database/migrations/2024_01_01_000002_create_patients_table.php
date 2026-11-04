<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('therapist_id');
            $table->string('name');
            $table->string('uid')->nullable()->default('');
            $table->unsignedInteger('age');
            $table->string('gender');
            $table->string('mobile')->nullable()->default('');
            $table->string('email')->nullable()->default('');
            $table->string('consultant_name')->nullable()->default('');
            $table->string('assessment_date')->nullable()->default('');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('therapist_id')->references('id')->on('therapists')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
