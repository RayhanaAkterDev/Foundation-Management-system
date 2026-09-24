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
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\PublicCampaignController;
use Illuminate\Support\Facades\Route;

// =============================================================
// PUBLIC
// =============================================================

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get(
    '/campaigns',
    [CampaignController::class, 'index']
);

Route::get(
    '/campaigns/{id}',
    [CampaignController::class, 'show']
);

Route::prefix('public')->group(function () {
    Route::get('/campaigns', [PublicCampaignController::class, 'index']);
    Route::get('/campaigns/{id}', [PublicCampaignController::class, 'show']);
    Route::get('/categories', [PublicCampaignController::class, 'categories']);
});

// =============================================================
// EMAIL VERIFICATION
// =============================================================

Route::get(
    '/email/verify/{id}/{hash}',
    [EmailVerificationController::class, 'verify']
)
    ->name('verification.verify')
    ->middleware('throttle:6,1');

Route::get(
    '/email/verify-demo/{id}',
    [EmailVerificationController::class, 'verifyDemo']
)
    ->name('verification.demo');

// IMPORTANT:
// This route MUST remain outside auth:sanctum.
// An unverified user does not have an authentication token.

Route::post(
    '/email/verification-notification',
    [EmailVerificationController::class, 'resend']
)
    ->name('verification.send')
    ->middleware('throttle:6,1');

// =============================================================
// SSLCOMMERZ PAYMENT CALLBACKS
// =============================================================

Route::post(
    '/donations/payment/success',
    [DonationController::class, 'success']
)
    ->name('donations.payment.success');

Route::post(
    '/donations/payment/fail',
    [DonationController::class, 'fail']
)
    ->name('donations.payment.fail');

Route::post(
    '/donations/payment/cancel',
    [DonationController::class, 'cancel']
)
    ->name('donations.payment.cancel');

Route::post(
    '/donations/payment/ipn',
    [DonationController::class, 'ipn']
)
    ->name('donations.payment.ipn');

// =============================================================
// AUTHENTICATED USERS
// =============================================================

Route::middleware('auth:sanctum')->group(function () {

    // ---------------------------------------------------------
    // AUTHENTICATION / PROFILE
    // ---------------------------------------------------------

    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );

    Route::get(
        '/user',
        [AuthController::class, 'user']
    );

    Route::put(
        '/profile',
        [AuthController::class, 'updateProfile']
    );

    // ---------------------------------------------------------
    // NOTIFICATIONS
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

    // =========================================================
    // INDIVIDUAL
    // =========================================================

    Route::get(
        '/individual/dashboard',
        [IndividualDashboardController::class, 'index']
    );

    // ---------------------------------------------------------
    // INDIVIDUAL HELP REQUESTS
    // ---------------------------------------------------------

    Route::get(
        '/help-requests',
        [HelpRequestController::class, 'myRequests']
    );

    Route::post(
        '/help-requests',
        [HelpRequestController::class, 'store']
    );

    Route::get(
        '/help-requests/{id}',
        [HelpRequestController::class, 'show']
    );

    Route::patch(
        '/help-requests/{id}',
        [HelpRequestController::class, 'update']
    );

    Route::delete(
        '/help-requests/{id}',
        [HelpRequestController::class, 'destroy']
    );

    // =========================================================
    // INDIVIDUAL VOLUNTEER
    // =========================================================

    // Individual submits a volunteer application.
    // Individual = sender.
    Route::post(
        '/volunteer',
        [VolunteerController::class, 'store']
    );

    // Individual requests admin to reactivate an inactive
// volunteer profile.
//
// This does NOT create another Volunteer record.

Route::patch(
    '/volunteer/reactivation',
    [VolunteerController::class, 'requestReactivation']
);

    // Get current volunteer profile / request state.
    Route::get(
        '/volunteer',
        [VolunteerController::class, 'show']
    );

    // ---------------------------------------------------------
    // VOLUNTEER REQUESTS
    // ---------------------------------------------------------

    // Individual receives an admin invitation.
    // Individual = receiver.
    // Receiver can accept or reject.

    Route::patch(
        '/volunteer/requests/{id}/accept',
        [VolunteerController::class, 'acceptVolunteerRequest']
    );

    Route::patch(
        '/volunteer/requests/{id}/reject',
        [VolunteerController::class, 'rejectVolunteerRequest']
    );

    // Individual cancels their own application.
    // Individual = sender.
    // Only pending application can be cancelled.

    Route::patch(
        '/volunteer/requests/{id}/cancel',
        [VolunteerController::class, 'cancelVolunteerRequest']
    );

    // ---------------------------------------------------------
    // VOLUNTEER RESIGNATION
    // ---------------------------------------------------------

    // Existing active volunteer resigns.
    // This is separate from cancelling a pending request.

    Route::patch(
        '/volunteer/resign',
        [VolunteerController::class, 'resign']
    );

    // ---------------------------------------------------------
    // VOLUNTEER CAMPAIGN ASSIGNMENTS
    // ---------------------------------------------------------

    // Get campaign assignments for the authenticated volunteer.

    Route::get(
        '/volunteer/campaign-assignments',
        [VolunteerController::class, 'assignments']
    );

    // Volunteer accepts an assignment.

    Route::patch(
        '/volunteer/campaign-assignments/{id}/accept',
        [VolunteerController::class, 'acceptCampaignAssignment']
    );

    // Volunteer rejects an assignment.

    Route::patch(
        '/volunteer/campaign-assignments/{id}/reject',
        [VolunteerController::class, 'rejectCampaignAssignment']
    );

    // Volunteer starts an accepted assignment.

    Route::patch(
        '/volunteer/campaign-assignments/{id}/start',
        [VolunteerController::class, 'startCampaignAssignment']
    );

    // Volunteer completes an in-progress assignment.

    Route::patch(
        '/volunteer/campaign-assignments/{id}/complete',
        [VolunteerController::class, 'completeCampaignAssignment']
    );

    // Volunteer requests withdrawal from an accepted/in-progress
    // campaign assignment.

    Route::patch(
        '/volunteer/campaign-assignments/{id}/withdraw',
        [VolunteerController::class, 'requestCampaignWithdrawal']
    );

    // =========================================================
    // ORGANIZATION
    // =========================================================

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
        '/organization/assignments/{id}',
        [OrganizationController::class, 'updateAssignment']
    );

    Route::patch(
        '/organization/assignments/{id}/withdraw',
        [OrganizationController::class, 'requestWithdrawal']
    );

    // ---------------------------------------------------------
    // ORGANIZATION CAMPAIGNS
    // ---------------------------------------------------------

    Route::get(
        '/organization/campaigns',
        [CampaignController::class, 'organizationCampaigns']
    );

    // ---------------------------------------------------------
    // CAMPAIGNS
    // ---------------------------------------------------------

    Route::post(
        '/campaigns',
        [CampaignController::class, 'store']
    );

    // ---------------------------------------------------------
    // DONATIONS
    // ---------------------------------------------------------

    Route::get(
        '/donations/my',
        [DonationController::class, 'myDonations']
    );

    Route::post(
        '/donations',
        [DonationController::class, 'store']
    );
});

