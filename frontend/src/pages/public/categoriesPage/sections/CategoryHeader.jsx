import SectionHeading from '@/components/SectionHeading';
import React from 'react';

const CategoryHeader = ({ title, description, activeCategory }) => {
    return (
        <div className="mb-10">
            {/* TOP BADGE */}

            <SectionHeading
                gap="sm"
                align="left"
                badge={'Active: ' + activeCategory}
                title={title}
                headingSize="sectionHero"
                description={description}
                descriptionSize="hero"
            />

            {/* DECORATIVE LINE (subtle UI separation) */}
            <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
        </div>
    );
};

export default CategoryHeader;
