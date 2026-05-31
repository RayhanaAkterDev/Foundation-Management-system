import React from 'react';

// Icons (external libraries)
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Reusable/shared components
import Hero from '@/components/Hero';

// Assets
import heroIllustration from '@/assets/home/heroIllustration.png';

// Page sections
import HowItWorksSection from './sections/howCareLinkWorks/HowItWorksSection';
import FeaturedCampaign from './sections/featuredCampaign/FeaturedCampaign';
import ExploreCategories from './sections/exploreCategories/ExploreCategories';
import LocalImpact from './sections/localImpact/LocalImpact';
import ImpactTrust from './sections/impactTrust/ImpactTrust';

const Home = () => {
    return (
        <>
            <Hero
                badge={{
                    label: 'Support that matters',
                    variant: 'primary',
                    tone: 'soft',
                    size: 'lg',
                }}
                title={
                    <>
                        Deliver <span className="text-primary">Supports</span>
                        <span className="block">
                            Where It's{' '}
                            <span className="text-accent">Needed Most</span>
                        </span>
                    </>
                }
                description="A network for fast, coordinated humanitarian support."
                primaryCta={{
                    icon: <TbHeartFilled />,
                    label: 'I Want to Help',
                }}
                secondaryCta={{
                    label: 'See How It Works',
                    icon: <HiArrowSmRight />,
                }}
                image={heroIllustration}
                showStats={true}
            />

            <HowItWorksSection />
            <ExploreCategories />
            <FeaturedCampaign />
            <LocalImpact />
            <ImpactTrust />
        </>
    );
};

export default Home;
