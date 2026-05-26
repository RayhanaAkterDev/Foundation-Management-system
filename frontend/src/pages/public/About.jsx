import React from 'react';
import Hero from '../../components/common/Hero';
import aboutHeroImage from '../../assets/images/about/aboutHero.png';

import { HiArrowSmRight } from 'react-icons/hi';
import { TbHeartFilled } from 'react-icons/tb';

import AboutIntroSection from '../../components/about/AboutIntroSection';
import AboutPurposeSection from '../../components/about/AboutPurposeSection';
import AboutImpactSection from '../../components/about/AboutImpactSection';
import BePartOfChange from '../../components/about/BePartOfChange';

import bePartOfChange from '../../assets/images/about/bePartOfChange.png';
import aboutImpacts from '../../assets/images/about/aboutImpacts.jpg';

const About = () => {
    return (
        <>
            <Hero
                bgClass="bg-[#F4F3F2]"
                align="left"
                badge="About CareLink"
                badgeIcon={TbHeartFilled}
                badgeClass="text-accent"
                title={
                    <>
                        Connecting <span className="text-primary">hope</span>{' '}
                        with
                        <span className="block">
                            {' '}
                            people who need it{' '}
                            <span className="text-accent">most</span>
                        </span>
                    </>
                }
                description="CareLink connects donors, volunteers, and communities through a transparent system that turns compassion into measurable, real-world impact with clarity and trust."
                primaryCta={{
                    label: 'Discover Mission',
                    icon: TbHeartFilled,
                }}
                secondaryCta={{
                    label: 'See Impact Stories',
                    icon: HiArrowSmRight,
                }}
                image={aboutHeroImage}
                showStats={false}
            />

            <AboutIntroSection />
            <AboutPurposeSection />

            <section
                className="relative overflow-hidden bg-cover bg-top bg-no-repeat section-gap"
                style={{ backgroundImage: `url(${aboutImpacts})` }}
            >
                {/* overlay */}
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                {/* content */}
                <div className="relative z-10">
                    <AboutImpactSection />
                </div>
            </section>

            <section
                className="relative overflow-hidden bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: `url(${bePartOfChange})` }}
            >
                {/* overlay */}
                <div className="absolute inset-0 bg-white/10"></div>

                <div className="relative">
                    <BePartOfChange />
                </div>
            </section>
        </>
    );
};

export default About;
