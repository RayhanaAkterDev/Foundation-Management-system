import React from 'react';
import { Link } from 'react-router-dom';

const ExploreAllCategoriesCta = ({ current }) => {
    return (
        <div className="pt-6 sm:pt-8 flex justify-end sm:pr-6 lg:pr-10">
            <div className="flex flex-col items-end gap-2 opacity-80 hover:opacity-100 transition">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    View more
                </span>

                <div className="flex items-center gap-3">
                    <div
                        className="w-8 sm:w-10 h-px"
                        style={{ backgroundColor: current?.color || '#d1d5db' }}
                    />

                    <Link
                        to="/categories"
                        className="text-sm sm:text-base font-medium tracking-wide"
                        style={{ color: current?.color || '#111827' }}
                    >
                        Explore full impact map
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ExploreAllCategoriesCta;
