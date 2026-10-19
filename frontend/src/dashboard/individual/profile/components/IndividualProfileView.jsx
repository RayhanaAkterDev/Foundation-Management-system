import React from 'react';
import {
    ArrowUpRight,
    CalendarDays,
    Mail,
    MapPin,
    Pencil,
    Phone,
    UserRound,
    HandHeart,
    Tags,
    ShieldCheck,
    BadgeCheck,
} from 'lucide-react';

/* =========================================================
   HELPERS
========================================================= */

const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== '';

const displayValue = (value) => (hasValue(value) ? value : 'Not provided');

function formatDate(value, options) {
    if (!value) return null;

    const normalized =
        typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)
            ? `${value.slice(0, 10)}T00:00:00`
            : value;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString('en-BD', options);
}

function formatPreferenceLabel(value) {
    if (value === null || value === undefined) return '';

    const text =
        typeof value === 'object'
            ? (value.label ??
              value.name ??
              value.title ??
              value.slug ??
              value.value ??
              '')
            : String(value);

    if (!text) return '';

    const normalized = String(text)
        .trim()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ');

    if (normalized.toLowerCase() === 'hr') return 'HR';

    return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizePreferences(value) {
    if (!hasValue(value)) return [];

    let normalized = value;

    if (typeof normalized === 'string') {
        const trimmed = normalized.trim();

        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
                normalized = JSON.parse(trimmed);
            } catch {
                normalized = trimmed;
            }
        }
    }

    if (Array.isArray(normalized)) {
        return normalized.map(formatPreferenceLabel).filter(Boolean);
    }

    if (normalized && typeof normalized === 'object') {
        return Object.entries(normalized)
            .filter(([, enabled]) => enabled === true || enabled === 1)
            .map(([key]) => formatPreferenceLabel(key))
            .filter(Boolean);
    }

    if (typeof normalized === 'string') {
        return normalized
            .split(/[,;|]/)
            .map(formatPreferenceLabel)
            .filter(Boolean);
    }

    return [];
}

function formatBooleanStatus(value, trueLabel, falseLabel) {
    if (value === true || value === 1 || value === '1') {
        return trueLabel;
    }

    if (value === false || value === 0 || value === '0') {
        return falseLabel;
    }

    return value;
}

/* =========================================================
   SHARED STYLES
========================================================= */

const iconStyle = 'text-[#879B8D]';

const sectionTitleStyle =
    'text-[16px] font-semibold leading-6 tracking-[-0.015em] !text-[#F0F3F7]';

const mutedTextStyle = 'text-[12px] leading-5 !text-[#9AA6B5]';

/* =========================================================
   SECTION HEADER — NO DECORATIVE ICON
========================================================= */

function SectionHeader({ title, description, action }) {
    return (
        <div
            className="
            flex min-w-0 items-center justify-between gap-4
            px-5 py-5 sm:px-7 sm:py-6
        "
        >
            <div className="min-w-0">
                <h3 className={sectionTitleStyle}>{title}</h3>

                {description && (
                    <p className={`mt-0.5 ${mutedTextStyle}`}>{description}</p>
                )}
            </div>

            {action}
        </div>
    );
}

/* =========================================================
   INFORMATION ROW
========================================================= */

