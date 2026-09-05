<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\IndividualDashboardController;
use App\Http\Controllers\HelpRequestController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

// =============================================================
// PUBLIC
// =============================================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{id}', [CampaignController::class, 'show']);

Route::post('/donations', [DonationController::class, 'store']);


// =============================================================
// AUTHENTICATED USERS
// =============================================================

Route::middleware('auth:sanctum')->group(function () {

    // ---------------------------------------------------------
    // Authentication
    // ---------------------------------------------------------

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // ---------------------------------------------------------
    // Notifications
    // ---------------------------------------------------------

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    );

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    );

    Route::patch(
        '/notifications/{id}/read',
        [NotificationController::class, 'markAsRead']
    );


    // ---------------------------------------------------------
    // Individual Dashboard
    // ---------------------------------------------------------

    Route::get(
        '/individual/dashboard',
        [IndividualDashboardController::class, 'index']
    );


    // ---------------------------------------------------------
    // Help Requests - Individual
    // ---------------------------------------------------------

    Route::get('/help-requests', [HelpRequestController::class, 'myRequests']);
    Route::post('/help-requests', [HelpRequestController::class, 'store']);
    Route::get('/help-requests/{id}', [HelpRequestController::class, 'show']);
    Route::patch('/help-requests/{id}', [HelpRequestController::class, 'update']);
    Route::delete('/help-requests/{id}', [HelpRequestController::class, 'destroy']);


    // ---------------------------------------------------------
    // Campaigns - Organization
    // ---------------------------------------------------------

    Route::post('/campaigns', [CampaignController::class, 'store']);


    // ---------------------------------------------------------
    // Volunteer - Individual
    // ---------------------------------------------------------

    Route::post('/volunteer', [VolunteerController::class, 'store']);

    Route::get('/volunteer', [VolunteerController::class, 'show']);

    Route::get(
        '/volunteer/assignments',
        [VolunteerController::class, 'assignments']
    );

    Route::patch(
        '/volunteer/assignments/{id}/accept',
        [VolunteerController::class, 'acceptAssignment']
    );

    Route::patch(
        '/volunteer/assignments/{id}/reject',
        [VolunteerController::class, 'rejectAssignment']
    );

    Route::patch(
        '/volunteer/assignments/{id}/start',
        [VolunteerController::class, 'startAssignment']
    );

    Route::patch(
        '/volunteer/assignments/{id}/complete',
        [VolunteerController::class, 'completeAssignment']
    );


    // ---------------------------------------------------------
    // Campaign Volunteer Assignments - Individual
    // ---------------------------------------------------------

    Route::patch(
        '/volunteer/campaign-assignments/{id}/accept',
        [VolunteerController::class, 'acceptCampaignAssignment']
    );

    Route::patch(
        '/volunteer/campaign-assignments/{id}/reject',
        [VolunteerController::class, 'rejectCampaignAssignment']
    );

    Route::patch(
        '/volunteer/campaign-assignments/{id}/start',
        [VolunteerController::class, 'startCampaignAssignment']
    );

    Route::patch(
        '/volunteer/campaign-assignments/{id}/complete',
        [VolunteerController::class, 'completeCampaignAssignment']
    );


    // ---------------------------------------------------------
    // Organization
    // ---------------------------------------------------------

    Route::get(
        '/organization/assignments',
        [OrganizationController::class, 'assignments']
    );

    Route::patch(
        '/organization/assignments/{id}/accept',
        [OrganizationController::class, 'acceptAssignment']
    );

    Route::patch(
        '/organization/assignments/{id}/reject',
        [OrganizationController::class, 'rejectAssignment']
    );

    Route::patch(
        '/organization/assignments/{id}/start',
        [OrganizationController::class, 'startAssignment']
    );

    Route::patch(
        '/organization/assignments/{id}/complete',
        [OrganizationController::class, 'completeAssignment']
    );

    Route::patch(
        '/organization/assignments/{id}',
        [OrganizationController::class, 'updateAssignment']
    );

    Route::patch(
        '/organization/assignments/{id}/withdraw',
        [OrganizationController::class, 'requestWithdrawal']
    );
});


