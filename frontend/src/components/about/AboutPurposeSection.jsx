import React from 'react';
import Card from '../common/Card';
import SectionHeading from '../common/SectionHeading';

const AboutPurposeSection = () => {
    return (
        <section className="section-gap bg-[#F6FAFA] border-y border-primary/8">
            <div className="container-width flex flex-col items-center gap-12">
                {/* heading */}
                <SectionHeading
                    title="Why CareLink Exists"
                    description="We built CareLink to make giving more human,
                        transparent, and immediate — so support reaches people
                        when it matters most."
                />

                {/* cards */}
                <Card />
            </div>
        </section>
    );
};

export default AboutPurposeSection;
