<?php

namespace App\Http\Controllers;

use App\Models\HelpRequestAssignment;
use App\Models\Organization;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    /**
     * Organization: View assigned help requests.
     */
    public function assignments(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignments = HelpRequestAssignment::with([
            'helpRequest',
            'assignedBy:id,name,email',
        ])
            ->where(
                'organization_id',
                $organization->id
            )
            ->latest()
            ->get();

        return response()->json([
            'assignments' => $assignments,
        ]);
    }

    /**
     * Organization: Accept a pending help request assignment.
     *
     * pending -> accepted
     */
    public function acceptAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_PENDING
        ) {
            return response()->json([
                'message' =>
                'Only pending assignments can be accepted.',
            ], 422);
        }

        $assignment->update([
            'status' =>
            HelpRequestAssignment::STATUS_ACCEPTED,
        ]);

        return response()->json([
            'message' =>
            'Help request assignment accepted successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: Reject a pending help request assignment.
     *
     * pending -> rejected
     */
    public function rejectAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_PENDING
        ) {
            return response()->json([
                'message' =>
                'Only pending assignments can be rejected.',
            ], 422);
        }

        $validated = $request->validate([
            'rejection_note' => [
                'required',
                'string',
                'max:2000',
            ],
        ]);

        $assignment->update([
            'status' =>
            HelpRequestAssignment::STATUS_REJECTED,

            'rejection_note' =>
            trim($validated['rejection_note']),
        ]);

        return response()->json([
            'message' =>
            'Help request assignment rejected successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Compatibility endpoint for the old assignment workflow.
     *
     * Assignment status no longer has an in_progress state.
     *
     * The Help Request itself owns the in_progress state.
     */
    public function startAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'message' =>
            'Starting an assignment is no longer supported. An accepted assignment remains accepted.',
        ], 422);
    }

    /**
     * Compatibility endpoint for the old assignment workflow.
     *
     * Assignment status no longer has a completed state.
     *
     * Completion belongs to HelpRequest.status.
     */
    public function completeAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json([
            'message' =>
            'Completing an assignment is no longer supported. Completion belongs to the help request workflow.',
        ], 422);
    }

    /**
     * Organization: Request withdrawal from an accepted assignment.
     *
     * accepted
     *     ↓
     * withdrawal_status = pending
     *
     * The assignment remains accepted until Admin approves
     * the withdrawal request.
     */
    public function requestWithdrawal(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->with('helpRequest')
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Only Accepted Assignments Can Request Withdrawal
        |--------------------------------------------------------------------------
        |
        | pending    -> cannot withdraw
        | accepted   -> can request withdrawal
        | rejected   -> cannot withdraw
        | withdrawn  -> cannot withdraw again
        |
        */

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' =>
                'Only accepted assignments can be withdrawn.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Pending Request
        |--------------------------------------------------------------------------
        */

        if (
            $assignment->withdrawal_status ===
            HelpRequestAssignment::WITHDRAWAL_PENDING
        ) {
            return response()->json([
                'message' =>
                'A withdrawal request is already pending for this assignment.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Withdrawal Reason
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'withdrawal_reason' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create Withdrawal Request
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | The assignment status remains accepted.
        |
        | It changes to withdrawn only after Admin approves
        | the withdrawal request.
        |
        */

        $assignment->update([
            'withdrawal_status' =>
            HelpRequestAssignment::WITHDRAWAL_PENDING,

            'withdrawal_reason' =>
            trim($validated['withdrawal_reason']),

            'withdrawal_requested_at' => now(),

            'withdrawal_reviewed_at' => null,

            'withdrawal_reviewed_by' => null,
        ]);

        return response()->json([
            'message' =>
            'Withdrawal request submitted successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'organization',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: Update selected fields of an accepted help request.
     *
     * Organizations can only modify:
     * - category
     * - urgency / priority
     *
     * Protected:
     * - title
     * - description
     * - requester
     * - district
     * - address
     * - people affected
     * - amount needed
     * - assignment information
     * - verification information
     */
    public function updateAssignment(
        Request $request,
        int $id
    ) {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::where(
            'id',
            $id
        )
            ->where(
                'organization_id',
                $organization->id
            )
            ->with('helpRequest')
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Only Accepted Assignments Can Be Edited
        |--------------------------------------------------------------------------
        */

        if (
            $assignment->status !==
            HelpRequestAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' =>
                'Only accepted assignments can be edited.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Make Sure Help Request Exists
        |--------------------------------------------------------------------------
        */

        $helpRequest = $assignment->helpRequest;

        if (!$helpRequest) {
            return response()->json([
                'message' =>
                'Help request not found for this assignment.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Only Organization-Editable Fields
        |--------------------------------------------------------------------------
        |
        | Valid urgency values:
        | low, normal, high, critical
        |
        */

        $validated = $request->validate([
            'category' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'urgency' => [
                'sometimes',
                'required',
                'string',
                'in:low,normal,high,critical',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Make Sure At Least One Editable Field Was Sent
        |--------------------------------------------------------------------------
        */

        if (empty($validated)) {
            return response()->json([
                'message' =>
                'No changes were provided.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Update Help Request
        |--------------------------------------------------------------------------
        */

        $helpRequest->update($validated);

        return response()->json([
            'message' =>
            'Help request updated successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }
}
