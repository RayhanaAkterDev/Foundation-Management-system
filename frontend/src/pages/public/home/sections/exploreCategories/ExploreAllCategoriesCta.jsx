import React from 'react';

import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExploreAllCategoriesCta = () => {
    return (
        <div className="mt-7">
            <Link
                to="/categories"
                className="
                    group
                    flex
                    items-center
                    justify-between
                    gap-5
                    pt-5
                    text-text-primary
                    transition-colors
                    duration-200
                    hover:text-primary
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary/25
                    focus-visible:ring-offset-4
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            font-bengali
                            text-[12px]
                            font-normal
                            leading-[1.8]
                            text-text-secondary
                        "
                    >
                        আরও ক্ষেত্র রয়েছে
                    </p>

                    <p
                        className="
                            mt-1
                            font-bengali
                            text-[15px]
                            font-medium
                            leading-[1.7]
                        "
                    >
                        সব সহায়তার ক্ষেত্র দেখুন
                    </p>
                </div>

                <span
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-border
                        text-primary
                        transition-all
                        duration-200
                        group-hover:border-primary/40
                        group-hover:bg-primary
                        group-hover:text-white!
                    "
                >
                    <ArrowUpRight
                        size={16}
                        strokeWidth={1.8}
                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5
                        "
                    />
                </span>
            </Link>
        </div>
    );
};

export default ExploreAllCategoriesCta;
