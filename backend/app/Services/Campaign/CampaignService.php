<?php

namespace App\Services\Campaign;

use App\Models\Campaign;
use App\Models\HelpRequest;
use App\Models\HelpRequestAssignment;
use Illuminate\Validation\ValidationException;

class CampaignService
{
    /*
    |--------------------------------------------------------------------------
    | Create Local Case Campaign
    |--------------------------------------------------------------------------
    |
    | Rules:
    |
    | - Must have a Help Request.
    | - Must remain unverified until Admin review.
    | - If an organization is attached, that organization must actually
    |   be assigned to the selected Help Request.
    |
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
    |
    | Rules:
    |
    | - Must belong to an organization.
    | - Must NOT have a Help Request.
    | - Must remain unverified until Admin review.
    |
    */

    public function proposeOrganizationCampaign(array $data): Campaign
    {
        $this->validateOrganizationProposalData($data);

        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_ORGANIZATION_PROPOSED,
            'status' => Campaign::STATUS_UNVERIFIED,
            'help_request_id' => null,
            'proposal_date' => now()->toDateString(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Global Situation Campaign
    |--------------------------------------------------------------------------
    |
    | Rules:
    |
    | - No organization ownership.
    | - No Help Request.
    | - Must remain unverified until Admin review.
    |
    */

    public function createGlobalCampaign(array $data): Campaign
    {
        $this->validateGlobalCampaignData($data);

        return Campaign::create([
            ...$data,
            'type' => Campaign::TYPE_GLOBAL_SITUATION,
            'status' => Campaign::STATUS_UNVERIFIED,
            'organization_id' => null,
            'help_request_id' => null,
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

        /*
        |--------------------------------------------------------------------------
        | Confirm the Help Request actually exists
        |--------------------------------------------------------------------------
        */

        $helpRequest = HelpRequest::find($data['help_request_id']);

        if (!$helpRequest) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'The selected help request does not exist.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Organization-specific relationship validation
        |--------------------------------------------------------------------------
        |
        | If organization_id is present, the organization MUST actually
        | be assigned to this Help Request through HelpRequestAssignment.
        |
        | Only accepted/in_progress assignments count as an active
        | organization assignment.
        |
        | pending:
        |   Admin sent assignment but organization has not accepted yet.
        |
        | rejected:
        |   Organization rejected it.
        |
        | completed:
        |   Assignment is finished.
        |
        | withdrawn:
        |   Organization is no longer responsible.
        |
        */

        if (!empty($data['organization_id'])) {
            $hasActiveAssignment = HelpRequestAssignment::query()
                ->where('help_request_id', $data['help_request_id'])
                ->where('organization_id', $data['organization_id'])
                ->whereIn('status', [
                    HelpRequestAssignment::STATUS_ACCEPTED,
                    HelpRequestAssignment::STATUS_IN_PROGRESS,
                ])
                ->exists();

            if (!$hasActiveAssignment) {
                throw ValidationException::withMessages([
                    'help_request_id' =>
                    'The selected help request is not currently assigned to this organization.',
                ]);
            }
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

        /*
        |--------------------------------------------------------------------------
        | Organization-proposed campaigns must never have an HR connection.
        |--------------------------------------------------------------------------
        */

        if (!empty($data['help_request_id'])) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'An organization-proposed campaign cannot be linked to a help request.',
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Global Situation Campaign
    |--------------------------------------------------------------------------
    */

    private function validateGlobalCampaignData(array $data): void
    {
        if (!empty($data['organization_id'])) {
            throw ValidationException::withMessages([
                'organization_id' =>
                'A global situation campaign cannot belong to an organization.',
            ]);
        }

        if (!empty($data['help_request_id'])) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'A global situation campaign cannot be linked to a help request.',
            ]);
        }
    }
}
