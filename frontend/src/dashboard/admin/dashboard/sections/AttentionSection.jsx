import React from 'react';

import { CheckCircle2, ClipboardCheck, ShieldCheck } from 'lucide-react';

import QueueCard from '../components/QueueCard';
import RequestItem from '../components/RequestItem';
import SectionAction from '../components/SectionAction';
import SectionHeading from '../components/SectionHeading';
import VerificationItem from '../components/VerificationItem';

import { formatNumber } from '../utils/dashboardHelpers';

const AttentionSection = ({
    loading,
    pendingHelpRequests,
    pendingVerifications,
    pendingRequestCount,
    pendingVerificationCount,
    urgentRequestCount,
    onOpenRequests,
    onOpenVerification,
}) => {
    const requestCount = loading ? '—' : formatNumber(pendingRequestCount);

    const verificationCount = loading
        ? '—'
        : formatNumber(pendingVerificationCount);

    const priorityCount = loading ? '—' : formatNumber(urgentRequestCount);

    return (
        <section className="mt-14 sm:mt-16 lg:mt-20">
            {/* =================================================
                SECTION HEADER
            ================================================== */}
            <div className="mb-7 sm:mb-8">
                <SectionHeading
                    number="01"
                    eyebrow="REQUIRES ACTION"
                    title="Needs Attention"
                    description="Review the decisions and requests currently waiting for your attention."
                    action={
                        <SectionAction onClick={onOpenRequests}>
                            Open response desk
                        </SectionAction>
                    }
                />
            </div>

            {/* =================================================
                QUEUE WORKSPACE
            ================================================== */}
            <div className="grid min-w-0 lg:grid-cols-2 gap-6">
                {/* =================================================
                    HELP REQUESTS
                ================================================== */}
                <div className="min-w-0">
                    <QueueCard
                        icon={ClipboardCheck}
                        label="Review queue"
                        title="Help requests"
                        description="Submitted needs waiting for administrative review."
                        count={requestCount}
                        tone="amber"
                        actionLabel="Review all requests"
                        onAction={onOpenRequests}
                    >
                        <div className="mt-6 sm:mt-7">
                            {/* Queue heading */}
                            <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
                                <div className="min-w-0">
                                    <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                                        Latest requests
                                    </p>

                                    <p className="mt-1.5 font-jost text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                                        Requires administrative review
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="h-1.5 w-1.5 rounded-full bg-accent"
                                    />

                                    <span className="font-poppins text-[11px] font-semibold tracking-wide text-accent">
                                        {priorityCount} priority
                                    </span>
                                </div>
                            </div>

                            {/* Queue content */}
                            {loading ? (
                                <div className="divide-y divide-border/70">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="flex min-h-19 items-center gap-3.5 sm:min-h-21 sm:gap-4"
                                        >
                                            <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-background-alt sm:h-10 sm:w-10" />

                                            <div className="min-w-0 flex-1">
                                                <div className="h-3.5 w-[42%] animate-pulse rounded bg-background-alt" />

                                                <div className="mt-2.5 h-2.5 w-[65%] animate-pulse rounded bg-background-alt" />
                                            </div>

                                            <div className="hidden h-6 w-16 shrink-0 animate-pulse rounded-md bg-background-alt xs:block sm:w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : pendingHelpRequests.length > 0 ? (
                                <div className="divide-y divide-border/70">
                                    {pendingHelpRequests
                                        .slice(0, 3)
                                        .map((request, index) => (
                                            <RequestItem
                                                key={request?.id || index}
                                                request={request}
                                                onClick={onOpenRequests}
                                            />
                                        ))}
                                </div>
                            ) : (
                                <EmptyQueue
                                    icon={CheckCircle2}
                                    title="Review queue is clear"
                                    description="No help requests currently require an administrative decision."
                                />
                            )}
                        </div>
                    </QueueCard>
                </div>

                {/* =================================================
                    MOBILE DIVIDER
                    Desktop intentionally has NO divider.
                ================================================== */}
                <div
                    aria-hidden="true"
                    className="my-10 h-px bg-border/70 lg:hidden"
                />

                {/* =================================================
                    ORGANIZATION VERIFICATION
                ================================================== */}
                <div className="min-w-0">
                    <QueueCard
                        icon={ShieldCheck}
                        label="Trust queue"
                        title="Organization verification"
                        description="Partner organizations waiting for an administrative decision."
                        count={verificationCount}
                        tone="teal"
                        actionLabel="Review organizations"
                        onAction={onOpenVerification}
                    >
                        <div className="mt-6 sm:mt-7">
                            {/* Queue heading */}
                            <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
                                <div className="min-w-0">
                                    <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                                        Latest submissions
                                    </p>

                                    <p className="mt-1.5 font-jost text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                                        Review before granting access
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <span
                                        aria-hidden="true"
                                        className="h-1.5 w-1.5 rounded-full bg-primary"
                                    />

                                    <span className="font-poppins text-[11px] font-semibold tracking-wide text-primary">
                                        Trust &amp; access
                                    </span>
                                </div>
                            </div>

                            {/* Queue content */}
                            {loading ? (
                                <div className="divide-y divide-border/70">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="flex min-h-19 items-center gap-3.5 sm:min-h-21 sm:gap-4"
                                        >
                                            <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-background-alt sm:h-10 sm:w-10" />

                                            <div className="min-w-0 flex-1">
                                                <div className="h-3.5 w-[42%] animate-pulse rounded bg-background-alt" />

                                                <div className="mt-2.5 h-2.5 w-[65%] animate-pulse rounded bg-background-alt" />
                                            </div>

                                            <div className="hidden h-6 w-16 shrink-0 animate-pulse rounded-md bg-background-alt xs:block sm:w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : pendingVerifications.length > 0 ? (
                                <div className="divide-y divide-border/70">
                                    {pendingVerifications
                                        .slice(0, 3)
                                        .map((organization, index) => (
                                            <VerificationItem
                                                key={organization?.id || index}
                                                organization={organization}
                                                onClick={onOpenVerification}
                                            />
                                        ))}
                                </div>
                            ) : (
                                <EmptyQueue
                                    icon={CheckCircle2}
                                    title="Verification queue is clear"
                                    description="No organizations are currently waiting for verification."
                                />
                            )}
                        </div>
                    </QueueCard>
                </div>
            </div>
        </section>
    );
};

/* =========================================================
   EMPTY QUEUE
========================================================= */

const EmptyQueue = ({ icon: Icon, title, description }) => (
    <div className="flex min-h-45 items-center py-8 sm:min-h-50 sm:py-10">
        <div className="flex w-full items-start gap-3.5 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/[0.07] sm:h-11 sm:w-11">
                <Icon size={19} strokeWidth={1.8} className="text-primary" />
            </div>

            <div className="min-w-0 pt-0.5">
                <p className="font-jost text-[14px] font-semibold leading-5 text-text-primary sm:text-[15px]">
                    {title}
                </p>

                <p className="mt-1 max-w-97.5 font-jost text-[12.5px] leading-5 text-text-secondary sm:text-[13px] sm:leading-[1.55]">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

export default AttentionSection;
