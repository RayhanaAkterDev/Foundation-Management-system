import React from 'react';

import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ExploreAllCategoriesCta = () => {
    return (
        <div className="pt-8">
            <Link
                to="/categories"
                className="
                        group flex items-center justify-between gap-4
                        text-text-primary
                        transition-colors duration-300
                        hover:text-primary
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/25
                        focus-visible:ring-offset-4
                    "
            >
                <div className="min-w-0">
                    <p className="font-bengali text-[13px] font-medium leading-[1.7] text-text-secondary">
                        আরও সহায়তার ক্ষেত্র
                    </p>

                    <p className="mt-1 font-bengali text-[15px] sm:text-base font-medium leading-[1.6]">
                        সব বিভাগ দেখুন
                    </p>
                </div>

                <span
                    className="
                            flex h-10 w-10 shrink-0 items-center justify-center
                            rounded-full border border-border
                            text-primary
                            transition-all duration-300
                            group-hover:border-primary/35
                            group-hover:bg-primary
                            group-hover:text-white
                            group-hover:-translate-y-0.5
                        "
                >
                    <ArrowUpRight
                        size={17}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </span>
            </Link>
        </div>
    );
};

export default ExploreAllCategoriesCta;
