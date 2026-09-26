import React from 'react';

import { Link } from 'react-router-dom';

import Motion from '@/components/motion/Motion';

import { TbArrowNarrowRight } from 'react-icons/tb';

const WorkflowLink = () => {
    return (
        <Motion
            variant="fadeUp"
            viewport={{ once: true, amount: 0.3 }}
            className="
                mt-10
                sm:mt-12
                lg:mt-14
                flex
                justify-center
            "
        >
            <Link
                to="/how-it-works"
                className="
                    group
                    inline-flex
                    items-center
                    gap-2.5

                    text-sm
                    sm:text-[15px]
                    font-medium
                    text-text-secondary

                    transition-colors
                    duration-200

                    hover:text-primary
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary/25
                    focus-visible:ring-offset-4
                "
            >
                <span className="relative">
                    <span>কীভাবে কাজ করে দেখুন</span>

                    <span
                        className="
                            absolute
                            -bottom-1
                            left-0
                            h-px
                            w-full
                            origin-left
                            scale-x-0
                            bg-primary/60

                            transition-transform
                            duration-300
                            ease-out

                            group-hover:scale-x-100
                        "
                    />
                </span>

                <TbArrowNarrowRight
                    size={19}
                    strokeWidth={1.8}
                    className="
                        shrink-0
                        text-primary/60

                        transition-all
                        duration-300

                        group-hover:translate-x-1
                        group-hover:text-primary
                    "
                />
            </Link>
        </Motion>
    );
};

export default WorkflowLink;
