<?php

namespace App\Services;

use App\Models\Campaign;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

class CampaignUrgencyAiService
{
    private const PRIORITIES = [
        'low' => 1,
        'normal' => 2,
        'high' => 3,
        'critical' => 4,
    ];

    /**
     * Assess humanitarian campaign urgency using local rules.
     *
     * No external AI provider or API key is required.
     *
     * This method only recommends urgency. It does not update
     * the campaign's admin-approved classification.
     */
    public function assess(Campaign $campaign): array
    {
        $campaign->loadMissing('helpRequest');

        $context = $this->buildCampaignContext($campaign);

        $assessment = $this->evaluate($context);

        Log::info('Rule-based campaign urgency assessment completed.', [
            'campaign_id' => $campaign->id,
            'urgency' => $assessment['urgency'],
            'provider' => 'rule_based',
        ]);

        return $assessment;
    }

    /**
     * Collect only attributes available on the existing models.
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
            'affected_areas',
            'target_amount',
            'start_date',
            'end_date',
            'status',
        ];

        $context = [
            'campaign_id' => $campaign->id,
            'campaign' => [],
            'linked_help_request' => null,
        ];

        foreach ($campaignFields as $field) {
            if (array_key_exists($field, $campaign->getAttributes())) {
                $context['campaign'][$field] =
                    $campaign->getAttribute($field);
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
                if (array_key_exists(
                    $field,
                    $helpRequest->getAttributes()
                )) {
                    $value = $helpRequest->getAttribute($field);

                    if ($value instanceof \DateTimeInterface) {
                        $value = $value->format(DATE_ATOM);
                    }

                    $context['linked_help_request'][$field] = $value;
                }
            }
        }

        return $context;
    }

    /**
     * Evaluate urgency from explicit request classifications and
     * evidence in the available campaign/help-request descriptions.
     */
    private function evaluate(array $context): array
    {
        $campaign = $context['campaign'] ?? [];
        $helpRequest = $context['linked_help_request'] ?? [];

        $title = $this->toText($campaign['title'] ?? '');
        $description = $this->toText($campaign['description'] ?? '');
        $requestTitle = $this->toText($helpRequest['title'] ?? '');
        $requestDescription = $this->toText(
            $helpRequest['description'] ?? ''
        );

        $evidenceText = $this->normalizeText(implode(' ', [
            $title,
            $description,
            $requestTitle,
            $requestDescription,
        ]));

        $explicitUrgency = $this->normalizeText(
            $helpRequest['urgency'] ?? ''
        );

        $explicitPriority = $helpRequest['priority'] ?? null;

        $reasons = [];
        $missingInformation = [];

        $urgency = 'normal';

        /*
         * Rule 1: Immediate, exceptionally severe humanitarian danger.
         *
         * These keywords are signals for administrator review, not
         * proof that the described situation has been verified.
         */
        $criticalTerms = [
            'life threatening',
            'life-threatening',
            'life is at risk',
            'life at risk',
            'life in danger',
            'life-threatening condition',
            'critical condition',
            'severe bleeding',
            'unconscious',
            'not breathing',
            'immediate life-saving',
            'immediate lifesaving',
            'মুমূর্ষু',
            'জীবন সংকটাপন্ন',
            'জীবন সংকটে',
            'জীবন ঝুঁকিতে',
            'প্রাণ সংশয়',
            'প্রাণ সংশয়',
            'শ্বাস নিতে পারছে না',
            'অচেতন',
            'অতিরিক্ত রক্তক্ষরণ',
            'জীবন রক্ষাকারী জরুরি',
        ];

        $highSeverityTerms = [
            'urgent medical',
            'emergency medical',
            'emergency treatment',
            'emergency surgery',
            'urgent surgery',
            'serious injury',
            'severe injury',
            'serious illness',
            'severe illness',
            'essential medication',
            'no food',
            'without food',
            'no shelter',
            'without shelter',
            'displaced family',
            'গুরুতর অসুস্থ',
            'গুরুতর আহত',
            'জরুরি চিকিৎসা',
            'জরুরি অপারেশন',
            'জরুরি অস্ত্রোপচার',
            'চিকিৎসার জন্য জরুরি',
            'খাবার নেই',
            'খাদ্য নেই',
            'আশ্রয় নেই',
            'আশ্রয় নেই',
            'গৃহহীন',
        ];

        $criticalMatches = $this->findTerms(
            $evidenceText,
            $criticalTerms
        );

        $highSeverityMatches = $this->findTerms(
            $evidenceText,
            $highSeverityTerms
        );

        $explicitLevel = $this->interpretExplicitUrgency(
            $explicitUrgency,
            $explicitPriority
        );

        if ($criticalMatches !== []) {
            $urgency = 'critical';

            $reasons[] = 'Potential immediate or exceptionally severe danger was indicated by: '
                . implode(', ', $criticalMatches)
                . '. This requires administrator verification.';
        } elseif ($explicitLevel === 'critical') {
            $urgency = 'critical';

            $reasons[] = 'The linked help request explicitly records critical urgency or priority 4.';
        } elseif ($highSeverityMatches !== []) {
            $urgency = 'high';

            $reasons[] = 'The campaign or linked request describes potentially serious humanitarian needs: '
                . implode(', ', $highSeverityMatches)
                . '. Timely administrator review is recommended.';
        } elseif ($explicitLevel === 'high') {
            $urgency = 'high';

            $reasons[] = 'The linked help request records high or urgent priority.';
        } elseif ($explicitLevel === 'low') {
            $urgency = 'low';

            $reasons[] = 'The linked help request explicitly records low urgency, and no higher-severity keyword was detected.';
        } elseif ($explicitLevel === 'normal') {
            $urgency = 'normal';

            $reasons[] = 'The linked help request records normal urgency, and no higher-severity signal was detected.';
        } else {
            $urgency = 'normal';

            $reasons[] = 'No explicit urgency classification or recognized immediate-danger signal was found. Normal is a provisional recommendation, not a confirmation that the situation is safe.';
        }

        /*
         * Explain uncertainty instead of inventing facts.
         */
        if (trim($title) === '' && trim($requestTitle) === '') {
            $missingInformation[] =
                'A clear campaign or help-request title is unavailable.';
        }

        if (
            trim($description) === ''
            && trim($requestDescription) === ''
        ) {
            $missingInformation[] =
                'A detailed description of the humanitarian need is missing.';
        }

        if ($helpRequest === null) {
            $missingInformation[] =
                'No linked help request is available to corroborate the campaign details.';
        } else {
            if (
                ! array_key_exists('urgency', $helpRequest)
                || trim($this->toText($helpRequest['urgency'])) === ''
            ) {
                $missingInformation[] =
                    'The linked help request has no explicit urgency value.';
            }

            if (
                ! array_key_exists('priority', $helpRequest)
                || $helpRequest['priority'] === null
                || $helpRequest['priority'] === ''
            ) {
                $missingInformation[] =
                    'The linked help request has no explicit priority value.';
            }
        }

        if (
            ! array_key_exists('location', $campaign)
            && ! array_key_exists('district', $campaign)
            && ! array_key_exists('location', $helpRequest ?? [])
            && ! array_key_exists('district', $helpRequest ?? [])
        ) {
            $missingInformation[] =
                'The affected location could not be established from available fields.';
        }

        if ($criticalMatches !== [] || $highSeverityMatches !== []) {
            $missingInformation[] =
                'Verify the reported severity and supporting evidence before confirming the recommendation.';
        }

        $missingInformation = array_values(array_unique(
            $missingInformation
        ));

        return [
            'urgency' => $urgency,
            'priority' => self::PRIORITIES[$urgency],
            'reason' => implode(' ', $reasons),
            'missing_information' => $missingInformation,
            'provider' => 'rule_based',
        ];
    }

