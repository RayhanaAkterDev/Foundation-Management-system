import {
    Activity,
    ArrowRight,
    BriefcaseBusiness,
    Check,
    ChevronRight,
    Clock3,
    FileText,
    MapPin,
    MessageSquareText,
    RotateCcw,
    ShieldCheck,
    UserRound,
    Users,
    X,
} from 'lucide-react';

import { formatCurrency } from './helpRequestUtils';
import UrgencyBadge from './UrgencyBadge';

const DrawerSection = ({ eyebrow, title, icon: Icon, children }) => (
    <section className="mb-11">
        <div className="mb-5 flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center bg-[#e5f3f0] text-primary">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
            </div>

            <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#8d999e]">
                    {eyebrow}
                </p>

                <h3 className="mt-1 text-[14px] font-bold tracking-[-0.015em] text-[#3a4c52]">
                    {title}
                </h3>
            </div>
        </div>

        {children}
    </section>
);

const DrawerValue = ({ label, value, accent = false }) => (
    <div className="border-b border-r border-[#e3e9eb] px-6 py-5 transition hover:bg-[#fbfcfc]">
        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#929da2]">
            {label}
        </p>

        <p
            className={`mt-2 text-[13px] font-semibold ${
                accent ? 'text-primary' : 'text-[#46585e]'
            }`}
        >
            {value}
        </p>
    </div>
);

const ManagementAction = ({
    icon: Icon,
    title,
    description,
    danger = false,
}) => (
    <button
        type="button"
        className="group flex w-full items-center gap-5 px-6 py-5 text-left transition hover:bg-[#f8fafb]"
    >
        <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center ${
                danger
                    ? 'bg-[#f9ecea] text-[#ad554b]'
                    : 'bg-[#e5f3f0] text-primary'
            }`}
        >
            <Icon className="h-4 w-4" strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
            <p
                className={`text-[12px] font-bold ${
                    danger ? 'text-[#955149]' : 'text-[#40535a]'
                }`}
            >
                {title}
            </p>

            <p className="mt-1.5 text-[10px] leading-5 text-[#8a969b]">
                {description}
            </p>
        </div>

        <ChevronRight
            className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                danger ? 'text-[#c49b94]' : 'text-[#a0aaae]'
            }`}
        />
    </button>
);

const DrawerFooter = ({
    request,
    onClose,
    onAction,
    actionLoading,
}) => {
    if (request.status === 'pending') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] font-bold text-[#7d898e] transition hover:text-[#31444a]"
                >
                    Close
                </button>

                <div className="flex gap-2.5">
                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => onAction(request, 'reject')}
                        className="border border-[#d8e1e4] bg-white px-4 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Decline
                    </button>

                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => onAction(request, 'accept')}
                        className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {actionLoading
                            ? 'Processing...'
                            : 'Accept assignment'}

                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    if (request.status === 'assigned') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] font-bold text-[#7d898e] transition hover:text-[#31444a]"
                >
                    Close
                </button>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover"
                >
                    Start assistance
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        );
    }

    if (request.status === 'active') {
        return (
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] font-bold text-[#7d898e] transition hover:text-[#31444a]"
                >
                    Close
                </button>

                <div className="flex gap-2.5">
                    <button
                        type="button"
                        className="border border-[#d8e1e4] bg-white px-4 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb]"
                    >
                        Add update
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-bold text-white shadow-[0_5px_14px_rgba(15,118,110,0.12)] transition hover:bg-primary-hover"
                    >
                        Complete case
                        <Check className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="border border-[#d8e1e4] bg-white px-5 py-2.5 text-[10px] font-bold text-[#64747a] transition hover:bg-[#f8fafb]"
            >
                Close review
            </button>
        </div>
    );
};

