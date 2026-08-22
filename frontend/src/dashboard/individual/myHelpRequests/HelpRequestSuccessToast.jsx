import React, { useEffect } from 'react';
import { CircleCheck, X } from 'lucide-react';

const HelpRequestSuccessToast = ({
    show = false,
    message = 'Operation completed successfully.',
    onClose,
    duration = 4000,
}) => {
    useEffect(() => {
        if (!show || !onClose) {
            return undefined;
        }

        const timer = window.setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            window.clearTimeout(timer);
        };
    }, [show, onClose, duration]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed right-5 top-5 z-70 w-[calc(100%-2.5rem)] max-w-sm">
            <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-3 rounded-xl border border-border bg-white px-4 py-3.5 shadow-xl"
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CircleCheck size={17} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-text-primary">
                        Success
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-text-secondary">
                        {message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                    aria-label="Dismiss notification"
                >
                    <X size={15} />
                </button>
            </div>
        </div>
    );
};

export default HelpRequestSuccessToast;
