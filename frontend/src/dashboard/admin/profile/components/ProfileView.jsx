import React from 'react';

import {
    ArrowUpRight,
    CalendarDays,
    Mail,
    Pencil,
    Phone,
    ShieldCheck,
    UserRound,
    BadgeCheck,
    Users,
    MailCheck,
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

function normalizeLabel(value) {
    if (!hasValue(value)) return 'Not available';

    return String(value)
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* =========================================================
   SHARED STYLES
========================================================= */

const sectionTitleStyle =
    'text-[16px] font-semibold leading-6 tracking-[-0.015em] !text-[#F0F3F7]';

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({ title, action }) {
    return (
        <div
            className="
                flex min-w-0 items-center
                justify-between gap-4
                px-5 py-5
                sm:px-7 sm:py-6
            "
        >
            <h3 className={sectionTitleStyle}>{title}</h3>

            {action}
        </div>
    );
}

/* =========================================================
   INFORMATION ROW
========================================================= */

function InformationRow({
    label,
    value,
    icon: Icon = UserRound,
    href,
    last = false,
}) {
    const isElement = React.isValidElement(value);

    const available = isElement || hasValue(value);

    return (
        <div
            className={`
                group grid min-w-0
                grid-cols-1 gap-2
                py-4

                sm:grid-cols-[155px_minmax(0,1fr)]
                sm:items-center sm:gap-4

                xl:grid-cols-[175px_minmax(0,1fr)]

                ${last ? '' : 'border-b border-[#29323E]'}
            `}
        >
            {/* LABEL */}

            <div className="flex min-w-0 items-center gap-3">
                <span
                    className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center

                        border border-transparent

                        transition-colors duration-200

                        group-hover:border-[#343D49]
                        group-hover:bg-[#1B232E]
                    "
                >
                    <Icon
                        size={16}
                        strokeWidth={1.7}
                        className="!text-[#879B8D]"
                    />
                </span>

                <span
                    className="
                        text-[13px] font-medium
                        leading-5 !text-[#A6B0BE]
                    "
                >
                    {label}
                </span>
            </div>

            {/* VALUE */}

            {available && href && !isElement ? (
                <a
                    href={href}
                    className="
                        inline-flex min-w-0 items-center
                        gap-2 break-all

                        text-[14px] font-medium leading-6
                        !text-[#E9EDF3]

                        transition-colors duration-200

                        hover:!text-[#C4DAD5]

                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#879B8D]
                    "
                >
                    <span className="min-w-0">{value}</span>

                    {href.startsWith('http') && (
                        <ArrowUpRight
                            size={14}
                            className="
                                shrink-0 !text-[#9AA6B5]
                            "
                        />
                    )}
                </a>
            ) : (
                <div
                    className={`
                        min-w-0
                        whitespace-pre-wrap
                        break-words

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

    const isActive = ['active', 'verified', 'approved'].includes(normalized);

    const isNegative = [
        'inactive',
        'suspended',
        'blocked',
        'rejected',
        'disabled',
    ].includes(normalized);

    const isPending = [
        'pending',
        'under review',
        'unverified',
        'not verified',
    ].includes(normalized);

    const tone = isActive
        ? 'border-[#426B5B] bg-[#1B3029] !text-[#B9D8C8]'
        : isNegative
          ? 'border-[#754B4B] bg-[#342323] !text-[#E8B5B5]'
          : isPending
            ? 'border-[#756448] bg-[#302A20] !text-[#E4D0A7]'
            : 'border-[#465364] bg-[#202833] !text-[#CDD6E0]';

    const Icon = isActive ? BadgeCheck : ShieldCheck;

    return (
        <span
            className={`
                inline-flex w-fit max-w-full
                items-center gap-1.5

                border px-2.5 py-1

                text-[11px] font-semibold
                leading-4 capitalize
                tracking-[0.01em]

                ${tone}
            `}
        >
            <Icon size={13} strokeWidth={1.8} />

            <span className="break-words">{normalizeLabel(value)}</span>
        </span>
    );
}

/* =========================================================
   ADMIN PROFILE VIEW
========================================================= */

export default function ProfileView({ profile, memberSince, onEdit }) {
    const name = profile?.name?.trim() || 'Admin profile';

    const initial = name.charAt(0).toUpperCase();

    const photo =
        profile?.photo || profile?.avatar || profile?.user?.photo || null;

    const joinedText =
        formatDate(memberSince || profile?.created_at, {
            month: 'long',
            year: 'numeric',
        }) || 'Not available';

    const email = profile?.email;

    const phone = profile?.phone;

    const role = normalizeLabel(
        profile?.role || profile?.user?.role || 'Admin',
    );

    const status = profile?.status ?? profile?.user?.status;

    const emailVerifiedAt =
        profile?.email_verified_at ?? profile?.user?.email_verified_at;

    const emailVerified =
        profile?.email_verified ??
        profile?.is_email_verified ??
        profile?.user?.email_verified ??
        profile?.user?.is_email_verified;

    const verificationStatus = (() => {
        if (hasValue(emailVerifiedAt)) {
            return 'Verified';
        }

        if (
            emailVerified === true ||
            emailVerified === 1 ||
            emailVerified === '1'
        ) {
            return 'Verified';
        }

        if (
            emailVerified === false ||
            emailVerified === 0 ||
            emailVerified === '0'
        ) {
            return 'Not verified';
        }

        return null;
    })();

    return (
        <div
            className="
                w-full min-w-0 pb-8
                font-sans !text-[#EEF1F5]
            "
        >
            {/* MAIN TWO-COLUMN LAYOUT */}

            <div
                className="
                    grid min-w-0 items-stretch
                    gap-5

                    lg:grid-cols-[290px_minmax(0,1fr)]
                    xl:grid-cols-[320px_minmax(0,1fr)]
                "
            >
                {/* =====================================
                    LEFT — ADMIN IDENTITY
                ===================================== */}

                <aside className="flex min-w-0">
                    <section
                        className="
                            flex w-full min-w-0
                            flex-col overflow-hidden

                            border border-[#343D49]
                            bg-[#111720]
                        "
                    >
                        {/* PROFILE IMAGE */}

                        <div
                            className="
                                relative isolate
                                min-h-[320px] flex-1

                                overflow-hidden
                                bg-[#222B36]

                                sm:min-h-[380px]
                                lg:min-h-[400px]
                            "
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={name}
                                    loading="lazy"
                                    className="
                                        absolute inset-0
                                        h-full w-full

                                        object-cover object-center

                                        transition-transform duration-500
                                        hover:scale-[1.025]
                                    "
                                />
                            ) : (
                                <div
                                    className="
                                        absolute inset-0
                                        flex items-center
                                        justify-center
                                        bg-[#293442]
                                    "
                                >
                                    <div
                                        className="
                                            flex h-36 w-36
                                            items-center justify-center

                                            rounded-full
                                            border border-[#596878]
                                            bg-[#222B36]

                                            text-[76px] font-semibold
                                            tracking-[-0.06em]
                                            !text-[#B6C3D1]

                                            sm:h-40 sm:w-40
                                            sm:text-[84px]
                                        "
                                    >
                                        {initial}
                                    </div>
                                </div>
                            )}

                            {/* IMAGE OVERLAY */}

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

                            {/* PROFILE IDENTITY */}

                            <div
                                className="
                                    absolute inset-x-0 bottom-0
                                    px-5 pb-6 pt-16
                                    sm:px-6 sm:pb-7
                                "
                            >
                                <span
                                    className="
                                        mb-3 inline-flex items-center

                                        border border-white/20
                                        bg-[#111720]/70
                                        px-2.5 py-1

                                        text-[10px] font-semibold
                                        uppercase tracking-[0.14em]
                                        !text-[#D5DDE6]

                                        backdrop-blur-sm
                                    "
                                >
                                    Administrator
                                </span>

                                <h2
                                    className="
                                        break-words
                                        text-[25px] font-semibold
                                        leading-[1.3]
                                        tracking-[-0.025em]
                                        !text-white

                                        sm:text-[28px]
                                    "
                                >
                                    {name}
                                </h2>
                            </div>
                        </div>

                        {/* MEMBERSHIP */}

                        <div
                            className="
                                flex shrink-0 items-center
                                gap-3.5

                                border-t border-[#36404D]
                                bg-[#1B232E]

                                px-5 py-4
                                sm:px-6 sm:py-5
                            "
                        >
                            <div
                                className="
                                    flex h-11 w-11 shrink-0
                                    items-center justify-center

                                    border border-[#465364]
                                    bg-[#273240]
                                "
                            >
                                <CalendarDays
                                    size={19}
                                    strokeWidth={1.7}
                                    className="!text-[#C4D0DC]"
                                />
                            </div>

                            <div className="min-w-0">
                                <p
                                    className="
                                        text-[12px] font-medium
                                        !text-[#AAB6C4]
                                    "
                                >
                                    Member since
                                </p>

                                <p
                                    className="
                                        mt-1 break-words
                                        text-[15px] font-semibold
                                        leading-6
                                        !text-[#F0F3F7]
                                    "
                                >
                                    {joinedText}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* =====================================
                    RIGHT — PERSONAL INFORMATION
                ===================================== */}

                <section
                    className="
                        flex min-w-0 flex-col
                        overflow-hidden

                        border border-[#29323E]
                        bg-[#0E1219]
                    "
                >
                    {/* HEADER */}

                    <SectionHeader
                        title="Personal information"
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

                    {/* HEADER DIVIDER */}

                    <div
                        className="
                            mx-5 border-t
                            border-[#29323E]
                            sm:mx-7
                        "
                    />

                    {/* =====================================
                        ALL PROFILE INFORMATION
                    ===================================== */}

                    <div className="px-5 pb-5 sm:px-7 sm:pb-6">
                        {/* FULL NAME */}

                        <InformationRow
                            label="Full name"
                            value={profile?.name}
                            icon={UserRound}
                        />

                        {/* EMAIL */}

                        <InformationRow
                            label="Email address"
                            value={email}
                            icon={Mail}
                            href={
                                hasValue(email) ? `mailto:${email}` : undefined
                            }
                        />

                        {/* PHONE */}

                        <InformationRow
                            label="Phone number"
                            value={phone}
                            icon={Phone}
                            href={hasValue(phone) ? `tel:${phone}` : undefined}
                        />

                        {/* ACCOUNT ROLE */}

                        <InformationRow
                            label="Account role"
                            value={role}
                            icon={Users}
                        />

                        {/* ACCOUNT STATUS */}

                        <InformationRow
                            label="Account status"
                            value={
                                hasValue(status) ? (
                                    <StatusBadge value={status} />
                                ) : (
                                    'Not available'
                                )
                            }
                            icon={ShieldCheck}
                        />

                        {/* EMAIL VERIFICATION */}

                        <InformationRow
                            label="Email verification"
                            value={
                                hasValue(verificationStatus) ? (
                                    <StatusBadge value={verificationStatus} />
                                ) : (
                                    'Not available'
                                )
                            }
                            icon={MailCheck}
                            last
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
