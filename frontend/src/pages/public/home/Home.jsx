import React from 'react';

// Icons (external libraries)
import {
    TbHeartFilled,
    TbShieldCheck,
    TbShieldCheckered,
    TbShieldCheckeredFilled,
    TbShieldCheckFilled,
} from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Reusable/shared components
import Hero from '@/components/Hero';

// Page sections
import FeaturedCampaign from './sections/featuredCampaign/FeaturedCampaign';

// Assets
import heroIllustration from '@/assets/home/heroIllustration.png';
import StatCard from '@/components/StatCard';

// Data
import statsData from './data/statsData';
import HowItWorksSection from './sections/howCareLinkWorks/HowItWorksSection';

const Home = () => {
    return (
        <>
            <Hero
                badge="Together, we make a real difference"
                badgeIcon={TbShieldCheck}
                badgeClass="badge-primary"
                title={
                    <>
                        Delivering <span className="text-primary">Support</span>
                        <span className="block">
                            Where It's
                            <span className="text-accent"> Needed Most</span>
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
            <FeaturedCampaign />

            {/* STATS */}
            {statsData && (
                <div className="container-width">
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
