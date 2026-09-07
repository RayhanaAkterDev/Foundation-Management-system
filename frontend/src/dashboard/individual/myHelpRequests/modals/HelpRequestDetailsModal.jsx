import React from 'react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    MapPin,
    X,
    XCircle,
} from 'lucide-react';

/* =====================================================
   STATUS HELPERS
===================================================== */

const getStatusInfo = (status) => {
    switch (status) {
        case 'verified':
            return {
                label: 'Verified',
                icon: CheckCircle2,
                className: 'text-emerald-700',
                dot: 'bg-emerald-500',
                soft: 'bg-emerald-50',
                line: 'bg-emerald-200',
                description: 'Your help request has been verified by SP Admin.',
            };

        case 'rejected':
            return {
                label: 'Rejected',
                icon: XCircle,
                className: 'text-red-700',
                dot: 'bg-red-500',
                soft: 'bg-red-50',
                line: 'bg-red-200',
                description: 'Your help request was rejected by SP Admin.',
            };

        case 'pending':
        default:
            return {
                label: 'Pending Review',
                icon: Clock3,
                className: 'text-amber-700',
                dot: 'bg-amber-500',
                soft: 'bg-amber-50',
                line: 'bg-amber-200',
                description:
                    'Your help request is waiting for review by SP Admin.',
            };
    }
};

const getUrgencyLabel = (urgency) => {
    const labels = {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        critical: 'Critical',
    };

    return labels[urgency] || urgency || 'Normal';
};

const getUrgencyClass = (urgency) => {
    const classes = {
        low: 'text-slate-600 bg-slate-100',
        normal: 'text-blue-700 bg-blue-50',
        high: 'text-orange-700 bg-orange-50',
        critical: 'text-red-700 bg-red-50',
    };

    return classes[urgency] || classes.normal;
};

const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return parsedDate.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

/* =====================================================
   ASSIGNMENT HELPERS
===================================================== */

const getAssignedOrganization = (request) => {
    return (
        request.organization ||
        request.assignedOrganization ||
        request.assignment?.organization ||
        request.assignment?.assignedOrganization ||
        null
    );
};

const getOrganizationName = (organization) => {
    if (!organization) return null;

    if (typeof organization === 'string') {
        return organization;
    }

    return (
        organization.name ||
        organization.organization_name ||
        organization.organizationName ||
        null
    );
};

const getCampaign = (request) => {
    return request.campaign || request.helpRequestCampaign || null;
};

const getCampaignUrl = (campaign) => {
    if (!campaign) return null;

    if (typeof campaign === 'string') {
        return campaign;
    }

    return (
        campaign.url ||
        campaign.link ||
        campaign.campaign_url ||
        campaign.campaignUrl ||
        null
    );
};

const getCampaignTitle = (campaign) => {
    if (!campaign || typeof campaign === 'string') {
        return 'View campaign';
    }

    return campaign.title || campaign.name || 'View campaign';
};

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

const InfoRow = ({ label, value, children }) => (
    <div className="flex min-w-0 items-start justify-between gap-4 py-3.5 sm:py-4">
        <span className="shrink-0 pt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
        </span>

        <div className="min-w-0 max-w-[68%] text-right">
            {children || (
                <span className="break-words text-[13px] font-semibold leading-5 text-slate-800">
                    {value || '—'}
                </span>
            )}
        </div>
    </div>
);

const SectionHeading = ({ number, children }) => (
    <div className="mb-5 flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-[9px] font-bold tracking-[0.15em] text-primary/45">
            {number}
        </span>

        <h3 className="min-w-0 break-words text-[12px] font-bold uppercase tracking-[0.12em] text-slate-700">
            {children}
        </h3>
    </div>
);

const WhatsNext = ({ children }) => (
    <section className="mt-7 sm:mt-8">
        <div className="rounded-xl border border-primary/10 bg-primary/[0.035] p-4 sm:p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-primary/60">
                What's next
            </p>

            <p className="mt-2 break-words text-[12px] leading-5 text-slate-600">
                {children}
            </p>
        </div>
    </section>
);

/* =====================================================
   COMPONENT
===================================================== */

