import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel/RightPanel';

const LocalImpact = () => {
    return (
        <section className="">
            <div className="container-width section-gap">
                <SectionHeading
                    title="Needs Emerging Around You"
                    headingSize="sectionHero"
                    description="See urgent requests and ongoing community needs in nearby areas, and discover where help is needed most right now."
                />

                <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8 items-start">
                    <LeftPanel />
                    <RightPanel />
                </div>
            </div>
        </section>
    );
};

export default LocalImpact;
