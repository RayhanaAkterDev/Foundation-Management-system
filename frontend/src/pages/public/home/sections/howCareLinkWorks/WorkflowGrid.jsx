import React from 'react';
import Motion from '@/components/motion/Motion';
import flow from './data/workingSteps';
import FlowCard from './WorkflowCard';

const WorkflowGrid = () => {
    return (
        <div className="relative mt-14 md:mt-16 xl:mt-20">
            {/* CONNECTOR LINE */}
            <Motion
                variant="lineReveal"
                className="
                    hidden xl:block
                    absolute left-0 right-0 top-18 h-px
                    origin-left
                    bg-linear-to-r from-transparent via-primary/20 to-transparent
                "
            />

            {/* GRID */}
            <Motion
                stagger
                className="
                    relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-7 xl:gap-6
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
