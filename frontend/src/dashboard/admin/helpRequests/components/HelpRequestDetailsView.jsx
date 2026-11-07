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
import HelpRequestEvidenceSection from './HelpRequestEvidenceSection';

const PANEL = 'min-w-0 border border-[#303A47] bg-[#171D26]';

const STATUS_COLORS = {
    pending: 'border-[#66583D] bg-[#332D22] text-[#E4C995]',
    active: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    approved: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    verified: 'border-[#416B5D] bg-[#20382F] text-[#A8D7C0]',
    completed: 'border-[#46586D] bg-[#253242] text-[#C0D0E1]',
    rejected: 'border-[#75464C] bg-[#322126] text-[#E9B8BD]',
    cancelled: 'border-[#515967] bg-[#292E37] text-[#C2CAD5]',
};

const HEADING_STYLE = {
    color: '#EEF1F5',
    fontFamily: 'inherit',
    fontWeight: 650,
    letterSpacing: '-0.025em',
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

    return parsed.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
    });
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

function SectionLabel({ children }) {
    return (
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8295A9]">
            {children}
        </p>
    );
}

function SectionTitle({ children, className = '' }) {
    return (
        <h2
            className={`m-0! font-sans! text-[21px]! leading-tight! sm:text-[24px]! ${className}`}
            style={HEADING_STYLE}
        >
            {children}
        </h2>
    );
}

function Info({ title, value, className = '' }) {
    return (
        <div className={`min-w-0 ${className}`}>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#8294A7]">
                {title}
            </dt>
            <dd className="mt-1.5 mb-0! wrap-break-word whitespace-pre-wrap text-[13px] leading-5 text-[#E2E9F1]">
                {show(value)}
            </dd>
        </div>
    );
}

function Status({ value }) {
    return <StatusBadge status={value || 'pending'} />;
}

/* =========================================================
   CASE HEADER
========================================================= */

