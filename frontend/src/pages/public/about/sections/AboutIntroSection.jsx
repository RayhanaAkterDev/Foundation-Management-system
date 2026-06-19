import React from 'react';
import { TbUsers } from 'react-icons/tb';
import aboutIntro from '@/assets/about/aboutIntro.png';

import SectionHeading from '@/components/SectionHeading';

const AboutIntroSection = () => {
    return (
        <section className="section-gap bg-surface">
            <div className="container-width flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                <div className="w-full lg:w-2/5">
                    <img
                        src={aboutIntro}
                        alt="About CareLink"
                        className="w-full rounded-2xl object-cover"
                    />
                </div>

                {/* CONTENT */}
                <div className="w-full lg:w-3/5">
                    <SectionHeading
                        align="center"
                        badge={{
                            label: 'Who we are',
                            variant: 'primary',
                            size: 'lg',
                        }}
                        title={
                            <>
                                Bridging{' '}
                                <span className="text-primary">Generosity</span>{' '}
                                <br />
                                With <span className="text-accent">
                                    Real
                                </span>{' '}
                                Impact
                            </>
                        }
                        headingSize="sectionHero"
                        description="CareLink is an AI-powered, community-driven platform that connects donors, volunteers, and communities to deliver help where it’s needed most. Through transparency, compassion, and smart coordination, we turn generosity into real, measurable impact."
                        descriptionSize="hero"
                        wrapperClass="lg:items-start lg:text-left"
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutIntroSection;
