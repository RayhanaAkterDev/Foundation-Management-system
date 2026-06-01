import React from 'react';
import statsData from './data/statsData';
import StatCard from '@/components/StatCard';

const ImpactSnapshot = () => {
    return (
        <div className="bg-background border border-primary/20 absolute -bottom-15 right-0 rounded-3xl">
            {statsData && (
                <StatCard stats={statsData} size="hero" style="minimal" align='center' />
            )}
        </div>
    );
};

export default ImpactSnapshot;
