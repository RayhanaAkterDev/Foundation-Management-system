import React from 'react';
import { Link } from 'react-router-dom';

const ExploreAllCategoriesCta = () => {
    return (
        <div className="pt-5 sm:pt-6 pl-1 sm:pl-6 lg:pl-20">
            <Link
                to="/categories"
                className="
                    group inline-flex items-center gap-2
                    text-primary font-medium text-sm sm:text-base hover:text-accent
                    transition-all duration-200
                "
            >
                Explore all impact areas
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                </span>
            </Link>
        </div>
    );
};

export default ExploreAllCategoriesCta;
