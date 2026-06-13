// sections/TrustSystem.jsx
import React from 'react';

const TrustSystem = () => {
    return (
        <section className="container-width grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-2xl font-semibold">Trust & Verification</h2>

                <ul className="mt-6 space-y-3 text-text-secondary">
                    <li>AI-assisted duplicate detection</li>
                    <li>Human review for critical cases</li>
                    <li>Structured request validation</li>
                    <li>Priority-based scoring system</li>
                </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface/40 h-80 flex items-center justify-center text-primary/30">
                verification flow diagram
            </div>
        </section>
    );
};

export default TrustSystem;
