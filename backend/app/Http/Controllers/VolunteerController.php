<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Volunteer;
use App\Models\HelpRequestAssignment;
use App\Models\CampaignVolunteerAssignment;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    /**
     * Update volunteer availability based on approval status
     * and active assignments.
     */
    private function syncVolunteerAvailability(int $userId): void
    {
        $volunteer = Volunteer::where('user_id', $userId)->first();

        if (!$volunteer) {
            return;
        }

        // Only approved volunteers can be available.
        if ($volunteer->status !== 'approved') {
            $volunteer->update([
                'availability' => null,
            ]);

            return;
        }

        $hasActiveHelpRequestAssignment = HelpRequestAssignment::where(
            'volunteer_id',
            $userId
        )
            ->whereIn('status', [
                'assigned',
                'accepted',
                'in_progress',
            ])
            ->exists();

        $hasActiveCampaignAssignment = CampaignVolunteerAssignment::where(
            'volunteer_id',
            $userId
        )
            ->whereIn('status', [
                'assigned',
                'accepted',
                'in_progress',
            ])
            ->exists();

        $volunteer->update([
            'availability' => (
                !$hasActiveHelpRequestAssignment &&
                !$hasActiveCampaignAssignment
            )
                ? 'available'
                : 'unavailable',
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
     * Individual: Join as a volunteer.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can apply as volunteers.',
            ], 403);
        }

        // Prevent duplicate volunteer applications.
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
        ]);

        $volunteer = Volunteer::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'district' => $validated['district'] ?? null,
            'address' => $validated['address'] ?? null,
            'skills' => $validated['skills'] ?? null,
            'status' => 'pending',
            'availability' => null,
        ]);

        return response()->json([
            'message' => 'Volunteer application submitted successfully.',
            'volunteer' => $volunteer->load('user'),
        ], 201);
    }

    /**
     * Individual: View own volunteer application.
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
     * Individual: View assigned help requests.
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

        $assignments = $volunteer->helpRequestAssignments()
            ->with([
                'helpRequest',
                'organization:id,name',
                'assignedBy:id,name,email',
            ])
            ->latest()
            ->get();

        return response()->json([
            'assignments' => $assignments,
        ]);
    }

    /**
     * Individual: Accept an assigned help request.
     */
    public function acceptAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can accept assignments.',
            ], 403);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
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

        $this->syncVolunteerAvailability($user->id);

        $assignment->helpRequest->syncStatusFromAssignments();

        return response()->json([
            'message' => 'Help request accepted successfully.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'organization:id,name',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Reject an assigned help request.
     */
    public function rejectAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can reject assignments.',
            ], 403);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
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

        $this->syncVolunteerAvailability($user->id);

        $assignment->helpRequest->syncStatusFromAssignments();

        return response()->json([
            'message' => 'Help request rejected successfully.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'organization:id,name',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Start working on an accepted assignment.
     */
    public function startAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can start assignments.',
            ], 403);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
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

        $this->syncVolunteerAvailability($user->id);

        $assignment->helpRequest->syncStatusFromAssignments();

        return response()->json([
            'message' => 'Help request marked as in progress.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'organization:id,name',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Complete an in-progress assignment.
     */
    public function completeAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can complete assignments.',
            ], 403);
        }

        $assignment = HelpRequestAssignment::with('helpRequest')
            ->where('id', $id)
            ->where('volunteer_id', $user->id)
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

        $this->syncVolunteerAvailability($user->id);

        $assignment->helpRequest->syncStatusFromAssignments();

        return response()->json([
            'message' => 'Help request completed successfully.',
            'assignment' => $assignment->fresh()->load([
                'helpRequest',
                'organization:id,name',
                'assignedBy:id,name,email',
            ]),
        ]);
    }

    /**
     * Individual: Accept an assigned campaign volunteer assignment.
     */
    public function acceptCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can accept campaign assignments.',
            ], 403);
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

        if ($assignment->status !== 'assigned') {
            return response()->json([
                'message' => 'Only assigned campaign assignments can be accepted.',
            ], 422);
        }

        $assignment->update([
            'status' => 'accepted',
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
     * Individual: Reject an assigned campaign volunteer assignment.
     */
    public function rejectCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can reject campaign assignments.',
            ], 403);
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

        if ($assignment->status !== 'assigned') {
            return response()->json([
                'message' => 'Only assigned campaign assignments can be rejected.',
            ], 422);
        }

        $assignment->update([
            'status' => 'rejected',
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
     * Individual: Start an accepted campaign volunteer assignment.
     */
    public function startCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can start campaign assignments.',
            ], 403);
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

        if ($assignment->status !== 'accepted') {
            return response()->json([
                'message' => 'Only accepted campaign assignments can be started.',
            ], 422);
        }

        $assignment->update([
            'status' => 'in_progress',
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
     * Individual: Complete an in-progress campaign volunteer assignment.
     */
    public function completeCampaignAssignment(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can complete campaign assignments.',
            ], 403);
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

        if ($assignment->status !== 'in_progress') {
            return response()->json([
                'message' => 'Only in-progress campaign assignments can be completed.',
            ], 422);
        }

        $assignment->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $this->syncVolunteerAvailability($user->id);

        return response()->json([
            'message' => 'Campaign assignment completed successfully.',
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
     * Admin: Approve or reject a volunteer application.
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
                'in:approved,inactive',
            ],
        ]);

        $volunteer->update([
            'status' => $validated['status'],
        ]);

        $this->syncVolunteerAvailability($volunteer->user_id);

        return response()->json([
            'message' => $validated['status'] === 'approved'
                ? 'Volunteer approved successfully.'
                : 'Volunteer marked as inactive successfully.',

            'volunteer' => $volunteer->fresh()->load([
                'user:id,name,email,status',
                'organization:id,name',
            ]),
        ]);
    }
}
