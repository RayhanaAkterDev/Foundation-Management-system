<?php

namespace App\Http\Controllers;

use App\Models\HelpRequestAssignment;
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
                'message' => 'Only organization users can view assignments.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignments = HelpRequestAssignment::with([
            'helpRequest',
            'assignedBy:id,name,email',
        ])
            ->where('organization_id', $organization->id)
            ->latest()
            ->get();

        return response()->json([
            'assignments' => $assignments,
        ]);
    }

    /**
     * Organization: Accept an assigned help request.
     */
    public function acceptAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can accept assignments.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('organization_id', $organization->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if ($assignment->status !== 'assigned') {
            return response()->json([
                'message' => 'Only assigned requests can be accepted.',
            ], 422);
        }

        $assignment->update([
            'status' => 'accepted',
        ]);

        return response()->json([
            'message' => 'Help request accepted successfully.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Organization: Reject an assigned help request.
     */
    public function rejectAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can reject assignments.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('organization_id', $organization->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if ($assignment->status !== 'assigned') {
            return response()->json([
                'message' => 'Only assigned requests can be rejected.',
            ], 422);
        }

        $assignment->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Help request rejected successfully.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Organization: Start working on an accepted assignment.
     */
    public function startAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can start assignments.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('organization_id', $organization->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if ($assignment->status !== 'accepted') {
            return response()->json([
                'message' => 'Only accepted assignments can be started.',
            ], 422);
        }

        $assignment->update([
            'status' => 'in_progress',
        ]);

        return response()->json([
            'message' => 'Help request marked as in progress.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Organization: Complete an in-progress assignment.
     */
    public function completeAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'organization') {
            return response()->json([
                'message' => 'Only organization users can complete assignments.',
            ], 403);
        }

        $organization = $user->organization;

        if (!$organization) {
            return response()->json([
                'message' => 'Organization profile not found.',
            ], 404);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('organization_id', $organization->id)
            ->first();

        if (!$assignment) {
            return response()->json([
                'message' => 'Assignment not found.',
            ], 404);
        }

        if ($assignment->status !== 'in_progress') {
            return response()->json([
                'message' => 'Only in-progress assignments can be completed.',
            ], 422);
        }

        $assignment->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Help request completed successfully.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'assignedBy:id,name,email',
            ]),
        ]);
    }
}
