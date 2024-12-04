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
Route::get('/api/workflows/{workflowId}/flowsteps', [FlowstepController::class, 'index']);
Route::post('/api/workflows/{workflowId}/flowsteps', [FlowstepController::class, 'store']);
Route::post('/api/update-flowstep-stepnumber', [FlowstepController::class, 'updateFlowstepStepnumber']);
Route::delete('/api/flowsteps/{id}', [FlowstepController::class, 'destroy']);
Route::put('/api/flowsteps/update-name/{id}', [FlowstepController::class, 'updateName']);
Route::put('/api/flowsteps/{id}', [FlowstepController::class, 'update']);

use App\Http\Controllers\ToolsystemController;

Route::prefix('/api/flowsteps/{flowstep}')->group(function () {
    Route::get('toolsystems', [ToolsystemController::class, 'index']);
    Route::post('toolsystems', [ToolsystemController::class, 'store']);
    Route::put('toolsystems/{toolsystem}', [ToolsystemController::class, 'update']);
    Route::delete('toolsystems/{toolsystem}', [ToolsystemController::class, 'destroy']);
});

use App\Http\Controllers\FlowstepMemberController;
Route::post('/api/assign-flowstep', [FlowstepMemberController::class, 'store']);


use App\Http\Controllers\MatrixFlowController;
Route::get('/create-matrixflow/{workflowId}', [MatrixFlowController::class, 'renderCreateMatrixFlowPage'])->name('matrixflow.create');
Route::get('/new-matrixflow', [MatrixFlowController::class, 'renderNewMatrixFlowPage'])->name('matrixflow.new');
Route::get('/create-matrixflow-for-guest', [MatrixFlowController::class, 'renderCreateMatrixFlowPageforGuest'])->name('guest.matrixflow.create');

use App\Http\Controllers\WorkflowController;
Route::get('/api/workflows', [WorkflowController::class, 'index'])->name('workflow.index');
Route::post('/api/workflows', [WorkflowController::class, 'store'])->name('workflow.create');
Route::get('/api/workflows/{workflowId}', [WorkflowController::class, 'fetch_workflow'])->name('workflow.fetch_workflow');
Route::get('/workflows/{id}', [WorkflowController::class, 'show'])->name('workflows.show');


use App\Http\Controllers\ChecklistController;
Route::get('/api/workflows/{workflowId}/checklists', [ChecklistController::class, 'index']);
Route::post('/api/workflows/{workflowId}/checklists', [ChecklistController::class, 'store']);
Route::delete('/api/checklists/{checklistId}', [ChecklistController::class, 'destroy']);
Route::put('/api/workflows/{workflowId}/checklists/{checklistId}', [ChecklistController::class, 'update']);


use App\Http\Controllers\CheckitemController;
Route::get('/api/workflows/{workflowId}/checklists/{checklistId}/checkitems', [CheckitemController::class, 'index']);
Route::post('/api/workflows/{workflowId}/checklists/{checklistId}/checkitems', [CheckitemController::class, 'store']);
Route::delete('/api/checkitems/{id}', [CheckitemController::class, 'destroy']);