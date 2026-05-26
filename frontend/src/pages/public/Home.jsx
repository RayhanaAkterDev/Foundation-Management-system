import React from 'react';
import Hero from '../../components/common/Hero';
import FeaturedCampaign from '../../components/home/featuredCampaign/FeaturedCampaign';
import heroIllustration from '../../assets/images/home/heroIllustration.png';

import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

const Home = () => {
    return (
        <>
            <Hero
                badge="Turning compassion into real-world impact"
                badgeIcon={TbHeartFilled}
                title={
                    <>
                        Connecting Care
                        <span className="block">
                            Delivering Help in Real Time
                        </span>
                    </>
                }
                description="A transparent platform that connects donors, volunteers,
                        and communities to deliver food, medicine, and urgent
                        support where it's needed most."
                primaryCta={{
                    label: 'Donate Now',
                    icon: <TbHeartFilled />,
                }}
                secondaryCta={{
                    label: 'Learn More',
                    icon: <HiArrowSmRight />,
                }}
                image={heroIllustration}
                showStats={true}
            />

            <FeaturedCampaign />
        </>
    );
};

export default Home;