const CaseReviewDrawer = ({
    request,
    onClose,
    onAction,
    actionLoading,
    statusConfig,
}) => {
    if (!request) {
        return null;
    }

    const config =
        statusConfig[request.status] || statusConfig.pending;

    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close case review"
                onClick={onClose}
                className="absolute inset-0 bg-text-primary/55 backdrop-blur-0.75"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-175 flex-col bg-[#eef3f6] shadow-[-30px_0_85px_rgba(15,23,42,0.21)]">
                {/* DRAWER HEADER */}

                <header className="relative shrink-0 overflow-hidden bg-primary px-6 py-7 text-white sm:px-9 sm:py-8">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full border-42 border-white/4.5" />

                        <div className="absolute bottom-0 right-[28%] h-px w-45 bg-white/10" />
                    </div>

                    <div className="relative flex items-start justify-between gap-6">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                <span>
                                    CASE HR-
                                    {String(
                                        request.helpRequestId ||
                                            request.id,
                                    ).padStart(4, '0')}
                                </span>

                                <span className="h-1 w-1 rounded-full bg-white/30" />

                                <span className="text-white/80">
                                    {config.label}
                                </span>
                            </div>

                            <h2 className="mt-4 max-w-xl text-[27px] font-semibold leading-[1.13] tracking-[-0.045em] sm:text-[32px]">
                                {request.title}
                            </h2>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <UrgencyBadge
                                    urgency={request.urgency}
                                    dark
                                />

                                <span className="text-[10px] text-white/45">
                                    Submitted{' '}
                                    <span className="text-white/75">
                                        {request.submitted}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/[0.14] bg-white/3 text-white/60 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                {/* CONTENT */}

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-9 sm:px-8 sm:py-10">
                    {request.status === 'pending' && (
                        <section className="mb-11 border border-[#ead08b] bg-[#fffaf0]">
                            <div className="flex items-start gap-5 border-l-4 border-accent px-6 py-6">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fff0c7] text-[#ad7508]">
                                    <Clock3 className="h-4 w-4" />
                                </div>

                                <div>
                                    <h3 className="text-[14px] font-bold text-[#513e19]">
                                        Your decision is required
                                    </h3>

                                    <p className="mt-2 text-[11px] leading-6 text-[#7e6e50]">
                                        Accepting this assignment makes your
                                        organization responsible for providing
                                        the requested support.
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2.5">
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                onAction(
                                                    request,
                                                    'accept',
                                                )
                                            }
                                            className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Check className="h-3.5 w-3.5" />

                                            {actionLoading
                                                ? 'Processing...'
                                                : 'Accept assignment'}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                onAction(
                                                    request,
                                                    'reject',
                                                )
                                            }
                                            className="inline-flex items-center gap-2 border border-[#e4d7b9] bg-white px-4 py-2.5 text-[10px] font-bold text-[#705e36] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {request.status === 'active' && (
                        <section className="mb-11 border border-[#cce4df] bg-white">
                            <div className="flex items-start gap-5 border-l-4 border-primary px-6 py-6">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#e5f3f0] text-primary">
                                    <Activity className="h-4 w-4" />
                                </div>

                                <div>
                                    <h3 className="text-[14px] font-bold text-[#155b55]">
                                        Assistance is in progress
                                    </h3>

                                    <p className="mt-2 text-[11px] leading-6 text-[#5f7e78]">
                                        Continue recording meaningful updates
                                        until support has been completed.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    <DrawerSection
                        eyebrow="Case overview"
                        title="Key information"
                        icon={FileText}
                    >
                        <div className="grid overflow-hidden border border-[#dce5e8] bg-white shadow-[0_5px_18px_rgba(25,52,60,0.025)] sm:grid-cols-2">
                            <DrawerValue
                                label="Amount needed"
                                value={formatCurrency(
                                    request.amountNeeded,
                                )}
                                accent
                            />

                            <DrawerValue
                                label="People affected"
                                value={
                                    request.peopleAffected ??
                                    'Not provided'
                                }
                            />

                            <DrawerValue
                                label="Category"
                                value={request.category}
                            />

                            <DrawerValue
                                label="Support"
                                value={request.supportType}
                            />

                            <DrawerValue
                                label="District"
                                value={request.district}
                            />

                            <DrawerValue
                                label="Received"
                                value={request.assignmentAge}
                            />
                        </div>
                    </DrawerSection>

                    <DrawerSection
                        eyebrow="Request"
                        title="Why support is needed"
                        icon={MessageSquareText}
                    >
                        <div className="border border-[#dce5e8] border-l-4 border-l-primary bg-white px-6 py-6 shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                            <p className="text-[12px] leading-7 text-[#52636a]">
                                {request.description}
                            </p>
                        </div>
                    </DrawerSection>

                    <DrawerSection
                        eyebrow="Requester"
                        title="Person receiving support"
                        icon={UserRound}
                    >
                        <div className="flex items-center gap-5 border border-[#dce5e8] bg-white px-6 py-6 shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                            <div className="relative flex h-13 w-13 shrink-0 items-center justify-center bg-[#e5f3f0] text-primary">
                                <UserRound className="h-5 w-5" />

                                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white bg-[#75bdb2]" />
                            </div>

                            <div>
                                <p className="text-[13px] font-bold text-[#33464c]">
                                    {request.individual}
                                </p>

                                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#89969b]">
                                    <MapPin className="h-3.5 w-3.5" />

                                    {request.location}
                                </p>
                            </div>
                        </div>
                    </DrawerSection>

                    <DrawerSection
                        eyebrow="Administration"
                        title="Assignment context"
                        icon={BriefcaseBusiness}
                    >
                        <div className="border border-[#cfe1dd] bg-[#f5faf9] px-6 py-6">
                            <div className="flex items-start gap-3.5">
                                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6d9189]" />

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#71857f]">
                                        Assignment note
                                    </p>

                                    <p className="mt-2.5 text-[12px] leading-7 text-[#4d635c]">
                                        {request.assignmentNote}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DrawerSection>

                    {[
                        'active',
                        'assigned',
                        'completed',
                        'withdrawal',
                    ].includes(request.status) && (
                        <DrawerSection
                            eyebrow="Progress"
                            title="Assistance journey"
                            icon={Activity}
                        >
                            <div className="border border-[#dce5e8] bg-white px-6 py-6 shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                                <div className="flex items-end justify-between gap-5">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8c989d]">
                                            Completion
                                        </p>

                                        <p className="mt-2 text-[39px] font-semibold tracking-[-0.055em] text-[#203d39]">
                                            {request.progress ?? 0}

                                            <span className="ml-1 text-4 text-[#91a19f]">
                                                %
                                            </span>
                                        </p>
                                    </div>

                                    <p className="max-w-52.5 text-right text-[10px] leading-5 text-[#8c989d]">
                                        {request.lastUpdate}
                                    </p>
                                </div>

                                <div className="mt-6 h-2 overflow-hidden bg-[#e3eaec]">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${
                                                request.progress ?? 0
                                            }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </DrawerSection>
                    )}

                    {request.status === 'active' && (
                        <DrawerSection
                            eyebrow="Case management"
                            title="Manage this case"
                            icon={ShieldCheck}
                        >
                            <div className="divide-y divide-[#dce5e8] border border-[#dce5e8] bg-white shadow-[0_5px_18px_rgba(25,52,60,0.025)]">
                                <ManagementAction
                                    icon={Users}
                                    title="Request additional support"
                                    description="Ask administration for volunteers or additional resources."
                                />

                                <ManagementAction
                                    icon={RotateCcw}
                                    title="Request withdrawal"
                                    description="Use when your organization can no longer continue this case."
                                    danger
                                />
                            </div>
                        </DrawerSection>
                    )}
                </div>

                {/* FOOTER */}

                <footer className="shrink-0 border-t border-[#d8e2e5] bg-white px-5 py-5 shadow-[0_-5px_18px_rgba(25,52,60,0.025)] sm:px-8">
                    <DrawerFooter
                        request={request}
                        onClose={onClose}
                        onAction={onAction}
                        actionLoading={actionLoading}
                    />
                </footer>
            </aside>
        </div>
    );
};

export default CaseReviewDrawer;