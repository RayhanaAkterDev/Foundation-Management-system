// sections/process/ProcessScene.jsx
import React from 'react';
import Motion from '@/components/motion/Motion';

const ProcessScene = ({ step, title, desc, mock, reverse }) => {
    return (
        <div className="container-width grid md:grid-cols-2 gap-12 items-center">
            <div className={reverse ? 'md:order-2' : ''}>
                <Motion variant="fadeUp">
                    <span className="text-sm text-primary/60">Step {step}</span>

                    <h3 className="text-2xl font-semibold mt-3">{title}</h3>

                    <p className="mt-4 text-text-secondary leading-relaxed">
                        {desc}
                    </p>
                </Motion>
            </div>

            <div
                className={`
                    h-72 rounded-2xl border border-border bg-surface/40
                    ${reverse ? 'md:order-1' : ''}
                `}
            >
                {/* mock placeholder */}
                <div className="w-full h-full flex items-center justify-center text-primary/30 text-sm">
                    {mock} visualization
                </div>
            </div>
        </div>
    );
};

export default ProcessScene;
