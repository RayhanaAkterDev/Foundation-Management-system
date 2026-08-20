import React, { useState } from 'react';
import {
    X,
    CircleCheck,
    CircleX,
    LoaderCircle,
    ShieldCheck,
    MessageSquareText,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const CampaignVerificationModal = ({
    campaign,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [verificationNote, setVerificationNote] = useState('');

    if (!campaign) {
        return null;
    }

    const options = [
        {
            status: 'active',
            label: 'Approve campaign',
            description:
                'Approve this campaign and make it active for fundraising on the platform.',
            icon: CircleCheck,
            wrapper:
                'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300 hover:bg-emerald-50/70',
            selectedWrapper:
                'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100',
            iconClass: 'bg-emerald-100 text-emerald-600',
            selectedIconClass: 'bg-emerald-600 text-white',
        },

        {
            status: 'rejected',
            label: 'Reject campaign',
            description:
                'Reject this campaign if the submitted information does not meet platform requirements.',
            icon: CircleX,
            wrapper:
                'border-red-200 bg-red-50/40 hover:border-red-300 hover:bg-red-50/70',
            selectedWrapper: 'border-red-400 bg-red-50 ring-2 ring-red-100',
            iconClass: 'bg-red-100 text-red-600',
            selectedIconClass: 'bg-red-600 text-white',
        },
    ];

    const currentStatus = campaign.status || 'pending_review';

    const isRejecting = selectedStatus === 'rejected';

    const rejectionNoteMissing = isRejecting && !verificationNote.trim();

    const handleSelectStatus = (status) => {
        if (loading) {
            return;
        }

        setSelectedStatus(status);
    };

    const handleConfirm = () => {
        if (loading || !selectedStatus) {
            return;
        }

        const note = verificationNote.trim();

        if (selectedStatus === 'rejected' && !note) {
            return;
        }

        onConfirm({
            status: selectedStatus,
            verification_note: note || null,
        });
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        setSelectedStatus(null);
        setVerificationNote('');

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[5px] sm:p-6">
            <div
                className="absolute inset-0"
                onClick={!loading ? handleClose : undefined}
            />

            <div className="relative z-10 w-full max-w-140 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
                {/* Header */}

                <div className="relative px-6 pb-6 pt-6 sm:px-7 sm:pt-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-start gap-4 pr-10">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <ShieldCheck size={21} strokeWidth={1.8} />
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                Campaign verification
                            </p>

                            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900">
                                Review this campaign
                            </h2>

                            <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                Review the submitted campaign and decide whether
                                it should become active or be rejected.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Campaign */}

                <div className="mx-6 border-y border-slate-100 py-5 sm:mx-7">
                    <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Campaign being reviewed
                            </p>

                            <h3 className="mt-1.5 truncate text-base font-semibold leading-6 text-slate-900">
                                {campaign.title || 'Untitled campaign'}
                            </h3>
                        </div>

                        <div className="shrink-0">
                            <StatusBadge status={currentStatus} />
                        </div>
                    </div>
                </div>

                {/* Decision */}

                <div className="px-6 py-6 sm:px-7 sm:py-7">
                    <div className="mb-4">
                        <p className="text-xs font-bold text-slate-900">
                            Verification decision
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Choose whether this campaign should be approved or
                            rejected.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-xs font-semibold text-red-700">
                                Campaign verification failed
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {options.map((option) => {
                            const Icon = option.icon;

                            const isSelected = selectedStatus === option.status;

                            return (
                                <button
                                    key={option.status}
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        handleSelectStatus(option.status)
                                    }
                                    className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 disabled:cursor-not-allowed ${
                                        isSelected
                                            ? option.selectedWrapper
                                            : option.wrapper
                                    } ${
                                        loading && !isSelected
                                            ? 'opacity-40'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                                isSelected
                                                    ? option.selectedIconClass
                                                    : option.iconClass
                                            }`}
                                        >
                                            <Icon size={19} strokeWidth={1.9} />
                                        </span>

                                        <span
                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                isSelected
                                                    ? option.status === 'active'
                                                        ? 'border-emerald-500 bg-emerald-500'
                                                        : 'border-red-500 bg-red-500'
                                                    : 'border-slate-300 bg-white'
                                            }`}
                                        >
                                            {isSelected && (
                                                <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                                            )}
                                        </span>
                                    </div>

                                    <p className="mt-5 text-sm font-bold text-slate-900">
                                        {option.label}
                                    </p>

                                    <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                                        {option.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Note */}

                    <div className="mt-5">
                        <div className="mb-2 flex items-center gap-2">
                            <MessageSquareText
                                size={14}
                                className="text-slate-400"
                            />

                            <label
                                htmlFor="verification-note"
                                className="text-xs font-bold text-slate-900"
                            >
                                Verification note
                            </label>

                            {isRejecting && (
                                <span className="text-[10px] font-semibold text-red-500">
                                    Required for rejection
                                </span>
                            )}
                        </div>

                        <textarea
                            id="verification-note"
                            value={verificationNote}
                            onChange={(event) =>
                                setVerificationNote(event.target.value)
                            }
                            disabled={loading}
                            rows={3}
                            placeholder={
                                isRejecting
                                    ? 'Explain why this campaign is being rejected...'
                                    : 'Add an optional verification note...'
                            }
                            className={`w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${
                                rejectionNoteMissing
                                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                    : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                            }`}
                        />

                        {rejectionNoteMissing && (
                            <p className="mt-1.5 text-[11px] font-medium text-red-600">
                                A verification note is required when rejecting a
                                campaign.
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-7">
                    <p className="hidden text-[11px] text-slate-400 sm:block">
                        {isRejecting
                            ? 'A rejection note is required.'
                            : 'Select a decision to continue.'}
                    </p>

                    <div className="ml-auto flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={
                                loading ||
                                !selectedStatus ||
                                rejectionNoteMissing
                            }
                            onClick={handleConfirm}
                            className={`inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                isRejecting
                                    ? 'bg-red-600 shadow-red-600/20 hover:bg-red-700'
                                    : 'bg-primary shadow-primary/20 hover:bg-primary-hover'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Processing...
                                </>
                            ) : isRejecting ? (
                                <>
                                    <CircleX size={16} />
                                    Reject Campaign
                                </>
                            ) : selectedStatus === 'active' ? (
                                <>
                                    <CircleCheck size={16} />
                                    Approve Campaign
                                </>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignVerificationModal;
