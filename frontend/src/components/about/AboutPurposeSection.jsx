import React from 'react';
import Card from '../common/Card';

const AboutPurposeSection = () => {
    return (
        <section className="section-gap border border-primary/10 ">
            <div className="container-width">
                {/* Main Purpose Block */}
                <div className="px-10">
                    <h2 className="text-3xl font-semibold text-text-primary">
                        Why CareLink Exists
                    </h2>

                    <p className="mt-4 text-text-secondary leading-relaxed max-w-3xl">
                        CareLink is built to make support more transparent,
                        direct, and human. Every feature exists to ensure help
                        reaches the right people at the right time.
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-8">
                    <Card />
                </div>
            </div>
        </section>
    );
};

export default AboutPurposeSection;
