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

                {/* SCROLL AREA */}
                <div className="relative mt-6 sm:mt-8 flex-1">
                    {/* timeline line */}
                    <div className="absolute left-2.5 sm:left-3 top-0 bottom-0 w-px bg-primary/10" />

                    {/* scroll container */}
                    <div
                        className="
                        space-y-6 sm:space-y-8
                        pr-2 sm:pr-3
                        overflow-y-auto
                        max-h-85 md:max-h-88 lg:max-h-90 xl:max-h-85
                        custom-scroll
                    "
                    >
                        {localCases.map((item) => (
                            <Link
                                key={item.id}
                                to={`/campaign/${item.id}`}
                                className="group flex gap-4 sm:gap-5"
                            >
                                {/* DOT */}
                                <div className="relative z-10 mt-1">
                                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-4 border-white bg-primary transition-all duration-200" />
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1 transition-transform duration-200 group-hover:translate-x-1">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <Badge
                                            variant="primary"
                                            tone="soft"
                                            size="md"
                                        >
                                            {item.category}
                                        </Badge>

                                        <span className="text-xs text-text-secondary">
                                            {item.distance}
                                        </span>
                                    </div>

                                    <h5 className="font-medium pt-1 sm:pt-2 leading-snug text-text-primary group-hover:text-primary transition-colors text-sm sm:text-base">
                                        {item.title}
                                    </h5>

                                    <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
                                        <FiMapPin size={14} />
                                        <span>{item.location}</span>
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
