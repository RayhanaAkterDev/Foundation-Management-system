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
                        <span className="sm:block inline">
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
                className="section-gap bg-cover bg-bottom bg-no-repeat"
                style={{ backgroundImage: `url(${bePartOfChange})` }}
            >
                <BePartOfChange />
                <AboutImpactSection />
            </section>
        </>
    );
};

export default About;
