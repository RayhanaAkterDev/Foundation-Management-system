// sections/EdgeCases.jsx
import React from 'react';

const cases = [
    'What if no donor responds?',
    'How are fake requests handled?',
    'What happens during emergencies?',
    'Can requests be duplicated?',
];

const EdgeCases = () => {
    return (
        <section className="container-width">
            <h2 className="text-2xl font-semibold text-center">
                System Edge Cases
            </h2>

            <div className="mt-10 grid md:grid-cols-2 gap-4">
                {cases.map((c) => (
                    <div
                        key={c}
                        className="p-4 rounded-xl border border-border bg-surface/30"
                    >
                        {c}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EdgeCases;
