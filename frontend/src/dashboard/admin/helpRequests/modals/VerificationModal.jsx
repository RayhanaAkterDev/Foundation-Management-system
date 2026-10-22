import { useEffect, useId, useState } from 'react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    LoaderCircle,
    ShieldCheck,
    X,
    XCircle,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const CHOICES = [
    {
        value: 'verified',
        label: 'Verify',
        description: 'Approve request',
        Icon: CheckCircle2,
    },
    {
        value: 'rejected',
        label: 'Reject',
        description: 'Decline request',
        Icon: XCircle,
    },
];

export default function VerificationModal({
    request,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const titleId = useId();

    useEffect(() => {
        if (!request) return undefined;

        const onEscape = (event) => {
            if (event.key === 'Escape' && !loading) {
                onClose?.();
            }
        };

        window.addEventListener('keydown', onEscape);
        return () => window.removeEventListener('keydown', onEscape);
    }, [request, loading, onClose]);

    if (!request) return null;

    const currentStatus = request.verification_status || request.status;

    const handleClose = () => {
        if (loading) return;
        setSelectedStatus('');
        onClose?.();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedStatus || loading) return;
        onConfirm?.(selectedStatus);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 font-sans sm:p-5">
            <button
                type="button"
                aria-label="Close verification dialog"
                onClick={handleClose}
                disabled={loading}
                className="absolute inset-0 bg-[#05080D]/80 backdrop-blur-[2px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-[490px] flex-col overflow-hidden border border-[#35404D] bg-[#151C25] shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
            >
                <header className="flex shrink-0 items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#91A2B6]">
                            <ShieldCheck size={15} />
                            Verification
                        </div>

                        <h2
                            id={titleId}
                            className="mt-2 text-[19px] font-semibold! leading-6 tracking-[-0.025em] text-[#EEF1F5]!"
                        >
                            Review help request
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close"
                        className="flex size-8 shrink-0 items-center justify-center text-[#8792A1] hover:bg-[#242E3A] hover:text-[#EEF1F5] disabled:opacity-40"
                    >
                        <X size={18} />
                    </button>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 [scrollbar-width:thin] [scrollbar-color:#354354_transparent] sm:px-6 sm:pb-6">
                        <div className="border-y border-[#303A47] py-4">
                            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8391A3]">
                                    Request
                                </span>

                                {currentStatus && (
                                    <StatusBadge status={currentStatus} />
                                )}
                            </div>

                            <p className="mt-2 break-words text-[14px] font-semibold! leading-6 text-[#EEF1F5]">
                                {request.title || 'Untitled request'}
                            </p>
                        </div>

                        <fieldset disabled={loading} className="mt-5 min-w-0">
                            <legend className="mb-3 text-[13px] font-semibold text-[#DCE4EE]">
                                Choose an outcome
                            </legend>

                            <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-2">
                                {CHOICES.map((choice) => {
                                    const selected =
                                        selectedStatus === choice.value;
                                    const isReject =
                                        choice.value === 'rejected';
                                    const Icon = choice.Icon;

                                    return (
                                        <label
                                            key={choice.value}
                                            className={`relative flex cursor-pointer items-center gap-3 border px-3.5 py-3.5 transition-colors ${
                                                selected
                                                    ? isReject
                                                        ? 'border-[#A36A74] bg-[#30232A]'
                                                        : 'border-[#2D8C80] bg-[#15352F]'
                                                    : 'border-[#35404D] bg-[#1A222D] hover:border-[#536276] hover:bg-[#222D3A]'
                                            } ${
                                                loading
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="verification-outcome"
                                                value={choice.value}
                                                checked={selected}
                                                onChange={() =>
                                                    setSelectedStatus(
                                                        choice.value,
                                                    )
                                                }
                                                className="sr-only"
                                            />

                                            <Icon
                                                size={19}
                                                strokeWidth={1.8}
                                                className={
                                                    selected
                                                        ? isReject
                                                            ? 'shrink-0 text-[#E0A3AD]'
                                                            : 'shrink-0 text-[#69C5B3]'
                                                        : 'shrink-0 text-[#8C9BAD]'
                                                }
                                            />

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[13px] font-semibold text-[#EEF1F5]">
                                                    {choice.label}
                                                </span>

                                                <span className="mt-0.5 block text-[11px] text-[#91A0B2]">
                                                    {choice.description}
                                                </span>
                                            </span>

                                            <span
                                                aria-hidden="true"
                                                className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                                    selected
                                                        ? isReject
                                                            ? 'border-[#C38D96] bg-[#9C606C]'
                                                            : 'border-[#6BC7B5] bg-[#218B7C]'
                                                        : 'border-[#607084]'
                                                }`}
                                            >
                                                {selected && (
                                                    <Check
                                                        size={11}
                                                        strokeWidth={2.5}
                                                        className="text-white"
                                                    />
                                                )}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        {error && (
                            <div
                                role="alert"
                                className="mt-4 flex items-start gap-2 border border-[#69404A] bg-[#302027] px-3 py-2.5 text-[#DFA7B0]"
                            >
                                <AlertCircle
                                    size={16}
                                    className="mt-0.5 shrink-0"
                                />
                                <p className="text-[12px] leading-5">{error}</p>
                            </div>
                        )}
                    </div>

                    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#303A47] bg-[#10161F] px-5 py-4 sm:px-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="h-10 px-2 text-[13px] font-medium text-[#AAB7C7] hover:text-[#EEF1F5] disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!selectedStatus || loading}
                            className={`inline-flex h-10 min-w-[145px] items-center justify-center gap-2 border px-4 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                selectedStatus === 'rejected'
                                    ? 'border-[#80505A] bg-[#57313B] text-[#F0D2D7] hover:bg-[#69404A]'
                                    : 'border-[#248B7E] bg-[#176F64] text-[#F0FFFC] hover:bg-[#208779]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Submitting
                                </>
                            ) : (
                                <>
                                    <Check size={15} />
                                    {selectedStatus === 'verified'
                                        ? 'Confirm verification'
                                        : selectedStatus === 'rejected'
                                          ? 'Confirm rejection'
                                          : 'Submit decision'}
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
