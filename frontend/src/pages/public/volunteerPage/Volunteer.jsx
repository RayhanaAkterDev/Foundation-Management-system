import { useState } from 'react';

import VolunteerHero from './components/VolunteerHero';
import VolunteerRoles from './components/VolunteerRoles.jsx';
import VolunteerJourney from './components/VolunteerJourney';
import VolunteerBenefits from './components/VolunteerBenefits';
import VolunteerStories from './components/VolunteerStories.jsx';
import VolunteerCTA from './components/VolunteerCTA';
import VolunteerForm from './components/VolunteerForm';
import VolunteerFAQ from './components/VolunteerFAQ';

const Volunteer = () => {
    const [focusForm, setFocusForm] = useState(false);
    return (
        <main>
            <VolunteerHero />
            <VolunteerRoles />
            <VolunteerBenefits />
            <VolunteerJourney />
            <VolunteerStories />

            <VolunteerCTA onClickJoin={() => setFocusForm(true)} />
            <VolunteerForm focus={focusForm} />
            <VolunteerFAQ />
        </main>
    );
};

export default Volunteer;
