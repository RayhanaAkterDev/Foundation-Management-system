import React from 'react';
import statsData from './data/statsData';
import StatCard from '@/components/StatCard';

const ImpactSnapshot = () => {
    return (
        <div className="bg-surface absolute -bottom-12 right-0 rounded-3xl border border-border">
            {statsData && (
                <StatCard stats={statsData} size="section" style="minimal" align='center' />
            )}
        </div>
    );
};

export default ImpactSnapshot;
