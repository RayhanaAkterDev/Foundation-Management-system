import React from 'react';
import {
    X,
    CircleCheck,
    CircleX,
    Clock3,
    Building2,
    ShieldCheck,
    ChevronRight,
} from 'lucide-react';

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
                'Verify this organization and allow it to operate on the platform.',
            icon: CircleCheck,
            iconWrapper: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            cardClass:
                'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/40',
            activeClass: 'border-emerald-200 bg-emerald-50/60',
        },
        {
            status: 'pending',
            label: 'Keep pending',
            description:
                'Leave this organization under review without changing its status.',
            icon: Clock3,
            iconWrapper: 'bg-amber-50 text-amber-600 border-amber-100',
            cardClass:
                'border-amber-100 hover:border-amber-300 hover:bg-amber-50/40',
            activeClass: 'border-amber-200 bg-amber-50/60',
        },
        {
            status: 'rejected',
            label: 'Reject organization',
            description: 'Reject this organization verification request.',
            icon: CircleX,
            iconWrapper: 'bg-red-50 text-red-600 border-red-100',
            cardClass: 'border-red-100 hover:border-red-300 hover:bg-red-50/40',
            activeClass: 'border-red-200 bg-red-50/60',
        },
    ];

    const formatType = (type) => {
        if (!type) {
            return 'Type not specified';
        }

        return type
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-900/15">
                {/* Header */}
                <div className="border-b border-border px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck size={17} strokeWidth={2} />
                                </div>

                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                    Organization verification
                                </p>
                            </div>

                            <h2 className="mt-3 text-xl font-bold tracking-tight text-text-primary">
                                Review organization
                            </h2>

                            <p className="mt-1 text-sm text-text-secondary">
                                Choose the verification status for this
                                organization.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close verification modal"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    {/* Organization identity */}
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-background-alt/50 px-4 py-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Building2 size={21} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                Organization
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-text-primary">
                                {organization.name}
                            </p>

                            <p className="mt-0.5 text-xs text-text-secondary">
                                {formatType(organization.organization_type)}
                            </p>
                        </div>

                        <div className="hidden shrink-0 sm:block">
                            <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-text-secondary shadow-sm ring-1 ring-border">
                                {organization.verification_status
                                    ? organization.verification_status
                                          .charAt(0)
                                          .toUpperCase() +
                                      organization.verification_status.slice(1)
                                    : 'Unknown'}
                            </span>
                        </div>
                    </div>

                    {/* Section heading */}
                    <div className="mb-3 mt-6">
                        <p className="text-sm font-semibold text-text-primary">
                            Verification decision
                        </p>

                        <p className="mt-0.5 text-xs text-text-secondary">
                            Select the status that best reflects the review
                            result.
                        </p>
                    </div>

                    {/* Verification options */}
                    <div className="space-y-2.5">
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
                                    className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${option.cardClass} ${
                                        active
                                            ? `${option.activeClass} cursor-default`
                                            : 'bg-white hover:shadow-sm'
                                    } ${
                                        loading
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${option.iconWrapper}`}
                                    >
                                        <Icon size={19} strokeWidth={1.9} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-text-primary">
                                                {option.label}
                                            </p>

                                            {active && (
                                                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-text-secondary ring-1 ring-border">
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-0.5 text-xs leading-5 text-text-secondary">
                                            {option.description}
                                        </p>
                                    </div>

                                    {!active && (
                                        <ChevronRight
                                            size={17}
                                            className="shrink-0 text-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <CircleX
                                size={17}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <div>
                                <p className="text-xs font-semibold text-red-700">
                                    Verification update failed
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-red-600">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border bg-background-alt/30 px-6 py-4">
                    <p className="hidden text-xs text-text-secondary sm:block">
                        The current status cannot be selected again.
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="ml-auto h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-text-primary transition-colors hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationVerificationModal;
