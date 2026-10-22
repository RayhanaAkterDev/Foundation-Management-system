import React from 'react';
import {
    ClipboardList,
    Clock3,
    BadgeCheck,
    Building2,
    CircleCheck,
    XCircle,
} from 'lucide-react';

const statuses = [
    ['pending', 'Pending', Clock3, '#C5A16D', '#29251F'],
    ['verified', 'Verified', BadgeCheck, '#91B9B0', '#1B2A2A'],
    ['assigned', 'Assigned', Building2, '#91A9CC', '#202B3D'],
    ['completed', 'Completed', CircleCheck, '#98B9A4', '#202F29'],
    ['rejected', 'Rejected', XCircle, '#BD9299', '#30252A'],
];

export default function HelpRequestOverview({ statistics = {} }) {
    const total = Number(statistics.total) || 0;
    return (
        <section>
            <h2 className="mb-5 text-[18px] font-semibold text-[#EEF1F5]!">
                Help Requests overview
            </h2>
            <div className="overflow-hidden border border-[#29323E] bg-[#0E1219]">
                <div className="grid lg:grid-cols-[minmax(220px,26%)_minmax(0,1fr)]">
                    <div className="flex flex-col justify-between border-b border-[#29323E] bg-[#19212C] px-5 py-6 sm:px-7 lg:border-b-0 lg:border-r">
                        <div>
                            <div className="flex items-center gap-2.5 text-[#E5EAF0]">
                                <span className="flex h-8 w-8 items-center justify-center border border-[#384453] bg-[#202B38] text-[#B4C0CE]">
                                    <ClipboardList size={16} />
                                </span>
                                <span className="text-[15px] font-semibold">
                                    My Help Requests
                                </span>
                            </div>
                            <p className="mt-5 text-[11px] uppercase tracking-[0.1em] text-[#8492A5]">
                                Total submitted
                            </p>
                            <div className="mt-2 flex items-end gap-2.5">
                                <span className="text-[58px] font-semibold leading-none tracking-tight text-[#EEF1F5]! sm:text-[66px]">
                                    {total}
                                </span>
                                <span className="mb-1.5 text-[12px] text-[#91A0B3]">
                                    requests
                                </span>
                            </div>
                        </div>
                        <p className="mt-6 border-t border-[#35404D] pt-3.5 text-[11px] text-[#91A0B3]">
                            Your submitted requests and their current progress
                        </p>
                    </div>
                    <div className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-[13px] font-semibold text-[#DDE4ED]!">
                                Request status
                            </h3>
                            <span className="text-[11px] text-[#718096]">
                                Distribution
                            </span>
                        </div>
                        <div className="divide-y divide-[#252E3A]">
                            {statuses.map(
                                ([key, label, Icon, color, background]) => {
                                    const count = Number(statistics[key]) || 0;
                                    const percent = total
                                        ? Math.min(100, (count / total) * 100)
                                        : 0;
                                    return (
                                        <div
                                            key={key}
                                            className="grid grid-cols-[minmax(0,1fr)_minmax(65px,38%)_32px] items-center gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(110px,42%)_45px] sm:gap-5"
                                        >
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <span
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center"
                                                    style={{
                                                        color,
                                                        backgroundColor:
                                                            background,
                                                    }}
                                                >
                                                    <Icon size={15} />
                                                </span>
                                                <span className="truncate text-[12px] text-[#CDD6E1]">
                                                    {label}
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 items-center gap-2">
                                                <div className="h-1.5 min-w-0 flex-1 bg-[#293440]">
                                                    <div
                                                        className="h-full"
                                                        style={{
                                                            width: `${percent}%`,
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-[10px] text-[#8492A5]">
                                                    {Math.round(percent)}%
                                                </span>
                                            </div>
                                            <span className="text-right text-[18px] font-semibold tabular-nums text-[#E2E8F0]">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
