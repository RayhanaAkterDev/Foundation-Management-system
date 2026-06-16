import React from 'react';

// Icons (external libraries)
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Reusable/shared components
import Hero from '@/components/Hero';

// Assets
import heroBG from '@/assets/home/hero/hero.jpg';

// Page sections
import HowItWorksSection from './sections/howItWorks/HowItWorks';
import ExploreCategories from './sections/exploreCategories/ExploreCategories';
// import FeaturedCampaign from './sections/featuredCampaign/FeaturedCampaign';
// import LocalImpact from './sections/localImpact/LocalImpact';
// import ImpactTrust from './sections/impactTrust/ImpactTrust';

const Home = () => {
    return (
        <>
            <Hero
                title={
                    <>
                        Requests become action.
                        <span className="text-primary block">
                            In real time.
                        </span>
                    </>
                }
                description="Stand For People connects real human needs with real-time community support — making it easier to request help, coordinate volunteers, and track aid delivery transparently from start to finish."
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

            <HowItWorksSection />
            <ExploreCategories />
            
            {/*<FeaturedCampaign />
            <LocalImpact />
            <ImpactTrust /> */}
        </>
    );
};

export default Home;
