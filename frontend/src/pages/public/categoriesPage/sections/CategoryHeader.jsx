import React from 'react';

const CategoryHeader = ({ title, description, activeCategory }) => {
    return (
        <div className="mb-10">
            {/* TOP BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                Active: {activeCategory}
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
                {title}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-text-secondary mt-3 max-w-2xl">{description}</p>

            {/* DECORATIVE LINE (subtle UI separation) */}
            <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
};

export default CategoryHeader;
