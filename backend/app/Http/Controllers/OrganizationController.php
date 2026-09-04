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
}
