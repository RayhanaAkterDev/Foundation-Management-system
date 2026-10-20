import React from 'react';
import { LogOut } from 'lucide-react';
const ResignConfirmationModal = ({ open, loading, onCancel, onConfirm }) => {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070A]/80 px-4 py-6 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resign-modal-title"
        >
            <div className="w-full max-w-md overflow-hidden rounded-none border border-[#29323E] bg-[#0E1219] shadow-2xl">
                <div className="border-b border-[#252D38] px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-[#321D22] text-[#E7A1A5]">
                            <LogOut className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="resign-modal-title"
                                className="text-lg font-semibold text-[#EEF1F5]"
                            >
                                Resign as volunteer?
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-[#8792A1]">
                                Are you sure you want to resign from the
                                volunteer program?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5">
                    <div className="rounded-none border border-[#72552B] bg-[#2B2318] px-4 py-3">
                        <p className="text-sm leading-6 text-[#E1BF8E]">
                            Your volunteer history will be preserved, but your
                            current volunteer status will become inactive. You
                            can request reactivation later if you want to
                            volunteer again.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-[#252D38] bg-[#1A222D] px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#29323E] bg-[#0E1219] px-5 text-sm font-semibold text-[#AAB3BF] transition hover:border-slate-300 hover:bg-[#1A222D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className="inline-flex min-h-10 items-center justify-center rounded-none bg-red-600 px-5 text-sm font-semibold text-white! transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />

                        {loading ? 'Resigning...' : 'Resign as Volunteer'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ResignConfirmationModal;
