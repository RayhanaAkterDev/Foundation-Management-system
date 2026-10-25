<?php

namespace App\Services;

use App\Models\HelpRequest;
use App\Models\HelpRequestDuplicateMatch;
use Illuminate\Support\Str;

class HelpRequestDuplicateDetectionService
{
    /**
     * Minimum score for showing a possible duplicate to an administrator.
     * This is a review threshold, not an automatic decision.
     */
    private const MINIMUM_MATCH_SCORE = 35;

    /**
     * Common English words that usually do not distinguish one request
     * from another. Bengali words are retained because generic Bengali
     * request wording can still carry useful context.
     */
    private const ENGLISH_STOP_WORDS = [
        'a',
        'an',
        'the',
        'and',
        'or',
        'but',
        'for',
        'to',
        'of',
        'in',
        'on',
        'at',
        'by',
        'with',
        'from',
        'as',
        'is',
        'am',
        'are',
        'was',
        'were',
        'be',
        'been',
        'being',
        'it',
        'its',
        'this',
        'that',
        'these',
        'those',
        'i',
        'me',
        'my',
        'mine',
        'we',
        'our',
        'ours',
        'you',
        'your',
        'yours',
        'he',
        'his',
        'him',
        'she',
        'her',
        'they',
        'them',
        'their',
        'who',
        'which',
        'what',
        'when',
        'where',
        'why',
        'how',
        'can',
        'could',
        'may',
        'might',
        'will',
        'would',
        'shall',
        'should',
        'do',
        'does',
        'did',
        'have',
        'has',
        'had',
        'not',
        'no',
        'need',
        'needs',
        'needed',
        'want',
        'wants',
        'wanted',
        'please',
        'help',
        'assistance',
        'support',
        'request',
        'required',
        'require',
        'urgent',
        'urgently',
        'emergency',
    ];

