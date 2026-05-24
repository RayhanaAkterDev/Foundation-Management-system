import React from 'react';
import SectionHeading from '../common/SectionHeading';
import { TbUsers } from 'react-icons/tb';

import aboutIntro from '../../assets/images/about/aboutIntro.png';

import { aboutStats } from '../../data/stats/aboutStats';
import StatCard from '../common/StatCard';

const AboutIntroSection = () => {
    return (
        <section className="section-gap bg-surface">
            <div className="container-width flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* CONTENT */}
                <div className="order-1 lg:order-2 w-full lg:w-3/5">
                    <SectionHeading
                        align="center"
                        badge="Who we are"
                        badgeIcon={TbUsers}
                        badgeClass="badge-primary"
                        title={
                            <>
                                Bridging Generosity <br />
                                With{' '}
                                <span className="text-accent">Real Impact</span>
                            </>
                        }
                        description="CareLink is an AI-powered, community-driven platform that connects donors, volunteers, and communities to deliver help where it’s needed most. Through transparency, compassion, and smart coordination, we turn generosity into real, measurable impact."
                        wrapperClass="lg:items-start lg:text-left"
                    />

                    {/* IMAGE */}
                    <div className="mt-8 lg:hidden w-full sm:w-[90%] md:w-[80%] mx-auto">
                        <img
                            src={aboutIntro}
                            alt=""
                            className="w-full rounded-2xl object-cover"
                        />
                    </div>

                    {/* STATS */}
                    <StatCard variant="column" stats={aboutStats} />
                </div>

                {/* DESKTOP IMAGE */}
                <div className="hidden lg:block order-1 w-full lg:w-2/5 shrink-0">
                    <img
                        src={aboutIntro}
                        alt=""
                        className="w-full rounded-2xl object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutIntroSection;
