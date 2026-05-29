import { motion } from 'framer-motion';
import React from 'react';

const easing = [0.22, 1, 0.36, 1];

const variantsMap = {
    fadeUp: {
        hidden: {
            opacity: 0,
            y: 36,
        },

        show: {
            opacity: 1,
            y: 0,

            transition: {
                duration: 0.75,
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
            x: 32,
        },

        show: {
            opacity: 1,
            x: 0,

            transition: {
                duration: 0.55,
                ease: easing,
            },
        },
    },

    fadeRight: {
        hidden: {
            opacity: 0,
            x: -32,
        },

        show: {
            opacity: 1,
            x: 0,

            transition: {
                duration: 0.55,
                ease: easing,
            },
        },
    },

    blurIn: {
        hidden: {
            opacity: 0,
            filter: 'blur(8px)',
            y: 16,
        },

        show: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,

            transition: {
                duration: 0.6,
                ease: easing,
            },
        },
    },

    lineReveal: {
        hidden: {
            scaleX: 0,
            opacity: 0,
        },

        show: {
            scaleX: 1,
            opacity: 1,

            transition: {
                duration: 1,
                ease: easing,
                delay: 0.15,
            },
        },
    },

    widthReveal: {
        hidden: {
            width: 0,
            opacity: 0,
        },

        show: {
            width: 56,
            opacity: 1,

            transition: {
                duration: 0.65,
                delay: 0.2,
                ease: easing,
            },
        },
    },

    softLift: {
        hidden: {
            opacity: 0,
            y: 14,
            scale: 0.98,
        },

        show: {
            opacity: 1,
            y: 0,
            scale: 1,

            transition: {
                duration: 0.6,
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
                duration: 0.5,
                ease: easing,
            },
        },
    },
};

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
        amount: 0.12,
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
