import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertCircle,
    AlertTriangle,
    ArrowUpRight,
    Building2,
    CalendarDays,
    Clock3,
    ClipboardList,
    FileText,
    MapPin,
    Pencil,
    RefreshCw,
    Search,
    UserRound,
    UsersRound,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';
import { checkHelpRequestDuplicates } from '../api/helpRequestAPI';

const PANEL = 'min-w-0 overflow-hidden border border-[#303A47] bg-[#171D26]';

const STATUS_COLORS = {
    pending: 'border-[#66583D] bg-[#332D22] text-[#E4C995]',
    active: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    approved: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    verified: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    completed: 'border-[#46586D] bg-[#253242] text-[#C0D0E1]',
    rejected: 'border-[#75464C] bg-[#322126] text-[#E9B8BD]',
    cancelled: 'border-[#515967] bg-[#292E37] text-[#C2CAD5]',
};

function show(value, fallback = 'Not provided') {
    if (value === null || value === undefined) return fallback;

    const result = String(value).trim();
    return result || fallback;
}

function titleCase(value) {
    return show(value, 'Not specified')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function dateText(value, withTime = false) {
    if (!value) return 'Not set';

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return String(value);

    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
    };

    return parsed.toLocaleString('en-GB', options);
}

function getAssignments(request) {
    if (Array.isArray(request.assignments)) return request.assignments;

    if (Array.isArray(request.help_request_assignments)) {
        return request.help_request_assignments;
    }

    if (Array.isArray(request.helpRequestAssignments)) {
        return request.helpRequestAssignments;
    }

    return request.assignment ? [request.assignment] : [];
}

function getRequester(request) {
    const requester = request.user || request.requester || {};

    return {
        id: request.user_id ?? request.requester_id ?? requester.id ?? null,
        name:
            requester.name ||
            requester.full_name ||
            request.requesterName ||
            'Unknown requester',
        email: requester.email || request.requesterEmail || null,
        image:
            requester.profile_image ||
            requester.avatar ||
            requester.photo ||
            null,
    };
}