    /**
     * Canonical aliases for Bangladesh districts.
     * These improve location comparison; they do not determine duplication.
     */
    private const DISTRICT_ALIASES = [
        'dhaka' => 'dhaka',
        'ঢাকা' => 'dhaka',
        'faridpur' => 'faridpur',
        'ফরিদপুর' => 'faridpur',
        'gazipur' => 'gazipur',
        'গাজীপুর' => 'gazipur',
        'gopalganj' => 'gopalganj',
        'গোপালগঞ্জ' => 'gopalganj',
        'kishoreganj' => 'kishoreganj',
        'kishorganj' => 'kishoreganj',
        'কিশোরগঞ্জ' => 'kishoreganj',
        'madaripur' => 'madaripur',
        'মাদারীপুর' => 'madaripur',
        'manikganj' => 'manikganj',
        'মানিকগঞ্জ' => 'manikganj',
        'munshiganj' => 'munshiganj',
        'munshigonj' => 'munshiganj',
        'মুন্সীগঞ্জ' => 'munshiganj',
        'মুন্সিগঞ্জ' => 'munshiganj',
        'narayanganj' => 'narayanganj',
        'narayangonj' => 'narayanganj',
        'নারায়ণগঞ্জ' => 'narayanganj',
        'নারায়ণগঞ্জ' => 'narayanganj',
        'narsingdi' => 'narsingdi',
        'narsingdee' => 'narsingdi',
        'নরসিংদী' => 'narsingdi',
        'rajbari' => 'rajbari',
        'রাজবাড়ী' => 'rajbari',
        'রাজবাড়ী' => 'rajbari',
        'shariatpur' => 'shariatpur',
        'শরীয়তপুর' => 'shariatpur',
        'শরীয়তপুর' => 'shariatpur',
        'tangail' => 'tangail',
        'টাঙ্গাইল' => 'tangail',

        'bagerhat' => 'bagerhat',
        'bagherhat' => 'bagerhat',
        'বাগেরহাট' => 'bagerhat',
        'chuadanga' => 'chuadanga',
        'চুয়াডাঙ্গা' => 'chuadanga',
        'চুয়াডাঙ্গা' => 'chuadanga',
        'jashore' => 'jashore',
        'jessore' => 'jashore',
        'যশোর' => 'jashore',
        'jhenaidah' => 'jhenaidah',
        'jhenidah' => 'jhenaidah',
        'ঝিনাইদহ' => 'jhenaidah',
        'khulna' => 'khulna',
        'খুলনা' => 'khulna',
        'kushtia' => 'kushtia',
        'কুষ্টিয়া' => 'kushtia',
        'কুষ্টিয়া' => 'kushtia',
        'magura' => 'magura',
        'মাগুরা' => 'magura',
        'meherpur' => 'meherpur',
        'মেহেরপুর' => 'meherpur',
        'narail' => 'narail',
        'norail' => 'narail',
        'নড়াইল' => 'narail',
        'নড়াইল' => 'narail',
        'satkhira' => 'satkhira',
        'সাতক্ষীরা' => 'satkhira',

        'bandarban' => 'bandarban',
        'বান্দরবান' => 'bandarban',
        'brahmanbaria' => 'brahmanbaria',
        'brahmanbariya' => 'brahmanbaria',
        'ব্রাহ্মণবাড়িয়া' => 'brahmanbaria',
        'ব্রাহ্মণবাড়িয়া' => 'brahmanbaria',
        'chandpur' => 'chandpur',
        'চাঁদপুর' => 'chandpur',
        'chattogram' => 'chattogram',
        'chittagong' => 'chattogram',
        'চট্টগ্রাম' => 'chattogram',
        'চট্রগ্রাম' => 'chattogram',
        'cumilla' => 'cumilla',
        'comilla' => 'cumilla',
        'kumilla' => 'cumilla',
        'kumillla' => 'cumilla',
        'কুমিল্লা' => 'cumilla',
        "cox's bazar" => 'coxsbazar',
        'coxs bazar' => 'coxsbazar',
        'coxbazar' => 'coxsbazar',
        'coxsbazar' => 'coxsbazar',
        'কক্সবাজার' => 'coxsbazar',
        'feni' => 'feni',
        'ফেনী' => 'feni',
        'khagrachhari' => 'khagrachhari',
        'khagrachari' => 'khagrachhari',
        'খাগড়াছড়ি' => 'khagrachhari',
        'খাগড়াছড়ি' => 'khagrachhari',
        'lakshmipur' => 'lakshmipur',
        'laxmipur' => 'lakshmipur',
        'লক্ষ্মীপুর' => 'lakshmipur',
        'noakhali' => 'noakhali',
        'নোয়াখালী' => 'noakhali',
        'নোয়াখালী' => 'noakhali',
        'rangamati' => 'rangamati',
        'রাঙ্গামাটি' => 'rangamati',
        'রাঙামাটি' => 'rangamati',

        'bogura' => 'bogura',
        'bogra' => 'bogura',
        'বগুড়া' => 'bogura',
        'বগুড়া' => 'bogura',
        'joypurhat' => 'joypurhat',
        'jaipurhat' => 'joypurhat',
        'জয়পুরহাট' => 'joypurhat',
        'জয়পুরহাট' => 'joypurhat',
        'naogaon' => 'naogaon',
        'নওগাঁ' => 'naogaon',
        'natore' => 'natore',
        'নাটোর' => 'natore',
        'chapainawabganj' => 'chapainawabganj',
        'chapainawabgonj' => 'chapainawabganj',
        'চাঁপাইনবাবগঞ্জ' => 'chapainawabganj',
        'pabna' => 'pabna',
        'পাবনা' => 'pabna',
        'rajshahi' => 'rajshahi',
        'রাজশাহী' => 'rajshahi',
        'sirajganj' => 'sirajganj',
        'serajganj' => 'sirajganj',
        'সিরাজগঞ্জ' => 'sirajganj',

        'habiganj' => 'habiganj',
        'hobiganj' => 'habiganj',
        'হবিগঞ্জ' => 'habiganj',
        'moulvibazar' => 'moulvibazar',
        'maulvibazar' => 'moulvibazar',
        'মৌলভীবাজার' => 'moulvibazar',
        'sunamganj' => 'sunamganj',
        'sunamgonj' => 'sunamganj',
        'সুনামগঞ্জ' => 'sunamganj',
        'sylhet' => 'sylhet',
        'সিলেট' => 'sylhet',

        'dinajpur' => 'dinajpur',
        'দিনাজপুর' => 'dinajpur',
        'gaibandha' => 'gaibandha',
        'গাইবান্ধা' => 'gaibandha',
        'kurigram' => 'kurigram',
        'কুড়িগ্রাম' => 'kurigram',
        'কুড়িগ্রাম' => 'kurigram',
        'lalmonirhat' => 'lalmonirhat',
        'লালমনিরহাট' => 'lalmonirhat',
        'nilphamari' => 'nilphamari',
        'নীলফামারী' => 'nilphamari',
        'panchagarh' => 'panchagarh',
        'panchagar' => 'panchagarh',
        'পঞ্চগড়' => 'panchagarh',
        'পঞ্চগড়' => 'panchagarh',
        'rangpur' => 'rangpur',
        'রংপুর' => 'rangpur',
        'thakurgaon' => 'thakurgaon',
        'ঠাকুরগাঁও' => 'thakurgaon',

        'jamalpur' => 'jamalpur',
        'জামালপুর' => 'jamalpur',
        'mymensingh' => 'mymensingh',
        'ময়মনসিংহ' => 'mymensingh',
        'ময়মনসিংহ' => 'mymensingh',
        'netrokona' => 'netrokona',
        'netrakona' => 'netrokona',
        'নেত্রকোণা' => 'netrokona',
        'নেত্রকোনা' => 'netrokona',
        'sherpur' => 'sherpur',
        'শেরপুর' => 'sherpur',

        'barguna' => 'barguna',
        'বরগুনা' => 'barguna',
        'barishal' => 'barishal',
        'barisal' => 'barishal',
        'বরিশাল' => 'barishal',
        'bhola' => 'bhola',
        'ভোলা' => 'bhola',
        'jhalokati' => 'jhalokati',
        'jhalakathi' => 'jhalokati',
        'jhalakati' => 'jhalokati',
        'ঝালকাঠি' => 'jhalokati',
        'patuakhali' => 'patuakhali',
        'পটুয়াখালী' => 'patuakhali',
        'পটুয়াখালী' => 'patuakhali',
        'pirojpur' => 'pirojpur',
        'পিরোজপুর' => 'pirojpur',
    ];

