import React, { useEffect, useId, useRef } from 'react';
import { AlertCircle, LoaderCircle, Trash2, X } from 'lucide-react';

/** Shared presentation only; callers own the deletion request. */
export default function DeleteConfirmDialog({
    open = true,
    item,
    entityLabel = 'item',
    name,
    detail,
    title,
    description,
    confirmLabel,
    loading = false,
    error,
    onClose,
    onConfirm,
}) {
    const headingId = useId();
    const messageId = useId();
    const cancelRef = useRef(null);

    const visible = Boolean(open && item);
    const itemName = name ?? item?.name ?? `Unnamed ${entityLabel}`;
    const itemDetail = detail ?? item?.email ?? '';

    useEffect(() => {
        if (!visible) return;

        const previous = document.activeElement;
        cancelRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !loading) {
                onClose?.();
            }

            if (event.key === 'Tab') {
                const dialog = document.querySelector('[data-delete-dialog]');
                const buttons = Array.from(
                    dialog?.querySelectorAll('button:not(:disabled)') ?? [],
                );

                if (!buttons.length) return;

                const first = buttons[0];
                const last = buttons[buttons.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previous?.focus?.();
        };
    }, [visible, loading, onClose]);

    if (!visible) return null;

    return (
        <div
            className="
                fixed inset-0 z-[200]
                flex items-center justify-center
                overflow-y-auto
                bg-[#070A0D]/80
                p-4 backdrop-blur-[5px]
                sm:p-6
            "
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onClose?.();
                }
            }}
        >
            <section
                data-delete-dialog
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={headingId}
                aria-describedby={messageId}
                className="
                    relative w-full max-w-[440px]
                    overflow-hidden
                    border border-[#353D48]
                    bg-[#151A21]
                    shadow-[0_32px_100px_rgba(0,0,0,0.55)]
                "
            >
                {/* TOP ACCENT */}
                <div className="h-[3px] w-full bg-[#A64E5B]" />

                <div className="px-5 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div
                                className="
                                    flex h-11 w-11 shrink-0
                                    items-center justify-center
                                    border border-[#71404A]
                                    bg-[#39232A]
                                    text-[#E58B97]
                                "
                                aria-hidden="true"
                            >
                                <Trash2 size={19} strokeWidth={1.8} />
                            </div>

                            <div className="min-w-0 pt-0.5">
                                <p
                                    className="
                                    mb-1.5
                                    text-[10px] font-semibold
                                    uppercase tracking-[0.17em]
                                    text-[#D17D89]
                                "
                                >
                                    Confirm deletion
                                </p>

                                <h2
                                    id={headingId}
                                    className="
                                        text-[19px] font-semibold
                                        leading-[1.35]
                                        tracking-[-0.035em]
                                        text-[#F0F2F5]!
                                        sm:text-[21px]
                                    "
                                >
                                    {title || `Delete ${entityLabel}?`}
                                </h2>
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-label="Close dialog"
                            disabled={loading}
                            onClick={onClose}
                            className="
                                -mr-1 -mt-1
                                flex h-8 w-8 shrink-0
                                items-center justify-center
                                text-[#8994A2]
                                transition-colors duration-150
                                hover:bg-[#282F39]
                                hover:text-[#F0F2F5]!
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                        >
                            <X size={17} />
                        </button>
                    </div>

                    {/* DESCRIPTION */}
                    <p
                        id={messageId}
                        className="
                            mt-5
                            text-[13px] leading-[1.8]
                            text-[#A6AFBB]
                        "
                    >
                        {description ||
                            `Are you sure you want to delete this ${entityLabel}? This action cannot be undone.`}
                    </p>

                    {/* ITEM DETAILS */}
                   <div className="mt-5 border-l-2 border-[#8F4C57] bg-[#202630] px-3.5 py-3">
                    <p className="break-words text-[14px] font-medium leading-5 text-[#E4E8ED]">{itemName}</p>
                    {itemDetail && <p className="mt-1 break-all text-[12px] leading-5 text-[#929DAC]">{itemDetail}</p>}
                </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div
                            role="alert"
                            className="
                                mt-4 flex items-start gap-2.5
                                border border-[#65404A]
                                bg-[#2B2026]
                                px-3.5 py-3
                                text-[12px] leading-[1.7]
                                text-[#E6A1AA]
                            "
                        >
                            <AlertCircle
                                size={16}
                                className="mt-0.5 shrink-0"
                            />

                            <span className="min-w-0 break-words">{error}</span>
                        </div>
                    )}

                    {/* FOOTER ACTIONS */}
                    <div
                        className="
                        mt-6 flex flex-col-reverse gap-2.5
                        sm:flex-row sm:justify-end
                    "
                    >
                        <button
                            ref={cancelRef}
                            type="button"
                            disabled={loading}
                            onClick={onClose}
                            className="
                                inline-flex h-10 w-full
                                items-center justify-center
                                border border-[#424B58]
                                bg-transparent px-5
                                text-[12px] font-semibold
                                text-[#C3CBD5]
                                transition-colors duration-150
                                hover:border-[#5A6573]
                                hover:bg-[#242B35]
                                hover:text-[#F0F2F5]!
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={onConfirm}
                            className="
                                inline-flex h-10 w-full
                                items-center justify-center gap-2
                                border border-[#A95360]
                                bg-[#A34754] px-5
                                text-[12px] font-semibold
                                text-white
                                transition-colors duration-150
                                hover:border-[#C16673]
                                hover:bg-[#B45260]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                sm:w-auto
                            "
                        >
                            {loading ? (
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />
                            ) : (
                                <Trash2 size={14} strokeWidth={2} />
                            )}

                            <span>
                                {loading
                                    ? 'Deleting...'
                                    : confirmLabel || `Delete ${entityLabel}`}
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
