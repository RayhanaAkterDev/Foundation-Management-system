import VolunteerHero from './components/VolunteerHero';
import VolunteerRoles from './components/VolunteerRoles.jsx';
import VolunteerJourney from './components/VolunteerJourney';
import VolunteerBenefits from './components/VolunteerBenefits';
import VolunteerStories from './components/VolunteerStories.jsx';
import VolunteerCTA from './components/VolunteerCTA';
import VolunteerForm from './components/VolunteerForm';
import VolunteerFAQ from './components/VolunteerFAQ';

const Volunteer = () => {
    return (
        <main>
            <VolunteerHero />
            <VolunteerRoles />
            <VolunteerJourney />
            <VolunteerBenefits />
            <VolunteerStories />
            <VolunteerCTA />
            <VolunteerForm />
            <VolunteerFAQ />
        </main>
    );
};

export default Volunteer;
