import React from 'react';
import {
    X,
    Mail,
    Calendar,
    Building2,
    FileText,
    Tags,
    CircleCheck,
} from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';

const OrganizationViewModal = ({ organization, loading, error, onClose }) => {
    if (!loading && !organization && !error) {
        return null;
    }

    const email = organization?.user?.email || organization?.email || '—';

    const formatType = (type) => {
        if (!type) {
            return '—';
        }

        return type
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-900/10">
                {/* Header */}
                <div className="relative px-6 pb-5 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-all hover:bg-background-alt hover:text-text-primary"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>

                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                        Organization profile
                    </p>

                    <h2 className="mt-1.5 pr-12 text-xl font-semibold tracking-tight text-text-primary">
                        {organization
                            ? organization.name
                            : 'Organization Details'}
                    </h2>

                    {organization && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-text-secondary">
                                {formatType(organization.organization_type)}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-border" />

                            <StatusBadge
                                status={organization.verification_status}
                            />
                        </div>
                    )}

                    {!organization && !loading && error && (
                        <p className="mt-1 text-sm text-text-secondary">
                            Unable to load this organization
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {loading && (
                        <div className="flex min-h-48 flex-col items-center justify-center text-center">
                            <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />

                            <p className="text-sm font-medium text-text-primary">
                                Loading organization details...
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                Please wait a moment.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {organization && !loading && (
                        <div className="space-y-5">
                            {/* Identity */}
                            <div className="flex items-center gap-4 rounded-xl bg-background-alt/60 px-4 py-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Building2 size={22} strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-text-primary">
                                        {organization.name}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                                        {email}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="divide-y divide-border rounded-xl border border-border">
                                {/* Email */}
                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Mail size={17} strokeWidth={1.8} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Email address
                                        </p>

                                        <p className="mt-1 truncate text-sm font-medium text-text-primary">
                                            {email}
                                        </p>
                                    </div>
                                </div>

                                {/* Organization Type */}
                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Tags size={17} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Organization type
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {formatType(
                                                organization.organization_type,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Registration Number */}
                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <FileText size={17} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Registration number
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {organization.registration_number ||
                                                '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Registered */}
                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <Calendar size={17} strokeWidth={1.8} />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Registered
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-text-primary">
                                            {organization.created_at
                                                ? new Date(
                                                      organization.created_at,
                                                  ).toLocaleDateString()
                                                : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Verification */}
                                <div className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                        <CircleCheck
                                            size={17}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                            Verification status
                                        </p>

                                        <div className="mt-1">
                                            <StatusBadge
                                                status={
                                                    organization.verification_status
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-hover"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationViewModal;
