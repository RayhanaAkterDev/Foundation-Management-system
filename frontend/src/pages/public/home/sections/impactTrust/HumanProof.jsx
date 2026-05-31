import React from 'react';
import humanProof from '@/assets/home/transparency/humanProof.png';

const HumanProof = () => {
    return (
        <div className="rounded-4xl border border-border bg-surface p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                {/* text */}
                <div className="md:col-span-3">
                    <span className="text-xs uppercase tracking-[0.25em] text-primary">
                        Real Impact
                    </span>

                    <blockquote className="mt-4 text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
                        “Support arrived within two days after the flood. We
                        were able to rebuild our home and send our children back
                        to school.”
                    </blockquote>

                    <div className="mt-6 text-sm md:text-base text-text-secondary">
                        Salma Begum · Flood Recovery Program
                    </div>
                </div>

                {/* image */}
                <div className="md:col-span-2">
                    <img
                        src={humanProof}
                        alt=""
                        className="w-full h-auto rounded-3xl object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default HumanProof;
