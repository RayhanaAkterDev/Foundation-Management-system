<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    /**
     * Return a small public set of testimonials.
     *
     * Featured testimonials appear first.
     * Remaining slots are filled by the most recent
     * consented testimonials.
     */
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::query()
            ->where('consent_to_publish', true)
            ->with([
                'user:id,name,role',
            ])
            ->orderByDesc('is_featured')
            ->latest()
            ->limit(6)
            ->get();

        return response()->json([
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Submit a testimonial from an authenticated
     * individual or organization account.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!in_array($user->role, ['individual', 'organization'], true)) {
            return response()->json([
                'message' => 'Only individual and organization accounts can submit testimonials.',
            ], 403);
        }

        if (
            $user->status !== 'active' ||
            is_null($user->email_verified_at)
        ) {
            return response()->json([
                'message' => 'Your account must be active and email verified before submitting a testimonial.',
            ], 403);
        }

        $validated = $request->validate([
            'message' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
            'consent_to_publish' => [
                'required',
                'boolean',
            ],
        ]);

        $testimonial = Testimonial::create([
            'user_id' => $user->id,
            'message' => $validated['message'],
            'consent_to_publish' => $validated['consent_to_publish'],
            'is_featured' => false,
        ]);

        return response()->json([
            'message' => 'Your experience has been submitted successfully.',
            'testimonial' => $testimonial,
        ], 201);
    }
}
