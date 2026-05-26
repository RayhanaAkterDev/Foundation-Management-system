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
                badge="Bringing donors, volunteers & communities together"
                badgeIcon={TbHeartFilled}
                title={
                    <>
                        Delivering <span className="text-primary">Support</span>
                        <span className="block">
                            Where It’s
                            <span className="text-accent"> Needed Most</span>
                        </span>
                    </>
                }
                description="CareLink brings donors, volunteers, and communities together to deliver food, medical aid, and emergency support to people who need it most."
                primaryCta={{
                    label: 'Donate Now',
                    icon: <TbHeartFilled />,
                }}
                secondaryCta={{
                    label: 'How It Works',
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
