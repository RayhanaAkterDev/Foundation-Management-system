// sections/ProblemContext.jsx
import React from 'react';
import SectionHeading from '@/components/SectionHeading';

const ProblemContext = () => {
    return (
        <section className="container-width grid md:grid-cols-2 gap-10 items-center bg-surface  rounded-2xl ">
            <div className="px-6 py-16">
                <SectionHeading align="left" title="Why this system exists" />

                <ul className="mt-6 text-lg space-y-3 text-text-secondary">
                    <li>
                        Unverified or duplicate requests slow down real help
                    </li>
                    <li>Lack of structured data leads to inefficiency</li>
                    <li>Donors cannot always verify authenticity</li>
                    <li>Urgent needs often lose priority signals</li>
                </ul>
            </div>

            {/* <div className="h-64 md:h-80 rounded-2xl bg-linear-to-br from-primary/5 to-transparent border border-border" /> */}
        </section>
    );
};

export default ProblemContext;
