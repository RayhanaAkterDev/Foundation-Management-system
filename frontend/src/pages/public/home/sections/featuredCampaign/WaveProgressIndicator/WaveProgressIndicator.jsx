import React from 'react';
import Motion from '@/components/motion/Motion';
import './WaveProgressIndicator.css';

const WaveProgressIndicator = ({ value = 62 }) => {
    return (
        <Motion variant="fadeIn">
            <div className="relative w-20 h-20 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center">
                {/* OUTER BORDER GLOW (subtle brand feel) */}
                <div className="absolute inset-0 rounded-2xl border border-primary/15" />

                {/* WATER */}
                <div
                    className="absolute bottom-0 left-0 w-full wave-fill"
                    style={{
                        height: `${value}%`,
                    }}
                >
                    {/* wave layer 1 */}
                    <div className="wave wave-1" />

                    {/* wave layer 2 (depth illusion) */}
                    <div className="wave wave-2" />
                </div>

                {/* TEXT */}
                <div className="relative z-10 text-center">
                    <h4 className="text-sm font-bold text-primary">{value}%</h4>
                    <p className="text-[10px] text-text-secondary">funded</p>
                </div>
            </div>
        </Motion>
    );
};

export default WaveProgressIndicator;
