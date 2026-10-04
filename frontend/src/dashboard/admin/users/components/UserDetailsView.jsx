// src/dashboard/admin/users/components/UserDetailsView.jsx

import React from 'react';

import {
    Building2,
    Calendar,
    CheckCircle2,
    FileText,
    Globe,
    HeartHandshake,
    Home,
    Mail,
    MapPin,
    Phone,
    Shield,
    Tags,
    Target,
    UserRound,
    Users,
    X,
} from 'lucide-react';

import {
    formatDate,
    formatList,
    formatType,
    getUserDetailsData,
} from '../utils/userDetailsUtils';

/* ============================================================
   DETAIL FIELD
============================================================ */

const DetailField = ({
    icon: Icon,
    label,
    value,
    children,
    className = '',
}) => {
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div
            className={`
                min-w-0
                ${className}
            `}
        >
            <div className="flex items-start gap-3">
                <div
                    className="
                        mt-0.5
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[#343B43]
                        bg-[#1C2024]
                        text-[#74818B]
                    "
                >
                    <Icon size={14} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="
                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.12em]
                            text-[#69747E]
                        "
                    >
                        {label}
                    </p>

                    <div
                        className={`
                            mt-1.5
                            wrap-break-word
                            text-[13px]
                            leading-5
                            ${
                                hasValue || children
                                    ? 'font-medium! text-[#D3D7DB]'
                                    : 'font-normal! text-[#626C76]'
                            }
                        `}
                    >
                        {children || (hasValue ? value : 'Not provided')}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ============================================================
   SECTION HEADING
============================================================ */

const SectionHeading = ({ eyebrow, title, description, icon: Icon }) => {
    return (
        <div
            className="
                flex
                items-start
                gap-3
                border-b
                border-[#343A42]
                pb-5
            "
        >
            <div
                className="
                    mt-0.5
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-[#35423E]
                    bg-[#1E2926]
                    text-[#789D94]
                "
            >
                <Icon size={14} strokeWidth={1.7} />
            </div>

            <div className="min-w-0">
                <p
                    className="
                        text-[10px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]
                        text-[#718079]
                    "
                >
                    {eyebrow}
                </p>

                <h2
                    className="
                        mt-1
                        text-[17px]
                        font-semibold!
                        tracking-[-0.015em]
                        text-[#ECEEF0]!
                    "
                >
                    {title}
                </h2>

                {description && (
                    <p
                        className="
                            mt-1
                            max-w-2xl
                            text-[12px]
                            leading-5
                            text-[#707A84]
                        "
                    >
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

/* ============================================================
   TAG LIST
============================================================ */

const TagList = ({ values }) => {
    const items = formatList(values);

    if (!items.length) {
        return (
            <span
                className="
                    text-[12px]
                    text-[#626C76]
                "
            >
                Not provided
            </span>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
                <span
                    key={`${item}-${index}`}
                    className="
                        border
                        border-[#37433F]
                        bg-[#202A27]
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-medium!
                        text-[#A8BBB5]
                    "
                >
                    {formatType(item)}
                </span>
            ))}
        </div>
    );
};

/* ============================================================
   STATUS LINE
============================================================ */

const StatusLine = ({ label, value, tone = 'neutral' }) => {
    const tones = {
        neutral: {
            dot: 'bg-[#7D8791]',
            text: 'text-[#BBC1C7]',
        },

        positive: {
            dot: 'bg-[#4D9B8B]',
            text: 'text-[#9BC6BC]',
        },

        warning: {
            dot: 'bg-[#B78A50]',
            text: 'text-[#C9A87D]',
        },
    };

    const current = tones[tone] || tones.neutral;

    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-5
                border-b
                border-[#30363D]
                py-4
                last:border-b-0
            "
        >
            <span
                className="
                    text-[12px]
                    text-[#737D87]
                "
            >
                {label}
            </span>

            <span
                className={`
                    flex
                    items-center
                    gap-2
                    text-[12px]
                    font-medium!
                    ${current.text}
                `}
            >
                <span
                    className={`
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        ${current.dot}
                    `}
                />

                {value}
            </span>
        </div>
    );
};

/* ============================================================
   VOLUNTEER SECTION
============================================================ */

const VolunteerSection = ({ isVolunteer, volunteerCampaignCount }) => {
    return (
        <section
            className="
                mt-6
                border
                border-[#3A4149]
                bg-[#202429]
            "
        >
            <div
                className="
                    px-6
                    pt-6
                    sm:px-8
                    sm:pt-7
                    lg:px-9
                "
            >
                <SectionHeading
                    eyebrow="Volunteer"
                    title="Volunteer information"
                    description="Volunteer participation and campaign involvement for this member."
                    icon={HeartHandshake}
                />
            </div>

            {isVolunteer ? (
                <div
                    className="
                        grid
                        md:grid-cols-[minmax(0,1fr)_240px]
                    "
                >
                    <div
                        className="
                            px-6
                            py-6
                            sm:px-8
                            sm:py-7
                            lg:px-9
                        "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    border-[#365C54]
                                    bg-[#202D2A]
                                    text-[#83B4A8]
                                "
                            >
                                <HeartHandshake size={18} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0">
                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-3
                                        gap-y-1
                                    "
                                >
                                    <p
                                        className="
                                            text-[14px]
                                            font-semibold!
                                            text-[#E4E7E8]
                                        "
                                    >
                                        Registered volunteer
                                    </p>

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            text-[11px]
                                            font-medium!
                                            text-[#88B4AA]
                                        "
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                                bg-[#4D9B8B]
                                            "
                                        />
                                        Volunteer
                                    </span>
                                </div>

                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[12px]
                                        leading-[1.7]
                                        text-[#707A84]
                                    "
                                >
                                    This member has a volunteer profile and can
                                    participate in campaigns.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            border-t
                            border-[#343A42]
                            bg-[#1C2024]
                            px-6
                            py-6
                            md:border-t-0
                            md:border-l
                            sm:px-8
                            md:px-6
                        "
                    >
                        <div className="flex items-center gap-2">
                            <Users
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#71958C]"
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#6D7882]
                                "
                            >
                                Campaigns connected
                            </p>
                        </div>

                        <p
                            className="
                                mt-3
                                text-[24px]
                                font-semibold!
                                tracking-[-0.03em]
                                text-[#E2E6E5]
                            "
                        >
                            {volunteerCampaignCount ?? 0}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-[#626D76]
                            "
                        >
                            Campaign connections
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className="
                        flex
                        items-start
                        gap-4
                        px-6
                        py-6
                        sm:px-8
                        sm:py-7
                        lg:px-9
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-[#3A4149]
                            bg-[#1D2125]
                            text-[#69747E]
                        "
                    >
                        <HeartHandshake size={17} strokeWidth={1.7} />
                    </div>

                    <div className="pt-0.5">
                        <p
                            className="
                                text-[13px]
                                font-semibold!
                                text-[#C5CBD0]
                            "
                        >
                            Not registered as a volunteer
                        </p>

                        <p
                            className="
                                mt-1.5
                                max-w-2xl
                                text-[12px]
                                leading-[1.65]
                                text-[#68727C]
                            "
                        >
                            This member has not joined the Stand For People
                            volunteer network.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

/* ============================================================
   PERSONAL INFORMATION
============================================================ */

const PersonalInformation = ({ individualProfile }) => {
    const participationPreferences = formatList(
        individualProfile?.participation_preferences,
    );

    const categoryPreferences = formatList(
        individualProfile?.category_preferences,
    );

    return (
        <section
            className="
                mt-6
                border
                border-[#3A4149]
                bg-[#202429]
            "
        >
            {/* SECTION INTRO */}

            <div
                className="
                    px-6
                    pt-6
                    sm:px-8
                    sm:pt-7
                    lg:px-9
                "
            >
                <SectionHeading
                    eyebrow="Profile"
                    title="Personal information"
                    description="Personal details, location and preferences provided by this member."
                    icon={UserRound}
                />
            </div>

            {/* PERSONAL DETAILS */}

            <div
                className="
                    px-6
                    py-6
                    sm:px-8
                    sm:py-7
                    lg:px-9
                "
            >
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-x-10
                        gap-y-6
                        md:grid-cols-2
                    "
                >
                    <DetailField
                        icon={MapPin}
                        label="District"
                        value={individualProfile?.district}
                    />

                    <DetailField
                        icon={Calendar}
                        label="Date of birth"
                        value={
                            individualProfile?.date_of_birth
                                ? formatDate(individualProfile.date_of_birth)
                                : null
                        }
                    />

                    <DetailField
                        icon={Home}
                        label="Address"
                        value={individualProfile?.address}
                        className="md:col-span-2"
                    />
                </div>
            </div>

            {/* PREFERENCES */}

            <div
                className="
                    border-t
                    border-[#343A42]
                    bg-[#1D2125]
                    px-6
                    py-6
                    sm:px-8
                    sm:py-7
                    lg:px-9
                "
            >
                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-[210px_minmax(0,1fr)]
                    "
                >
                    <div>
                        <div className="flex items-center gap-2.5">
                            <HeartHandshake
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#71958C]"
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#718079]
                                "
                            >
                                Preferences
                            </p>
                        </div>

                        <p
                            className="
                                mt-2
                                max-w-[190px]
                                text-[11px]
                                leading-[1.65]
                                text-[#66717B]
                            "
                        >
                            Selected interests and participation methods.
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            gap-6
                            sm:grid-cols-2
                        "
                    >
                        <div
                            className="
                                min-w-0
                                sm:border-r
                                sm:border-[#343A42]
                                sm:pr-6
                            "
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <HeartHandshake
                                    size={13}
                                    strokeWidth={1.7}
                                    className="text-[#697D77]"
                                />

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.11em]
                                        text-[#747E87]
                                    "
                                >
                                    Participation
                                </p>
                            </div>

                            <TagList values={participationPreferences} />
                        </div>

                        <div className="min-w-0">
                            <div className="mb-3 flex items-center gap-2">
                                <Tags
                                    size={13}
                                    strokeWidth={1.7}
                                    className="text-[#697D77]"
                                />

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.11em]
                                        text-[#747E87]
                                    "
                                >
                                    Categories
                                </p>
                            </div>

                            <TagList values={categoryPreferences} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   ORGANIZATION INFORMATION
============================================================ */

const OrganizationInformation = ({ organization, organizationVerified }) => {
    return (
        <section
            className="
                mt-6
                border
                border-[#3A4149]
                bg-[#202429]
            "
        >
            <div
                className="
                    px-6
                    pt-6
                    sm:px-8
                    sm:pt-7
                    lg:px-9
                "
            >
                <SectionHeading
                    eyebrow="Organization"
                    title="Organization information"
                    description="Contact and organizational identity information."
                    icon={Building2}
                />
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-x-10
                    gap-y-6
                    px-6
                    py-6
                    sm:grid-cols-2
                    sm:px-8
                    sm:py-7
                    lg:px-9
                "
            >
                <DetailField
                    icon={Building2}
                    label="Organization type"
                    value={formatType(organization?.type)}
                />

                <DetailField
                    icon={Shield}
                    label="Verification"
                    value={
                        organizationVerified
                            ? 'Verified organization'
                            : 'Verification pending'
                    }
                />

                <DetailField
                    icon={FileText}
                    label="Registration number"
                    value={organization?.registration_number}
                />

                <DetailField
                    icon={Phone}
                    label="Phone number"
                    value={organization?.phone}
                />

                <DetailField
                    icon={Globe}
                    label="Website"
                    value={organization?.website}
                />

                <DetailField
                    icon={Home}
                    label="Address"
                    value={organization?.address}
                />
            </div>
        </section>
    );
};

/* ============================================================
   ORGANIZATION PURPOSE
============================================================ */

const OrganizationPurpose = ({ organization }) => {
    return (
        <section
            className="
                mt-6
                border
                border-[#3A4149]
                bg-[#202429]
                px-6
                py-6
                sm:px-8
                sm:py-7
                lg:px-9
            "
        >
            <SectionHeading
                eyebrow="Purpose"
                title="Mission & focus"
                description="The organization's mission, focus areas and communities served."
                icon={Target}
            />

            <div
                className="
                    mt-6
                    grid
                    gap-7
                    xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]
                "
            >
                <div
                    className="
                        border-l-2
                        border-[#41685F]
                        bg-[#1C2124]
                        px-5
                        py-5
                        sm:px-6
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.13em]
                            text-[#708079]
                        "
                    >
                        Mission
                    </p>

                    <p
                        className={`
                            mt-3
                            text-[13px]
                            leading-6
                            ${
                                organization?.mission
                                    ? 'text-[#C7CDD1]'
                                    : 'text-[#626C76]'
                            }
                        `}
                    >
                        {organization?.mission || 'Not provided'}
                    </p>
                </div>

                <div
                    className="
                        grid
                        gap-6
                        sm:grid-cols-2
                        xl:grid-cols-1
                    "
                >
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Tags
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#718079]"
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#69747E]
                                "
                            >
                                Focus areas
                            </p>
                        </div>

                        <TagList values={organization?.focus_areas} />
                    </div>

                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Users
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#718079]"
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.12em]
                                    text-[#69747E]
                                "
                            >
                                Communities served
                            </p>
                        </div>

                        <TagList values={organization?.communities_served} />
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   ORGANIZATION OPERATIONS
============================================================ */

const OrganizationOperations = ({ organization }) => {
    return (
        <section
            className="
                mt-6
                border
                border-[#3A4149]
                bg-[#202429]
                px-6
                py-6
                sm:px-8
                sm:py-7
                lg:px-9
            "
        >
            <SectionHeading
                eyebrow="Operations"
                title="Team & activities"
                description="Team capacity and regular organizational activities."
                icon={Users}
            />

            <div
                className="
                    mt-6
                    grid
                    gap-7
                    lg:grid-cols-[220px_minmax(0,1fr)]
                "
            >
                <div
                    className="
                        border-b
                        border-[#343A42]
                        pb-6
                        lg:border-r
                        lg:border-b-0
                        lg:pr-7
                        lg:pb-0
                    "
                >
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            border
                            border-[#39443F]
                            bg-[#222B28]
                            text-[#799C93]
                        "
                    >
                        <Users size={15} strokeWidth={1.7} />
                    </div>

                    <p
                        className="
                            mt-4
                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.13em]
                            text-[#68737D]
                        "
                    >
                        Team size
                    </p>

                    <p
                        className={`
                            mt-1.5
                            text-[17px]
                            font-semibold!
                            tracking-[-0.015em]
                            ${
                                organization?.team_size
                                    ? 'text-[#E4E7E9]'
                                    : 'text-[#626C76]'
                            }
                        `}
                    >
                        {organization?.team_size || 'Not provided'}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <HeartHandshake
                            size={14}
                            strokeWidth={1.7}
                            className="text-[#718079]"
                        />

                        <p
                            className="
                                text-[10px]
                                font-semibold!
                                uppercase
                                tracking-[0.12em]
                                text-[#68737D]
                            "
                        >
                            Primary activities
                        </p>
                    </div>

                    <div className="mt-3">
                        <TagList values={organization?.primary_activities} />
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   USER DETAILS VIEW
============================================================ */

const UserDetailsView = ({ user, successMessage, onDismissSuccess }) => {
    const {
        individualProfile,
        organization,
        isOrganization,
        roleLabel,
        emailVerified,
        organizationVerified,
        userInitial,
        isVolunteer,
        volunteerCampaignCount,
    } = getUserDetailsData(user);

    return (
        <>
            {/* =================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="
                        mb-6
                        flex
                        items-start
                        justify-between
                        gap-4
                        border
                        border-[#36584F]
                        bg-[#1D2926]
                        px-4
                        py-3.5
                    "
                >
                    <div className="flex items-start gap-3">
                        <CheckCircle2
                            size={16}
                            strokeWidth={1.8}
                            className="
                                mt-0.5
                                shrink-0
                                text-[#78B3A5]
                            "
                        />

                        <div>
                            <p
                                className="
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#78A99D]
                                "
                            >
                                Changes saved
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[12px]
                                    font-medium!
                                    text-[#DDE5E2]
                                "
                            >
                                {successMessage}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onDismissSuccess}
                        aria-label="Dismiss message"
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            text-[#70817C]
                            transition-colors
                            hover:bg-[#263632]
                            hover:text-[#DDE5E2]
                            focus:outline-none
                            focus:ring-0
                        "
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* =================================================
                PROFILE HEADER
                SAME LEFT / RIGHT LAYOUT
            ================================================== */}

            <section
                className="
                    overflow-hidden
                    border
                    border-[#3A4149]
                    bg-[#202429]
                "
            >
                <div
                    className="
                        grid
                        min-w-0
                        lg:grid-cols-[minmax(0,1fr)_300px]
                        xl:grid-cols-[minmax(0,1fr)_320px]
                    "
                >
                    {/* =========================================
                        IDENTITY
                    ========================================== */}

                    <div
                        className="
                            min-w-0
                            px-6
                            py-7
                            sm:px-8
                            sm:py-8
                            lg:px-9
                            lg:py-9
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-center
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-17
                                    w-17
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    border-[#40504C]
                                    bg-[#27312F]
                                    text-[21px]
                                    font-semibold!
                                    text-[#DCE6E3]
                                "
                            >
                                {userInitial ? (
                                    userInitial
                                ) : isOrganization ? (
                                    <Building2 size={24} strokeWidth={1.6} />
                                ) : (
                                    <UserRound size={24} strokeWidth={1.6} />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <span
                                        className="
                                            text-[10px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.14em]
                                            text-[#72948C]
                                        "
                                    >
                                        {roleLabel}
                                    </span>

                                    <span
                                        className="
                                            h-1
                                            w-1
                                            rounded-full
                                            bg-[#4D575F]
                                        "
                                    />

                                    <span
                                        className="
                                            text-[11px]
                                            text-[#6E7882]
                                        "
                                    >
                                        ID #{user.id}
                                    </span>
                                </div>

                                <h1
                                    className="
                                        mt-2
                                        wrap-break-word
                                        text-[24px]
                                        font-semibold!
                                        leading-[1.2]
                                        tracking-[-0.03em]
                                        text-[#F1F2F3]!
                                        sm:text-[27px]
                                    "
                                >
                                    {user.name || 'User'}
                                </h1>

                                {/* CONTACT + MEMBER DATE */}

                                <div
                                    className="
                                        mt-3
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-5
                                        gap-y-2
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2
                                            text-[12px]
                                            text-[#919BA4]
                                        "
                                    >
                                        <Mail
                                            size={13}
                                            strokeWidth={1.7}
                                            className="
                                                shrink-0
                                                text-[#68737D]
                                            "
                                        />

                                        <span className="truncate">
                                            {user.email || 'Not provided'}
                                        </span>
                                    </span>

                                    {user.phone && (
                                        <span
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-[12px]
                                                text-[#919BA4]
                                            "
                                        >
                                            <Phone
                                                size={13}
                                                strokeWidth={1.7}
                                                className="text-[#68737D]"
                                            />

                                            {user.phone}
                                        </span>
                                    )}

                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-[12px]
                                            text-[#7E8992]
                                        "
                                    >
                                        <Calendar
                                            size={13}
                                            strokeWidth={1.7}
                                            className="text-[#68737D]"
                                        />
                                        Member since{' '}
                                        <span
                                            className="
                                                font-medium!
                                                text-[#AAB1B7]
                                            "
                                        >
                                            {formatDate(user.created_at)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================
                        ACCESS & VERIFICATION
                    ========================================== */}

                    <aside
                        className="
                            border-t
                            border-[#3A4149]
                            bg-[#1B1F23]
                            px-6
                            py-7
                            lg:border-t-0
                            lg:border-l
                            lg:px-7
                            lg:py-8
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Shield
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#6D8E86]"
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#7B878F]
                                "
                            >
                                Access & verification
                            </p>
                        </div>

                        <div className="mt-5">
                            <StatusLine
                                label="Platform access"
                                value={formatType(user.status)}
                                tone={
                                    user.status === 'active'
                                        ? 'positive'
                                        : user.status === 'suspended'
                                          ? 'warning'
                                          : 'neutral'
                                }
                            />

                            <StatusLine
                                label="Email"
                                value={
                                    emailVerified ? 'Verified' : 'Unverified'
                                }
                                tone={emailVerified ? 'positive' : 'warning'}
                            />

                            {isOrganization && (
                                <StatusLine
                                    label="Organization"
                                    value={
                                        organizationVerified
                                            ? 'Verified'
                                            : 'Verification pending'
                                    }
                                    tone={
                                        organizationVerified
                                            ? 'positive'
                                            : 'warning'
                                    }
                                />
                            )}

                            <StatusLine label="Role" value={roleLabel} />
                        </div>

                        {isOrganization && (
                            <p
                                className="
                                    mt-5
                                    border-t
                                    border-[#30363D]
                                    pt-4
                                    text-[11px]
                                    leading-[1.6]
                                    text-[#626D76]
                                "
                            >
                                Organization verification is managed
                                independently from account access.
                            </p>
                        )}
                    </aside>
                </div>
            </section>

            {/* =================================================
                INDIVIDUAL DETAILS
            ================================================== */}

            {!isOrganization && (
                <>
                    <PersonalInformation
                        individualProfile={individualProfile}
                    />

                    <VolunteerSection
                        isVolunteer={isVolunteer}
                        volunteerCampaignCount={volunteerCampaignCount}
                    />
                </>
            )}

            {/* =================================================
                ORGANIZATION DETAILS
            ================================================== */}

            {isOrganization && (
                <>
                    <OrganizationInformation
                        organization={organization}
                        organizationVerified={organizationVerified}
                    />

                    <OrganizationPurpose organization={organization} />

                    <OrganizationOperations organization={organization} />
                </>
            )}
        </>
    );
};

export default UserDetailsView;
