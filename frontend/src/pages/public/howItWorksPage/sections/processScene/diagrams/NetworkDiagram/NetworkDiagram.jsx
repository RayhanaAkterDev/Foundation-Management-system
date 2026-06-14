import React from 'react';
import { ArrowDown } from 'lucide-react';
import nodes from './data';
import { TopNode, FoundationNode, CommunityNode } from './NetworkNodes';
import SectionHeading from '@/components/SectionHeading';

const NetworkDiagram = () => {
    return (
        <div className="w-full">
            {/* Heading */}
            <SectionHeading
                gap="sm"
                title="Stand Together For People"
                headingSize="section"
                headingClass="text-primary lg:text-2xl!"
                description="Bringing together donors, volunteers and partners to deliver trusted support where it matters most."
                wrapperClass="mb-10! sm:mb-12!"
            />

            {/* DESKTOP */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* top connector */}
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[52%] h-px bg-border/70" />

                    <div className="grid grid-cols-3 gap-8 relative z-10">
                        {nodes.map((node) => (
                            <div
                                key={node.title}
                                className="flex flex-col items-center"
                            >
                                <TopNode {...node} />
                                <div className="mt-4 w-px h-12 bg-border/70" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* foundation */}
                <div className="flex justify-center -mt-1">
                    <FoundationNode />
                </div>

                {/* arrow */}
                <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-border/70" />

                    <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center">
                        <ArrowDown className="w-4 h-4 text-primary" />
                    </div>

                    <div className="w-px h-8 bg-border/70" />
                </div>

                {/* communities */}
                <div className="flex justify-center">
                    <CommunityNode />
                </div>
            </div>

            {/* MOBILE */}
            <div className="md:hidden flex flex-col items-center space-y-6">
                {nodes.map((node, index) => (
                    <React.Fragment key={node.title}>
                        <TopNode {...node} />

                        {index < nodes.length - 1 && (
                            <div className="w-px h-6 bg-border/60" />
                        )}
                    </React.Fragment>
                ))}

                {/* foundation */}
                <div className="w-px h-6 bg-border/60" />

                <FoundationNode />

                {/* arrow */}
                <div className="w-px h-6 bg-border/60" />

                <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-primary" />
                </div>

                <div className="w-px h-6 bg-border/60" />

                {/* community */}
                <CommunityNode />
            </div>
        </div>
    );
};

export default NetworkDiagram;
