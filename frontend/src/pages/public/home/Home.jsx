import React from 'react';

// Icons (external libraries)
import { TbHeartFilled, TbShieldCheck } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Reusable/shared components
import Hero from '@/components/Hero';

// Page sections
import HowItWorksSection from './sections/howCareLinkWorks/HowItWorksSection';
import FeaturedCampaign from './sections/featuredCampaign/FeaturedCampaign';

// Assets
import heroIllustration from '@/assets/home/heroIllustration.png';
import StatCard from '@/components/StatCard';

// Data
import statsData from './data/statsData';
import ExploreCategories from './sections/exploreCategories/ExploreCategories';
import LocalImpact from './sections/localImpact/LocalImpact';

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

            {/* STATS */}
            {statsData && (
                <div className="container-width hidden">
                    <StatCard
                        stats={statsData}
                        size="hero"
                        style="minimal"
                        variant="column"
                        align="center"
                        gridCols="grid-cols-2 lg:grid-cols-4"
                    />
                </div>
            )}
        </>
    );
};

export default Home;
