<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HelpRequestController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/help-requests', [HelpRequestController::class, 'store']);
    Route::get('/help-requests/{id}', [HelpRequestController::class, 'show']);
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Users
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}', [AdminController::class, 'showUser']);
    Route::post('/users', [AdminController::class, 'storeUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'destroyUser']);

    // Organizations
    Route::get('/organizations', [AdminController::class, 'organizations']);
    Route::post('/organizations', [AdminController::class, 'storeOrganization']);
    Route::get('/organizations/{id}', [AdminController::class, 'showOrganization']);
    Route::put('/organizations/{id}', [AdminController::class, 'updateOrganization']);
    Route::patch(
        '/organizations/{id}/verification',
        [AdminController::class, 'updateOrganizationVerification']
    );
    Route::delete('/organizations/{id}', [AdminController::class, 'destroyOrganization']);

    // Help Request
    Route::get('/help-requests', [AdminController::class, 'helpRequests']);
    Route::patch(
        '/help-requests/{id}/verification',
        [AdminController::class, 'updateHelpRequestVerification']
    );
    Route::patch(
        '/help-requests/{id}/assignment',
        [AdminController::class, 'assignHelpRequest']
    );


    // Other admin modules
    Route::get('/donations', [AdminController::class, 'donations']);
    Route::get('/volunteers', [AdminController::class, 'volunteers']);
    Route::get('/campaigns', [AdminController::class, 'campaigns']);
    Route::get('/reports', [AdminController::class, 'reports']);
});
