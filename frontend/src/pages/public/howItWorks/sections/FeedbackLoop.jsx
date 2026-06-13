import React from 'react';
import Motion from '@/components/motion/Motion';

const FeedbackLoop = () => {
    return (
        <section className="container-width text-center">

            <h2 className="text-2xl md:text-3xl font-semibold">
                Continuous Feedback Loop
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-text-secondary leading-relaxed">
                Every completed support cycle feeds back into the system to improve accuracy,
                prioritization, and transparency for future requests.
            </p>

            {/* LOOP VISUAL */}
            <Motion
                className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6"
            >
                {[
                    'Request Submitted',
                    'Support Delivered',
                    'User Feedback',
                    'System Learning',
                ].map((step, i, arr) => (
                    <React.Fragment key={step}>
                        <div className="px-5 py-3 rounded-full border border-border bg-surface/40 text-sm">
                            {step}
                        </div>

                        {i !== arr.length - 1 && (
                            <span className="text-primary/30 hidden md:block">
                                →
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </Motion>

            {/* LOOP EXPLANATION */}
            <div className="mt-10 grid md:grid-cols-3 gap-6 text-left">
                <div className="p-5 rounded-2xl border border-border bg-surface/30">
                    <h3 className="font-semibold">Learning System</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                        Each request outcome improves future prioritization accuracy.
                    </p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-surface/30">
                    <h3 className="font-semibold">Transparency Tracking</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                        Completed cases are recorded to ensure accountability.
                    </p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-surface/30">
                    <h3 className="font-semibold">System Improvement</h3>
                    <p className="mt-2 text-sm text-text-secondary">
                        AI models refine urgency scoring and duplicate detection.
                    </p>
                </div>
            </div>

        </section>
    );
};

export default FeedbackLoop;