const HelpRequestDetailModal = ({ isOpen, request, onClose }) => {
    if (!isOpen || !request) {
        return null;
    }

    const statusInfo = getStatusInfo(request.status);

    const assignedOrganization = getAssignedOrganization(request);
    const organizationName = getOrganizationName(assignedOrganization);

    const campaign = getCampaign(request);
    const campaignUrl = getCampaignUrl(campaign);
    const campaignTitle = getCampaignTitle(campaign);

    const isVerified = request.status === 'verified';
    const isRejected = request.status === 'rejected';
    const isAssigned = Boolean(organizationName);
    const hasCampaign = Boolean(campaignUrl);

    const submittedDate = formatDate(
        request.created_at || request.submittedDate,
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-sm sm:p-4 md:p-6">
            {/* BACKDROP */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* MODAL */}
            <div className="relative z-10 flex h-[calc(100dvh-1rem)] w-full max-w-[1080px] min-w-0 overflow-hidden rounded-2xl bg-[#f4f7f6] shadow-[0_35px_100px_rgba(15,23,42,0.32)] sm:h-[calc(100dvh-2rem)] sm:max-h-[920px] sm:rounded-[24px] md:h-auto md:max-h-[90vh]">
                {/* =================================================
                    LEFT RAIL
                ================================================== */}

                <aside className="relative hidden w-[255px] shrink-0 overflow-hidden bg-[#0f766e] lg:flex lg:flex-col">
                    {/* Decorative circles */}
                    <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full border border-white/[0.07]" />
                    <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full border border-white/[0.06]" />

                    <div className="relative flex h-full min-h-0 flex-col p-7">
                        {/* TOP */}
                        <div className="shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>

                                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/60">
                                    Help request
                                </span>
                            </div>

                            <p className="mt-3 break-words text-[11px] font-medium text-white/40">
                                Request #{request.id}
                            </p>
                        </div>

                        {/* STATUS TIMELINE */}
                        <div className="relative my-auto min-h-0 py-10">
                            <p className="mb-7 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                                Request status
                            </p>

                            <div className="relative pl-7">
                                <div
                                    className={`absolute bottom-2 left-[5px] top-2 w-px ${statusInfo.line}`}
                                />

                                {/* Current status */}
                                <div className="relative">
                                    <div
                                        className={`absolute -left-7 top-0 flex h-3 w-3 items-center justify-center rounded-full ${statusInfo.dot} ring-4 ring-[#0f766e]`}
                                    />

                                    <p className="text-[13px] font-bold text-white">
                                        {statusInfo.label}
                                    </p>

                                    <p className="mt-2 max-w-[165px] break-words text-[10px] leading-5 text-white/45">
                                        {statusInfo.description}
                                    </p>
                                </div>

                                {/* Submitted */}
                                <div className="relative mt-9">
                                    <div className="absolute -left-7 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-white/25 ring-4 ring-[#0f766e]">
                                        <span className="h-1 w-1 rounded-full bg-white/60" />
                                    </div>

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                                        Submitted
                                    </p>

                                    <p className="mt-1 text-[11px] text-white/60">
                                        {submittedDate}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM */}
                        <div className="shrink-0 border-t border-white/10 pt-5">
                            <div className="flex items-start gap-2.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f59e0b]" />

                                <p className="text-[9px] leading-5 text-white/35">
                                    Your request is part of the Stand For People
                                    community support system.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* =================================================
                    MAIN
                ================================================== */}

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    {/* TOP BAR */}
                    <header className="relative shrink-0 bg-white">
                        <div className="flex min-w-0 items-start justify-between gap-3 px-4 pb-6 pt-6 sm:gap-5 sm:px-6 sm:pb-8 sm:pt-8 md:px-8 lg:px-10 lg:pt-10">
                            <div className="min-w-0 flex-1">
                                <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                                        Request details
                                    </span>

                                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300" />

                                    <span className="break-all text-[9px] font-medium text-slate-400">
                                        #{request.id}
                                    </span>
                                </div>

                                <h2 className="max-w-[700px] break-words text-xl font-bold leading-[1.15] tracking-[-0.04em] text-text-primary sm:text-2xl">
                                    {request.title}
                                </h2>

                                <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:mt-4 sm:gap-x-5">
                                    <div className="flex min-w-0 max-w-full items-center gap-2 text-[10px] text-slate-400">
                                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                                        <span className="min-w-0 break-words">
                                            Submitted{' '}
                                            <strong className="font-semibold text-slate-500">
                                                {submittedDate}
                                            </strong>
                                        </span>
                                    </div>

                                    <div className="flex min-w-0 max-w-full items-center gap-2 text-[10px] text-slate-400">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                                        <span className="break-words font-semibold text-slate-500">
                                            {request.district || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 sm:h-10 sm:w-10"
                                aria-label="Close modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                        <div className="px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8 lg:px-10">
                            <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-10">
                                {/* =================================================
                                    PRIMARY CONTENT
                                ================================================== */}

                                <main className="min-w-0">
                                    {/* 01 — DESCRIPTION */}
                                    <section>
                                        <SectionHeading number="01">
                                            Your situation
                                        </SectionHeading>

                                        <div className="border-l-2 border-primary/20 pl-4 sm:pl-6">
                                            <p className="whitespace-pre-wrap break-words text-[14px] leading-7 text-slate-600 sm:text-[15px]">
                                                {request.description || '—'}
                                            </p>
                                        </div>
                                    </section>

                                    {/* 02 — VERIFICATION */}
                                    <section className="mt-8 border-t border-slate-200 pt-7 sm:mt-10 sm:pt-8">
                                        <SectionHeading number="02">
                                            Verification
                                        </SectionHeading>

                                        <div
                                            className={`rounded-xl p-4 sm:p-5 ${
                                                isRejected
                                                    ? 'bg-red-50'
                                                    : isVerified
                                                      ? 'bg-emerald-50'
                                                      : 'bg-amber-50'
                                            }`}
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                {isRejected ? (
                                                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                                                ) : isVerified ? (
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                ) : (
                                                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                                )}

                                                <div className="min-w-0">
                                                    <p
                                                        className={`break-words text-[12px] font-bold ${
                                                            isRejected
                                                                ? 'text-red-800'
                                                                : isVerified
                                                                  ? 'text-emerald-800'
                                                                  : 'text-amber-800'
                                                        }`}
                                                    >
                                                        {isRejected
                                                            ? 'Your request was not approved'
                                                            : isVerified
                                                              ? 'Your request has been verified'
                                                              : 'Your request is under review'}
                                                    </p>

                                                    <p
                                                        className={`mt-2 break-words text-[11px] leading-5 ${
                                                            isRejected
                                                                ? 'text-red-700/75'
                                                                : isVerified
                                                                  ? 'text-emerald-700/75'
                                                                  : 'text-amber-700/75'
                                                        }`}
                                                    >
                                                        {isRejected
                                                            ? 'Unfortunately, your help request did not meet the requirements for approval.'
                                                            : isVerified
                                                              ? 'SP Admin has reviewed and verified your help request. It can now move forward to the assistance stage.'
                                                              : 'Your request has been received successfully and is currently waiting for review by SP Admin.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* WHAT'S NEXT — PENDING */}
                                    {!isRejected && !isVerified && (
                                        <WhatsNext>
                                            Our admin team will complete the
                                            review soon. Once your request is
                                            verified, an organization will be
                                            assigned to assist with your case.
                                        </WhatsNext>
                                    )}

                                    {/* 03 — ORGANIZATION ASSIGNMENT */}
                                    {isVerified && isAssigned && (
                                        <section className="mt-8 border-t border-slate-200 pt-7 sm:mt-10 sm:pt-8">
                                            <SectionHeading number="03">
                                                Organization assignment
                                            </SectionHeading>

                                            <div className="rounded-xl bg-white p-4 shadow-[0_5px_20px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 sm:p-5">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                                            Assigned
                                                            organization
                                                        </p>

                                                        <p className="mt-1.5 break-words text-[14px] font-bold text-slate-800">
                                                            {organizationName}
                                                        </p>

                                                        <p className="mt-2 break-words text-[11px] leading-5 text-slate-500">
                                                            Your case has been
                                                            assigned to this
                                                            organization for
                                                            further assistance.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {/* WHAT'S NEXT — VERIFIED BUT NOT ASSIGNED */}
                                    {isVerified && !isAssigned && (
                                        <WhatsNext>
                                            Your request has been verified
                                            successfully. The next step is to
                                            connect your case with an
                                            organization that can provide the
                                            appropriate assistance.
                                        </WhatsNext>
                                    )}

                                    {/* WHAT'S NEXT — ASSIGNED, WAITING FOR CAMPAIGN */}
                                    {isVerified &&
                                        isAssigned &&
                                        !hasCampaign && (
                                            <WhatsNext>
                                                Your case is now with{' '}
                                                <strong className="font-semibold text-slate-700">
                                                    {organizationName}
                                                </strong>
                                                . A campaign will be created to
                                                help raise support for your
                                                case.
                                            </WhatsNext>
                                        )}

                                    {/* 04 — CAMPAIGN */}
                                    {isVerified &&
                                        isAssigned &&
                                        hasCampaign && (
                                            <section className="mt-8 border-t border-slate-200 pt-7 sm:mt-10 sm:pt-8">
                                                <SectionHeading number="04">
                                                    Campaign
                                                </SectionHeading>

                                                <div className="rounded-xl bg-white p-4 shadow-[0_5px_20px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 sm:p-5">
                                                    <div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                                                                Support campaign
                                                            </p>

                                                            <p className="mt-1.5 break-words text-[14px] font-bold text-slate-800">
                                                                {campaignTitle}
                                                            </p>

                                                            <p className="mt-2 break-words text-[11px] leading-5 text-slate-500">
                                                                A campaign has
                                                                been created for
                                                                your case. You
                                                                can view its
                                                                details and
                                                                follow the
                                                                support
                                                                progress.
                                                            </p>
                                                        </div>

                                                        <a
                                                            href={campaignUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 text-[10px] font-bold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 sm:w-auto sm:px-3.5"
                                                        >
                                                            <span className="hidden sm:inline">
                                                                View campaign
                                                            </span>

                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                </main>

                                {/* =================================================
                                    INFORMATION SIDEBAR
                                ================================================== */}

                                <aside className="min-w-0 border-t border-slate-200 pt-7 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                                    <div className="mb-3 sm:mb-4">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                            Request overview
                                        </p>
                                    </div>

                                    <div className="divide-y divide-slate-200/80">
                                        <InfoRow
                                            label="Category"
                                            value={request.category}
                                        />

                                        <InfoRow label="Urgency">
                                            <span
                                                className={`inline-flex max-w-full items-center gap-2 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${getUrgencyClass(
                                                    request.urgency,
                                                )}`}
                                            >
                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />

                                                <span className="break-words">
                                                    {getUrgencyLabel(
                                                        request.urgency,
                                                    )}
                                                </span>
                                            </span>
                                        </InfoRow>

                                        <InfoRow
                                            label="District"
                                            value={request.district}
                                        />

                                        {request.address && (
                                            <InfoRow
                                                label="Address"
                                                value={request.address}
                                            />
                                        )}

                                        <InfoRow
                                            label="Submitted"
                                            value={submittedDate}
                                        />

                                        {request.updated_at && (
                                            <InfoRow
                                                label="Updated"
                                                value={formatDate(
                                                    request.updated_at,
                                                )}
                                            />
                                        )}

                                        {isAssigned && (
                                            <InfoRow
                                                label="Assigned to"
                                                value={organizationName}
                                            />
                                        )}
                                    </div>

                                    {/* LOCATION */}
                                    {request.address && (
                                        <div className="mt-6 rounded-xl bg-slate-100/80 p-4 sm:mt-7">
                                            <div className="flex min-w-0 items-start gap-2.5">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                                        Assistance location
                                                    </p>

                                                    <p className="mt-1.5 break-words text-[11px] leading-5 text-slate-600">
                                                        {request.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </aside>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4 md:px-8 lg:px-10">
                        <div className="hidden items-center gap-2 sm:flex">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f59e0b]" />

                            <span className="text-[9px] font-medium text-slate-400">
                                Stand For People
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 w-full rounded-xl bg-primary px-7 text-[11px] font-bold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 sm:w-auto"
                        >
                            Close
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestDetailModal;
