import React from 'react';
import HowItWorksPageHero from './sections/HowItWorksPageHero';
import ProblemContext from './sections/ProblemContext';
import SystemOverview from './sections/SystemOverview';
import ProcessScenes from './sections/processScene/ProcessScenes';

const HowItWorksPage = () => {
    return (
        <>
            <HowItWorksPageHero />
            <ProblemContext />
            <SystemOverview />
            <ProcessScenes />
        </>
    );
};

export default HowItWorksPage;
