<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PublicCampaignController extends Controller
{
    /**
     * Display publicly visible active campaigns.
     *
     * Category filtering uses the canonical Category.slug.
     * The campaigns table may store the category name in Bangla,
     * so the slug is resolved through the categories table first.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::query()
            ->where('status', Campaign::STATUS_ACTIVE)
            ->with([
                'organization:id,name',
            ])
            ->withCount('donations');

        /*
         * Public category URL:
         *
         * /campaigns/category/food-assistance
         *
         * Frontend sends:
         *
         * ?category=food-assistance
         *
         * Resolve the canonical category slug from the
         * categories table, then match the campaign's
         * stored category value.
         */
        if (
            $request->filled('category') &&
            strtolower(trim($request->category)) !== 'all'
        ) {
            $categorySlug = trim($request->category);

            $category = Category::query()
                ->where('active', true)
                ->where('slug', $categorySlug)
                ->first();

            if (!$category) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                ]);
            }

            $query->where('category', $category->name);
        }

        /*
         * Optional public search.
         */
        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';

            $driver = DB::connection()->getDriverName();

            $likeOperator = $driver === 'pgsql'
                ? 'ILIKE'
                : 'LIKE';

            $query->where(function ($q) use (
                $search,
                $likeOperator
            ) {
                $q->where(
                    'title',
                    $likeOperator,
                    $search
                )->orWhere(
                    'description',
                    $likeOperator,
                    $search
                );
            });
        }

        $campaigns = $query
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $campaigns->map(
                fn($campaign) => $this->formatCampaign($campaign)
            )->values(),
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
     * Return categories that currently have active campaigns.
     *
     * Slug and name come from the canonical categories table.
     * Count is calculated from active campaigns.
     */
    public function categories(): JsonResponse
    {
        $activeCampaignCounts = Campaign::query()
            ->where('status', Campaign::STATUS_ACTIVE)
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->select(
                'category',
                DB::raw('count(*) as count')
            )
            ->groupBy('category')
            ->get()
            ->keyBy('category');

        $categories = Category::query()
            ->where('active', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'about',
                'support_types',
                'image',
                'active',
                'featured',
            ])
            ->map(function ($category) use ($activeCampaignCounts) {
                $count = $activeCampaignCounts
                    ->get($category->name)
                    ?->count ?? 0;

                return [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $category->name,
                    'description' => $category->description,
                    'about' => $category->about,
                    'support_types' => $category->support_types,
                    'image' => $category->image,
                    'active' => (bool) $category->active,
                    'featured' => (bool) $category->featured,
                    'count' => (int) $count,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Format campaign data safely for public consumption.
     */
    private function formatCampaign(Campaign $campaign): array
    {
        $targetAmount = (float) ($campaign->target_amount ?? 0);

        $collectedAmount = (float) (
            $campaign->collected_amount ?? 0
        );

        $progress = $targetAmount > 0
            ? min(
                100,
                (int) round(
                    ($collectedAmount / $targetAmount) * 100
                )
            )
            : 0;

        $daysLeft = null;

        if ($campaign->end_date) {
            $endDate = Carbon::parse(
                $campaign->end_date
            )->startOfDay();

            $today = now()->startOfDay();

            $diff = (int) $today->diffInDays(
                $endDate,
                false
            );

            $daysLeft = max(0, $diff);
        }

        /*
         * Resolve the canonical category slug from the
         * categories table instead of maintaining another
         * category map in this controller.
         */
        $category = Category::query()
            ->where('name', $campaign->category)
            ->first([
                'id',
                'name',
                'slug',
            ]);

        return [
            'id' => $campaign->id,

            'title' => $campaign->title,

            'description' => $campaign->description,

            'shortDescription' => Str::limit(
                strip_tags($campaign->description ?? ''),
                120
            ),

            /*
             * Existing stored category value.
             * Kept for compatibility.
             */
            'category' => $campaign->category,

            /*
             * Canonical category information.
             */
            'category_id' => $category?->id,

            'category_slug' => $category?->slug,

            'category_name' => $category?->name,

            'type' => $campaign->type ?? 'local_case',

            'status' => $campaign->status,

            'district' => $campaign->district,

            'location' => $campaign->location,

            'scope' => $campaign->scope ?? null,

            'affected_areas' => $campaign->affected_areas ?? null,

            'target_amount' => $targetAmount,

            'collected_amount' => $collectedAmount,

            'raised' => $collectedAmount,

            'targetAmount' => $targetAmount,

            'progress' => $progress,

            'supporters' => (int) (
                $campaign->donations_count ?? 0
            ),

            'cover_image' => $campaign->cover_image,

            'image' => $campaign->cover_image,

            'start_date' => $campaign->start_date
                ? Carbon::parse(
                    $campaign->start_date
                )->toDateString()
                : null,

            'end_date' => $campaign->end_date
                ? Carbon::parse(
                    $campaign->end_date
                )->toDateString()
                : null,

            'days_left' => $daysLeft,

            'daysLeft' => $daysLeft,

            'organization' => $campaign->organization
                ? [
                    'id' => $campaign->organization->id,
                    'name' => $campaign->organization->name,
                ]
                : null,

            'organizer' => $campaign->organization
                ? [
                    'name' => $campaign->organization->name,
                    'role' => 'Verified Organization',
                    'verified' => true,
                ]
                : [
                    'name' => 'Stand For People',
                    'role' => 'Humanitarian Initiative',
                    'verified' => true,
                ],

            'created_at' => $campaign->created_at?->toISOString(),
        ];
    }
}
