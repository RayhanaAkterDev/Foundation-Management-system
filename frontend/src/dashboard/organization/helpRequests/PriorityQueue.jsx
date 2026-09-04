import {
    Activity,
    ArrowRight,
    Clock3,
    MapPin,
    ShieldCheck,
} from 'lucide-react';

import UrgencyBadge from './UrgencyBadge';

const PriorityDetail = ({ label, value, icon: Icon, accent = false }) => (
    <div className="border-r border-[#e4eaec] py-5 pr-4 last:border-r-0 sm:px-4 sm:first:pl-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#9aa5a9]">
            {label}
        </p>

        <div className="mt-2 flex min-w-0 items-center gap-1.5">
            {Icon && (
                <Icon
                    className="h-3 w-3 shrink-0 text-[#89979b]"
                    strokeWidth={1.7}
                />
            )}

            <p
                className={`truncate text-[11px] font-semibold ${
                    accent ? 'text-primary' : 'text-[#45575e]'
                }`}
            >
                {value}
            </p>
        </div>
    </div>
);

const PriorityQueueItem = ({ number, label, description, tone }) => {
    const config = {
        amber: {
            number: 'text-[#a97008]',
            dot: 'bg-[#e6b63d]',
            rail: 'bg-[#f0cf83]',
            hover: 'hover:bg-[#fffdf8]',
        },

        teal: {
            number: 'text-primary',
            dot: 'bg-[#65aaa0]',
            rail: 'bg-[#9bcac4]',
            hover: 'hover:bg-[#f7fbfa]',
        },

        red: {
            number: 'text-[#ae5d52]',
            dot: 'bg-[#cb8278]',
            rail: 'bg-[#e3b0a9]',
            hover: 'hover:bg-[#fffafa]',
        },
    }[tone];

    return (
        <div
            className={`group relative overflow-hidden border-b border-[#dfe7e9] px-6 py-6.5 transition-all duration-200 ${config.hover}`}
        >
            <span
                className={`absolute bottom-0 left-0 top-0 w-0.5 opacity-70 ${config.rail}`}
            />

            <div className="flex items-start gap-4.5">
                <div className="min-w-7.5 pt-0.5">
                    <span
                        className={`text-[29px] font-semibold leading-none tracking-[-0.06em] ${config.number}`}
                    >
                        {number}
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />

                        <p className="text-[11px] font-bold text-[#41535a]">
                            {label}
                        </p>
                    </div>

                    <p className="mt-2 text-[9px] leading-5 text-[#8b989d]">
                        {description}
                    </p>
                </div>

                <ArrowRight
                    className="mt-1 h-3.5 w-3.5 text-[#a6b0b4] transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    strokeWidth={1.7}
                />
            </div>
        </div>
    );
};

