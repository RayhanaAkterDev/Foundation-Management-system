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

        // Only individuals and organizations can submit help requests.
        if (!in_array($user->role, ['individual', 'organization'])) {
            return response()->json([
                'message' => 'Only individuals and organizations can submit help requests.',
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

        // Users can only view their own requests.
        if ($helpRequest->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not authorized to view this help request.',
            ], 403);
        }

        return response()->json([
            'help_request' => $helpRequest,
        ]);
    }
}