// src/dashboard/admin/organizations/components/OrganizationDetailsView.jsx

import React from 'react';

import {
    Building2,
    Calendar,
    CheckCircle2,
    Globe,
    HeartHandshake,
    Mail,
    MapPin,
    Phone,
    Shield,
    Tags,
    Target,
    Users,
} from 'lucide-react';

import {
    formatType,
    getOrganizationDetailsData,
} from '../utils/organizationDetailsUtils';

/* ============================================================
   HELPERS
============================================================ */

const hasValue = (value) => {
    return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'Not provided'
    );
};

/* ============================================================
   SECTION HEADING
============================================================ */

const SectionHeading = ({ eyebrow, title, description }) => {
    return (
        <div className="min-w-0">
            <p
                className="
                    font-sans!
                    text-[10px]
                    font-semibold!
                    uppercase
                    tracking-[0.16em]
                    text-[#697586]!
                "
            >
                {eyebrow}
            </p>

            <h2
                className="
                    mt-1.5
                    font-sans!
                    text-[17px]
                    font-semibold!
                    leading-[1.35]
                    tracking-[-0.015em]
                    text-[#EEF1F5]!
                    sm:text-[18px]
                "
            >
                {title}
            </h2>

            {description && (
                <p
                    className="
                        mt-2
                        max-w-[680px]
                        font-sans!
                        text-[12.5px]
                        font-normal!
                        leading-[1.7]
                        text-[#8792A1]!
                    "
                >
                    {description}
                </p>
            )}
        </div>
    );
};

/* ============================================================
   STATUS LINE
============================================================ */

const StatusLine = ({ label, value, tone = 'neutral' }) => {
    const tones = {
        neutral: {
            dot: 'bg-[#697586]',
            text: 'text-[#B8C0CA]!',
        },

        positive: {
            dot: 'bg-[#6FA58A]',
            text: 'text-[#9FC4AF]!',
        },

        warning: {
            dot: 'bg-[#C09558]',
            text: 'text-[#D5B37F]!',
        },

        danger: {
            dot: 'bg-[#B86D73]',
            text: 'text-[#D99A9F]!',
        },
    };

    const current = tones[tone] || tones.neutral;

    return (
        <div
            className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-x-5
                gap-y-2
                border-b
                border-[#29323E]
                py-4
                last:border-b-0
            "
        >
            <span
                className="
                    font-sans!
                    text-[12px]
                    font-normal!
                    text-[#8792A1]!
                "
            >
                {label}
            </span>

            <span
                className={`
                    flex
                    max-w-full
                    items-center
                    gap-2
                    font-sans!
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
   TAG LIST
============================================================ */

const TagList = ({ values }) => {
    const items = Array.isArray(values) ? values : values ? [values] : [];

    if (!items.length) {
        return (
            <span
                className="
                    font-sans!
                    text-[12.5px]
                    font-normal!
                    text-[#5E6978]!
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
                    key={`${String(item)}-${index}`}
                    className="
                        border
                        border-[#303A47]
                        bg-[#151B24]
                        px-3
                        py-1.5
                        font-sans!
                        text-[11.5px]
                        font-medium!
                        text-[#AEB7C3]!
                    "
                >
                    {formatType(item)}
                </span>
            ))}
        </div>
    );
};

/* ============================================================
   PROFILE HEADER
============================================================ */

const OrganizationHeader = ({ organization, details }) => {
    const photo =
        organization?.photo ||
        organization?.logo ||
        organization?.organization_logo ||
        organization?.user?.photo ||
        '';

    const email =
        organization?.user?.email || organization?.email || details.email;

    const phone =
        organization?.phone || organization?.user?.phone || details.phone;

    const verificationStatus = String(
        details.verificationStatus || 'pending',
    ).toLowerCase();

    const verificationLabel =
        verificationStatus === 'verified'
            ? 'Verified'
            : verificationStatus === 'rejected'
              ? 'Rejected'
              : 'Verification pending';

    const verificationTone =
        verificationStatus === 'verified'
            ? 'positive'
            : verificationStatus === 'rejected'
              ? 'danger'
              : 'warning';

    return (
        <section
            className="
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div
                className="
                    grid
                    min-w-0
                    lg:grid-cols-[minmax(0,1fr)_300px]
                    xl:grid-cols-[minmax(0,1fr)_330px]
                "
            >
                {/* =============================================
                    IDENTITY
                ============================================== */}

                <div
                    className="
                        min-w-0
                        px-6
                        py-8

                        sm:px-8
                        sm:py-9

                        lg:px-9
                        lg:py-10

                        xl:px-10
                        xl:py-11
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-6

                            sm:flex-row
                            sm:gap-7
                        "
                    >
                        {/* Logo */}

                        <div
                            className="
                                flex
                                h-[72px]
                                w-[72px]
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden

                                border
                                border-[#303A47]

                                bg-[#151B24]

                                font-sans!
                                text-[22px]
                                font-semibold!
                                uppercase

                                text-[#DCE1E7]!
                            "
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt=""
                                    className="
                                        block
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            'none';
                                    }}
                                />
                            ) : details.initial ? (
                                details.initial
                            ) : (
                                <Building2 size={25} strokeWidth={1.55} />
                            )}
                        </div>

                        {/* Identity */}

                        <div className="min-w-0 flex-1 pt-0.5">
                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.16em]

                                    text-[#8792A1]!
                                "
                            >
                                {details.organizationType || 'Organization'}
                            </p>

                            <h1
                                className="
                                    mt-2.5
                                    wrap-break-word

                                    font-sans!
                                    text-[25px]
                                    font-semibold!
                                    leading-[1.2]
                                    tracking-[-0.03em]

                                    text-[#EEF1F5]!

                                    sm:text-[28px]
                                "
                            >
                                {details.name || 'Organization'}
                            </h1>

                            {/* Member since */}

                            <div
                                className="
                                    mt-4
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2.5
                                "
                            >
                                <Calendar
                                    size={13}
                                    strokeWidth={1.65}
                                    className="shrink-0 text-[#697586]"
                                />

                                <span
                                    className="
                                        font-sans!
                                        text-[11.5px]
                                        font-normal!
                                        text-[#697586]!
                                    "
                                >
                                    Member since
                                </span>

                                <span
                                    className="
                                        font-sans!
                                        text-[11.5px]
                                        font-medium!
                                        text-[#AEB7C3]!
                                    "
                                >
                                    {details.createdAt}
                                </span>
                            </div>

                            {/* Contact */}

                            <div
                                className="
                                    mt-3
                                    flex
                                    flex-col
                                    gap-x-6
                                    gap-y-3
                                "
                            >
                                <span
                                    className="
                                        flex
                                        min-w-0
                                        items-center
                                        gap-2.5

                                        font-sans!
                                        text-[12.5px]
                                        font-normal!

                                        text-[#8792A1]!
                                    "
                                >
                                    <Mail
                                        size={14}
                                        strokeWidth={1.65}
                                        className="
                                            shrink-0
                                            text-[#697586]
                                        "
                                    />

                                    <span className="truncate">
                                        {hasValue(email)
                                            ? email
                                            : 'Not provided'}
                                    </span>
                                </span>

                                {hasValue(phone) && (
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-2.5

                                            font-sans!
                                            text-[12.5px]
                                            font-normal!

                                            text-[#8792A1]!
                                        "
                                    >
                                        <Phone
                                            size={14}
                                            strokeWidth={1.65}
                                            className="
                                                shrink-0
                                                text-[#697586]
                                            "
                                        />

                                        {phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =============================================
                    ACCESS & VERIFICATION
                ============================================== */}

                <aside
                    className="
                        border-t
                        border-[#29323E]

                        bg-[#121821]

                        px-4
                        py-5

                        sm:px-6
                        sm:py-6

                        lg:border-t-0
                        lg:border-l
                        lg:px-7
                        lg:py-9

                        xl:px-8
                        xl:py-10
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3

                            sm:gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2

                                sm:gap-2.5
                            "
                        >
                            <Shield
                                size={14}
                                strokeWidth={1.7}
                                className="
                                    shrink-0
                                    text-[#8792A1]
                                "
                            />

                            <p
                                className="
                                    truncate

                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.13em]

                                    text-[#8792A1]!

                                    sm:tracking-[0.14em]
                                "
                            >
                                Access & verification
                            </p>
                        </div>

                        {organization?.id && (
                            <span
                                className="
                                    shrink-0

                                    font-sans!
                                    text-[10px]
                                    font-medium!
                                    tabular-nums

                                    text-[#697586]!

                                    sm:text-[10.5px]
                                "
                            >
                                ID #{organization.id}
                            </span>
                        )}
                    </div>

                    <div
                        className="
                            mt-4
                            sm:mt-5
                            lg:mt-6
                        "
                    >
                        <StatusLine
                            label="Organization"
                            value={verificationLabel}
                            tone={verificationTone}
                        />

                        <StatusLine label="Account role" value="Organization" />

                        <StatusLine
                            label="Profile"
                            value={
                                verificationStatus === 'verified'
                                    ? 'Approved'
                                    : 'Under review'
                            }
                            tone={
                                verificationStatus === 'verified'
                                    ? 'positive'
                                    : 'warning'
                            }
                        />
                    </div>
                </aside>
            </div>
        </section>
    );
};

/* ============================================================
   ORGANIZATION INFORMATION
============================================================ */

const OrganizationInformation = ({ details }) => {
    return (
        <section
            className="
                mt-8
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div
                className="
                    px-6
                    pt-7

                    sm:px-8
                    sm:pt-8

                    lg:px-9
                    lg:pt-9

                    xl:px-10
                "
            >
                <SectionHeading
                    eyebrow="Organization"
                    title="Organization information"
                    description="Organization identity, contact information and location."
                />
            </div>

            <div
                className="
                    px-5
                    py-6

                    sm:px-8
                    sm:py-7

                    md:py-8

                    lg:px-9
                    lg:py-10

                    xl:px-10
                "
            >
                {/* Main details */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-y-6

                        sm:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.4fr)]
                        sm:gap-x-0
                    "
                >
                    {/* TYPE */}

                    <div
                        className="
                            min-w-0

                            sm:border-r
                            sm:border-[#252D38]
                            sm:pr-8

                            lg:pr-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Building2
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#697586]!
                                "
                            >
                                Organization type
                            </p>
                        </div>

                        <p
                            className={`
                                mt-2.5
                                wrap-break-word

                                font-sans!
                                text-[12px]
                                font-medium!
                                leading-5

                                sm:mt-3
                                sm:text-[12.5px]

                                ${
                                    hasValue(details.organizationType)
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {hasValue(details.organizationType)
                                ? details.organizationType
                                : 'Not provided'}
                        </p>
                    </div>

                    {/* PHONE */}

                    <div
                        className="
                            min-w-0

                            border-t
                            border-[#202832]
                            pt-5

                            sm:border-t-0
                            sm:border-r
                            sm:border-[#252D38]
                            sm:px-8
                            sm:pt-0

                            lg:px-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Phone
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#697586]!
                                "
                            >
                                Phone
                            </p>
                        </div>

                        <p
                            className={`
                                mt-2.5
                                wrap-break-word

                                font-sans!
                                text-[12px]
                                font-medium!
                                leading-5

                                sm:mt-3
                                sm:text-[12.5px]

                                ${
                                    hasValue(details.phone)
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {hasValue(details.phone)
                                ? details.phone
                                : 'Not provided'}
                        </p>
                    </div>

                    {/* ADDRESS */}

                    <div
                        className="
                            min-w-0

                            border-t
                            border-[#202832]
                            pt-5

                            sm:border-t-0
                            sm:pl-8
                            sm:pt-0

                            lg:pl-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <MapPin
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#697586]!
                                "
                            >
                                Address
                            </p>
                        </div>

                        <p
                            className={`
                                mt-2.5
                                max-w-[520px]
                                wrap-break-word

                                font-sans!
                                text-[12px]
                                font-medium!
                                leading-[1.65]

                                sm:mt-3
                                sm:text-[12.5px]

                                ${
                                    hasValue(details.address)
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {hasValue(details.address)
                                ? details.address
                                : 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact / web */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    bg-[#121821]

                    px-5
                    py-6

                    sm:px-8
                    sm:py-7

                    lg:px-9
                    lg:py-8

                    xl:px-10
                "
            >
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-6

                        sm:grid-cols-2
                        sm:gap-0
                    "
                >
                    {/* EMAIL */}

                    <div
                        className="
                            min-w-0

                            sm:border-r
                            sm:border-[#29323E]
                            sm:pr-8

                            lg:pr-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Mail
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#8792A1]!
                                "
                            >
                                Email address
                            </p>
                        </div>

                        <p
                            className={`
                                mt-3
                                wrap-break-word

                                font-sans!
                                text-[12.5px]
                                font-medium!
                                leading-[1.6]

                                ${
                                    hasValue(details.email)
                                        ? 'text-[#B8C0CA]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {hasValue(details.email)
                                ? details.email
                                : 'Not provided'}
                        </p>
                    </div>

                    {/* WEBSITE */}

                    <div
                        className="
                            min-w-0

                            border-t
                            border-[#29323E]
                            pt-6

                            sm:border-t-0
                            sm:pl-8
                            sm:pt-0

                            lg:pl-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Globe
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#8792A1]!
                                "
                            >
                                Website
                            </p>
                        </div>

                        <div
                            className="
                                mt-3
                                wrap-break-word

                                font-sans!
                                text-[12.5px]
                                font-medium!
                                leading-[1.6]
                            "
                        >
                            {hasValue(details.website) ? (
                                <a
                                    href={details.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        text-[#B8C0CA]!
                                        transition-colors
                                        duration-150

                                        hover:text-[#EEF1F5]!
                                    "
                                >
                                    {details.website}
                                </a>
                            ) : (
                                <span className="text-[#5E6978]!">
                                    Not provided
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   PURPOSE
============================================================ */

const OrganizationPurpose = ({ details }) => {
    return (
        <section
            className="
                mt-8
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div
                className="
                    px-6
                    pt-7

                    sm:px-8
                    sm:pt-8

                    lg:px-9
                    lg:pt-9

                    xl:px-10
                "
            >
                <SectionHeading
                    eyebrow="Purpose"
                    title="Mission & focus"
                    description="The organization's mission, priority areas and communities served."
                />
            </div>

            {/* Mission */}

            <div
                className="
                    px-5
                    py-6

                    sm:px-8
                    sm:py-7

                    md:py-8

                    lg:px-9
                    lg:py-10

                    xl:px-10
                "
            >
                <div
                    className="
                        grid
                        gap-5

                        sm:grid-cols-[180px_minmax(0,1fr)]
                        sm:gap-8

                        lg:grid-cols-[200px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <Target
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.15em]

                                    text-[#8792A1]!
                                "
                            >
                                Mission
                            </p>
                        </div>

                        <p
                            className="
                                mt-2.5
                                max-w-[200px]

                                font-sans!
                                text-[11.5px]
                                font-normal!
                                leading-[1.65]

                                text-[#697586]!
                            "
                        >
                            The purpose and direction of this organization.
                        </p>
                    </div>

                    <div
                        className="
                            min-w-0

                            border-t
                            border-[#29323E]
                            pt-5

                            sm:border-t-0
                            sm:border-l-2
                            sm:border-[#465261]
                            sm:pl-5
                            sm:pt-0
                        "
                    >
                        <p
                            className={`
                                max-w-[820px]
                                wrap-break-word

                                font-sans!
                                text-[12px]
                                font-normal!
                                leading-[1.8]

                                sm:text-[12.5px]

                                ${
                                    hasValue(details.mission)
                                        ? 'text-[#B8C0CA]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {hasValue(details.mission)
                                ? details.mission
                                : 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Focus + communities */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    bg-[#121821]

                    px-5
                    py-6

                    sm:px-8
                    sm:py-7

                    md:py-8

                    lg:px-9
                    lg:py-9

                    xl:px-10
                "
            >
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-6

                        md:grid-cols-2
                        md:gap-0
                    "
                >
                    <div
                        className="
                            min-w-0

                            border-b
                            border-[#29323E]
                            pb-6

                            md:border-r
                            md:border-b-0
                            md:pr-8
                            md:pb-0

                            lg:pr-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Tags
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.13em]

                                        text-[#8792A1]!
                                    "
                                >
                                    Focus areas
                                </p>

                                <p
                                    className="
                                        mt-1

                                        font-sans!
                                        text-[10.5px]
                                        font-normal!

                                        text-[#5E6978]!
                                    "
                                >
                                    Priority causes
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <TagList values={details.focusAreas} />
                        </div>
                    </div>

                    <div
                        className="
                            min-w-0

                            md:pl-8
                            lg:pl-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Users
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.13em]

                                        text-[#8792A1]!
                                    "
                                >
                                    Communities
                                </p>

                                <p
                                    className="
                                        mt-1

                                        font-sans!
                                        text-[10.5px]
                                        font-normal!

                                        text-[#5E6978]!
                                    "
                                >
                                    People served
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <TagList values={details.communitiesServed} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   OPERATIONS
============================================================ */

const OrganizationOperations = ({ details }) => {
    return (
        <section
            className="
                mt-8
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div
                className="
                    px-6
                    pt-7

                    sm:px-8
                    sm:pt-8

                    lg:px-9
                    lg:pt-9

                    xl:px-10
                "
            >
                <SectionHeading
                    eyebrow="Operations"
                    title="Team & activities"
                    description="Team capacity and regular organizational activities."
                />
            </div>

            <div
                className="
                    px-5
                    py-6

                    sm:px-8
                    sm:py-7

                    md:py-8

                    lg:px-9
                    lg:py-10

                    xl:px-10
                "
            >
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-6

                        md:grid-cols-[200px_minmax(0,1fr)]
                        md:gap-0
                    "
                >
                    {/* Team size */}

                    <div
                        className="
                            min-w-0

                            border-b
                            border-[#29323E]
                            pb-6

                            md:border-r
                            md:border-b-0
                            md:pr-8
                            md:pb-0

                            lg:pr-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Users
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#697586]!
                                "
                            >
                                Team size
                            </p>
                        </div>

                        <p
                            className={`
                                mt-3

                                font-sans!
                                text-[18px]
                                font-semibold!
                                leading-6

                                ${
                                    hasValue(details.teamSize)
                                        ? 'text-[#EEF1F5]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {hasValue(details.teamSize)
                                ? details.teamSize
                                : 'Not provided'}
                        </p>
                    </div>

                    {/* Activities */}

                    <div
                        className="
                            min-w-0

                            md:pl-8
                            lg:pl-10
                        "
                    >
                        <div className="flex items-start gap-3.5">
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center

                                    border
                                    border-[#29323E]

                                    bg-[#151B24]

                                    text-[#697586]
                                "
                            >
                                <HeartHandshake size={15} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3
                                    className="
                                        font-sans!
                                        text-[12.5px]
                                        font-semibold!
                                        leading-5

                                        text-[#EEF1F5]!
                                    "
                                >
                                    Primary activities
                                </h3>

                                <p
                                    className="
                                        mt-1.5
                                        max-w-[560px]

                                        font-sans!
                                        text-[11.5px]
                                        font-normal!
                                        leading-[1.7]

                                        text-[#697586]!
                                    "
                                >
                                    Regular programs and humanitarian work
                                    carried out by this organization.
                                </p>

                                <div
                                    className="
                                        mt-4
                                        border-t
                                        border-[#202832]
                                        pt-4
                                    "
                                >
                                    <TagList
                                        values={details.primaryActivities}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   ACCOUNT TIMELINE
============================================================ */

const AccountTimeline = ({ details }) => {
    return (
        <section
            className="
                mt-8
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-5

                    px-5
                    py-5

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-8
                    sm:py-6

                    lg:px-9

                    xl:px-10
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            font-sans!
                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.15em]

                            text-[#697586]!
                        "
                    >
                        Account timeline
                    </p>

                    <p
                        className="
                            mt-1.5

                            font-sans!
                            text-[11.5px]
                            font-normal!
                            leading-5

                            text-[#8792A1]!
                        "
                    >
                        Creation and most recent profile update.
                    </p>
                </div>

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-x-8
                        gap-y-4
                    "
                >
                    <div>
                        <p
                            className="
                                font-sans!
                                text-[9px]
                                font-semibold!
                                uppercase
                                tracking-[0.12em]

                                text-[#5E6978]!
                            "
                        >
                            Created
                        </p>

                        <p
                            className="
                                mt-1.5

                                font-sans!
                                text-[11px]
                                font-medium!
                                tabular-nums

                                text-[#AEB7C3]!
                            "
                        >
                            {details.createdAt}
                        </p>
                    </div>

                    <div>
                        <p
                            className="
                                font-sans!
                                text-[9px]
                                font-semibold!
                                uppercase
                                tracking-[0.12em]

                                text-[#5E6978]!
                            "
                        >
                            Last updated
                        </p>

                        <p
                            className="
                                mt-1.5

                                font-sans!
                                text-[11px]
                                font-medium!
                                tabular-nums

                                text-[#AEB7C3]!
                            "
                        >
                            {details.updatedAt}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   VERIFIED NOTE
============================================================ */

const VerifiedNote = () => {
    return (
        <div
            className="
                mt-8
                flex
                items-start
                gap-3.5

                border
                border-[#30463C]

                bg-[#111C18]

                px-5
                py-4.5

                sm:px-6
                sm:py-5
            "
        >
            <CheckCircle2
                size={16}
                strokeWidth={1.8}
                className="
                    mt-0.5
                    shrink-0
                    text-[#6FA58A]
                "
            />

            <div className="min-w-0">
                <p
                    className="
                        font-sans!
                        text-[12px]
                        font-semibold!

                        text-[#9FC4AF]!
                    "
                >
                    Verified organization
                </p>

                <p
                    className="
                        mt-1

                        max-w-[700px]

                        font-sans!
                        text-[11.5px]
                        font-normal!
                        leading-[1.65]

                        text-[#718F7F]!
                    "
                >
                    This organization has completed the platform&apos;s
                    administrative verification process.
                </p>
            </div>
        </div>
    );
};

/* ============================================================
   ORGANIZATION DETAILS VIEW
============================================================ */

const OrganizationDetailsView = ({ organization }) => {
    if (!organization) {
        return null;
    }

    const details = getOrganizationDetailsData(organization);

    return (
        <div
            className="
                min-w-0
                font-sans!
            "
        >
            <OrganizationHeader organization={organization} details={details} />

            <OrganizationInformation details={details} />

            <OrganizationPurpose details={details} />

            <OrganizationOperations details={details} />

            <AccountTimeline details={details} />

            {details.verified && <VerifiedNote />}
        </div>
    );
};

export default OrganizationDetailsView;
