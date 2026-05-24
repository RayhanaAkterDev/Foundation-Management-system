import React from 'react';
import Card from '../common/Card';
import SectionHeading from '../common/SectionHeading';

const AboutPurposeSection = () => {
    return (
        <section className="section-gap bg-gradient-to-b from-surface via-white to-primary/5 border-t border-border">
            <div className="container-width flex flex-col items-center gap-10 md:gap-12">

                <SectionHeading
                    title="Why CareLink Exists"
                    headingClass="text-primary"
                    description="We built CareLink to make giving more human, transparent, and immediate — so support reaches people when it matters most."
                />

                <Card />

            </div>
        </section>
    );
};

export default AboutPurposeSection;