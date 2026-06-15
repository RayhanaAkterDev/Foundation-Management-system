import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Motion from '@/components/motion/Motion';

const LeftPanel = ({ current }) => {
    return (
        <div className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-24 space-y-6 sm:space-y-7">
                <div
                    className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium"
                    style={{ color: current.color }}
                >
                    Impact Focus Area
                </div>

                <div className="relative min-h-44 sm:min-h-40 lg:min-h-44">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary leading-snug sm:leading-snug md:leading-tight">
                                {current.title}
                            </h2>

                            <div
                                className="h-0.5 w-16 sm:w-20 mt-5 sm:mt-6 rounded-full"
                                style={{ backgroundColor: current.color }}
                            />

                            <p className="mt-6 sm:mt-7 text-sm sm:text-base md:text-[15px] text-text-secondary leading-relaxed sm:leading-loose max-w-prose">
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
                    className="pt-5 border-t border-border"
                >
                    <div className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {current.activeCases} active requests • Response within{' '}
                        <span className="font-medium">
                            {current.avgResponseTime}
                        </span>
                    </div>
                </motion.div>

                <Motion variant="fadeUp">
                    <Link
                        to={`/categories/${current.id}`}
                        className="inline-flex items-center gap-2 text-sm sm:text-[15px] font-medium tracking-wide"
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
