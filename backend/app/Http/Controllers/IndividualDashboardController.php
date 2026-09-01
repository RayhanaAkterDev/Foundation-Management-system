<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IndividualDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'name' => $user->name,
                'district' => $user->district ?? null,
                'memberSince' => $user->created_at,
            ],

            'donationSummary' => [
                'totalDonated' => 0,
                'donationCount' => 0,
            ],

            'volunteerSummary' => [
                'totalHours' => 0,
                'activitiesCount' => 0,
            ],

            'helpRequests' => [],

            'activeCampaigns' => [],

            'activity' => [],
        ]);
    }
}