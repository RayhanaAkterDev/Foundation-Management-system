import React, { useState } from 'react';

import {
    Building2,
    Calendar,
    FileText,
    Globe,
    HeartHandshake,
    Home,
    Mail,
    Phone,
    Shield,
    Tags,
    Target,
    Users,
} from 'lucide-react';

/* ==========================================================================
   DATA HELPERS
============================================================================ */

const hasValue = (value) =>
    value !== undefined && value !== null && value !== '';

const displayValue = (value) =>
    hasValue(value) ? String(value) : 'Not provided';

const formatText = (value) =>
    String(value ?? '')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
    if (!value) return 'Not provided';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

const formatItems = (value) => {
    if (Array.isArray(value)) {
        return value.filter(hasValue);
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (!trimmed) return [];

        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);

                if (Array.isArray(parsed)) {
                    return parsed.filter(hasValue);
                }
            } catch {
                // Continue with comma-separated values.
            }
        }

        return trimmed
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return hasValue(value) ? [value] : [];
};

const getVerification = (status) => {
    const value = String(status || 'pending').toLowerCase();

    if (['verified', 'approved'].includes(value)) {
        return {
            label: 'Verified',
            tone: 'text-[#9FC4AF]!',
            dot: 'bg-[#6FA58A]',
        };
    }

    if (value === 'rejected') {
        return {
            label: 'Rejected',
            tone: 'text-[#D7A4A7]!',
            dot: 'bg-[#B86D73]',
        };
    }

    return {
        label: 'Pending review',
        tone: 'text-[#D5B37F]!',
        dot: 'bg-[#C09558]',
    };
};

const getAccountStatus = (status) => {
    const value = String(status || 'inactive').toLowerCase();

    if (value === 'active') {
        return {
            label: 'Active',
            description: 'Active account',
            tone: 'text-[#9FC4AF]!',
            dot: 'bg-[#6FA58A]',
        };
    }

    if (value === 'suspended') {
        return {
            label: 'Suspended',
            description: 'Suspended account',
            tone: 'text-[#D7A4A7]!',
            dot: 'bg-[#B86D73]',
        };
    }

    return {
        label: formatText(value),
        description: 'Inactive account',
        tone: 'text-[#A5AFBC]!',
        dot: 'bg-[#697586]',
    };
};

/* ==========================================================================
   SHARED PRESENTATION
============================================================================ */

const SectionHeading = ({ title }) => (
    <div className="flex min-w-0 items-center gap-5">
        <h2 className="shrink-0 font-sans! text-[19px] font-semibold! leading-[1.35] tracking-[-0.02em] text-[#EEF1F5]! sm:text-[21px]">
            {title}
        </h2>

        <div aria-hidden="true" className="h-px min-w-0 flex-1 bg-[#29323E]" />
    </div>
);

const SectionShell = ({ title, children }) => (
    <section className="min-w-0 overflow-hidden border border-[#252D38] bg-[#0E1219]">
        <div className="px-5 pt-7 sm:px-8 sm:pt-8 lg:px-9 lg:pt-9 xl:px-10">
            <SectionHeading title={title} />
        </div>

        {children}
    </section>
);

const TagList = ({ values }) => {
    const items = formatItems(values);

    if (!items.length) {
        return (
            <span className="font-sans! text-[14px] font-normal! text-[#5E6978]!">
                Not provided
            </span>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
                <span
                    key={`${String(item)}-${index}`}
                    className="border border-[#303A47] bg-[#151B24] px-3 py-1.5 font-sans! text-[13px] font-medium! text-[#AEB7C3]!"
                >
                    {formatText(item)}
                </span>
            ))}
        </div>
    );
};

