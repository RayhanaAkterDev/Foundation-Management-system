import React from 'react';

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity, FiClock, FiCheck } from 'react-icons/fi';

import Motion from '@/components/motion/Motion';
import SectionHeading from '@/components/SectionHeading';
import { getCampaignsByCategory } from '@/data/selectors';

const LeftPanel = ({ current }) => {
    const activeCases = getCampaignsByCategory(current.id).length;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                    duration: 0.35,
                    ease: 'easeOut',
                }}
                className="space-y-8"
            >
                {/* Header */}
                <SectionHeading
                    align="left"
                    gap="sm"
                    title={current.name}
                    description={current.story}
                    descriptionSize="sectionHero"
                />

                {/* Image */}
                <div className="relative overflow-hidden rounded-4xl">
                    <img
                        src={current.image}
                        alt={current.name}
                        className="
                                    h-65
                                    sm:h-80
                                    lg:h-90
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-700
                                    hover:scale-[1.03]
                                "
                    />

                    <div
                        className="
                                    absolute inset-0
                                    bg-linear-to-t
                                    from-black/60
                                    via-black/10
                                    to-transparent
                                "
                    />

                    <div className="absolute top-5 right-5">
                        <span
                            className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        backdrop-blur-md
                                    "
                            style={{
                                backgroundColor: `${current.color}95`,
                            }}
                        >
                            <FiActivity />
                            {activeCases} Active Request
                            {activeCases !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Quick Facts */}
                <div
                    className="
                                flex
                                flex-wrap
                                items-center
                                gap-x-8
                                gap-y-3
                                border-b
                                border-border
                                pb-6
                            "
                >
                    <div className="flex items-center gap-2">
                        <FiActivity
                            style={{
                                color: current.color,
                            }}
                        />

                        <span className="text-sm text-text-secondary">
                            <strong
                                style={{
                                    color: current.color,
                                }}
                            >
                                {activeCases}
                            </strong>{' '}
                            Active Cases
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FiClock
                            style={{
                                color: current.color,
                            }}
                        />

                        <span className="text-sm text-text-secondary">
                            <strong
                                style={{
                                    color: current.color,
                                }}
                            >
                                {current.avgResponseTime}
                            </strong>{' '}
                            Average Response
                        </span>
                    </div>
                </div>

                {/* About */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary">
                        About This Category
                    </h3>

                    <p className="leading-8 text-text-secondary">
                        Requests submitted under this category are reviewed,
                        verified, and prioritized based on urgency. Support is
                        coordinated through volunteers, donors, and partner
                        organizations to help assistance reach those who need it
                        most.
                    </p>
                </div>

                {/* Support Types */}
                {current.supportTypes?.length > 0 && (
                    <div className="space-y-4 border-t border-border pt-6">
                        <h3 className="text-xl font-semibold text-text-primary">
                            Common Support Includes
                        </h3>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {current.supportTypes.map((item) => (
                                <div
                                    key={item}
                                    className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                >
                                    <div
                                        className="
                                                    flex
                                                    h-6
                                                    w-6
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    shrink-0
                                                "
                                        style={{
                                            backgroundColor: `${current.color}15`,
                                            color: current.color,
                                        }}
                                    >
                                        <FiCheck size={13} />
                                    </div>

                                    <span className="text-sm text-text-secondary">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="border-t border-border pt-6">
                    <Motion variant="fadeUp">
                        <Link
                            to={`/campaigns/category/${current.id}`}
                            className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-3
                                        text-base
                                        font-semibold
                                        transition-all
                                        duration-300
                                    "
                            style={{
                                color: current.color,
                            }}
                        >
                            Explore Active Requests
                            <FiArrowRight
                                className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                            />
                        </Link>
                    </Motion>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LeftPanel;
