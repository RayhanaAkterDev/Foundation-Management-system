import React from 'react';
import { CircleCheck } from 'lucide-react';

const OrganizationSuccessToast = ({ show, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-100 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CircleCheck size={17} />
            </div>

            <p className="text-sm font-medium text-text-primary">{message}</p>
        </div>
    );
};

export default OrganizationSuccessToast;
