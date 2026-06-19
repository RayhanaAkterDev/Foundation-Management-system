import React from 'react';
import SectionHeading from '@/components/SectionHeading';

const RequestHero = () => {
    return (
        <section className="text-center max-w-2xl mx-auto">
            <div className="mt-4 sm:mt-8 lg:mt-12">
                <SectionHeading
                    title="Request Assistance"
                    headingSize="sectionHero"
                    headingClass="text-text-primary"
                    description="Submit your request and our team will review it carefully to connect you with support."
                    descriptionSize="hero"
                />
            </div>

            <p className="mt-5 text-sm sm:text-base text-primary">
                Confidential • Verified review • Priority-based assistance
            </p>
        </section>
    );
};

export default RequestHero;
