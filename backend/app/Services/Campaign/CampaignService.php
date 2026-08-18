<?php

namespace App\Services\Campaign;

use App\Models\Campaign;
use Illuminate\Validation\ValidationException;

class CampaignService
{
    /*
    |--------------------------------------------------------------------------
    | Create Local Case Campaign
    |--------------------------------------------------------------------------
    */

    public function createLocalCaseCampaign(array $data): Campaign
    {
        $this->validateLocalCaseData($data);

        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_LOCAL_CASE,
            'status' => Campaign::STATUS_UNVERIFIED,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Organization-Proposed Campaign
    |--------------------------------------------------------------------------
    */

    public function proposeOrganizationCampaign(array $data): Campaign
    {
        $this->validateOrganizationProposalData($data);

        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_ORGANIZATION_PROPOSED,
            'status' => Campaign::STATUS_UNVERIFIED,
            'proposal_date' => now()->toDateString(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Global Situation Campaign
    |--------------------------------------------------------------------------
    */

    public function createGlobalCampaign(array $data): Campaign
    {
        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_GLOBAL_SITUATION,
            'status' => Campaign::STATUS_UNVERIFIED,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Campaign
    |--------------------------------------------------------------------------
    |
    | Verification is available for EVERY campaign type.
    |
    | unverified → active
    |
    */

    public function verifyCampaign(
        Campaign $campaign,
        int $adminId,
        ?string $verificationNote = null
    ): Campaign {

        if ($campaign->status !== Campaign::STATUS_UNVERIFIED) {
            throw ValidationException::withMessages([
                'status' => 'Only unverified campaigns can be verified.',
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

    /*
    |--------------------------------------------------------------------------
    | Reject Campaign
    |--------------------------------------------------------------------------
    |
    | Verification is available for EVERY campaign type.
    |
    | unverified → rejected
    |
    */

    public function rejectCampaign(
        Campaign $campaign,
        int $adminId,
        ?string $verificationNote = null
    ): Campaign {

        if ($campaign->status !== Campaign::STATUS_UNVERIFIED) {
            throw ValidationException::withMessages([
                'status' => 'Only unverified campaigns can be rejected.',
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

    /*
    |--------------------------------------------------------------------------
    | Update Campaign Status
    |--------------------------------------------------------------------------
    |
    | After verification, Admin can update the operational status:
    |
    | active → completed
    | active → cancelled
    |
    | Rejected campaigns cannot be changed through this method.
    |
    */

    public function updateStatus(
        Campaign $campaign,
        string $status
    ): Campaign {

        $allowedTransitions = [
            Campaign::STATUS_ACTIVE => [
                Campaign::STATUS_COMPLETED,
                Campaign::STATUS_CANCELLED,
            ],
        ];

        $currentStatus = $campaign->status;

        if (!isset($allowedTransitions[$currentStatus])) {
            throw ValidationException::withMessages([
                'status' => "Campaign with status '{$currentStatus}' cannot be updated.",
            ]);
        }

        if (!in_array($status, $allowedTransitions[$currentStatus], true)) {
            throw ValidationException::withMessages([
                'status' => "Campaign cannot be changed from '{$currentStatus}' to '{$status}'.",
            ]);
        }

        $campaign->update([
            'status' => $status,
        ]);

        return $campaign->fresh();
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Local Case Campaign
    |--------------------------------------------------------------------------
    */

    private function validateLocalCaseData(array $data): void
    {
        if (empty($data['help_request_id'])) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'A local case campaign must be linked to a help request.',
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Organization-Proposed Campaign
    |--------------------------------------------------------------------------
    */

    private function validateOrganizationProposalData(array $data): void
    {
        if (empty($data['organization_id'])) {
            throw ValidationException::withMessages([
                'organization_id' =>
                'An organization-proposed campaign must belong to an organization.',
            ]);
        }
    }
}
