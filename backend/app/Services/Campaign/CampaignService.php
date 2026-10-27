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

        return DB::transaction(function () use ($data) {
            $campaign = Campaign::create([
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
                'target_amount' => $data['target_amount'],
                'collected_amount' => 0,
                'status' => Campaign::STATUS_UNVERIFIED,
                'start_date' => $data['start_date'] ?? null,
                'end_date' => $data['end_date'] ?? null,
                'cover_image' => $data['cover_image'] ?? null,
            ]);

            /*
             * Starting a local-case campaign does NOT change
             * the Help Request status.
             *
             * The Help Request remains "verified" while the
             * campaign is waiting for admin approval.
             *
             * After admin approves the campaign, AdminController
             * changes the Help Request:
             *
             * verified -> in_progress
             */

            return $campaign->fresh();
        });
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
            'target_amount' => $data['target_amount'],
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
            'target_amount' => $data['target_amount'],
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
    /**
     * Update a campaign's status.
     *
     * Completion is manually confirmed by an administrator.
     *
     * Rules:
     * - Before the deadline, the funding target must be reached.
     * - After the deadline, reaching the funding target is optional.
     * - In both cases, all volunteer assignments must be finished.
     */
    public function updateStatus(
        Campaign $campaign,
        string $status
    ): Campaign {
        if ($campaign->status !== Campaign::STATUS_ACTIVE) {
            throw ValidationException::withMessages([
                'status' => "Campaign with status '{$campaign->status}' cannot be updated.",
            ]);
        }

        if (!in_array($status, [
            Campaign::STATUS_COMPLETED,
            Campaign::STATUS_CANCELLED,
        ], true)) {
            throw ValidationException::withMessages([
                'status' => 'Campaign can only be completed or cancelled while active.',
            ]);
        }

        /*
     * Cancellation does not require completion checks.
     */
        if ($status === Campaign::STATUS_CANCELLED) {
            $campaign->update([
                'status' => Campaign::STATUS_CANCELLED,
            ]);

            return $campaign->fresh();
        }

        /*
     * Complete the campaign inside a transaction so its status
     * and completion requirements are checked consistently.
     */
        return DB::transaction(function () use ($campaign) {
            $campaign = Campaign::whereKey($campaign->id)
                ->lockForUpdate()
                ->firstOrFail();

            /*
         * Recheck status inside the transaction.
         */
            if ($campaign->status !== Campaign::STATUS_ACTIVE) {
                throw ValidationException::withMessages([
                    'status' => 'This campaign is no longer active and cannot be completed.',
                ]);
            }

            /*
         * The deadline includes the entire end date.
         * It has passed starting from the following day.
         */
            $deadlinePassed = $campaign->end_date !== null
                && \Illuminate\Support\Carbon::parse(
                    $campaign->end_date
                )->startOfDay()->lt(today());

            /*
         * RULE 1:
         * Before the deadline, the target must be reached.
         * After the deadline, reaching the target is not required.
         */
            if (!$deadlinePassed) {
                $targetReached = $campaign->target_amount !== null
                    && (float) $campaign->collected_amount
                    >= (float) $campaign->target_amount;

                if (!$targetReached) {
                    throw ValidationException::withMessages([
                        'status' => 'Target amount has not been achieved yet.',
                    ]);
                }
            }

            /*
         * RULE 2:
         * Check volunteer work only after the target check passes.
         * Completed and rejected assignments count as resolved.
         */
            $hasIncompleteAssignments = $campaign
                ->volunteerAssignments()
                ->whereNotIn('status', [
                    'completed',
                    'rejected',
                ])
                ->exists();

            if ($hasIncompleteAssignments) {
                throw ValidationException::withMessages([
                    'status' => 'Volunteer tasks are not completed yet. Complete or resolve all outstanding volunteer assignments before marking this campaign as completed.',
                ]);
            }

            /*
         * Both applicable rules passed.
         * The admin explicitly completes the campaign.
         */
            $campaign->update([
                'status' => Campaign::STATUS_COMPLETED,
            ]);

            /*
         * Preserve existing behavior for linked local-case
         * help requests that are currently in progress.
         */
            if (
                $campaign->type === Campaign::TYPE_LOCAL_CASE
                && $campaign->help_request_id
            ) {
                $helpRequest = HelpRequest::find(
                    $campaign->help_request_id
                );

                if (
                    $helpRequest
                    && $helpRequest->status
                    === HelpRequest::STATUS_IN_PROGRESS
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
     * Automatically complete a campaign when both completion
     * conditions are satisfied:
     *
     * 1. Collected amount has reached the target amount.
     * 2. All campaign volunteer assignments are completed/rejected.
     *
     * For local_case campaigns, the linked Help Request is
     * completed automatically at the same time.
     */
    /**
     * Complete a campaign when its volunteer work is finished.
     *
     * Completion does not depend on reaching the fundraising target.
     * At least one volunteer assignment must exist, and every assignment
     * must be completed or rejected.
     *
     * Campaigns without volunteer assignments require a separate,
     * explicit resolution workflow.
     */
    public function completeCampaignIfEligible(
        Campaign $campaign
    ): Campaign {
        return DB::transaction(function () use ($campaign) {
            $campaign = Campaign::whereKey($campaign->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($campaign->status !== Campaign::STATUS_ACTIVE) {
                return $campaign;
            }

            $assignments = $campaign->volunteerAssignments();

            // Do not automatically complete campaigns with no assignments.
            if (!$assignments->exists()) {
                return $campaign;
            }

            // Every assignment must be finished.
            $hasIncompleteAssignments = $campaign
                ->volunteerAssignments()
                ->whereNotIn('status', [
                    'completed',
                    'rejected',
                ])
                ->exists();

            if ($hasIncompleteAssignments) {
                return $campaign;
            }

            $campaign->update([
                'status' => Campaign::STATUS_COMPLETED,
            ]);

            /*
         * Complete the linked Help Request for local-case campaigns.
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
                    $helpRequest->status === HelpRequest::STATUS_IN_PROGRESS
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
