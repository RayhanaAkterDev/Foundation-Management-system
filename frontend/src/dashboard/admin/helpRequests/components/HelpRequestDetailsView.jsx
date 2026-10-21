import React from 'react';
import {
    ArrowLeft,
    Pencil,
    FileText,
    UserRound,
    Mail,
    Phone,
    MapPin,
    Building2,
    ShieldCheck,
    AlertCircle,
    Clock3,
} from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';

const show = (value) =>
    value === null || value === undefined || value === '' ? '—' : String(value);
const titleCase = (value) =>
    show(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
const dateText = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          });
};

function SectionTitle({ icon: Icon, title, extra }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29323E] pb-4">
            <div className="flex min-w-0 items-center gap-3">
                <Icon
                    size={18}
                    strokeWidth={1.65}
                    className="shrink-0 text-[#93A3B5]"
                />
                <h2 className="text-[17px] font-semibold! tracking-tight text-[#E6ECF3]! sm:text-[18px]">
                    {title}
                </h2>
            </div>
            {extra}
        </div>
    );
}

function Field({ icon: Icon, label, value, wide = false }) {
    return (
        <div className={`min-w-0 py-4 ${wide ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 text-[11px] font-medium! uppercase tracking-[0.075em] text-[#8290A1]!">
                <Icon size={14} strokeWidth={1.7} className="shrink-0" />
                {label}
            </div>
            <p className="mt-2 break-words text-[14px] font-medium! leading-6 text-[#DCE4ED]!">
                {show(value)}
            </p>
        </div>
    );
}

function MetaRow({ label, children }) {
    return (
        <div className="flex min-w-0 items-start justify-between gap-4 py-4">
            <span className="shrink-0 text-[12px] text-[#92A0B0]!">
                {label}
            </span>
            <div className="min-w-0 break-words text-right text-[12px] font-medium! text-[#D7E0EA]!">
                {children}
            </div>
        </div>
    );
}

function getAssignments(request) {
    if (Array.isArray(request.assignments)) return request.assignments;
    if (Array.isArray(request.help_request_assignments))
        return request.help_request_assignments;
    if (Array.isArray(request.helpRequestAssignments))
        return request.helpRequestAssignments;
    return request.assignment ? [request.assignment] : [];
}

export default function HelpRequestDetailsView({ request, onEdit, onBack }) {
    const requester = request.user || request.requester || {};
    const requesterName =
        requester.name ||
        requester.full_name ||
        request.requesterName ||
        'Unknown requester';
    const requesterEmail = requester.email || request.requesterEmail;
    const requesterPhone = requester.phone || request.phone;
    const assignments = getAssignments(request);
    const urgency = request.urgency || request.priority;
    const verification = request.verification_status;
    const address = request.address || request.location;

    return (
        <main className="min-w-0 space-y-10 pb-10 font-sans lg:space-y-12">
            <PageHeader
                title="Help Request Details"
                subtitle="Request information, verification and assistance assignments."
                action={
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-10 items-center justify-center gap-2 border border-[#343E4B] px-3.5 text-[12px] font-medium text-[#B8C2CF] transition-colors hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#F1F5F9]"
                    >
                        <ArrowLeft size={15} strokeWidth={1.8} /> All Help
                        Requests
                    </button>
                }
            />

            <div className="space-y-6 sm:space-y-7">
                {/* REQUEST IDENTITY */}
                <section className="relative min-w-0 overflow-hidden border border-[#29323E] bg-[#101720]">
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-[3px] bg-[#75879B]"
                    />
                    <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#394656] bg-[#222E3B] sm:h-16 sm:w-16">
                                <FileText
                                    size={26}
                                    strokeWidth={1.45}
                                    className="text-[#BAC8D6]"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="mb-1.5 text-[10px] font-semibold! uppercase tracking-[0.12em] text-[#8292A4]!">
                                    Help request #{show(request.id)}
                                </p>
                                <h2 className="max-w-3xl break-words text-[21px] font-semibold! leading-snug tracking-tight text-[#E9EEF4]! sm:text-[25px]">
                                    {request.title || 'Untitled help request'}
                                </h2>
                                <p className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[#9BA8B8]! sm:text-[13px]">
                                    <UserRound size={14} className="shrink-0" />
                                    <span>{requesterName}</span>
                                    {requesterEmail && (
                                        <>
                                            <span className="text-[#586779]">
                                                ·
                                            </span>
                                            <span className="break-all">
                                                {requesterEmail}
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                            <StatusBadge status={request.status || 'pending'} />
                            <button
                                type="button"
                                onClick={onEdit}
                                className="inline-flex h-9 items-center justify-center gap-2 border border-[#465365] bg-[#263343] px-3.5 text-[12px] font-semibold text-[#E7EDF4] transition-colors hover:bg-[#344457]"
                            >
                                <Pencil size={14} /> Edit Request
                            </button>
                        </div>
                    </div>
                </section>

                {/* PRIMARY INFORMATION */}
                <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)]">
                    <div className="min-w-0 space-y-6">
                        <section className="min-w-0 border border-[#29323E] bg-[#0E1219] px-5 py-5 sm:px-7 sm:py-6">
                            <SectionTitle
                                icon={FileText}
                                title="About this request"
                            />
                            <p className="mt-5 whitespace-pre-wrap break-words text-[14px] leading-7 text-[#B9C5D1]!">
                                {request.description ||
                                    'No description provided.'}
                            </p>
                        </section>

                        <section className="min-w-0 border border-[#29323E] bg-[#0E1219] px-5 py-5 sm:px-7 sm:py-6">
                            <SectionTitle
                                icon={UserRound}
                                title="Requester information"
                            />
                            <div className="mt-2 grid min-w-0 grid-cols-1 gap-x-8 sm:grid-cols-2">
                                <Field
                                    icon={UserRound}
                                    label="Full name"
                                    value={requesterName}
                                />
                                <Field
                                    icon={Mail}
                                    label="Email address"
                                    value={requesterEmail}
                                />
                                <Field
                                    icon={Phone}
                                    label="Phone number"
                                    value={requesterPhone}
                                />
                                <Field
                                    icon={MapPin}
                                    label="District"
                                    value={request.district}
                                />
                                <Field
                                    icon={MapPin}
                                    label="Address"
                                    value={address}
                                    wide
                                />
                            </div>
                        </section>
                    </div>

                    <aside className="min-w-0 border border-[#29323E] bg-[#0E1219] px-5 py-5 sm:px-6 sm:py-6">
                        <SectionTitle
                            icon={ShieldCheck}
                            title="Request overview"
                        />
                        <div className="divide-y divide-[#27313D]">
                            <MetaRow label="Request ID">
                                #{show(request.id)}
                            </MetaRow>
                            <MetaRow label="Status">
                                <StatusBadge
                                    status={request.status || 'pending'}
                                />
                            </MetaRow>
                            <MetaRow label="Verification">
                                <StatusBadge
                                    status={verification || 'pending'}
                                />
                            </MetaRow>
                            <MetaRow label="Category">
                                {titleCase(request.category)}
                            </MetaRow>
                            <MetaRow label="Urgency">
                                {titleCase(urgency)}
                            </MetaRow>
                            <MetaRow label="Submitted">
                                {dateText(request.created_at)}
                            </MetaRow>
                            <MetaRow label="Last updated">
                                {dateText(request.updated_at)}
                            </MetaRow>
                            <MetaRow label="Assignments">
                                <span className="text-[16px] font-semibold! tabular-nums text-[#E7EDF4]!">
                                    {assignments.length}
                                </span>
                            </MetaRow>
                        </div>
                        {request.verification_note && (
                            <div className="mt-3 border-t border-[#29323E] pt-5">
                                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#CDD7E2]">
                                    <AlertCircle
                                        size={15}
                                        className="text-[#A5B3C2]"
                                    />{' '}
                                    Verification note
                                </div>
                                <p className="mt-2 whitespace-pre-wrap break-words text-[12px] leading-6 text-[#AAB8C7]">
                                    {request.verification_note}
                                </p>
                            </div>
                        )}
                    </aside>
                </div>

                {/* ASSIGNMENT HISTORY */}
                <section className="min-w-0 pt-3 sm:pt-5">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-[20px] font-semibold! tracking-[-0.02em] text-[#EEF1F5]!">
                                Assignment history
                            </h2>
                            <p className="mt-1.5 text-[12px] text-[#8792A1]">
                                Organizations and teams connected to this
                                request.
                            </p>
                        </div>
                        <span className="text-[12px] tabular-nums text-[#96A4B4]!">
                            {assignments.length}{' '}
                            {assignments.length === 1
                                ? 'assignment'
                                : 'assignments'}
                        </span>
                    </div>
                    <div className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
                        {assignments.length === 0 ? (
                            <div className="flex min-h-40 flex-col items-center justify-center gap-2 px-5 py-8 text-center">
                                <Building2
                                    size={21}
                                    strokeWidth={1.5}
                                    className="text-[#728094]"
                                />
                                <p className="text-[13px] font-medium text-[#D5DEE9]">
                                    No assignments recorded
                                </p>
                                <p className="text-[12px] text-[#8792A1]">
                                    This help request has not been assigned yet.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#29323E]">
                                {assignments.map((assignment, index) => {
                                    const org =
                                        assignment.organization?.name ||
                                        assignment.organization_name ||
                                        assignment.organizationName ||
                                        assignment.organization_user?.name ||
                                        assignment.organizationUser?.name ||
                                        'Assignment';
                                    return (
                                        <div
                                            key={assignment.id ?? index}
                                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#35404E] bg-[#1A222D]">
                                                    <Building2
                                                        size={16}
                                                        className="text-[#9EADBD]"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="break-words text-[13px] font-semibold text-[#DCE5EF]">
                                                        {org}
                                                    </p>
                                                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#8998A9]">
                                                        <Clock3 size={12} />{' '}
                                                        {dateText(
                                                            assignment.assigned_at ||
                                                                assignment.created_at,
                                                        )}
                                                        {assignment.id !=
                                                            null && (
                                                            <span>
                                                                · Assignment #
                                                                {assignment.id}
                                                            </span>
                                                        )}
                                                    </p>
                                                    {assignment.rejection_note && (
                                                        <p className="mt-2 break-words text-[12px] leading-5 text-[#D2A3A3]">
                                                            {
                                                                assignment.rejection_note
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="shrink-0 self-start sm:self-center">
                                                <StatusBadge
                                                    status={
                                                        assignment.status ||
                                                        'pending'
                                                    }
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
