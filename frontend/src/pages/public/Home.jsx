import React from 'react';
import '../../styles/index.css';
import Hero from '../../components/home/Hero';
import FeaturedCampaign from '../../components/home/featuredCampaign/FeaturedCampaign';

const Home = () => {
    return (
        <>
            <Hero />
            <FeaturedCampaign />
        </>
    );
};

export default Home;
