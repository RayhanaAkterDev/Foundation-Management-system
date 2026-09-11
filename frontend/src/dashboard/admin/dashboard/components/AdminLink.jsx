import React from 'react';

import { ArrowUpRight } from 'lucide-react';

const AdminLink = ({ icon: Icon, title, description, index, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                relative
                flex
                w-full
                min-w-0
                items-center
                gap-3
                border-t
                border-border
                py-4
                text-left
                transition-colors
                duration-200
                hover:bg-background
                focus:outline-none
                focus-visible:bg-background
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-primary
                sm:gap-4
                sm:py-4.25
                lg:gap-5
            "
        >
            {/* =================================================
                INDEX
            ================================================== */}
            <span
                className="
                    w-6
                    shrink-0
                    self-start
                    pt-1
                    font-poppins
                    text-[8px]
                    font-medium
                    tracking-widest
                    text-text-secondary/65
                    transition-colors
                    duration-200
                    group-hover:text-primary
                    sm:w-7
                    sm:text-[9px]
                "
            >
                {String(index + 1).padStart(2, '0')}
            </span>

            {/* =================================================
                ICON
            ================================================== */}
            <span
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    bg-background-alt
                    text-text-secondary
                    transition-all
                    duration-200
                    group-hover:bg-primary
                    group-hover:text-white
                    sm:h-10
                    sm:w-10
                "
            >
                <Icon
                    size={17}
                    strokeWidth={1.6}
                    className="sm:h-4.5 sm:w-4.5"
                />
            </span>

            {/* =================================================
                CONTENT
            ================================================== */}
            <span className="min-w-0 flex-1">
                <span
                    className="
                        block
                        truncate
                        font-fraunces
                        text-4.5
                        leading-[1.1]
                        tracking-tight
                        text-text-primary
                        transition-colors
                        duration-200
                        group-hover:text-primary
                        sm:text-[20px]
                        lg:text-[21px]
                    "
                >
                    {title}
                </span>

                <span
                    className="
                        mt-1
                        block
                        max-w-130
                        truncate
                        font-jost
                        text-[11px]
                        leading-normal
                        text-text-secondary
                        sm:text-[12px]
                    "
                >
                    {description}
                </span>
            </span>

            {/* =================================================
                ACTION
            ================================================== */}
            <span
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-border
                    text-text-secondary
                    transition-all
                    duration-200
                    group-hover:border-primary
                    group-hover:bg-primary
                    group-hover:text-white
                    sm:h-9
                    sm:w-9
                "
            >
                <ArrowUpRight
                    size={15}
                    strokeWidth={1.65}
                    className="
                        transition-transform
                        duration-200
                        group-hover:translate-x-px
                        group-hover:-translate-y-px
                    "
                />
            </span>

            {/* =================================================
                HOVER ACCENT
            ================================================== */}
            <span
                aria-hidden="true"
                className="
                    absolute
                    -bottom-px
                    left-0
                    h-0.5
                    w-0
                    bg-primary
                    transition-all
                    duration-300
                    group-hover:w-10
                "
            />
        </button>
    );
};

export default AdminLink;
