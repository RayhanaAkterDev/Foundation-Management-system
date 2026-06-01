import React from 'react';

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Motion from '@/components/motion/Motion';

const LeftPanel = ({ current }) => {
    return (
        <div className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-24 space-y-5">
                <div
                    className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium"
                    style={{ color: current.color }}
                >
                    Impact Focus Area
                </div>

                <div className="relative min-h-40 sm:min-h-35 lg:min-h-40">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary leading-tight">
                                {current.title}
                            </h2>

                            <div
                                className="h-0.5 w-14 sm:w-16 mt-4 rounded-full"
                                style={{ backgroundColor: current.color }}
                            />

                            <p className="mt-5 text-sm md:text-base text-text-secondary leading-relaxed">
                                {current.story}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <motion.div
                    key={current.id + '-stats'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t border-border"
                >
                    <div className="text-sm text-text-secondary">
                        {current.activeCases} active requests • Response within{' '}
                        {current.avgResponseTime}
                    </div>
                </motion.div>

                <Motion variant="fadeUp">
                    <Link
                        to={`/categories/${current.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: current.color }}
                    >
                        See active needs
                        <FiArrowRight />
                    </Link>
                </Motion>
            </div>
        </div>
    );
};

export default LeftPanel;
