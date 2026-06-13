// sections/RoleBasedView.jsx
import React, { useState } from 'react';

const tabs = ['Requester', 'Donor', 'Volunteer', 'Admin'];

const RoleBasedView = () => {
    const [active, setActive] = useState('Requester');

    return (
        <section className="container-width text-center">
            <h2 className="text-2xl font-semibold">Who uses SP?</h2>

            <div className="mt-8 flex justify-center gap-3 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={`
                            px-4 py-2 rounded-full border text-sm
                            ${active === tab ? 'bg-primary text-white' : 'border-border'}
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-10 text-text-secondary">
                {active === 'Requester' &&
                    'Submit needs and track support status.'}
                {active === 'Donor' &&
                    'Browse verified requests and contribute safely.'}
                {active === 'Volunteer' &&
                    'Receive tasks based on location and urgency.'}
                {active === 'Admin' &&
                    'Monitor system health and validate requests.'}
            </div>
        </section>
    );
};

export default RoleBasedView;
