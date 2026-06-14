import React from 'react';

import UnderstandingDiagram from './UnderstandingDiagram';
import TrustDiagram from './TrustDiagram';
import PriorityDiagram from './PriorityDiagram';
import NetworkDiagram from './NetworkDiagram/NetworkDiagram';

const DiagramWrapper = ({ children, type }) => {
    const isNetwork = type === 'network';

    return (
        <div className="w-full flex items-center justify-center px-2 sm:px-4">
            <div
                className={`
                    w-full
                    flex
                    items-center
                    justify-center

                    ${
                        isNetwork
                            ? 'max-w-2xl lg:max-w-4xl'
                            : 'max-w-md lg:max-w-lg'
                    }
                `}
            >
                {children}
            </div>
        </div>
    );
};

const Diagram = ({ type }) => {
    const diagrams = {
        understanding: <UnderstandingDiagram />,
        trust: <TrustDiagram />,
        priority: <PriorityDiagram />,
        network: <NetworkDiagram />,
    };

    const Component = diagrams[type];

    if (!Component) return null;

    return <DiagramWrapper type={type}>{Component}</DiagramWrapper>;
};

export default Diagram;