// =============================================================
// ADMIN
// =============================================================

Route::middleware('auth:sanctum')
    ->prefix('admin')
    ->group(function () {

        // ---------------------------------------------------------
        // DASHBOARD
        // ---------------------------------------------------------

        Route::get(
            '/dashboard',
            [AdminController::class, 'dashboard']
        );

        // ---------------------------------------------------------
        // USERS
        // ---------------------------------------------------------

        Route::get(
            '/users',
            [AdminController::class, 'users']
        );

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
        // ORGANIZATIONS
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
        // HELP REQUESTS
        // ---------------------------------------------------------

        Route::get(
            '/help-requests',
            [AdminController::class, 'helpRequests']
        );

        Route::put(
            '/help-requests/{id}',
            [AdminController::class, 'updateHelpRequest']
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

        // =========================================================
        // VOLUNTEERS
        // =========================================================

        Route::get(
            '/volunteers',
            [VolunteerController::class, 'index']
        );

        Route::get(
            '/volunteers/candidates',
            [VolunteerController::class, 'candidates']
        );

        // IMPORTANT:
        // All specific /volunteers/requests routes must remain
        // before /volunteers/{id}.

        Route::get(
            '/volunteers/requests',
            [VolunteerController::class, 'requests']
        );

        // Admin sends volunteer invitations.
        // Admin = sender.
        // Individual = receiver.

        Route::post(
            '/volunteers/requests',
            [VolunteerController::class, 'sendRequests']
        );

        // Admin receives individual volunteer applications.
        // Individual = sender.
        // Admin = receiver.

        Route::patch(
            '/volunteers/requests/{id}/accept',
            [VolunteerController::class, 'acceptVolunteerApplication']
        );

        Route::patch(
            '/volunteers/requests/{id}/reject',
            [VolunteerController::class, 'rejectVolunteerApplication']
        );

        // Admin cancels an invitation sent by admin.
        // Admin = sender.

        Route::patch(
            '/volunteers/requests/{id}/cancel',
            [VolunteerController::class, 'cancelVolunteerInvitation']
        );

        // ---------------------------------------------------------
        // VOLUNTEER DETAILS / STATUS
        // ---------------------------------------------------------

        // Admin can view a volunteer profile.

        Route::get(
            '/volunteers/{id}',
            [VolunteerController::class, 'adminShow']
        );

        // Admin can change ONLY volunteer status:
        // active / inactive / suspended.
        //
        // Name/email are managed through Users.

        Route::patch(
            '/volunteers/{id}/status',
            [VolunteerController::class, 'updateStatus']
        );

        // ---------------------------------------------------------
        // CAMPAIGN VOLUNTEER CANDIDATES
        // ---------------------------------------------------------

        Route::get(
            '/campaign-volunteers/candidates',
            [AdminController::class, 'campaignVolunteerCandidates']
        );

        // =========================================================
        // CAMPAIGNS
        // =========================================================

        Route::post(
            '/campaigns',
            [AdminController::class, 'storeCampaign']
        );

        Route::get(
            '/campaigns',
            [AdminController::class, 'campaigns']
        );

        Route::put(
            '/campaigns/{id}',
            [AdminController::class, 'updateCampaign']
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

        Route::get(
            '/campaigns/{id}/assignments',
            [AdminController::class, 'campaignVolunteerAssignments']
        );

        // ---------------------------------------------------------
        // CAMPAIGN VOLUNTEER ASSIGNMENT REVIEW
        // ---------------------------------------------------------

        // Admin reviews a volunteer withdrawal request.

        Route::patch(
            '/campaigns/assignments/{id}/withdrawal',
            [VolunteerController::class, 'reviewCampaignWithdrawal']
        );

        // Admin validates a volunteer rejection when required.

        Route::patch(
            '/campaigns/assignments/{id}/rejection-validation',
            [VolunteerController::class, 'validateCampaignRejection']
        );

        // =========================================================
        // DONATIONS
        // =========================================================

        Route::get(
            '/donations',
            [AdminController::class, 'donations']
        );

        // =========================================================
        // REPORTS
        // =========================================================

        Route::get(
            '/reports',
            [AdminController::class, 'reports']
        );
    });
