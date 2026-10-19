import React, { useEffect, useId, useRef } from 'react';
import { Check, X } from 'lucide-react';

const AUTO_CLOSE_DURATION = 1500;

const ENTITY_LABELS = {
    user: 'User',
    organization: 'Organization',
};

const ACTION_LABELS = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
};

export default function SuccessDialog({
    open,
    show,
    action = 'updated',
    entity = 'user',
    name = '',
    title,
    message,
    onClose,
}) {
    const visible = open ?? show ?? false;
    const messageId = useId();
    const onCloseRef = useRef(onClose);
    const dismissedRef = useRef(false);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!visible) {
            dismissedRef.current = false;
            return undefined;
        }

        dismissedRef.current = false;

        return () => {
            dismissedRef.current = true;
        };
    }, [visible]);

    const dismiss = () => {
        if (dismissedRef.current) return;

        dismissedRef.current = true;
        onCloseRef.current?.();
    };

    if (!visible) return null;

    const entityName = ENTITY_LABELS[entity] || String(entity);
    const verb = ACTION_LABELS[action] || 'updated';

    const heading = title || `${entityName} ${verb}`;

    const description =
        message ||
        (name
            ? `${name} was ${verb} successfully.`
            : `The ${entityName.toLowerCase()} was ${verb} successfully.`);

    return (
        <div
            className="
                pointer-events-none fixed inset-x-0 top-0 z-[200]
                flex justify-center px-3 pt-3
                sm:inset-x-auto sm:right-5 sm:top-5
                sm:w-[min(100%-2.5rem,390px)]
                sm:justify-end sm:px-0 sm:pt-0
                md:right-6 md:top-6
            "
        >
            <section
                role="status"
                aria-live="polite"
                aria-atomic="true"
                aria-describedby={messageId}
                className="
                    pointer-events-auto relative flex w-full min-w-0
                    items-start gap-3 overflow-hidden
                    border border-[#29323E]
                    bg-[#171C24]
                    px-3.5 py-3.5
                    shadow-[0_12px_36px_rgba(0,0,0,0.35)]
                    sm:gap-3.5 sm:px-4 sm:py-4
                "
            >
                <span
                    aria-hidden="true"
                    className="
                        mt-px flex h-9 w-9 shrink-0
                        items-center justify-center
                        border border-[#303A47]
                        bg-[#1A222D]
                        text-[#0f766e]
                    "
                >
                    <Check size={19} strokeWidth={2.2} />
                </span>

                <div className="min-w-0 flex-1 pt-0.5 pr-4">
                    <h2
                        className="
                            break-words
                            text-[18px] font-semibold!
                            leading-[1.45] tracking-[-0.15px]
                            text-[#EEF1F5]!
                        "
                    >
                        {heading}
                    </h2>

                    <p
                        id={messageId}
                        className="
                            mt-3 break-words
                            text-[12px] font-medium! leading-[1.7]
                            text-[#AAB3BF]
                            [overflow-wrap:anywhere]
                            sm:text-[13px]
                        "
                    >
                        {description}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss notification"
                    className="
                        absolute right-2 top-2
                        flex h-7 w-7 items-center justify-center
                        text-[#8792A1]
                        transition-colors duration-150
                        hover:bg-[#252D38]
                        hover:text-[#EEF1F5]
                        focus-visible:outline-2
                        focus-visible:outline-offset-[-2px]
                        focus-visible:outline-[#0f766e]
                    "
                >
                    <X size={15} strokeWidth={1.9} />
                </button>

                <span
                    aria-hidden="true"
                    className="
                        success-toast-progress
                        absolute bottom-0 left-0
                        h-[2px] w-full origin-left
                        bg-[#0f766e]
                    "
                    onAnimationEnd={dismiss}
                />
            </section>

            <style>{`
                .success-toast-progress {
                    transform: scaleX(0);
                    animation: success-toast-progress-fill
                        ${AUTO_CLOSE_DURATION}ms linear forwards;
                }

                @keyframes success-toast-progress-fill {
                    from {
                        transform: scaleX(0);
                    }
                    to {
                        transform: scaleX(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .success-toast-progress {
                        animation: none;
                        transform: scaleX(1);
                    }
                }
            `}</style>
        </div>
    );
}
