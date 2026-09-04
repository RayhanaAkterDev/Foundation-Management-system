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

        /*
        |--------------------------------------------------------------------------
        | Validate rejection reason
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'rejection_note' => [
                'required',
                'string',
                'max:2000',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Reject assignment
        |--------------------------------------------------------------------------
        |
        | Keep organization_id so Admin can see which organization
        | rejected the assignment and the reason.
        |
        */

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
     * Organization: Start working on an accepted assignment.
     *
     * accepted -> in_progress
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
            HelpRequestAssignment::STATUS_ACCEPTED
        ) {
            return response()->json([
                'message' =>
                'Only accepted assignments can be started.',
            ], 422);
        }

        $assignment->update([
            'status' =>
            HelpRequestAssignment::STATUS_IN_PROGRESS,
        ]);

        return response()->json([
            'message' =>
            'Help request assignment started successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: Complete an in-progress assignment.
     *
     * in_progress -> completed
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
            HelpRequestAssignment::STATUS_IN_PROGRESS
        ) {
            return response()->json([
                'message' =>
                'Only in-progress assignments can be completed.',
            ], 422);
        }

        $assignment->update([
            'status' =>
            HelpRequestAssignment::STATUS_COMPLETED,

            'completed_at' => now(),
        ]);

        return response()->json([
            'message' =>
            'Help request assignment completed successfully.',

            'assignment' => $assignment
                ->fresh()
                ->load([
                    'helpRequest',
                    'assignedBy:id,name,email',
                ]),
        ]);
    }

    /**
     * Organization: Update selected fields of an assigned help request.
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

        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Find Organization Profile
        |--------------------------------------------------------------------------
        */

        $organization = Organization::where(
            'user_id',
            $user->id
        )->first();

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Find Assignment Belonging To This Organization
        |--------------------------------------------------------------------------
        */

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
        | Only Accepted / In-Progress Assignments Can Be Edited
        |--------------------------------------------------------------------------
        */

        if (!in_array($assignment->status, [
            HelpRequestAssignment::STATUS_ACCEPTED,
            HelpRequestAssignment::STATUS_IN_PROGRESS,
        ], true)) {
            return response()->json([
                'message' =>
                'Only accepted or in-progress assignments can be edited.',
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
        | IMPORTANT:
        |
        | The application's valid priority values are:
        | low, normal, high, critical
        |
        | "medium" is NOT a valid urgency value.
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

        /*
        |--------------------------------------------------------------------------
        | Return Fresh Database Data
        |--------------------------------------------------------------------------
        */

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
