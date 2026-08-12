<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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
    Route::get('/organizations/{id}', [AdminController::class, 'showOrganization']);
    Route::put('/organizations/{id}', [AdminController::class, 'updateOrganization']);
    Route::patch(
        '/organizations/{id}/verification',
        [AdminController::class, 'updateOrganizationVerification']
    );
    Route::delete('/organizations/{id}', [AdminController::class, 'destroyOrganization']);

    // Other admin modules
    Route::get('/help-requests', [AdminController::class, 'helpRequests']);
    Route::get('/donations', [AdminController::class, 'donations']);
    Route::get('/volunteers', [AdminController::class, 'volunteers']);
    Route::get('/campaigns', [AdminController::class, 'campaigns']);
    Route::get('/reports', [AdminController::class, 'reports']);
});
