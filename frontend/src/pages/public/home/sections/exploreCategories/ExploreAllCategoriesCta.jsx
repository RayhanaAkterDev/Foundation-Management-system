import React from 'react';
import { Link } from 'react-router-dom';

const ExploreAllCategoriesCta = ({ current }) => {
    return (
        <div className="pt-8 sm:pt-10 flex justify-end sm:pr-6 lg:pr-10">
            <div className="flex flex-col items-end gap-3 opacity-80 hover:opacity-100 transition">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-400">
                    View more
                </span>

                <div className="flex items-center gap-3">
                    <div
                        className="w-10 sm:w-12 h-px"
                        style={{ backgroundColor: current?.color || '#d1d5db' }}
                    />

                    <Link
                        to="/categories"
                        className="text-sm sm:text-base font-medium tracking-wide leading-relaxed"
                        style={{ color: current?.color || '#111827' }}
                    >
                        Browse all categories
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExploreAllCategoriesCta;
