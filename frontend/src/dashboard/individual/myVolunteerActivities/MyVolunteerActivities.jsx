import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    AlertCircle,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    Mail,
    Send,
    ShieldCheck,
    UserCheck,
    UserPlus,
    Users,
    XCircle,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';

import {
    acceptCampaignAssignment,
    acceptVolunteerRequest,
    completeCampaignAssignment,
    getMyVolunteer,
    rejectCampaignAssignment,
    rejectVolunteerRequest,
    sendVolunteerRequest,
    startCampaignAssignment,
} from './api/volunteerApi';

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

const getCampaignLocation = (campaign) => {
    if (!campaign) return '—';

    return campaign.location || campaign.district || campaign.address || '—';
};

const getAssignmentStatusLabel = (status) => {
    const labels = {
        assigned: 'Assignment Pending',
        accepted: 'Accepted',
        in_progress: 'In Progress',
        completed: 'Completed',
        rejected: 'Declined',
        withdrawal_requested: 'Withdrawal Requested',
        withdrawn: 'Withdrawn',
    };

    return labels[status] || status || 'Unknown';
};

/*
|--------------------------------------------------------------------------
| Campaign Assignment Request
|--------------------------------------------------------------------------
*/

const CampaignAssignmentRequest = ({
    assignment,
    loading,
    onAccept,
    onReject,
    onStart,
    onComplete,
}) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const campaign = assignment?.campaign;

    const title =
        campaign?.title || assignment?.campaign_title || 'Untitled campaign';

    const category = campaign?.category || assignment?.category || null;

    const location = getCampaignLocation(campaign);

    const startDate =
        campaign?.start_date ||
        campaign?.date ||
        assignment?.start_date ||
        null;

    const isAssigned = assignment?.status === 'assigned';
    const isAccepted = assignment?.status === 'accepted';
    const isInProgress = assignment?.status === 'in_progress';

    const handleRejectClick = () => {
        setIsRejecting(true);
    };

    const handleCancelReject = () => {
        if (loading) return;

        setIsRejecting(false);
        setRejectionReason('');
    };

    const handleConfirmReject = async () => {
        const reason = rejectionReason.trim();

        if (reason.length < 5) {
            return;
        }

        await onReject(assignment.id, reason);
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-primary/20 bg-white">
            <div className="border-b border-primary/10 bg-primary/[0.035] px-6 py-5 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            {isAssigned ? (
                                <UserPlus className="h-5 w-5 text-primary" />
                            ) : isAccepted ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <Clock3 className="h-5 w-5 text-amber-600" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                                    Campaign Assignment
                                </p>

                                <StatusBadge
                                    status={assignment?.status}
                                    label={getAssignmentStatusLabel(
                                        assignment?.status,
                                    )}
                                />
                            </div>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                {isAssigned
                                    ? 'You have a new campaign assignment'
                                    : isAccepted
                                      ? 'You accepted this campaign assignment'
                                      : 'Campaign activity in progress'}
                            </h2>

                            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                                {isAssigned
                                    ? 'The administration has assigned you to this campaign. Review the details and accept or decline the assignment.'
                                    : isAccepted
                                      ? 'This campaign is waiting for you to start the assigned activity.'
                                      : 'You are currently participating in this campaign.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 sm:px-7">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900">
                            {title}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                            {category && (
                                <span className="inline-flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                                    {category}
                                </span>
                            )}

                            {startDate && (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-slate-400" />
                                    {formatDate(startDate)}
                                </span>
                            )}

                            <span className="inline-flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {location}
                            </span>
                        </div>

                        {assignment?.assignment_note && (
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                    Assignment Note
                                </p>

                                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                    {assignment.assignment_note}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                        {isAssigned && !isRejecting && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleRejectClick}
                                    disabled={loading}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Decline
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onAccept(assignment.id)}
                                    disabled={loading}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {loading
                                        ? 'Processing...'
                                        : 'Accept Assignment'}
                                </button>
                            </>
                        )}

                        {isAssigned && isRejecting && (
                            <div className="w-full min-w-72 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:w-80 lg:w-80">
                                <p className="text-sm font-semibold text-slate-900">
                                    Decline assignment
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Please provide a short reason for declining
                                    this assignment.
                                </p>

                                <textarea
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(event.target.value)
                                    }
                                    disabled={loading}
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Enter your reason..."
                                    className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                                />

                                {rejectionReason.trim().length > 0 &&
                                    rejectionReason.trim().length < 5 && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            Please provide at least 5
                                            characters.
                                        </p>
                                    )}

                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelReject}
                                        disabled={loading}
                                        className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleConfirmReject}
                                        disabled={
                                            loading ||
                                            rejectionReason.trim().length < 5
                                        }
                                        className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 text-xs font-medium text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <XCircle className="h-3.5 w-3.5" />
                                        {loading
                                            ? 'Declining...'
                                            : 'Confirm Decline'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isAccepted && (
                            <button
                                type="button"
                                onClick={() => onStart(assignment.id)}
                                disabled={loading}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <ArrowRight className="h-4 w-4" />
                                {loading ? 'Starting...' : 'Start Activity'}
                            </button>
                        )}

                        {isInProgress && (
                            <button
                                type="button"
                                onClick={() => onComplete(assignment.id)}
                                disabled={loading}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                {loading
                                    ? 'Completing...'
                                    : 'Complete Activity'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

/*
|--------------------------------------------------------------------------
| Volunteer Status Panel
|--------------------------------------------------------------------------
*/

const VolunteerStatusPanel = ({
    state,
    request,
    loading,
    onSendRequest,
    onAccept,
    onReject,
}) => {
    if (state === 'volunteer') {
        return (
            <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white">
                <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                            <UserCheck className="h-6 w-6 text-emerald-600" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                                Volunteer Profile
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                You are an active volunteer
                            </h2>

                            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                                Your volunteer profile is active. You can now
                                participate in campaigns and humanitarian
                                activities.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center">
                        <StatusBadge status="active" />
                    </div>
                </div>
            </section>
        );
    }

    if (state === 'pending') {
        const isInvitation =
            request && Number(request.requested_by) !== Number(request.user_id);

        return (
            <section
                className={`overflow-hidden rounded-2xl border bg-white ${
                    isInvitation ? 'border-primary/20' : 'border-amber-200'
                }`}
            >
                <div
                    className={`border-b px-6 py-5 sm:px-7 ${
                        isInvitation
                            ? 'border-primary/10 bg-primary/[0.035]'
                            : 'border-amber-100 bg-amber-50/50'
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                isInvitation ? 'bg-primary/10' : 'bg-amber-100'
                            }`}
                        >
                            {isInvitation ? (
                                <UserPlus className="h-5 w-5 text-primary" />
                            ) : (
                                <Clock3 className="h-5 w-5 text-amber-600" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <p
                                    className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                                        isInvitation
                                            ? 'text-primary'
                                            : 'text-amber-600'
                                    }`}
                                >
                                    {isInvitation
                                        ? 'Volunteer Invitation'
                                        : 'Volunteer Request'}
                                </p>

                                <StatusBadge status="pending" />
                            </div>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                {isInvitation
                                    ? 'You have been invited to volunteer'
                                    : 'Volunteer request pending'}
                            </h2>

                            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                                {isInvitation
                                    ? 'The Stand For People administration has invited you to join its volunteer network.'
                                    : 'Your request has been sent to the administration and is waiting for review.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 sm:px-7">
                    {isInvitation ? (
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    Become part of the volunteer network
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                    Accept the invitation to create your
                                    volunteer profile and become eligible for
                                    campaign opportunities.
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={onReject}
                                    disabled={loading}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    {loading ? 'Processing...' : 'Decline'}
                                </button>

                                <button
                                    type="button"
                                    onClick={onAccept}
                                    disabled={loading}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {loading
                                        ? 'Processing...'
                                        : 'Accept Invitation'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 text-sm text-slate-500">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0" />

                            <span>
                                You will see the administration&apos;s response
                                here when your request is reviewed.
                            </span>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    if (state === 'rejected') {
        return (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                            <XCircle className="h-6 w-6 text-slate-500" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                Volunteer Request
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                Your previous request was declined
                            </h2>

                            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                                You can submit a new request if you would like
                                to join the volunteer network.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onSendRequest}
                        disabled={loading}
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                        {loading ? 'Sending...' : 'Send New Request'}
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid lg:grid-cols-[1fr_auto]">
                <div className="p-6 sm:p-7 lg:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                                Volunteer Network
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                Make a difference through volunteering
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Send a request to the administration to become a
                                volunteer. Once approved, you can participate in
                                humanitarian campaigns and activities.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Admin reviewed
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    Campaign opportunities
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center border-t border-slate-100 bg-slate-50/70 p-6 lg:w-64 lg:border-l lg:border-t-0">
                    <button
                        type="button"
                        onClick={onSendRequest}
                        disabled={loading}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                        {loading ? 'Sending...' : 'Send Volunteer Request'}
                    </button>
                </div>
            </div>
        </section>
    );
};

/*
|--------------------------------------------------------------------------
| Assignment table
|--------------------------------------------------------------------------
*/

const assignmentColumns = [
    {
        key: 'campaign',
        header: 'Campaign',
        render: (campaign) => (
            <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                    {campaign?.title || 'Untitled campaign'}
                </p>

                {campaign?.category && (
                    <p className="mt-0.5 text-xs text-slate-500">
                        {campaign.category}
                    </p>
                )}
            </div>
        ),
    },

    {
        key: 'date',
        header: 'Date',
        render: (value) => (
            <div className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                {formatDate(value)}
            </div>
        ),
    },

    {
        key: 'location',
        header: 'Location',
        render: (value) => (
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />

                <span className="max-w-45 truncate">{value}</span>
            </div>
        ),
    },

    {
        key: 'status',
        header: 'Status',
        render: (value) => (
            <StatusBadge
                status={value}
                label={getAssignmentStatusLabel(value)}
            />
        ),
    },
];

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

const MyVolunteerActivities = () => {
    const [volunteer, setVolunteer] = useState(null);
    const [request, setRequest] = useState(null);
    const [assignments, setAssignments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [assignmentActionId, setAssignmentActionId] = useState(null);

    const [error, setError] = useState('');
    const [requestMessage, setRequestMessage] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Load volunteer information
    |--------------------------------------------------------------------------
    */

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

                const response = await getMyVolunteer();

                if (cancelled) return;

                setVolunteer(response?.volunteer ?? null);
                setRequest(response?.request ?? null);
                setAssignments(
                    Array.isArray(response?.assignments)
                        ? response.assignments
                        : [],
                );

                setError('');
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

    /*
    |--------------------------------------------------------------------------
    | Determine current volunteer state
    |--------------------------------------------------------------------------
    */

    const volunteerState = useMemo(() => {
        if (volunteer) {
            return 'volunteer';
        }

        if (request?.status === 'pending') {
            return 'pending';
        }

        if (request?.status === 'rejected') {
            return 'rejected';
        }

        return 'none';
    }, [volunteer, request]);

    /*
    |--------------------------------------------------------------------------
    | Send individual volunteer request
    |--------------------------------------------------------------------------
    */

    const handleSendRequest = async () => {
        if (volunteer) {
            setError('');
            setRequestMessage('You are already a registered SP volunteer.');
            return;
        }

        if (request?.status === 'pending') {
            setError('');
            setRequestMessage('You already have a pending volunteer request.');
            return;
        }

        try {
            setActionLoading(true);
            setError('');
            setRequestMessage('');

            const response = await sendVolunteerRequest();

            setRequest(response?.request ?? null);

            setRequestMessage(
                response?.message ||
                    'Your volunteer request has been submitted successfully.',
            );
        } catch (err) {
            setError(
                err?.message || 'Unable to submit your volunteer request.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Accept admin volunteer invitation
    |--------------------------------------------------------------------------
    */

    const handleAcceptInvitation = async () => {
        if (!request?.id) {
            setError('Volunteer invitation could not be identified.');
            return;
        }

        try {
            setActionLoading(true);
            setError('');
            setRequestMessage('');

            const response = await acceptVolunteerRequest(request.id);

            setVolunteer(response?.volunteer ?? null);

            setRequest(
                response?.request ?? {
                    ...request,
                    status: 'accepted',
                },
            );

            setAssignments(
                Array.isArray(response?.assignments)
                    ? response.assignments
                    : [],
            );

            setRequestMessage(
                response?.message ||
                    'Invitation accepted. Your volunteer profile is now active.',
            );
        } catch (err) {
            setError(
                err?.message || 'Unable to accept the volunteer invitation.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Reject admin volunteer invitation
    |--------------------------------------------------------------------------
    */

    const handleRejectInvitation = async () => {
        if (!request?.id) {
            setError('Volunteer invitation could not be identified.');
            return;
        }

        try {
            setActionLoading(true);
            setError('');
            setRequestMessage('');

            const response = await rejectVolunteerRequest(request.id);

            setRequest(
                response?.request ?? {
                    ...request,
                    status: 'rejected',
                },
            );

            setVolunteer(null);

            setRequestMessage(
                response?.message ||
                    'The volunteer invitation has been declined.',
            );
        } catch (err) {
            setError(
                err?.message || 'Unable to decline the volunteer invitation.',
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Refresh after campaign assignment action
    |--------------------------------------------------------------------------
    */

    const refreshAfterAssignmentAction = async (message) => {
        try {
            setError('');
            setRequestMessage('');

            await loadVolunteerData();

            setRequestMessage(message);
        } catch (err) {
            setError(
                err?.message ||
                    'The action succeeded, but your volunteer data could not be refreshed.',
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Accept campaign assignment
    |--------------------------------------------------------------------------
    */

    const handleAcceptCampaignAssignment = async (id) => {
        if (!id) {
            setError('Campaign assignment could not be identified.');
            return;
        }

        try {
            setAssignmentActionId(id);
            setError('');
            setRequestMessage('');

            const response = await acceptCampaignAssignment(id);

            await refreshAfterAssignmentAction(
                response?.message ||
                    'Campaign assignment accepted successfully.',
            );
        } catch (err) {
            setError(
                err?.message || 'Unable to accept the campaign assignment.',
            );
        } finally {
            setAssignmentActionId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Reject campaign assignment
    |--------------------------------------------------------------------------
    */

    const handleRejectCampaignAssignment = async (id, rejectionReason) => {
        if (!id) {
            setError('Campaign assignment could not be identified.');
            return;
        }

        const reason = rejectionReason?.trim();

        if (!reason || reason.length < 5) {
            setError(
                'Please provide a valid reason for declining the assignment.',
            );
            return;
        }

        try {
            setAssignmentActionId(id);
            setError('');
            setRequestMessage('');

            const response = await rejectCampaignAssignment(id, reason);

            await refreshAfterAssignmentAction(
                response?.message || 'Campaign assignment declined.',
            );
        } catch (err) {
            setError(
                err?.message || 'Unable to decline the campaign assignment.',
            );
        } finally {
            setAssignmentActionId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Start campaign assignment
    |--------------------------------------------------------------------------
    */

    const handleStartCampaignAssignment = async (id) => {
        if (!id) {
            setError('Campaign assignment could not be identified.');
            return;
        }

        try {
            setAssignmentActionId(id);
            setError('');
            setRequestMessage('');

            const response = await startCampaignAssignment(id);

            await refreshAfterAssignmentAction(
                response?.message || 'Campaign activity started successfully.',
            );
        } catch (err) {
            setError(err?.message || 'Unable to start the campaign activity.');
        } finally {
            setAssignmentActionId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Complete campaign assignment
    |--------------------------------------------------------------------------
    */

    const handleCompleteCampaignAssignment = async (id) => {
        if (!id) {
            setError('Campaign assignment could not be identified.');
            return;
        }

        try {
            setAssignmentActionId(id);
            setError('');
            setRequestMessage('');

            const response = await completeCampaignAssignment(id);

            await refreshAfterAssignmentAction(
                response?.message ||
                    'Campaign activity completed successfully.',
            );
        } catch (err) {
            setError(
                err?.message || 'Unable to complete the campaign activity.',
            );
        } finally {
            setAssignmentActionId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Pending campaign assignments
    |--------------------------------------------------------------------------
    */

    const pendingAssignments = useMemo(
        () =>
            assignments.filter(
                (assignment) => assignment?.status === 'assigned',
            ),
        [assignments],
    );

    /*
    |--------------------------------------------------------------------------
    | Active campaign assignments
    |--------------------------------------------------------------------------
    */

    const activeAssignments = useMemo(
        () =>
            assignments.filter((assignment) =>
                ['accepted', 'in_progress'].includes(assignment?.status),
            ),
        [assignments],
    );

    /*
    |--------------------------------------------------------------------------
    | Assignment statistics
    |--------------------------------------------------------------------------
    */

    const stats = useMemo(() => {
        const completedAssignments = assignments.filter(
            (assignment) => assignment?.status === 'completed',
        );

        const totalHours = completedAssignments.reduce((total, assignment) => {
            const hours =
                Number(
                    assignment?.hours ??
                        assignment?.volunteer_hours ??
                        assignment?.duration_hours ??
                        0,
                ) || 0;

            return total + hours;
        }, 0);

        const nextAssignment = assignments
            .filter((assignment) =>
                ['assigned', 'accepted', 'in_progress'].includes(
                    assignment?.status,
                ),
            )
            .sort((a, b) => {
                const first = new Date(
                    a?.campaign?.start_date ||
                        a?.campaign?.date ||
                        a?.created_at ||
                        0,
                ).getTime();

                const second = new Date(
                    b?.campaign?.start_date ||
                        b?.campaign?.date ||
                        b?.created_at ||
                        0,
                ).getTime();

                return first - second;
            })[0];

        return [
            {
                label: 'Total Hours',
                value: totalHours,
                icon: Clock3,
                subtext: 'hours volunteered',
            },
            {
                label: 'Activities',
                value: completedAssignments.length,
                icon: CheckCircle2,
                iconColor: 'bg-blue-50',
                subtext: 'completed',
            },
            {
                label: 'Next Activity',
                value: nextAssignment
                    ? formatDate(
                          nextAssignment?.campaign?.start_date ||
                              nextAssignment?.campaign?.date ||
                              nextAssignment?.created_at,
                      )
                    : '—',
                icon: CalendarDays,
                iconColor: 'bg-amber-50',
                subtext: nextAssignment
                    ? nextAssignment?.campaign?.title || 'upcoming campaign'
                    : 'no upcoming activity',
            },
        ];
    }, [assignments]);

    /*
    |--------------------------------------------------------------------------
    | Normalize assignments for DataTable
    |--------------------------------------------------------------------------
    */

    const activityRows = useMemo(
        () =>
            assignments.map((assignment) => {
                const campaign = assignment?.campaign;

                return {
                    id: assignment?.id,
                    campaign,
                    date:
                        campaign?.start_date ||
                        campaign?.date ||
                        assignment?.created_at,
                    location: getCampaignLocation(campaign),
                    status: assignment?.status,
                };
            }),
        [assignments],
    );

    /*
    |--------------------------------------------------------------------------
    | Loading state
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Volunteer"
                    subtitle="Manage your volunteer participation, requests, and activities."
                />

                <section className="rounded-2xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                        Loading volunteer information...
                    </div>
                </section>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">
            <PageHeader
                title="Volunteer"
                subtitle="Manage your volunteer participation, requests, and activities."
            />

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {requestMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{requestMessage}</p>
                </div>
            )}

            <VolunteerStatusPanel
                state={volunteerState}
                request={request}
                loading={actionLoading}
                onSendRequest={handleSendRequest}
                onAccept={handleAcceptInvitation}
                onReject={handleRejectInvitation}
            />

            {volunteer && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            iconColor={stat.iconColor}
                            subtext={stat.subtext}
                        />
                    ))}
                </div>
            )}

            {/*
            |--------------------------------------------------------------------------
            | Pending campaign assignments
            |--------------------------------------------------------------------------
            |
            | IMPORTANT:
            | These are intentionally NOT wrapped in:
            | volunteerState === 'volunteer'
            |
            | If the /volunteer endpoint returns an assignment, it should
            | be displayed regardless of how the volunteer profile state
            | was derived on the frontend.
            |
            */}

            {pendingAssignments.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                                Requires Your Response
                            </p>

                            <h2 className="mt-1 text-xl font-semibold text-slate-900">
                                Campaign Assignments
                            </h2>
                        </div>

                        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {pendingAssignments.length} pending
                        </span>
                    </div>

                    <div className="space-y-4">
                        {pendingAssignments.map((assignment) => (
                            <CampaignAssignmentRequest
                                key={assignment.id}
                                assignment={assignment}
                                loading={assignmentActionId === assignment.id}
                                onAccept={handleAcceptCampaignAssignment}
                                onReject={handleRejectCampaignAssignment}
                                onStart={handleStartCampaignAssignment}
                                onComplete={handleCompleteCampaignAssignment}
                            />
                        ))}
                    </div>
                </div>
            )}

            {activeAssignments.length > 0 && (
                <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                            Your Current Activity
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                            Active Campaigns
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {activeAssignments.map((assignment) => (
                            <CampaignAssignmentRequest
                                key={assignment.id}
                                assignment={assignment}
                                loading={assignmentActionId === assignment.id}
                                onAccept={handleAcceptCampaignAssignment}
                                onReject={handleRejectCampaignAssignment}
                                onStart={handleStartCampaignAssignment}
                                onComplete={handleCompleteCampaignAssignment}
                            />
                        ))}
                    </div>
                </div>
            )}

            <DataTable
                title="Campaign Activity"
                columns={assignmentColumns}
                rows={activityRows}
                empty={{
                    icon: Users,
                    title: 'No volunteer data found',
                    message:
                        'Your volunteer campaign activity will appear here once you are assigned to a campaign.',
                }}
            />
        </div>
    );
};

export default MyVolunteerActivities;
