<?php

namespace App\Http\Controllers;

use App\Models\HelpRequest;
use Illuminate\Http\Request;

class HelpRequestController extends Controller
{
    /**
     * Submit a new help request.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can submit help requests.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'address' => 'nullable|string|max:1000',
            'urgency' => 'nullable|in:low,normal,high,critical',
        ]);

        $helpRequest = HelpRequest::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'district' => $validated['district'],
            'address' => $validated['address'] ?? null,
            'urgency' => $validated['urgency'] ?? 'normal',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Help request submitted successfully.',
            'help_request' => $helpRequest->load('user'),
        ], 201);
    }

    /**
     * Get all help requests belonging to the authenticated individual.
     */
    public function myRequests(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can view their help requests.',
            ], 403);
        }

        $helpRequests = HelpRequest::with([
            'assignments.organization',
            'assignments.volunteer.user',
        ])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'help_requests' => $helpRequests,
        ], 200);
    }

    /**
     * Show a specific help request.
     */
    public function show(Request $request, int $id)
    {
        $helpRequest = HelpRequest::with([
            'user',
            'assignments.organization',
            'assignments.volunteer.user',
        ])->find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to view this help request.',
            ], 403);
        }

        return response()->json([
            'help_request' => $helpRequest,
        ], 200);
    }

    /**
     * Update a help request.
     *
     * Only the owner of a pending request can edit it.
     */
    public function update(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can update help requests.',
            ], 403);
        }

        $helpRequest = HelpRequest::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        /*
     * Only pending requests can be edited.
     */
        if ($helpRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending help requests can be edited.',
            ], 422);
        }

        /*
     * PATCH request:
     * Every field is optional because the frontend
     * sends only the fields that were changed.
     */
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'district' => 'sometimes|required|string|max:100',
            'address' => 'sometimes|nullable|string|max:1000',
            'urgency' => 'sometimes|required|in:low,normal,high,critical',
        ]);

        /*
     * Update only the fields actually sent
     * by the frontend.
     */
        $helpRequest->update($validated);

        /*
     * Return the updated request.
     */
        return response()->json([
            'message' => 'Help request updated successfully.',
            'help_request' => $helpRequest->fresh()->load([
                'user',
                'assignments.organization',
                'assignments.volunteer.user',
            ]),
        ], 200);
    }

    /**
     * Delete a help request.
     *
     * Only the owner of a pending request can delete it.
     */
    public function destroy(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can delete help requests.',
            ], 403);
        }

        $helpRequest = HelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json([
                'message' => 'Help request not found.',
            ], 404);
        }

        if ($helpRequest->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to delete this help request.',
            ], 403);
        }

        /*
         * Once admin has reviewed the request, it becomes
         * immutable from the individual's side.
         */
        if ($helpRequest->status !== 'pending') {
            return response()->json([
                'message' => 'This help request can no longer be deleted because it has already been reviewed.',
            ], 422);
        }

        $helpRequest->delete();

        return response()->json([
            'message' => 'Help request deleted successfully.',
        ], 200);
    }
}
