import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Pencil,
    CalendarDays,
    MapPin,
    FileText,
    ClipboardList,
    Building2,
    Clock3,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';

import { getMyHelpRequests } from './api/helpRequestAPI';
import {
    normalizeHelpRequests,
    getAssignmentInfo,
    getStatusLabel,
    getUrgencyLabel,
} from './utils/helpRequestUtils';

const BASE = '/individual/dashboard/help-requests';

const COLORS = {
    surface: '#1A212B',
    border: '#303A47',
    text: '#EEF1F5',
    muted: '#A0ADBD',
};

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const STATUS_TONES = {
    pending: 'border-[#51412A] bg-[#292116] text-[#D9B77D]',
    verified: 'border-[#305043] bg-[#182B24] text-[#9BD1B2]',
    completed: 'border-[#305043] bg-[#182B24] text-[#9BD1B2]',
    rejected: 'border-[#57343D] bg-[#2C1D23] text-[#D9A0A8]',
    in_progress: 'border-[#45415C] bg-[#252339] text-[#C4BCE7]',
};

const DEFAULT_STATUS_TONE = 'border-[#394656] bg-[#263343] text-[#C8D2DF]';

function Info({ label, value }) {
    const displayValue =
        value === null || value === undefined || value === '' ? '—' : value;

    return (
        <div className="min-w-0 border-b border-[#303A47] py-3.5 last:border-b-0">
            <dt className="mb-1.5 text-[12px] font-medium! text-[#A0ADBD]">
                {label}
            </dt>

            <dd className="min-w-0 break-words text-[13px] font-medium! leading-6 text-[#EEF1F5]!">
                {displayValue}
            </dd>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 border-b border-[#303A47] bg-[#202A36] px-5 py-4 sm:px-6">
            <span className="flex size-9 shrink-0 items-center justify-center border border-[#354456] bg-[#293747] text-[#B9C8D9]">
                <Icon size={17} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
                <h3 className="text-[14px] font-semibold! text-[#EEF1F5]!">
                    {title}
                </h3>

                {subtitle && (
                    <p className="mt-1 text-[12px] leading-5 text-[#A0ADBD]">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const tone = STATUS_TONES[status] || DEFAULT_STATUS_TONE;

    return (
        <span
            className={`inline-flex min-h-9 shrink-0 items-center gap-2 border px-3 py-2 text-[12px] font-semibold! ${tone}`}
        >
            <span className="size-1.5 shrink-0 rounded-full bg-current" />

            {getStatusLabel(status)}
        </span>
    );
}

function RequestContent({ request, onEdit }) {
    const assignmentInfo = getAssignmentInfo(request);

    const assignment = assignmentInfo?.currentAssignment;
    const organization = assignment?.organization;

    const organizationName =
        organization?.name ||
        organization?.organization_name ||
        request?.organization?.name ||
        'Not assigned';

    const assignments = Array.isArray(request.assignments)
        ? request.assignments
        : [];

    return (
        <div className="space-y-5 lg:space-y-6">
            {/* Request identity */}
            <section
                className="flex min-w-0 flex-col gap-5 border px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                style={{
                    backgroundColor: COLORS.surface,
                    borderColor: COLORS.border,
                }}
            >
                <div className="flex min-w-0 items-start gap-4">
                    <span className="hidden size-12 shrink-0 items-center justify-center border border-[#394758] bg-[#263343] text-[#B7C7D8] sm:flex">
                        <FileText size={22} strokeWidth={1.7} />
                    </span>

                    <div className="min-w-0">
                        <p className="mb-2 text-[12px] text-[#A0ADBD]">
                            Help request #{request.id}
                        </p>

                        <h2 className="break-words text-[20px] font-semibold! leading-snug text-[#EEF1F5]! sm:text-[24px]">
                            {request.title || 'Untitled request'}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#AAB7C7]">
                            <span className="inline-flex min-w-0 items-center gap-2">
                                <MapPin size={14} className="shrink-0" />

                                <span className="break-words">
                                    {request.district || 'Location unavailable'}
                                </span>
                            </span>

                            <span className="inline-flex items-center gap-2">
                                <CalendarDays size={14} />

                                {formatDate(request.created_at)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <StatusBadge status={request.status} />

                    {request.status === 'pending' && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#46566A] bg-[#263343] px-3 text-[12px] font-medium! text-[#EEF1F5]! transition-colors hover:bg-[#304155]"
                        >
                            <Pencil size={14} strokeWidth={1.8} />
                            Edit request
                        </button>
                    )}
                </div>
            </section>

            {/* Main details and sidebar */}
            <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
                <main className="min-w-0 space-y-5">
                    {/* Request information */}
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={FileText}
                            title="About this request"
                            subtitle="Request details and assistance requirements"
                        />

                        <div className="px-5 py-5 sm:px-6 sm:py-6">
                            <p className="whitespace-pre-wrap break-words text-[14px] leading-7 text-[#D2DAE4]">
                                {request.description ||
                                    'No description provided.'}
                            </p>

                            <div className="mt-6 border-t border-[#303A47] pt-5">
                                <h4 className="mb-3 text-[13px] font-semibold! text-[#EEF1F5]!">
                                    Request information
                                </h4>

                                <dl className="grid min-w-0 gap-x-8 sm:grid-cols-2">
                                    <Info
                                        label="Category"
                                        value={request.category}
                                    />

                                    <Info
                                        label="Urgency"
                                        value={getUrgencyLabel(request.urgency)}
                                    />

                                    <Info
                                        label="District"
                                        value={request.district}
                                    />

                                    <Info
                                        label="Request ID"
                                        value={String(request.id)}
                                    />

                                    <Info
                                        label="Address"
                                        value={request.address}
                                    />
                                </dl>
                            </div>
                        </div>
                    </section>

                    {/* Assignment history */}
                    {assignments.length > 0 && (
                        <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                            <SectionHeader
                                icon={Building2}
                                title="Assignment history"
                                subtitle="Organizations connected to this request"
                            />

                            <div className="divide-y divide-[#303A47]">
                                {assignments.map((item, index) => {
                                    const name =
                                        item.organization?.name ||
                                        item.organization?.organization_name ||
                                        'Organization';

                                    return (
                                        <div
                                            key={item.id ?? index}
                                            className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
                                        >
                                            <div className="min-w-0">
                                                <p className="break-words text-[13px] font-semibold! text-[#EEF1F5]!">
                                                    {name}
                                                </p>

                                                <p className="mt-1 text-[12px] leading-5 text-[#A0ADBD]">
                                                    {formatDate(
                                                        item.created_at,
                                                    )}

                                                    {item.id
                                                        ? ` · Assignment #${item.id}`
                                                        : ''}
                                                </p>
                                            </div>

                                            <span className="inline-flex border border-[#394758] bg-[#263343] px-2.5 py-1 text-[11px] capitalize text-[#C8D2DF]">
                                                {String(
                                                    item.status || 'Pending',
                                                ).replaceAll('_', ' ')}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </main>

                {/* Sidebar */}
                <aside className="min-w-0 space-y-5">
                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={ClipboardList}
                            title="Request overview"
                            subtitle="Current request classification"
                        />

                        <dl className="px-5 py-2">
                            <Info
                                label="Status"
                                value={getStatusLabel(request.status)}
                            />

                            <Info label="Category" value={request.category} />

                            <Info
                                label="Urgency"
                                value={getUrgencyLabel(request.urgency)}
                            />

                            <Info
                                label="Assigned organization"
                                value={organizationName}
                            />
                        </dl>
                    </section>

                    <section className="min-w-0 overflow-hidden border border-[#303A47] bg-[#1A212B]">
                        <SectionHeader
                            icon={Clock3}
                            title="Record history"
                            subtitle="Submission and last modification"
                        />

                        <div className="space-y-5 px-5 py-5">
                            <div>
                                <p className="text-[12px] text-[#A0ADBD]">
                                    Submitted
                                </p>

                                <p className="mt-1 text-[13px] font-medium! text-[#EEF1F5]!">
                                    {formatDate(request.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-[12px] text-[#A0ADBD]">
                                    Last updated
                                </p>

                                <p className="mt-1 text-[13px] font-medium! text-[#EEF1F5]!">
                                    {formatDate(request.updated_at)}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default function HelpRequestDetails() {
    const params = useParams();
    const navigate = useNavigate();

    const id =
        params.id ??
        params.requestId ??
        params.helpRequestId ??
        params.help_request_id;

    const [reloadKey, setReloadKey] = useState(0);

    const [requestState, setRequestState] = useState({
        requestId: null,
        reloadKey: -1,
        request: null,
        loading: true,
        error: '',
    });

    useEffect(() => {
        let cancelled = false;

        async function loadRequest() {
            try {
                if (id === null || id === undefined) {
                    throw new Error('Invalid help request ID.');
                }

                const response = await getMyHelpRequests();

                const items = normalizeHelpRequests(
                    response?.help_requests ||
                        response?.helpRequests ||
                        response?.data ||
                        [],
                );

                const selected =
                    items.find((item) => String(item.id) === String(id)) ||
                    null;

                if (!selected) {
                    throw new Error(
                        'This request was not found among your submissions.',
                    );
                }

                if (!cancelled) {
                    setRequestState({
                        requestId: id,
                        reloadKey,
                        request: selected,
                        loading: false,
                        error: '',
                    });
                }
            } catch (err) {
                if (!cancelled) {
                    setRequestState({
                        requestId: id,
                        reloadKey,
                        request: null,
                        loading: false,
                        error:
                            err?.message || 'Unable to load this help request.',
                    });
                }
            }
        }

        loadRequest();

        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const loading =
        requestState.loading ||
        requestState.requestId !== id ||
        requestState.reloadKey !== reloadKey;

    const { request, error } = requestState;

    const handleRetry = () => {
        setReloadKey((current) => current + 1);
    };

    const handleBack = () => {
        navigate(BASE);
    };

    const handleEdit = () => {
        navigate(`${BASE}/${id}/edit`);
    };

    const header = (
        <PageHeader
            title="Help request details"
            subtitle="Review your submitted request and its current progress."
            action={
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[13px] font-medium! text-[#C4CDD8] transition-colors hover:bg-[#202A35] hover:text-[#EEF1F5]!"
                >
                    <ArrowLeft size={15} strokeWidth={1.8} />
                    All help requests
                </button>
            }
        />
    );

    if (loading) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingUI
                    variant="page"
                    title="Loading help request..."
                    description="Retrieving your submitted request information."
                />
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-w-0 space-y-6 pb-10 font-sans">
                {header}

                <LoadingError
                    title={
                        error?.includes('not found')
                            ? 'Help request not found'
                            : 'Unable to load help request'
                    }
                    message={
                        error ||
                        'The requested help request could not be found.'
                    }
                    onRetry={handleRetry}
                />
            </div>
        );
    }

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans lg:space-y-7">
            {header}

            <RequestContent
                request={request}
                requestId={id}
                onEdit={handleEdit}
            />
        </div>
    );
}
