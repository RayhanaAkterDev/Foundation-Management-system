import SectionHeading from '@/components/SectionHeading';
import React from 'react';

const CategoryHeader = ({ title, description }) => {
    return (
        <div className="mb-10">
            <SectionHeading
                gap="sm"
                align="left"
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