// =============================================================
// ADMIN
// =============================================================

Route::middleware('auth:sanctum')
    ->prefix('admin')
    ->group(function () {

        Route::get('/dashboard', [AdminController::class, 'dashboard']);


        // ---------------------------------------------------------
        // Users
        // ---------------------------------------------------------

        Route::get('/users', [AdminController::class, 'users']);

        Route::get(
            '/users/{id}',
            [AdminController::class, 'showUser']
        );

        Route::post(
            '/users',
            [AdminController::class, 'storeUser']
        );

        Route::put(
            '/users/{id}',
            [AdminController::class, 'updateUser']
        );

        Route::delete(
            '/users/{id}',
            [AdminController::class, 'destroyUser']
        );


        // ---------------------------------------------------------
        // Organizations
        // ---------------------------------------------------------

        Route::get(
            '/organizations',
            [AdminController::class, 'organizations']
        );

        Route::post(
            '/organizations',
            [AdminController::class, 'storeOrganization']
        );

        Route::get(
            '/organizations/{id}',
            [AdminController::class, 'showOrganization']
        );

        Route::put(
            '/organizations/{id}',
            [AdminController::class, 'updateOrganization']
        );

        Route::patch(
            '/organizations/{id}/verification',
            [AdminController::class, 'updateOrganizationVerification']
        );

        Route::delete(
            '/organizations/{id}',
            [AdminController::class, 'destroyOrganization']
        );


        // ---------------------------------------------------------
        // Help Requests
        // ---------------------------------------------------------

        Route::get(
            '/help-requests',
            [AdminController::class, 'helpRequests']
        );

        Route::patch(
            '/help-requests/{id}/verification',
            [AdminController::class, 'updateHelpRequestVerification']
        );

        Route::patch(
            '/help-requests/{id}/urgency',
            [AdminController::class, 'updateHelpRequestUrgency']
        );

        Route::patch(
            '/help-requests/{id}/assignment',
            [AdminController::class, 'assignHelpRequest']
        );

        Route::get(
            '/help-requests/withdrawal-requests',
            [AdminController::class, 'withdrawalRequests']
        );

        Route::patch(
            '/help-requests/assignments/{id}/withdrawal',
            [AdminController::class, 'reviewWithdrawal']
        );

        Route::post(
            '/help-requests/{id}/reassign',
            [AdminController::class, 'reassignHelpRequest']
        );


        // ---------------------------------------------------------
        // Volunteers - Admin
        // ---------------------------------------------------------

        Route::get(
            '/volunteers',
            [VolunteerController::class, 'index']
        );

        Route::get(
            '/volunteers/{id}',
            [VolunteerController::class, 'adminShow']
        );

        Route::patch(
            '/volunteers/{id}/status',
            [VolunteerController::class, 'updateStatus']
        );


        // ---------------------------------------------------------
        // Campaigns Modules
        // ---------------------------------------------------------

        Route::get(
            '/campaigns',
            [AdminController::class, 'campaigns']
        );

        Route::patch(
            '/campaigns/{id}/verification',
            [AdminController::class, 'updateCampaignVerification']
        );

        Route::patch(
            '/campaigns/{id}/status',
            [AdminController::class, 'updateCampaignStatus']
        );

        Route::patch(
            '/campaigns/{id}/assignment',
            [AdminController::class, 'assignCampaignVolunteer']
        );


        // ---------------------------------------------------------
        // Other Admin Modules
        // ---------------------------------------------------------

        Route::get(
            '/donations',
            [AdminController::class, 'donations']
        );

        Route::get(
            '/reports',
            [AdminController::class, 'reports']
        );
    });
