import React from 'react';

// reuseable components
import Hero from '@/components/Hero';

// react icons
import { HiArrowSmRight } from 'react-icons/hi';
import { TbHeartFilled } from 'react-icons/tb';

// sections
import AboutIntroSection from './sections/AboutIntroSection';
import AboutPurposeSection from './sections/AboutPurposeSection';
import AboutImpactSection from './sections/AboutImpactSection';
import BePartOfChange from './sections/BePartOfChange';

// assets->images
import aboutHeroImage from '@/assets/about/aboutHero.png';
import bePartOfChange from '@/assets/about/bePartOfChange.png';

const About = () => {
    return (
        <>
            <Hero
                align="left"
                title={
                    <>
                        Connecting <span className="text-primary">hope</span>{' '}
                        where it’s needed{' '}
                        <span className="text-accent">most</span>
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

            <section className="bg-primary">
                <AboutImpactSection />
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
