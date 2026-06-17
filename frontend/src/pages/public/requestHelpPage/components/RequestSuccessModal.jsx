import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbCheck } from 'react-icons/tb';

const RequestSuccessModal = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 2500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl text-center max-w-sm shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <TbCheck className="text-green-600 text-3xl" />
                </div>

                <h2 className="text-xl font-semibold">Request Submitted</h2>

                <p className="text-sm text-text-secondary mt-2">
                    Authority will contact you soon.
                </p>

                <p className="text-xs mt-4 text-text-secondary">
                    Redirecting to homepage...
                </p>
            </div>
        </div>
    );
};

export default RequestSuccessModal;
