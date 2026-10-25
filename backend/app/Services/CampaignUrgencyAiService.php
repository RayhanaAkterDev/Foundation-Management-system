<?php

namespace App\Services;

use App\Models\Campaign;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class CampaignUrgencyAiService
{
    /**
     * Assess a campaign's urgency without approving or publishing it.
     *
     * Returns:
     * - urgency: low | normal | high | critical
     * - priority: 1 | 2 | 3 | 4
     * - reason: explanation for the recommendation
     * - missing_information: information that would help assessment
     * - provider: openai
     */
    public function assess(Campaign $campaign): array
    {
        $apiKey = config('services.openai.api_key');

        if (! is_string($apiKey) || trim($apiKey) === '') {
            throw new RuntimeException(
                'Campaign urgency assessment requires OPENAI_API_KEY to be configured.'
            );
        }

        $campaign->loadMissing('helpRequest');

        $context = $this->buildCampaignContext($campaign);

        $systemPrompt = <<<'PROMPT'
You assess the urgency of humanitarian campaigns for an administrator.

Return only valid JSON with this exact structure:
{
  "urgency": "low",
  "reason": "A concise explanation grounded in the supplied information.",
  "missing_information": []
}

Rules:
- urgency must be exactly one of: low, normal, high, critical.
- Assess the urgency of the humanitarian need, not the campaign's popularity.
- Consider severity, consequences of delay, vulnerability of affected people,
  number of people affected, evidence, and time sensitivity.
- A deadline by itself does not make a campaign critical.
- Do not invent facts, numbers, medical conditions, deadlines, or evidence.
- If important information is missing, mention it in missing_information.
- Use critical only when the supplied facts indicate an immediate or exceptionally
  severe humanitarian need.
- Use high for serious needs where timely action matters.
- Use normal for meaningful needs without evidence of exceptional urgency.
- Use low when the available information indicates limited time sensitivity.
- If the information is insufficient, use normal and explain the uncertainty.
- Keep the reason concise and factual.
- missing_information must be a JSON array of short strings.
- Do not approve, reject, publish, feature, or assign the campaign.
PROMPT;

        try {
            $response = Http::timeout(
                (int) config('services.openai.timeout', 30)
            )
                ->withToken($apiKey)
                ->acceptJson()
                ->post('https://api.openai.com/v1/responses', [
                    'model' => config('services.openai.model', 'gpt-5-mini'),
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
                                    'text' => json_encode(
                                        $context,
                                        JSON_PRETTY_PRINT
                                            | JSON_UNESCAPED_UNICODE
                                            | JSON_THROW_ON_ERROR
                                    ),
                                ],
                            ],
                        ],
                    ],
                ]);

            if (! $response->successful()) {
                Log::error('Campaign urgency AI request failed.', [
                    'campaign_id' => $campaign->id,
                    'http_status' => $response->status(),
                    'response' => $response->json(),
                ]);

                throw new RuntimeException(
                    'The AI provider could not assess campaign urgency. Please try again.'
                );
            }

            $payload = $response->json();
            $outputText = $this->extractOutputText($payload);

            if ($outputText === null) {
                throw new RuntimeException(
                    'The AI provider returned an empty campaign urgency assessment.'
                );
            }

            $assessment = json_decode(
                $outputText,
                true,
                512,
                JSON_THROW_ON_ERROR
            );

            return $this->validateAssessment($assessment);
        } catch (RuntimeException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            Log::error('Campaign urgency AI assessment failed.', [
                'campaign_id' => $campaign->id,
                'error' => $exception->getMessage(),
            ]);

            throw new RuntimeException(
                'Campaign urgency assessment failed. Please try again.',
                previous: $exception
            );
        }
    }

    /**
     * Build context using campaign fields and its optional linked help request.
     */
    private function buildCampaignContext(Campaign $campaign): array
    {
        $campaignFields = [
            'title',
            'description',
            'category',
            'type',
            'scope',
            'district',
            'location',
            'affected_area',
            'affected_people',
            'start_date',
            'end_date',
            'deadline',
            'target_amount',
        ];

        $context = [
            'campaign_id' => $campaign->id,
            'campaign' => [],
            'linked_help_request' => null,
        ];

        foreach ($campaignFields as $field) {
            if (array_key_exists($field, $campaign->getAttributes())) {
                $context['campaign'][$field] = $campaign->getAttribute($field);
            }
        }

        $helpRequest = $campaign->helpRequest;

        if ($helpRequest) {
            $helpRequestFields = [
                'id',
                'title',
                'description',
                'category',
                'urgency',
                'priority',
                'status',
                'district',
                'location',
                'people_count',
                'created_at',
            ];

            $context['linked_help_request'] = [];

            foreach ($helpRequestFields as $field) {
                if (array_key_exists($field, $helpRequest->getAttributes())) {
                    $value = $helpRequest->getAttribute($field);

                    $context['linked_help_request'][$field] =
                        $value instanceof \DateTimeInterface
                        ? $value->format(DATE_ATOM)
                        : $value;
                }
            }
        }

        return $context;
    }

    /**
     * Extract text from the OpenAI Responses API payload.
     */
    private function extractOutputText(array $payload): ?string
    {
        if (isset($payload['output_text']) && is_string($payload['output_text'])) {
            return trim($payload['output_text']);
        }

        foreach ($payload['output'] ?? [] as $output) {
            foreach ($output['content'] ?? [] as $content) {
                if (
                    ($content['type'] ?? null) === 'output_text'
                    && isset($content['text'])
                    && is_string($content['text'])
                ) {
                    return trim($content['text']);
                }
            }
        }

        return null;
    }

    /**
     * Validate and normalize the AI response.
     */
    private function validateAssessment(mixed $assessment): array
    {
        if (! is_array($assessment)) {
            throw new RuntimeException(
                'The AI provider returned an invalid campaign urgency assessment.'
            );
        }

        $urgency = strtolower(trim((string) ($assessment['urgency'] ?? '')));
        $allowedUrgencies = array_keys(Campaign::aiUrgencies());

        if (! in_array($urgency, $allowedUrgencies, true)) {
            throw new RuntimeException(
                'The AI provider returned an unsupported urgency level.'
            );
        }

        $reason = trim((string) ($assessment['reason'] ?? ''));

        if ($reason === '') {
            throw new RuntimeException(
                'The AI provider did not explain its urgency recommendation.'
            );
        }

        $missingInformation = $assessment['missing_information'] ?? [];

        if (! is_array($missingInformation)) {
            $missingInformation = [];
        }

        $missingInformation = array_values(array_filter(
            array_map(
                static fn($item) => is_string($item) ? trim($item) : '',
                $missingInformation
            ),
            static fn(string $item) => $item !== ''
        ));

        $priorities = [
            'low' => 1,
            'normal' => 2,
            'high' => 3,
            'critical' => 4,
        ];

        return [
            'urgency' => $urgency,
            'priority' => $priorities[$urgency],
            'reason' => $reason,
            'missing_information' => $missingInformation,
            'provider' => 'openai',
        ];
    }
}
