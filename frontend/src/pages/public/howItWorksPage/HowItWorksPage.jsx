import React from 'react';
import HowItWorksPageHero from './sections/HowItWorksPageHero';
import ProblemContext from './sections/ProblemContext';
import SystemOverview from './sections/SystemOverview';
import ProcessScenes from './sections/processScene/ProcessScenes';
import FinalCTA from './sections/FinalCTA';

const HowItWorksPage = () => {
    return (
        <>
            <HowItWorksPageHero />
            <ProblemContext />
            <SystemOverview />
            <ProcessScenes />
            <FinalCTA />
        </>
    );
};

export default HowItWorksPage;
