import React from 'react';
import { Link } from 'react-router-dom';
import Motion from '@/components/motion/Motion';
import localCases from '../data/impactData';
import { FiMapPin } from 'react-icons/fi';
import Badge from '@/components/Badge';
import './RightPanel.css';

const RightPanel = () => {
    return (
        <Motion variant="fadeLeft" className="md:col-span-3 w-full">
            <div className="h-full rounded-3xl border border-primary/8 bg-white p-5 sm:p-6 lg:p-8 flex flex-col">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h4 className="text-lg sm:text-xl font-semibold">
                        Urgent Needs Around You
                    </h4>

                    <Badge variant="accent" tone="glass" size="md" pulse dot>
                        Live
                    </Badge>
                </div>

                {/* LOCAL ACTIVITY */}
                <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/3 p-4 sm:p-5">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary">
                            Nearby Activity
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-text-secondary">
                        Emerging needs identified around your area.
                    </p>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">
                                Highest Priority
                            </span>
                            <Badge variant="danger" tone="soft" size="sm">
                                Medical Emergency
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">
                                Most Active Area
                            </span>
                            <span className="text-sm font-medium text-text-primary">
                                Dhaka
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">
                                Nearest Case
                            </span>
                            <span className="text-sm font-medium text-text-primary">
                                1.2 km away
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                            Updated 5 minutes ago
                        </span>
                        <span className="text-xs font-medium text-primary">
                            Live tracking
                        </span>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="relative mt-8 flex-1 min-h-0">
                    {/* timeline line */}
                    <div className="absolute left-2.5 sm:left-3 top-0 bottom-0 w-px bg-primary/10" />

                    {/* scroll container */}
                    <div className="space-y-6 sm:space-y-8 pr-2 sm:pr-4 pl-1 overflow-y-auto max-h-[60vh] sm:max-h-[65vh] md:max-h-[35vh] lg:max-h-[25.5vh] xl:max-h-[37vh] custom-scroll">
                        {localCases.map((item) => (
                            <Link
                                key={item.id}
                                to={`/campaign/${item.id}`}
                                className="group flex gap-3 sm:gap-4"
                            >
                                {/* DOT */}
                                <div className="relative z-10 mt-1">
                                    <div className="h-5 w-5 rounded-full border-4 border-white bg-primary" />
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1 pb-5 border-b border-primary/8">
                                    <div className="flex justify-between gap-3">
                                        {/* LEFT */}
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-medium leading-snug text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h5>

                                            {/* META */}
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                                                <FiMapPin size={13} />
                                                <span>{item.location}</span>

                                                <span className="text-primary/40">
                                                    •
                                                </span>

                                                <span className="font-medium">
                                                    {item.distance}
                                                </span>
                                            </div>

                                            {/* BADGE */}
                                            <div className="mt-2">
                                                <Badge
                                                    variant="primary"
                                                    tone="soft"
                                                    size="sm"
                                                >
                                                    {item.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* IMAGE */}
                                        <div className="shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl object-cover border border-primary/10"
                                            />
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-3 flex items-center justify-end">
                                        <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            View →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* CTA */}
                        <div className="pt-5 sm:pt-6 border-t border-primary/10 text-right pr-2 sm:pr-4">
                            <Link
                                to="/campaigns?nearby=true"
                                className="group inline-flex items-center gap-2 text-primary font-medium text-sm"
                            >
                                See more nearby cases
                                <span className="transition-transform duration-200 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Motion>
    );
};

export default RightPanel;
