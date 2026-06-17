import React, { useState } from 'react';
import RequestHero from './components/RequestHero';
import RequestForm from './components/RequestForm';
import RequestSuccessModal from './components/RequestSuccessModal';

const RequestHelp = () => {
    const [success, setSuccess] = useState(false);

    return (
        <div className="min-h-screen bg-surface pt-28 pb-20">
            <div className="container-width max-w-4xl">
                <RequestHero />

                <RequestForm setSuccess={setSuccess} />

                {success && (
                    <RequestSuccessModal />
                )}
            </div>
        </div>
    );
};

export default RequestHelp;