import React from 'react';
import Motion from '@/components/motion/Motion';
import flow from './data/workingSteps';
import FlowCard from './WorkflowCard';

const WorkflowGrid = () => {
    return (
        <div className="relative mt-10 sm:mt-12 md:mt-14 lg:mt-14 xl:mt-16">
            <Motion
                stagger
                className="
                    relative
                    grid grid-cols-1
                    gap-5
                    sm:gap-6
                    md:grid-cols-2 md:gap-7
                    lg:grid-cols-4 lg:gap-5
                    xl:gap-7
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
