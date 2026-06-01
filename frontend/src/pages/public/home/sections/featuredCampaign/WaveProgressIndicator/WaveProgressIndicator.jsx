import React, { useEffect, useState } from 'react';
import Motion from '@/components/motion/Motion';
import './WaveProgressIndicator.css';

const WaveProgressIndicator = ({ value = 62 }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedValue(value);
        }, 200);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <Motion variant="fadeIn" className="flex flex-col items-center gap-2">
            <div className="progress-water border border-border">
                {/* LIQUID */}
                <div className="water" style={{ height: `${animatedValue}%` }}>
                    <div className="water-surface">
                        <svg className="wave wave-back" viewBox="0 0 1200 120">
                            <path d="M0,60 C150,20 300,20 450,60 C600,100 750,100 900,60 C1050,20 1200,20 1350,60 L1350,120 L0,120 Z" />
                        </svg>

                        <svg className="wave wave-front" viewBox="0 0 1200 120">
                            <path d="M0,60 C150,10 300,10 450,60 C600,110 750,110 900,60 C1050,10 1200,10 1350,60 L1350,120 L0,120 Z" />
                        </svg>
                    </div>
                </div>
                <div className="content">
                    <h4>{value}%</h4>
                    <p>funded</p>
                </div>
            </div>
        </Motion>
    );
};

export default WaveProgressIndicator;
