import { motion } from 'framer-motion';
import React from 'react';

const easing = [0.22, 1, 0.36, 1];

/* =========================
   VARIANTS
========================= */

const variantsMap = {
    fadeUp: {
        hidden: {
            opacity: 0,
            y: 24,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.55,
                ease: easing,
            },
        },
    },

    fadeDown: {
        hidden: {
            opacity: 0,
            y: -24,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.55,
                ease: easing,
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
                duration: 0.45,
                ease: easing,
            },
        },
    },

    fadeLeft: {
        hidden: {
            opacity: 0,
            x: -24,
        },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: easing,
            },
        },
    },

    fadeRight: {
        hidden: {
            opacity: 0,
            x: 24,
        },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: easing,
            },
        },
    },

    softLift: {
        hidden: {
            opacity: 0,
            y: 16,
            scale: 0.985,
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: easing,
            },
        },
    },

    fadeIn: {
        hidden: {
            opacity: 0,
        },
        show: {
            opacity: 1,
            transition: {
                duration: 0.45,
                ease: easing,
            },
        },
    },

    /* safer blur usage (ONLY for hero text / big headings) */
    blurIn: {
        hidden: {
            opacity: 0,
            y: 10,
            filter: 'blur(6px)',
        },
        show: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.55,
                ease: easing,
            },
        },
    },
};

/* =========================
   COMPONENT
========================= */

const Motion = ({
    as = 'div',
    variant = 'fadeUp',

    stagger = false,
    staggerDelay = 0.12,
    delayChildren = 0,

    className = '',
    children,

    whileHover,

    viewport = {
        once: true,
        amount: 0.2,
    },

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
