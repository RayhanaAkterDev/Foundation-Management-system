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
                mt-10
                flex
                justify-center
                sm:mt-12
                md:mt-14
                lg:mt-12
                xl:mt-16
            "
        >
            <Link
                to="/how-it-works"
                className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-primary/15
                    bg-surface/70
                    px-5
                    py-2.5
                    font-bengali
                    text-[15px]
                    font-medium
                    leading-none
                    text-text-primary
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-primary/30
                    hover:bg-surface
                    hover:text-primary
                    hover:shadow-[0_8px_24px_rgba(15,118,110,0.08)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary/25
                    focus-visible:ring-offset-4
                    sm:text-[16px]
                    lg:text-[17px]
                "
            >
                <span
                    className="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-primary/65
                        transition-transform
                        duration-300
                        group-hover:scale-125
                    "
                />

                <span>কীভাবে কাজ করে দেখুন</span>

                <TbArrowNarrowRight
                    size={20}
                    strokeWidth={1.7}
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