    /**
     * Analyze a request against other non-rejected requests.
     * This only records possible matches for admin review.
     */
    public function analyze(HelpRequest $helpRequest): array
    {
        $candidates = HelpRequest::query()
            ->where('id', '!=', $helpRequest->id)
            ->whereNotIn('status', [HelpRequest::STATUS_REJECTED])
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

        usort($matches, fn(array $a, array $b) => $b['score'] <=> $a['score']);

        return [
            'help_request_id' => $helpRequest->id,
            'matches_found' => count($matches),
            'matches' => $matches,
        ];
    }

    /**
     * Compare request content primarily. Structured fields are supporting
     * evidence and cannot by themselves produce a high duplicate score.
     *
     * Maximum raw points: title 30, description 45, category 5,
     * district 5, address 5, requester 10 = 100.
     */
    private function compare(HelpRequest $request, HelpRequest $candidate): array
    {
        $titleSimilarity = $this->textSimilarity($request->title, $candidate->title);
        $descriptionSimilarity = $this->textSimilarity($request->description, $candidate->description);

        $score = (30 * $titleSimilarity) + (45 * $descriptionSimilarity);
        $reasons = [];

        if ($titleSimilarity >= 0.70) {
            $reasons[] = 'Very similar titles';
        } elseif ($titleSimilarity >= 0.40) {
            $reasons[] = 'Similar titles or wording';
        }

        if ($descriptionSimilarity >= 0.65) {
            $reasons[] = 'Strongly similar descriptions';
        } elseif ($descriptionSimilarity >= 0.35) {
            $reasons[] = 'Some shared description wording';
        }

        $requestCategory = $this->normalize($request->category);
        $candidateCategory = $this->normalize($candidate->category);

        if ($requestCategory !== '' && $requestCategory === $candidateCategory) {
            $score += 5;
            $reasons[] = 'Same help category';
        }

        $requestDistrict = $this->normalizeDistrict($request->district);
        $candidateDistrict = $this->normalizeDistrict($candidate->district);

        if ($requestDistrict !== '' && $requestDistrict === $candidateDistrict) {
            $score += 5;
            $reasons[] = 'Same district';
        }

        $requestAddress = $this->normalizeAddress($request->address);
        $candidateAddress = $this->normalizeAddress($candidate->address);

        if (
            $requestAddress !== '' &&
            $candidateAddress !== '' &&
            $requestAddress === $candidateAddress
        ) {
            $score += 5;
            $reasons[] = 'Same address';
        }

        if (
            $request->user_id !== null &&
            $candidate->user_id !== null &&
            (int) $request->user_id === (int) $candidate->user_id
        ) {
            $score += 10;
            $reasons[] = 'Same requester submitted both requests';
        }

        $score = (int) round(min(100, $score));

        // Do not flag a request based only on category/location/requester.
        // Some meaningful content overlap must exist.
        if ($titleSimilarity < 0.15 && $descriptionSimilarity < 0.15) {
            $score = min($score, 29);
        }

        if ($reasons === []) {
            $reasons[] = 'Limited text similarity; review details carefully';
        }

        return [
            'score' => $score,
            'reasons' => $reasons,
        ];
    }

