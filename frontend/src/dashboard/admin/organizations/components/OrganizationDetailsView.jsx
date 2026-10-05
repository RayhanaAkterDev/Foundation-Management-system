// src/dashboard/admin/organizations/components/OrganizationDetailsView.jsx

import React from 'react';

import {
    Building2,
    Calendar,
    CheckCircle2,
    FileText,
    Globe,
    HeartHandshake,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Tags,
    Target,
    Users,
} from 'lucide-react';

import {
    formatType,
    getOrganizationDetailsData,
} from '../utils/organizationDetailsUtils';

/* ==========================================================================
   DETAIL FIELD
============================================================================ */

const DetailField = ({
    icon: Icon,
    label,
    value,
    children,
    className = '',
}) => {
    const hasValue =
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== 'Not provided';

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
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center

                        border
                        border-[#29323E]

                        bg-[#151B24]

                        text-[#697586]
                    "
                >
                    <Icon size={13} strokeWidth={1.65} />
                </div>

                <div className="min-w-0 pt-0.5">
                    <p
                        className="
                            font-sans!
                            text-[9px]
                            font-semibold!
                            uppercase
                            tracking-[0.13em]

                            text-[#697586]!
                        "
                    >
                        {label}
                    </p>

                    <div
                        className={`
                            mt-1.5
                            wrap-break-word

                            font-sans!
                            text-[11.5px]
                            leading-[1.65]

                            ${
                                hasValue || children
                                    ? 'font-medium! text-[#B8C0CA]!'
                                    : 'font-normal! text-[#5E6978]!'
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

/* ==========================================================================
   SECTION HEADING
============================================================================ */

const SectionHeading = ({ eyebrow, title, description }) => {
    return (
        <div className="min-w-0">
            <p
                className="
                    font-sans!
                    text-[9px]
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
                    text-[16px]
                    font-semibold!
                    leading-[1.35]
                    tracking-[-0.015em]

                    text-[#EEF1F5]!

                    sm:text-[17px]
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
                        text-[11.5px]
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

/* ==========================================================================
   TAG LIST
============================================================================ */

const TagList = ({ values }) => {
    if (!values?.length) {
        return (
            <span
                className="
                    font-sans!
                    text-[11.5px]
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
            {values.map((item, index) => (
                <span
                    key={`${String(item)}-${index}`}
                    className="
                        border
                        border-[#303A47]

                        bg-[#151B24]

                        px-3
                        py-1.5

                        font-sans!
                        text-[10.5px]
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

/* ==========================================================================
   ORGANIZATION HERO
============================================================================ */

const OrganizationHero = ({ organization, details }) => {
    const photo =
        organization?.photo ||
        organization?.logo ||
        organization?.organization_logo ||
        organization?.user?.photo ||
        '';

    const status = details.verificationStatus;

    const statusTone = {
        verified: {
            dot: 'bg-[#6FA58A]',
            text: 'text-[#9FC4AF]!',
            label: 'Verified',
        },

        rejected: {
            dot: 'bg-[#B86D73]',
            text: 'text-[#D99A9F]!',
            label: 'Rejected',
        },

        pending: {
            dot: 'bg-[#C09558]',
            text: 'text-[#D5B37F]!',
            label: 'Pending review',
        },
    };

    const tone = statusTone[status] || statusTone.pending;

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
                    relative

                    px-5
                    py-6

                    sm:px-7
                    sm:py-7

                    md:px-8

                    lg:px-9
                    lg:py-8

                    xl:px-10
                "
            >
                <div
                    className="
                        absolute
                        left-0
                        top-0

                        h-full
                        w-0.5

                        bg-[#465261]
                    "
                />

                <div
                    className="
                        flex
                        min-w-0
                        flex-col
                        gap-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-4

                            sm:gap-5
                        "
                    >
                        {/* LOGO / AVATAR */}

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden

                                border
                                border-[#303A47]

                                bg-[#151B24]

                                text-[#8792A1]

                                sm:h-16
                                sm:w-16
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
                                <span
                                    className="
                                        select-none

                                        font-sans!
                                        text-[17px]
                                        font-semibold!
                                        uppercase

                                        text-[#C7CED8]!

                                        sm:text-[19px]
                                    "
                                >
                                    {details.initial}
                                </span>
                            ) : (
                                <Building2 size={22} strokeWidth={1.6} />
                            )}
                        </div>

                        {/* IDENTITY */}

                        <div className="min-w-0">
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-3
                                    gap-y-1.5
                                "
                            >
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.16em]

                                        text-[#697586]!
                                    "
                                >
                                    Organization profile
                                </p>

                                <span
                                    className="
                                        hidden
                                        h-1
                                        w-1
                                        rounded-full

                                        bg-[#394555]

                                        sm:block
                                    "
                                />

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1.5
                                    "
                                >
                                    <span
                                        className={`
                                            h-1.5
                                            w-1.5
                                            shrink-0
                                            rounded-full

                                            ${tone.dot}
                                        `}
                                    />

                                    <span
                                        className={`
                                            font-sans!
                                            text-[10px]
                                            font-medium!

                                            ${tone.text}
                                        `}
                                    >
                                        {tone.label}
                                    </span>
                                </div>
                            </div>

                            <h1
                                className="
                                    mt-2
                                    wrap-break-word

                                    font-sans!
                                    text-[20px]
                                    font-semibold!
                                    leading-[1.25]
                                    tracking-[-0.025em]

                                    text-[#EEF1F5]!

                                    sm:text-[23px]

                                    lg:text-[25px]
                                "
                            >
                                {details.name}
                            </h1>

                            <div
                                className="
                                    mt-2
                                    flex
                                    min-w-0
                                    flex-wrap
                                    items-center
                                    gap-x-3
                                    gap-y-1.5
                                "
                            >
                                <span
                                    className="
                                        font-sans!
                                        text-[11px]
                                        font-medium!

                                        text-[#AEB7C3]!
                                    "
                                >
                                    {details.organizationType}
                                </span>

                                {details.registrationNumber !==
                                    'Not provided' && (
                                    <>
                                        <span
                                            className="
                                                h-1
                                                w-1
                                                rounded-full

                                                bg-[#394555]
                                            "
                                        />

                                        <span
                                            className="
                                                font-sans!
                                                text-[10.5px]
                                                font-normal!
                                                tabular-nums

                                                text-[#697586]!
                                            "
                                        >
                                            {details.registrationNumber}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ACCOUNT TYPE */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2.5

                            border-t
                            border-[#252D38]

                            pt-4

                            sm:border-l
                            sm:border-t-0
                            sm:pl-5
                            sm:pt-0
                        "
                    >
                        <ShieldCheck
                            size={15}
                            strokeWidth={1.7}
                            className="text-[#697586]"
                        />

                        <div>
                            <p
                                className="
                                    font-sans!
                                    text-[8.5px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.13em]

                                    text-[#5E6978]!
                                "
                            >
                                Account role
                            </p>

                            <p
                                className="
                                    mt-1

                                    font-sans!
                                    text-[11px]
                                    font-medium!

                                    text-[#B8C0CA]!
                                "
                            >
                                Organization
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ==========================================================================
   ORGANIZATION INFORMATION
============================================================================ */

const OrganizationInformation = ({ details }) => {
    return (
        <section
            className="
                mt-6
                overflow-hidden

                border
                border-[#252D38]

                bg-[#0E1219]

                sm:mt-7
                lg:mt-8
            "
        >
            <div
                className="
                    border-b
                    border-[#252D38]

                    px-5
                    py-5

                    sm:px-7
                    sm:py-6

                    lg:px-9
                    lg:py-7

                    xl:px-10
                "
            >
                <SectionHeading
                    eyebrow="Profile"
                    title="Organization information"
                    description="Registration, contact and account information associated with this organization."
                />
            </div>

            <div
                className="
                    grid
                    grid-cols-1

                    px-5
                    py-6

                    sm:grid-cols-2
                    sm:px-7
                    sm:py-7

                    lg:grid-cols-3
                    lg:px-9
                    lg:py-8

                    xl:px-10
                "
            >
                <DetailField
                    icon={Building2}
                    label="Organization type"
                    value={details.organizationType}
                    className="
                        border-b
                        border-[#252D38]
                        pb-5

                        sm:border-r
                        sm:pr-6

                        lg:pb-6
                    "
                />

                <DetailField
                    icon={FileText}
                    label="Registration number"
                    value={details.registrationNumber}
                    className="
                        border-b
                        border-[#252D38]

                        py-5

                        sm:py-0
                        sm:pb-5
                        sm:pl-6

                        lg:border-r
                        lg:pb-6
                        lg:pr-6
                    "
                />

                <DetailField
                    icon={ShieldCheck}
                    label="Verification"
                    value={formatType(details.verificationStatus)}
                    className="
                        border-b
                        border-[#252D38]

                        py-5

                        sm:col-span-2

                        lg:col-span-1
                        lg:py-0
                        lg:pb-6
                        lg:pl-6
                    "
                />

                <DetailField
                    icon={Mail}
                    label="Email address"
                    value={details.email}
                    className="
                        border-b
                        border-[#252D38]

                        py-5

                        sm:border-r
                        sm:pr-6

                        lg:py-6
                    "
                />

                <DetailField
                    icon={Phone}
                    label="Phone number"
                    value={details.phone}
                    className="
                        border-b
                        border-[#252D38]

                        py-5

                        sm:pl-6

                        lg:border-r
                        lg:py-6
                        lg:pr-6
                    "
                />

                <DetailField
                    icon={Globe}
                    label="Website"
                    value={details.website}
                    className="
                        border-b
                        border-[#252D38]

                        py-5

                        sm:col-span-2

                        lg:col-span-1
                        lg:py-6
                        lg:pl-6
                    "
                >
                    {details.website !== 'Not provided' ? (
                        <a
                            href={details.website}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                wrap-break-word

                                text-[#B8C0CA]!

                                transition-colors
                                duration-150

                                hover:text-[#EEF1F5]!
                            "
                        >
                            {details.website}
                        </a>
                    ) : null}
                </DetailField>

                <DetailField
                    icon={MapPin}
                    label="Address"
                    value={details.address}
                    className="
                        border-b
                        border-[#252D38]

                        py-5

                        sm:col-span-2

                        lg:col-span-2
                        lg:border-r
                        lg:pr-6
                    "
                />

                <DetailField
                    icon={Calendar}
                    label="Registered"
                    value={details.createdAt}
                    className="
                        pt-5

                        sm:col-span-2

                        lg:col-span-1
                        lg:pl-6
                    "
                />
            </div>
        </section>
    );
};

/* ==========================================================================
   PURPOSE
============================================================================ */

const OrganizationPurpose = ({ details }) => {
    return (
        <section
            className="
                mt-6
                overflow-hidden

                border
                border-[#252D38]

                bg-[#0E1219]

                sm:mt-7
                lg:mt-8
            "
        >
            <div
                className="
                    px-5
                    pt-6

                    sm:px-7
                    sm:pt-7

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

            {/* MISSION */}

            <div
                className="
                    px-5
                    py-6

                    sm:px-7
                    sm:py-7

                    lg:px-9
                    lg:py-9

                    xl:px-10
                "
            >
                <div
                    className="
                        grid
                        gap-5

                        sm:grid-cols-[170px_minmax(0,1fr)]
                        sm:gap-8

                        lg:grid-cols-[190px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex
                                items-center
                                gap-2.5
                            "
                        >
                            <Target
                                size={14}
                                strokeWidth={1.65}
                                className="
                                    shrink-0
                                    text-[#697586]
                                "
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#697586]!
                                "
                            >
                                Mission
                            </p>
                        </div>

                        <p
                            className="
                                mt-2.5
                                max-w-[210px]

                                font-sans!
                                text-[10.5px]
                                font-normal!
                                leading-[1.65]

                                text-[#5E6978]!
                            "
                        >
                            The purpose and direction of this organization.
                        </p>
                    </div>

                    <div
                        className="
                            min-w-0

                            border-l-2
                            border-[#465261]

                            pl-4

                            sm:pl-5
                        "
                    >
                        <p
                            className={`
                                max-w-[820px]
                                wrap-break-word

                                font-sans!
                                text-[11.5px]
                                font-normal!
                                leading-[1.8]

                                sm:text-[12px]

                                ${
                                    details.mission !== 'Not provided'
                                        ? 'text-[#B8C0CA]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {details.mission}
                        </p>
                    </div>
                </div>
            </div>

            {/* FOCUS + COMMUNITIES */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    bg-[#121821]

                    px-5
                    py-6

                    sm:px-7
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

                        md:grid-cols-2
                        md:gap-0
                    "
                >
                    {/* FOCUS AREAS */}

                    <div
                        className="
                            min-w-0

                            border-b
                            border-[#29323E]

                            pb-6

                            md:border-b-0
                            md:border-r
                            md:pb-0
                            md:pr-8

                            lg:pr-10
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-2.5
                            "
                        >
                            <Tags
                                size={13}
                                strokeWidth={1.7}
                                className="
                                    shrink-0
                                    text-[#697586]
                                "
                            />

                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.12em]

                                        text-[#8792A1]!
                                    "
                                >
                                    Focus areas
                                </p>

                                <p
                                    className="
                                        mt-1

                                        font-sans!
                                        text-[10px]
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

                    {/* COMMUNITIES */}

                    <div
                        className="
                            min-w-0

                            md:pl-8
                            lg:pl-10
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-2.5
                            "
                        >
                            <Users
                                size={13}
                                strokeWidth={1.7}
                                className="
                                    shrink-0
                                    text-[#697586]
                                "
                            />

                            <div>
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.12em]

                                        text-[#8792A1]!
                                    "
                                >
                                    Communities
                                </p>

                                <p
                                    className="
                                        mt-1

                                        font-sans!
                                        text-[10px]
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

/* ==========================================================================
   OPERATIONS
============================================================================ */

const OrganizationOperations = ({ details }) => {
    return (
        <section
            className="
                mt-6
                overflow-hidden

                border
                border-[#252D38]

                bg-[#0E1219]

                sm:mt-7
                lg:mt-8
            "
        >
            <div
                className="
                    border-b
                    border-[#252D38]

                    px-5
                    py-6

                    sm:px-7
                    sm:py-7

                    lg:px-9
                    lg:py-8

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
                    grid
                    grid-cols-1

                    md:grid-cols-[220px_minmax(0,1fr)]
                "
            >
                {/* TEAM SIZE */}

                <div
                    className="
                        border-b
                        border-[#252D38]

                        px-5
                        py-6

                        sm:px-7
                        sm:py-7

                        md:border-b-0
                        md:border-r

                        lg:px-9
                        lg:py-8
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3.5
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
                                border-[#303A47]

                                bg-[#151B24]

                                text-[#8792A1]
                            "
                        >
                            <Users size={17} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.13em]

                                    text-[#697586]!
                                "
                            >
                                Team size
                            </p>

                            <p
                                className={`
                                    mt-2

                                    font-sans!
                                    text-[16px]
                                    font-semibold!
                                    leading-6

                                    ${
                                        details.teamSize !== 'Not provided'
                                            ? 'text-[#EEF1F5]!'
                                            : 'text-[#5E6978]!'
                                    }
                                `}
                            >
                                {details.teamSize}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ACTIVITIES */}

                <div
                    className="
                        min-w-0

                        px-5
                        py-6

                        sm:px-7
                        sm:py-7

                        lg:px-9
                        lg:py-8

                        xl:px-10
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3.5
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
                                border-[#303A47]

                                bg-[#151B24]

                                text-[#8792A1]
                            "
                        >
                            <HeartHandshake size={17} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3
                                className="
                                    font-sans!
                                    text-[11.5px]
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
                                    text-[10.5px]
                                    font-normal!
                                    leading-[1.7]

                                    text-[#697586]!
                                "
                            >
                                Regular programs and humanitarian work carried
                                out by this organization.
                            </p>

                            <div
                                className="
                                    mt-4

                                    border-t
                                    border-[#202832]

                                    pt-4
                                "
                            >
                                <TagList values={details.primaryActivities} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ==========================================================================
   ACCOUNT TIMELINE
============================================================================ */

const AccountTimeline = ({ details }) => {
    return (
        <section
            className="
                mt-6

                border
                border-[#252D38]

                bg-[#0E1219]

                sm:mt-7
                lg:mt-8
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
                    sm:px-7
                    sm:py-6

                    lg:px-9

                    xl:px-10
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            font-sans!
                            text-[9px]
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
                            text-[11px]
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
                        flex
                        flex-wrap
                        gap-x-8
                        gap-y-4
                    "
                >
                    <div>
                        <p
                            className="
                                font-sans!
                                text-[8.5px]
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
                                mt-1

                                font-sans!
                                text-[10.5px]
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
                                text-[8.5px]
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
                                mt-1

                                font-sans!
                                text-[10.5px]
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

/* ==========================================================================
   ORGANIZATION DETAILS VIEW
============================================================================ */

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
            <OrganizationHero organization={organization} details={details} />

            <OrganizationInformation details={details} />

            <OrganizationPurpose details={details} />

            <OrganizationOperations details={details} />

            <AccountTimeline details={details} />

            {/* VERIFIED NOTE */}

            {details.verified && (
                <div
                    className="
                        mt-6
                        flex
                        items-start
                        gap-3

                        border
                        border-[#30463C]

                        bg-[#111C18]

                        px-4
                        py-4

                        sm:mt-7
                        sm:px-5

                        lg:mt-8
                    "
                >
                    <CheckCircle2
                        size={15}
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
                                text-[11px]
                                font-semibold!

                                text-[#9FC4AF]!
                            "
                        >
                            Verified organization
                        </p>

                        <p
                            className="
                                mt-1

                                font-sans!
                                text-[10.5px]
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
            )}
        </div>
    );
};

export default OrganizationDetailsView;
