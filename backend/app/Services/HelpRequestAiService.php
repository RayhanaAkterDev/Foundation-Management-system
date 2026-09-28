<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class HelpRequestAiService
{
    /**
     * Analyze a natural-language help request.
     *
     * Uses OpenAI when OPENAI_API_KEY exists.
     * Otherwise uses the local deterministic analyzer.
     */
    public function analyze(string $userMessage): array
    {
        $categories = Category::query()
            ->where('active', true)
            ->orderBy('id')
            ->get(['slug', 'name']);

        if ($categories->isEmpty()) {
            throw new \RuntimeException(
                'No active help request categories are available.'
            );
        }

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

    /**
     * Real OpenAI analyzer.
     */
    protected function analyzeWithOpenAI(
        string $userMessage,
        $categories
    ): array {
        $categoryList = $categories
            ->map(function ($category) {
                return [
                    'slug' => $category->slug,
                    'name' => $category->name,
                ];
            })
            ->values()
            ->all();

        $systemPrompt = <<<PROMPT
You are the Help Request analysis assistant for Stand For People,
a humanitarian coordination platform.

Analyze the user's help request and return ONLY valid JSON.

The user may write in:
- Bangla
- English
- Banglish / Bangla transliteration
- mixed Bangla-English
- informal language
- common spelling mistakes
- transliterated Bangla with inconsistent spelling

Understand the intended meaning rather than relying only on exact keyword matching.

Return exactly these fields:

{
  "title": "string",
  "description": "string",
  "category": "category-slug",
  "urgency": "low|normal|high|critical",
  "district": "string|null",
  "address": "string|null",
  "deadline": "string|null",
  "keywords": []
}

Rules:

1. CATEGORY
Choose exactly one category from the supplied active category list.
Never invent a category.

2. DISTRICT
Extract a district only when it is explicitly stated or clearly expressed.
English/transliterated district names may be normalized to Bengali when reasonably clear.

Example:
"Sunamganj" -> "সুনামগঞ্জ"
"Sunamganjer" -> "সুনামগঞ্জ"

Never invent a district.

3. ADDRESS
Extract a locality/address only when explicitly stated.

For:
"সুনামগঞ্জের তাহিরপুর এলাকায় আত্মীয়ের বাড়িতে আশ্রয় নিয়েছি"

district should be:
"সুনামগঞ্জ"

address should be:
"তাহিরপুর"

Do NOT return:
"তাহিরপুর এলাকায় আত্মীয়ের বাড়িতে"

Similarly:
"Sunamganjer Tahirpur elakay"
should produce:
district = "সুনামগঞ্জ"
address = "তাহিরপুর"

Do not invent a detailed street address.

4. DEADLINE
Extract an explicit deadline/time requirement.

Example:
"আগামী ১০ দিনের মধ্যে সাহায্য প্রয়োজন"

deadline:
"আগামী ১০ দিনের মধ্যে"

Banglish equivalents should also be understood, for example:
"agami 10 diner moddhe"
"next 10 days er moddhe"
"10 diner moddhe"

Do not invent a deadline.

A deadline by itself does NOT automatically mean high urgency.

5. URGENCY
Infer urgency from the actual wording and situation.

Allowed:
low
normal
high
critical

Examples of critical situations:
- immediate life-threatening danger
- unconscious person
- severe bleeding
- inability to breathe
- explicit risk of death

Examples of high urgency:
- urgent help
- emergency
- immediately
- এখনই
- জরুরি
- খুব জরুরি
- joruri
- khub joruri
- ekhoni
- urgent help lagbe

Do not make urgency high merely because a deadline exists.

6. TITLE
Create a concise, human-readable title.
Prefer Bengali when the request is primarily Bengali/Banglish.

7. DESCRIPTION
Preserve the user's actual meaning.
Do not add facts.

8. KEYWORDS
Return only explicit useful concepts found in the request.
Do not invent keywords.

ACTIVE CATEGORIES:
PROMPT;

        $systemPrompt .= "\n" .
            json_encode(
                $categoryList,
                JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
            );

        $response = Http::timeout(
            config('services.openai.timeout', 30)
        )
            ->withToken(config('services.openai.api_key'))
            ->post(
                'https://api.openai.com/v1/responses',
                [
                    'model' => config(
                        'services.openai.model',
                        'gpt-5-mini'
                    ),
                    'input' => [
                        [
                            'role' => 'system',
                            'content' => [
                                [
                                    'type' => 'input_text',
                                    'text' => $systemPrompt,
                                ],
                            ],
                        ],
                        [
                            'role' => 'user',
                            'content' => [
                                [
                                    'type' => 'input_text',
                                    'text' => $userMessage,
                                ],
                            ],
                        ],
                    ],
                ]
            );

        if (!$response->successful()) {
            throw new \RuntimeException(
                'OpenAI request failed: ' .
                    $response->body()
            );
        }

        $payload = $response->json();

        $text = $payload['output'][0]['content'][0]['text']
            ?? null;

        if (!$text) {
            throw new \RuntimeException(
                'OpenAI returned an empty analysis.'
            );
        }

        $text = trim($text);

        $text = preg_replace(
            '/^```(?:json)?\s*/i',
            '',
            $text
        );

        $text = preg_replace(
            '/\s*```$/',
            '',
            $text
        );

        $analysis = json_decode(
            trim($text),
            true
        );

        if (!is_array($analysis)) {
            throw new \RuntimeException(
                'OpenAI returned invalid JSON.'
            );
        }

        return $this->validateAnalysis(
            $analysis,
            $userMessage,
            $categories
        );
    }

    /**
     * Local analyzer used when no OpenAI API key exists.
     *
     * This is deterministic and does not call an external AI service.
     */
    protected function analyzeLocally(
        string $userMessage,
        $categories
    ): array {
        $text = trim($userMessage);

        $category = $this->detectCategory(
            $text,
            $categories
        );

        $urgency = $this->detectUrgency($text);

        $district = $this->extractDistrict($text);

        $address = $this->extractAddress(
            $text,
            $district
        );

        $deadline = $this->extractDeadline($text);

        $keywords = $this->extractKeywords(
            $text,
            $category,
            $district,
            $address
        );

        $title = $this->generateTitle(
            $text,
            $category,
            $district,
            $address
        );

        return [
            'title' => $title,
            'description' => $text,
            'category' => $category,
            'urgency' => $urgency,
            'district' => $district,
            'address' => $address,
            'deadline' => $deadline,
            'keywords' => $keywords,
        ];
    }

    /**
     * Detect category using active backend categories.
     */
    protected function detectCategory(
        string $text,
        $categories
    ): string {
        $normalized = $this->normalizeForMatching($text);

        $keywordMap = [
            'education' => [
                'শিক্ষা',
                'পড়াশোনা',
                'পড়াশোনা',
                'স্কুল',
                'কলেজ',
                'বিশ্ববিদ্যালয়',
                'বিশ্ববিদ্যালয়',
                'ছাত্র',
                'ছাত্রী',
                'শিক্ষার্থী',
                'বই',
                'খাতা',
                'school',
                'college',
                'university',
                'student',
                'education',
                'study',
                'tuition',
                'porashona',
                'porasuna',
                'porashuna',
                'boi',
                'khata',
            ],

            'healthcare' => [
                'চিকিৎসা',
                'চিকিৎসার',
                'চিকিৎসা প্রয়োজন',
                'চিকিৎসা দরকার',
                'হাসপাতাল',
                'ডাক্তার',
                'ডাক্তারের',
                'ওষুধ',
                'ঔষধ',
                'অসুস্থ',
                'রোগী',
                'অপারেশন',
                'জ্বর',
                'ব্যথা',
                'রক্ত',
                'health',
                'healthcare',
                'hospital',
                'doctor',
                'medicine',
                'medical',
                'treatment',
                'patient',
                'operation',
                'oshudh',
                'osudh',
                'daktar',
                'chikitsha',
                'treatment',
            ],

            'food-assistance' => [
                'খাবার',
                'খাদ্য',
                'খাদ্যের',
                'খেতে পারছি না',
                'খাবার নেই',
                'খাদ্য নেই',
                'চাল',
                'ডাল',
                'খাদ্য সহায়তা',
                'খাদ্য সহায়তা',
                'food',
                'food assistance',
                'food help',
                'rice',
                'dal',
                'khabar',
                'khaddo',
                'khawar',
            ],

            'shelter' => [
                'আশ্রয়',
                'আশ্রয়',
                'বাড়ি',
                'বাড়ি',
                'ঘর',
                'ঘর নেই',
                'বাসস্থান',
                'থাকার জায়গা',
                'থাকার জায়গা',
                'থাকার জায়গা নেই',
                'থাকার জায়গা নেই',
                'বাসা',
                'ভাড়া',
                'বাড়ি ক্ষতিগ্রস্ত',
                'বাড়ি ক্ষতিগ্রস্ত',
                'shelter',
                'house',
                'home',
                'housing',
                'homeless',
                'place to stay',
                'ashroy',
                'bari',
                'basha',
                'ghor',
                'thakar jayga',
            ],

            'livelihood' => [
                'জীবিকা',
                'কাজ',
                'চাকরি',
                'কর্মসংস্থান',
                'ব্যবসা',
                'আয়',
                'আয়',
                'উপার্জন',
                'কাজের সুযোগ',
                'livelihood',
                'job',
                'work',
                'employment',
                'business',
                'income',
                'earning',
                'kaj',
                'chakri',
                'byabsha',
                'ay',
            ],

            'disaster-relief' => [
                'বন্যা',
                'বন্যার',
                'ঘূর্ণিঝড়',
                'ঘূর্ণিঝড়',
                'ঝড়',
                'ঝড়',
                'জলোচ্ছ্বাস',
                'ভূমিকম্প',
                'দুর্যোগ',
                'দুর্যোগে',
                'disaster',
                'flood',
                'cyclone',
                'storm',
                'earthquake',
                'bonna',
                'ghurnijhor',
                'jhor',
                'durjog',
            ],

            'water-sanitation' => [
                'পানি',
                'জল',
                'বিশুদ্ধ পানি',
                'পানির সমস্যা',
                'খাবার পানি',
                'পানীয় পানি',
                'পানীয় পানি',
                'টিউবওয়েল',
                'টিউবওয়েল',
                'স্যানিটেশন',
                'টয়লেট',
                'টয়লেট',
                'toilet',
                'water',
                'drinking water',
                'clean water',
                'sanitation',
                'tube well',
                'pani',
                'bishuddho pani',
                'toilet',
            ],

            'child-support' => [
                'শিশু',
                'বাচ্চা',
                'সন্তান',
                'শিশুর',
                'বাচ্চার',
                'child',
                'children',
                'kid',
                'baby',
                'shishu',
                'baccha',
                'sontan',
            ],

            'women-support' => [
                'নারী',
                'মহিলা',
                'মেয়েদের',
                'মেয়েদের',
                'মহিলাদের',
                'নারীদের',
                'woman',
                'women',
                'female',
                'meyeder',
                'nari',
                'mohila',
            ],

            'disability-support' => [
                'প্রতিবন্ধী',
                'প্রতিবন্ধিতা',
                'দৃষ্টিহীন',
                'দৃষ্টি প্রতিবন্ধী',
                'শারীরিক প্রতিবন্ধী',
                'disabled',
                'disability',
                'blind',
                'wheelchair',
                'protibondhi',
                'drishtihin',
            ],

            'emergency-relief' => [
                'জরুরি সহায়তা',
                'জরুরি সহায়তা',
                'জরুরি সাহায্য',
                'তাৎক্ষণিক সহায়তা',
                'তাৎক্ষণিক সহায়তা',
                'emergency relief',
                'emergency assistance',
                'emergency help',
                'joruri sahajjo',
                'joruri help',
            ],
        ];

        $bestSlug = null;
        $bestScore = 0;

        foreach ($categories as $category) {
            $slug = $category->slug;

            if (!isset($keywordMap[$slug])) {
                continue;
            }

            $score = 0;

            foreach ($keywordMap[$slug] as $keyword) {
                $keywordNormalized =
                    $this->normalizeForMatching($keyword);

                if (
                    $keywordNormalized !== '' &&
                    Str::contains(
                        $normalized,
                        $keywordNormalized
                    )
                ) {
                    $score += mb_strlen(
                        $keywordNormalized
                    ) >= 6 ? 2 : 1;
                }
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestSlug = $slug;
            }
        }

        if ($bestSlug) {
            return $bestSlug;
        }

        $other = $categories->firstWhere(
            'slug',
            'other'
        );

        return $other
            ? $other->slug
            : $categories->first()->slug;
    }

    /**
     * Detect urgency from Bangla, English and common Banglish.
     */
    protected function detectUrgency(string $text): string
    {
        $normalized = $this->normalizeForMatching($text);

        $criticalPatterns = [
            'মারা যাচ্ছে',
            'মৃত্যু',
            'মৃত্যুর ঝুঁকি',
            'জীবন সংকট',
            'জীবন-সংকট',
            'জীবন ঝুঁকি',
            'জীবন-ঝুঁকি',
            'শ্বাস নিতে পারছে না',
            'অচেতন',
            'প্রচুর রক্তক্ষরণ',
            'অনেক রক্তক্ষরণ',
            'রক্তক্ষরণ হচ্ছে',
            'রক্তক্ষরণ',
            'bleeding heavily',
            'heavy bleeding',
            'unconscious',
            'life threatening',
            'life-threatening',
            'life at risk',
            'cannot breathe',
            'cant breathe',
            'not breathing',
            'mara jacche',
            'mara jacche',
            'mrityur jhuki',
            'jibon jhuki',
            'shash nite parche na',
            'ochoton',
            'rokto khoron',
        ];

        foreach ($criticalPatterns as $pattern) {
            if (
                Str::contains(
                    $normalized,
                    $this->normalizeForMatching($pattern)
                )
            ) {
                return 'critical';
            }
        }

        $highPatterns = [
            'জরুরি',
            'জরুরী',
            'অতি জরুরি',
            'অতি জরুরী',
            'খুব জরুরি',
            'খুব জরুরী',
            'তাৎক্ষণিক',
            'এখনই',
            'এই মুহূর্তে',
            'দ্রুত সাহায্য',
            'দ্রুত সহায়তা',
            'দ্রুত সহায়তা',
            'জরুরি সাহায্য',
            'জরুরি সহায়তা',
            'জরুরি সহায়তা',
            'urgent',
            'emergency',
            'immediately',
            'as soon as possible',
            'urgent help',
            'urgent assistance',
            'need help now',
            'help right now',
            'right now',
            'ekhoni',
            'ekhoni help',
            'khub joruri',
            'joruri',
            'oti joruri',
            'joruri help',
            'joruri sahajjo',
            'tatkhonik',
            'druto help',
            'druto sahajjo',
            'akhoni',
        ];

        foreach ($highPatterns as $pattern) {
            if (
                Str::contains(
                    $normalized,
                    $this->normalizeForMatching($pattern)
                )
            ) {
                return 'high';
            }
        }

        $lowPatterns = [
            'ভবিষ্যতে',
            'পরে',
            'পরবর্তীতে',
            'যখন সম্ভব',
            'সময় হলে',
            'সময় হলে',
            'তাড়াহুড়ো নেই',
            'তাড়াহুড়ো নেই',
            'জরুরি নয়',
            'জরুরি নয়',
            'not urgent',
            'no rush',
            'later',
            'future',
            'eventually',
            'when possible',
            'kono tarahura nei',
            'tarahura nei',
            'joruri na',
            'pore hole',
            'jokhon somvob',
        ];

        foreach ($lowPatterns as $pattern) {
            if (
                Str::contains(
                    $normalized,
                    $this->normalizeForMatching($pattern)
                )
            ) {
                return 'low';
            }
        }

        return 'normal';
    }

    /**
     * Extract district from Bangla, English and common Banglish.
     */
    protected function extractDistrict(string $text): ?string
    {
        $districts = [
            'বাগেরহাট' => [
                'বাগেরহাট',
                'bagerhat',
                'bagerhater',
            ],
            'বান্দরবান' => [
                'বান্দরবান',
                'bandarban',
                'bandarbans',
            ],
            'বরগুনা' => [
                'বরগুনা',
                'barguna',
                'bargunar',
            ],
            'বরিশাল' => [
                'বরিশাল',
                'barisal',
                'barishal',
            ],
            'ভোলা' => [
                'ভোলা',
                'bhola',
                'bholar',
            ],
            'বগুড়া' => [
                'বগুড়া',
                'বগুড়া',
                'bogura',
                'bogra',
                'bogurar',
            ],
            'ব্রাহ্মণবাড়িয়া' => [
                'ব্রাহ্মণবাড়িয়া',
                'ব্রাহ্মণবাড়িয়া',
                'brahmanbaria',
                'brahmanbariar',
            ],
            'চাঁদপুর' => [
                'চাঁদপুর',
                'chandpur',
                'chandpurer',
            ],
            'চট্টগ্রাম' => [
                'চট্টগ্রাম',
                'চট্টগ্রামের',
                'chattogram',
                'chittagong',
                'chattograms',
            ],
            'চুয়াডাঙ্গা' => [
                'চুয়াডাঙ্গা',
                'চুয়াডাঙ্গা',
                'chuadanga',
                'chuadangar',
            ],
            'কুমিল্লা' => [
                'কুমিল্লা',
                'comilla',
                'cumilla',
                'cumillar',
            ],
            'কক্সবাজার' => [
                'কক্সবাজার',
                'coxsbazar',
                'coxsbazarer',
                'coxs bazar',
            ],
            'ঢাকা' => [
                'ঢাকা',
                'dhaka',
                'dhakar',
            ],
            'দিনাজপুর' => [
                'দিনাজপুর',
                'dinajpur',
                'dinajpurer',
            ],
            'ফরিদপুর' => [
                'ফরিদপুর',
                'faridpur',
                'faridpurer',
            ],
            'ফেনী' => [
                'ফেনী',
                'feni',
                'fenir',
            ],
            'গাইবান্ধা' => [
                'গাইবান্ধা',
                'gaibandha',
                'gaibandhar',
            ],
            'গাজীপুর' => [
                'গাজীপুর',
                'gazipur',
                'gazipurer',
            ],
            'গোপালগঞ্জ' => [
                'গোপালগঞ্জ',
                'gopalganj',
                'gopalganjer',
            ],
            'হবিগঞ্জ' => [
                'হবিগঞ্জ',
                'habiganj',
                'habiganjer',
            ],
            'জামালপুর' => [
                'জামালপুর',
                'jamalpur',
                'jamalpurer',
            ],
            'যশোর' => [
                'যশোর',
                'jashore',
                'jessore',
                'jashorer',
            ],
            'ঝালকাঠি' => [
                'ঝালকাঠি',
                'jhalokathi',
                'jhalokathir',
            ],
            'ঝিনাইদহ' => [
                'ঝিনাইদহ',
                'jhenaidah',
                'jhenaidaher',
            ],
            'জয়পুরহাট' => [
                'জয়পুরহাট',
                'জয়পুরহাট',
                'joypurhat',
                'joypurhater',
            ],
            'খাগড়াছড়ি' => [
                'খাগড়াছড়ি',
                'খাগড়াছড়ি',
                'khagrachhari',
                'khagrachari',
                'khagrachharir',
            ],
            'খুলনা' => [
                'খুলনা',
                'khulna',
                'khulnar',
            ],
            'কিশোরগঞ্জ' => [
                'কিশোরগঞ্জ',
                'kishoreganj',
                'kishoreganjer',
            ],
            'কুড়িগ্রাম' => [
                'কুড়িগ্রাম',
                'কুড়িগ্রাম',
                'kurigram',
                'kurigramer',
            ],
            'লক্ষ্মীপুর' => [
                'লক্ষ্মীপুর',
                'lakshmipur',
                'laxmipur',
                'lakshmipurer',
            ],
            'লালমনিরহাট' => [
                'লালমনিরহাট',
                'lalmonirhat',
                'lalmonirhater',
            ],
            'মাদারীপুর' => [
                'মাদারীপুর',
                'madaripur',
                'madaripurer',
            ],
            'মাগুরা' => [
                'মাগুরা',
                'magura',
                'magurar',
            ],
            'মানিকগঞ্জ' => [
                'মানিকগঞ্জ',
                'manikganj',
                'manikganjer',
            ],
            'মেহেরপুর' => [
                'মেহেরপুর',
                'meherpur',
                'meherpurer',
            ],
            'মৌলভীবাজার' => [
                'মৌলভীবাজার',
                'moulvibazar',
                'moulvibazars',
            ],
            'মুন্সিগঞ্জ' => [
                'মুন্সিগঞ্জ',
                'মুন্সীগঞ্জ',
                'munshiganj',
                'munshiganjer',
            ],
            'ময়মনসিংহ' => [
                'ময়মনসিংহ',
                'ময়মনসিংহ',
                'mymensingh',
                'mymensingher',
            ],
            'নওগাঁ' => [
                'নওগাঁ',
                'naogaon',
                'naogaoner',
            ],
            'নড়াইল' => [
                'নড়াইল',
                'নড়াইল',
                'narail',
                'narailer',
            ],
            'নারায়ণগঞ্জ' => [
                'নারায়ণগঞ্জ',
                'নারায়ণগঞ্জ',
                'narayanganj',
                'narayanganjer',
            ],
            'নরসিংদী' => [
                'নরসিংদী',
                'narsingdi',
                'narsingdir',
            ],
            'নাটোর' => [
                'নাটোর',
                'natore',
                'natorer',
            ],
            'নওগাঁ' => [
                'নওগাঁ',
                'naogaon',
                'naogaoner',
            ],
            'নীলফামারী' => [
                'নীলফামারী',
                'nilphamari',
                'nilphamarir',
            ],
            'নোয়াখালী' => [
                'নোয়াখালী',
                'নোয়াখালী',
                'noakhali',
                'noakhalir',
            ],
            'পাবনা' => [
                'পাবনা',
                'pabna',
                'pabnar',
            ],
            'পঞ্চগড়' => [
                'পঞ্চগড়',
                'পঞ্চগড়',
                'panchagarh',
                'panchagarher',
            ],
            'পটুয়াখালী' => [
                'পটুয়াখালী',
                'পটুয়াখালী',
                'patuakhali',
                'patuakhalir',
            ],
            'পিরোজপুর' => [
                'পিরোজপুর',
                'pirojpur',
                'pirojpurer',
            ],
            'রাজবাড়ী' => [
                'রাজবাড়ী',
                'রাজবাড়ী',
                'rajbari',
                'rajbarir',
            ],
            'রাজশাহী' => [
                'রাজশাহী',
                'rajshahi',
                'rajshahir',
            ],
            'রাঙ্গামাটি' => [
                'রাঙ্গামাটি',
                'রাঙামাটি',
                'rangamati',
                'rangamatis',
            ],
            'রংপুর' => [
                'রংপুর',
                'rangpur',
                'rangpurer',
            ],
            'সাতক্ষীরা' => [
                'সাতক্ষীরা',
                'satkhira',
                'satkhirar',
            ],
            'শরীয়তপুর' => [
                'শরীয়তপুর',
                'শরিয়তপুর',
                'shariatpur',
                'shariatpurer',
            ],
            'শেরপুর' => [
                'শেরপুর',
                'sherpur',
                'sherpurer',
            ],
            'সিরাজগঞ্জ' => [
                'সিরাজগঞ্জ',
                'sirajganj',
                'sirajganjer',
            ],
            'সুনামগঞ্জ' => [
                'সুনামগঞ্জ',
                'sunamganj',
                'sunamganjer',
            ],
            'সিলেট' => [
                'সিলেট',
                'sylhet',
                'sylheter',
            ],
            'টাঙ্গাইল' => [
                'টাঙ্গাইল',
                'tangail',
                'tangailer',
            ],
            'ঠাকুরগাঁও' => [
                'ঠাকুরগাঁও',
                'thakurgaon',
                'thakurgaoner',
            ],
        ];

        foreach ($districts as $district => $variants) {
            foreach ($variants as $variant) {
                $pattern = $this->normalizeForMatching(
                    $variant
                );

                if (
                    $pattern !== '' &&
                    Str::contains(
                        $this->normalizeForMatching($text),
                        $pattern
                    )
                ) {
                    return $district;
                }
            }
        }

        return null;
    }

    /**
     * Extract a concise locality/address.
     *
     * Important:
     * "সুনামগঞ্জের তাহিরপুর এলাকায়..."
     * must return "তাহিরপুর", not the whole phrase.
     */
    /**
     * Extract a useful locality/address from the user's message.
     *
     * Examples:
     *
     * সুনামগঞ্জের তাহিরপুর এলাকায় আত্মীয়ের বাড়িতে আশ্রয় নিয়েছি।
     *                         ↓
     * তাহিরপুর
     *
     * সুনামগঞ্জে তাহিরপুর এলাকায় আছি।
     *              ↓
     * তাহিরপুর
     *
     * Sunamganjer Tahirpur elakay achi.
     *              ↓
     * Tahirpur
     *
     * ঠিকানা: তাহিরপুর
     * address: Tahirpur
     */
    protected function extractAddress(
        string $text,
        ?string $district
    ): ?string {
        $text = trim($text);

        /*
     * ============================================================
     * 1. Explicit address first
     * ============================================================
     *
     * Examples:
     *
     * ঠিকানা: তাহিরপুর
     * ঠিকানা হলো তাহিরপুর
     * address: Tahirpur
     */
        $explicitPatterns = [
            /*
         * Bangla
         */
            '/(?:ঠিকানা|ঠিকানা হলো|ঠিকানা হচ্ছে)\s*[:：-]?\s*'
                . '([^,\n।.]+)/u',

            /*
         * English
         */
            '/(?:address|location)\s*[:：-]?\s*'
                . '([^,\n.]+)/iu',
        ];

        foreach ($explicitPatterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $candidate = trim($matches[1]);

                $candidate = $this->cleanAddress(
                    $candidate
                );

                if (
                    $candidate !== '' &&
                    $this->looksLikeUsefulAddress(
                        $candidate
                    )
                ) {
                    return $candidate;
                }
            }
        }

        /*
     * ============================================================
     * 2. District → locality in Bangla
     * ============================================================
     *
     * IMPORTANT:
     *
     * সুনামগঞ্জের
     *
     * is:
     *
     * সুনামগঞ্জ + ের
     *
     * NOT:
     *
     * সুনামগঞ্জ + এর
     *
     * Therefore we explicitly support:
     *
     * এর
     * ের
     * র
     * য়ের
     * য়ের
     *
     * Examples:
     *
     * সুনামগঞ্জের তাহিরপুর এলাকায়
     * সুনামগঞ্জে তাহিরপুর এলাকায়
     * সুনামগঞ্জে তাহিরপুর এলাকায়
     *
     * Expected:
     *
     * তাহিরপুর
     */
        if ($district) {
            $districtPattern = preg_quote(
                $district,
                '/'
            );

            $banglaPatterns = [
                /*
             * ----------------------------------------------------
             * District + possessive suffix + locality + area
             * ----------------------------------------------------
             *
             * সুনামগঞ্জের তাহিরপুর এলাকায়
             */
                '/(?:' .
                    $districtPattern .
                    ')(?:এর|ের|র|য়ের|য়ের|য়|ে)\s+' .
                    '([^,\n।.]+?)' .
                    '\s+(?:এলাকায়|এলাকায়|এলাকাতে|অঞ্চলে|অঞ্চল)\b/u',

                /*
             * ----------------------------------------------------
             * District + "তে/ে" + locality + area
             * ----------------------------------------------------
             *
             * সুনামগঞ্জে তাহিরপুর এলাকায়
             */
                '/(?:' .
                    $districtPattern .
                    ')(?:তে|ে)\s+' .
                    '([^,\n।.]+?)' .
                    '\s+(?:এলাকায়|এলাকায়|এলাকাতে|অঞ্চলে|অঞ্চল)\b/u',
            ];

            foreach ($banglaPatterns as $pattern) {
                if (
                    preg_match(
                        $pattern,
                        $text,
                        $matches
                    )
                ) {
                    $candidate = trim(
                        $matches[1]
                    );

                    /*
                 * Remove anything that clearly belongs
                 * to the sentence after the locality.
                 *
                 * Example:
                 *
                 * তাহিরপুর এলাকায় আত্মীয়ের বাড়িতে
                 *
                 * should never become the address.
                 */
                    $candidate = preg_replace(
                        '/\s+(?:আত্মীয়ের|আত্মীয়ের|নিজের|আমার|আমাদের|বাড়িতে|বাড়িতে|বাসায়|বাসায়|ঘরে|থাকি|থাকছি|আশ্রয়|আশ্রয়|আশ্রয়ে|আশ্রয়ে).*$/u',
                        '',
                        $candidate
                    );

                    $candidate = $this->cleanAddress(
                        $candidate
                    );

                    if (
                        $candidate !== '' &&
                        $this->looksLikeUsefulAddress(
                            $candidate
                        )
                    ) {
                        return $candidate;
                    }
                }
            }

            /*
         * ========================================================
         * 3. District → locality in Banglish
         * ========================================================
         *
         * Examples:
         *
         * Sunamganjer Tahirpur elakay
         * Sunamganj er Tahirpur elakay
         * Sunamganj-e Tahirpur elakay
         * Sunamganj e Tahirpur area
         *
         * Expected:
         *
         * Tahirpur
         */
            $englishDistrict =
                $this->districtToEnglish(
                    $district
                );

            if ($englishDistrict) {
                $englishDistrictPattern =
                    preg_quote(
                        $englishDistrict,
                        '/'
                    );

                $banglishPatterns = [
                    /*
                 * Sunamganjer Tahirpur elakay
                 *
                 * Also supports:
                 *
                 * Sunamganj er Tahirpur elakay
                 * Sunamganj r Tahirpur area
                 */
                    '/(?:' .
                        $englishDistrictPattern .
                        ')(?:er|r)?\s+' .
                        '([A-Za-z][A-Za-z\s-]{1,60}?)' .
                        '\s+(?:elakay|elakai|elakate|area)\b/iu',

                    /*
                 * Sunamganj-e Tahirpur elakay
                 */
                    '/(?:' .
                        $englishDistrictPattern .
                        ')(?:-e|e)\s+' .
                        '([A-Za-z][A-Za-z\s-]{1,60}?)' .
                        '\s+(?:elakay|elakai|elakate|area)\b/iu',
                ];

                foreach ($banglishPatterns as $pattern) {
                    if (
                        preg_match(
                            $pattern,
                            $text,
                            $matches
                        )
                    ) {
                        $candidate = trim(
                            $matches[1]
                        );

                        /*
                     * Prevent sentence fragments from
                     * becoming the address.
                     */
                        $candidate = preg_replace(
                            '/\s+(?:at|in|near|with|staying|living|taking|shelter|help|needed|chai|dorkar|proyojon).*$/iu',
                            '',
                            $candidate
                        );

                        $candidate =
                            $this->cleanAddress(
                                $candidate
                            );

                        if (
                            $candidate !== '' &&
                            $this->looksLikeUsefulAddress(
                                $candidate
                            )
                        ) {
                            return $candidate;
                        }
                    }
                }
            }
        }

        /*
     * ============================================================
     * 4. Standalone Bangla locality
     * ============================================================
     *
     * Example:
     *
     * তাহিরপুর এলাকায় থাকি।
     *
     * Expected:
     *
     * তাহিরপুর
     */
        if (
            preg_match(
                '/([^,\n।.]+?)\s+(?:এলাকায়|এলাকায়|এলাকাতে|অঞ্চলে|অঞ্চল)\b/u',
                $text,
                $matches
            )
        ) {
            $candidate = trim(
                $matches[1]
            );

            /*
         * If the captured text contains the district,
         * remove the district portion.
         */
            if ($district) {
                $candidate = preg_replace(
                    '/^' .
                        preg_quote(
                            $district,
                            '/'
                        ) .
                        '(?:এর|ের|র|য়ের|য়ের|য়|ে|তে)?\s+/u',
                    '',
                    $candidate
                );
            }

            $candidate = $this->cleanAddress(
                $candidate
            );

            if (
                $candidate !== '' &&
                $this->looksLikeUsefulAddress(
                    $candidate
                )
            ) {
                return $candidate;
            }
        }

        /*
     * ============================================================
     * 5. Standalone Banglish locality
     * ============================================================
     *
     * Example:
     *
     * Tahirpur elakay achi.
     *
     * Expected:
     *
     * Tahirpur
     */
        if (
            preg_match(
                '/([A-Za-z][A-Za-z\s-]{1,60}?)\s+(?:elakay|elakai|elakate|area)\b/iu',
                $text,
                $matches
            )
        ) {
            $candidate = trim(
                $matches[1]
            );

            $candidate = $this->cleanAddress(
                $candidate
            );

            if (
                $candidate !== '' &&
                $this->looksLikeUsefulAddress(
                    $candidate
                )
            ) {
                return $candidate;
            }
        }

        /*
     * Nothing useful was found.
     */
        return null;
    }

    /**
     * Map district Bengali names to common English spellings.
     */
    protected function districtToEnglish(
        string $district
    ): ?string {
        $map = [
            'সুনামগঞ্জ' => 'Sunamganj',
            'ঢাকা' => 'Dhaka',
            'চট্টগ্রাম' => 'Chattogram',
            'কুমিল্লা' => 'Cumilla',
            'কক্সবাজার' => 'Coxsbazar',
            'সিলেট' => 'Sylhet',
            'রাজশাহী' => 'Rajshahi',
            'খুলনা' => 'Khulna',
            'বরিশাল' => 'Barisal',
            'রংপুর' => 'Rangpur',
            'ময়মনসিংহ' => 'Mymensingh',
            'গাজীপুর' => 'Gazipur',
            'নারায়ণগঞ্জ' => 'Narayanganj',
            'টাঙ্গাইল' => 'Tangail',
            'ফরিদপুর' => 'Faridpur',
            'নোয়াখালী' => 'Noakhali',
            'কিশোরগঞ্জ' => 'Kishoreganj',
            'দিনাজপুর' => 'Dinajpur',
            'পাবনা' => 'Pabna',
            'যশোর' => 'Jashore',
            'বগুড়া' => 'Bogura',
            'কুড়িগ্রাম' => 'Kurigram',
            'ঠাকুরগাঁও' => 'Thakurgaon',
        ];

        return $map[$district] ?? null;
    }

    /**
     * Prevent long sentences from becoming addresses.
     */
    protected function looksLikeUsefulAddress(
        string $candidate
    ): bool {
        $candidate = trim($candidate);

        if ($candidate === '') {
            return false;
        }

        /*
         * Reject obvious sentence fragments.
         */
        $badFragments = [
            'আত্মীয়ের বাড়িতে',
            'আত্মীয়ের বাড়িতে',
            'বাড়িতে',
            'বাড়িতে',
            'থাকি',
            'থাকছি',
            'আশ্রয় নিয়েছি',
            'আশ্রয় নিয়েছি',
            'সাহায্য প্রয়োজন',
            'সাহায্য দরকার',
            'help needed',
            'help need',
            'staying',
            'living',
        ];

        $normalized = $this->normalizeForMatching(
            $candidate
        );

        foreach ($badFragments as $fragment) {
            if (
                Str::contains(
                    $normalized,
                    $this->normalizeForMatching($fragment)
                )
            ) {
                return false;
            }
        }

        /*
         * If it contains too many words, it is probably
         * a sentence rather than a locality.
         */
        $wordCount = preg_match_all(
            '/[\p{L}\p{N}]+/u',
            $candidate,
            $dummy
        );

        if ($wordCount !== false && $wordCount > 4) {
            return false;
        }

        return mb_strlen($candidate) <= 80;
    }

    /**
     * Clean extracted address.
     */
    protected function cleanAddress(
        string $address
    ): string {
        $address = trim($address);

        $address = preg_replace(
            '/^(?:এলাকা|অঞ্চল)\s*/u',
            '',
            $address
        );

        $address = preg_replace(
            '/\s+(?:এলাকায়|এলাকায়|অঞ্চলে|অঞ্চল|এলাকাতে)$/u',
            '',
            $address
        );

        $address = preg_replace(
            '/\s+(?:area|elakay|elakai|elakate)$/iu',
            '',
            $address
        );

        return trim(
            $address,
            " \t\n\r\0\x0B,.-"
        );
    }

    /**
     * Extract explicit deadline.
     */
    protected function extractDeadline(
        string $text
    ): ?string {
        /*
         * Bangla relative deadlines.
         */
        $banglaPatterns = [
            '/(?:আগামী|পরের)\s+[০-৯0-9]+\s+(?:দিনের|দিন)\s+(?:মধ্যে|ভিতরে)/u',

            '/(?:আগামী|পরের)\s+[০-৯0-9]+\s+(?:সপ্তাহের|সপ্তাহ)\s+(?:মধ্যে|ভিতরে)/u',

            '/(?:আগামী|পরের)\s+[০-৯0-9]+\s+(?:মাসের|মাস)\s+(?:মধ্যে|ভিতরে)/u',

            '/(?:আগামী|পরের)\s+(?:এক|দুই|তিন|চার|পাঁচ|ছয়|ছয়|সাত|আট|নয়|নয়)\s+(?:দিনের|দিন|সপ্তাহের|সপ্তাহ|মাসের|মাস)\s+(?:মধ্যে|ভিতরে)/u',

            '/আগামী\s+কয়েক\s+দিন(?:ের\s+মধ্যে|য়ের\s+মধ্যে|র\s+মধ্যে)?/u',

            '/আগামী\s+কয়েক\s+দিন(?:ের\s+মধ্যে|য়ের\s+মধ্যে|র\s+মধ্যে)?/u',
        ];

        foreach ($banglaPatterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return trim($matches[0]);
            }
        }

        /*
         * English deadlines.
         */
        $englishPatterns = [
            '/(?:within|in)\s+[0-9]+\s+(?:day|days|week|weeks|month|months)(?:\s+from\s+now)?/iu',

            '/(?:within|in)\s+(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:day|days|week|weeks|month|months)(?:\s+from\s+now)?/iu',

            '/(?:by|before)\s+([^.\n]+)/iu',
        ];

        foreach ($englishPatterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return trim(
                    $matches[0]
                );
            }
        }

        /*
         * Banglish deadlines.
         *
         * Examples:
         * agami 10 diner moddhe
         * 10 diner moddhe
         * 2 soptaher moddhe
         * next 10 days er moddhe
         */
        $banglishPatterns = [
            '/(?:agami|porer)\s+[0-9]+\s+(?:diner|din|soptaher|soptaho|shoptaher|shoptaho|maser|mas)\s+(?:moddhe|bhitore)/iu',

            '/(?:next|within|in)\s+[0-9]+\s+(?:days?|weeks?|months?)\s+(?:er\s+)?(?:moddhe|bhitore)/iu',

            '/[0-9]+\s+(?:diner|din|soptaher|soptaho|shoptaher|shoptaho|maser|mas)\s+(?:moddhe|bhitore)/iu',

            '/(?:agami|porer)\s+(?:ek|dui|tin|char|pach|choy|sat|aat|noy|dosh)\s+(?:diner|din|soptaher|soptaho|shoptaher|shoptaho|maser|mas)\s+(?:moddhe|bhitore)/iu',
        ];

        foreach ($banglishPatterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return trim($matches[0]);
            }
        }

        /*
         * Bangla calendar/date style.
         */
        $datePatterns = [
            '/(?:আগামী\s+)?[০-৯0-9]{1,2}\s*(?:ই|ঈ)?\s*[জানুয়ারিফেব্রুয়ারিমার্চএপ্রিলমেজুনজুলাইআগস্টসেপ্টেম্বরঅক্টোবরনভেম্বরডিসেম্বর]+\s*[০-৯0-9]{0,4}/u',

            '/[০-৯0-9]{1,2}[\/\-][০-৯0-9]{1,2}[\/\-][০-৯0-9]{2,4}/u',

            '/[0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4}/u',
        ];

        foreach ($datePatterns as $pattern) {
            if (
                preg_match(
                    $pattern,
                    $text,
                    $matches
                )
            ) {
                return trim($matches[0]);
            }
        }

        return null;
    }

    /**
     * Extract explicit useful keywords.
     */
    protected function extractKeywords(
        string $text,
        string $category,
        ?string $district,
        ?string $address
    ): array {
        $keywords = [];

        if ($district) {
            $keywords[] = $district;
        }

        if ($address) {
            $keywords[] = $address;
        }

        $keywordGroups = [
            'healthcare' => [
                'চিকিৎসা',
                'ডাক্তার',
                'হাসপাতাল',
                'ওষুধ',
                'রোগী',
                'চিকিৎসা',
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
                'শিক্ষার্থী',
                'student',
                'school',
                'education',
            ],

            'food-assistance' => [
                'খাবার',
                'খাদ্য',
                'চাল',
                'ডাল',
                'food',
                'rice',
                'khabar',
            ],

            'shelter' => [
                'আশ্রয়',
                'আশ্রয়',
                'বাড়ি',
                'বাড়ি',
                'ঘর',
                'বাসস্থান',
                'shelter',
                'house',
                'home',
            ],

            'livelihood' => [
                'জীবিকা',
                'কাজ',
                'চাকরি',
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
                'ঝড়',
                'ঝড়',
                'দুর্যোগ',
                'flood',
                'cyclone',
                'storm',
                'disaster',
            ],

            'water-sanitation' => [
                'পানি',
                'বিশুদ্ধ পানি',
                'টয়লেট',
                'টয়লেট',
                'স্যানিটেশন',
                'water',
                'toilet',
                'sanitation',
            ],

            'child-support' => [
                'শিশু',
                'বাচ্চা',
                'সন্তান',
                'child',
                'children',
                'baby',
            ],

            'women-support' => [
                'নারী',
                'মহিলা',
                'মেয়েদের',
                'মেয়েদের',
                'women',
                'woman',
            ],

            'disability-support' => [
                'প্রতিবন্ধী',
                'প্রতিবন্ধিতা',
                'দৃষ্টিহীন',
                'disabled',
                'disability',
                'blind',
            ],

            'emergency-relief' => [
                'জরুরি',
                'জরুরী',
                'জরুরি সাহায্য',
                'জরুরি সহায়তা',
                'জরুরি সহায়তা',
                'emergency',
                'urgent help',
                'joruri',
            ],
        ];

        foreach (
            $keywordGroups[$category] ?? []
            as $keyword
        ) {
            if (
                Str::contains(
                    $this->normalizeForMatching($text),
                    $this->normalizeForMatching($keyword)
                )
            ) {
                $keywords[] = $keyword;
            }
        }

        return $this->normalizeKeywords($keywords);
    }

    /**
     * Generate a concise title.
     */
    protected function generateTitle(
        string $text,
        string $category,
        ?string $district,
        ?string $address
    ): string {
        $categoryTitles = [
            'education' => 'শিক্ষা সহায়তার প্রয়োজন',
            'healthcare' => 'চিকিৎসা সহায়তার প্রয়োজন',
            'food-assistance' => 'খাদ্য সহায়তার প্রয়োজন',
            'shelter' => 'আশ্রয় সহায়তার প্রয়োজন',
            'livelihood' => 'জীবিকা সহায়তার প্রয়োজন',
            'disaster-relief' => 'দুর্যোগ সহায়তার প্রয়োজন',
            'water-sanitation' => 'পানি ও স্যানিটেশন সহায়তার প্রয়োজন',
            'child-support' => 'শিশু সহায়তার প্রয়োজন',
            'women-support' => 'নারী সহায়তার প্রয়োজন',
            'disability-support' => 'প্রতিবন্ধী সহায়তার প্রয়োজন',
            'emergency-relief' => 'জরুরি সহায়তার প্রয়োজন',
            'other' => 'সহায়তার প্রয়োজন',
        ];

        $baseTitle = $categoryTitles[$category]
            ?? 'সহায়তার প্রয়োজন';

        if ($address) {
            return $address . ' এলাকায় ' . $baseTitle;
        }

        if ($district) {
            return $district . ' এলাকায় ' . $baseTitle;
        }

        return $baseTitle;
    }

    /**
     * Validate and normalize analysis output.
     */
    protected function validateAnalysis(
        array $analysis,
        string $originalText,
        $categories
    ): array {
        $validSlugs = $categories
            ->pluck('slug')
            ->values()
            ->all();

        $category = $analysis['category'] ?? null;

        if (!in_array($category, $validSlugs, true)) {
            $category = $this->detectCategory(
                $originalText,
                $categories
            );
        }

        $urgency = $analysis['urgency'] ?? 'normal';

        if (
            !in_array(
                $urgency,
                [
                    'low',
                    'normal',
                    'high',
                    'critical',
                ],
                true
            )
        ) {
            $urgency = 'normal';
        }

        return [
            'title' => $this->nullableString(
                $analysis['title'] ?? null
            ) ?: $this->generateTitle(
                $originalText,
                $category,
                $this->nullableString(
                    $analysis['district'] ?? null
                ),
                $this->nullableString(
                    $analysis['address'] ?? null
                )
            ),

            'description' =>
            $this->nullableString(
                $analysis['description'] ?? null
            ) ?: $originalText,

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

    /**
     * Normalize Bangla/English/Banglish text for matching.
     */
    protected function normalizeForMatching(
        string $value
    ): string {
        $value = trim($value);

        $value = mb_strtolower(
            $value,
            'UTF-8'
        );

        /*
         * Normalize punctuation/separators.
         */
        $value = str_replace(
            [
                '–',
                '—',
                '_',
                ',',
                '।',
                '.',
                ':',
                ';',
                '(',
                ')',
            ],
            ' ',
            $value
        );

        /*
         * Normalize repeated whitespace.
         */
        $value = preg_replace(
            '/\s+/u',
            ' ',
            $value
        );

        return trim($value);
    }

    /**
     * Normalize nullable strings.
     */
    protected function nullableString(
        mixed $value
    ): ?string {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === ''
            ? null
            : $value;
    }

    /**
     * Normalize keyword list.
     */
    protected function normalizeKeywords(
        mixed $keywords
    ): array {
        if (!is_array($keywords)) {
            return [];
        }

        $result = [];

        foreach ($keywords as $keyword) {
            if (!is_string($keyword)) {
                continue;
            }

            $keyword = trim($keyword);

            if ($keyword === '') {
                continue;
            }

            $result[] = $keyword;
        }

        return array_values(
            array_unique($result)
        );
    }
}
