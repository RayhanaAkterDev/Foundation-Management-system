import OrganizationHero from './components/OrganizationHero';
import OrganizationTypes from './components/OrganizationTypes';
import OrganizationModels from './components/OrganizationModels';
import OrganizationImpact from './components/OrganizationImpact';
import OrganizationFAQ from './components/OrganizationFAQ';

const Organizations = () => {
    return (
        <main className="min-h-screen bg-surface section-gap">
            <OrganizationHero />
            <OrganizationTypes />
            <OrganizationModels />
            <OrganizationImpact />
            <OrganizationFAQ />
        </main>
    );
};

export default Organizations;
