import React, { useState } from 'react';
import RequestHero from './components/RequestHero';
import RequestForm from './components/RequestForm';
import RequestInfo from './components/RequestInfo';
import RequestSuccessModal from './components/RequestSuccessModal';

const RequestHelp = () => {
    const [success, setSuccess] = useState(false);

    return (
        <div className="min-h-screen bg-background pt-24 sm:pt-28 pb-16 sm:pb-20">
            <div className="container-width px-4 sm:px-6 lg:px-0">
                <RequestHero />

                {/* SAME CONTAINER — only responsive polish */}
                <div
                    className="
                    mt-10 sm:mt-12
                    rounded-2xl sm:rounded-[28px]
                    bg-surface
                    shadow-sm
                    overflow-hidden
                    border border-border
                "
                >
                    <div
                        className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[360px_1fr]
                    "
                    >
                        <RequestInfo />
                        <RequestForm setSuccess={setSuccess} />
                    </div>
                </div>

                {success && <RequestSuccessModal />}
            </div>
        </div>
    );
};

export default RequestHelp;
