import React from 'react';

import { Activity, Clock3 } from 'lucide-react';

import ActivityFeed from '@/components/dashboard/ActivityFeed';

import SectionHeading from '../components/SectionHeading';

const ActivitySection = ({ recentActivity }) => (
    <section className="mt-14 pb-10 sm:mt-16 lg:mt-20">
        <SectionHeading
            number="05"
            eyebrow="Audit trail"
            title="What changed recently"
            description="A record of the latest administrative activity across Stand For People."
            action={
                <div className="hidden items-center gap-2 sm:flex">
                    <span className="relative flex h-2 w-2 items-center justify-center">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-primary/25" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>

                    <span className="font-poppins text-[9px] font-semibold uppercase tracking-[0.16em] text-text-secondary">
                        Live record
                    </span>
                </div>
            }
        />

        <div className="mt-8 min-w-0 sm:mt-9">
            {recentActivity?.length > 0 ? (
                <div className="min-w-0">
                    {/* =================================================
                        ACTIVITY HEADER
                    ================================================== */}
                    <div
                        className="
                            flex min-w-0 flex-col gap-4
                            border-y border-border
                            bg-background-alt/35
                            px-5 py-4
                            sm:flex-row sm:items-center sm:justify-between
                            sm:px-6 sm:py-4
                            lg:px-7
                        "
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className="
                                    flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    border border-primary/15
                                    bg-primary/[0.07]
                                "
                            >
                                <Activity
                                    size={15}
                                    strokeWidth={1.7}
                                    className="text-primary"
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="
                                            font-poppins
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.15em]
                                            text-text-primary
                                        "
                                    >
                                        Administrative activity
                                    </span>

                                    <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />

                                    <span className="hidden font-jost text-[10px] text-text-secondary sm:block">
                                        Latest platform actions
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                flex w-fit items-center gap-2
                                border border-border
                                bg-surface
                                px-3 py-1.5
                            "
                        >
                            <Clock3
                                size={12}
                                strokeWidth={1.6}
                                className="text-text-secondary"
                            />

                            <span className="font-jost text-[10px] font-medium text-text-secondary">
                                {recentActivity.length} recent
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        ACTIVITY FEED
                    ================================================== */}
                    <div
                        className="
                            min-w-0
                            border-x border-b border-border
                            bg-surface
                        "
                    >
                        <ActivityFeed activities={recentActivity} />
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================== */}
                    <div
                        className="
                            flex items-center gap-2
                            border-b border-border
                            px-5 py-3
                            sm:px-6
                            lg:px-7
                        "
                    >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-primary/70" />

                        <span className="font-jost text-[10px] text-text-secondary">
                            Showing the most recent administrative actions
                        </span>
                    </div>
                </div>
            ) : (
                <div className="border-y border-border bg-surface">
                    <div
                        className="
                            flex min-w-0 flex-col
                            px-5 py-10
                            sm:px-7 sm:py-12
                            lg:px-8 lg:py-14
                        "
                    >
                        {/* Empty state heading */}
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    border border-border
                                    bg-background-alt
                                "
                            >
                                <Activity
                                    size={16}
                                    strokeWidth={1.6}
                                    className="text-text-secondary"
                                />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        font-poppins
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-text-secondary/70
                                    "
                                >
                                    Activity log
                                </p>

                                <p
                                    className="
                                        mt-1
                                        font-jost
                                        text-[15px]
                                        font-semibold
                                        tracking-[-0.01em]
                                        text-text-primary
                                    "
                                >
                                    No recent activity
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 max-w-2xl border-l-2 border-primary/20 pl-4 sm:pl-5">
                            <p
                                className="
                                    font-jost
                                    text-[12px]
                                    leading-6
                                    text-text-secondary
                                    sm:text-[13px]
                                "
                            >
                                Administrative actions will appear here as the
                                platform is used, giving you a clear record of
                                recent changes and decisions.
                            </p>
                        </div>

                        <div
                            className="
                                mt-7 flex items-center gap-2
                                border-t border-border
                                pt-4
                            "
                        >
                            <Clock3
                                size={12}
                                strokeWidth={1.6}
                                className="text-text-secondary/70"
                            />

                            <span className="font-jost text-[10px] text-text-secondary">
                                Waiting for the first recorded action
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </section>
);

export default ActivitySection;
