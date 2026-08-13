import React from 'react';
import {
    X,
    CircleCheck,
    CircleX,
    Clock3,
    LoaderCircle,
} from 'lucide-react';

const HelpRequestVerificationModal = ({
    request,
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) => {
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
            className:
                'border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10',
            iconClass: 'bg-primary/10 text-primary',
        },
        {
            status: 'rejected',
            label: 'Reject request',
            description:
                'Reject this request if the submitted information does not meet platform requirements.',
            icon: CircleX,
            className:
                'border-red-200 bg-red-50/60 hover:border-red-300 hover:bg-red-50',
            iconClass: 'bg-red-100 text-red-600',
        },
        {
            status: 'pending',
            label: 'Keep pending',
            description:
                'Leave the request pending for further review or additional information.',
            icon: Clock3,
            className:
                'border-amber-200 bg-amber-50/60 hover:border-amber-300 hover:bg-amber-50',
            iconClass: 'bg-amber-100 text-amber-600',
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Administration
                        </p>

                        <h2 className="mt-1 text-lg font-bold tracking-tight text-text-primary">
                            Review help request
                        </h2>

                        <p className="mt-1 text-xs text-text-secondary">
                            Review the request and select an appropriate
                            verification status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Request summary */}
                <div className="border-b border-border px-6 py-5">
                    <div className="rounded-lg border border-border bg-surface-soft p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-text-primary">
                                    {request.title || 'Untitled request'}
                                </p>

                                <p className="mt-1 text-xs text-text-secondary">
                                    {request.requester?.name ||
                                        request.user?.name ||
                                        request.requester?.email ||
                                        request.user?.email ||
                                        'Requester information unavailable'}
                                </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-amber-700">
                                {request.verification_status ||
                                    request.status ||
                                    'pending'}
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Category
                                </p>

                                <p className="mt-1 text-xs font-semibold capitalize text-text-primary">
                                    {request.category || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Priority
                                </p>

                                <p className="mt-1 text-xs font-semibold capitalize text-text-primary">
                                    {request.urgency || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    Location
                                </p>

                                <p className="mt-1 text-xs font-semibold text-text-primary">
                                    {request.location || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                                    People affected
                                </p>

                                <p className="mt-1 text-xs font-semibold text-text-primary">
                                    {request.people_affected ?? '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-6 mt-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Verification options */}
                <div className="space-y-2.5 px-6 py-5">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        Verification decision
                    </p>

                    {options.map((option) => {
                        const Icon = option.icon;

                        return (
                            <button
                                key={option.status}
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                    onConfirm(option.status)
                                }
                                className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${option.className}`}
                            >
                                <span
                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${option.iconClass}`}
                                >
                                    <Icon size={17} />
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                                        {option.label}

                                        {loading && (
                                            <LoaderCircle
                                                size={14}
                                                className="animate-spin text-text-secondary"
                                            />
                                        )}
                                    </span>

                                    <span className="mt-0.5 block text-xs leading-5 text-text-secondary">
                                        {option.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-border bg-surface-soft px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="inline-flex h-10 items-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpRequestVerificationModal;