import React, { useEffect } from 'react';

import { CheckCircle2, X } from 'lucide-react';

const SuccessToast = ({
    show = false,
    message = '',
    onClose,
    duration = 4500,
}) => {
    useEffect(() => {
        if (!show || !onClose) return undefined;

        const timer = window.setTimeout(() => {
            onClose();
        }, duration);

        return () => window.clearTimeout(timer);
    }, [show, onClose, duration]);

    if (!show) return null;

    return (
        <div
            className="
                fixed bottom-5 right-5 z-60
                w-[min(390px,calc(100vw-32px))]
                border border-emerald-200 bg-white
                shadow-[0_16px_45px_rgba(15,23,42,0.14)]
            "
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start gap-3.5 px-4 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[12px] font-bold text-text-primary">
                        Request sent
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-text-secondary">
                        {message ||
                            'Volunteer invitations were sent successfully.'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-7 w-7 shrink-0 items-center justify-center text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                    aria-label="Dismiss notification"
                >
                    <X size={15} strokeWidth={1.8} />
                </button>
            </div>

            <div className="h-0.5 w-full bg-emerald-500/10">
                <div
                    className="h-full bg-emerald-500 transition-none"
                    style={{
                        animation: `volunteerToastProgress ${duration}ms linear forwards`,
                    }}
                />
            </div>

            <style>
                {`
                    @keyframes volunteerToastProgress {
                        from {
                            width: 100%;
                        }
                        to {
                            width: 0%;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default SuccessToast;
