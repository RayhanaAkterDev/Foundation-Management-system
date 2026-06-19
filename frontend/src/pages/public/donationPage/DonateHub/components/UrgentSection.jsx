import SectionHeading from '@/components/SectionHeading';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';

const UrgentSection = ({ campaigns = [] }) => {
    const navigate = useNavigate();
    const safe = (campaigns || []).filter(Boolean);

    const leftMain = safe[1];
    const rightList = safe.slice(2, 7);

    const goToCampaign = (id) => navigate(`/campaign/${id}`);

    return (
        <section className="section-gap border-b border-border">
            <div className="container-width space-y-10">
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* LEFT MAIN */}
                    <div className="lg:col-span-2">
                        <SectionHeading
                            align="left"
                            title="Urgent Appeals"
                            description="Live critical cases that need immediate attention."
                        />

                        {leftMain && (
                            <div
                                onClick={() => goToCampaign(leftMain.id)}
                                className="
                                    group cursor-pointer
                                    rounded-2xl
                                    border border-border
                                    bg-surface
                                    overflow-hidden
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:shadow-[0_18px_60px_rgba(15,23,42,0.10)]
                                    mt-12
                                "
                            >
                                {/* TOP STRIP */}
                                <div
                                    className="
                                    px-4 sm:px-6 py-3 sm:py-4
                                    flex items-center justify-between
                                    border-b border-border/40
                                    bg-primary
                                "
                                >
                                    <span
                                        className="
                                        text-[10px] sm:text-xs
                                        uppercase tracking-[0.2em]
                                        text-surface/90
                                        flex items-center gap-2
                                        font-medium
                                    "
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                                        Emergency Appeal
                                    </span>

                                    <span
                                        className="
                                        text-[10px] sm:text-xs
                                        font-semibold
                                        text-primary
                                        bg-surface/95
                                        px-2 sm:px-3 py-1 rounded-full
                                        border border-primary/20
                                        shadow-sm
                                    "
                                    >
                                        #{leftMain?.priority || 2}
                                    </span>
                                </div>

                                {/* BODY */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6">
                                    {/* LEFT */}
                                    <div className="md:col-span-2 space-y-4 sm:space-y-5">
                                        <div className="text-[11px] sm:text-xs text-text-secondary flex items-center gap-2 flex-wrap">
                                            Medical Emergency • Verified Case •
                                            High Urgency
                                        </div>

                                        <h2
                                            className="
                                            text-xl sm:text-2xl lg:text-3xl font-semibold
                                            text-text-primary leading-tight
                                            group-hover:text-primary
                                            transition-colors duration-300
                                        "
                                        >
                                            {leftMain.title}
                                        </h2>

                                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                            {leftMain.shortDescription}
                                        </p>

                                        {/* PROGRESS */}
                                        <div className="pt-2 sm:pt-3 space-y-2">
                                            <div className="flex justify-between text-[10px] sm:text-[11px]">
                                                <span className="text-text-secondary">
                                                    Progress
                                                </span>
                                                <span className="text-primary font-semibold">
                                                    68%
                                                </span>
                                            </div>

                                            <div className="h-2 w-full bg-background-alt rounded-full overflow-hidden">
                                                <div
                                                    className="
                                                        h-full rounded-full
                                                        bg-linear-to-r from-primary to-primary-hover
                                                        relative
                                                    "
                                                    style={{ width: '68%' }}
                                                >
                                                    <div className="absolute inset-0 bg-white/10" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <Link to="/donate">
                                            <Button
                                                size="lg"
                                                className="w-full mt-2"
                                            >
                                                Donate Now
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* RIGHT */}
                                    <div
                                        className="
                                        flex flex-col justify-between
                                        border-t md:border-t-0 md:border-l border-border/60
                                        pt-4 md:pt-0 md:pl-6
                                        bg-linear-to-b from-surface to-background-alt/40
                                        rounded-b-2xl md:rounded-r-2xl
                                        min-h-35 sm:min-h-40
                                    "
                                    >
                                        <div className="space-y-3">
                                            <p className="text-[11px] sm:text-xs text-text-secondary flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                                Live donations active
                                            </p>

                                            <div className="text-xs sm:text-sm font-medium text-text-primary leading-snug">
                                                Help is needed urgently — every
                                                contribution matters
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT TIMELINE */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs uppercase tracking-widest text-text-secondary font-semibold">
                                Live Feed
                            </h4>
                            <span className="text-[11px] text-accent">
                                ● updating
                            </span>
                        </div>

                        <div className="relative space-y-4">
                            {/* vertical line */}
                            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />

                            {rightList.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => goToCampaign(c.id)}
                                    className="group relative pl-8 cursor-pointer"
                                >
                                    {/* node */}
                                    <div
                                        className="
                                        absolute left-0 top-2
                                        w-3 h-3 rounded-full
                                        bg-primary shadow-sm
                                    "
                                    />

                                    <div
                                        className="
                                        rounded-xl
                                        border border-border
                                        bg-surface/40
                                        p-3 sm:p-4
                                        transition-all duration-300
                                        hover:bg-surface
                                        hover:border-primary/20
                                        hover:-translate-y-0.5
                                    "
                                    >
                                        <p
                                            className="
                                            text-xs sm:text-sm font-medium text-text-primary
                                            line-clamp-2
                                            group-hover:text-primary
                                            transition
                                        "
                                        >
                                            {c.title}
                                        </p>

                                        <p className="text-[11px] sm:text-xs text-text-secondary line-clamp-2 mt-1">
                                            {c.shortDescription}
                                        </p>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] sm:text-[11px] text-primary font-medium">
                                                urgent
                                            </span>
                                            <span className="text-[10px] text-text-secondary">
                                                tap →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UrgentSection;
