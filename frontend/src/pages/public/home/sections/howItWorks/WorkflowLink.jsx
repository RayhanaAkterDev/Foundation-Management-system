import React from 'react';
import { Link } from 'react-router-dom';
import Motion from '@/components/motion/Motion';
import { TbArrowNarrowRight } from 'react-icons/tb';

const WorkflowLink = () => {
    return (
        <Motion
            variant="fadeUp"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-12 md:mt-14 lg:mt-16 flex justify-center"
        >
            <Link
                to="/how-it-works"
                className="
                    group inline-flex items-center gap-3
                    text-sm sm:text-[15px] font-medium text-primary/80
                "
            >
                <span className="relative">
                    <span className="group-hover:text-accent/80 transition">
                        See how CareLink works
                    </span>

                    <span className="absolute left-0 -bottom-1 w-full h-px bg-linear-to-r from-primary/30 via-primary/15 to-transparent group-hover:from-accent/60 group-hover:via-accent/30 transition" />
                </span>

                <TbArrowNarrowRight
                    size={18}
                    className="text-primary/50 group-hover:text-accent/90 group-hover:translate-x-1 transition"
                />
            </Link>
        </Motion>
    );
};

export default WorkflowLink;
