<?php

namespace App\Services;

use App\Models\HelpRequest;
use App\Models\HelpRequestDuplicateMatch;
use Illuminate\Support\Str;

class HelpRequestDuplicateDetectionService
{
    /**
     * Analyze existing requests and save potential matches.
     *
     * Results are review suggestions only.
     * This service never changes request verification status.
     */
    private const MINIMUM_MATCH_SCORE = 30;

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

            if ($result['score'] < self::MINIMUM_MATCH_SCORE) {
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

        usort(
            $matches,
            fn(array $a, array $b) => $b['score'] <=> $a['score']
        );

        return [
            'help_request_id' => $helpRequest->id,
            'matches_found' => count($matches),
            'matches' => $matches,
        ];
    }

    /**
     * Score content and contextual overlaps.
     *
     * Maximum possible score: 100.
     *
     * Title similarity:       25
     * Description similarity: 20
     * Same category:          15
     * Same district:          10
     * Same address:           20
     * Same requester:         10
     */
    private function compare(
        HelpRequest $request,
        HelpRequest $candidate
    ): array {
        $score = 0;
        $reasons = [];

        /*
         * Titles: up to 25 points.
         */
        $titleSimilarity = $this->textSimilarity(
            $request->title,
            $candidate->title
        );

        $titlePoints = (int) round(25 * $titleSimilarity);
        $score += $titlePoints;

        if ($titleSimilarity >= 0.65) {
            $reasons[] = 'Very similar titles';
        } elseif ($titleSimilarity >= 0.30) {
            $reasons[] = 'Partially similar titles';
        }

        /*
         * Descriptions: up to 20 points.
         */
        $descriptionSimilarity = $this->textSimilarity(
            $request->description,
            $candidate->description
        );

        $descriptionPoints = (int) round(20 * $descriptionSimilarity);
        $score += $descriptionPoints;

        if ($descriptionSimilarity >= 0.60) {
            $reasons[] = 'Very similar descriptions';
        } elseif ($descriptionSimilarity >= 0.25) {
            $reasons[] = 'Partially similar descriptions';
        }

        /*
         * Same assistance category: 15 points.
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
         */
        $requestAddress = $this->normalizeAddress($request->address);
        $candidateAddress = $this->normalizeAddress($candidate->address);

        if (
            $requestAddress !== '' &&
            $candidateAddress !== '' &&
            $requestAddress === $candidateAddress
        ) {
            $score += 20;
            $reasons[] = 'Same address';
        }

        /*
         * Same authenticated requester: 10 points.
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
     * Symmetric token similarity.
     *
     * Combines Jaccard similarity and overlap coefficient.
     * Comparing A with B produces the same result as B with A.
     *
     * This measures shared wording, not semantic meaning.
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

        if ($intersection === 0) {
            return 0;
        }

        $union = count(array_unique(array_merge(
            $firstTokens,
            $secondTokens
        )));

        $smallerCount = min(
            count($firstTokens),
            count($secondTokens)
        );

        $jaccard = $union > 0
            ? $intersection / $union
            : 0;

        $overlap = $intersection / $smallerCount;

        return ($jaccard + $overlap) / 2;
    }

    /**
     * Normalize known English and Bengali district spellings.
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
            'jessore' => 'jashore',
            'jashore' => 'jashore',
        ];

        return $aliases[$normalized] ?? $normalized;
    }

    /**
     * Normalize address formatting without equating different addresses.
     */
    private function normalizeAddress(?string $address): string
    {
        $normalized = $this->normalize($address);

        return preg_replace('/[[:punct:]]+/u', ' ', $normalized) !== null
            ? trim(preg_replace('/[[:punct:]]+/u', ' ', $normalized) ?? '')
            : $normalized;
    }

    /**
     * Normalize whitespace and letter case.
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
     * Extract unique word tokens, including Bengali text.
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
