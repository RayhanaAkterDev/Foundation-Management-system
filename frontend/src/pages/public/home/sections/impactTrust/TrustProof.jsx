import React from 'react';
import Motion from '@/components/motion/Motion';
import items from './data/trustProofData';

const TrustProof = () => {
    return (
        <div className="rounded-3xl border border-border bg-surface p-6 md:p-8 h-full">
            <span className="text-xs uppercase tracking-[0.25em] text-primary">
                Trust Mechanisms
            </span>

            <h3 className="mt-3 text-xl md:text-2xl font-semibold">
                Built for transparency
            </h3>

            <div className="mt-8 space-y-6">
                {items.map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <Motion
                            key={i}
                            variant="fadeUp"
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <div className="flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Icon size={20} />
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm md:text-base">
                                    {item.title}
                                </h4>

                                <p className="mt-1 text-xs md:text-sm text-text-secondary">
                                    {item.description}
                                </p>
                            </div>
                        </Motion>
                    );
                })}
            </div>
        </div>
    );
};

export default TrustProof;
