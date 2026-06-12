import React from 'react';

// Icons (external libraries)
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Reusable/shared components
import Hero from '@/components/Hero';

// Assets
import heroBG from '@/assets/home/hero/heroBG.png';

// Page sections
// import HowItWorksSection from './sections/howCareLinkWorks/HowItWorksSection';
// import FeaturedCampaign from './sections/featuredCampaign/FeaturedCampaign';
// import ExploreCategories from './sections/exploreCategories/ExploreCategories';
// import LocalImpact from './sections/localImpact/LocalImpact';
// import ImpactTrust from './sections/impactTrust/ImpactTrust';

const Home = () => {
    return (
        <>
            <Hero
                title={
                    <>
                        Real Needs. <span className="block">Real People.</span>
                        <span className="text-primary block">
                            Real Response.
                        </span>
                    </>
                }
                description="CareLink helps communities report urgent needs, coordinate support, and track aid from request to delivery."
                primaryCta={{
                    icon: <TbHeartFilled />,
                    label: 'Request Help',
                }}
                secondaryCta={{
                    label: 'See How It Works',
                    icon: <HiArrowSmRight />,
                }}
                image={heroBG}
                showStats={true}
            />
            {/* <HowItWorksSection />
            <ExploreCategories />
            <FeaturedCampaign />
            <LocalImpact />
            <ImpactTrust /> */}
        </>
    );
};

export default Home;
