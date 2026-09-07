import React from 'react';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';

const HelpRequestDeleteModal = ({
    isOpen,
    request,
    deleting = false,
    onClose,
    onConfirm,
}) => {
    if (!isOpen || !request) {
        return null;
    }

    const handleClose = () => {
        if (deleting) {
            return;
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-3 py-4 backdrop-blur-[5px] sm:px-4 sm:py-6">
            {/* =====================================================
                BACKDROP
            ====================================================== */}
            <div
                className="absolute inset-0"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* =====================================================
                MODAL
            ====================================================== */}
            <div className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-[18px] border border-[#dfe7e5] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:rounded-[22px]">
                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="relative border-b border-[#edf1f0] bg-white px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                            {/* Warning icon */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-red-50 text-red-500 ring-1 ring-red-100 sm:h-11 sm:w-11 sm:rounded-[13px]">
                                <AlertTriangle
                                    className="h-[18px] w-[18px] sm:h-5 sm:w-5"
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="min-w-0 pt-0.5">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9aa5a2] sm:text-[10px] sm:tracking-[0.17em]">
                                        Confirmation
                                    </span>
                                </div>

                                <h2 className="font-['Fraunces'] text-[22px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#17252a] sm:text-[27px]">
                                    Delete this help request?
                                </h2>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={deleting}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[#9aa6aa] transition-all hover:bg-[#f3f6f5] hover:text-[#26383d] disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9 sm:rounded-[10px]"
                            aria-label="Close delete confirmation"
                        >
                            <X
                                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                                strokeWidth={1.7}
                            />
                        </button>
                    </div>
                </div>

                {/* =================================================
                    BODY
                ================================================== */}
                <div className="px-5 py-5 sm:px-7 sm:py-6">
                    {/* Description */}
                    <p className="max-w-[430px] text-[12px] leading-[1.7] text-[#66757a] sm:text-[13px] sm:leading-[1.75]">
                        You're about to permanently remove this request. The
                        submitted information will no longer be available after
                        deletion.
                    </p>

                    {/* =================================================
                        REQUEST CONTEXT
                    ================================================== */}
                    <div className="mt-5 rounded-[13px] border border-[#e7edeb] bg-[#fafcfb] px-3.5 py-3.5 sm:mt-6 sm:rounded-[15px] sm:px-4 sm:py-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#edf3f1] text-primary">
                                <Trash2
                                    className="h-3.5 w-3.5"
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#9aa6aa] sm:text-[9px]">
                                    Request to delete
                                </p>

                                <p className="break-words text-[13px] font-semibold leading-5 text-[#1b2a2f] sm:text-[14px]">
                                    {request.title}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        WARNING NOTICE
                    ================================================== */}
                    <div className="mt-4 flex items-start gap-2.5 sm:mt-5 sm:gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#f7f1e9] text-[#a47b4e]">
                            <AlertTriangle
                                className="h-3.5 w-3.5"
                                strokeWidth={1.8}
                            />
                        </div>

                        <p className="text-[10.5px] leading-5 text-[#7b7770] sm:text-[11.5px]">
                            This action is permanent and cannot be reversed.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}
                <div className="border-t border-[#e7edeb] bg-[#fafcfb] px-5 py-3.5 sm:px-7 sm:py-4">
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Helper text */}
                        <p className="hidden text-[10px] leading-4 text-[#9aa6aa] sm:block">
                            Review carefully before continuing
                        </p>

                        {/* Actions */}
                        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-2.5">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={deleting}
                                className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] px-4 text-[11px] font-semibold text-[#65757a] transition-all hover:bg-[#edf2f2] hover:text-[#1b2a2f] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:flex-none sm:px-4.5 sm:text-[12px]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={deleting}
                                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-red-600 px-4 text-[11px] font-semibold text-white shadow-[0_4px_14px_rgba(220,38,38,0.16)] transition-all hover:bg-red-700 hover:shadow-[0_6px_18px_rgba(220,38,38,0.22)] disabled:cursor-not-allowed disabled:opacity-55 sm:h-10 sm:flex-none sm:px-4.5 sm:text-[12px]"
                            >
                                {deleting ? (
                                    <>
                                        <Loader2
                                            className="h-3.5 w-3.5 animate-spin"
                                            strokeWidth={1.8}
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2
                                            className="h-3.5 w-3.5"
                                            strokeWidth={1.8}
                                        />
                                        Delete request
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestDeleteModal;
