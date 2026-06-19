import React from 'react';
import { Link } from 'react-router-dom';
import Motion from '@/components/motion/Motion';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import SectionHeading from '@/components/SectionHeading';
import localImpactStats from './data/impactStats';
import leftPanel from '@/assets/home/localImpact/leftPanel.png';

const LeftPanel = () => {
    return (
        <Motion variant="fadeRight" className="md:col-span-2 w-full">
            <div className="h-full rounded-3xl border border-primary/10 bg-linear-to-br from-primary/5 via-white to-primary/10 overflow-hidden flex flex-col">
                {/* IMAGE */}
                <div className="w-full aspect-video">
                    <img
                        src={leftPanel}
                        alt="Community support"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-5 sm:p-6 lg:p-8">
                    <SectionHeading
                        align="left"
                        badge={{
                            icon: FiMapPin,
                            label: 'Your Area',
                            variant: 'primary',
                            tone: 'solid',
                            size: 'md',
                        }}
                        title="Community Impact"
                        headingSize="sub"
                        description="Real people around you are currently seeking support. Every contribution helps strengthen local communities and creates meaningful impact."
                        descriptionSize="sm"
                        descriptionClass="text-text-secondary"
                        gap="sm"
                    />

                    {/* STATS */}
                    <div className="pt-6 pb-4 space-y-3 sm:space-y-4">
                        {localImpactStats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3 text-text-secondary text-sm">
                                        <Icon className="text-primary shrink-0" />
                                        <span className="leading-tight">
                                            {item.label}
                                        </span>
                                    </div>

                                    <span className="text-base sm:text-lg font-semibold text-primary whitespace-nowrap">
                                        {item.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-primary/10">
                        <Link
                            to="/campaigns?nearby=true"
                            className="group inline-flex items-center gap-2 font-medium text-primary text-sm sm:text-base"
                        >
                            Explore local cases
                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                                <FiArrowRight />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </Motion>
    );
};

export default LeftPanel;
