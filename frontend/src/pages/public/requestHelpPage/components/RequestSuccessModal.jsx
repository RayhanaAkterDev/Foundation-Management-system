import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbCheck } from 'react-icons/tb';

const RequestSuccessModal = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => navigate('/'), 3000);
        return () => clearTimeout(t);
    }, [navigate]);

    return (
        <div
            className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/40 backdrop-blur-sm
            px-4
        "
        >
            <div
                className="
                w-full max-w-sm sm:max-w-md
                rounded-2xl sm:rounded-3xl
                bg-surface
                border border-border
                shadow-xl
                p-6 sm:p-8
                text-center
            "
            >
                <div
                    className="
                    mx-auto mb-5 sm:mb-6
                    h-14 w-14 sm:h-16 sm:w-16
                    rounded-full
                    bg-green-50
                    flex items-center justify-center
                "
                >
                    <TbCheck className="text-2xl sm:text-3xl text-green-600" />
                </div>

                <h2 className="text-lg sm:text-xl font-semibold">
                    Request Received
                </h2>

                <p className="mt-3 text-sm text-text-secondary">
                    Your request is under review.
                </p>

                <p className="mt-2 text-xs text-text-secondary">
                    Redirecting...
                </p>
            </div>
        </div>
    );
};

export default RequestSuccessModal;
