import React from 'react';

import Motion from '@/components/motion/Motion';

import flow from './data/workingSteps';
import FlowCard from './WorkflowCard';

const WorkflowGrid = () => {
    return (
        <div className="relative mt-12 sm:mt-14 md:mt-16 lg:mt-16 xl:mt-20">
            {/* GRID */}
            <Motion
                stagger
                className="
                    relative
                    grid
                    grid-cols-1
                    gap-5
                    sm:gap-6
                    md:grid-cols-2
                    md:gap-7
                    lg:grid-cols-4
                    lg:gap-4
                    xl:gap-6
                "
            >
                {flow.map((item, index) => (
                    <FlowCard
                        key={index}
                        item={item}
                        index={index}
                        flow={flow}
                    />
                ))}
            </Motion>
        </div>
    );
};

export default WorkflowGrid;