function InformationRow({ label, value, icon: Icon, href, last = false }) {
    const available = hasValue(value);
    const isElement = React.isValidElement(value);

    return (
        <div
            className={`
                group grid min-w-0 grid-cols-1 gap-2
                py-4 sm:grid-cols-[165px_minmax(0,1fr)]
                sm:items-center sm:gap-5
                lg:grid-cols-[175px_minmax(0,1fr)]
                xl:grid-cols-[190px_minmax(0,1fr)]
                ${last ? '' : 'border-b border-[#29323E]'}
            `}
        >
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    border border-transparent
                    transition-colors duration-200
                    group-hover:border-[#343D49]
                    group-hover:bg-[#1B232E]
                "
                >
                    <Icon size={16} strokeWidth={1.7} className={iconStyle} />
                </span>

                <span className="text-[13px] font-medium !text-[#A6B0BE]">
                    {label}
                </span>
            </div>

            {available && href ? (
                <a
                    href={href}
                    className="
                        inline-flex min-w-0 items-center gap-2
                        break-all text-[14px] font-medium leading-6
                        !text-[#E9EDF3]
                        transition-colors duration-200
                        hover:!text-[#C4DAD5]
                        focus-visible:rounded-sm
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#879B8D]
                    "
                >
                    <span className="min-w-0">{value}</span>

                    {href.startsWith('http') && (
                        <ArrowUpRight
                            size={14}
                            className="shrink-0 text-[#9AA6B5]"
                        />
                    )}
                </a>
            ) : (
                <div
                    className={`
                        min-w-0 whitespace-pre-wrap break-words
                        text-[14px] leading-6
                        ${
                            available
                                ? 'font-medium !text-[#E9EDF3]'
                                : '!text-[#8792A1]'
                        }
                    `}
                >
                    {isElement ? value : displayValue(value)}
                </div>
            )}
        </div>
    );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ value }) {
    const normalized = String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ');

    const isVerified = ['verified', 'active', 'approved'].includes(normalized);

    const isNegative = [
        'not verified',
        'unverified',
        'inactive',
        'suspended',
        'rejected',
        'blocked',
    ].includes(normalized);

    const isPending = ['pending', 'under review'].includes(normalized);

    const tone = isVerified
        ? 'border-[#426B5B] bg-[#1B3029] !text-[#B9D8C8]'
        : isNegative
          ? 'border-[#754B4B] bg-[#342323] !text-[#E8B5B5]'
          : isPending
            ? 'border-[#756448] bg-[#302A20] !text-[#E4D0A7]'
            : 'border-[#465364] bg-[#202833] !text-[#CDD6E0]';

    const Icon = isVerified
        ? BadgeCheck
        : isPending
          ? ShieldCheck
          : ShieldCheck;

    return (
        <span
            className={`
                inline-flex w-fit max-w-full items-center gap-1.5
                border px-2.5 py-1
                text-[11px] font-semibold leading-4
                capitalize tracking-[0.01em]
                ${tone}
            `}
        >
            <Icon size={13} strokeWidth={1.8} />

            <span className="break-words">{value}</span>
        </span>
    );
}

/* =========================================================
   PREFERENCE GROUP — SIMPLIFIED
========================================================= */

function PreferenceGroup({ label, values }) {
    const items = normalizePreferences(values);

    return (
        <div
            className="
            min-w-0 border border-[#29323E]
            bg-[#111720] p-4 sm:p-5
            transition-colors duration-200
            hover:border-[#465364]
        "
        >
            <div
                className="
                flex min-w-0 items-start justify-between gap-3
            "
            >
                <h4
                    className="
                    min-w-0 text-[13px] font-semibold
                    leading-5 !text-[#E9EDF3]
                "
                >
                    {label}
                </h4>

                <span
                    className="
                    flex h-7 min-w-7 shrink-0 items-center
                    justify-center border border-[#343D49]
                    bg-[#1B232E] px-2
                    text-[11px] font-semibold tabular-nums
                    !text-[#B6C3D1]
                "
                >
                    {items.length}
                </span>
            </div>

            <div className="mt-3 border-t border-[#29323E]">
                {items.length > 0 ? (
                    <ul className="divide-y divide-[#29323E]">
                        {items.map((item, index) => (
                            <li
                                key={`${item}-${index}`}
                                className="
                                    flex min-w-0 items-start gap-3 py-3
                                "
                            >
                                <span
                                    aria-hidden="true"
                                    className="
                                        mt-[9px] h-1.5 w-1.5 shrink-0
                                        rounded-full bg-[#879B8D]
                                    "
                                />

                                <span
                                    className="
                                    min-w-0 break-words text-[13px]
                                    leading-6 !text-[#D5DDE6]
                                "
                                >
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p
                        className="
                        py-4 text-[12px] leading-5
                        !text-[#8792A1]
                    "
                    >
                        No preferences added yet.
                    </p>
                )}
            </div>
        </div>
    );
}

/* =========================================================
   INDIVIDUAL PROFILE VIEW
========================================================= */

export default function IndividualProfileView({
    profile,
    memberSince,
    onEdit,
}) {
    const name = profile?.name?.trim() || 'Your profile';
    const initial = name.charAt(0).toUpperCase();
    const photo = profile?.photo || profile?.avatar || null;

    const joinedText =
        formatDate(memberSince, {
            month: 'long',
            year: 'numeric',
        }) || 'Not available';

    const dobText =
        formatDate(profile?.date_of_birth, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }) || null;

    const email = profile?.email;
    const phone = profile?.phone;

    const individualProfile =
        profile?.individual_profile ?? profile?.individualProfile ?? profile;

    const participationPreferences =
        individualProfile?.participation_preferences;

    const categoryPreferences = individualProfile?.category_preferences;

    const accountStatus = profile?.status ?? profile?.user?.status;

    const emailVerification =
        profile?.email_verified_at ??
        profile?.email_verified ??
        profile?.is_email_verified ??
        profile?.user?.email_verified_at ??
        profile?.user?.email_verified ??
        profile?.user?.is_email_verified;

    const verificationDisplay = (() => {
        if (!hasValue(emailVerification)) return null;

        if (
            typeof emailVerification === 'boolean' ||
            emailVerification === 0 ||
            emailVerification === 1 ||
            emailVerification === '0' ||
            emailVerification === '1'
        ) {
            return formatBooleanStatus(
                emailVerification,
                'Verified',
                'Not verified',
            );
        }

        if (profile?.email_verified_at || profile?.user?.email_verified_at) {
            return 'Verified';
        }

        return emailVerification;
    })();

    const hasAccountInformation =
        hasValue(accountStatus) || hasValue(verificationDisplay);

    const formattedAccountStatus = hasValue(accountStatus)
        ? formatPreferenceLabel(accountStatus)
        : null;

    return (
        <div
            className="
            w-full min-w-0 pb-8 font-sans !text-[#EEF1F5]
        "
        >
            {/* =====================================================
                PROFILE OVERVIEW
            ===================================================== */}

            <div
                className="
                grid min-w-0 items-stretch gap-5
                lg:grid-cols-[290px_minmax(0,1fr)]
                xl:grid-cols-[320px_minmax(0,1fr)]
            "
            >
                {/* MEMBER IDENTITY */}

                <aside className="flex min-w-0">
                    <section
                        className="
                        flex w-full min-w-0 flex-col overflow-hidden
                        border border-[#343D49] bg-[#111720]
                    "
                    >
                        <div
                            className="
                            relative isolate min-h-[320px] flex-1
                            overflow-hidden bg-[#222B36]
                            sm:min-h-[380px] lg:min-h-[400px]
                        "
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={name}
                                    loading="lazy"
                                    className="
                                        absolute inset-0 h-full w-full
                                        object-cover object-center
                                        transition-transform duration-500
                                        hover:scale-[1.025]
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                    absolute inset-0 flex items-center
                                    justify-center bg-[#293442]
                                "
                                >
                                    <div
                                        className="
                                        flex h-36 w-36 items-center
                                        justify-center rounded-full
                                        border border-[#596878]
                                        bg-[#222B36]
                                        text-[76px] font-semibold
                                        tracking-[-0.06em]
                                        !text-[#B6C3D1]
                                        sm:h-40 sm:w-40 sm:text-[84px]
                                    "
                                    >
                                        {initial}
                                    </div>
                                </div>
                            )}

                            <div
                                aria-hidden="true"
                                className="
                                    absolute inset-0
                                    bg-gradient-to-b
                                    from-[#090D13]/25
                                    via-transparent via-[38%]
                                    to-[#090D13]/95
                                "
                            />

                            <div
                                className="
                                absolute inset-x-0 bottom-0
                                px-5 pb-6 pt-16 sm:px-6 sm:pb-7
                            "
                            >
                                <span
                                    className="
                                    mb-3 inline-flex items-center
                                    border border-white/20
                                    bg-[#111720]/70 px-2.5 py-1
                                    text-[10px] font-semibold
                                    uppercase tracking-[0.14em]
                                    !text-[#D5DDE6]
                                    backdrop-blur-sm
                                "
                                >
                                    Individual member
                                </span>

                                <h2
                                    className="
                                    break-words text-[25px]
                                    font-semibold leading-[1.3]
                                    tracking-[-0.025em] !text-white
                                    sm:text-[28px]
                                "
                                >
                                    {name}
                                </h2>

                                <p
                                    className="
                                    mt-2 max-w-[250px]
                                    text-[12px] leading-5
                                    !text-[#D0D8E1]
                                "
                                >
                                    Your personal profile and contribution
                                    details
                                </p>
                            </div>
                        </div>

                        {/* MEMBER SINCE */}

                        <div
                            className="
                            flex shrink-0 items-center gap-3.5
                            border-t border-[#36404D]
                            bg-[#1B232E] px-5 py-4
                            sm:px-6 sm:py-5
                        "
                        >
                            <div
                                className="
                                flex h-11 w-11 shrink-0 items-center
                                justify-center border border-[#465364]
                                bg-[#273240]
                            "
                            >
                                <CalendarDays
                                    size={19}
                                    strokeWidth={1.7}
                                    className="text-[#C4D0DC]"
                                />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                    text-[11px] font-medium uppercase
                                    tracking-[0.1em] !text-[#AAB6C4]
                                "
                                >
                                    Member since
                                </p>

                                <p
                                    className="
                                    mt-1 break-words text-[15px]
                                    font-semibold leading-6 !text-[#F0F3F7]
                                "
                                >
                                    {joinedText}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* PERSONAL INFORMATION */}

                <section
                    className="
                    flex min-w-0 flex-col overflow-hidden
                    border border-[#29323E] bg-[#0E1219]
                "
                >
                    <SectionHeader
                        title="Personal information"
                        description="Contact and personal details"
                        action={
                            <button
                                type="button"
                                onClick={onEdit}
                                aria-label="Edit profile"
                                className="
        group inline-flex h-11 shrink-0
        items-center justify-center gap-3
        border border-[#3C4856]
        bg-[#202A35] pl-3 pr-4
        text-[13px] font-semibold !text-[#DFE6EE]
        transition-[background-color,border-color,color]
        duration-200
        hover:border-[#657789]
        hover:bg-[#2A3643]
        hover:!text-[#F1F4F7]
        active:bg-[#1B242E]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#879B8D]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0E1219]
        sm:pl-3.5 sm:pr-5
    "
                            >
                                <Pencil
                                    size={15}
                                    strokeWidth={1.8}
                                    className="
            shrink-0 !text-[#A7B8C8]
            transition-colors duration-200
            group-hover:!text-[#DFE6EE]
        "
                                />

                                <span className="whitespace-nowrap">
                                    Edit profile
                                </span>

                                <ArrowUpRight
                                    size={15}
                                    strokeWidth={1.8}
                                    className="
            hidden shrink-0 !text-[#8F9EAE]
            transition-transform duration-200
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
            sm:block
        "
                                />
                            </button>
                        }
                    />

                    <div className="mx-5 border-t border-[#29323E] sm:mx-7" />

                    <div className="flex-1 px-5 sm:px-7">
                        <InformationRow
                            label="Full name"
                            value={profile?.name}
                            icon={UserRound}
                        />

                        <InformationRow
                            label="Date of birth"
                            value={dobText}
                            icon={CalendarDays}
                        />

                        <InformationRow
                            label="Email address"
                            value={email}
                            icon={Mail}
                            href={
                                hasValue(email) ? `mailto:${email}` : undefined
                            }
                        />

                        <InformationRow
                            label="Phone number"
                            value={phone}
                            icon={Phone}
                            href={hasValue(phone) ? `tel:${phone}` : undefined}
                        />

                        <InformationRow
                            label="District"
                            value={profile?.district}
                            icon={MapPin}
                        />

                        <InformationRow
                            label="Address"
                            value={profile?.address}
                            icon={MapPin}
                            last
                        />
                    </div>
                </section>
            </div>

            {/* =====================================================
                PARTICIPATION & INTERESTS
            ===================================================== */}

            <section
                className="
                mt-5 min-w-0 overflow-hidden
                border border-[#29323E] bg-[#0E1219]
                sm:mt-6
            "
            >
                <SectionHeader
                    title="Participation & interests"
                    description="Your preferred ways to contribute and causes"
                />

                <div className="mx-5 border-t border-[#29323E] sm:mx-7" />

                <div
                    className="
                    grid min-w-0 grid-cols-1 gap-4
                    px-5 py-5 sm:px-7 sm:py-6
                    xl:grid-cols-2
                "
                >
                    <PreferenceGroup
                        label="Participation preferences"
                        values={participationPreferences}
                    />

                    <PreferenceGroup
                        label="Causes of interest"
                        values={categoryPreferences}
                    />
                </div>

                {/* ACCOUNT INFORMATION */}

                {hasAccountInformation && (
                    <>
                        <div className="mx-5 border-t border-[#29323E] sm:mx-7" />

                        <div
                            className="
                            flex min-w-0 items-center
                            px-5 pt-5 sm:px-7 sm:pt-6
                        "
                        >
                            <div className="min-w-0">
                                <h4
                                    className="
                                    text-[14px] font-semibold
                                    !text-[#E9EDF3]
                                "
                                >
                                    Account information
                                </h4>

                                <p className={`mt-0.5 ${mutedTextStyle}`}>
                                    Account status and email verification
                                </p>
                            </div>
                        </div>

                        <div className="px-5 pb-3 sm:px-7 sm:pb-4">
                            {hasValue(accountStatus) && (
                                <InformationRow
                                    label="Account status"
                                    value={
                                        <StatusBadge
                                            value={formattedAccountStatus}
                                        />
                                    }
                                    icon={ShieldCheck}
                                />
                            )}

                            {hasValue(verificationDisplay) && (
                                <InformationRow
                                    label="Email verification"
                                    value={
                                        <StatusBadge
                                            value={verificationDisplay}
                                        />
                                    }
                                    icon={BadgeCheck}
                                    last
                                />
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
