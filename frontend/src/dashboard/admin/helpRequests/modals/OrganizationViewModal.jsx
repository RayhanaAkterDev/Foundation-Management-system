import React from 'react';

import {
    X,
    Mail,
    Calendar,
    Building2,
    Globe,
    Phone,
    MapPin,
    Users,
    Target,
    Tags,
    HeartHandshake,
    ShieldCheck,
    ArrowUpRight,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const OrganizationViewModal = ({ organization, loading, error, onClose }) => {
    if (!loading && !organization && !error) {
        return null;
    }

    const email =
        organization?.user?.email || organization?.email || 'Not provided';

    const formatType = (type) => {
        if (!type) {
            return 'Not specified';
        }

        return type
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatList = (value) => {
        if (!value) {
            return 'Not provided';
        }

        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : 'Not provided';
        }

        if (typeof value === 'string') {
            return value;
        }

        return 'Not provided';
    };

    const getListItems = (value) => {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === 'string') {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    };

    const organizationName =
        organization?.name || organization?.organization_name || 'Organization';

    const verificationStatus =
        organization?.verification_status || organization?.status || 'pending';

    const accountStatus =
        organization?.user?.status || organization?.account_status || 'active';

    const memberSince = organization?.created_at
        ? new Date(organization.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Not available';

    const registrationNumber =
        organization?.registration_number ||
        organization?.registration_no ||
        'Not provided';

    const organizationType =
        organization?.organization_type || organization?.type;

    const teamSize =
        organization?.team_size ||
        organization?.members_count ||
        organization?.member_count;

    const mission =
        organization?.mission ||
        organization?.description ||
        'No mission statement provided.';

    const website = organization?.website || organization?.website_url;

    const phone =
        organization?.phone ||
        organization?.phone_number ||
        organization?.contact_phone;

    const address =
        organization?.address ||
        organization?.location ||
        organization?.office_address;

    const workAreas =
        organization?.work_areas ||
        organization?.areas_of_work ||
        organization?.focus_areas;

    const impactAreas =
        organization?.impact_areas ||
        organization?.causes ||
        organization?.sectors;

    const workAreaItems = getListItems(workAreas);
    const impactAreaItems = getListItems(impactAreas);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* --------------------------------
                    Header
                   -------------------------------- */}

                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            Organization details
                        </p>

                        <h2 className="mt-1 text-xl font-bold tracking-tight text-text-primary">
                            View organization
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-background-alt hover:text-text-primary"
                        aria-label="Close"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* --------------------------------
                    Content
                   -------------------------------- */}

                <div className="overflow-y-auto">
                    {loading ? (
                        <div className="flex min-h-100 items-center justify-center px-6 py-12">
                            <div className="text-center">
                                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />

                                <p className="text-sm font-semibold text-text-primary">
                                    Loading organization details...
                                </p>

                                <p className="mt-1 text-xs text-text-secondary">
                                    Please wait while we retrieve the
                                    organization information.
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-8">
                            <div className="border-l-4 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-600">
                                {error}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-7 p-6">
                            {/* --------------------------------
                                Organization Hero
                               -------------------------------- */}

                            <section className="rounded-2xl border border-border bg-background-alt/50 p-6">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Building2
                                                size={26}
                                                strokeWidth={1.7}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-xl font-bold tracking-tight text-text-primary">
                                                {organizationName}
                                            </h3>

                                            <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                                                <Mail
                                                    size={15}
                                                    strokeWidth={1.8}
                                                />

                                                <span className="truncate">
                                                    {email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap gap-2">
                                        <StatusBadge
                                            status={verificationStatus}
                                        />

                                        <StatusBadge status={accountStatus} />
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                            Member since
                                        </p>

                                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                                            <Calendar
                                                size={15}
                                                className="text-primary"
                                            />

                                            {memberSince}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                            Registration
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-text-primary">
                                            {registrationNumber}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                                            Organization type
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-text-primary">
                                            {formatType(organizationType)}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* --------------------------------
                                Basic Information
                               -------------------------------- */}

                            <section>
                                <div className="mb-4">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                        Organization profile
                                    </p>

                                    <h3 className="mt-1 text-base font-bold text-text-primary">
                                        Basic information
                                    </h3>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <Building2 size={16} />

                                            <span className="text-xs font-semibold">
                                                Type
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-text-primary">
                                            {formatType(organizationType)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <Users size={16} />

                                            <span className="text-xs font-semibold">
                                                Team size
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-text-primary">
                                            {teamSize || 'Not provided'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <ShieldCheck size={16} />

                                            <span className="text-xs font-semibold">
                                                Verification
                                            </span>
                                        </div>

                                        <div className="mt-2">
                                            <StatusBadge
                                                status={verificationStatus}
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <HeartHandshake size={16} />

                                            <span className="text-xs font-semibold">
                                                Account role
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm font-semibold capitalize text-text-primary">
                                            {organization?.user?.role ||
                                                'Organization'}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* --------------------------------
                                Mission
                               -------------------------------- */}

                            <section className="rounded-xl border border-border bg-white p-5">
                                <div className="flex items-center gap-2">
                                    <Target
                                        size={18}
                                        className="text-primary"
                                    />

                                    <h3 className="text-sm font-bold text-text-primary">
                                        Mission
                                    </h3>
                                </div>

                                <p className="mt-3 text-sm leading-6 text-text-secondary">
                                    {mission}
                                </p>
                            </section>

                            {/* --------------------------------
                                Work & Impact
                               -------------------------------- */}

                            <section>
                                <div className="mb-4">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                        Work & impact
                                    </p>

                                    <h3 className="mt-1 text-base font-bold text-text-primary">
                                        Areas of focus
                                    </h3>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="rounded-xl border border-border bg-white p-5">
                                        <div className="flex items-center gap-2">
                                            <Tags
                                                size={17}
                                                className="text-primary"
                                            />

                                            <h4 className="text-sm font-bold text-text-primary">
                                                Areas of work
                                            </h4>
                                        </div>

                                        {workAreaItems.length > 0 ? (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {workAreaItems.map(
                                                    (item, index) => (
                                                        <span
                                                            key={`${item}-${index}`}
                                                            className="rounded-full bg-background-alt px-3 py-1.5 text-xs font-semibold text-text-secondary"
                                                        >
                                                            {item}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="mt-3 text-sm text-text-secondary">
                                                {formatList(workAreas)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-5">
                                        <div className="flex items-center gap-2">
                                            <HeartHandshake
                                                size={17}
                                                className="text-primary"
                                            />

                                            <h4 className="text-sm font-bold text-text-primary">
                                                Impact areas
                                            </h4>
                                        </div>

                                        {impactAreaItems.length > 0 ? (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {impactAreaItems.map(
                                                    (item, index) => (
                                                        <span
                                                            key={`${item}-${index}`}
                                                            className="rounded-full bg-background-alt px-3 py-1.5 text-xs font-semibold text-text-secondary"
                                                        >
                                                            {item}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="mt-3 text-sm text-text-secondary">
                                                {formatList(impactAreas)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* --------------------------------
                                Contact Information
                               -------------------------------- */}

                            <section>
                                <div className="mb-4">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                                        Contact
                                    </p>

                                    <h3 className="mt-1 text-base font-bold text-text-primary">
                                        Organization contact
                                    </h3>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-primary">
                                                <Mail size={16} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-text-secondary">
                                                    Email
                                                </p>

                                                <p className="mt-1 break-all text-sm font-semibold text-text-primary">
                                                    {email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-primary">
                                                <Phone size={16} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-text-secondary">
                                                    Phone
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-text-primary">
                                                    {phone || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-primary">
                                                <MapPin size={16} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-text-secondary">
                                                    Address
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-text-primary">
                                                    {address || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border bg-white p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-alt text-primary">
                                                <Globe size={16} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-text-secondary">
                                                    Website
                                                </p>

                                                {website ? (
                                                    <a
                                                        href={
                                                            website.startsWith(
                                                                'http',
                                                            )
                                                                ? website
                                                                : `https://${website}`
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-sm font-semibold text-primary hover:text-primary-hover hover:underline"
                                                    >
                                                        <span className="truncate">
                                                            {website}
                                                        </span>

                                                        <ArrowUpRight
                                                            size={14}
                                                            className="shrink-0"
                                                        />
                                                    </a>
                                                ) : (
                                                    <p className="mt-1 text-sm font-semibold text-text-primary">
                                                        Not provided
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* --------------------------------
                                Timeline
                               -------------------------------- */}

                            <section className="rounded-xl border border-border bg-background-alt/40 p-5">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={18}
                                        className="text-primary"
                                    />

                                    <h3 className="text-sm font-bold text-text-primary">
                                        Organization timeline
                                    </h3>
                                </div>

                                <div className="mt-5 border-l border-border pl-5">
                                    <div className="relative">
                                        <span className="absolute -left-6.25 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />

                                        <p className="text-xs font-semibold text-text-secondary">
                                            Account created
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-text-primary">
                                            {memberSince}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* --------------------------------
                                Trust Note
                               -------------------------------- */}

                            <section className="rounded-xl border border-primary/15 bg-primary/5 p-5">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck
                                        size={19}
                                        className="mt-0.5 shrink-0 text-primary"
                                    />

                                    <div>
                                        <h3 className="text-sm font-bold text-text-primary">
                                            Verification & trust
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                                            Organization information shown here
                                            comes from its registered profile
                                            and verification records.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* --------------------------------
                    Footer
                   -------------------------------- */}

                <div className="flex items-center justify-end border-t border-border bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationViewModal;
