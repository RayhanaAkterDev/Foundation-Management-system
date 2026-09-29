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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md border border-border bg-surface p-7 text-center shadow-2xl sm:p-9">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <TbCheck className="text-2xl text-primary" />
                </div>

                <p className="mt-6 font-bengali text-sm font-semibold text-primary">
                    আবেদন গ্রহণ করা হয়েছে
                </p>
                <h2 className="mt-2 font-bengali text-2xl font-semibold text-text-primary">
                    আপনার অনুরোধটি পর্যালোচনায় আছে
                </h2>
                <p className="mt-3 font-bengali text-sm leading-7 text-text-muted">
                    প্রয়োজনীয় যাচাই শেষে পরবর্তী পদক্ষেপ নেওয়া হবে। কয়েক
                    মুহূর্তের মধ্যে আপনাকে মূল পাতায় নেওয়া হচ্ছে।
                </p>
            </div>
        </div>
    );
};

export default RequestSuccessModal;
