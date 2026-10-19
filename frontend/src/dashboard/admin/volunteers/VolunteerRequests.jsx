import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Check,
    X,
    Loader2,
    RefreshCw,
    Search,
    ClipboardList,
    Send,
    ArrowUpRight,
    Inbox,
    Clock3,
} from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import {
    fetchVolunteerRequests,
    acceptVolunteerApplication,
    rejectVolunteerApplication,
} from './api/volunteerApi';

const normalizeRequests = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.requests)) return response.requests;
    if (Array.isArray(response?.data?.requests)) return response.data.requests;
    if (Array.isArray(response?.data)) return response.data;
    return [];
};

const getStatus = (request) =>
    String(request?.status ?? '')
        .trim()
        .toLowerCase();

const getDate = (value) => {
    if (!value) return 'Date unavailable';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const statusClass = (status) => {
    if (status === 'pending') return 'text-[#C9A878]';
    if (status === 'accepted' || status === 'approved') return 'text-[#9BB7A4]';
    if (
        status === 'rejected' ||
        status === 'declined' ||
        status === 'cancelled'
    )
        return 'text-[#C99CA1]';
    return 'text-[#9AA7B6]';
};

export default function VolunteerRequests() {
    const [tab, setTab] = useState('applications');
    const [status, setStatus] = useState('pending');
    const [search, setSearch] = useState('');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(null);
    const [success, setSuccess] = useState({
        open: false,
        name: '',
        action: 'updated',
        entity: 'volunteer application',
    });

    useEffect(() => {
        let mounted = true;
        fetchVolunteerRequests()
            .then((response) => {
                if (mounted) setRequests(normalizeRequests(response));
            })
            .catch((err) => {
                if (mounted)
                    setError(
                        err?.message || 'Unable to load volunteer requests.',
                    );
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    const refresh = useCallback(async () => {
        if (refreshing || processing !== null) return;
        setRefreshing(true);
        setError('');
        try {
            const response = await fetchVolunteerRequests();
            setRequests(normalizeRequests(response));
        } catch (err) {
            setError(err?.message || 'Unable to refresh volunteer requests.');
        } finally {
            setRefreshing(false);
        }
    }, [refreshing, processing]);

    const applications = useMemo(
        () =>
            requests.filter(
                (request) => request?.request_direction === 'user_to_admin',
            ),
        [requests],
    );
    const invitations = useMemo(
        () =>
            requests.filter(
                (request) => request?.request_direction === 'admin_to_user',
            ),
        [requests],
    );

    const applicationPending = applications.filter(
        (item) => getStatus(item) === 'pending',
    ).length;
    const invitationPending = invitations.filter(
        (item) => getStatus(item) === 'pending',
    ).length;

    const selectedRequests =
        tab === 'applications' ? applications : invitations;
    const visible = useMemo(() => {
        const term = search.trim().toLowerCase();
        return selectedRequests.filter((request) => {
            if (status !== 'all' && getStatus(request) !== status) return false;
            if (!term) return true;
            const user = request?.user || {};
            return [
                user.name,
                user.email,
                user.phone,
                request.name,
                request.email,
                request.phone,
            ].some((value) =>
                String(value ?? '')
                    .toLowerCase()
                    .includes(term),
            );
        });
    }, [selectedRequests, status, search]);

    const changeTab = (next) => {
        setTab(next);
        setStatus('pending');
        setSearch('');
    };

    const review = async (request, action) => {
        if (
            processing !== null ||
            !request?.id ||
            getStatus(request) !== 'pending'
        )
            return;
        setProcessing({ id: request.id, action });
        setError('');
        try {
            if (action === 'accept')
                await acceptVolunteerApplication(request.id);
            else await rejectVolunteerApplication(request.id);
            const response = await fetchVolunteerRequests();
            setRequests(normalizeRequests(response));
            setSuccess({
                open: true,
                name:
                    request?.user?.name ||
                    request?.name ||
                    'Volunteer application',
                action: 'updated',
                entity: 'volunteer application',
            });
        } catch (err) {
            setError(err?.message || `Unable to ${action} this application.`);
        } finally {
            setProcessing(null);
        }
    };

    const header = (
        <PageHeader
            title="Volunteer Requests"
            subtitle="Review volunteer applications and follow up on invitations."
            action={
                <button
                    type="button"
                    onClick={refresh}
                    disabled={loading || refreshing || processing !== null}
                    className="inline-flex h-10 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-4 font-sans text-[12px] font-medium text-[#B8C2CF] transition-colors hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RefreshCw
                        size={15}
                        strokeWidth={1.8}
                        className={refreshing ? 'animate-spin' : ''}
                    />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            }
        />
    );

    if (loading) {
        return (
            <div className="space-y-10 lg:space-y-12">
                {header}
                <LoadingUI
                    variant="page"
                    title="Loading volunteer requests..."
                    description="Retrieving applications and invitations."
                />
            </div>
        );
    }

    if (error && requests.length === 0) {
        return (
            <div className="space-y-10 lg:space-y-12">
                {header}
                <LoadingError
                    title="Unable to load volunteer requests"
                    message={error}
                />
            </div>
        );
    }

    return (
        <>
            <div className="min-w-0 space-y-9 lg:space-y-11">
                {header}

                <section className="min-w-0">
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#29323E]">
                        <div
                            className="flex min-w-0 items-center gap-1 sm:gap-5"
                            role="tablist"
                            aria-label="Volunteer request types"
                        >
                            {[
                                {
                                    key: 'applications',
                                    title: 'Applications',
                                    icon: ClipboardList,
                                    count: applicationPending,
                                },
                                {
                                    key: 'invitations',
                                    title: 'Invitations',
                                    icon: Send,
                                    count: invitationPending,
                                },
                            ].map(({ key, title, icon: Icon, count }) => (
                                <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={tab === key}
                                    onClick={() => changeTab(key)}
                                    className={`group relative inline-flex min-h-14 items-center gap-2.5 px-2 py-3 font-sans text-[13px] font-medium transition-colors sm:px-1 ${
                                        tab === key
                                            ? 'text-[#E5EAF0]'
                                            : 'text-[#8390A0] hover:text-[#CCD5DF]'
                                    }`}
                                >
                                    <Icon
                                        size={16}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                    />
                                    {title}
                                    <span
                                        className={`inline-flex min-w-6 items-center justify-center px-1.5 py-0.5 text-[11px] font-medium ${
                                            tab === key
                                                ? 'bg-[#283340] text-[#D8E0EA]'
                                                : 'bg-[#202833] text-[#8D9BAB]'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                    {tab === key && (
                                        <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#A5B2C1]" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="pb-4 font-sans text-[12px] text-[#8592A2]">
                            {tab === 'applications'
                                ? `${applicationPending} awaiting review`
                                : `${invitationPending} awaiting response`}
                        </p>
                    </div>

                    <div className="flex min-w-0 flex-col gap-5 py-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="font-sans text-[20px] font-semibold tracking-[-0.02em] !text-[#E4E9F0]">
                                {tab === 'applications'
                                    ? 'Incoming applications'
                                    : 'Sent invitations'}
                            </h2>
                            <p className="mt-2 max-w-lg font-sans text-[13px] leading-[1.6] !text-[#8996A6]">
                                {tab === 'applications'
                                    ? 'Review requests from people who want to join the volunteer network.'
                                    : 'See who has been invited and whether they have responded.'}
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
                            <div className="relative min-w-0 sm:w-[245px]">
                                <Search
                                    size={15}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#748193]"
                                />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search people"
                                    aria-label="Search requests"
                                    className="h-10 w-full border border-[#303A47] bg-[#0E1219] pl-9 pr-3 font-sans text-[12px] !text-[#E3EAF2] outline-none transition-colors placeholder:!text-[#697586] hover:border-[#414C5A] focus:border-[#667587] focus:ring-0"
                                />
                            </div>
                            <select
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                aria-label="Filter request status"
                                className="h-10 min-w-[138px] border border-[#303A47] bg-[#0E1219] px-3 font-sans text-[12px] !text-[#DCE3EB] outline-none hover:border-[#414C5A] focus:border-[#667587] focus:ring-0"
                            >
                                <option value="pending">Pending</option>
                                <option value="all">All statuses</option>
                                <option value="accepted">Accepted</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="declined">Declined</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29323E] bg-[#1A222D] px-4 py-3.5 sm:px-6">
                            <div className="flex items-center gap-2.5">
                                {tab === 'applications' ? (
                                    <Inbox
                                        size={15}
                                        className="text-[#91A0B1]"
                                    />
                                ) : (
                                    <Send
                                        size={15}
                                        className="text-[#91A0B1]"
                                    />
                                )}
                                <span className="font-sans text-[12px] font-semibold !text-[#D2DAE4]">
                                    {tab === 'applications'
                                        ? 'Application records'
                                        : 'Invitation records'}
                                </span>
                            </div>
                            <span className="font-sans text-[11px] !text-[#A0ADBC]">
                                {visible.length}{' '}
                                {visible.length === 1 ? 'result' : 'results'}
                            </span>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="border-b border-[#59383E] bg-[#271C22] px-5 py-3 font-sans text-[12px] !text-[#E1A9B0]"
                            >
                                {error}
                            </div>
                        )}

                        {visible.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-9 text-center">
                                <div className="flex h-11 w-11 items-center justify-center bg-[#1A222D] text-[#8D9BAC]">
                                    <Inbox size={20} strokeWidth={1.6} />
                                </div>
                                <h3 className="mt-4 font-sans text-[14px] font-semibold !text-[#D9E0E8]">
                                    {search || status !== 'pending'
                                        ? 'No matching requests'
                                        : `No pending ${tab}`}
                                </h3>
                                <p className="mt-2 max-w-sm font-sans text-[12px] leading-[1.6] !text-[#8792A1]">
                                    {search || status !== 'pending'
                                        ? 'Try a different search or status filter.'
                                        : tab === 'applications'
                                          ? 'New applications will appear here when someone applies.'
                                          : 'Invitations awaiting a response will appear here.'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#252D38]">
                                {visible.map((request, index) => {
                                    const user = request.user || {};
                                    const name =
                                        user.name ||
                                        request.name ||
                                        'Unknown individual';
                                    const email =
                                        user.email ||
                                        request.email ||
                                        'Email unavailable';
                                    const phone = user.phone || request.phone;
                                    const currentStatus = getStatus(request);
                                    const pending = currentStatus === 'pending';
                                    const busy = processing?.id === request.id;
                                    return (
                                        <article
                                            key={
                                                request.id ?? `${tab}-${index}`
                                            }
                                            className="flex min-w-0 flex-col gap-4 px-4 py-4 transition-colors hover:bg-[#141B24] sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between"
                                        >
                                            <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#35404D] bg-[#1A222D] font-sans text-[15px] font-semibold !text-[#DCE3EB]">
                                                    {name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <h3 className="break-words font-sans text-[14px] font-semibold !text-[#E2E8F0]">
                                                            {name}
                                                        </h3>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-medium capitalize ${statusClass(currentStatus)}`}
                                                        >
                                                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                            {currentStatus ||
                                                                'Unknown'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 break-all font-sans text-[12px] !text-[#AAB5C3]">
                                                        {email}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[11px] !text-[#8290A1]">
                                                        {phone && (
                                                            <span>{phone}</span>
                                                        )}
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Clock3
                                                                size={12}
                                                                strokeWidth={
                                                                    1.6
                                                                }
                                                            />
                                                            {tab ===
                                                            'applications'
                                                                ? 'Applied'
                                                                : 'Invited'}{' '}
                                                            {getDate(
                                                                request.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {tab === 'applications' &&
                                            pending ? (
                                                <div className="flex shrink-0 items-center gap-2 self-end lg:self-auto">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            processing !== null
                                                        }
                                                        onClick={() =>
                                                            review(
                                                                request,
                                                                'reject',
                                                            )
                                                        }
                                                        className="inline-flex h-9 items-center justify-center gap-2 border border-[#39404B] bg-[#171D26] px-3.5 font-sans text-[12px] font-medium !text-[#B8C1CD] transition-colors hover:border-[#68434A] hover:bg-[#302127] hover:!text-[#E5B1B4] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        {busy &&
                                                        processing.action ===
                                                            'reject' ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <X size={14} />
                                                        )}
                                                        Reject
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            processing !== null
                                                        }
                                                        onClick={() =>
                                                            review(
                                                                request,
                                                                'accept',
                                                            )
                                                        }
                                                        className="inline-flex h-9 items-center justify-center gap-2 border border-[#394C45] bg-[#203229] px-3.5 font-sans text-[12px] font-medium !text-[#B5D1BF] transition-colors hover:border-[#547360] hover:bg-[#2A4033] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        {busy &&
                                                        processing.action ===
                                                            'accept' ? (
                                                            <Loader2
                                                                size={14}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Check size={14} />
                                                        )}
                                                        Accept
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="self-end font-sans text-[12px] !text-[#8B98A8] lg:self-auto">
                                                    {tab === 'invitations' &&
                                                    pending
                                                        ? 'Awaiting response'
                                                        : 'No action required'}
                                                </span>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex min-h-11 items-center justify-between border-t border-[#29323E] bg-[#1A222D] px-4 py-3 sm:px-6">
                            <span className="font-sans text-[11px] !text-[#8B98A8]">
                                Showing {visible.length} of{' '}
                                {selectedRequests.length} {tab}
                            </span>
                            <ArrowUpRight
                                size={14}
                                strokeWidth={1.6}
                                className="text-[#657285]"
                            />
                        </div>
                    </div>
                </section>
            </div>
            <SuccessDialog
                open={success.open}
                name={success.name}
                action={success.action}
                entity={success.entity}
                onClose={() =>
                    setSuccess((current) => ({ ...current, open: false }))
                }
            />
        </>
    );
}