    /**
     * General-purpose language-agnostic lexical similarity.
     *
     * This does not translate English to Bengali. It compares normalized
     * words and character n-grams, helping with minor spelling differences
     * without requiring a hard-coded topic dictionary.
     */
    private function textSimilarity(?string $first, ?string $second): float
    {
        $first = $this->normalize($first);
        $second = $this->normalize($second);

        if ($first === '' || $second === '') {
            return 0.0;
        }

        if ($first === $second) {
            return 1.0;
        }

        $firstTokens = $this->meaningfulTokens($first);
        $secondTokens = $this->meaningfulTokens($second);

        $tokenScore = $this->tokenSimilarity($firstTokens, $secondTokens);
        $ngramScore = $this->characterNgramSimilarity($first, $second);

        return min(1.0, (0.75 * $tokenScore) + (0.25 * $ngramScore));
    }

    private function meaningfulTokens(string $text): array
    {
        $tokens = $this->tokens($text);

        $tokens = array_filter($tokens, function (string $token): bool {
            if (preg_match('/^\p{N}+$/u', $token) === 1) {
                return false;
            }

            // Apply English stop words only to English tokens.
            if (
                preg_match('/\p{Bengali}/u', $token) !== 1 &&
                in_array($token, self::ENGLISH_STOP_WORDS, true)
            ) {
                return false;
            }

            return mb_strlen($token, 'UTF-8') > 1;
        });

        return array_values(array_unique($tokens));
    }

    /**
     * Symmetric overlap score, averaged with Jaccard to account for both
     * similar-length and differently-sized descriptions.
     */
    private function tokenSimilarity(array $firstTokens, array $secondTokens): float
    {
        if ($firstTokens === [] || $secondTokens === []) {
            return 0.0;
        }

        $intersection = count(array_intersect($firstTokens, $secondTokens));

        if ($intersection === 0) {
            return 0.0;
        }

        $union = count(array_unique(array_merge($firstTokens, $secondTokens)));
        $smallerCount = min(count($firstTokens), count($secondTokens));

        $jaccard = $union > 0 ? $intersection / $union : 0.0;
        $overlap = $intersection / $smallerCount;

        return ($jaccard + $overlap) / 2;
    }

    /**
     * Compare character trigrams to tolerate minor typos.
     */
    private function characterNgramSimilarity(string $first, string $second): float
    {
        $first = preg_replace('/[^\p{L}\p{N}]+/u', '', $first) ?? $first;
        $second = preg_replace('/[^\p{L}\p{N}]+/u', '', $second) ?? $second;

        if ($first === '' || $second === '') {
            return 0.0;
        }

        $firstGrams = $this->characterNgrams($first);
        $secondGrams = $this->characterNgrams($second);

        if ($firstGrams === [] || $secondGrams === []) {
            return $first === $second ? 1.0 : 0.0;
        }

        $intersection = count(array_intersect($firstGrams, $secondGrams));
        $union = count(array_unique(array_merge($firstGrams, $secondGrams)));

        return $union > 0 ? $intersection / $union : 0.0;
    }

    private function characterNgrams(string $value): array
    {
        $characters = preg_split('//u', $value, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        if (count($characters) <= 3) {
            return [$value];
        }

        $grams = [];

        for ($i = 0, $limit = count($characters) - 2; $i < $limit; $i++) {
            $grams[] = $characters[$i] . $characters[$i + 1] . $characters[$i + 2];
        }

        return array_values(array_unique($grams));
    }

    private function normalizeDistrict(?string $district): string
    {
        if (!$district) {
            return '';
        }

        $normalized = mb_strtolower(trim($district), 'UTF-8');

        $normalized = preg_replace(
            '/(?:\s+district|\s+জেলা)\s*$/iu',
            '',
            $normalized
        ) ?? $normalized;

        $normalized = $this->compactDistrictName($normalized);

        static $normalizedAliases = null;

        if ($normalizedAliases === null) {
            $normalizedAliases = [];

            foreach (self::DISTRICT_ALIASES as $alias => $canonical) {
                $key = $this->compactDistrictName(
                    mb_strtolower(trim($alias), 'UTF-8')
                );

                $normalizedAliases[$key] = $canonical;
            }
        }

        return $normalizedAliases[$normalized] ?? $normalized;
    }

    private function compactDistrictName(string $value): string
    {
        return preg_replace('/[\s\p{P}\p{S}]+/u', '', $value) ?? $value;
    }

    private function normalizeAddress(?string $address): string
    {
        $normalized = $this->normalize($address);

        $normalized = preg_replace(
            '/[^\p{L}\p{N}\s]+/u',
            ' ',
            $normalized
        ) ?? $normalized;

        return trim(preg_replace('/\s+/u', ' ', $normalized) ?? $normalized);
    }

    private function normalize(?string $value): string
    {
        $value = Str::lower(trim($value ?? ''));

        $value = preg_replace(
            '/[^\p{L}\p{N}\s]+/u',
            ' ',
            $value
        ) ?? $value;

        return trim(preg_replace('/\s+/u', ' ', $value) ?? $value);
    }

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
