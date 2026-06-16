import React, { useEffect } from 'react';

// eslint-disable-next-line no-unused-vars
import { motion, useInView, useAnimation } from 'framer-motion';

const ProgressBar = ({ value = 62 }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start({
                width: `${value}%`,
                transition: {
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                },
            });
        }
    }, [isInView, value, controls]);

    return (
        <div>
            <div
                ref={ref}
                className="h-3 overflow-hidden rounded-full bg-primary/10"
            >
                <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={controls}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
