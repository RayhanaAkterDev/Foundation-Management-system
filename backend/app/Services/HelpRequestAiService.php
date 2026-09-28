<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use OpenAI;

class HelpRequestAiService
{
    public function analyze(string $userMessage): array
    {
        $categories = Category::query()
            ->where('active', true)
            ->orderBy('id')
            ->get([
                'name',
                'slug',
                'description',
            ]);

        /*
         * Deployment-safe fallback:
         *
         * If no OpenAI API key is configured, use the local
         * analyzer instead of making an external API request.
         *
         * This allows the deployed application to work without
         * requiring paid OpenAI API access.
         */
        if (!config('services.openai.api_key')) {
            return $this->analyzeLocally(
                $userMessage,
                $categories
            );
        }

        return $this->analyzeWithOpenAI(
            $userMessage,
            $categories
        );
    }

    private function analyzeWithOpenAI(
        string $userMessage,
        Collection $categories
    ): array {
        $categoryContext = $categories
            ->map(function (Category $category) {
                return [
                    'slug' => $category->slug,
                    'name' => $category->name,
                    'description' => $category->description,
                ];
            })
            ->values()
            ->toArray();

        $client = OpenAI::client(
            config('services.openai.api_key')
        );

        $response = $client->responses()->create([
            'model' => config(
                'services.openai.model',
                'gpt-5-mini'
            ),

            'instructions' => <<<'PROMPT'
You are an assistant for Stand For People, a humanitarian coordination platform.

Your task is to analyze a person's help request and prepare structured information for the user to review.

Important rules:

1. Never make decisions about eligibility.
2. Never approve or reject a request.
3. Never diagnose medical conditions.
4. Never invent facts that the user did not provide.
5. If information is missing, return null instead of guessing.
6. The category MUST be one of the supplied category slugs.
7. Urgency must be exactly one of:
   - low
   - normal
   - high
   - critical
8. Keep the title concise and human-readable.
9. Preserve the user's meaning.
10. The user will review and edit your output before submission.
11. Extract district and address only when the user explicitly provides them.
12. Extract a deadline only when the user explicitly provides one.
13. Keywords should describe important concepts explicitly present in the user's request.
14. Do not create facts, locations, deadlines, names, medical diagnoses, or financial amounts that were not provided.
PROMPT,

            'input' => json_encode([
                'user_request' => $userMessage,
                'available_categories' => $categoryContext,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),

            'text' => [
                'format' => [
                    'type' => 'json_schema',
                    'name' => 'help_request_analysis',
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => [
                                'type' => ['string', 'null'],
                            ],
                            'description' => [
                                'type' => ['string', 'null'],
                            ],
                            'category' => [
                                'type' => ['string', 'null'],
                            ],
                            'urgency' => [
                                'type' => ['string', 'null'],
                            ],
                            'district' => [
                                'type' => ['string', 'null'],
                            ],
                            'address' => [
                                'type' => ['string', 'null'],
                            ],
                            'deadline' => [
                                'type' => ['string', 'null'],
                            ],
                            'keywords' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'string',
                                ],
                            ],
                        ],
                        'required' => [
                            'title',
                            'description',
                            'category',
                            'urgency',
                            'district',
                            'address',
                            'deadline',
                            'keywords',
                        ],
                        'additionalProperties' => false,
                    ],
                    'strict' => true,
                ],
            ],
        ]);

        $output = $response->outputText;

        if (!$output) {
            throw new \RuntimeException(
                'The AI service returned an empty response.'
            );
        }

        $analysis = json_decode($output, true);

        if (!is_array($analysis)) {
            throw new \RuntimeException(
                'The AI service returned an invalid response.'
            );
        }

        return $this->validateAnalysis(
            $analysis,
            $categories
        );
    }

    private function analyzeLocally(
        string $userMessage,
        Collection $categories
    ): array {
        $text = trim($userMessage);
        $lowerText = mb_strtolower($text);

        $category = $this->detectCategory(
            $lowerText,
            $categories
        );

        $urgency = $this->detectUrgency($lowerText);

        $district = $this->extractDistrict($text);

        $address = $this->extractAddress($text);

        $deadline = $this->extractDeadline($text);

        $keywords = $this->extractKeywords(
            $lowerText,
            $category
        );

        return [
            'title' => $this->generateTitle(
                $text,
                $category
            ),

            'description' => $text !== ''
                ? $text
                : null,

            'category' => $category,

            'urgency' => $urgency,

            'district' => $district,

            'address' => $address,

            'deadline' => $deadline,

            'keywords' => $keywords,
        ];
    }

    private function detectCategory(
        string $text,
        Collection $categories
    ): ?string {
        $keywordMap = [
            'healthcare' => [
                'চিকিৎসা',
                'ডাক্তার',
                'হাসপাতাল',
                'ওষুধ',
                'ঔষধ',
                'medical',
                'medicine',
                'doctor',
                'hospital',
                'treatment',
                'health',
            ],

            'education' => [
                'শিক্ষা',
                'পড়াশোনা',
                'পড়াশোনা',
                'স্কুল',
                'কলেজ',
                'বিশ্ববিদ্যালয়',
                'বিশ্ববিদ্যালয়',
                'বই',
                'শিক্ষা খরচ',
                'education',
                'school',
                'college',
                'university',
                'study',
                'tuition',
            ],

            'food-assistance' => [
                'খাবার',
                'খাদ্য',
                'খেতে',
                'অন্ন',
                'খাদ্য সহায়তা',
                'খাদ্য সহায়তা',
                'food',
                'hungry',
                'meal',
                'nutrition',
            ],

            'shelter' => [
                'আশ্রয়',
                'আশ্রয়',
                'ঘর',
                'বাড়ি',
                'বাড়ি',
                'বাসস্থান',
                'ঘর নেই',
                'shelter',
                'house',
                'home',
                'housing',
            ],

            'livelihood' => [
                'জীবিকা',
                'চাকরি',
                'কাজ',
                'ব্যবসা',
                'আয়',
                'আয়',
                'আয়ের',
                'আয়ের',
                'employment',
                'job',
                'work',
                'business',
                'income',
            ],

            'disaster-relief' => [
                'বন্যা',
                'ঘূর্ণিঝড়',
                'ঘূর্ণিঝড়',
                'দুর্যোগ',
                'ভূমিধস',
                'আগুন',
                'disaster',
                'flood',
                'cyclone',
                'landslide',
                'fire',
            ],

            'water-sanitation' => [
                'পানি',
                'জল',
                'বিশুদ্ধ পানি',
                'খাবার পানি',
                'sanitation',
                'water',
                'drinking water',
            ],

            'child-support' => [
                'শিশু',
                'বাচ্চা',
                'সন্তান',
                'child',
                'children',
                'kid',
            ],

            'women-support' => [
                'নারী',
                'মহিলা',
                'মা',
                'women',
                'woman',
                'mother',
            ],

            'disability-support' => [
                'প্রতিবন্ধী',
                'প্রতিবন্ধিতা',
                'disability',
                'disabled',
            ],

            'emergency-relief' => [
                'জরুরি',
                'তাৎক্ষণিক',
                'জরুরী',
                'emergency',
                'urgent',
                'immediately',
            ],
        ];

        $scores = [];

        foreach ($keywordMap as $slug => $keywords) {
            if (!$categories->contains('slug', $slug)) {
                continue;
            }

            $score = 0;

            foreach ($keywords as $keyword) {
                if (mb_stripos($text, $keyword) !== false) {
                    $score++;
                }
            }

            if ($score > 0) {
                $scores[$slug] = $score;
            }
        }

        if (empty($scores)) {
            return $categories->firstWhere('slug', 'other')?->slug;
        }

        arsort($scores);

        return array_key_first($scores);
    }

    private function detectUrgency(string $text): string
    {
        $criticalKeywords = [
            'মারা যাচ্ছে',
            'মৃত্যু',
            'জীবন সংকট',
            'জীবন-সংকট',
            'শ্বাস নিতে পারছে না',
            'অচেতন',
            'bleeding heavily',
            'unconscious',
            'life threatening',
            'life-threatening',
        ];

        foreach ($criticalKeywords as $keyword) {
            if (mb_stripos($text, $keyword) !== false) {
                return 'critical';
            }
        }

        $highKeywords = [
            'জরুরি',
            'তাৎক্ষণিক',
            'এখনই',
            'অতি জরুরি',
            'urgent',
            'emergency',
            'immediately',
            'as soon as possible',
        ];

        foreach ($highKeywords as $keyword) {
            if (mb_stripos($text, $keyword) !== false) {
                return 'high';
            }
        }

        $lowKeywords = [
            'ভবিষ্যতে',
            'পরে',
            'পরবর্তীতে',
            'later',
            'future',
            'eventually',
        ];

        foreach ($lowKeywords as $keyword) {
            if (mb_stripos($text, $keyword) !== false) {
                return 'low';
            }
        }

        return 'normal';
    }

    private function extractDistrict(string $text): ?string
    {
        $districts = [
            'ঢাকা',
            'চট্টগ্রাম',
            'কুমিল্লা',
            'সিলেট',
            'রাজশাহী',
            'খুলনা',
            'বরিশাল',
            'রংপুর',
            'ময়মনসিংহ',
            'ময়মনসিংহ',
            'গাজীপুর',
            'নারায়ণগঞ্জ',
            'নারায়ণগঞ্জ',
            'নরসিংদী',
            'ফরিদপুর',
            'কক্সবাজার',
            'টাঙ্গাইল',
            'যশোর',
            'বগুড়া',
            'বগুড়া',
            'দিনাজপুর',
            'পাবনা',
            'নোয়াখালী',
            'নোয়াখালী',
            'কিশোরগঞ্জ',
            'মুন্সিগঞ্জ',
            'মানিকগঞ্জ',
            'সাভার',
            'Dhaka',
            'Chattogram',
            'Chittagong',
            'Cumilla',
            'Comilla',
            'Sylhet',
            'Rajshahi',
            'Khulna',
            'Barishal',
            'Rangpur',
            'Mymensingh',
            'Gazipur',
            'Narayanganj',
        ];

        foreach ($districts as $district) {
            if (mb_stripos($text, $district) !== false) {
                return $district;
            }
        }

        return null;
    }

    private function extractAddress(string $text): ?string
    {
        $patterns = [
            '/(?:ঠিকানা|ঠিকানায়|ঠিকানায়)\s*[:\-]?\s*([^।\n]+)/u',
            '/(?:address|at|live in|living in)\s*[:\-]?\s*([^.\n]+)/iu',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $address = trim($matches[1]);

                if ($address !== '') {
                    return $address;
                }
            }
        }

        return null;
    }

    private function extractDeadline(string $text): ?string
    {
        $patterns = [
            '/(?:আগামী|পরের)\s+([০-৯0-9]+\s*(?:দিন|সপ্তাহ|মাস|তারিখ))/u',
            '/(?:within|by|before)\s+([^.\n]+)/iu',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $deadline = trim($matches[1]);

                if ($deadline !== '') {
                    return $deadline;
                }
            }
        }

        return null;
    }

    private function extractKeywords(
        string $text,
        ?string $category
    ): array {
        $keywordMap = [
            'healthcare' => [
                'চিকিৎসা',
                'ডাক্তার',
                'হাসপাতাল',
                'ওষুধ',
                'medical',
                'doctor',
                'hospital',
                'medicine',
            ],

            'education' => [
                'শিক্ষা',
                'পড়াশোনা',
                'পড়াশোনা',
                'স্কুল',
                'কলেজ',
                'বই',
                'education',
                'school',
                'study',
            ],

            'food-assistance' => [
                'খাবার',
                'খাদ্য',
                'খেতে',
                'food',
                'meal',
                'nutrition',
            ],

            'shelter' => [
                'আশ্রয়',
                'আশ্রয়',
                'ঘর',
                'বাড়ি',
                'বাড়ি',
                'বাসস্থান',
                'shelter',
                'housing',
            ],

            'livelihood' => [
                'জীবিকা',
                'চাকরি',
                'কাজ',
                'ব্যবসা',
                'আয়',
                'আয়',
                'job',
                'work',
                'business',
                'income',
            ],

            'disaster-relief' => [
                'বন্যা',
                'ঘূর্ণিঝড়',
                'ঘূর্ণিঝড়',
                'দুর্যোগ',
                'ভূমিধস',
                'disaster',
                'flood',
                'cyclone',
            ],

            'water-sanitation' => [
                'পানি',
                'জল',
                'বিশুদ্ধ পানি',
                'water',
                'sanitation',
            ],

            'child-support' => [
                'শিশু',
                'বাচ্চা',
                'সন্তান',
                'child',
                'children',
            ],

            'women-support' => [
                'নারী',
                'মহিলা',
                'মা',
                'women',
                'woman',
                'mother',
            ],

            'disability-support' => [
                'প্রতিবন্ধী',
                'প্রতিবন্ধিতা',
                'disability',
                'disabled',
            ],

            'emergency-relief' => [
                'জরুরি',
                'তাৎক্ষণিক',
                'emergency',
                'urgent',
            ],
        ];

        $keywords = [];

        if ($category && isset($keywordMap[$category])) {
            foreach ($keywordMap[$category] as $keyword) {
                if (mb_stripos($text, $keyword) !== false) {
                    $keywords[] = $keyword;
                }
            }
        }

        return collect($keywords)
            ->unique()
            ->values()
            ->take(10)
            ->all();
    }

    private function generateTitle(
        string $text,
        ?string $category
    ): ?string {
        if ($text === '') {
            return null;
        }

        $categoryTitles = [
            'healthcare' => 'চিকিৎসার জন্য সহায়তার আবেদন',
            'education' => 'শিক্ষার জন্য সহায়তার আবেদন',
            'food-assistance' => 'খাদ্য সহায়তার আবেদন',
            'shelter' => 'আশ্রয়ের জন্য সহায়তার আবেদন',
            'livelihood' => 'জীবিকার জন্য সহায়তার আবেদন',
            'disaster-relief' => 'দুর্যোগ সহায়তার আবেদন',
            'water-sanitation' => 'বিশুদ্ধ পানির জন্য সহায়তার আবেদন',
            'child-support' => 'শিশু সহায়তার আবেদন',
            'women-support' => 'নারী সহায়তার আবেদন',
            'disability-support' => 'প্রতিবন্ধী সহায়তার আবেদন',
            'emergency-relief' => 'জরুরি সহায়তার আবেদন',
            'other' => 'সহায়তার আবেদন',
        ];

        return $categoryTitles[$category ?? 'other']
            ?? 'সহায়তার আবেদন';
    }

    private function validateAnalysis(
        array $analysis,
        Collection $categories
    ): array {
        $allowedSlugs = $categories
            ->pluck('slug')
            ->values()
            ->all();

        $category = $analysis['category'] ?? null;

        if (
            $category !== null &&
            !in_array($category, $allowedSlugs, true)
        ) {
            $category = null;
        }

        $urgency = $analysis['urgency'] ?? null;

        if (
            $urgency !== null &&
            !in_array(
                $urgency,
                ['low', 'normal', 'high', 'critical'],
                true
            )
        ) {
            $urgency = 'normal';
        }

        return [
            'title' => $this->nullableString(
                $analysis['title'] ?? null
            ),

            'description' => $this->nullableString(
                $analysis['description'] ?? null
            ),

            'category' => $category,

            'urgency' => $urgency,

            'district' => $this->nullableString(
                $analysis['district'] ?? null
            ),

            'address' => $this->nullableString(
                $analysis['address'] ?? null
            ),

            'deadline' => $this->nullableString(
                $analysis['deadline'] ?? null
            ),

            'keywords' => $this->normalizeKeywords(
                $analysis['keywords'] ?? []
            ),
        ];
    }

    private function nullableString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    private function normalizeKeywords(mixed $keywords): array
    {
        if (!is_array($keywords)) {
            return [];
        }

        return collect($keywords)
            ->filter(fn($keyword) => is_string($keyword))
            ->map(fn($keyword) => trim($keyword))
            ->filter()
            ->unique()
            ->values()
            ->take(10)
            ->all();
    }
}
