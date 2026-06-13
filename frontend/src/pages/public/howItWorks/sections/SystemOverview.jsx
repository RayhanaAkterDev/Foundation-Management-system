// sections/SystemOverview.jsx
import React from 'react';
import Motion from '@/components/motion/Motion';

const steps = [
    'Need',
    'Intake',
    'Structuring',
    'Verification',
    'Prioritization',
    'Matching',
    'Delivery',
    'Feedback',
];

const SystemOverview = () => {
    return (
        <section className="container-width text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
                System Overview
            </h2>

            <Motion className="mt-10 flex flex-wrap justify-center gap-4">
                {steps.map((step, i) => (
                    <div
                        key={step}
                        className="flex items-center gap-3 text-sm md:text-base"
                    >
                        <span className="px-4 py-2 rounded-full bg-surface border border-border">
                            {step}
                        </span>

                        {i !== steps.length - 1 && (
                            <span className="text-primary/30 hidden md:block">
                                →
                            </span>
                        )}
                    </div>
                ))}
            </Motion>
        </section>
    );
};

export default SystemOverview;
