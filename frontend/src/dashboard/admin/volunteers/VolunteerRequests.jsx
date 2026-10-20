import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    Check,
    X,
    Loader2,
    RefreshCw,
    Search,
    ClipboardList,
    Send,
    Inbox,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';
import DataTable from '@/components/dashboard/DataTable';
import DashboardInput from '@/components/dashboard/DashboardInput';
import StatusBadge from '@/components/dashboard/StatusBadge';

import VolunteerPagination from './components/Pagination';

import {
    fetchVolunteerRequests,
    acceptVolunteerApplication,
    rejectVolunteerApplication,
} from './api/volunteerApi';

/* =========================================================
   CONSTANTS
========================================================= */

const REQUESTS_PER_PAGE = 10;

const SORT_DEFAULT = {
    key: 'submitted',
    direction: 'desc',
};

/* =========================================================
   DATA HELPERS
========================================================= */

const normalize = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.requests)) {
        return response.requests;
    }

    if (Array.isArray(response?.data?.requests)) {
        return response.data.requests;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};

const statusOf = (request) =>
    String(request?.status ?? '')
        .trim()
        .toLowerCase();

const personOf = (request) => request?.user || {};

const nameOf = (request) =>
    personOf(request).name || request?.name || 'Unknown individual';

const emailOf = (request) => personOf(request).email || request?.email || '';

const phoneOf = (request) => personOf(request).phone || request?.phone || '';

const photoOf = (request) => personOf(request).photo || request?.photo || '';

const districtOf = (request) =>
    personOf(request).district ||
    personOf(request).profile?.district ||
    personOf(request).address?.district ||
    request?.district ||
    request?.profile?.district ||
    request?.address?.district ||
    '';

const timeOf = (request) => {
    const value =
        request?.created_at ?? request?.createdAt ?? request?.requested_at;

    const time = value ? new Date(value).getTime() : NaN;

    return Number.isFinite(time) ? time : 0;
};

