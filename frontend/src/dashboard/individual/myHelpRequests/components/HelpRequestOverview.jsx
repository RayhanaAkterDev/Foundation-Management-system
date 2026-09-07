import { ArrowUpRight } from 'lucide-react';

const HelpRequestOverview = ({ statistics }) => (
    <section>
        <div className="mt-12 px-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-primary/50" />

                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                            Request overview
                        </p>
                    </div>

                    <h2 className="mt-2.5 text-[24px] font-extrabold leading-[1.12] tracking-[-0.03em] text-text-primary sm:text-[27px]">
                        Where your requests stand
                    </h2>
                </div>

                {statistics.total > 0 && (
                    <div className="flex items-center gap-2 pb-0.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />

                        <p className="text-[11px] font-medium leading-5 text-text-secondary">
                            Updated from your submitted requests
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_5px_24px_rgba(15,23,42,0.04)]">
            <div className="grid lg:grid-cols-[280px_1fr]">
                <div className="relative overflow-hidden border-b border-primary/10 bg-primary/7 px-7 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
                    <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border-18 border-primary/4.5" />

                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-primary/2.5" />

                    <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                                    Total submitted
                                </p>

                                <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                                    Your request history
                                </p>
                            </div>

                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-white text-primary shadow-sm">
                                <ArrowUpRight size={16} strokeWidth={1.8} />
                            </span>
                        </div>

                        <div className="mt-7 flex items-end gap-2.5">
                            <span className="text-[52px] font-extrabold leading-[0.9] tracking-[-0.045em] text-text-primary">
                                {statistics.total}
                            </span>

                            <span className="mb-0.5 text-xs font-bold text-text-secondary">
                                requests
                            </span>
                        </div>

                        <p className="mt-20 max-w-57.5 lg:mt-35 text-xs leading-5 text-text-secondary">
                            Every request you have submitted through Stand For
                            People.
                        </p>

                        <div className="mt-6 flex items-center gap-1.5">
                            <span className="h-1 w-7 rounded-full bg-primary/50" />
                            <span className="h-1 w-2 rounded-full bg-primary/20" />
                            <span className="h-1 w-2 rounded-full bg-primary/10" />
                        </div>
                    </div>
                </div>

                <div className="min-w-0 bg-white px-6 py-7 sm:px-8 lg:px-9 lg:py-8">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <p className="text-[15px] font-bold leading-5 text-text-primary">
                                Active request flow
                            </p>

                            <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                                Requests currently moving through support
                            </p>
                        </div>

                        <span className="shrink-0 rounded-lg border border-primary/10 bg-primary/4.5 px-3 py-1.5 text-[11px] font-bold text-primary">
                            {statistics.pending +
                                statistics.verified +
                                statistics.assigned}{' '}
                            active
                        </span>
                    </div>

                    <div className="relative mt-9">
                        <div className="absolute left-3 right-3 top-3 h-px bg-border sm:left-4 sm:right-4" />

                        <div className="relative grid grid-cols-3">
                            <div className="min-w-0 text-left">
                                <div className="flex justify-start">
                                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-amber-500 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
                                        {statistics.pending}
                                    </p>

                                    <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                        Pending
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-text-secondary">
                                        Waiting for review
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 text-center">
                                <div className="flex justify-center">
                                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
                                        {statistics.verified}
                                    </p>

                                    <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                        Verified
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-text-secondary">
                                        Request confirmed
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 text-right">
                                <div className="flex justify-end">
                                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-primary shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
                                        {statistics.assigned}
                                    </p>

                                    <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                        Assigned
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-text-secondary">
                                        Organization connected
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid border-t border-border sm:grid-cols-2">
                        <div className="flex items-center justify-between gap-5 border-b border-border px-1 py-5 sm:border-b-0 sm:border-r sm:pr-7">
                            <div className="flex min-w-0 items-center gap-3.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold leading-5 text-text-primary">
                                        Completed
                                    </p>

                                    <p className="mt-0.5 text-[11px] leading-5 text-text-secondary">
                                        Successfully supported requests
                                    </p>
                                </div>
                            </div>

                            <span className="shrink-0 text-[21px] font-extrabold leading-none tracking-tight text-emerald-600">
                                {statistics.completed}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-5 px-1 py-5 sm:pl-7">
                            <div className="flex min-w-0 items-center gap-3.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50">
                                    <span className="h-2 w-2 rounded-full bg-red-500" />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold leading-5 text-text-primary">
                                        Rejected
                                    </p>

                                    <p className="mt-0.5 text-[11px] leading-5 text-text-secondary">
                                        Requests that could not proceed
                                    </p>
                                </div>
                            </div>

                            <span className="shrink-0 text-[21px] font-extrabold leading-none tracking-tight text-red-500">
                                {statistics.rejected}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default HelpRequestOverview;
