<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'campaign_id' => ['required', 'integer', 'exists:campaigns,id'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string', 'max:255'],
            'transaction_id' => ['nullable', 'string', 'max:255'],
            'donor_name' => ['nullable', 'string', 'max:255'],
            'donor_email' => ['nullable', 'email', 'max:255'],
        ]);

        $campaign = Campaign::where('status', 'active')
            ->find($validated['campaign_id']);

        if (!$campaign) {
            return response()->json([
                'message' => 'Campaign not found or is not active.',
            ], 404);
        }

        $user = $request->user();

        if ($user && $user->role !== 'individual') {
            return response()->json([
                'message' => 'Only individual users can make donations.',
            ], 403);
        }

        $donation = DB::transaction(function () use ($validated, $user, $campaign) {
            $donation = Donation::create([
                'user_id' => $user?->id,
                'donor_name' => $validated['donor_name'] ?? null,
                'donor_email' => $validated['donor_email'] ?? null,
                'campaign_id' => $campaign->id,
                'amount' => $validated['amount'],
                'status' => 'completed',
                'payment_method' => $validated['payment_method'],
                'transaction_id' => $validated['transaction_id'] ?? null,
            ]);

            $campaign->increment(
                'collected_amount',
                $validated['amount']
            );

            return $donation;
        });

        return response()->json([
            'message' => 'Donation submitted successfully.',
            'donation' => $donation->load('campaign'),
        ], 201);
    }
}
