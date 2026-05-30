import React from 'react';

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Motion from '@/components/motion/Motion';

const LeftPanel = ({ current }) => {
    return (
        <div className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-24 space-y-5 md:space-y-6">
                {/* LABEL */}
                <div
                    className="text-[11px] sm:text-xs font-medium uppercase tracking-wider"
                    style={{ color: current.color }}
                >
                    Active Impact Area
                </div>

                {/* CONTENT */}
                <div className="relative min-h-50 sm:min-h-40 lg:min-h-65 xl:min-h-60">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                                {current.title}
                            </h2>

                            <p className="mt-4 md:mt-5 text-sm md:text-base text-gray-600 leading-relaxed">
                                {current.story}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* META */}
                <motion.div
                    key={current.id + '-meta'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t border-border space-y-2"
                >
                    <div className="text-xs sm:text-sm text-primary">
                        {current.activeCases} active cases •{' '}
                        {current.avgResponseTime} response time
                    </div>

                    <div className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {current.outcome}
                    </div>
                </motion.div>

                {/* CTA (UNCHANGED) */}
                <Motion variant="fadeUp">
                    <Link
                        to={`/categories/${current.id}`}
                        className="inline-flex items-center gap-2 font-medium mt-2 text-sm sm:text-base"
                        style={{ color: current.color }}
                    >
                        Take action
                        <FiArrowRight />
                    </Link>
                </Motion>
            </div>
        </div>
    );
};

export default LeftPanel;