function Identity({ request, requester, onEdit }) {
    const status = String(request.status || 'pending').toLowerCase();

    return (
        <section className="relative overflow-hidden border-y border-[#303A47] bg-[#151C25]">
            <div className="pointer-events-none absolute -right-8 -top-12 select-none font-sans text-[170px] font-bold leading-none tracking-[-0.1em] text-white/[0.018]">
                #{request.id}
            </div>

            <div className="relative grid gap-6 px-5 py-7 sm:px-8 sm:py-8 xl:grid-cols-[minmax(0,1fr)_250px] xl:gap-10">
                <div className="min-w-0">
                    <div className="mb-5 flex flex-wrap items-center gap-2.5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9AADC0]">
                            Case file
                        </span>

                        <span className="text-[#566A7F]">/</span>

                        <span className="font-mono text-[11px] text-[#B4C3D2]">
                            HR-{show(request.id)}
                        </span>

                        <span
                            className={`inline-flex min-h-7 items-center gap-2 border px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                                STATUS_COLORS[status] ||
                                'border-[#465363] bg-[#253242] text-[#D5DFE9]'
                            }`}
                        >
                            <span className="size-1.5 rounded-full bg-current" />
                            {titleCase(status)}
                        </span>
                    </div>

                    <h1
                        className="m-0! max-w-4xl wrap-break-word font-sans! text-[27px]! font-semibold! leading-[1.2]! tracking-[-0.035em]! sm:text-[36px]! xl:text-[42px]!"
                        style={{ color: '#F0F3F7', fontFamily: 'inherit' }}
                    >
                        {show(request.title, 'Untitled help request')}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-[#A6B5C5]">
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
                                Submitted {dateText(request.created_at)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-5 border-t border-[#303A47] pt-5 xl:flex-col xl:items-end xl:justify-between xl:border-l xl:border-t-0 xl:pl-7 xl:pt-1">
                    <div className="max-w-[230px] xl:text-right">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8FA3B8]">
                            Administrative review
                        </p>

                        <p className="mb-0 text-[12px] leading-5 text-[#AAB8C7]">
                            Review the submitted information, supporting
                            documents and coordination history.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#586A7D] bg-[#2B3949] px-4 text-[12px] font-semibold text-[#EEF1F5] transition-colors hover:bg-[#37495D]"
                    >
                        <Pencil size={14} />
                        Edit request
                    </button>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   REQUEST INFORMATION
========================================================= */

function RequestInformation({ request }) {
    const address = request.address || request.location;

    return (
        <section className="min-w-0">
            <div className="flex items-center justify-between gap-4 border-b border-[#344150] pb-4">
                <div>
                    <SectionLabel>01 / Submitted information</SectionLabel>
                    <SectionTitle>The request</SectionTitle>
                </div>

                <FileText size={19} className="shrink-0 text-[#8296AA]" />
            </div>

            <div className="py-7 sm:py-8">
                <p className="m-0! max-w-4xl wrap-break-word whitespace-pre-line text-[15px] leading-[1.9] text-[#DCE4ED] sm:text-[16px]">
                    {show(
                        request.description,
                        'No request description has been provided.',
                    )}
                </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-5 gap-y-5 border-y border-[#303A47] bg-[#141B24] px-4 py-5 sm:grid-cols-3 sm:px-5 xl:grid-cols-5">
                <Info title="Request ID" value={`#${show(request.id)}`} />
                <Info title="Category" value={titleCase(request.category)} />
                <Info
                    title="Urgency"
                    value={titleCase(request.urgency || request.priority)}
                />
                <Info title="District" value={request.district} />
                <Info
                    title="Full address"
                    value={address}
                    className="col-span-2 sm:col-span-1"
                />
            </dl>
        </section>
    );
}

/* =========================================================
   REQUESTER
========================================================= */

function RequesterLink({ requester }) {
    const [imageFailed, setImageFailed] = useState(false);

    const content = (
        <>
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#3A495B] bg-[#253242] text-[#B7C8D9]">
                {requester.image && !imageFailed ? (
                    <img
                        src={requester.image}
                        alt={requester.name}
                        onError={() => setImageFailed(true)}
                        className="size-full object-cover"
                    />
                ) : (
                    <UserRound size={18} strokeWidth={1.7} />
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#E7EDF4]">
                    {requester.name}
                </span>
                <span className="mt-1 block truncate text-[11px] text-[#98A8BA]">
                    {show(requester.email)}
                </span>
            </span>

            {requester.id != null && (
                <ArrowUpRight size={15} className="shrink-0 text-[#91A4B8]" />
            )}
        </>
    );

    if (requester.id == null) {
        return (
            <div className="flex min-w-0 items-center gap-3 border border-[#344150] bg-[#151D27] px-3 py-3">
                {content}
            </div>
        );
    }

    return (
        <Link
            to={`/admin/dashboard/users/${requester.id}`}
            title="View requester details"
            className="group flex min-w-0 items-center gap-3 border border-[#344150] bg-[#151D27] px-3 py-3 transition-colors hover:border-[#526276] hover:bg-[#1D2936]"
        >
            {content}
        </Link>
    );
}

/* =========================================================
   CASE CONTEXT SIDEBAR
========================================================= */

function OverviewRow({ title, children }) {
    return (
        <div className="flex min-w-0 items-center justify-between gap-3 border-b border-[#303A47] py-3 last:border-b-0">
            <dt className="shrink-0 text-[11px] text-[#9EADBD]">{title}</dt>
            <dd className="m-0! min-w-0 wrap-break-word text-right text-[12px] font-medium text-[#E2EAF1]">
                {children}
            </dd>
        </div>
    );
}

function RequestOverview({ request, requester, assignmentCount }) {
    return (
        <aside className="min-w-0">
            <div className="border-t-2 border-[#71869B] pt-4">
                <SectionLabel>02 / Case context</SectionLabel>
                <h2
                    className="m-0! font-sans! text-[19px]! font-semibold! text-[#EAF0F6]!"
                    style={HEADING_STYLE}
                >
                    At a glance
                </h2>

                <dl className="mt-4">
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
                        <span className="font-mono text-[15px] font-semibold text-[#E8EEF5]">
                            {assignmentCount}
                        </span>
                    </OverviewRow>
                </dl>

                {request.verification_note && (
                    <div className="mt-5 border-l-2 border-[#71869B] bg-[#19232E] px-4 py-3.5">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-[#A7B8CA]" />
                            <h3
                                className="m-0! font-sans! text-[12px]! font-semibold! text-[#E6EDF5]!"
                                style={{ color: '#E6EDF5' }}
                            >
                                Verification note
                            </h3>
                        </div>

                        <p className="mt-2 mb-0! wrap-break-word whitespace-pre-wrap text-[12px] leading-5 text-[#B3C0CE]">
                            {request.verification_note}
                        </p>
                    </div>
                )}

                <div className="mt-6 border-t border-[#303A47] pt-5">
                    <SectionLabel>Submitted by</SectionLabel>
                    <RequesterLink requester={requester} />

                    <div className="mt-4">
                        <Info
                            title="Contact number"
                            value={request.contact_phone}
                        />
                    </div>
                </div>

                <div className="mt-6 border-t border-[#303A47] pt-5">
                    <SectionLabel>Record dates</SectionLabel>

                    <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                            <CalendarDays
                                size={14}
                                className="mt-0.5 shrink-0 text-[#8295A9]"
                            />
                            <div>
                                <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-[#8294A7]">
                                    Submitted
                                </p>
                                <p className="mb-0 text-[11px] text-[#DCE5EF]">
                                    {dateText(request.created_at, true)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Clock3
                                size={14}
                                className="mt-0.5 shrink-0 text-[#8295A9]"
                            />
                            <div>
                                <p className="mb-0.5 text-[10px] uppercase tracking-[0.1em] text-[#8294A7]">
                                    Last modified
                                </p>
                                <p className="mb-0 text-[11px] text-[#DCE5EF]">
                                    {dateText(request.updated_at, true)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

/* =========================================================
   ASSIGNMENT HISTORY
========================================================= */

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
        <section className="min-w-0 border-t border-[#344150] pt-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <SectionLabel>04 / Coordination</SectionLabel>
                    <SectionTitle>Assignment history</SectionTitle>
                    <p className="mt-2 mb-0 text-[12px] text-[#95A7BA]">
                        Organizations and teams connected to this request.
                    </p>
                </div>

                <span className="font-mono text-[11px] text-[#B7C7D7]">
                    {String(assignments.length).padStart(2, '0')} assignments
                </span>
            </div>

            {assignments.length === 0 ? (
                <div className="mt-5 flex items-center gap-4 border-y border-[#303A47] py-6">
                    <Building2 size={22} className="shrink-0 text-[#8294A7]" />
                    <div>
                        <p className="mb-1 text-[13px] font-semibold text-[#DCE5EF]">
                            No assignments recorded
                        </p>
                        <p className="mb-0 text-[12px] text-[#91A0B0]">
                            This help request has not been assigned yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mt-5 divide-y divide-[#303A47] border-y border-[#303A47]">
                    {assignments.map((assignment, index) => {
                        const organization =
                            getAssignmentOrganization(assignment);

                        return (
                            <article
                                key={assignment.id ?? index}
                                className="flex min-w-0 flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center bg-[#253242] text-[#B7C8D9]">
                                        <Building2 size={17} />
                                    </span>

                                    <div className="min-w-0">
                                        {organization.id != null ? (
                                            <Link
                                                to={`/admin/dashboard/organizations/${organization.id}`}
                                                className="group inline-flex max-w-full items-center gap-1.5 text-[13px] font-semibold text-[#DCE8F5] hover:text-white"
                                                title="View organization details"
                                            >
                                                <span className="wrap-break-word underline decoration-[#70869C] underline-offset-4">
                                                    {organization.name}
                                                </span>
                                                <ArrowUpRight
                                                    size={14}
                                                    className="shrink-0"
                                                />
                                            </Link>
                                        ) : (
                                            <p className="mb-0 wrap-break-word text-[13px] font-semibold text-[#E7EDF4]">
                                                {organization.name}
                                            </p>
                                        )}

                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#94A3B4]">
                                            <span>
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
                                            <p className="mt-2 mb-0! wrap-break-word whitespace-pre-wrap text-[12px] leading-5 text-[#D6A9AC]">
                                                {assignment.rejection_note}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0 self-start sm:pl-4">
                                    <Status
                                        value={assignment.status || 'pending'}
                                    />
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

/* =========================================================
   DUPLICATE ANALYSIS
========================================================= */

function DuplicateAnalysis({ request, result, loading, error, onCheck }) {
    const payload = result?.data ?? result;
    const matches = Array.isArray(payload?.matches) ? payload.matches : [];

    return (
        <section className="min-w-0 border-t border-[#344150] pt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <SectionLabel>03 / Review assistance</SectionLabel>
                    <SectionTitle>Duplicate request analysis</SectionTitle>
                    <p className="mt-2 mb-0 text-[12px] text-[#95A7BA]">
                        Compare this request with potentially related records.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCheck}
                    disabled={loading || !request.id}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#43556A] bg-[#263444] px-4 text-[12px] font-semibold text-[#E4EBF3] transition-colors hover:bg-[#34465A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={14}
                        className={loading ? 'animate-spin' : ''}
                    />
                    {loading
                        ? 'Analyzing...'
                        : result
                          ? 'Run again'
                          : 'Check duplicates'}
                </button>
            </div>

            <div className="mt-5 border-y border-[#303A47]">
                {error && (
                    <div className="my-4 flex items-start gap-2 border border-[#75464C] bg-[#322126] px-4 py-3 text-[12px] text-[#E9B8BD]">
                        <AlertTriangle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center gap-3 py-8 text-[13px] text-[#B8C9D9]">
                        <RefreshCw size={17} className="animate-spin" />
                        Comparing existing requests...
                    </div>
                )}

                {!loading && result && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                            <div>
                                <p className="mb-1 text-[13px] font-semibold text-[#E9F0F7]">
                                    {matches.length
                                        ? `${matches.length} possible ${matches.length === 1 ? 'match' : 'matches'}`
                                        : 'No potential matches'}
                                </p>
                                <p className="mb-0 text-[11px] text-[#94A5B8]">
                                    {matches.length
                                        ? 'Select a request title to inspect its original record.'
                                        : 'No related records were identified.'}
                                </p>
                            </div>

                            <span className="text-[10px] uppercase tracking-[0.12em] text-[#91A3B6]">
                                Analysis complete
                            </span>
                        </div>

                        {matches.length > 0 && (
                            <div className="divide-y divide-[#394858] border-t border-[#394858]">
                                {matches.map((match, index) => {
                                    const score = Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Number(
                                                match.similarity_score ?? 0,
                                            ) || 0,
                                        ),
                                    );

                                    const reasons = Array.isArray(
                                        match.match_reasons,
                                    )
                                        ? match.match_reasons
                                        : [];

                                    return (
                                        <article
                                            key={match.id ?? index}
                                            className="grid min-w-0 gap-4 bg-[#19232E] px-4 py-5 transition-colors hover:bg-[#202E3D] sm:grid-cols-[minmax(0,1fr)_130px] sm:px-5"
                                        >
                                            <div className="flex min-w-0 gap-3">
                                                <span className="flex size-8 shrink-0 items-center justify-center bg-[#30465B] text-[11px] font-semibold tabular-nums text-[#E9F1FA]">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>

                                                <div className="min-w-0">
                                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#99ACC0]">
                                                        Request #
                                                        {show(match.id)}
                                                        {' / '}
                                                        {titleCase(
                                                            match.status,
                                                        )}
                                                    </p>

                                                    <Link
                                                        to={`/admin/dashboard/help-requests/${match.id}`}
                                                        className="inline-flex max-w-full items-start gap-1.5 text-[14px] font-semibold leading-6 text-[#EAF1F8] underline decoration-[#7896B4] underline-offset-4 hover:text-[#B9D8F4]"
                                                    >
                                                        <span className="wrap-break-word">
                                                            {show(
                                                                match.title,
                                                                'Untitled help request',
                                                            )}
                                                        </span>
                                                        <ArrowUpRight
                                                            size={14}
                                                            className="mt-1 shrink-0"
                                                        />
                                                    </Link>

                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-[#AEBECE]">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <UserRound
                                                                size={12}
                                                            />
                                                            {show(
                                                                match.user
                                                                    ?.name,
                                                                'Unknown requester',
                                                            )}
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <ClipboardList
                                                                size={12}
                                                            />
                                                            {titleCase(
                                                                match.category,
                                                            )}
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin size={12} />
                                                            {show(
                                                                match.district,
                                                            )}
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays
                                                                size={12}
                                                            />
                                                            {dateText(
                                                                match.created_at,
                                                            )}
                                                        </span>
                                                    </div>

                                                    {reasons.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {reasons.map(
                                                                (
                                                                    reason,
                                                                    reasonIndex,
                                                                ) => (
                                                                    <span
                                                                        key={`${match.id}-${reasonIndex}`}
                                                                        className="bg-[#29394A] px-2 py-1 text-[10px] leading-5 text-[#C3D3E3]"
                                                                    >
                                                                        {reason}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 border-t border-[#344557] pt-3 sm:flex-col sm:items-start sm:justify-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-[#A4B9CB]">
                                                    Similarity
                                                </span>

                                                <span className="font-mono text-[23px] font-semibold leading-none tabular-nums text-[#EDF4FB]">
                                                    {Math.round(score)}%
                                                </span>

                                                <div className="h-1.5 w-full overflow-hidden bg-[#3B4D60]">
                                                    <div
                                                        className="h-full bg-[#9ABCD4]"
                                                        style={{
                                                            width: `${score}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {!loading && !result && !error && (
                    <div className="flex items-center gap-4 py-7">
                        <Search size={22} className="shrink-0 text-[#8296AA]" />
                        <div>
                            <p className="mb-1 text-[13px] font-semibold text-[#E5ECF4]">
                                No analysis has been run
                            </p>
                            <p className="mb-0 text-[12px] text-[#98A8BA]">
                                Check for potentially related help requests.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-[#94A5B7]">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p className="m-0!">
                    Similarity is a review aid, not evidence of fraud or
                    duplication. Analysis does not verify, reject, or change any
                    request.
                </p>
            </div>
        </section>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HelpRequestDetailsView({ request, onEdit, onRefresh }) {
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
        <main className="min-w-0 space-y-7 pb-8 font-sans">
            <Identity request={request} requester={requester} onEdit={onEdit} />

            <div className="grid min-w-0 items-start gap-8 2xl:grid-cols-[minmax(0,1fr)_280px] 2xl:gap-12">
                <div className="min-w-0 space-y-8">
                    <RequestInformation request={request} />

                    <section className="min-w-0 border-t border-[#344150] pt-7">
                        <SectionLabel>02 / Supporting material</SectionLabel>
                        <SectionTitle>
                            Evidence & supporting documents
                        </SectionTitle>
                        <p className="mt-2 mb-0 text-[12px] text-[#95A7BA]">
                            Submitted files, follow-up requests and responses.
                        </p>

                        <div className="mt-5">
                            <HelpRequestEvidenceSection
                                request={request}
                                onUpdated={onRefresh}
                            />
                        </div>
                    </section>

                    <DuplicateAnalysis
                        request={request}
                        result={duplicateAnalysis}
                        loading={duplicateAnalysisLoading}
                        error={duplicateAnalysisError}
                        onCheck={handleDuplicateCheck}
                    />

                    <AssignmentHistory assignments={assignments} />
                </div>

                <div className="min-w-0 2xl:sticky 2xl:top-5">
                    <RequestOverview
                        request={request}
                        requester={requester}
                        assignmentCount={assignments.length}
                    />
                </div>
            </div>
        </main>
    );
}