const dateOf = (request) => {
    const time = timeOf(request);

    if (!time) return '—';

    return new Date(time).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

/* =========================================================
   AVATAR
========================================================= */

function Avatar({ request }) {
    const [failed, setFailed] = useState('');

    const photo = photoOf(request);
    const name = nameOf(request);

    return (
        <span
            className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                overflow-hidden
                border border-[#29323E]
                bg-[#151B24]
                text-[11px] font-semibold!
                text-[#B8C0CA]
            "
        >
            {photo && failed !== photo ? (
                <img
                    src={photo}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={() => setFailed(photo)}
                />
            ) : (
                name.trim().charAt(0).toUpperCase()
            )}
        </span>
    );
}

/* =========================================================
   REVIEW BUTTONS
========================================================= */

function ReviewActions({ request, processing, onReview, compact = false }) {
    const busy = processing?.id === request.id;
    const disabled = Boolean(processing);

    const buttonBase = `
        inline-flex h-8 items-center
        justify-center gap-1.5
        border px-2.5
        text-[11px] font-medium!
        transition-colors duration-150
        focus:outline-none focus:ring-0
        disabled:cursor-not-allowed
        disabled:opacity-40
    `;

    return (
        <div
            className={`
                flex items-center gap-2
                ${compact ? 'justify-end' : 'justify-end'}
            `}
        >
            <button
                type="button"
                disabled={disabled}
                onClick={() => onReview(request, 'reject')}
                aria-label={`Reject ${nameOf(request)}`}
                className={`
                    ${buttonBase}
                    border-[#493038]
                    bg-[#241A1E]
                    text-[#D1959B]
                    hover:border-[#69404A]
                    hover:bg-[#302025]
                    hover:text-[#F0B0B6]
                `}
            >
                {busy && processing.action === 'reject' ? (
                    <Loader2 size={13} className="animate-spin" />
                ) : (
                    <X size={13} strokeWidth={1.9} />
                )}
                Reject
            </button>

            <button
                type="button"
                disabled={disabled}
                onClick={() => onReview(request, 'accept')}
                aria-label={`Accept ${nameOf(request)}`}
                className={`
                    ${buttonBase}
                    border-[#35493E]
                    bg-[#1B2922]
                    text-[#A7C9B4]
                    hover:border-[#4B6656]
                    hover:bg-[#25372C]
                    hover:text-[#C3DECB]
                `}
            >
                {busy && processing.action === 'accept' ? (
                    <Loader2 size={13} className="animate-spin" />
                ) : (
                    <Check size={13} strokeWidth={1.9} />
                )}
                Accept
            </button>
        </div>
    );
}

/* =========================================================
   RESPONSIVE REQUEST ROW
========================================================= */

function MobileRequestRow({ row, tab, processing, onReview }) {
    return (
        <article
            className="
                min-w-0 px-3 py-3.5
                sm:px-5 sm:py-4
            "
        >
            {/* IDENTITY */}

            <div className="flex min-w-0 items-start gap-3">
                <Avatar request={row._request} />

                <div className="min-w-0 flex-1">
                    <p
                        title={row.name}
                        className="
                            truncate
                            font-sans! text-[13px]
                            font-semibold!
                            text-[#E5EAF0]!
                        "
                    >
                        {row.name}
                    </p>

                    <p
                        title={row.email}
                        className="
                            mt-0.5 truncate
                            text-[11px]
                            text-[#8792A1]
                        "
                    >
                        {row.email || 'No email address'}
                    </p>
                </div>

                <div className="shrink-0">
                    <StatusBadge status={row.status} />
                </div>
            </div>

            {/* METADATA */}

            <div
                className="
                    mt-3 grid min-w-0
                    grid-cols-2 gap-x-3 gap-y-2
                    border-t border-[#202A35]
                    pt-2.5
                    sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]
                    sm:items-center sm:gap-4
                "
            >
                <div className="min-w-0">
                    <span
                        className="
                            block text-[10px]
                            text-[#697586]
                            sm:hidden
                        "
                    >
                        Phone
                    </span>

                    <span
                        title={row.phone}
                        className="
                            block truncate text-[11px]
                            text-[#B8C0CA]
                        "
                    >
                        {row.phone || '—'}
                    </span>
                </div>

                <div className="min-w-0">
                    <span
                        className="
                            block text-[10px]
                            text-[#697586]
                            sm:hidden
                        "
                    >
                        District
                    </span>

                    <span
                        title={row.district}
                        className="
                            block truncate text-[11px]
                            text-[#B8C0CA]
                        "
                    >
                        {row.district || 'Not provided'}
                    </span>
                </div>

                <div
                    className="
                        col-span-2 flex items-center gap-1.5
                        text-[11px] tabular-nums
                        text-[#8792A1]
                        sm:col-span-1
                        sm:justify-end
                        sm:whitespace-nowrap
                    "
                >
                    <span className="text-[#697586]">
                        {tab === 'applications' ? 'Submitted:' : 'Invited:'}
                    </span>

                    <span>{row.submitted}</span>
                </div>
            </div>

            {/* ACTIONS */}

            {tab === 'applications' && row.status === 'pending' && (
                <div className="mt-3">
                    <ReviewActions
                        request={row._request}
                        processing={processing}
                        onReview={onReview}
                        compact
                    />
                </div>
            )}

            {tab === 'invitations' && (
                <p
                    className="
                        mt-2 text-right text-[11px]
                        text-[#697586]
                    "
                >
                    Awaiting response
                </p>
            )}
        </article>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function VolunteerRequests() {
    const [tab, setTab] = useState('applications');

    const [search, setSearch] = useState('');

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState('');

    const [processing, setProcessing] = useState(null);

    const [sort, setSort] = useState(SORT_DEFAULT);

    const [currentPage, setCurrentPage] = useState(1);

    const [success, setSuccess] = useState({
        open: false,
        name: '',
        action: 'updated',
        entity: 'volunteer application',
    });

    /* =====================================================
       FETCH
    ===================================================== */

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const response = await fetchVolunteerRequests();

                if (!active) return;

                setRequests(normalize(response));
                setError('');
            } catch (err) {
                if (!active) return;

                setError(err?.message || 'Unable to load volunteer requests.');
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            active = false;
        };
    }, []);

    const refresh = useCallback(async () => {
        if (refreshing || processing) return;

        setRefreshing(true);
        setError('');

        try {
            const response = await fetchVolunteerRequests();

            setRequests(normalize(response));
        } catch (err) {
            setError(err?.message || 'Unable to refresh requests.');
        } finally {
            setRefreshing(false);
        }
    }, [refreshing, processing]);

    /* =====================================================
       REQUEST GROUPS
    ===================================================== */

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

    const pendingApplications = useMemo(
        () => applications.filter((request) => statusOf(request) === 'pending'),
        [applications],
    );

    const pendingInvitations = useMemo(
        () => invitations.filter((request) => statusOf(request) === 'pending'),
        [invitations],
    );

    const selected =
        tab === 'applications' ? pendingApplications : pendingInvitations;

    /* =====================================================
       SEARCH + SORT
    ===================================================== */

    const visible = useMemo(() => {
        const query = search.trim().toLowerCase();

        const matching = selected.filter((request) => {
            if (!query) return true;

            return [
                nameOf(request),
                emailOf(request),
                phoneOf(request),
                districtOf(request),
            ].some((value) => String(value).toLowerCase().includes(query));
        });

        const sortValue = (request) => {
            switch (sort.key) {
                case 'name':
                    return nameOf(request).toLocaleLowerCase();

                case 'phone':
                    return phoneOf(request).replace(/\D/g, '');

                case 'district':
                    return districtOf(request).toLocaleLowerCase();

                case 'status':
                    return statusOf(request);

                case 'submitted':
                    return timeOf(request);

                default:
                    return '';
            }
        };

        if (!sort.key || !sort.direction) {
            return matching;
        }

        return [...matching].sort((a, b) => {
            const first = sortValue(a);
            const second = sortValue(b);

            const result =
                typeof first === 'number' && typeof second === 'number'
                    ? first - second
                    : String(first).localeCompare(String(second), undefined, {
                          numeric: true,
                          sensitivity: 'base',
                      });

            return sort.direction === 'asc' ? result : -result;
        });
    }, [selected, search, sort]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(visible.length / REQUESTS_PER_PAGE),
    );

    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    const paginatedRequests = useMemo(() => {
        const start = (safeCurrentPage - 1) * REQUESTS_PER_PAGE;

        return visible.slice(start, start + REQUESTS_PER_PAGE);
    }, [visible, safeCurrentPage]);

    /* =====================================================
       SORT HANDLERS
    ===================================================== */

    const handleSort = (key) => {
        setSort((previous) => {
            if (previous.key !== key) {
                return {
                    key,
                    direction: 'asc',
                };
            }

            if (previous.direction === 'asc') {
                return {
                    key,
                    direction: 'desc',
                };
            }

            return {
                key: null,
                direction: null,
            };
        });

        setCurrentPage(1);
    };

    const getSortIcon = (key) => {
        if (sort.key !== key) {
            return <ChevronsUpDown size={14} strokeWidth={1.8} />;
        }

        if (sort.direction === 'asc') {
            return <ArrowUp size={14} strokeWidth={2} />;
        }

        return <ArrowDown size={14} strokeWidth={2} />;
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const changeTab = (next) => {
        if (next === tab) return;

        setTab(next);
        setSearch('');
        setCurrentPage(1);
        setSort(SORT_DEFAULT);
    };

    /* =====================================================
       APPLICATION REVIEW
    ===================================================== */

    const review = async (request, action) => {
        if (processing || !request?.id || statusOf(request) !== 'pending') {
            return;
        }

        setProcessing({
            id: request.id,
            action,
        });

        setError('');

        try {
            if (action === 'accept') {
                await acceptVolunteerApplication(request.id);
            } else {
                await rejectVolunteerApplication(request.id);
            }

            const response = await fetchVolunteerRequests();

            setRequests(normalize(response));

            setSuccess({
                open: true,
                name: nameOf(request),
                action: 'updated',
                entity: 'volunteer application',
            });
        } catch (err) {
            setError(err?.message || `Unable to ${action} application.`);
        } finally {
            setProcessing(null);
        }
    };

    /* =====================================================
       TABLE ROWS
    ===================================================== */

    const rows = paginatedRequests.map((request, index) => ({
        ...request,

        _request: request,

        _key: request.id ?? `${tab}-${safeCurrentPage}-${index}`,

        serialNumber: (safeCurrentPage - 1) * REQUESTS_PER_PAGE + index + 1,

        name: nameOf(request),
        email: emailOf(request),
        phone: phoneOf(request),
        district: districtOf(request),
        submitted: dateOf(request),
        status: statusOf(request),
    }));

    /* =====================================================
       SHARED TABLE COLUMNS
    ===================================================== */

    const columns = [
        {
            key: 'serialNumber',
            header: '#',
            align: 'center',
            width: '56px',

            render: (value) => (
                <span className="text-[11px] tabular-nums text-[#697586]">
                    {String(value).padStart(2, '0')}
                </span>
            ),
        },

        {
            key: 'name',
            header: 'Volunteer',
            sortable: true,
            sortKey: 'name',
            width: 'minmax(220px, 1.5fr)',

            render: (_, row) => (
                <div className="flex min-w-0 max-w-[300px] items-center gap-3">
                    <Avatar request={row._request} />

                    <div className="min-w-0">
                        <p
                            title={row.name}
                            className="
                                truncate
                                text-[12px] font-semibold!
                                leading-5 text-[#EEF1F5]
                            "
                        >
                            {row.name}
                        </p>

                        <p
                            title={row.email}
                            className="
                                mt-0.5 truncate
                                text-[10px] leading-4
                                text-[#697586]
                            "
                        >
                            {row.email || 'No email address'}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            key: 'phone',
            header: 'Phone',
            sortable: true,
            sortKey: 'phone',
            width: 'minmax(135px, 0.8fr)',

            render: (value) => (
                <span className="whitespace-nowrap text-[11px] text-[#AEB7C3]">
                    {value || '—'}
                </span>
            ),
        },

        {
            key: 'district',
            header: 'District',
            sortable: true,
            sortKey: 'district',
            width: 'minmax(110px, 0.75fr)',

            render: (value) => (
                <span
                    title={value || ''}
                    className="block truncate text-[11px] text-[#AEB7C3]"
                >
                    {value || '—'}
                </span>
            ),
        },

        {
            key: 'submitted',
            header: tab === 'applications' ? 'Submitted' : 'Invited',

            sortable: true,
            sortKey: 'submitted',
            width: 'minmax(135px, 0.8fr)',

            render: (value) => (
                <span className="whitespace-nowrap text-[11px] tabular-nums text-[#AEB7C3]">
                    {value}
                </span>
            ),
        },

        {
            key: 'status',
            header: 'Status',
            width: 'minmax(115px, 0.7fr)',

            render: (value) => <StatusBadge status={value || 'pending'} />,
        },

        {
            key: 'actions',
            header: 'Actions',
            align: 'right',

            width: tab === 'applications' ? '184px' : '135px',

            render: (_, row) => {
                if (tab === 'invitations') {
                    return (
                        <span className="whitespace-nowrap text-[11px] text-[#8792A1]">
                            Awaiting response
                        </span>
                    );
                }

                return (
                    <ReviewActions
                        request={row._request}
                        processing={processing}
                        onReview={review}
                    />
                );
            },
        },
    ];

    /* =====================================================
       HEADER
    ===================================================== */

    const header = (
        <PageHeader
            title="Volunteer Requests"
            subtitle="Review applications to join the volunteer network and invitations awaiting a response."
        />
    );

    /* =====================================================
       REFRESH BUTTON
    ===================================================== */

    const refreshButton = (
        <button
            type="button"
            onClick={refresh}
            disabled={loading || refreshing || Boolean(processing)}
            className="
                inline-flex h-10 shrink-0
                items-center justify-center gap-2
                border border-[#303A47]
                bg-[#141B24] px-3
                text-[11px] font-medium!
                text-[#AEB9C7]
                transition-colors duration-150
                hover:border-[#465365]
                hover:bg-[#1D2732]
                hover:text-[#EEF1F5]
                disabled:cursor-not-allowed
                disabled:opacity-40
            "
        >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />

            {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
    );

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="space-y-10">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading volunteer requests..."
                    description="Retrieving applications and invitations."
                />
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error && requests.length === 0) {
        return (
            <div className="space-y-10">
                {header}

                <LoadingError
                    title="Unable to load volunteer requests"
                    message={error}
                />
            </div>
        );
    }

    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <>
            <div className="min-w-0 space-y-9 lg:space-y-11">
                {header}

                <section className="min-w-0">
                    {/* NAVIGATION + TOOLS */}

                    <div
                        className="
                            flex min-w-0 flex-col gap-4
                            border-b border-[#29323E]
                            pb-4
                            xl:flex-row
                            xl:items-end
                            xl:justify-between
                        "
                    >
                        {/* TABS */}

                        <div
                            role="tablist"
                            aria-label="Volunteer request types"
                            className="
                                flex w-full min-w-0
                                items-center gap-1
                                overflow-x-auto
                                sm:w-auto
                            "
                        >
                            {[
                                {
                                    key: 'applications',
                                    label: 'Applications',
                                    icon: ClipboardList,
                                    count: pendingApplications.length,
                                },
                                {
                                    key: 'invitations',
                                    label: 'Invitations',
                                    icon: Send,
                                    count: pendingInvitations.length,
                                },
                            ].map(({ key, label, icon: Icon, count }) => (
                                <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={tab === key}
                                    onClick={() => changeTab(key)}
                                    className={`
                                            relative inline-flex h-10
                                            shrink-0 items-center gap-2
                                            border-b-2 px-3
                                            text-[12px] font-medium!
                                            transition-colors
                                            sm:px-4
                                            ${
                                                tab === key
                                                    ? 'border-[#AAB7C6] bg-[#1B2530] text-[#E7EDF4]'
                                                    : 'border-transparent text-[#8996A6] hover:bg-[#19212B] hover:text-[#DCE3EB]'
                                            }
                                        `}
                                >
                                    <Icon size={14} strokeWidth={1.8} />

                                    {label}

                                    <span
                                        className={`
                                                min-w-5 px-1.5 py-0.5
                                                text-center text-[10px]
                                                tabular-nums
                                                ${
                                                    tab === key
                                                        ? 'bg-[#344251] text-[#E0E7EF]'
                                                        : 'bg-[#232D39] text-[#9DAABA]'
                                                }
                                            `}
                                    >
                                        {count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* SEARCH + REFRESH */}

                        <div
                            className="
                                flex w-full min-w-0
                                flex-col gap-2
                                sm:flex-row sm:items-center
                                xl:w-auto
                            "
                        >
                            <DashboardInput
                                type="search"
                                variant="default"
                                leftIcon={Search}
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);

                                    setCurrentPage(1);
                                }}
                                placeholder="Search name, email, phone or district"
                                aria-label="Search volunteer requests"
                                wrapperClassName="
                                    w-full min-w-0
                                    sm:flex-1
                                    xl:w-[340px]
                                    xl:flex-none
                                "
                                className="h-10! text-[13px]!"
                            />

                            {refreshButton}
                        </div>
                    </div>

                    {/* SECTION HEADING */}

                    <div
                        className="
                            mb-3 mt-5 flex min-w-0
                            flex-wrap items-end
                            justify-between gap-2
                        "
                    >
                        <div className="min-w-0">
                            <h2
                                className="
                                    font-sans!
                                    text-[16px] font-semibold!
                                    tracking-[-0.01em]
                                    text-[#E3E9F0]!
                                    sm:text-[17px]
                                "
                            >
                                {tab === 'applications'
                                    ? 'Incoming applications'
                                    : 'Sent invitations'}
                            </h2>

                            <p className="mt-1 text-[12px] text-[#8996A6]">
                                {tab === 'applications'
                                    ? `${pendingApplications.length} awaiting review`
                                    : `${pendingInvitations.length} awaiting response`}
                            </p>
                        </div>

                        <span className="shrink-0 text-[11px] text-[#8792A1]">
                            {visible.length}{' '}
                            {visible.length === 1 ? 'result' : 'results'}
                        </span>
                    </div>

                    {/* ERROR NOTICE */}

                    {error && (
                        <p
                            role="alert"
                            className="
                                mb-3 border border-[#59383E]
                                bg-[#271C22] px-4 py-3
                                text-[12px] text-[#E1A9B0]
                            "
                        >
                            {error}
                        </p>
                    )}

                    {/* TABLE */}

                    <div
                        className="
                            min-w-0 overflow-hidden
                            border border-[#29323E]
                            bg-[#0E1219]
                        "
                    >
                        {/* DESKTOP SHARED TABLE */}

                        <div className="hidden lg:block">
                            <DataTable
                                columns={columns}
                                rows={rows}
                                onSort={handleSort}
                                getSortIcon={getSortIcon}
                                resultCount={visible.length}
                                resizableColumns
                                empty={{
                                    icon: Inbox,
                                    title: 'No requests found',
                                    message: 'Try a different search.',
                                }}
                            />
                        </div>

                        {/* MOBILE / TABLET ROWS */}

                        <div className="lg:hidden">
                            {rows.length === 0 ? (
                                <div
                                    className="
                                        px-4 py-12 text-center
                                        text-[13px] text-[#8792A1]
                                    "
                                >
                                    No requests found.
                                </div>
                            ) : (
                                <div className="divide-y divide-[#252D38]">
                                    {rows.map((row) => (
                                        <MobileRequestRow
                                            key={row._key}
                                            row={row}
                                            tab={tab}
                                            processing={processing}
                                            onReview={review}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SHARED PAGINATION */}

                        {visible.length > 0 && (
                            <div className="border-t border-[#252D38]">
                                <VolunteerPagination
                                    currentPage={safeCurrentPage}
                                    totalPages={totalPages}
                                    totalItems={visible.length}
                                    perPage={REQUESTS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    itemLabel={
                                        tab === 'applications'
                                            ? 'applications'
                                            : 'invitations'
                                    }
                                />
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* SUCCESS DIALOG */}

            <SuccessDialog
                open={success.open}
                name={success.name}
                action={success.action}
                entity={success.entity}
                onClose={() =>
                    setSuccess((previous) => ({
                        ...previous,
                        open: false,
                    }))
                }
            />
        </>
    );
}
