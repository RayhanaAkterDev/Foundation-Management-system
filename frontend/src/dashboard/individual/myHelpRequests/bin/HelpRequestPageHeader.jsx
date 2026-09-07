import { Download, Plus } from 'lucide-react';

const HelpRequestPageHeader = ({
    onNewRequest,
    onExport,
    exportDisabled,
}) => (
                <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-[#edf4f4]">
                    <div className="flex flex-col lg:flex-row">
                        {/* =================================================
                            MAIN HEADER
                        ================================================== */}

                        <div className="relative flex min-w-0 flex-1 items-center overflow-hidden bg-primary px-7 py-9 sm:px-9 sm:py-10 lg:px-10 lg:py-11">
                            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-28 border-white/[0.035]" />

                            <div className="pointer-events-none absolute -bottom-28 -left-16 h-52 w-52 rounded-full bg-white/2.5" />

                            <div className="relative max-w-2xl">
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>

                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                                        Personal support
                                    </span>

                                    <span className="h-px w-10 bg-white/20" />
                                </div>

                                <h1 className="text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]">
                                    My Help Requests
                                </h1>

                                <p className="mt-4 max-w-xl text-[14px] font-medium leading-6 text-white/70 sm:text-[15px] sm:leading-7">
                                    Track the requests you've submitted, follow
                                    their progress, and stay connected with the
                                    organizations helping you.
                                </p>

                                <div className="mt-7 flex items-center gap-1.5">
                                    <span className="h-1 w-8 rounded-full bg-white/75" />
                                    <span className="h-1 w-2 rounded-full bg-white/30" />
                                    <span className="h-1 w-2 rounded-full bg-white/15" />
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            QUICK ACTIONS
                        ================================================== */}

                        <div className="flex shrink-0 items-center border-t border-primary/10 bg-[#f4f8f8] px-7 py-7 sm:px-9 lg:w-85 lg:border-l lg:border-t-0 lg:px-8">
                            <div className="w-full">
                                <div className="mb-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                            Quick actions
                                        </span>

                                        <span className="h-px flex-1 bg-primary/10" />
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-text-primary">
                                        Manage your support activity
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={onNewRequest}
                                        className="group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md"
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/15">
                                            <Plus size={16} strokeWidth={2.4} />
                                        </span>

                                        <span>New Request</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onExport}
                                        disabled={
                                            exportDisabled
                                        }
                                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-white text-text-primary shadow-sm transition-all duration-200 hover:border-primary/25 hover:bg-primary/4 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Export requests"
                                        title="Export requests"
                                    >
                                        <Download size={16} strokeWidth={1.8} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        HEADER FOOTER STRIP
                    ================================================== */}

                    <div className="flex h-16 items-center justify-between border-t border-primary/10 bg-[#e8f1f1] px-7 sm:px-9 lg:px-10">
                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                            Manage · Track · Connect
                        </span>

                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-6 rounded-full bg-primary/25" />
                            <span className="h-1.5 w-2 rounded-full bg-primary/15" />
                        </div>
                    </div>
                </section>

);

export default HelpRequestPageHeader;
