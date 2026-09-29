<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;

class PublicCommunityController extends Controller
{
    public function index(): JsonResponse
    {
        $volunteers = Volunteer::query()
            ->where('status', 'active')
            ->whereHas('user', function ($query) {
                $query
                    ->where('role', 'individual')
                    ->where('status', 'active')
                    ->whereNotNull('email_verified_at');
            })
            ->with([
                'user:id,name,status,email_verified_at',
            ])
            ->latest()
            ->get();

        $organizations = Organization::query()
            ->where('verification_status', 'verified')
            ->whereHas('user', function ($query) {
                $query
                    ->where('role', 'organization')
                    ->where('status', 'active')
                    ->whereNotNull('email_verified_at');
            })
            ->with([
                'user:id,name,status,email_verified_at',
            ])
            ->latest()
            ->get();

        return response()->json([
            'volunteers' => $volunteers,
            'organizations' => $organizations,
        ]);
    }
}