const StatusLine = ({ label, value, tone, dot }) => (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-[#29323E] py-4 last:border-b-0">
        <span className="font-sans! text-[12px] text-[#8792A1]!">{label}</span>

        <span
            className={`flex max-w-full items-center gap-2 font-sans! text-[12px] font-medium! ${tone}`}
        >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />

            {value}
        </span>
    </div>
);

const FieldLabel = ({ icon: Icon, children }) => (
    <div className="flex min-w-0 items-center gap-2.5">
        <Icon
            size={14}
            strokeWidth={1.65}
            className="shrink-0 text-[#697586]"
        />

        <p className="font-sans! text-[12px] font-semibold! uppercase tracking-[0.13em] text-[#697586]!">
            {children}
        </p>
    </div>
);

const MetadataField = ({ icon, label, value, children }) => (
    <div className="min-w-0">
        <FieldLabel icon={icon}>{label}</FieldLabel>

        <div
            className={`mt-3 min-w-0 wrap-break-word font-sans! text-[14px] font-medium! leading-[1.65] ${
                hasValue(value) ? 'text-[#D6DBE1]!' : 'text-[#5E6978]!'
            }`}
        >
            {children ?? displayValue(value)}
        </div>
    </div>
);

const BandIntroduction = ({ icon: Icon, title, description }) => (
    <div className="min-w-0">
        <div className="flex items-center gap-2.5">
            <Icon
                size={14}
                strokeWidth={1.7}
                className="shrink-0 text-[#8792A1]"
            />

            <p className="font-sans! text-[12px] font-semibold! uppercase tracking-[0.15em] text-[#8792A1]!">
                {title}
            </p>
        </div>

        <p className="mt-2.5 max-w-[220px] font-sans! text-[13px] leading-[1.65] text-[#697586]!">
            {description}
        </p>
    </div>
);

const DirectoryRow = ({ icon: Icon, label, value, children, last = false }) => (
    <div
        className={`grid min-w-0 gap-3 py-5 @[720px]:grid-cols-[150px_minmax(0,1fr)] @[720px]:gap-6 @[950px]:grid-cols-[170px_minmax(0,1fr)] ${
            last ? 'pb-0' : 'border-b border-[#29323E]'
        }`}
    >
        <div className="flex min-w-0 items-start gap-2.5">
            <Icon
                size={13}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-[#697586]"
            />

            <p className="font-sans! text-[12px] font-semibold! uppercase tracking-[0.12em] text-[#8792A1]!">
                {label}
            </p>
        </div>

        <div
            className={`min-w-0 wrap-break-word font-sans! text-[14px] font-medium! leading-[1.65] @[720px]:pt-0.5 ${
                hasValue(value) ? 'text-[#B8C0CA]!' : 'text-[#5E6978]!'
            }`}
        >
            {children ?? displayValue(value)}
        </div>
    </div>
);

/* ==========================================================================
   ORGANIZATION IDENTITY
   Matches the identity layout of UserDetailsView
============================================================================ */

const OrganizationIdentity = ({ organization }) => {
    const name =
        organization.name || organization.user?.name || 'Unnamed organization';

    const image =
        organization.photo ||
        organization.logo ||
        organization.organization_logo ||
        organization.user?.photo ||
        '';

    const [failedImage, setFailedImage] = useState('');

    const initial = name.trim().charAt(0).toUpperCase();

    const email = organization.user?.email || organization.email || '';

    const phone = organization.user?.phone || organization.phone || '';

    const created = organization.user?.created_at || organization.created_at;

    const organizationType =
        organization.organization_type || organization.type || '';

    const verification = getVerification(organization.verification_status);

    const account = getAccountStatus(
        organization.user?.status || organization.status || 'inactive',
    );

    const emailStatus =
        organization.user?.email_verified_at ??
        organization.user?.email_verified ??
        organization.email_verified_at ??
        organization.email_verified;

    const emailVerified =
        emailStatus === true ||
        emailStatus === 1 ||
        emailStatus === '1' ||
        (typeof emailStatus === 'string' &&
            emailStatus.length > 0 &&
            emailStatus !== 'false' &&
            emailStatus !== '0');

    return (
        <section className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
            {/* Identity heading */}

            <div className="border-b border-[#252D38] px-5 py-4 sm:px-7 lg:px-9">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <Building2
                            size={15}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#8492A3]"
                        />

                        <span className="font-sans! text-[11px] font-semibold! uppercase tracking-[0.11em] text-[#A9B4C2]!">
                            Organization account
                        </span>
                    </div>

                    <span className="font-sans! text-[11px] tabular-nums text-[#758294]!">
                        Organization ID · {organization.id ?? '—'}
                    </span>
                </div>
            </div>

            {/* Identity body and account standing */}

            <div className="grid min-w-0 @[850px]:grid-cols-[minmax(0,1fr)_290px] @[1100px]:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 px-5 py-7 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
                    <div className="flex min-w-0 flex-col items-start gap-5 @[620px]:flex-row @[620px]:gap-6">
                        <div className="flex h-17 w-17 shrink-0 items-center justify-center overflow-hidden border border-[#37414E] bg-[#1B2430] font-sans! text-[23px] font-semibold! text-[#D5DDE7]! sm:h-20 sm:w-20">
                            {image && failedImage !== image ? (
                                <img
                                    src={image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    onError={() => setFailedImage(image)}
                                />
                            ) : initial ? (
                                initial
                            ) : (
                                <Building2 size={28} strokeWidth={1.5} />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span
                                    className={`font-sans! text-[12px] font-medium! ${account.tone}`}
                                >
                                    {account.description}
                                </span>

                                <span className="text-[#465260]">·</span>

                                <span className="font-sans! text-[12px] text-[#8996A6]!">
                                    {organizationType
                                        ? formatText(organizationType)
                                        : 'Organization'}
                                </span>
                            </div>

                            <h1 className="mt-2 wrap-break-word font-sans! text-[24px] font-semibold! leading-[1.25] tracking-[-0.025em] text-[#E5EAF0]! sm:text-[29px] lg:text-[32px]">
                                {name}
                            </h1>

                            <div className="mt-4 flex min-w-0 flex-col gap-2.5">
                                <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#A2ADBA]">
                                    <Mail
                                        size={15}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-[#778596]"
                                    />

                                    <span className="min-w-0 break-all">
                                        {email || 'No email address'}
                                    </span>
                                </div>

                                {phone && (
                                    <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#A2ADBA]">
                                        <Phone
                                            size={15}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-[#778596]"
                                        />

                                        <span className="break-words">
                                            {phone}
                                        </span>
                                    </div>
                                )}

                                <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#A2ADBA]">
                                    <Calendar
                                        size={15}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-[#778596]"
                                    />

                                    <span>Joined {formatDate(created)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="min-w-0 border-t border-[#29323E] bg-[#121821] px-5 py-6 sm:px-7 @[850px]:border-t-0 @[850px]:border-l lg:py-9">
                    <div className="flex items-center gap-2.5">
                        <Shield
                            size={16}
                            strokeWidth={1.7}
                            className="text-[#8C9AAA]"
                        />

                        <h2 className="font-sans! text-[14px] font-semibold! text-[#D8E0E9]!">
                            Account standing
                        </h2>
                    </div>

                    <div className="mt-5 border-t border-[#27303C]">
                        <StatusLine
                            label="Account access"
                            value={account.label}
                            tone={account.tone}
                            dot={account.dot}
                        />

                        <StatusLine
                            label="Email verification"
                            value={emailVerified ? 'Verified' : 'Unverified'}
                            tone={
                                emailVerified
                                    ? 'text-[#9FC4AF]!'
                                    : 'text-[#D5B37F]!'
                            }
                            dot={
                                emailVerified ? 'bg-[#6FA58A]' : 'bg-[#C09558]'
                            }
                        />

                        <StatusLine
                            label="Organization verification"
                            value={verification.label}
                            tone={verification.tone}
                            dot={verification.dot}
                        />
                    </div>
                </aside>
            </div>
        </section>
    );
};

/* ==========================================================================
   ORGANIZATION INFORMATION
   Same two-part layout as UserDetailsView
============================================================================ */

const OrganizationInformation = ({ organization }) => {
    const organizationType =
        organization.organization_type || organization.type || '';

    const registrationNumber = organization.registration_number || '';

    const phone = organization.phone || '';

    const website = organization.website || '';

    const address = organization.address || '';

    const websiteHref = website
        ? /^https?:\/\//i.test(website)
            ? website
            : `https://${website}`
        : '';

    return (
        <SectionShell title="Organization information">
            {/* Primary organization metadata */}

            <div className="px-5 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-10 xl:px-10">
                <div className="grid min-w-0 grid-cols-1 gap-y-6 @[720px]:grid-cols-2 @[720px]:gap-y-0">
                    <div className="min-w-0 @[720px]:border-r @[720px]:border-[#252D38] @[720px]:pr-8 lg:pr-10">
                        <MetadataField
                            icon={Building2}
                            label="Organization type"
                            value={
                                organizationType
                                    ? formatText(organizationType)
                                    : ''
                            }
                        />
                    </div>

                    <div className="min-w-0 border-t border-[#202832] pt-5 @[720px]:border-t-0 @[720px]:pl-8 @[720px]:pt-0 lg:pl-10">
                        <MetadataField
                            icon={FileText}
                            label="Registration number"
                            value={registrationNumber}
                        />
                    </div>
                </div>
            </div>

            {/* Contact directory */}

            <div className="border-t border-[#252D38] bg-[#121821] px-5 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-9 xl:px-10">
                <div className="grid min-w-0 gap-6 @[720px]:grid-cols-[180px_minmax(0,1fr)] @[950px]:grid-cols-[200px_minmax(0,1fr)] sm:gap-8 lg:gap-10">
                    <BandIntroduction
                        icon={Phone}
                        title="Contact"
                        description="Contact channels and registered organization location."
                    />

                    <div className="min-w-0 border-t border-[#29323E] @[720px]:border-t-0">
                        <DirectoryRow
                            icon={Phone}
                            label="Phone"
                            value={phone}
                        />

                        <DirectoryRow
                            icon={Globe}
                            label="Website"
                            value={website}
                        >
                            {website ? (
                                <a
                                    href={websiteHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wrap-break-word text-[#B8C0CA]! underline decoration-[#465261] underline-offset-4 transition-colors hover:text-[#EEF1F5]!"
                                >
                                    {website}
                                </a>
                            ) : null}
                        </DirectoryRow>

                        <DirectoryRow
                            icon={Home}
                            label="Address"
                            value={address}
                            last
                        />
                    </div>
                </div>
            </div>
        </SectionShell>
    );
};

/* ==========================================================================
   MISSION & FOCUS
   Matches UserDetailsView's mission and secondary focus band
============================================================================ */

const OrganizationPurpose = ({ organization }) => (
    <SectionShell title="Mission & focus">
        {/* Mission */}

        <div className="px-5 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-10 xl:px-10">
            <div className="grid min-w-0 gap-5 @[720px]:grid-cols-[180px_minmax(0,1fr)] @[950px]:grid-cols-[200px_minmax(0,1fr)] sm:gap-8 lg:gap-10">
                <BandIntroduction
                    icon={Target}
                    title="Mission"
                    description="The purpose and direction of this organization."
                />

                <div className="min-w-0 border-l-2 border-[#465261] pl-4 sm:pl-5">
                    <p
                        className={`max-w-[820px] whitespace-pre-line wrap-break-word font-sans! text-[14px] leading-[1.8] ${
                            organization.mission
                                ? 'text-[#B8C0CA]!'
                                : 'text-[#5E6978]!'
                        }`}
                    >
                        {organization.mission || 'Not provided'}
                    </p>
                </div>
            </div>
        </div>

        {/* Focus and communities */}

        <div className="border-t border-[#252D38] bg-[#121821] px-5 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-9 xl:px-10">
            <div className="grid min-w-0 gap-6 @[720px]:grid-cols-[180px_minmax(0,1fr)] @[950px]:grid-cols-[200px_minmax(0,1fr)] sm:gap-8 lg:gap-10">
                <BandIntroduction
                    icon={Tags}
                    title="Focus"
                    description="Priority causes and communities this organization serves."
                />

                <div className="min-w-0 border-t border-[#29323E] @[720px]:border-t-0">
                    <DirectoryRow
                        icon={Tags}
                        label="Focus areas"
                        value={formatItems(organization.focus_areas).join(', ')}
                    >
                        <TagList values={organization.focus_areas} />
                    </DirectoryRow>

                    <DirectoryRow
                        icon={Users}
                        label="Communities"
                        value={formatItems(
                            organization.communities_served,
                        ).join(', ')}
                        last
                    >
                        <TagList values={organization.communities_served} />
                    </DirectoryRow>
                </div>
            </div>
        </div>
    </SectionShell>
);

/* ==========================================================================
   TEAM & ACTIVITIES
   Matches the featured operations composition in UserDetailsView
============================================================================ */

const OrganizationOperations = ({ organization }) => {
    const hasTeamSize = hasValue(organization.team_size);

    return (
        <SectionShell title="Team & activities">
            <div className="px-5 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-9 xl:px-10">
                <div className="grid min-w-0 overflow-hidden border border-[#29323E] bg-[#121821] @[850px]:grid-cols-[minmax(0,1fr)_240px] @[1100px]:grid-cols-[minmax(0,1fr)_270px]">
                    {/* Featured activities */}

                    <div className="relative min-w-0 px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
                        <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-0.5 bg-[#465261]"
                        />

                        <div className="flex items-start gap-3.5 sm:gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#303A47] bg-[#151B24] text-[#8792A1] sm:h-11 sm:w-11">
                                <HeartHandshake size={18} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="font-sans! text-[14px] font-semibold! leading-5 text-[#EEF1F5]!">
                                    Primary activities
                                </h3>

                                <p className="mt-2 max-w-[560px] font-sans! text-[13px] leading-[1.7] text-[#8792A1]! lg:text-[14px]">
                                    Regular programs and humanitarian work
                                    carried out by this organization.
                                </p>

                                <div className="mt-5 border-t border-[#202832] pt-5">
                                    <TagList
                                        values={organization.primary_activities}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team size */}

                    <div className="min-w-0 border-t border-[#29323E] bg-[#1A222D] px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7 @[850px]:border-t-0 @[850px]:border-l">
                        <div className="flex h-full items-center justify-between gap-5 @[850px]:flex-col @[850px]:items-start @[850px]:justify-center">
                            <div className="flex items-center gap-2.5">
                                <Users
                                    size={14}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <p className="font-sans! text-[12px] font-semibold! uppercase tracking-[0.14em] text-[#697586]!">
                                    Team size
                                </p>
                            </div>

                            <div className="flex shrink-0 items-end gap-2 @[850px]:mt-5">
                                <span
                                    className={`font-sans! font-semibold! leading-none ${
                                        hasTeamSize
                                            ? 'text-[27px] tracking-[-0.04em] text-[#EEF1F5]! lg:text-[30px]'
                                            : 'text-[13px] text-[#5E6978]!'
                                    }`}
                                >
                                    {hasTeamSize
                                        ? organization.team_size
                                        : 'Not provided'}
                                </span>

                                {hasTeamSize && (
                                    <span className="mb-0.5 font-sans! text-[12px] font-medium! text-[#697586]!">
                                        members
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionShell>
    );
};

/* ==========================================================================
   MAIN ORGANIZATION DETAILS VIEW
============================================================================ */

const OrganizationDetailsView = ({ organization }) => {
    if (!organization) return null;

    return (
        <div className="@container min-w-0 space-y-6 font-sans! sm:space-y-8">
            <OrganizationIdentity organization={organization} />

            <OrganizationInformation organization={organization} />

            <OrganizationPurpose organization={organization} />

            <OrganizationOperations organization={organization} />
        </div>
    );
};

export default OrganizationDetailsView;
