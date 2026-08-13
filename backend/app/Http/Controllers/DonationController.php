<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\Request;

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

        $donation = Donation::create([
            'user_id' => $user?->id,
            'campaign_id' => $campaign->id,
            'donor_name' => $validated['donor_name'] ?? $user?->name,
            'donor_email' => $validated['donor_email'] ?? $user?->email,
            'amount' => $validated['amount'],
            'status' => 'completed',
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'] ?? null,
        ]);

        $campaign->increment('collected_amount', $validated['amount']);

        return response()->json([
            'message' => 'Donation submitted successfully.',
            'donation' => $donation->load('campaign'),
        ], 201);
    }
}