    /**
     * Interpret only known urgency labels and numeric priority values.
     */
    private function interpretExplicitUrgency(
        string $urgency,
        mixed $priority
    ): ?string {
        $urgency = $this->normalizeText($urgency);

        $priorityValue = null;

        if (
            is_numeric($priority)
            && (int) $priority >= 1
            && (int) $priority <= 4
        ) {
            $priorityValue = (int) $priority;
        }

        $priorityMap = [
            1 => 'low',
            2 => 'normal',
            3 => 'high',
            4 => 'critical',
        ];

        $explicit = match ($urgency) {
            'critical',
            'emergency',
            'immediate',
            'জরুরি জীবনসংকট',
            'অতি জরুরি' => 'critical',

            'high',
            'urgent',
            'very urgent',
            'উচ্চ',
            'জরুরি',
            'অত্যন্ত জরুরি' => 'high',

            'normal',
            'medium',
            'moderate',
            'মাঝারি',
            'স্বাভাবিক' => 'normal',

            'low',
            'not urgent',
            'non-urgent',
            'নিম্ন',
            'কম জরুরি' => 'low',

            default => null,
        };

        $fromPriority = $priorityValue !== null
            ? $priorityMap[$priorityValue]
            : null;

        /*
         * Prefer the more severe of two explicit classifications.
         * This prevents a low numeric priority from overriding an
         * explicitly recorded critical urgency.
         */
        if ($explicit === null) {
            return $fromPriority;
        }

        if ($fromPriority === null) {
            return $explicit;
        }

        return self::PRIORITIES[$explicit] >= self::PRIORITIES[$fromPriority]
            ? $explicit
            : $fromPriority;
    }

    /**
     * Find phrases present in the available evidence text.
     */
    private function findTerms(string $text, array $terms): array
    {
        $matches = [];

        foreach ($terms as $term) {
            if (str_contains($text, $this->normalizeText($term))) {
                $matches[] = $term;
            }
        }

        return array_values(array_unique($matches));
    }

    private function normalizeText(mixed $value): string
    {
        return strtolower(trim($this->toText($value)));
    }

    private function toText(mixed $value): string
    {
        if (is_string($value) || is_numeric($value)) {
            return (string) $value;
        }

        return '';
    }
}
