import React from 'react';
import Hero from '../../components/common/Hero';
import aboutHeroImage from '../../assets/images/about/aboutHero.png';

import { HiArrowSmRight } from 'react-icons/hi';
import { TbHeartFilled } from 'react-icons/tb';
import AboutIntroSection from '../../components/about/AboutIntroSection';
import AboutPurposeSection from '../../components/about/AboutPurposeSection';

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
                        Connecting <span className="text-primary">Hope</span> To{' '}
                        <br /> Those Who Need It{' '}
                        <span className="text-accent">Most</span>
                    </>
                }
                description={
                    <>
                        Together, we can build a future where help, kindness,
                        and opportunity reach every community in need. Through
                        compassion and action, we can create real change for a
                        more hopeful tomorrow.”
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
                imageWidth="60%"
            />

            <AboutIntroSection />
            <AboutPurposeSection />
        </>
    );
};

export default About;
