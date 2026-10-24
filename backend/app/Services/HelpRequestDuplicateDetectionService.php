<?php

namespace App\Services;

use App\Models\HelpRequest;
use App\Models\HelpRequestDuplicateMatch;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class HelpRequestDuplicateDetectionService
{
    /**
     * Compare one help request with existing requests and save matches.
     *
     * This service never changes a help request's verification status.
     */
    public function analyze(HelpRequest $helpRequest): array
    {
        $candidates = HelpRequest::query()
            ->where('id', '!=', $helpRequest->id)
            ->whereNotIn('status', [
                HelpRequest::STATUS_REJECTED,
            ])
            ->get([
                'id',
                'user_id',
                'title',
                'description',
                'category',
                'district',
                'address',
                'status',
                'created_at',
            ]);

        HelpRequestDuplicateMatch::query()
            ->where('help_request_id', $helpRequest->id)
            ->delete();

        $matches = [];

        foreach ($candidates as $candidate) {
            $result = $this->compare($helpRequest, $candidate);

            if ($result['score'] < 45) {
                continue;
            }

            HelpRequestDuplicateMatch::updateOrCreate(
                [
                    'help_request_id' => $helpRequest->id,
                    'matched_help_request_id' => $candidate->id,
                ],
                [
                    'similarity_score' => $result['score'],
                    'match_reasons' => $result['reasons'],
                    'analysis_status' => 'completed',
                ]
            );

            $matches[] = [
                'help_request_id' => $candidate->id,
                'title' => $candidate->title,
                'status' => $candidate->status,
                'score' => $result['score'],
                'reasons' => $result['reasons'],
            ];
        }

        return [
            'help_request_id' => $helpRequest->id,
            'matches_found' => count($matches),
            'matches' => $matches,
        ];
    }

    /**
     * Compare the meaningful details of two requests.
     */
    private function compare(
        HelpRequest $request,
        HelpRequest $candidate
    ): array {
        $score = 0;
        $reasons = [];

        $titleSimilarity = $this->textSimilarity(
            $request->title,
            $candidate->title
        );

        if ($titleSimilarity >= 0.75) {
            $score += 35;
            $reasons[] = 'Very similar titles';
        } elseif ($titleSimilarity >= 0.45) {
            $score += 20;
            $reasons[] = 'Partially similar titles';
        }

        $descriptionSimilarity = $this->textSimilarity(
            $request->description,
            $candidate->description
        );

        if ($descriptionSimilarity >= 0.70) {
            $score += 30;
            $reasons[] = 'Very similar descriptions';
        } elseif ($descriptionSimilarity >= 0.40) {
            $score += 15;
            $reasons[] = 'Partially similar descriptions';
        }

        if (
            $this->normalize($request->category) ===
            $this->normalize($candidate->category)
        ) {
            $score += 15;
            $reasons[] = 'Same help category';
        }

        if (
            $this->normalize($request->district) ===
            $this->normalize($candidate->district)
        ) {
            $score += 10;
            $reasons[] = 'Same district';
        }

        $address = $this->normalize($request->address);
        $candidateAddress = $this->normalize($candidate->address);

        if (
            $address !== '' &&
            $candidateAddress !== '' &&
            $address === $candidateAddress
        ) {
            $score += 10;
            $reasons[] = 'Same address';
        }

        return [
            'score' => min(100, $score),
            'reasons' => $reasons,
        ];
    }

    /**
     * Calculate basic token-based text similarity.
     */
    private function textSimilarity(
        ?string $first,
        ?string $second
    ): float {
        $firstTokens = $this->tokens($first);
        $secondTokens = $this->tokens($second);

        if ($firstTokens === [] || $secondTokens === []) {
            return 0;
        }

        $intersection = count(array_intersect(
            $firstTokens,
            $secondTokens
        ));

        $union = count(array_unique(array_merge(
            $firstTokens,
            $secondTokens
        )));

        return $union > 0 ? $intersection / $union : 0;
    }

    /**
     * Normalize text for comparison.
     */
    private function normalize(?string $value): string
    {
        return Str::lower(
            preg_replace('/\s+/u', ' ', trim($value ?? '')) ?? ''
        );
    }

    /**
     * Convert text into unique, normalized tokens.
     */
    private function tokens(?string $value): array
    {
        $normalized = $this->normalize($value);

        if ($normalized === '') {
            return [];
        }

        preg_match_all('/[\p{L}\p{N}]+/u', $normalized, $matches);

        return array_values(array_unique($matches[0] ?? []));
    }
}
