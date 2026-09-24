<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicCampaignController extends Controller
{
    /**
     * Display a list of publicly visible active campaigns.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::query()
            ->where('status', Campaign::STATUS_ACTIVE)
            ->with([
                'organization:id,name',
            ])
            ->withCount('donations');

        if ($request->filled('category') && strtolower($request->category) !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $driver = DB::connection()->getDriverName();
            $likeOperator = $driver === 'pgsql' ? 'ILIKE' : 'LIKE';

            $query->where(function ($q) use ($search, $likeOperator) {
                $q->where('title', $likeOperator, $search)
                    ->orWhere('description', $likeOperator, $search);
            });
        }

        $campaigns = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $campaigns->map(fn ($c) => $this->formatCampaign($c)),
        ]);
    }

    /**
     * Display a single active campaign by ID.
     */
    public function show(int $id): JsonResponse
    {
        $campaign = Campaign::query()
            ->where('status', Campaign::STATUS_ACTIVE)
            ->with([
                'organization:id,name',
            ])
            ->withCount('donations')
            ->find($id);

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatCampaign($campaign),
        ]);
    }

    /**
     * Return unique categories with counts from active campaigns.
     */
    public function categories(): JsonResponse
    {
        $categories = Campaign::query()
            ->where('status', Campaign::STATUS_ACTIVE)
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->select('category as name', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Format campaign data safely for public consumption.
     */
    private function formatCampaign(Campaign $c): array
    {
        $targetAmount = (float) ($c->target_amount ?? 0);
        $collectedAmount = (float) ($c->collected_amount ?? 0);
        $progress = $targetAmount > 0
            ? min(100, (int) round(($collectedAmount / $targetAmount) * 100))
            : 0;

        $daysLeft = null;
        if ($c->end_date) {
            $endDate = Carbon::parse($c->end_date)->startOfDay();
            $today = now()->startOfDay();
            $diff = (int) $today->diffInDays($endDate, false);
            $daysLeft = max(0, $diff);
        }

        return [
            'id' => $c->id,
            'title' => $c->title,
            'description' => $c->description,
            'shortDescription' => Str::limit(strip_tags($c->description ?? ''), 120),
            'category' => $c->category,
            'type' => $c->type ?? 'local_case',
            'status' => $c->status,
            'district' => $c->district,
            'location' => $c->location,
            'scope' => $c->scope ?? null,
            'affected_areas' => $c->affected_areas ?? null,
            'target_amount' => $targetAmount,
            'collected_amount' => $collectedAmount,
            'raised' => $collectedAmount,
            'targetAmount' => $targetAmount,
            'progress' => $progress,
            'supporters' => (int) ($c->donations_count ?? 0),
            'cover_image' => $c->cover_image,
            'image' => $c->cover_image,
            'start_date' => $c->start_date ? Carbon::parse($c->start_date)->toDateString() : null,
            'end_date' => $c->end_date ? Carbon::parse($c->end_date)->toDateString() : null,
            'days_left' => $daysLeft,
            'daysLeft' => $daysLeft,
            'organization' => $c->organization ? [
                'id' => $c->organization->id,
                'name' => $c->organization->name,
            ] : null,
            'organizer' => $c->organization ? [
                'name' => $c->organization->name,
                'role' => 'Verified Organization',
                'verified' => true,
            ] : [
                'name' => 'Stand For People',
                'role' => 'Humanitarian Initiative',
                'verified' => true,
            ],
            'created_at' => $c->created_at?->toISOString(),
        ];
    }
}
