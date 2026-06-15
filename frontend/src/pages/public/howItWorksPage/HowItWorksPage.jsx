import React from 'react';
import HowItWorksPageHero from './sections/HowItWorksPageHero';
import ProblemContext from './sections/ProblemContext';
import SystemOverview from './sections/SystemOverview';
import ProcessScenes from './sections/processScene/ProcessScenes';
import RoleBasedView from './sections/RoleBasedView/RoleBasedView';
import FinalCTA from './sections/FinalCTA';

const HowItWorksPage = () => {
    return (
        <>
            <HowItWorksPageHero />
            <ProblemContext />
            <SystemOverview />
            <ProcessScenes />
            <RoleBasedView />
            <FinalCTA />
        </>
    );
};

export default HowItWorksPage;
