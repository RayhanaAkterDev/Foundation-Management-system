<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\HelpRequest;
use App\Models\Volunteer;
use Illuminate\Http\Request;

class IndividualDashboardController extends Controller
{
    /**
     * Individual dashboard
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // ---------------------------------------------------------
        // Authorization
        // ---------------------------------------------------------
        if (!$user || $user->role !== 'individual') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // ---------------------------------------------------------
        // User information
        // ---------------------------------------------------------
        $individualUser = [
            'id' => $user->id,
            'name' => $user->name,
            'district' => $user->district ?? null,
            'memberSince' => $user->created_at,
        ];

        // ---------------------------------------------------------
        // HELP REQUESTS
        // ---------------------------------------------------------
        //
        // IMPORTANT:
        // Always fetch the user's OWN requests.
        // Do NOT filter only by pending/verified/etc.
        //
        // latest() means the newest request is returned first.
        //
        $helpRequests = HelpRequest::where('user_id', $user->id)
            ->latest('created_at')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'title' => $request->title,
                    'category' => $request->category,
                    'status' => $request->status,
                    'notes' => $request->description,
                    'district' => $request->district,
                    'address' => $request->address,
                    'urgency' => $request->urgency,
                    'submittedDate' => $request->created_at,
                    'created_at' => $request->created_at,
                    'updated_at' => $request->updated_at,
                ];
            })
            ->values();

        // ---------------------------------------------------------
        // DONATION SUMMARY
        // ---------------------------------------------------------
        $donations = Donation::where('user_id', $user->id)
            ->where('status', 'completed');

        $donationSummary = [
            'totalDonated' => (float) $donations->sum('amount'),
            'donationCount' => $donations->count(),
        ];

        // ---------------------------------------------------------
        // VOLUNTEER SUMMARY
        // ---------------------------------------------------------
        $volunteer = Volunteer::where('user_id', $user->id)->first();

        $volunteerSummary = [
            'totalHours' => $volunteer?->total_hours ?? 0,
            'activitiesCount' => $volunteer ? 1 : 0,
        ];

        // ---------------------------------------------------------
        // ACTIVE CAMPAIGNS
        // ---------------------------------------------------------
        $activeCampaigns = Campaign::where('status', 'active')
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function ($campaign) {
                $goal = (float) ($campaign->goal_amount ?? $campaign->target_amount ?? 0);
                $raised = (float) ($campaign->collected_amount ?? 0);

                $progress = $goal > 0
                    ? round(($raised / $goal) * 100)
                    : 0;

                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'category' => $campaign->category,
                    'status' => $campaign->status,
                    'goal' => $goal,
                    'raised' => $raised,
                    'progress' => min($progress, 100),
                    'deadline' => $campaign->deadline ?? null,
                    'created_at' => $campaign->created_at,
                ];
            })
            ->values();

        // ---------------------------------------------------------
        // ACTIVITY
        // ---------------------------------------------------------
        $activity = collect();

        // Help request activity
        foreach (
            HelpRequest::where('user_id', $user->id)
                ->latest('created_at')
                ->take(5)
                ->get()
            as $item
        ) {
            $activity->push([
                'id' => 'help-request-' . $item->id,
                'type' => 'help_request',
                'title' => 'Help request submitted: ' . $item->title,
                'description' => $item->description,
                'action' => 'Submitted a help request',
                'date' => $item->created_at,
                'created_at' => $item->created_at,
            ]);
        }

        // Donation activity
        foreach (
            Donation::where('user_id', $user->id)
                ->where('status', 'completed')
                ->latest('created_at')
                ->take(5)
                ->get()
            as $item
        ) {
            $activity->push([
                'id' => 'donation-' . $item->id,
                'type' => 'donation',
                'title' => 'Donation of ৳' . number_format((float) $item->amount, 2),
                'description' => 'Your donation was recorded successfully.',
                'action' => 'Made a donation',
                'date' => $item->created_at,
                'created_at' => $item->created_at,
            ]);
        }

        // Volunteer activity
        if ($volunteer) {
            $activity->push([
                'id' => 'volunteer-' . $volunteer->id,
                'type' => 'volunteer',
                'title' => 'Volunteer profile',
                'description' => 'Your volunteer profile is ' . $volunteer->status . '.',
                'action' => 'Volunteer activity',
                'date' => $volunteer->created_at,
                'created_at' => $volunteer->created_at,
            ]);
        }

        $activity = $activity
            ->sortByDesc('created_at')
            ->take(8)
            ->values();

        // ---------------------------------------------------------
        // RESPONSE
        // ---------------------------------------------------------
        return response()->json([
            'user' => $individualUser,

            'donationSummary' => $donationSummary,

            'volunteerSummary' => $volunteerSummary,

            // IMPORTANT:
            // Index 0 is ALWAYS the newest help request.
            'helpRequests' => $helpRequests,

            'activeCampaigns' => $activeCampaigns,

            'activity' => $activity,
        ]);
    }
}
