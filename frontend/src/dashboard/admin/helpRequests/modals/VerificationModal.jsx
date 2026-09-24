import React, { useState } from 'react';
import {
    X,
    CircleCheck,
    CircleX,
    LoaderCircle,
    ShieldCheck,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const VerificationModal = ({
    request,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
    const [selectedStatus, setSelectedStatus] = useState(null);

    if (!request) {
        return null;
    }

    const options = [
        {
            status: 'verified',
            label: 'Verify request',
            description:
                'Approve this request so it can move forward for assistance coordination.',
            icon: CircleCheck,
            wrapper:
                'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50',
            selectedWrapper:
                'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100',
            iconClass: 'bg-emerald-100 text-emerald-600',
            selectedIconClass: 'bg-emerald-600 text-white',
            accent: 'bg-emerald-500',
        },
        {
            status: 'rejected',
            label: 'Reject request',
            description:
                'Reject this request if the submitted information does not meet platform requirements.',
            icon: CircleX,
            wrapper:
                'border-red-200 bg-red-50/50 hover:border-red-300 hover:bg-red-50',
            selectedWrapper:
                'border-red-400 bg-red-50 ring-2 ring-red-100',
            iconClass: 'bg-red-100 text-red-600',
            selectedIconClass: 'bg-red-600 text-white',
            accent: 'bg-red-500',
        },
    ];

    const handleConfirm = (status) => {
        if (loading) {
            return;
        }

        setSelectedStatus(status);
        onConfirm(status);
    };

    const handleClose = () => {
        if (loading) {
            return;
        }

        setSelectedStatus(null);
        onClose();
    };

    const currentVerificationStatus =
        request.verification_status || request.status;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[5px] sm:p-6">
            <div
                className="absolute inset-0"
                onClick={!loading ? handleClose : undefined}
            />

            <div className="relative z-10 w-full max-w-135 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.24)]">
                {/* Header */}
                <div className="relative border-b border-slate-100 px-6 py-6 sm:px-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} strokeWidth={1.8} />
                    </button>

                    <div className="flex items-center gap-4 pr-10">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ShieldCheck size={21} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Verify request
                            </h2>

                            <p className="mt-1 truncate text-sm text-slate-500">
                                {request.title || 'Untitled request'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Request */}
                <div className="px-6 py-5 sm:px-7">
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="min-w-0 truncate text-sm font-semibold text-slate-800">
                            {request.title || 'Untitled request'}
                        </h3>

                        {currentVerificationStatus && (
                            <div className="shrink-0">
                                <StatusBadge
                                    status={currentVerificationStatus}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Decision */}
                <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                    {error && (
                        <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-xs font-semibold text-red-700">
                                Verification failed
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2.5">
                        {options.map((option) => {
                            const Icon = option.icon;

                            const isSelected =
                                selectedStatus === option.status;

                            const isSubmitting = loading && isSelected;

                            return (
                                <button
                                    key={option.status}
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        handleConfirm(option.status)
                                    }
                                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border px-4 py-4 text-left transition-all duration-200 disabled:cursor-not-allowed ${
                                        isSelected
                                            ? option.selectedWrapper
                                            : option.wrapper
                                    } ${
                                        loading && !isSelected
                                            ? 'opacity-40'
                                            : ''
                                    }`}
                                >
                                    <span
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                            isSelected
                                                ? option.selectedIconClass
                                                : option.iconClass
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <LoaderCircle
                                                size={18}
                                                strokeWidth={1.9}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Icon
                                                size={18}
                                                strokeWidth={1.9}
                                            />
                                        )}
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-bold text-slate-900">
                                            {option.label}
                                        </span>

                                        <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                            {option.description}
                                        </span>
                                    </span>

                                    <span
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                            isSelected
                                                ? option.status === 'verified'
                                                    ? 'border-emerald-500 bg-emerald-500'
                                                    : 'border-red-500 bg-red-500'
                                                : 'border-slate-300 bg-white'
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;