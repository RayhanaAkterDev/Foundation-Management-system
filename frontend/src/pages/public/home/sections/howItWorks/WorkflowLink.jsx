import React from 'react';

import { Link } from 'react-router-dom';
import { TbArrowNarrowRight } from 'react-icons/tb';

import Motion from '@/components/motion/Motion';

const WorkflowLink = () => {
    return (
        <Motion
            variant="fadeUp"
            viewport={{ once: true, amount: 0.3 }}
            className="
                mt-12
                flex
                justify-center
                sm:mt-14
                md:mt-16
                lg:mt-14
                xl:mt-18
            "
        >
            <Link
                to="/how-it-works"
                className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    font-bengali
                    text-[15px]
                    font-medium
                    leading-[1.7]
                    text-text-secondary
                    transition-colors
                    duration-300
                    hover:text-primary
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary/25
                    focus-visible:ring-offset-4
                    sm:text-[16px]
                    lg:text-[17px]
                "
            >
                <span>কীভাবে কাজ করে দেখুন</span>

                <TbArrowNarrowRight
                    size={22}
                    strokeWidth={1.5}
                    className="
                        shrink-0
                        text-primary
                        transition-transform
                        duration-300
                        group-hover:translate-x-1.5
                    "
                />
            </Link>
        </Motion>
    );
};

export default WorkflowLink;
