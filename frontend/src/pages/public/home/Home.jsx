import React from 'react';

// Icons (external libraries)
import { TbHeartFilled } from 'react-icons/tb';
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

const Home = () => {
    return (
        <>
            <Hero
                badge="Bringing donors, volunteers & communities together"
                badgeIcon={TbHeartFilled}
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
                description="CareLink brings donors, volunteers, and communities together to deliver food, medical aid, and emergency support to people who need it most."
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

            {/* STATS */}
            {statsData && (
                <div className="container-width mt-14 lg:mt-16">
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
            <FeaturedCampaign />
        </>
    );
};

export default Home;
