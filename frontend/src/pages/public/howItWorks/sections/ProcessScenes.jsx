// sections/process/ProcessScenes.jsx
import React from 'react';
import ProcessScene from './ProcessScene';

const ProcessScenes = () => {
    return (
        <section className="space-y-28">
            <ProcessScene
                step="01"
                title="Need Capture"
                desc="Users report urgent needs through structured location-based input."
                mock="form"
            />

            <ProcessScene
                step="02"
                title="Structuring Engine"
                desc="Raw input is transformed into structured, actionable data."
                mock="json"
            />

            <ProcessScene
                step="03"
                title="Verification System"
                desc="AI + human validation ensures authenticity and removes duplicates."
                mock="check"
            />

            <ProcessScene
                step="04"
                title="Support Delivery"
                desc="Matched donors and volunteers fulfill verified requests efficiently."
                mock="network"
                reverse
            />
        </section>
    );
};

export default ProcessScenes;
