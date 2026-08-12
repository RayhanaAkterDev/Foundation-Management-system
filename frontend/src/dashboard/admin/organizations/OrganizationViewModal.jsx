import React from 'react';
import {
    X,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Users,
    FileText,
} from 'lucide-react';

const VerificationBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
        verified:
            'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
        rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                styles[status] || 'bg-background-alt text-text-secondary'
            }`}
        >
            {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : 'Unknown'}
        </span>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
            <Icon size={15} />
        </div>

        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                {label}
            </p>

            <p className="mt-1 wrap-break-word text-sm font-medium text-text-primary">
                {value || 'Not provided'}
            </p>
        </div>
    </div>
);

const OrganizationViewModal = ({ organization, loading, error, onClose }) => {
    if (!organization && !loading && !error) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                            Organization details
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-text-primary">
                            {organization?.name || 'Organization'}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                    >
                        <X size={18} />
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center px-6 py-20">
                        <div className="text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                            <p className="mt-4 text-sm font-medium text-text-primary">
                                Loading organization...
                            </p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="p-6">
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    </div>
                )}

                {organization && !loading && (
                    <div className="overflow-y-auto">
                        <div className="border-b border-border bg-background-alt/30 px-6 py-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Building2 size={25} />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-text-primary">
                                            {organization.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-text-secondary">
                                            {organization.organization_type ||
                                                'Organization type not specified'}
                                        </p>
                                    </div>
                                </div>

                                <VerificationBadge
                                    status={organization.verification_status}
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 p-6 sm:grid-cols-2">
                            <InfoItem
                                icon={Mail}
                                label="Contact email"
                                value={organization.user?.email}
                            />

                            <InfoItem
                                icon={Phone}
                                label="Phone"
                                value={organization.phone}
                            />

                            <InfoItem
                                icon={Globe}
                                label="Website"
                                value={organization.website}
                            />

                            <InfoItem
                                icon={FileText}
                                label="Registration number"
                                value={organization.registration_number}
                            />

                            <InfoItem
                                icon={Users}
                                label="Team size"
                                value={organization.team_size}
                            />

                            <InfoItem
                                icon={MapPin}
                                label="Address"
                                value={organization.address}
                            />
                        </div>

                        <div className="space-y-6 border-t border-border px-6 py-6">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                    Mission
                                </p>

                                <p className="mt-2 text-sm leading-6 text-text-primary">
                                    {organization.mission ||
                                        'No mission statement provided.'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                    Focus areas
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-primary">
                                    {organization.focus_areas ||
                                        'No focus areas provided.'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                    Communities served
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-primary">
                                    {organization.communities_served ||
                                        'No community information provided.'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                    Primary activities
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-primary">
                                    {organization.primary_activities ||
                                        'No primary activities provided.'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-border bg-background-alt/30 px-6 py-4">
                            <p className="text-xs text-text-secondary">
                                Registered{' '}
                                {organization.created_at
                                    ? new Date(
                                          organization.created_at,
                                      ).toLocaleDateString()
                                    : '—'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationViewModal;
