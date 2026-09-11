import React from 'react';

import {
    X,
    Mail,
    Calendar,
    Shield,
    UserRound,
    Phone,
    MapPin,
    Home,
    Building2,
    FileText,
    Globe,
    Users,
    Target,
    Tags,
    HeartHandshake,
    Hash,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

// ============================================================
// HELPERS
// ============================================================

const formatType = (value) => {
    if (!value) return 'Not provided';

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatList = (value) => {
    if (!value) return 'Not provided';

    if (Array.isArray(value)) {
        return value.length ? value.join(', ') : 'Not provided';
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed.length ? parsed.join(', ') : 'Not provided';
            }

            return parsed || 'Not provided';
        } catch {
            return value;
        }
    }

    return String(value);
};

const formatDate = (value) => {
    if (!value) return 'Not provided';

    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// ============================================================
// PROFILE SECTION
// ============================================================

const ProfileSection = ({ number, title, description, children }) => (
    <section className="border-b border-border py-7 sm:py-8 last:border-b-0">
        <div className="mb-5 flex items-start gap-4 sm:mb-6 sm:gap-5">
            <div className="flex shrink-0 items-center gap-2.5 pt-1.5">
                <span className="font-[Poppins] text-[9px] font-semibold tracking-[0.17em] text-primary">
                    {number}
                </span>

                <span className="hidden h-px w-8 bg-primary/25 sm:block" />
            </div>

            <div className="min-w-0">
                <h2 className="font-[Fraunces] text-[22px] font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-[24px]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                        {description}
                    </p>
                )}
            </div>
        </div>

        {children}
    </section>
);

// ============================================================
// INFORMATION DETAIL
// ============================================================

