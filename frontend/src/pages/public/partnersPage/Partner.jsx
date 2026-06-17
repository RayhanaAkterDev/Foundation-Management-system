import PartnerHero from './components/PartnerHero';
import PartnerTypes from './components/PartnerTypes';
import PartnerImpact from './components/PartnerImpact';
import PartnerModels from './components/PartnerModels';
import PartnerFAQ from './components/PartnerFAQ';
import PartnerForm from './components/PartnerForm';

const Partner = () => {
    return (
        <div className="min-h-screen bg-surface mt-14 md:mt-16 lg:mt-20">
            <PartnerHero />
            <PartnerTypes />
            <PartnerModels />
            <PartnerImpact />
            <PartnerFAQ />
            <PartnerForm />
        </div>
    );
};

export default Partner;