function SectionHeader({ icon: Icon, title, subtitle, extra }) {
    return (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[#344150] bg-[#202B38] px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center border border-[#3A495B] bg-[#273646] text-[#C3D0DE]">
                    <Icon size={16} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                    <h2 className="m-0! font-sans! text-[14px]! font-semibold! leading-5 text-[#EEF1F5]!">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 mb-0! text-[12px] leading-5 text-[#9AAABD]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {extra}
        </div>
    );
}

function Info({ title, value, className = '' }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <dt className="text-[12px] font-medium text-[#8796A8]">{title}</dt>
            <dd className="mt-1.5 mb-0 wrap-break-word whitespace-pre-wrap text-[14px] leading-6 text-[#E6EBF2]">
                {show(value)}
            </dd>
        </div>
    );
}

function Status({ value }) {
    return <StatusBadge status={value || 'pending'} />;
}

function Identity({ request, requester, onEdit }) {
    const [imageFailed, setImageFailed] = useState(false);
    const status = String(request.status || 'pending').toLowerCase();

    return (
        <section className={PANEL}>
            <div className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden border border-[#3A495B] bg-[#253242] text-[#C3D0DE] sm:size-14">
                        {requester.image && !imageFailed ? (
                            <img
                                src={requester.image}
                                alt={requester.name}
                                onError={() => setImageFailed(true)}
                                className="size-full object-cover"
                            />
                        ) : (
                            <FileText size={23} strokeWidth={1.5} />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="m-0! text-[12px] font-medium text-[#94A3B4]">
                            Help request #{show(request.id)}
                        </p>

                        <h1 className="mt-2 mb-0! wrap-break-word font-sans! text-[19px]! font-semibold! leading-[1.45] tracking-[-0.02em] text-[#F0F3F7]! sm:text-[23px]!">
                            {show(request.title, 'Untitled help request')}
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#AAB8C7]">
                            <span className="inline-flex items-center gap-2">
                                <UserRound size={14} />
                                {requester.name}
                            </span>

                            {request.district && (
                                <span className="inline-flex items-center gap-2">
                                    <MapPin size={14} />
                                    {request.district}
                                </span>
                            )}

                            {request.created_at && (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays size={14} />
                                    {dateText(request.created_at)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                    <span
                        className={`inline-flex min-h-9 items-center gap-2 border px-3 text-[12px] font-medium ${
                            STATUS_COLORS[status] ||
                            'border-[#465363] bg-[#253242] text-[#D5DFE9]'
                        }`}
                    >
                        <span className="size-1.5 rounded-full bg-current" />
                        {titleCase(status)}
                    </span>

                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#586678] bg-[#2B3949] px-3.5 text-[12px] font-medium text-[#EEF1F5] transition-colors hover:bg-[#37495D]"
                    >
                        <Pencil size={14} strokeWidth={1.8} />
                        Edit request
                    </button>
                </div>
            </div>
        </section>
    );
}

function RequesterLink({ requester }) {
    const [imageFailed, setImageFailed] = useState(false);

    const content = (
        <>
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden border border-[#3A495B] bg-[#253242] text-[#B7C8D9]">
                {requester.image && !imageFailed ? (
                    <img
                        src={requester.image}
                        alt={requester.name}
                        onError={() => setImageFailed(true)}
                        className="size-full object-cover"
                    />
                ) : (
                    <UserRound size={19} strokeWidth={1.7} />
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-[#E7EDF4]">
                    {requester.name}
                </span>
                <span className="mt-1 block truncate text-[13px] text-[#98A8BA]">
                    {show(requester.email)}
                </span>
            </span>

            {requester.id != null && (
                <ArrowUpRight
                    size={17}
                    strokeWidth={1.7}
                    className="shrink-0 text-[#91A4B8] transition-colors group-hover:text-[#EEF1F5]"
                />
            )}
        </>
    );

    if (requester.id == null) {
        return (
            <div className="flex min-w-0 items-center gap-3 border border-[#344150] bg-[#151D27] px-4 py-3">
                {content}
            </div>
        );
    }

    return (
        <Link
            to={`/admin/dashboard/users/${requester.id}`}
            title="View requester details"
            className="group flex min-w-0 items-center gap-3 border border-[#344150] bg-[#151D27] px-4 py-3 transition-colors hover:border-[#526276] hover:bg-[#1D2936]"
        >
            {content}
        </Link>
    );
}

function RequestInformation({ request, requester }) {
    const address = request.address || request.location;

    return (
        <section className="min-w-0 overflow-hidden border border-[#354354] bg-[#1A222D]">
            <SectionHeader
                icon={FileText}
                title="About this request"
                subtitle="Request details and assistance requirements"
            />

            <div className="px-5 py-6 sm:px-7 sm:py-7">
                <p className="m-0! wrap-break-word whitespace-pre-line text-[14px] leading-[1.95] text-[#D4DDE7]">
                    {show(
                        request.description,
                        'No request description has been provided.',
                    )}
                </p>

                <div className="mt-7 border-t border-[#344150] pt-6">
                    <h3 className="m-0! font-sans! text-[14px]! font-semibold! text-[#E8EDF3]!">
                        Request information
                    </h3>

                    <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                        <Info
                            title="Category"
                            value={titleCase(request.category)}
                        />
                        <Info
                            title="Urgency"
                            value={titleCase(
                                request.urgency || request.priority,
                            )}
                        />
                        <Info title="Request ID" value={request.id} />
                        <Info title="District" value={request.district} />
                        <Info
                            title="Address"
                            value={address}
                            className="sm:col-span-2"
                        />
                    </dl>
                </div>

                <div className="mt-7 border-t border-[#344150] pt-6">
                    <h3 className="m-0! font-sans! text-[14px]! font-semibold! text-[#E8EDF3]!">
                        Requester information
                    </h3>

                    <div className="mt-4">
                        <RequesterLink requester={requester} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function OverviewRow({ title, children }) {
    return (
        <div className="flex min-w-0 items-start justify-between gap-4 border-b border-[#303A47] py-4 last:border-b-0">
            <dt className="shrink-0 text-[13px] text-[#9EADBD]">{title}</dt>
            <dd className="m-0! min-w-0 wrap-break-word text-right text-[13px] font-medium text-[#E2EAF1]">
                {children}
            </dd>
        </div>
    );
}

function RequestOverview({ request, assignmentCount }) {
    return (
        <section className={PANEL}>
            <SectionHeader
                icon={ClipboardList}
                title="Request overview"
                subtitle="Status and request classification"
            />

            <div className="bg-[#0E1219] px-5 py-3 sm:px-6">
                <dl>
                    <OverviewRow title="Request status">
                        <Status value={request.status} />
                    </OverviewRow>
                    <OverviewRow title="Verification">
                        <Status value={request.verification_status} />
                    </OverviewRow>
                    <OverviewRow title="Category">
                        {titleCase(request.category)}
                    </OverviewRow>
                    <OverviewRow title="Urgency level">
                        {titleCase(request.urgency || request.priority)}
                    </OverviewRow>
                    <OverviewRow title="Assignments">
                        {assignmentCount}
                    </OverviewRow>
                </dl>
            </div>

            {request.verification_note && (
                <div className="border-t border-[#303A47] bg-[#151C25] px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={15} className="text-[#A7B8CA]" />
                        <h3 className="m-0! font-sans! text-[13px]! font-semibold! text-[#E6EDF5]!">
                            Verification note
                        </h3>
                    </div>

                    <p className="mt-3 mb-0! wrap-break-word whitespace-pre-wrap text-[13px] leading-6 text-[#B3C0CE]">
                        {request.verification_note}
                    </p>
                </div>
            )}
        </section>
    );
}

function RecordHistory({ request }) {
    return (
        <section className={PANEL}>
            <SectionHeader
                icon={Clock3}
                title="Record history"
                subtitle="Creation and last modification"
            />

            <dl className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-1">
                <Info
                    title="Submitted"
                    value={dateText(request.created_at, true)}
                />
                <Info
                    title="Last updated"
                    value={dateText(request.updated_at, true)}
                />
            </dl>
        </section>
    );
}

function getAssignmentOrganization(assignment) {
    const organization =
        assignment.organization ||
        assignment.organization_user ||
        assignment.organizationUser ||
        {};

    return {
        name:
            organization.name ||
            assignment.organization_name ||
            assignment.organizationName ||
            'Assignment',
        id:
            assignment.organization_id ??
            assignment.organizationId ??
            organization.id ??
            null,
    };
}

function AssignmentHistory({ assignments }) {
    return (
        <section className={PANEL}>
            <SectionHeader
                icon={UsersRound}
                title="Assignment history"
                subtitle="Organizations and teams connected to this request"
                extra={
                    <span className="border border-[#435064] bg-[#293747] px-2.5 py-1 text-[12px] font-medium tabular-nums text-[#D4DFEA]">
                        {assignments.length}{' '}
                        {assignments.length === 1
                            ? 'assignment'
                            : 'assignments'}
                    </span>
                }
            />

            {assignments.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center">
                    <Building2
                        size={25}
                        strokeWidth={1.5}
                        className="text-[#8294A7]"
                    />
                    <p className="mt-3 mb-0! text-[14px] font-medium text-[#DCE5EF]">
                        No assignments recorded
                    </p>
                    <p className="mt-1 mb-0! text-[13px] text-[#91A0B0]">
                        This help request has not been assigned yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-[#303A47]">
                    {assignments.map((assignment, index) => {
                        const organization =
                            getAssignmentOrganization(assignment);

                        return (
                            <div
                                key={assignment.id ?? index}
                                className="flex min-w-0 flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7"
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center border border-[#3A495B] bg-[#253242] text-[#B7C8D9]">
                                        <Building2
                                            size={17}
                                            strokeWidth={1.7}
                                        />
                                    </span>

                                    <div className="min-w-0">
                                        {organization.id != null ? (
                                            <Link
                                                to={`/admin/dashboard/organizations/${organization.id}`}
                                                className="group inline-flex max-w-full items-center gap-1.5 text-left text-[14px] font-semibold text-[#DCE8F5] transition-colors hover:text-white"
                                                title="View organization details"
                                            >
                                                <span className="wrap-break-word underline decoration-[#70869C] underline-offset-4 group-hover:decoration-white">
                                                    {organization.name}
                                                </span>
                                                <ArrowUpRight
                                                    size={14}
                                                    className="shrink-0 text-[#94A9BE] group-hover:text-white"
                                                />
                                            </Link>
                                        ) : (
                                            <p className="m-0! wrap-break-word text-[14px] font-semibold text-[#E7EDF4]">
                                                {organization.name}
                                            </p>
                                        )}

                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#94A3B4]">
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays size={13} />
                                                {dateText(
                                                    assignment.assigned_at ||
                                                        assignment.created_at,
                                                )}
                                            </span>

                                            {assignment.id != null && (
                                                <span>
                                                    Assignment #{assignment.id}
                                                </span>
                                            )}
                                        </div>

                                        {assignment.rejection_note && (
                                            <p className="mt-3 mb-0! wrap-break-word whitespace-pre-wrap text-[13px] leading-6 text-[#D6A9AC]">
                                                {assignment.rejection_note}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0 self-start">
                                    <Status
                                        value={assignment.status || 'pending'}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

function DuplicateAnalysis({ request, result, loading, error, onCheck }) {
    const payload = result?.data ?? result;
    const matches = Array.isArray(payload?.matches) ? payload.matches : [];

    return (
        <section className={PANEL}>
            <SectionHeader
                icon={Search}
                title="Duplicate request analysis"
                subtitle="Compare this request with existing help requests"
                extra={
                    <button
                        type="button"
                        onClick={onCheck}
                        disabled={loading || !request.id}
                        className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#49665F] bg-[#20382F] px-3 text-[12px] font-medium text-[#B9E2D0] transition-colors hover:bg-[#29483C] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <RefreshCw size={14} className="animate-spin" />
                        ) : (
                            <Search size={14} />
                        )}
                        {loading
                            ? 'Analyzing...'
                            : result
                              ? 'Run again'
                              : 'Check duplicates'}
                    </button>
                }
            />

            <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
                <p className="m-0! text-[13px] leading-6 text-[#AAB8C7]">
                    Identifies existing requests with similar descriptions,
                    categories, or locations. Matches are suggestions for
                    administrative review, not proof of fraud or duplication.
                    This analysis never verifies or rejects a request.
                </p>

                {error && (
                    <div className="flex items-start gap-3 border border-[#75464C] bg-[#322126] px-4 py-3">
                        <AlertTriangle
                            size={17}
                            className="mt-0.5 shrink-0 text-[#E9B8BD]"
                        />
                        <p className="m-0! text-[13px] leading-5 text-[#E9B8BD]">
                            {error}
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center gap-3 border border-[#344150] bg-[#151D27] px-4 py-4">
                        <RefreshCw
                            size={17}
                            className="shrink-0 animate-spin text-[#A9C7C0]"
                        />
                        <p className="m-0! text-[13px] text-[#C4D0DC]">
                            Comparing this request with existing records...
                        </p>
                    </div>
                )}

                {!loading && result && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#344150] bg-[#151D27] px-4 py-3">
                            <div>
                                <p className="m-0! text-[13px] font-semibold text-[#E6EDF5]">
                                    Analysis complete
                                </p>
                                <p className="mt-1 mb-0! text-[12px] text-[#98A8BA]">
                                    {matches.length === 0
                                        ? 'No potential matches were found.'
                                        : `${matches.length} potential ${
                                              matches.length === 1
                                                  ? 'match'
                                                  : 'matches'
                                          } found.`}
                                </p>
                            </div>

                            <span className="border border-[#435064] bg-[#293747] px-3 py-1.5 text-[12px] font-semibold tabular-nums text-[#D4DFEA]">
                                {matches.length}
                            </span>
                        </div>

                        {matches.map((match) => {
                            const score = Math.max(
                                0,
                                Math.min(
                                    100,
                                    Number(match.similarity_score ?? 0),
                                ),
                            );
                            const reasons = Array.isArray(match.match_reasons)
                                ? match.match_reasons
                                : [];

                            return (
                                <article
                                    key={match.id}
                                    className="min-w-0 border border-[#303A47] bg-[#151D27] px-4 py-4 sm:px-5"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="m-0! text-[11px] font-medium uppercase tracking-[0.08em] text-[#899BAF]">
                                                Request #{match.id}
                                            </p>
                                            <h3 className="mt-1.5 mb-0! wrap-break-word font-sans! text-[14px]! font-semibold! leading-6 text-[#E8EDF4]!">
                                                {show(
                                                    match.title,
                                                    'Untitled help request',
                                                )}
                                            </h3>
                                            <p className="mt-1 mb-0! text-[12px] leading-5 text-[#A3B1C0]">
                                                {show(
                                                    match.user?.name,
                                                    'Unknown requester',
                                                )}
                                            </p>
                                        </div>

                                        <div className="shrink-0 border border-[#49665F] bg-[#20382F] px-3 py-2">
                                            <p className="m-0! text-[10px] text-[#A9C7C0]">
                                                Similarity score
                                            </p>
                                            <p className="mt-0.5 mb-0! text-[18px] font-semibold tabular-nums text-[#C1E5D5]">
                                                {Math.round(score)}%
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <Info
                                            title="Category"
                                            value={titleCase(match.category)}
                                        />
                                        <Info
                                            title="District"
                                            value={match.district}
                                        />
                                        <Info
                                            title="Current status"
                                            value={titleCase(match.status)}
                                        />
                                        <Info
                                            title="Submitted"
                                            value={dateText(match.created_at)}
                                        />
                                    </div>

                                    {reasons.length > 0 && (
                                        <div className="mt-4 border-t border-[#303A47] pt-3">
                                            <p className="m-0! text-[12px] font-medium text-[#CBD6E2]">
                                                Reasons for matching
                                            </p>
                                            <ul className="mt-2 mb-0 flex flex-wrap gap-2 p-0">
                                                {reasons.map(
                                                    (reason, index) => (
                                                        <li
                                                            key={`${match.id}-${index}`}
                                                            className="list-none border border-[#3B4959] bg-[#202B38] px-2.5 py-1.5 text-[11px] leading-4 text-[#C1CDD9]"
                                                        >
                                                            {reason}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </>
                )}

                {!loading && !result && !error && (
                    <div className="border border-dashed border-[#3A4757] px-4 py-6 text-center">
                        <Search size={22} className="mx-auto text-[#899BAF]" />
                        <p className="mt-3 mb-0! text-[13px] font-medium text-[#DCE5EF]">
                            No analysis has been run
                        </p>
                        <p className="mt-1 mb-0! text-[12px] leading-5 text-[#98A8BA]">
                            Run a check to review potentially similar requests.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function HelpRequestDetailsView({ request, onEdit }) {
    const requester = getRequester(request);
    const assignments = getAssignments(request);

    const [duplicateAnalysis, setDuplicateAnalysis] = useState(null);
    const [duplicateAnalysisLoading, setDuplicateAnalysisLoading] =
        useState(false);
    const [duplicateAnalysisError, setDuplicateAnalysisError] = useState('');

    const handleDuplicateCheck = async () => {
        if (!request.id || duplicateAnalysisLoading) return;

        setDuplicateAnalysisLoading(true);
        setDuplicateAnalysisError('');

        try {
            const response = await checkHelpRequestDuplicates(request.id);
            setDuplicateAnalysis(response?.data ?? response);
        } catch (error) {
            setDuplicateAnalysisError(
                error?.message ||
                    'Unable to analyze potential duplicate requests. Please try again.',
            );
        } finally {
            setDuplicateAnalysisLoading(false);
        }
    };

    return (
        <main className="min-w-0 space-y-5 font-sans">
            <Identity request={request} requester={requester} onEdit={onEdit} />

            <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_350px]">
                <div className="min-w-0 space-y-5">
                    <RequestInformation
                        request={request}
                        requester={requester}
                    />

                    <DuplicateAnalysis
                        request={request}
                        result={duplicateAnalysis}
                        loading={duplicateAnalysisLoading}
                        error={duplicateAnalysisError}
                        onCheck={handleDuplicateCheck}
                    />

                    <AssignmentHistory assignments={assignments} />
                </div>

                <aside className="min-w-0 space-y-5">
                    <RequestOverview
                        request={request}
                        assignmentCount={assignments.length}
                    />
                    <RecordHistory request={request} />
                </aside>
            </div>
        </main>
    );
}