const Detail = ({
    icon: Icon,
    label,
    value,
    wide = false,
    emphasized = false,
}) => {
    const displayValue =
        value !== undefined && value !== null && value !== ''
            ? value
            : 'Not provided';

    return (
        <div
            className={`
                border-t border-border/90
                py-4.5
                sm:py-5
                ${wide ? 'sm:col-span-2' : ''}
            `}
        >
            <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <div
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        border border-primary/10
                        bg-primary/4.5
                        text-primary
                    "
                >
                    <Icon size={16} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="mb-1.5 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                        {label}
                    </p>

                    <div
                        className={`
                            wrap-break-word
                            text-[13px]
                            leading-6
                            sm:text-[14px]
                            ${
                                emphasized
                                    ? 'font-semibold text-text-primary'
                                    : 'font-medium text-slate-600'
                            }
                        `}
                    >
                        {displayValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// CONTACT HIGHLIGHT
// ============================================================

const ContactHighlight = ({ email, status }) => (
    <div className="mb-6 overflow-hidden border border-border bg-surface sm:mb-7">
        <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3.5 px-4 py-4 sm:gap-4 sm:px-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary text-white sm:h-11 sm:w-11">
                    <Mail size={18} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                    <p className="mb-1 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.15em] text-text-secondary">
                        Primary contact
                    </p>

                    <p className="wrap-break-word text-[13px] font-semibold text-text-primary sm:truncate sm:text-[14px]">
                        {email || 'Not provided'}
                    </p>
                </div>
            </div>

            <div
                className="
                    flex items-center
                    border-t border-border
                    bg-background/45
                    px-4 py-3
                    sm:px-5 sm:py-3.5
                    sm:border-l sm:border-t-0
                "
            >
                <StatusBadge status={status} />
            </div>
        </div>
    </div>
);

// ============================================================
// LONG INFORMATION DETAIL
// ============================================================

const LongDetail = ({ icon: Icon, label, value }) => {
    const displayValue =
        value !== undefined && value !== null && value !== ''
            ? value
            : 'Not provided';

    return (
        <div className="border-t border-border/90 py-4.5 sm:py-5">
            <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <div
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        border border-primary/10
                        bg-primary/4.5
                        text-primary
                    "
                >
                    <Icon size={16} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="mb-1.5 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                        {label}
                    </p>

                    <p className="max-w-2xl wrap-break-word text-[13px] leading-6 text-slate-600 sm:text-[14px]">
                        {displayValue}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ViewModal = ({ user, loading, error, onClose }) => {
    if (!user && !loading && !error) {
        return null;
    }

    const individualProfile = user?.individual_profile;
    const organization = user?.organization;

    const roleLabel =
        user?.role === 'admin' ? 'Administrator' : formatType(user?.role);

    const isOrganization = user?.role === 'organization';

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-slate-950/50
                p-0
                backdrop-blur-[3px]
                sm:p-3
                lg:p-4
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-user-title"
        >
            <div
                className="
                    flex
                    h-full
                    max-h-dvh
                    w-full
                    overflow-hidden
                    bg-surface
                    shadow-2xl shadow-slate-950/20
                    sm:h-auto
                    sm:max-h-[94vh]
                    sm:rounded-xl
                    lg:max-h-[92vh]
                    lg:max-w-4xl
                "
            >
                {/* ========================================================
                    PROFILE SIDEBAR
                ========================================================= */}

                <aside
                    className="
                        relative hidden w-72 shrink-0
                        flex-col justify-between
                        overflow-hidden
                        bg-primary
                        p-6
                        text-white
                        lg:flex
                        lg:p-7
                    "
                >
                    <div
                        className="
                            pointer-events-none absolute
                            -right-20 -top-20
                            h-52 w-52
                            rounded-full
                            border-26
                            border-white/4.5
                        "
                    />

                    <div
                        className="
                            pointer-events-none absolute
                            -bottom-24 -left-24
                            h-64 w-64
                            rounded-full
                            border-30
                            border-white/[0.035]
                        "
                    />

                    <div
                        className="
                            pointer-events-none absolute
                            right-0 top-[46%]
                            h-px w-20
                            bg-white/8
                        "
                    />

                    <div className="relative">
                        <div className="mb-9 flex items-center gap-2.5 xl:mb-11">
                            <div
                                className="
                                    flex h-8 w-8
                                    items-center justify-center
                                    border border-white/20
                                    bg-white/10
                                    text-[10px]
                                    font-bold
                                    tracking-[0.08em]
                                "
                            >
                                SP
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold tracking-wide text-white">
                                    Account record
                                </p>

                                <p className="mt-0.5 font-[Poppins] text-[8px] font-medium uppercase tracking-[0.17em] text-white/45">
                                    Stand For People
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                mb-5
                                flex h-18 w-18
                                items-center justify-center
                                border border-white/20
                                bg-white
                                text-primary
                                shadow-lg shadow-slate-950/10
                                xl:mb-6
                            "
                        >
                            {isOrganization ? (
                                <Building2 size={29} strokeWidth={1.5} />
                            ) : (
                                <UserRound size={29} strokeWidth={1.5} />
                            )}
                        </div>

                        <p className="mb-2 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                            {roleLabel}
                        </p>

                        <h1
                            className="
                                max-w-52.5
                                font-[Fraunces]
                                text-[27px]
                                font-semibold
                                leading-[1.08]
                                tracking-tight
                                text-white
                                xl:text-[29px]
                            "
                        >
                            {user?.name || 'User'}
                        </h1>

                        <div className="mt-5">
                            <StatusBadge status={user?.status} />
                        </div>

                        <div className="mt-8 border-t border-white/15 pt-5 xl:mt-9">
                            <div className="flex items-start gap-3">
                                <Calendar
                                    size={15}
                                    className="mt-0.5 shrink-0 text-white/45"
                                    strokeWidth={1.7}
                                />

                                <div>
                                    <p className="font-[Poppins] text-[8px] font-semibold uppercase tracking-[0.16em] text-white/40">
                                        Registered
                                    </p>

                                    <p className="mt-1.5 text-[12px] font-medium text-white/85">
                                        {formatDate(user?.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative border-t border-white/15 pt-5">
                        <p className="text-[11px] font-semibold text-white/90">
                            Stand For People
                        </p>

                        <p className="mt-1.5 max-w-51.25 text-[10px] leading-5 text-white/50">
                            Connecting people, organizations and resources with
                            verified humanitarian needs.
                        </p>
                    </div>
                </aside>

                {/* ========================================================
                    MAIN CONTENT
                ========================================================= */}

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* HEADER */}
                    <header
                        className="
                            flex shrink-0 items-center justify-between
                            border-b border-border
                            bg-surface
                            px-4 py-4
                            sm:px-6
                            lg:px-8
                        "
                    >
                        <div className="min-w-0">
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

                                <span className="font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    Profile
                                </span>
                            </div>

                            <h2
                                id="view-user-title"
                                className="
                                    font-[Fraunces]
                                    text-[20px]
                                    font-semibold
                                    leading-tight
                                    tracking-tight
                                    text-text-primary
                                    sm:text-[22px]
                                "
                            >
                                Account information
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close profile"
                            className="
                                ml-3 flex h-9 w-9 shrink-0
                                items-center justify-center
                                border border-border
                                bg-surface
                                text-text-secondary
                                transition-colors
                                hover:border-primary/25
                                hover:bg-primary/4.5
                                hover:text-primary
                                sm:ml-4
                            "
                        >
                            <X size={17} strokeWidth={1.8} />
                        </button>
                    </header>

                    {/* SCROLLABLE CONTENT */}
                    <main
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            bg-background
                            px-4 py-5
                            sm:px-6 sm:py-6
                            lg:px-8 lg:py-7
                        "
                    >
                        {loading ? (
                            <div className="flex min-h-105 items-center justify-center px-4">
                                <div className="text-center">
                                    <div
                                        className="
                                            mx-auto mb-4
                                            flex h-11 w-11
                                            items-center justify-center
                                            border border-primary/15
                                            bg-primary/5.5
                                            text-primary
                                        "
                                    >
                                        <span
                                            className="
                                                h-4 w-4
                                                animate-spin
                                                border-2
                                                border-primary/20
                                                border-t-primary
                                            "
                                        />
                                    </div>

                                    <p className="text-[13px] font-semibold text-text-primary">
                                        Loading account
                                    </p>

                                    <p className="mt-1 text-[12px] text-text-secondary">
                                        Preparing profile information
                                    </p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex min-h-105 items-center justify-center px-1 sm:px-4">
                                <div className="w-full max-w-md border border-red-200 bg-red-50/70 px-4 py-5 sm:px-5">
                                    <div className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-100 text-red-600">
                                            <FileText
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[13px] font-semibold text-red-900">
                                                Unable to load profile
                                            </p>

                                            <p className="mt-1 text-[12px] leading-5 text-red-700">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto max-w-3xl">
                                {/* ACCOUNT OVERVIEW */}
                                <div className="border-b border-border pb-6 sm:pb-7">
                                    <div className="mb-4 sm:mb-5">
                                        <div className="flex items-center gap-2">
                                            <p className="font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.16em] text-primary">
                                                Account overview
                                            </p>

                                            <span className="h-px w-7 bg-border" />
                                        </div>

                                        <p className="mt-1.5 text-[12px] text-text-secondary sm:text-[13px]">
                                            Core account and contact details
                                        </p>
                                    </div>

                                    <ContactHighlight
                                        email={user?.email}
                                        status={user?.status}
                                    />
                                </div>

                                {/* PERSONAL INFORMATION */}
                                {!isOrganization && (
                                    <ProfileSection
                                        number="01"
                                        title="Personal information"
                                        description="Personal and location information provided by the member."
                                    >
                                        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                            <Detail
                                                icon={UserRound}
                                                label="Full name"
                                                value={user?.name}
                                                emphasized
                                            />

                                            <Detail
                                                icon={Phone}
                                                label="Phone number"
                                                value={user?.phone}
                                            />

                                            <Detail
                                                icon={MapPin}
                                                label="District"
                                                value={
                                                    individualProfile?.district
                                                }
                                                emphasized
                                            />

                                            <Detail
                                                icon={Calendar}
                                                label="Date of birth"
                                                value={
                                                    individualProfile?.date_of_birth
                                                }
                                            />

                                            <Detail
                                                icon={Home}
                                                label="Address"
                                                value={
                                                    individualProfile?.address
                                                }
                                                wide
                                            />
                                        </div>
                                    </ProfileSection>
                                )}

                                {/* ACCOUNT DETAILS */}
                                <ProfileSection
                                    number="02"
                                    title="Account details"
                                    description="Identity, access role and account status."
                                >
                                    <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                        <Detail
                                            icon={Mail}
                                            label="Email address"
                                            value={user?.email}
                                            emphasized
                                        />

                                        {isOrganization && (
                                            <Detail
                                                icon={Shield}
                                                label="Verification"
                                                value={
                                                    organization?.is_verified
                                                        ? 'Verified organization'
                                                        : 'Verification pending'
                                                }
                                                emphasized
                                            />
                                        )}

                                        <Detail
                                            icon={Calendar}
                                            label="Member since"
                                            value={formatDate(user?.created_at)}
                                        />

                                        <Detail
                                            icon={Shield}
                                            label="Account role"
                                            value={roleLabel}
                                            emphasized
                                        />

                                        <Detail
                                            icon={UserRound}
                                            label="Account status"
                                            value={
                                                <StatusBadge
                                                    status={user?.status}
                                                />
                                            }
                                        />
                                    </div>
                                </ProfileSection>

                                {/* ORGANIZATION INFORMATION */}
                                {isOrganization && (
                                    <>
                                        <ProfileSection
                                            number="02"
                                            title="Organization"
                                            description="Registration, contact and organizational identity."
                                        >
                                            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                                <Detail
                                                    icon={Building2}
                                                    label="Organization type"
                                                    value={formatType(
                                                        organization?.type,
                                                    )}
                                                    emphasized
                                                />

                                                <Detail
                                                    icon={Hash}
                                                    label="Registration number"
                                                    value={
                                                        organization?.registration_number
                                                    }
                                                />

                                                <Detail
                                                    icon={Phone}
                                                    label="Phone number"
                                                    value={organization?.phone}
                                                />

                                                <Detail
                                                    icon={Globe}
                                                    label="Website"
                                                    value={
                                                        organization?.website
                                                    }
                                                />

                                                <Detail
                                                    icon={Home}
                                                    label="Address"
                                                    value={
                                                        organization?.address
                                                    }
                                                    wide
                                                />
                                            </div>
                                        </ProfileSection>

                                        <ProfileSection
                                            number="03"
                                            title="Mission & reach"
                                            description="The organization's purpose, focus areas and community coverage."
                                        >
                                            <div>
                                                <LongDetail
                                                    icon={Target}
                                                    label="Mission"
                                                    value={
                                                        organization?.mission
                                                    }
                                                />

                                                <LongDetail
                                                    icon={Tags}
                                                    label="Focus areas"
                                                    value={formatList(
                                                        organization?.focus_areas,
                                                    )}
                                                />

                                                <LongDetail
                                                    icon={Users}
                                                    label="Communities served"
                                                    value={formatList(
                                                        organization?.communities_served,
                                                    )}
                                                />

                                                <LongDetail
                                                    icon={HeartHandshake}
                                                    label="Primary activities"
                                                    value={formatList(
                                                        organization?.primary_activities,
                                                    )}
                                                />

                                                <Detail
                                                    icon={Users}
                                                    label="Team size"
                                                    value={
                                                        organization?.team_size
                                                    }
                                                />
                                            </div>
                                        </ProfileSection>
                                    </>
                                )}
                            </div>
                        )}
                    </main>

                    {/* FOOTER */}
                    <footer
                        className="
                            flex shrink-0 items-center justify-between
                            gap-4
                            border-t border-border
                            bg-surface
                            px-4 py-3.5
                            sm:px-6 sm:py-4
                            lg:px-8
                        "
                    >
                        <div className="hidden items-center gap-2 sm:flex">
                            <span className="h-1.5 w-1.5 bg-primary" />

                            <p className="font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                                Profile information
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                ml-auto
                                inline-flex h-9.5
                                items-center justify-center
                                bg-primary
                                px-5
                                text-[12px]
                                font-semibold
                                text-white
                                shadow-sm
                                shadow-primary/15
                                transition-colors
                                hover:bg-primary-hover
                                sm:px-6
                            "
                        >
                            Done
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;
