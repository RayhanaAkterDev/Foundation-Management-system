import React from 'react';
import { X, CircleCheck, CircleX, Clock3 } from 'lucide-react';

const OrganizationVerificationModal = ({
    organization,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    if (!organization) {
        return null;
    }

    const options = [
        {
            status: 'verified',
            label: 'Approve organization',
            description:
                'Mark this organization as verified and approved to operate on the platform.',
            icon: CircleCheck,
            className:
                'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300',
        },
        {
            status: 'pending',
            label: 'Keep pending',
            description:
                'Keep the organization under review without approving or rejecting it.',
            icon: Clock3,
            className:
                'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300',
        },
        {
            status: 'rejected',
            label: 'Reject organization',
            description: 'Reject the organization verification request.',
            icon: CircleX,
            className:
                'border-red-200 bg-red-50 text-red-700 hover:border-red-300',
        },
    ];

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                            Verification
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-text-primary">
                            Review organization
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary hover:bg-background-alt disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-border bg-background-alt/40 px-4 py-3">
                        <p className="text-xs text-text-secondary">
                            Organization
                        </p>

                        <p className="mt-1 font-semibold text-text-primary">
                            {organization.name}
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            {organization.organization_type ||
                                'Type not specified'}
                        </p>
                    </div>

                    <div className="mt-5 space-y-2">
                        {options.map((option) => {
                            const Icon = option.icon;

                            const active =
                                organization.verification_status ===
                                option.status;

                            return (
                                <button
                                    key={option.status}
                                    type="button"
                                    disabled={loading || active}
                                    onClick={() => onConfirm(option.status)}
                                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${option.className} ${
                                        active
                                            ? 'cursor-default opacity-60'
                                            : 'hover:shadow-sm'
                                    }`}
                                >
                                    <Icon
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold">
                                            {option.label}
                                        </p>

                                        <p className="mt-1 text-xs leading-5 opacity-80">
                                            {option.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                <div className="border-t border-border bg-background-alt/30 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="ml-auto block h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary hover:bg-background-alt disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationVerificationModal;
