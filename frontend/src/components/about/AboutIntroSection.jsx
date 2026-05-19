import React from 'react';
import SectionHeading from '../common/SectionHeading';
import {
    TbHeart,
    TbUsersGroup,
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
        <section className="section-gap">
            <div className="container-width flex justify-center items-center gap-12">
                <div className="w-2/5 rounded-2xl">
                    <img
                        src={aboutIntro}
                        alt=""
                        className="w-full rounded-2xl"
                    />
                </div>

                <div className="w-3/5 flex flex-col items-center">
                    <SectionHeading
                        align="left"
                        gap="sm"
                        headingTag="h2"
                        badge="Who we are"
                        badgeIcon={TbUsersGroup}
                        badgeClass="badge-primary"
                        title={
                            <>
                                Bridging{' '}
                                <span className="text-primary">Generosity</span>{' '}
                                With{' '}
                                <span className="text-accent">Real Impact</span>
                            </>
                        }
                        description="CareLink is an AI-enhanced, community-driven platform that connects donors, volunteers, and communities to ensure support reaches the people who need it most. Through transparency, compassion, and smart coordination, we transform generosity into real, measurable impact for communities in need."
                    />

                    <StatCard variant="column" stats={aboutStats} />
                </div>
            </div>
        </section>
    );
};

export default AboutIntroSection;
