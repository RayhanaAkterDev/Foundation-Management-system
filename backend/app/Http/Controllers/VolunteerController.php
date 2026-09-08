<?php

namespace App\Http\Controllers;

use App\Models\CampaignVolunteerAssignment;
use App\Models\Volunteer;
use App\Models\User;
use App\Services\Campaign\CampaignService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VolunteerController extends Controller
{
    /**
     * Update volunteer availability based on volunteer status
     * and active campaign assignments.
     */
    private function syncVolunteerAvailability(int $userId): void
    {
        $volunteer = Volunteer::where('user_id', $userId)->first();

        if (!$volunteer) {
            return;
        }

        if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
            $volunteer->update([
                'availability' => null,
            ]);

            return;
        }

        $hasActiveCampaignAssignment = CampaignVolunteerAssignment::where(
            'volunteer_id',
            $userId
        )
            ->whereIn(
                'status',
                CampaignVolunteerAssignment::activeStatuses()
            )
            ->exists();

        $volunteer->update([
            'availability' => $hasActiveCampaignAssignment
                ? 'unavailable'
                : 'available',
        ]);
    }

    /**
     * Admin: View all volunteers.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteers = Volunteer::with([
            'user:id,name,email,status',
            'organization:id,name',
        ])
            ->latest()
            ->get();

        return response()->json([
            'volunteers' => $volunteers,
        ]);
    }

    /**
     * Individual: Apply to become a volunteer.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can apply as volunteers.',
            ], 403);
        }

        if ($user->volunteer) {
            return response()->json([
                'message' => 'You already have a volunteer application.',
            ], 422);
        }

        $validated = $request->validate([
            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],
            'district' => [
                'nullable',
                'string',
                'max:100',
            ],
            'address' => [
                'nullable',
                'string',
            ],
            'skills' => [
                'nullable',
                'string',
            ],
            'availability' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        $volunteer = Volunteer::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'district' => $validated['district'] ?? null,
            'address' => $validated['address'] ?? null,
            'skills' => $validated['skills'] ?? null,
            'availability' => null,
            'status' => Volunteer::STATUS_PENDING,
        ]);

        return response()->json([
            'message' => 'Volunteer application submitted successfully.',
            'volunteer' => $volunteer->load('user'),
        ], 201);
    }

    /**
     * Individual: View own volunteer profile/application.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can view volunteer information.',
            ], 403);
        }

        $volunteer = Volunteer::with([
            'user:id,name,email,status',
            'organization:id,name',
        ])
            ->where('user_id', $user->id)
            ->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        return response()->json([
            'volunteer' => $volunteer,
        ]);
    }

    /**
     * Individual: View own campaign assignments.
     *
     * Volunteers are no longer directly connected to Help Requests.
     */
    public function assignments(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can view volunteer assignments.',
            ], 403);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        $assignments = $volunteer->campaignVolunteerAssignments()
            ->with([
                'campaign',
                'assignedBy:id,name,email',
                'volunteer:id,name,email',
                'withdrawalReviewedBy:id,name,email',
            ])
            ->latest()
            ->get();

        return response()->json([
            'assignments' => $assignments,
        ]);
    }

    /**
     * Individual: Accept an assigned campaign.
     */
    public function acceptCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can accept campaign assignments.',
            ], 403);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
            return response()->json([
                'message' => 'Only active volunteers can accept campaign assignments.',
            ], 422);
        }

        $assignment = CampaignVolunteerAssignment::with('campaign')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_ASSIGNED
        ) {
            return response()->json([
                'message' => 'Only assigned campaign assignments can be accepted.',
            ], 422);
        }

        $assignment->update([
            'status' => CampaignVolunteerAssignment::STATUS_ACCEPTED,
        ]);

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' => 'Campaign assignment accepted successfully.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Reject an assigned campaign.
     *
     * A rejection reason is required so that the admin can determine
     * whether the rejection is justified.
     */
    public function rejectCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can reject campaign assignments.',
            ], 403);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
            return response()->json([
                'message' => 'Only active volunteers can reject campaign assignments.',
            ], 422);
        }

        $assignment = CampaignVolunteerAssignment::with('campaign')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_ASSIGNED
        ) {
            return response()->json([
                'message' => 'Only assigned campaign assignments can be rejected.',
            ], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => [
                'required',
                'string',
                'min:5',
            ],
        ]);

        $assignment->update([
            'status' => CampaignVolunteerAssignment::STATUS_REJECTED,
            'rejection_reason' => $validated['rejection_reason'],
            'rejection_validated' => null,
        ]);

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' => 'Campaign assignment rejected successfully.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Start an accepted campaign assignment.
     */
    public function startCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can start campaign assignments.',
            ], 403);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        if ($volunteer->status !== Volunteer::STATUS_ACTIVE) {
            return response()->json([
                'message' => 'Only active volunteers can start campaign assignments.',
            ], 422);
        }

        $assignment = CampaignVolunteerAssignment::with('campaign')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' => 'Only accepted campaign assignments can be started.',
            ], 422);
        }

        $assignment->update([
            'status' => CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
        ]);

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' => 'Campaign assignment marked as in progress.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Complete an in-progress campaign assignment.
     *
     * Completing the assignment triggers the campaign completion check.
     */
    public function completeCampaignAssignment(
        Request $request,
        int $id,
        CampaignService $campaignService
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can complete campaign assignments.',
            ], 403);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        $assignment = CampaignVolunteerAssignment::with('campaign')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_IN_PROGRESS
        ) {
            return response()->json([
                'message' =>
                'Only in-progress campaign assignments can be completed.',
            ], 422);
        }

        $assignment->update([
            'status' => CampaignVolunteerAssignment::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        $campaign = $campaignService->completeCampaignIfEligible(
            $assignment->campaign
        );

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' => 'Campaign assignment completed successfully.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
            ]),
            'campaign' => $campaign,
        ]);
    }

    /**
     * Individual: Request withdrawal from an accepted/in-progress campaign.
     */
    public function requestCampaignWithdrawal(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can request campaign withdrawal.',
            ], 403);
        }

        $volunteer = Volunteer::where('user_id', $user->id)->first();

        if (!$volunteer) {
            return response()->json([
                'message' => 'You are not registered as a volunteer.',
            ], 404);
        }

        $assignment = CampaignVolunteerAssignment::with('campaign')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (!in_array($assignment->status, [
            CampaignVolunteerAssignment::STATUS_ACCEPTED,
            CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
        ], true)) {
            return response()->json([
                'message' =>
                'Only accepted or in-progress campaign assignments can be withdrawn.',
            ], 422);
        }

        $validated = $request->validate([
            'withdrawal_reason' => [
                'required',
                'string',
                'min:5',
            ],
        ]);

        $assignment->update([
            'status' =>
            CampaignVolunteerAssignment::STATUS_WITHDRAWAL_REQUESTED,
            'withdrawal_reason' => $validated['withdrawal_reason'],
            'withdrawal_requested_at' => now(),
            'withdrawal_reviewed_at' => null,
            'withdrawal_reviewed_by' => null,
        ]);

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' =>
            'Campaign withdrawal request submitted successfully.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Admin: Review a volunteer campaign withdrawal request.
     *
     * Approved -> withdrawn -> volunteer becomes available.
     * Rejected -> in_progress -> volunteer remains occupied.
     */
    public function reviewCampaignWithdrawal(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'decision' => [
                'required',
                'in:approved,rejected',
            ],
            'review_note' => [
                'nullable',
                'string',
            ],
        ]);

        $assignment = CampaignVolunteerAssignment::with('campaign')
            ->find($id);

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_WITHDRAWAL_REQUESTED
        ) {
            return response()->json([
                'message' =>
                'Only pending withdrawal requests can be reviewed.',
            ], 422);
        }

        DB::transaction(function () use (
            $assignment,
            $validated,
            $user
        ) {
            if ($validated['decision'] === 'approved') {
                $assignment->update([
                    'status' =>
                    CampaignVolunteerAssignment::STATUS_WITHDRAWN,
                    'withdrawal_reviewed_at' => now(),
                    'withdrawal_reviewed_by' => $user->id,
                ]);
            } else {
                $assignment->update([
                    'status' =>
                    CampaignVolunteerAssignment::STATUS_IN_PROGRESS,
                    'withdrawal_reviewed_at' => now(),
                    'withdrawal_reviewed_by' => $user->id,
                ]);
            }
        });

        $this->syncVolunteerAvailability($assignment->volunteer_id);

        return response()->json([
            'message' => $validated['decision'] === 'approved'
                ? 'Campaign withdrawal approved successfully.'
                : 'Campaign withdrawal rejected successfully.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
                'withdrawalReviewedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Admin: Validate a volunteer's campaign rejection.
     *
     * Valid rejection -> rejection_validated = true
     * Invalid rejection -> rejection_validated = false
     */
    public function validateCampaignRejection(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $validated = $request->validate([
            'is_valid' => [
                'required',
                'boolean',
            ],
        ]);

        $assignment = CampaignVolunteerAssignment::find($id);

        if (!$assignment) {
            return response()->json([
                'message' => 'Campaign assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            CampaignVolunteerAssignment::STATUS_REJECTED
        ) {
            return response()->json([
                'message' =>
                'Only rejected campaign assignments can be validated.',
            ], 422);
        }

        $assignment->update([
            'rejection_validated' => $validated['is_valid'],
        ]);

        return response()->json([
            'message' => $validated['is_valid']
                ? 'Rejection marked as valid.'
                : 'Rejection marked as invalid.',
            'assignment' => $assignment->fresh()->load([
                'campaign',
                'volunteer:id,name,email',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Admin: View a specific volunteer.
     */
    public function adminShow(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteer = Volunteer::with([
            'user:id,name,email,status',
            'organization:id,name',
            'campaignVolunteerAssignments.campaign',
        ])->find($id);

        if (!$volunteer) {
            return response()->json([
                'message' => 'Volunteer not found.',
            ], 404);
        }

        return response()->json([
            'volunteer' => $volunteer,
        ]);
    }

    /**
     * Admin: Approve, reject, suspend, or remove a volunteer.
     */
    public function updateStatus(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $volunteer = Volunteer::find($id);

        if (!$volunteer) {
            return response()->json([
                'message' => 'Volunteer not found.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:' . implode(',', Volunteer::statuses()),
            ],
        ]);

        $newStatus = $validated['status'];
        $currentStatus = $volunteer->status;

        /**
         * A volunteer can become active only from pending.
         */
        if (
            $newStatus === Volunteer::STATUS_ACTIVE &&
            !in_array($currentStatus, [
                Volunteer::STATUS_PENDING,
                Volunteer::STATUS_ACTIVE,
            ], true)
        ) {
            return response()->json([
                'message' =>
                'Only pending volunteers can be approved.',
            ], 422);
        }

        /**
         * A volunteer cannot be suspended or removed while
         * actively assigned to a campaign.
         *
         * Active campaign assignment statuses are:
         * assigned, accepted, in_progress, withdrawal_requested.
         */
        if (
            in_array($newStatus, [
                Volunteer::STATUS_SUSPENDED,
                Volunteer::STATUS_REMOVED,
            ], true)
        ) {
            $hasActiveCampaignAssignment =
                CampaignVolunteerAssignment::where(
                    'volunteer_id',
                    $volunteer->user_id
                )
                ->whereIn(
                    'status',
                    CampaignVolunteerAssignment::activeStatuses()
                )
                ->exists();

            if ($hasActiveCampaignAssignment) {
                return response()->json([
                    'message' =>
                    'This volunteer cannot be suspended or removed while they have an active campaign assignment.',
                ], 422);
            }
        }

        $volunteer->update([
            'status' => $newStatus,
        ]);

        $this->syncVolunteerAvailability($volunteer->user_id);

        $message = match ($newStatus) {
            Volunteer::STATUS_ACTIVE =>
            'Volunteer approved successfully.',
            Volunteer::STATUS_REJECTED =>
            'Volunteer rejected successfully.',
            Volunteer::STATUS_SUSPENDED =>
            'Volunteer suspended successfully.',
            Volunteer::STATUS_REMOVED =>
            'Volunteer removed successfully.',
            Volunteer::STATUS_PENDING =>
            'Volunteer status changed to pending.',
            default =>
            'Volunteer status updated successfully.',
        };

        return response()->json([
            'message' => $message,
            'volunteer' => $volunteer->fresh()->load([
                'user:id,name,email,status',
                'organization:id,name',
            ]),
        ]);
    }
}
