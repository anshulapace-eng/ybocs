<?php

use App\Http\Controllers\Admin\TherapistController as AdminTherapistController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));

// ----------- AUTH (session-based, no tokens/API) -----------
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');
});
Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // ----------- PATIENTS -----------
    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
    Route::get('/patients/{id}', [PatientController::class, 'show'])->name('patients.show');

    // ----------- ASSESSMENTS -----------
    Route::get('/assessments/new/{patient}', [AssessmentController::class, 'create'])->name('assessments.create');
    Route::post('/assessments', [AssessmentController::class, 'store'])->name('assessments.store');
    Route::get('/assessments/{id}', [AssessmentController::class, 'show'])->name('assessments.show');
    Route::patch('/assessments/{id}/notes', [AssessmentController::class, 'updateNotes'])->name('assessments.notes');
    Route::patch('/assessments/{id}/prefs', [AssessmentController::class, 'updatePrefs'])->name('assessments.prefs');

    // ----------- REPORTS -----------
    Route::get('/reports', ReportController::class)->name('reports');

    // ----------- ADMIN: THERAPISTS -----------
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/therapists', [AdminTherapistController::class, 'index'])->name('therapists.index');
        Route::post('/therapists', [AdminTherapistController::class, 'store'])->name('therapists.store');
        Route::delete('/therapists/{id}', [AdminTherapistController::class, 'destroy'])->name('therapists.destroy');
    });
});
