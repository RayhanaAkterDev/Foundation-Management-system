import React from 'react';
import {
    AlertTriangle,
    Building2,
    ClipboardList,
    Megaphone,
    UsersRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import { formatNumber } from '../utils/dashboardHelpers';

/* =========================================================
   COLORS
========================================================= */

const QUEUE_COLORS = {
    urgent: '#E8A56E',
    organizations: '#58AFA2',
    volunteers: '#A998C8',
    campaigns: '#88A9D7',
};

/* =========================================================
   HELPERS
========================================================= */

const safeCount = (value) => {
    const number = Number(value);

    return Number.isFinite(number) ? Math.max(0, number) : 0;
};

/* =========================================================
   REVIEW ROW
========================================================= */

const ReviewRow = ({
    icon: Icon,
    title,
    count,
    color,
    loading,
    isFirst,
    isLast,
}) => {
    const hasItems = count > 0;

    return (
        <div className="group grid min-w-0 grid-cols-[20px_minmax(0,1fr)] gap-3 sm:gap-4">
            {/* TIMELINE COLUMN */}
            <div className="relative flex items-center justify-center">
                {/* CONNECTOR ABOVE DOT */}
                {!isFirst && (
                    <span
                        aria-hidden="true"
                        className="
                            absolute left-1/2 top-0
                            h-1/2 w-px
                            -translate-x-1/2
                            bg-[#3A4858]
                        "
                    />
                )}

                {/* CONNECTOR BELOW DOT */}
                {!isLast && (
                    <span
                        aria-hidden="true"
                        className="
                            absolute bottom-0 left-1/2
                            h-1/2 w-px
                            -translate-x-1/2
                            bg-[#3A4858]
                        "
                    />
                )}

                {/* TIMELINE DOT */}
                <span
                    className="
                        relative z-10
                        h-[10px] w-[10px]
                        shrink-0 rounded-full
                        ring-[4px] ring-[#17212B]
                    "
                    style={{
                        backgroundColor: hasItems ? color : '#59697C',
                    }}
                />
            </div>

            {/* ROW CONTENT */}
            <div
                className={`
                    flex min-w-0 items-center
                    justify-between gap-3
                    py-[18px] sm:gap-5
                    ${!isLast ? 'border-b border-[#303B47]/65' : ''}
                `}
            >
                {/* LABEL */}
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-[5px]
                            bg-[#293644]
                            text-[#A9B7C6]
                            transition-colors duration-200
                            group-hover:bg-[#334252]
                        "
                    >
                        <Icon size={17} strokeWidth={1.8} />
                    </div>

                    <h3
                        className="
                            min-w-0
                            text-[13px] font-semibold
                            leading-5 text-[#EDF1F5]!
                            sm:text-[14px]
                        "
                    >
                        {title}
                    </h3>
                </div>

                {/* COUNT */}
                <div className="flex shrink-0 items-center gap-3">
                    <span
                        className="
                            text-[25px] font-semibold
                            leading-none tabular-nums
                        "
                        style={{
                            color: hasItems ? '#EEF1F5' : '#8792A1',
                        }}
                    >
                        {loading ? '—' : formatNumber(count)}
                    </span>

                    <span
                        className="
                            h-6 w-[2px]
                            rounded-full
                        "
                        style={{
                            backgroundColor: hasItems ? color : '#526173',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   WORKLOAD RING
========================================================= */

const WorkloadRing = ({ loading, total, activeQueues, items }) => {
    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    const gap = 5;

    const activeItems = items.filter((item) => item.count > 0);

    let currentOffset = 0;

    const segments = activeItems.map((item) => {
        const segmentLength =
            total > 0 ? (item.count / total) * circumference : 0;

        const segment = {
            ...item,
            offset: currentOffset,
            length: Math.max(0, segmentLength - gap),
        };

        currentOffset += segmentLength;

        return segment;
    });

    return (
        <div
            className="
                flex h-full items-center
                justify-center gap-5
                px-5 py-6
                md:flex-col md:gap-4
                md:px-6 md:py-7
            "
        >
            {/* PROGRESS RING */}
            <div
                className="
                    relative flex h-[112px] w-[112px]
                    shrink-0 items-center
                    justify-center
                    sm:h-[128px] sm:w-[128px]
                    md:h-[146px] md:w-[146px]
                "
            >
                <svg
                    viewBox="0 0 160 160"
                    className="
                        absolute inset-0
                        h-full w-full
                        -rotate-90
                    "
                    aria-hidden="true"
                >
                    {/* BACKGROUND TRACK */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#3A4857"
                        strokeWidth="8"
                    />

                    {/* COLORED SEGMENTS */}
                    {!loading &&
                        segments.map((segment) => (
                            <circle
                                key={segment.title}
                                cx="80"
                                cy="80"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="8"
                                strokeLinecap="butt"
                                strokeDasharray={`
                                    ${segment.length}
                                    ${circumference}
                                `}
                                strokeDashoffset={-segment.offset}
                                className="
                                    transition-all
                                    duration-500
                                "
                            />
                        ))}
                </svg>

                {/* CENTER COUNT */}
                <div className="relative text-center">
                    <p
                        className="
                            text-[35px] font-semibold
                            leading-none
                            tracking-[-0.05em]
                            tabular-nums
                            text-[#F0F3F7]
                            sm:text-[40px]
                            md:text-[43px]
                        "
                    >
                        {loading ? '—' : formatNumber(total)}
                    </p>

                    <p
                        className="
                            mt-1.5 text-[9px]
                            font-medium uppercase
                            tracking-[0.06em]
                            text-[#A5B1C0]
                        "
                    >
                        Needs attention
                    </p>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="min-w-0 text-left md:text-center">
                <p
                    className="
                        text-[13px] font-semibold
                        text-[#E5EAF0]
                    "
                >
                    {loading
                        ? 'Review workload'
                        : total === 0
                          ? 'No pending decisions'
                          : `${activeQueues} active review ${
                                activeQueues === 1 ? 'queue' : 'queues'
                            }`}
                </p>

                <p
                    className="
                        mt-1 text-[12px]
                        leading-5 text-[#9BA9B9]
                    "
                >
                    Across four categories
                </p>
            </div>
        </div>
    );
};

/* =========================================================
   DASHBOARD HERO
========================================================= */

const DashboardHero = ({
    loading = false,
    urgentRequestCount = 0,
    pendingVerificationCount = 0,
    pendingCampaignCount = 0,
    pendingVolunteerCount = 0,
}) => {
    const urgent = safeCount(urgentRequestCount);

    const organizations = safeCount(pendingVerificationCount);

    const volunteers = safeCount(pendingVolunteerCount);

    const campaigns = safeCount(pendingCampaignCount);

    const total = urgent + organizations + volunteers + campaigns;

    const reviewItems = [
        {
            icon: AlertTriangle,
            title: 'Urgent help requests',
            count: urgent,
            color: QUEUE_COLORS.urgent,
        },
        {
            icon: Building2,
            title: 'Organization verification',
            count: organizations,
            color: QUEUE_COLORS.organizations,
        },
        {
            icon: UsersRound,
            title: 'Volunteer applications',
            count: volunteers,
            color: QUEUE_COLORS.volunteers,
        },
        {
            icon: Megaphone,
            title: 'Campaign reviews',
            count: campaigns,
            color: QUEUE_COLORS.campaigns,
        },
    ];

    const activeQueues = reviewItems.filter((item) => item.count > 0).length;

    return (
        <div className="min-w-0">
            {/* SHARED PAGE HEADER */}
            <PageHeader
                title="Operations overview"
                subtitle="Monitor pending reviews, priority humanitarian requests, and the decisions that need your attention across Stand For People."
            />

            {/* OPERATIONAL SNAPSHOT */}
            <section
                className="
                    min-w-0 overflow-hidden
                    rounded-[7px]
                    border border-[#34404D]
                    bg-[#1B242E]
                "
            >
                {/* SNAPSHOT HEADER */}
                <div
                    className="
                        flex flex-wrap items-center
                        justify-between gap-3
                        border-b border-[#34404D]
                        px-5 py-4
                        sm:px-6
                    "
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div
                            className="
                                flex h-8 w-8
                                shrink-0 items-center
                                justify-center
                                rounded-[5px]
                                bg-[#293744]
                                text-[#A9B7C6]
                            "
                        >
                            <ClipboardList size={16} strokeWidth={1.8} />
                        </div>

                        <h2
                            className="
                                text-[16px] font-semibold
                                leading-6 text-[#EEF1F5]!
                            "
                        >
                            Operational Snapshot
                        </h2>
                    </div>

                    {/* STATUS */}
                    <div className="flex items-center gap-2">
                        <span
                            className={`
                                h-1.5 w-1.5
                                rounded-full
                                ${
                                    !loading && total > 0
                                        ? 'bg-[#E8A56E]'
                                        : 'bg-[#58AFA2]'
                                }
                            `}
                        />

                        <span
                            className="
                                text-[12px] font-medium
                                text-[#B0BCCB]
                            "
                        >
                            {loading
                                ? 'Checking workload'
                                : total === 0
                                  ? 'All queues clear'
                                  : `${formatNumber(total)} awaiting review`}
                        </span>
                    </div>
                </div>

                {/* SNAPSHOT CONTENT */}
                <div
                    className="
                        grid min-w-0
                        md:grid-cols-[260px_minmax(0,1fr)]
                        lg:grid-cols-[300px_minmax(0,1fr)]
                    "
                >
                    {/* LEFT: WORKLOAD RING */}
                    <div
                        className="
                            bg-[#202C38]
                            md:border-r
                            md:border-[#34404D]
                        "
                    >
                        <WorkloadRing
                            loading={loading}
                            total={total}
                            activeQueues={activeQueues}
                            items={reviewItems}
                        />
                    </div>

                    {/* RIGHT: FIXED TIMELINE */}
                    <div
                        className="
                            min-w-0 bg-[#17212B]
                            px-4 py-2
                            sm:px-6
                            lg:px-7
                        "
                    >
                        {reviewItems.map((item, index) => (
                            <ReviewRow
                                key={item.title}
                                {...item}
                                loading={loading}
                                isFirst={index === 0}
                                isLast={index === reviewItems.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardHero;
