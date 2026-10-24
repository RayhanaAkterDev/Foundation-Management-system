<?php

namespace App\Services;

use App\Models\HelpRequest;
use App\Models\HelpRequestDuplicateMatch;
use Illuminate\Support\Str;

class HelpRequestDuplicateDetectionService
{
    /**
     * Compare a help request against existing requests.
     *
     * Results are suggestions for administrative review only.
     * This service never changes a help request's status.
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

            // Weak overlaps alone should not appear as potential matches.
            if ($result['score'] < 40) {
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
     * Calculate a weighted similarity score.
     *
     * Weights:
     * - Address: 20
     * - Title similarity: 25
     * - Description similarity: 20
     * - Category: 15
     * - District: 10
     * - Same requester: 10
     *
     * Maximum score: 100.
     */
    private function compare(
        HelpRequest $request,
        HelpRequest $candidate
    ): array {
        $score = 0;
        $reasons = [];

        /*
         * Title similarity: up to 25 points.
         */
        $titleSimilarity = $this->textSimilarity(
            $request->title,
            $candidate->title
        );

        $score += (int) round(25 * $titleSimilarity);

        if ($titleSimilarity >= 0.65) {
            $reasons[] = 'Very similar titles';
        } elseif ($titleSimilarity >= 0.30) {
            $reasons[] = 'Partially similar titles';
        }

        /*
         * Description similarity: up to 20 points.
         */
        $descriptionSimilarity = $this->textSimilarity(
            $request->description,
            $candidate->description
        );

        $score += (int) round(20 * $descriptionSimilarity);

        if ($descriptionSimilarity >= 0.60) {
            $reasons[] = 'Very similar descriptions';
        } elseif ($descriptionSimilarity >= 0.25) {
            $reasons[] = 'Partially similar descriptions';
        }

        /*
         * Same category: 15 points.
         */
        $requestCategory = $this->normalize($request->category);
        $candidateCategory = $this->normalize($candidate->category);

        if (
            $requestCategory !== '' &&
            $requestCategory === $candidateCategory
        ) {
            $score += 15;
            $reasons[] = 'Same help category';
        }

        /*
         * Same normalized district: 10 points.
         */
        $requestDistrict = $this->normalizeDistrict($request->district);
        $candidateDistrict = $this->normalizeDistrict($candidate->district);

        if (
            $requestDistrict !== '' &&
            $requestDistrict === $candidateDistrict
        ) {
            $score += 10;
            $reasons[] = 'Same district';
        }

        /*
         * Same exact normalized address: 20 points.
         *
         * This intentionally requires an exact normalized match.
         * A broad or partially matching address should not receive
         * the full address score.
         */
        $address = $this->normalize($request->address);
        $candidateAddress = $this->normalize($candidate->address);

        if (
            $address !== '' &&
            $candidateAddress !== '' &&
            $address === $candidateAddress
        ) {
            $score += 20;
            $reasons[] = 'Same address';
        }

        /*
         * Same requester: 10 points.
         *
         * A repeat submission is a review signal, not proof of fraud.
         * Guest requests without a user ID receive no points here.
         */
        if (
            $request->user_id !== null &&
            $candidate->user_id !== null &&
            (int) $request->user_id === (int) $candidate->user_id
        ) {
            $score += 10;
            $reasons[] = 'Same requester submitted both requests';
        }

        return [
            'score' => min(100, $score),
            'reasons' => $reasons,
        ];
    }

    /**
     * Normalize common English and Bengali district spellings.
     */
    private function normalizeDistrict(?string $district): string
    {
        $normalized = $this->normalize($district);

        $aliases = [
            'কুমিল্লা' => 'comilla',
            'comilla' => 'comilla',
            'cumilla' => 'comilla',
            'kumilla' => 'comilla',
            'kumillla' => 'comilla',

            'চট্টগ্রাম' => 'chattogram',
            'চাটগাঁ' => 'chattogram',
            'chittagong' => 'chattogram',
            'chattogram' => 'chattogram',

            'ঢাকা' => 'dhaka',
            'dhaka' => 'dhaka',

            'রাজশাহী' => 'rajshahi',
            'rajshahi' => 'rajshahi',

            'খুলনা' => 'khulna',
            'khulna' => 'khulna',

            'বরিশাল' => 'barishal',
            'barisal' => 'barishal',
            'barishal' => 'barishal',

            'সিলেট' => 'sylhet',
            'sylhet' => 'sylhet',

            'রংপুর' => 'rangpur',
            'rangpur' => 'rangpur',

            'ময়মনসিংহ' => 'mymensingh',
            'ময়মনসিংহ' => 'mymensingh',
            'mymensingh' => 'mymensingh',

            'বগুড়া' => 'bogura',
            'বগুড়া' => 'bogura',
            'bogra' => 'bogura',
            'bogura' => 'bogura',

            'যশোর' => 'jashore',
            'যশোর জেলা' => 'jashore',
            'jessore' => 'jashore',
            'jashore' => 'jashore',
        ];

        return $aliases[$normalized] ?? $normalized;
    }

    /**
     * Calculate lexical similarity between two text values.
     *
     * This is not semantic AI matching and cannot reliably determine
     * whether different-language descriptions have the same meaning.
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

        $jaccard = $union > 0
            ? $intersection / $union
            : 0;

        // A shorter title may be substantially contained in a longer one.
        $containment = $intersection / min(
            count($firstTokens),
            count($secondTokens)
        );

        return min(1, max($jaccard, $containment * 0.75));
    }

    /**
     * Normalize text for comparison.
     */
    private function normalize(?string $value): string
    {
        return Str::lower(
            preg_replace(
                '/\s+/u',
                ' ',
                trim($value ?? '')
            ) ?? ''
        );
    }

    /**
     * Convert text into unique normalized tokens.
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
