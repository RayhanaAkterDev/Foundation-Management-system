import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import {
    acceptCampaignAssignment,
    acceptVolunteerRequest,
    cancelVolunteerRequest,
    completeCampaignAssignment,
    getMyVolunteer,
    rejectCampaignAssignment,
    rejectVolunteerRequest,
    requestCampaignWithdrawal,
    requestVolunteerReactivation,
    resignVolunteer,
    sendVolunteerRequest,
    startCampaignAssignment,
} from './api/volunteerApi';
import { getCampaignLocation } from './utils/volunteerHelpers';
import VolunteerStatusPanel from './components/VolunteerStatusPanel';
import VolunteerStats from './components/VolunteerStats';
import CampaignAssignmentRequest from './components/CampaignAssignmentRequest';
import CurrentActivities from './components/CurrentActivities';
import ActivityHistory from './components/ActivityHistory';
import ResignConfirmationModal from './modals/ResignConfirmationModal';
import AssignmentReasonModal from './modals/AssignmentReasonModal';

const MyVolunteerActivities = () => {
    const [volunteer, setVolunteer] = useState(null);
    const [request, setRequest] = useState(null);
    const [assignments, setAssignments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [assignmentActionId, setAssignmentActionId] = useState(null);

    const [error, setError] = useState('');
    const [requestMessage, setRequestMessage] = useState('');

    const [resignModalOpen, setResignModalOpen] = useState(false);
    const [reasonRequest, setReasonRequest] = useState(null);

    // ===========================================================
    // LOAD DATA
    // ===========================================================

    const loadVolunteerData = useCallback(async () => {
        const response = await getMyVolunteer();

        setVolunteer(response?.volunteer ?? null);
        setRequest(response?.request ?? null);

        setAssignments(
            Array.isArray(response?.assignments) ? response.assignments : [],
        );

        return response;
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchVolunteerData = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getMyVolunteer();

                if (cancelled) return;

                setVolunteer(response?.volunteer ?? null);
                setRequest(response?.request ?? null);

                setAssignments(
                    Array.isArray(response?.assignments)
                        ? response.assignments
                        : [],
                );
            } catch (err) {
                if (cancelled) return;

                setError(
                    err?.message ||
                        'Unable to load your volunteer information.',
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchVolunteerData();

        return () => {
            cancelled = true;
        };
    }, []);

    // ===========================================================
    // VOLUNTEER REQUEST ACTIONS
    // ===========================================================

    const handleSendVolunteerRequest = async () => {
        try {
            setActionLoading('request');
            setError('');
            setRequestMessage('');

            const response = await sendVolunteerRequest();

            setRequest(response?.request ?? response ?? null);

            setRequestMessage(
                response?.message ||
                    'Your volunteer application has been submitted successfully.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to submit your volunteer application.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestReactivation = async () => {
        try {
            setActionLoading('reactivation');
            setError('');
            setRequestMessage('');

            const response = await requestVolunteerReactivation();

            setRequestMessage(
                response?.message ||
                    'Your volunteer reactivation request has been sent to the admin.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to request volunteer reactivation.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleAcceptVolunteerRequest = async () => {
        if (!request?.id) return;

        try {
            setActionLoading('request-accept');
            setError('');
            setRequestMessage('');

            const response = await acceptVolunteerRequest(request.id);

            setRequestMessage(
                response?.message ||
                    'Volunteer invitation accepted successfully.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to accept the volunteer invitation.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectVolunteerRequest = async () => {
        if (!request?.id) return;

        try {
            setActionLoading('request-reject');
            setError('');
            setRequestMessage('');

            const response = await rejectVolunteerRequest(request.id);

            setRequestMessage(
                response?.message ||
                    'Volunteer invitation declined successfully.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to decline the volunteer invitation.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelVolunteerRequest = async () => {
        if (!request?.id) return;

        try {
            setActionLoading('request-cancel');
            setError('');
            setRequestMessage('');

            const response = await cancelVolunteerRequest(request.id);

            setRequestMessage(
                response?.message ||
                    'Your volunteer request has been cancelled.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to cancel your volunteer request.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    // ===========================================================
    // RESIGN
    // ===========================================================

    const handleOpenResignModal = () => {
        setError('');
        setRequestMessage('');
        setResignModalOpen(true);
    };

    const handleCloseResignModal = () => {
        if (actionLoading === 'resign') {
            return;
        }

        setResignModalOpen(false);
    };

    const handleConfirmResign = async () => {
        try {
            setActionLoading('resign');
            setError('');
            setRequestMessage('');

            const response = await resignVolunteer();

            setRequestMessage(
                response?.message ||
                    'You have resigned as a volunteer successfully.',
            );

            setResignModalOpen(false);

            await loadVolunteerData();
        } catch (err) {
            setError(err?.message || 'Unable to resign as a volunteer.');
        } finally {
            setActionLoading(false);
        }
    };

    // ===========================================================
    // CAMPAIGN ASSIGNMENT ACTIONS
    // ===========================================================

    const handleAcceptAssignment = async (assignment) => {
        if (!assignment?.id) return;

        try {
            setAssignmentActionId(assignment.id);
            setError('');
            setRequestMessage('');

            const response = await acceptCampaignAssignment(assignment.id);

            setRequestMessage(
                response?.message ||
                    'Campaign assignment accepted successfully.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to accept the campaign assignment.',
            );
        } finally {
            setAssignmentActionId(null);
        }
    };

    const handleRejectAssignment = (assignment) => {
        if (assignment?.id) setReasonRequest({ type: 'reject', assignment });
    };

    const handleStartAssignment = async (assignment) => {
        if (!assignment?.id) return;

        try {
            setAssignmentActionId(assignment.id);
            setError('');
            setRequestMessage('');

            const response = await startCampaignAssignment(assignment.id);

            setRequestMessage(
                response?.message || 'Campaign activity has been started.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(err?.message || 'Unable to start the campaign activity.');
        } finally {
            setAssignmentActionId(null);
        }
    };

    const handleCompleteAssignment = async (assignment) => {
        if (!assignment?.id) return;

        try {
            setAssignmentActionId(assignment.id);
            setError('');
            setRequestMessage('');

            const response = await completeCampaignAssignment(assignment.id);

            setRequestMessage(
                response?.message ||
                    'Campaign activity completed successfully.',
            );

            await loadVolunteerData();
        } catch (err) {
            setError(
                err?.message || 'Unable to complete the campaign activity.',
            );
        } finally {
            setAssignmentActionId(null);
        }
    };

    const handleRequestWithdrawal = (assignment) => {
        if (assignment?.id) setReasonRequest({ type: 'withdraw', assignment });
    };

    // ===========================================================
    // DERIVED ASSIGNMENTS
    // ===========================================================

    const pendingAssignments = useMemo(
        () =>
            assignments.filter(
                (assignment) => assignment?.status === 'assigned',
            ),
        [assignments],
    );

    const activeAssignments = useMemo(
        () =>
            assignments.filter((assignment) =>
                ['accepted', 'in_progress', 'withdrawal_requested'].includes(
                    assignment?.status,
                ),
            ),
        [assignments],
    );

    const stats = useMemo(() => {
        return {
            total: assignments.length,

            pending: assignments.filter((item) => item?.status === 'assigned')
                .length,

            active: assignments.filter((item) =>
                ['accepted', 'in_progress', 'withdrawal_requested'].includes(
                    item?.status,
                ),
            ).length,

            completed: assignments.filter(
                (item) => item?.status === 'completed',
            ).length,
        };
    }, [assignments]);

    const activityRows = useMemo(
        () =>
            assignments
                .filter((assignment) =>
                    [
                        'assigned',
                        'accepted',
                        'in_progress',
                        'completed',
                        'rejected',
                        'withdrawal_requested',
                        'withdrawn',
                    ].includes(assignment?.status),
                )
                .map((assignment) => ({
                    ...assignment,
                    campaign_title:
                        assignment?.campaign?.title || 'Untitled campaign',
                    location: getCampaignLocation(assignment?.campaign),
                })),
        [assignments],
    );

    // ===========================================================
    // TABLE
    // ===========================================================

    const handleConfirmReason = async (reason) => {
        if (!reasonRequest?.assignment?.id) return;
        const { type, assignment } = reasonRequest;
        try {
            setAssignmentActionId(assignment.id);
            setError('');
            setRequestMessage('');
            const response =
                type === 'reject'
                    ? await rejectCampaignAssignment(assignment.id, reason)
                    : await requestCampaignWithdrawal(assignment.id, reason);
            setRequestMessage(
                response?.message ||
                    (type === 'reject'
                        ? 'Assignment declined.'
                        : 'Withdrawal requested.'),
            );
            setReasonRequest(null);
            await loadVolunteerData();
        } catch (err) {
            setError(err?.message || 'Unable to process your request.');
        } finally {
            setAssignmentActionId(null);
        }
    };

    return (
        <div className="min-w-0 space-y-8 pb-10 lg:space-y-10">
            <PageHeader
                title="My Volunteer Activities"
                subtitle="Manage campaign assignments and track your contributions."
            />
            {loading ? (
                <LoadingUI />
            ) : (
                <>
                    {error && <LoadingError message={error} />}
                    <VolunteerStatusPanel
                        volunteer={volunteer}
                        request={request}
                        actionLoading={actionLoading}
                        onSendRequest={handleSendVolunteerRequest}
                        onAcceptRequest={handleAcceptVolunteerRequest}
                        onRejectRequest={handleRejectVolunteerRequest}
                        onCancelRequest={handleCancelVolunteerRequest}
                        onRequestReactivation={handleRequestReactivation}
                        onResign={handleOpenResignModal}
                    />
                    {volunteer && (
                        <div className="space-y-9 lg:space-y-11">
                            <VolunteerStats stats={stats} />
                            {pendingAssignments.length > 0 && (
                                <section className="space-y-4">
                                    <div className="flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <h2 className="text-[19px] font-semibold tracking-tight text-[#EEF1F5]">
                                                Pending assignments
                                            </h2>
                                            <p className="mt-1 text-[12px] text-[#8792A1]">
                                                Review invitations to support
                                                campaigns.
                                            </p>
                                        </div>
                                        <span className="text-[12px] text-[#AAB3BF]">
                                            {pendingAssignments.length} awaiting
                                            response
                                        </span>
                                    </div>
                                    <div className="grid gap-3">
                                        {pendingAssignments.map(
                                            (assignment) => (
                                                <CampaignAssignmentRequest
                                                    key={assignment.id}
                                                    assignment={assignment}
                                                    actionLoading={
                                                        assignmentActionId
                                                    }
                                                    onAccept={
                                                        handleAcceptAssignment
                                                    }
                                                    onReject={
                                                        handleRejectAssignment
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </section>
                            )}
                            {activeAssignments.length > 0 && (
                                <CurrentActivities
                                    assignments={activeAssignments}
                                    actionLoading={assignmentActionId}
                                    onStart={handleStartAssignment}
                                    onComplete={handleCompleteAssignment}
                                    onWithdraw={handleRequestWithdrawal}
                                />
                            )}
                            {assignments.length === 0 && (
                                <section className="border border-[#252D38] bg-[#0E1219] px-5 py-10 text-center">
                                    <CalendarDays
                                        size={22}
                                        className="mx-auto text-[#788595]"
                                    />
                                    <h2 className="mt-4 text-[16px] font-semibold text-[#EEF1F5]">
                                        No campaign assignments yet
                                    </h2>
                                    <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-[#8792A1]">
                                        New assignments will appear here when an
                                        organization invites you to a campaign.
                                    </p>
                                </section>
                            )}
                            <ActivityHistory rows={activityRows} />
                        </div>
                    )}
                </>
            )}
            <SuccessDialog
                open={Boolean(requestMessage)}
                title="Action completed"
                message={requestMessage}
                onClose={() => setRequestMessage('')}
            />
            <ResignConfirmationModal
                open={resignModalOpen}
                loading={actionLoading === 'resign'}
                onCancel={handleCloseResignModal}
                onConfirm={handleConfirmResign}
            />
            <AssignmentReasonModal
                key={reasonRequest?.assignment?.id ?? 'closed'}
                request={reasonRequest}
                loading={assignmentActionId !== null}
                onClose={() => {
                    if (assignmentActionId === null) setReasonRequest(null);
                }}
                onConfirm={handleConfirmReason}
            />
        </div>
    );
};
export default MyVolunteerActivities;
