import React from 'react';

// Icons
import { HiArrowSmRight } from 'react-icons/hi';
import { TbHeartFilled } from 'react-icons/tb';

// Reusable/shared components
import Hero from '@/components/Hero';

// Assets
import heroBG from '@/assets/home/hero/hero.jpg';

// Page sections
import HowItWorksSection from './sections/howItWorks/HowItWorks';
import ExploreCategories from './sections/exploreCategories/ExploreCategories';
import FeaturedCampaign from './sections/featuredCampaign/FeaturedCampaign';
import LocalImpact from './sections/localImpact/LocalImpact';
import ImpactTrust from './sections/impactTrust/ImpactTrust';

const Home = () => {
    return (
        <>
            <Hero
                lang="bn"
                badge="মানুষের পাশে, একসাথে"
                title={
                    <>
                        প্রয়োজনের পাশে,
                        <span className="block text-primary">
                            সহায়তার পথে।
                        </span>
                    </>
                }
                description="Stand For People মানুষ, দাতা, স্বেচ্ছাসেবী ও সংগঠনকে একসাথে যুক্ত করে—যাতে মানুষের প্রয়োজন যাচাই করে তা কার্যকর সহায়তায় রূপ দেওয়া যায়।"
                primaryCta={{
                    icon: <TbHeartFilled />,
                    label: 'সহায়তার আবেদন করুন',
                    to: '/request-help',
                }}
                secondaryCta={{
                    label: 'কীভাবে কাজ করে',
                    icon: <HiArrowSmRight />,
                    to: '/how-it-works',
                }}
                image={heroBG}
                imageAlt="মানুষের পাশে দাঁড়িয়ে সহায়তা পৌঁছে দিচ্ছেন স্বেচ্ছাসেবীরা"
                showStats
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
