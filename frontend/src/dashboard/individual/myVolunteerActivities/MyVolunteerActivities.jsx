import React, { useEffect, useMemo, useState } from 'react';

import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Mail,
    MapPin,
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
    acceptVolunteerRequest,
    getMyVolunteer,
    rejectVolunteerRequest,
    sendVolunteerRequest,
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
        assigned: 'Assigned',
        accepted: 'Accepted',
        in_progress: 'In Progress',
        completed: 'Completed',
        rejected: 'Rejected',
        withdrawal_requested: 'Withdrawal Requested',
        withdrawn: 'Withdrawn',
    };

    return labels[status] || status || 'Unknown';
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

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                        <StatusBadge
                            status={state === 'volunteer' ? 'active' : 'active'}
                        />

                        <button
                            type="button"
                            onClick={onSendRequest}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 text-sm font-medium text-primary transition-colors hover:border-primary/30 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                            Send Volunteer Request
                        </button>
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
                            ? 'border-primary/10 bg-primary/4'
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

    const [error, setError] = useState('');
    const [requestMessage, setRequestMessage] = useState('');

    /*
    |--------------------------------------------------------------------------
    | Load volunteer information
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        const fetchVolunteerData = async () => {
            try {
                const response = await getMyVolunteer();

                if (cancelled) return;

                setVolunteer(response?.volunteer ?? null);
                setRequest(response?.request ?? null);
                setAssignments(response?.assignments ?? []);
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
        /*
        |--------------------------------------------------------------------------
        | Already a registered volunteer
        |--------------------------------------------------------------------------
        |
        | The backend also protects this case, but handling it here prevents
        | an unnecessary POST request and gives the user the exact message.
        |
        */

        if (volunteer) {
            setError('');
            setRequestMessage('You are already a registered SP volunteer.');
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Existing pending request
        |--------------------------------------------------------------------------
        |
        | Prevent duplicate requests from the UI.
        |
        */

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
    | Accept admin invitation
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

            /*
            |--------------------------------------------------------------------------
            | Backend creates the Volunteer record and returns it.
            |--------------------------------------------------------------------------
            */

            setVolunteer(response?.volunteer ?? null);

            setRequest(
                response?.request ?? {
                    ...request,
                    status: 'accepted',
                },
            );

            setAssignments(response?.assignments ?? []);

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
    | Reject admin invitation
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
    | Assignment statistics
    |--------------------------------------------------------------------------
    */

    const stats = useMemo(() => {
        const completedAssignments = assignments.filter(
            (assignment) => assignment.status === 'completed',
        );

        const totalHours = completedAssignments.reduce((total, assignment) => {
            const hours =
                Number(
                    assignment.hours ??
                        assignment.volunteer_hours ??
                        assignment.duration_hours ??
                        0,
                ) || 0;

            return total + hours;
        }, 0);

        const nextAssignment = assignments
            .filter((assignment) =>
                ['assigned', 'accepted', 'in_progress'].includes(
                    assignment.status,
                ),
            )
            .sort((a, b) => {
                const first = new Date(
                    a.campaign?.start_date ||
                        a.campaign?.date ||
                        a.created_at ||
                        0,
                ).getTime();

                const second = new Date(
                    b.campaign?.start_date ||
                        b.campaign?.date ||
                        b.created_at ||
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
                          nextAssignment.campaign?.start_date ||
                              nextAssignment.campaign?.date ||
                              nextAssignment.created_at,
                      )
                    : '—',
                icon: CalendarDays,
                iconColor: 'bg-amber-50',
                subtext: nextAssignment
                    ? nextAssignment.campaign?.title || 'upcoming campaign'
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
                const campaign = assignment.campaign;

                return {
                    id: assignment.id,
                    campaign,
                    date:
                        campaign?.start_date ||
                        campaign?.date ||
                        assignment.created_at,
                    location: getCampaignLocation(campaign),
                    status: assignment.status,
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

            {volunteerState === 'volunteer' && (
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
