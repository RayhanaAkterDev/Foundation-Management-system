import React from 'react';

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Motion from '@/components/motion/Motion';

const LeftPanel = ({ current }) => {
    return (
        <div className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-24 space-y-5 sm:space-y-6">
                {/* LABEL */}
                <div
                    className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium"
                    style={{ color: current.color }}
                >
                    Impact Focus Area
                </div>

                {/* STORY WINDOW (stable height system) */}
                <div className="relative min-h-40 sm:min-h-35 lg:min-h-55">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-primary leading-tight">
                                {current.title}
                            </h2>

                            <div
                                className="h-0.5 w-14 sm:w-16 mt-3 rounded-full"
                                style={{ backgroundColor: current.color }}
                            />

                            <p className="mt-4 sm:mt-5 text-sm md:text-base text-gray-600 leading-relaxed">
                                {current.story}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* IMPACT SNAPSHOT */}
                <motion.div
                    key={current.id + '-impact'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 pt-4 border-t border-border"
                >
                    <div className="text-sm font-medium text-text-primary">
                        {current.outcome}
                    </div>

                    <div className="text-xs text-text-secondary/90 leading-relaxed">
                        ~ {current.activeCases} situations active • Avg
                        response: {current.avgResponseTime}
                    </div>
                </motion.div>

                {/* CTA */}
                <Motion variant="fadeUp">
                    <Link
                        to={`/categories/${current.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: current.color }}
                    >
                        Explore this impact
                        <FiArrowRight />
                    </Link>
                </Motion>
            </div>
        </div>
    );
};

export default LeftPanel;
