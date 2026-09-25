import React from 'react';

// Icons
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

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
                title={
                    <>
                        প্রয়োজনের পাশে,
                        <span className="text-primary block">
                            সহায়তার পথে।
                        </span>
                    </>
                }
                description="Stand For People এমন একটি মানবিক সহায়তা প্ল্যাটফর্ম, যেখানে প্রয়োজনে থাকা মানুষ, স্বেচ্ছাসেবী, দাতা ও সংগঠন একসাথে কাজ করে—যাতে প্রয়োজনের সময় সঠিক সহায়তা সঠিক মানুষের কাছে পৌঁছে যায়।"
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
