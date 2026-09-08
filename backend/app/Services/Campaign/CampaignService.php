<?php

namespace App\Services\Campaign;

use App\Models\Campaign;
use App\Models\HelpRequest;
use App\Models\HelpRequestAssignment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CampaignService
{
    /**
     * Create a local case campaign.
     */
    public function createLocalCaseCampaign(array $data): Campaign
    {
        $this->validateLocalCaseData($data);

        return Campaign::create([
            'organization_id' => $data['organization_id'] ?? null,
            'help_request_id' => $data['help_request_id'],
            'type' => Campaign::TYPE_LOCAL_CASE,
            'created_by' => $data['created_by'],
            'title' => $data['title'],
            'description' => $data['description'],
            'category' => $data['category'],
            'scope' => $data['scope'] ?? null,
            'district' => $data['district'] ?? null,
            'location' => $data['location'] ?? null,
            'affected_areas' => $data['affected_areas'] ?? null,
            'target_amount' => $data['target_amount'] ?? null,
            'collected_amount' => 0,
            'status' => Campaign::STATUS_UNVERIFIED,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'cover_image' => $data['cover_image'] ?? null,
        ]);
    }

    /**
     * Create an organization-proposed campaign.
     */
    public function proposeOrganizationCampaign(array $data): Campaign
    {
        $this->validateOrganizationProposedData($data);

        return Campaign::create([
            'organization_id' => $data['organization_id'],
            'help_request_id' => null,
            'type' => Campaign::TYPE_ORGANIZATION_PROPOSED,
            'created_by' => $data['created_by'],
            'title' => $data['title'],
            'description' => $data['description'],
            'category' => $data['category'],
            'scope' => $data['scope'] ?? null,
            'district' => $data['district'] ?? null,
            'location' => $data['location'] ?? null,
            'affected_areas' => $data['affected_areas'] ?? null,
            'target_amount' => $data['target_amount'] ?? null,
            'collected_amount' => 0,
            'status' => Campaign::STATUS_UNVERIFIED,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'proposal_date' => now()->toDateString(),
            'cover_image' => $data['cover_image'] ?? null,
        ]);
    }

    /**
     * Create a global situation campaign.
     */
    public function createGlobalCampaign(array $data): Campaign
    {
        $this->validateGlobalSituationData($data);

        return Campaign::create([
            'organization_id' => null,
            'help_request_id' => null,
            'type' => Campaign::TYPE_GLOBAL_SITUATION,
            'created_by' => $data['created_by'],
            'title' => $data['title'],
            'description' => $data['description'],
            'category' => $data['category'],
            'scope' => $data['scope'] ?? null,
            'district' => $data['district'] ?? null,
            'location' => $data['location'] ?? null,
            'affected_areas' => $data['affected_areas'] ?? null,
            'target_amount' => $data['target_amount'] ?? null,
            'collected_amount' => 0,
            'status' => Campaign::STATUS_UNVERIFIED,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'cover_image' => $data['cover_image'] ?? null,
        ]);
    }

    /**
     * Approve an unverified campaign.
     */
    public function verifyCampaign(
        Campaign $campaign,
        int $adminId,
        ?string $note = null
    ): Campaign {
        if ($campaign->status !== Campaign::STATUS_UNVERIFIED) {
            throw ValidationException::withMessages([
                'status' => 'Only unverified campaigns can be approved.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_ACTIVE,
            'verified_by' => $adminId,
            'verified_at' => now(),
            'verification_note' => $note,
        ]);

        return $campaign->fresh();
    }

    /**
     * Reject an unverified campaign.
     */
    public function rejectCampaign(
        Campaign $campaign,
        int $adminId,
        ?string $note = null
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
            'verification_note' => $note,
        ]);

        return $campaign->fresh();
    }

    /**
     * Update a campaign's manually controllable status.
     *
     * Campaign completion is controlled automatically by the system.
     */
    public function updateStatus(
        Campaign $campaign,
        string $status
    ): Campaign {
        if ($status === Campaign::STATUS_COMPLETED) {
            throw ValidationException::withMessages([
                'status' =>
                'Campaign completion is controlled automatically by the system.',
            ]);
        }

        if ($campaign->status !== Campaign::STATUS_ACTIVE) {
            throw ValidationException::withMessages([
                'status' =>
                "Campaign with status '{$campaign->status}' cannot be updated.",
            ]);
        }

        if ($status !== Campaign::STATUS_CANCELLED) {
            throw ValidationException::withMessages([
                'status' =>
                'Campaign can only be cancelled while active.',
            ]);
        }

        $campaign->update([
            'status' => Campaign::STATUS_CANCELLED,
        ]);

        return $campaign->fresh();
    }

    /**
     * Automatically complete a campaign when both completion
     * conditions are satisfied:
     *
     * 1. collected amount has reached the target amount.
     * 2. all campaign volunteer assignments are completed.
     *
     * For local_case campaigns, the linked Help Request is
     * completed automatically at the same time.
     */
    public function completeCampaignIfEligible(
        Campaign $campaign
    ): Campaign {
        /*
         * refresh() updates the existing model instance and
         * always returns the Campaign instance, so the method
         * remains type-safe.
         */
        $campaign->refresh();

        if ($campaign->status !== Campaign::STATUS_ACTIVE) {
            return $campaign;
        }

        /*
         * A campaign must have a target amount before the
         * fundraising completion condition can be satisfied.
         */
        if (
            $campaign->target_amount === null ||
            (float) $campaign->collected_amount <
            (float) $campaign->target_amount
        ) {
            return $campaign;
        }

        /*
         * Every campaign volunteer assignment must be finished.
         *
         * Completed assignments are finished work.
         * Rejected assignments do not represent unfinished work.
         *
         * Any assigned, accepted, or in-progress assignment means
         * the campaign still has unfinished volunteer work.
         */
        $hasIncompleteVolunteerAssignments =
            $campaign->volunteerAssignments()
            ->whereNotIn('status', [
                'completed',
                'rejected',
            ])
            ->exists();

        if ($hasIncompleteVolunteerAssignments) {
            return $campaign;
        }

        return DB::transaction(function () use ($campaign) {
            $campaign->update([
                'status' => Campaign::STATUS_COMPLETED,
            ]);

            /*
             * Only local_case campaigns have a linked Help Request.
             *
             * The Help Request must already be in_progress before
             * the campaign can complete it.
             */
            if (
                $campaign->type === Campaign::TYPE_LOCAL_CASE &&
                $campaign->help_request_id
            ) {
                $helpRequest = HelpRequest::find(
                    $campaign->help_request_id
                );

                if (
                    $helpRequest &&
                    $helpRequest->status ===
                    HelpRequest::STATUS_IN_PROGRESS
                ) {
                    $helpRequest->update([
                        'status' => HelpRequest::STATUS_COMPLETED,
                    ]);
                }
            }

            return $campaign->fresh();
        });
    }

    /**
     * Validate local case campaign data.
     */
    protected function validateLocalCaseData(array $data): void
    {
        if (empty($data['help_request_id'])) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'A local case campaign must be linked to a help request.',
            ]);
        }

        $helpRequest = HelpRequest::find(
            $data['help_request_id']
        );

        if (!$helpRequest) {
            throw ValidationException::withMessages([
                'help_request_id' => 'Help request not found.',
            ]);
        }

        if (
            isset($data['organization_id']) &&
            $data['organization_id']
        ) {
            $assignment = HelpRequestAssignment::where(
                'help_request_id',
                $helpRequest->id
            )
                ->where(
                    'organization_id',
                    $data['organization_id']
                )
                ->where(
                    'status',
                    HelpRequestAssignment::STATUS_ACCEPTED
                )
                ->exists();

            if (!$assignment) {
                throw ValidationException::withMessages([
                    'organization_id' =>
                    'The help request is not accepted by this organization.',
                ]);
            }
        }
    }

    /**
     * Validate organization-proposed campaign data.
     */
    protected function validateOrganizationProposedData(
        array $data
    ): void {
        if (empty($data['organization_id'])) {
            throw ValidationException::withMessages([
                'organization_id' =>
                'An organization-proposed campaign must belong to an organization.',
            ]);
        }

        if (
            isset($data['help_request_id']) &&
            $data['help_request_id']
        ) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'Organization-proposed campaigns cannot be linked to a help request.',
            ]);
        }
    }

    /**
     * Validate global situation campaign data.
     */
    protected function validateGlobalSituationData(
        array $data
    ): void {
        if (
            isset($data['organization_id']) &&
            $data['organization_id']
        ) {
            throw ValidationException::withMessages([
                'organization_id' =>
                'Global situation campaigns cannot belong to an organization.',
            ]);
        }

        if (
            isset($data['help_request_id']) &&
            $data['help_request_id']
        ) {
            throw ValidationException::withMessages([
                'help_request_id' =>
                'Global situation campaigns cannot be linked to a help request.',
            ]);
        }
    }
}
