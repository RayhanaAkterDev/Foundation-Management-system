import React from 'react';
import Hero from '../../components/common/Hero';
import aboutHeroImage from '../../assets/images/about/aboutHero.png';

import { HiArrowSmRight } from 'react-icons/hi';
import { TbHeartFilled } from 'react-icons/tb';
import AboutIntroSection from '../../components/about/AboutIntroSection';
import AboutPurposeSection from '../../components/about/AboutPurposeSection';
import AboutImpactSection from '../../components/about/AboutImpactSection';

const About = () => {
    return (
        <>
            <Hero
                bgClass="bg-[#F4F3F2]"
                align="left"
                badge="About CareLink"
                badgeIcon={TbHeartFilled}
                title={
                    <>
                        Connecting <span className="text-primary">hope</span>{' '}
                        <br />
                        with people who <br /> need it{' '}
                        <span className="text-accent">most</span>
                    </>
                }
                description={
                    <>
                        CareLink connects donors, volunteers, and communities
                        through transparent support systems that turn compassion
                        into measurable change.”
                    </>
                }
                primaryCta={{
                    label: 'Our Mission',
                    icon: <TbHeartFilled />,
                }}
                secondaryCta={{
                    label: 'Impact Stories',
                    icon: <HiArrowSmRight />,
                }}
                image={aboutHeroImage}
                imageWidth="80%"
            />

            <AboutIntroSection />
            <AboutPurposeSection />
            <AboutImpactSection />
        </>
    );
};

export default About;
