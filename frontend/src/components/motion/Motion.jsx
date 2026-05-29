import { motion } from 'framer-motion';
import React from 'react';

const variantsMap = {
    fadeUp: {
        hidden: {
            opacity: 0,
            y: 18,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    },

    scaleUp: {
        hidden: {
            opacity: 0,
            scale: 0.96,
        },
        show: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    },

    fadeLeft: {
        hidden: {
            opacity: 0,
            x: 20,
        },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    },

    fadeRight: {
        hidden: {
            opacity: 0,
            x: -20,
        },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    },

    lineReveal: {
        hidden: {
            width: 0,
            opacity: 0,
        },
        show: {
            width: 40,
            opacity: 1,
            transition: {
                duration: 0.4,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    },

    blurIn: {
        hidden: {
            opacity: 0,
            filter: 'blur(8px)',
            y: 10,
        },
        show: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    },
};

const Motion = ({
    as = 'div',
    variant = 'fadeUp',
    stagger = false,
    staggerDelay = 0.08,
    delayChildren = 0,
    className = '',
    children,
    whileHover,
    viewport = { once: true, amount: 0.3 },
    transition,
    ...props
}) => {
    const Comp = motion[as] || motion.div;

    const baseVariant = variantsMap[variant];

    const staggerContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: staggerDelay,
                delayChildren,
            },
        },
    };

    return (
        <Comp
            className={className}
            variants={stagger ? staggerContainer : baseVariant}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            whileHover={whileHover}
            transition={transition}
            {...props}
        >
            {children}
        </Comp>
    );
};

export default Motion;
