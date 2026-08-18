<?php

namespace App\Services\Campaign;

use App\Models\Campaign;
use Illuminate\Validation\ValidationException;

class CampaignService
{
    public function createLocalCaseCampaign(array $data): Campaign
    {
        $this->validateLocalCaseData($data);

        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_LOCAL_CASE,
            'status' => Campaign::STATUS_ACTIVE,
        ]);
    }

    public function proposeOrganizationCampaign(array $data): Campaign
    {
        $this->validateOrganizationProposalData($data);

        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_ORGANIZATION_PROPOSED,
            'status' => Campaign::STATUS_PENDING_REVIEW,
            'proposal_date' => now()->toDateString(),
        ]);
    }

    public function createGlobalCampaign(array $data): Campaign
    {
        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_GLOBAL_SITUATION,
            'status' => Campaign::STATUS_ACTIVE,
        ]);
    }

    public function approveOrganizationProposal(
        Campaign $campaign,
        int $adminId,
        ?string $verificationNote = null
    ): Campaign {
        $this->ensureOrganizationProposal($campaign);

        if ($campaign->status !== Campaign::STATUS_PENDING_REVIEW) {
            throw ValidationException::withMessages([
                'status' => 'Only pending organization proposals can be approved.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_ACTIVE,
            'verified_by' => $adminId,
            'verified_at' => now(),
            'verification_note' => $verificationNote,
        ]);

        return $campaign->fresh();
    }

    public function rejectOrganizationProposal(
        Campaign $campaign,
        int $adminId,
        ?string $verificationNote = null
    ): Campaign {
        $this->ensureOrganizationProposal($campaign);

        if ($campaign->status !== Campaign::STATUS_PENDING_REVIEW) {
            throw ValidationException::withMessages([
                'status' => 'Only pending organization proposals can be rejected.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_REJECTED,
            'verified_by' => $adminId,
            'verified_at' => now(),
            'verification_note' => $verificationNote,
        ]);

        return $campaign->fresh();
    }

    public function startCampaign(Campaign $campaign): Campaign
    {
        if (!in_array($campaign->status, [
            Campaign::STATUS_ACTIVE,
            Campaign::STATUS_PUBLISHED,
        ], true)) {
            throw ValidationException::withMessages([
                'status' => 'Only published or active campaigns can be started.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_IN_PROGRESS,
        ]);

        return $campaign->fresh();
    }

    public function completeCampaign(Campaign $campaign): Campaign
    {
        if ($campaign->status !== Campaign::STATUS_IN_PROGRESS) {
            throw ValidationException::withMessages([
                'status' => 'Only campaigns in progress can be completed.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_COMPLETED,
        ]);

        return $campaign->fresh();
    }

    public function cancelCampaign(Campaign $campaign): Campaign
    {
        if (in_array($campaign->status, [
            Campaign::STATUS_COMPLETED,
            Campaign::STATUS_REJECTED,
            Campaign::STATUS_CANCELLED,
        ], true)) {
            throw ValidationException::withMessages([
                'status' => 'This campaign cannot be cancelled.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_CANCELLED,
        ]);

        return $campaign->fresh();
    }

    private function validateLocalCaseData(array $data): void
    {
        if (empty($data['help_request_id'])) {
            throw ValidationException::withMessages([
                'help_request_id' => 'A local case campaign must be linked to a help request.',
            ]);
        }
    }

    private function validateOrganizationProposalData(array $data): void
    {
        if (empty($data['organization_id'])) {
            throw ValidationException::withMessages([
                'organization_id' => 'An organization-proposed campaign must belong to an organization.',
            ]);
        }
    }

    private function ensureOrganizationProposal(Campaign $campaign): void
    {
        if ($campaign->type !== Campaign::TYPE_ORGANIZATION_PROPOSED) {
            throw ValidationException::withMessages([
                'type' => 'This action is only available for organization-proposed campaigns.',
            ]);
        }
    }
}
