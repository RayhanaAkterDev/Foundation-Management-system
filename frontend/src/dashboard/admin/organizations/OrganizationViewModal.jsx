import React from 'react';
import {
    X,
    Mail,
    Calendar,
    Building2,
    FileText,
    Globe,
    Phone,
    MapPin,
    Users,
    Target,
    Tags,
    HeartHandshake,
    Shield,
} from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';

const OrganizationViewModal = ({ organization, loading, error, onClose }) => {
    if (!loading && !organization && !error) {
        return null;
    }

    const email =
        organization?.user?.email || organization?.email || 'Not provided';

    const formatType = (value) => {
        if (!value) {
            return 'Not provided';
        }

        return value
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const formatList = (value) => {
        if (!value) {
            return 'Not provided';
        }

        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'Not provided';
        }

        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);

                if (Array.isArray(parsed)) {
                    return parsed.length > 0
                        ? parsed.join(', ')
                        : 'Not provided';
                }
            } catch {
                // Keep normal string values unchanged.
            }
        }

        return value;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-900/10">
                {/* Header */}
                <div className="relative shrink-0 border-b border-border px-6 py-5">
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
                                Organization
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

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
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
                            {/* Account / Identity Summary */}
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

                            {/* Account Information */}
                            <div>
                                <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                                    Account information
                                </p>

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

                                    {/* Account Role */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Shield
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Account role
                                            </p>

                                            <p className="mt-1 text-sm font-medium capitalize text-text-primary">
                                                Organization
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Shield
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Account status
                                            </p>

                                            <div className="mt-1">
                                                <StatusBadge
                                                    status={
                                                        organization.user
                                                            ?.status ||
                                                        organization.status ||
                                                        'active'
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Shield
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

                                    {/* Member Since */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Calendar
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Member since
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-text-primary">
                                                {organization.created_at
                                                    ? new Date(
                                                          organization.created_at,
                                                      ).toLocaleDateString()
                                                    : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organization Information */}
                            <div>
                                <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                                    Organization information
                                </p>

                                <div className="divide-y divide-border rounded-xl border border-border">
                                    {/* Organization Type */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Building2
                                                size={17}
                                                strokeWidth={1.8}
                                            />
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
                                            <FileText
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Registration number
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-text-primary">
                                                {organization.registration_number ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Phone
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Phone number
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-text-primary">
                                                {organization.phone ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Website */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Globe
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Website
                                            </p>

                                            <p className="mt-1 truncate text-sm font-medium text-text-primary">
                                                {organization.website ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <MapPin
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Address
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-text-primary">
                                                {organization.address ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mission */}
                                    <div className="flex items-start gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Target
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Mission
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-text-primary">
                                                {organization.mission ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Focus Areas */}
                                    <div className="flex items-start gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Tags size={17} strokeWidth={1.8} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Focus areas
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-text-primary">
                                                {formatList(
                                                    organization.focus_areas,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Communities Served */}
                                    <div className="flex items-start gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Users
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Communities served
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-text-primary">
                                                {formatList(
                                                    organization.communities_served,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Primary Activities */}
                                    <div className="flex items-start gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <HeartHandshake
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Primary activities
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-text-primary">
                                                {formatList(
                                                    organization.primary_activities,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Team Size */}
                                    <div className="flex items-center gap-4 px-4 py-4">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                                            <Users
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                                                Team size
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-text-primary">
                                                {organization.team_size !==
                                                    null &&
                                                organization.team_size !==
                                                    undefined
                                                    ? organization.team_size
                                                    : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex shrink-0 justify-end border-t border-border px-6 py-4">
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
