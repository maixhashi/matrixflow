<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

use App\Http\Controllers\MemberController;

Route::get('/api/members', [MemberController::class, 'index']);
Route::post('/api/members', [MemberController::class, 'store']);
Route::post('/api/save-order', [MemberController::class, 'saveOrder']);
Route::delete('/api/members/{id}', [MemberController::class, 'destroy']);


use App\Http\Controllers\FlowstepController;
Route::get('/api/flowsteps', [FlowstepController::class, 'index']);
Route::post('/api/flowsteps', [FlowstepController::class, 'store']);
Route::post('/api/update-flowstep-stepnumber', [FlowstepController::class, 'updateFlowstepStepnumber']);
Route::delete('/api/flowsteps/{id}', [FlowstepController::class, 'destroy']);


use App\Http\Controllers\FlowstepMemberController;
Route::post('/api/assign-flowstep', [FlowstepMemberController::class, 'store']);