const PriorityQueue = ({
    pending,
    counts,
    formatCurrency,
    onViewCase,
    onRespond,
}) => {
    if (!pending) {
        return null;
    }

    return (
        <section className="mt-16 sm:mt-20">
            <div className="mb-7 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="h-1.25 w-1.25 bg-accent" />

                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7f8c91]">
                            Priority queue
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h2 className="text-[27px] font-semibold tracking-tighter text-[#182c33]">
                            Requires attention
                        </h2>

                        <span className="text-[10px] font-medium text-[#9ba5a9]">
                            {counts.pending + counts.withdrawal} open actions
                        </span>
                    </div>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-[#70b3a9]/35" />

                        <span className="relative h-2 w-2 rounded-full bg-[#70b3a9]" />
                    </span>

                    <span className="text-[9px] font-semibold text-[#87959a]">
                        Live queue
                    </span>
                </div>
            </div>

            <div className="grid overflow-hidden border border-[#d0dde0] bg-white shadow-[0_20px_55px_rgba(24,53,61,0.06)] xl:grid-cols-[minmax(0,1fr)_315px]">
                {/* PRIMARY CASE */}
                <article className="relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-0.75 bg-accent" />

                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-accent" />

                    <div className="absolute right-0 top-0 h-full w-[25%] bg-linear-to-l from-[#fffaf0] to-transparent opacity-70" />

                    <div className="relative px-7 py-9 sm:px-10 sm:py-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-[#b18a39]">
                                    QUEUE 01
                                </span>

                                <span className="h-px w-9 bg-[#e7d7aa]" />

                                <span className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#9a875f]">
                                    Immediate response
                                </span>
                            </div>

                            <span className="hidden text-[9px] font-semibold text-[#a0aaae] sm:block">
                                Waiting {pending.assignmentAge}
                            </span>
                        </div>

                        <div className="mt-9 max-w-200">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <UrgencyBadge urgency={pending.urgency} />

                                <span className="text-[9px] font-medium text-[#9ba5a9]">
                                    {pending.category}
                                </span>
                            </div>

                            <h3 className="mt-4 max-w-190 text-[31px] font-semibold leading-[1.08] tracking-[-0.052em] text-[#182d34] sm:text-[37px]">
                                {pending.title}
                            </h3>

                            <p className="mt-5 max-w-172.5 text-[12px] leading-7 text-[#718087]">
                                {pending.description}
                            </p>
                        </div>

                        <div className="mt-10 grid border-y border-[#e4eaec] sm:grid-cols-4">
                            <PriorityDetail
                                label="Requester"
                                value={pending.individual}
                            />

                            <PriorityDetail
                                label="Location"
                                value={pending.location}
                                icon={MapPin}
                            />

                            <PriorityDetail
                                label="Support needed"
                                value={pending.supportType}
                            />

                            <PriorityDetail
                                label="Amount needed"
                                value={formatCurrency(pending.amountNeeded)}
                                accent
                            />
                        </div>

                        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[#fff3d5] text-[#aa7204]">
                                    <Clock3 className="h-4 w-4" />

                                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-[#52646a]">
                                        Decision required
                                    </p>

                                    <p className="mt-1 text-[9px] leading-5 text-[#98a3a7]">
                                        Accepting this case starts your
                                        organization's support.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2.5">
                                <button
                                    type="button"
                                    onClick={onViewCase}
                                    className="border border-[#d5dfe1] bg-white px-5 py-3.5 text-[10px] font-bold text-[#64747a] transition-all duration-200 hover:border-[#b9cdca] hover:bg-[#f8fbfa] hover:text-primary"
                                >
                                    View case
                                </button>

                                <button
                                    type="button"
                                    onClick={onRespond}
                                    className="group flex items-center gap-6 bg-primary px-6 py-3.5 text-white shadow-[0_9px_22px_rgba(15,118,110,0.16)] transition-all duration-200 hover:-translate-y-px hover:bg-primary-hover"
                                >
                                    <span className="text-left">
                                        <span className="block text-[11px] font-bold">
                                            Respond to case
                                        </span>

                                        <span className="mt-1 block text-[8px] text-white/45">
                                            Accept or decline
                                        </span>
                                    </span>

                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                {/* WORK QUEUE */}
                <aside className="border-t border-[#dce5e8] bg-[#f7fafb] xl:border-l xl:border-t-0">
                    <div className="border-b border-[#dce5e8] px-6 py-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#96a1a5]">
                                    Organization queue
                                </p>

                                <h3 className="mt-2 text-4.5 font-semibold tracking-[-0.03em] text-[#263a41]">
                                    What needs action
                                </h3>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center bg-white text-[#74868b] shadow-[0_3px_10px_rgba(25,52,60,0.04)]">
                                <Activity
                                    className="h-4 w-4"
                                    strokeWidth={1.6}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <PriorityQueueItem
                            number={counts.pending}
                            label="New decision"
                            description="Cases waiting for your response"
                            tone="amber"
                        />

                        <PriorityQueueItem
                            number={counts.active}
                            label="Active support"
                            description="Cases currently receiving assistance"
                            tone="teal"
                        />

                        <PriorityQueueItem
                            number={counts.withdrawal}
                            label="Admin review"
                            description="Withdrawal requests needing attention"
                            tone="red"
                        />
                    </div>

                    <div className="border-t border-[#dce5e8] px-6 py-6">
                        <div className="flex gap-3.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[#78918d]">
                                <ShieldCheck
                                    className="h-3.5 w-3.5"
                                    strokeWidth={1.6}
                                />
                            </div>

                            <p className="text-[9px] leading-5 text-[#8a979c]">
                                Priority is determined by urgency, waiting time,
                                and assistance need.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default PriorityQueue;
