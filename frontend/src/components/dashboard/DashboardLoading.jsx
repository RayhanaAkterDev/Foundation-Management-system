import React from 'react';
import LoadingUI from '@/components/dashboard/LoadingUI';

/**
 * Dashboard-only loading composition.
 * The shared LoadingUI keeps its original sizing and styling.
 * The introductory header exists only while the dashboard is loading.
 */
export default function DashboardLoading({
    type = 'admin',
    title = 'Loading dashboard...',
    description = 'Retrieving your dashboard information.',
}) {
    const config = {
        admin: {
            eyebrow: 'ADMINISTRATION / OVERVIEW',
            heading: 'Operations overview',
            description: 'Your network, priorities, and platform activity.',
            accent: '#88A9D7',
        },
        organization: {
            eyebrow: 'ORGANIZATION WORKSPACE',
            heading: 'Organization dashboard',
            description:
                'Your team, community requests, and ongoing initiatives.',
            accent: '#E8B083',
        },
        individual: {
            eyebrow: 'YOUR SPACE / OVERVIEW',
            heading: 'Your dashboard',
            description: 'Your contributions and community activity.',
            accent: '#D9B47B',
        },
    }[type] || {
        eyebrow: 'DASHBOARD / OVERVIEW',
        heading: 'Dashboard',
        description: 'Preparing your workspace.',
        accent: '#88A9D7',
    };

    return (
        <div className="min-w-0 w-full font-poppins text-[#EEF1F5]">
            <header className="mb-7 border-b border-[#303A47] pb-6 sm:mb-8 sm:pb-7">
                <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: config.accent }}
                                aria-hidden="true"
                            />
                            <span className="text-[10px] font-semibold! uppercase tracking-[0.16em] text-[#94A2B2]">
                                {config.eyebrow}
                            </span>
                        </div>
                        <h1 className="mt-3 font-poppins! text-[25px]! font-semibold! tracking-[-0.04em] text-[#EEF1F5]! sm:text-[33px]!">
                            {config.heading}
                        </h1>
                        <p className="mt-2 max-w-xl text-[12px] leading-5 text-[#94A2B2] sm:text-[13px]">
                            {config.description}
                        </p>
                    </div>
                    <span className="hidden items-center gap-2 border border-[#303A47] bg-[#151C25] px-3 py-2 text-[11px] text-[#94A2B2] sm:inline-flex">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#94A2B2]" />
                        Preparing workspace
                    </span>
                </div>
            </header>
            <LoadingUI variant="page" title={title} description={description} />
        </div>
    );
}
