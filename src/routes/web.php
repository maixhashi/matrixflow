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
})->name('root');

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
Route::get('/api/workflows/{workflowId}/members', [MemberController::class, 'index']);
Route::post('/api/workflows/{workflowId}/members', [MemberController::class, 'store']);
Route::post('/api/save-order', [MemberController::class, 'saveOrder']);
Route::delete('/api/members/{id}', [MemberController::class, 'destroy']);
Route::put('/api/members/{id}', [MemberController::class, 'update']);


use App\Http\Controllers\FlowstepController;
Route::get('/api/flowsteps', [FlowstepController::class, 'index']);
Route::post('/api/flowsteps', [FlowstepController::class, 'store']);
Route::post('/api/update-flowstep-stepnumber', [FlowstepController::class, 'updateFlowstepStepnumber']);
Route::delete('/api/flowsteps/{id}', [FlowstepController::class, 'destroy']);
Route::put('/api/flowsteps/{id}', [FlowStepController::class, 'update']);


use App\Http\Controllers\FlowstepMemberController;
Route::post('/api/assign-flowstep', [FlowstepMemberController::class, 'store']);


use App\Http\Controllers\MatrixFlowController;
Route::get('/create-matrixflow/{workflowId}', [MatrixFlowController::class, 'renderCreateMatrixFlowPage'])->name('matrixflow.create');
Route::get('/new-matrixflow', [MatrixFlowController::class, 'renderNewMatrixFlowPage'])->name('matrixflow.new');
Route::get('/create-matrixflow-for-guest', [MatrixFlowController::class, 'renderCreateMatrixFlowPageforGuest'])->name('guest.matrixflow.create');

use App\Http\Controllers\WorkflowController;
Route::post('/api/workflow', [WorkflowController::class, 'create'])->name('workflow.create');
Route::post('/api/workflows', [MatrixFlowController::class, 'store']);
Route::get('/new-matrixflow', [MatrixFlowController::class, 'renderNewMatrixFlowPage'])->name('matrixflow.new');
Route::get('/create-matrixflow', [MatrixFlowController::class, 'renderCreateMatrixFlowPage'])->name('matrixflow.create');
Route::get('/create-matrixflow-for-guest', [MatrixFlowController::class, 'renderCreateMatrixFlowPageforGuest'])->name('guest.matrixflow.create');


