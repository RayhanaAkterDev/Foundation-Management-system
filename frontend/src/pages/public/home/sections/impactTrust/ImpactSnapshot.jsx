import React from 'react';
import statsData from './data/statsData';
import SectionHeading from '@/components/SectionHeading';

const ImpactSnapshot = () => {
    return (
        <div className="h-full">
            <SectionHeading title="CareLink in Numbers" />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statsData?.map((stat, i) => (
                    <div
                        key={i}
                        className="
                            rounded-xl
                            border border-border
                            bg-transparent
                            p-4
                            text-center
                        "
                    >
                        <div className="text-xl md:text-2xl font-semibold text-primary">
                            {stat.value}
                        </div>

                        <div className="mt-1 text-sm text-text-secondary">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImpactSnapshot;
