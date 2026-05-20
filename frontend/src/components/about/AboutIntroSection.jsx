import React from 'react';
import SectionHeading from '../common/SectionHeading';
import {
    TbHeart,
    TbUsers,
    TbHeartHandshake,
    TbShieldCheck,
    TbLockHeart,
    TbTargetArrow,
} from 'react-icons/tb';
import aboutIntro from '../../assets/images/about/aboutIntro.png';
import { aboutStats } from '../../data/stats/aboutStats';
import StatCard from '../common/StatCard';

const AboutIntroSection = () => {
    return (
        <section className="section-gap bg-surface">
            <div className="container-width flex justify-center items-center gap-12 ">
                <div className="w-2/5 rounded-2xl">
                    <img
                        src={aboutIntro}
                        alt=""
                        className="w-full rounded-2xl"
                    />
                </div>

                <div className="w-3/5 ">
                    <SectionHeading
                        align="left"
                        gap="md"
                        headingTag="h2"
                        badge="Who we are"
                        badgeIcon={TbUsers}
                        badgeClass="badge-primary"
                        title={
                            <>
                                Bridging Generosity <br /> With{' '}
                                <span className="text-accent">Real Impact</span>
                            </>
                        }
                        description="CareLink is an AI-powered, community-driven platform that connects donors, volunteers, and communities to deliver help where it’s needed most. Through transparency, compassion, and smart coordination, we turn generosity into real, measurable impact."
                    />

                    <StatCard variant="column" stats={aboutStats} />
                </div>
            </div>
        </section>
    );
};

export default AboutIntroSection;
