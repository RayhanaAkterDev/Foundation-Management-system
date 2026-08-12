import React from 'react';
import { Check } from 'lucide-react';

const OrganizationSuccessToast = ({ show, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-100 w-[calc(100%-2rem)] max-w-sm">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 shadow-[0_10px_35px_rgba(15,23,42,0.12)]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check size={18} strokeWidth={2.4} />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-medium leading-5 text-text-primary">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrganizationSuccessToast;
