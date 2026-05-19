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
                badge="Together, we create real change"
                badgeIcon={TbHeartFilled}
                title={
                    <>
                        Connecting <span className="text-primary">Care</span>
                        <span className="block">
                            And Changing{' '}
                            <span className="text-accent">Lives</span>
                        </span>
                    </>
                }
                description={
                    <>
                        A platform where kindness becomes action
                        <span className="block">
                            through smart donation and volunteer coordination.
                        </span>
                    </>
                }
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
