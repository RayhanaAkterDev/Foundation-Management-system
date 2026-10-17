import React, { useEffect, useId } from 'react';
import { Check } from 'lucide-react';

/** One success dialog for user and organization create/update/delete actions. */
const SuccessDialog = ({
    open,
    show,
    action = 'updated',
    entity = 'user',
    name = '',
    title,
    message,
    onClose,
}) => {
    const visible = open ?? show ?? false;
    const id = useId();
    const label = entity === 'organization' ? 'Organization' : 'User';
    const verb =
        { created: 'created', updated: 'updated', deleted: 'deleted' }[
            action
        ] || 'updated';
    const heading = title || `${label} ${verb} successfully`;
    const description =
        message ||
        (name
            ? `${name} was ${verb} successfully.`
            : `The ${label.toLowerCase()} was ${verb} successfully.`);

    useEffect(() => {
        if (!visible) return undefined;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [visible, onClose]);

    if (!visible) return null;
    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-[#05070A]/80 px-4 py-6 backdrop-blur-[3px]">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-title`}
                aria-describedby={`${id}-description`}
                className="w-full max-w-112.5 rounded-xl border border-[#303844] bg-[#0E1219] px-6 pb-8 pt-9 text-center shadow-[0_28px_80px_rgba(0,0,0,.52)] sm:px-9 sm:pb-9 sm:pt-10"
            >
                <div className="mx-auto flex h-15 w-15 items-center justify-center rounded-full border-2 border-[#6FAE87] bg-[#17231D] text-[#8EC5A3]">
                    <Check size={30} strokeWidth={2} />
                </div>
                <h2
                    id={`${id}-title`}
                    className="mt-5 font-sans! text-[20px] font-semibold! leading-[1.4] text-[#EEF1F5]! sm:text-[21px]"
                >
                    {heading}
                </h2>
                <p
                    id={`${id}-description`}
                    className="mx-auto mt-2.5 max-w-87.5 wrap-break-word font-sans! text-[13px] leading-[1.7] text-[#98A2B0]! sm:text-[14px]"
                >
                    {description}
                </p>
                <button
                    type="button"
                    onClick={() => onClose?.()}
                    className="mt-7 inline-flex h-10 min-w-28.5 items-center justify-center gap-2 rounded-lg border border-[#365344] bg-[#18231D] px-5 font-sans! text-[13px] font-semibold! text-[#8EC5A3]! transition-colors hover:border-[#4C765B] hover:bg-[#203329] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8EC5A3]"
                >
                    <Check size={15} strokeWidth={2.1} />
                    Done
                </button>
            </section>
        </div>
    );
};
export default SuccessDialog;
