<?php

namespace App\Http\Controllers;

use App\Models\HelpRequest;
use App\Notifications\PlatformNotification;
use App\Models\User;
use Illuminate\Http\Request;

class HelpRequestController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Submit Help Request
    |--------------------------------------------------------------------------
    |
    | Only authenticated individual users can submit Help Requests.
    |
    | New Help Request:
    |
    | pending
    |
    */

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can submit help requests.',
            ], 403);
        }



        /*
        |--------------------------------------------------------------------------
        | Validate Request
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'category' => [
                'required',
                'string',
                'max:100',
            ],

            'district' => [
                'required',
                'string',
                'max:100',
            ],

            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'urgency' => [
                'nullable',
                'in:low,normal,high,critical',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create Help Request
        |--------------------------------------------------------------------------
        |
        | Status is always pending when a requester submits
        | a new Help Request.
        |
        */

        $helpRequest = HelpRequest::create([
            'user_id' => $user->id,

            'title' => $validated['title'],

            'description' => $validated['description'],

            'category' => $validated['category'],

            'district' => $validated['district'],

            'address' => $validated['address'] ?? null,

            'urgency' => $validated['urgency'] ?? 'normal',

            'status' => HelpRequest::STATUS_PENDING,

            'verification_note' => null,
        ]);

        User::where('role', 'admin')
            ->where('status', 'active')
            ->get()
            ->each(function ($admin) use ($helpRequest, $user) {
                $admin->notify(new PlatformNotification(
                    'New help request submitted',
                    "{$user->name} has submitted a new help request.",
                    '/dashboard/admin/help-requests',
                    'help_request'
                ));
            });

        return response()->json([
            'message' =>
            'Help request submitted successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                ]),
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | My Help Requests
    |--------------------------------------------------------------------------
    |
    | An individual can see only their own Help Requests.
    |
    */

    public function myRequests(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can view their help requests.',
            ], 403);
        }

        $helpRequests = HelpRequest::with([
            'assignments.organization',
            'assignments.volunteer',
            'assignments.assignedBy',
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'help_requests' => $helpRequests,
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Show Specific Help Request
    |--------------------------------------------------------------------------
    |
    | The requester can view only their own Help Request.
    |
    */

    public function show(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can view help requests.',
            ], 403);
        }

        $helpRequest = HelpRequest::with([
            'user',
            'assignments.organization',
            'assignments.volunteer',
            'assignments.assignedBy',
        ])->find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Ownership Check
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->user_id !== $user->id) {
            return response()->json([
                'message' =>
                'You are not authorized to view this help request.',
            ], 403);
        }

        return response()->json([
            'help_request' => $helpRequest,
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Help Request
    |--------------------------------------------------------------------------
    |
    | Only the owner of a pending Help Request can edit it.
    |
    | Once admin reviews it:
    |
    | pending -> verified
    | pending -> rejected
    |
    | the requester can no longer edit it.
    |
    */

    public function update(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can update help requests.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Find Request Owned By Current User
        |--------------------------------------------------------------------------
        */

        $helpRequest = HelpRequest::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Only Pending Requests Can Be Edited
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->status !== HelpRequest::STATUS_PENDING) {
            return response()->json([
                'message' =>
                'Only pending help requests can be edited.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Validate PATCH Data
        |--------------------------------------------------------------------------
        |
        | "sometimes" means the frontend can send only the
        | fields that were changed.
        |
        */

        $validated = $request->validate([
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'sometimes',
                'required',
                'string',
            ],

            'category' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'district' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'address' => [
                'sometimes',
                'nullable',
                'string',
                'max:1000',
            ],

            'urgency' => [
                'sometimes',
                'required',
                'in:low,normal,high,critical',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Update Only Submitted Fields
        |--------------------------------------------------------------------------
        */

        $helpRequest->update($validated);

        return response()->json([
            'message' =>
            'Help request updated successfully.',

            'help_request' => $helpRequest
                ->fresh()
                ->load([
                    'user',
                    'assignments.organization',
                    'assignments.volunteer',
                    'assignments.assignedBy',
                ]),
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Help Request
    |--------------------------------------------------------------------------
    |
    | Only the owner of a pending Help Request can delete it.
    |
    | Once the request has been reviewed, it becomes immutable
    | from the requester's side.
    |
    */

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' =>
                'Only individual users can delete help requests.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Find Request
        |--------------------------------------------------------------------------
        */

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
        |--------------------------------------------------------------------------
        | Ownership Check
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->user_id !== $user->id) {
            return response()->json([
                'message' =>
                'You are not authorized to delete this help request.',
            ], 403);
        }

        /*
        |--------------------------------------------------------------------------
        | Only Pending Requests Can Be Deleted
        |--------------------------------------------------------------------------
        */

        if ($helpRequest->status !== HelpRequest::STATUS_PENDING) {
            return response()->json([
                'message' =>
                'This help request can no longer be deleted because it has already been reviewed.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Delete
        |--------------------------------------------------------------------------
        |
        | The database relationship uses cascadeOnDelete() for
        | help_request_assignments.
        |
        | Normally a pending request should not have assignments,
        | but the database remains responsible for cleanup.
        |
        */

        $helpRequest->delete();

        return response()->json([
            'message' =>
            'Help request deleted successfully.',
        ], 200);
    }
}
