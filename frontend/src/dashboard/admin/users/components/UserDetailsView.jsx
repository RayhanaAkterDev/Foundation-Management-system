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
        <div className={`min-w-0 ${className}`}>
            <div className="flex items-start gap-4">
                <div
                    className="
                        mt-0.5
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
                    <Icon size={15} strokeWidth={1.65} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <p
                        className="
                            font-sans!
                            text-[12px]
                            font-semibold!
                            uppercase
                            tracking-[0.12em]
                            text-[#697586]!
                        "
                    >
                        {label}
                    </p>

                    <div
                        className={`
                            mt-2
                            wrap-break-word
                            font-sans!
                            text-[14px]
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

/* ============================================================
   SECTION HEADING
============================================================ */

const SectionHeading = ({ title }) => (
    <div className="flex min-w-0 items-center gap-5">
        <h2 className="shrink-0 font-sans! text-[19px] font-semibold! leading-[1.35] tracking-[-0.02em] text-[#EEF1F5]! sm:text-[21px]">
            {title}
        </h2>
        <div aria-hidden="true" className="h-px min-w-0 flex-1 bg-[#29323E]" />
    </div>
);

/* ============================================================
   TAG LIST
============================================================ */

const TagList = ({ values }) => {
    const items = formatList(values);

    if (!items.length) {
        return (
            <span
                className="
                    font-sans!
                    text-[14px]
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
                    key={`${item}-${index}`}
                    className="
                        border
                        border-[#303A47]
                        bg-[#151B24]
                        px-3
                        py-1.5
                        font-sans!
                        text-[13px]
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
   VOLUNTEER SECTION
============================================================ */

const VolunteerSection = ({ isVolunteer, volunteerCampaignCount }) => {
    const campaignCount = volunteerCampaignCount ?? 0;

    return (
        <section
            className="
mt-5
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            <div
                className="
                    px-5
                    pt-6
                    sm:px-6
                    sm:pt-7
                    lg:px-9
                    lg:pt-9
                    xl:px-10
                "
            >
                <SectionHeading
                    eyebrow="Volunteer"
                    title="Volunteer information"
                    description="Volunteer participation and campaign involvement for this member."
                />
            </div>

            {isVolunteer ? (
                <div
                    className="
                        px-5
                        py-6
                        sm:px-6
                        sm:py-7
                        lg:px-9
                        lg:py-9
                        xl:px-10
                    "
                >
                    <div
                        className="
                            grid
                            overflow-hidden
                            border
                            border-[#29323E]
                            bg-[#121821]

                            @[720px]:grid-cols-[minmax(0,1fr)_220px]
                        "
                    >
                        <div
                            className="
                                relative
                                min-w-0
                                px-4
                                py-5
                                sm:px-5
                                sm:py-6
                                lg:px-6
                                lg:py-7
                            "
                        >
                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    top-0
                                    w-[2px]
                                    bg-[#6FA58A]
                                "
                            />

                            <div className="flex items-start gap-3.5 sm:gap-4">
                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        border
                                        border-[#30453E]
                                        bg-[#16231F]
                                        text-[#8DB6A2]
                                        sm:h-11
                                        sm:w-11
                                    "
                                >
                                    <HeartHandshake
                                        size={18}
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-x-3
                                            gap-y-1.5
                                        "
                                    >
                                        <h3
                                            className="
                                                font-sans!
                                                text-[14px]
                                                font-semibold!
                                                leading-5
                                                text-[#EEF1F5]!
                                                sm:text-[13px]
                                            "
                                        >
                                            Registered volunteer
                                        </h3>

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                font-sans!
                                                text-[12px]
                                                font-medium!
                                                text-[#9FC4AF]!
                                                sm:text-[12px]
                                            "
                                        >
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    shrink-0
                                                    rounded-full
                                                    bg-[#6FA58A]
                                                "
                                            />
                                            Active profile
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            max-w-[560px]
                                            font-sans!
                                            text-[13px]
                                            font-normal!
                                            leading-[1.7]
                                            text-[#8792A1]!
                                            sm:text-[12px]
                                            lg:text-[14px]
                                        "
                                    >
                                        This member is part of the volunteer
                                        network and can participate in
                                        humanitarian campaigns.
                                    </p>

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-x-5
                                            gap-y-2.5
                                            border-t
                                            border-[#202832]
                                            pt-4
                                            sm:mt-5
                                            sm:pt-5
                                        "
                                    >
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2
                                                size={13}
                                                strokeWidth={1.8}
                                                className="
                                                    shrink-0
                                                    text-[#789B8B]
                                                "
                                            />

                                            <span
                                                className="
                                                    font-sans!
                                                    text-[12px]
                                                    font-medium!
                                                    text-[#AEB7C3]!
                                                    sm:text-[13px]
                                                "
                                            >
                                                Volunteer profile enabled
                                            </span>
                                        </div>

                                        <span
                                            aria-hidden="true"
                                            className="
                                                hidden
                                                h-3
                                                w-px
                                                bg-[#303A47]
                                                sm:block
                                            "
                                        />

                                        <div className="flex items-center gap-2">
                                            <Shield
                                                size={13}
                                                strokeWidth={1.7}
                                                className="
                                                    shrink-0
                                                    text-[#697586]
                                                "
                                            />

                                            <span
                                                className="
                                                    font-sans!
                                                    text-[12px]
                                                    font-normal!
                                                    text-[#697586]!
                                                    sm:text-[13px]
                                                "
                                            >
                                                Eligible for campaign
                                                participation
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                border-t
                                border-[#29323E]
                                bg-[#1A222D]
                                px-4
                                py-5
                                sm:px-5
                                sm:py-6
                                sm:border-l
                                sm:border-t-0
                                lg:px-6
                                lg:py-7
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-full
                                    items-center
                                    justify-between
                                    gap-5
                                    sm:flex-col
                                    sm:items-start
                                    sm:justify-center
                                    sm:gap-0
                                "
                            >
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <Users
                                            size={14}
                                            strokeWidth={1.7}
                                            className="
                                                shrink-0
                                                text-[#697586]
                                            "
                                        />

                                        <p
                                            className="
                                                font-sans!
                                                text-[12px]
                                                font-semibold!
                                                uppercase
                                                tracking-[0.14em]
                                                text-[#697586]!
                                                sm:text-[12px]
                                            "
                                        >
                                            Campaign involvement
                                        </p>
                                    </div>

                                    <p
                                        className="
                                            mt-2
                                            font-sans!
                                            text-[12px]
                                            font-normal!
                                            leading-[1.55]
                                            text-[#5E6978]!
                                            md:mt-2.5
                                        "
                                    >
                                        Connected as volunteer
                                    </p>
                                </div>

                                <div
                                    className="
                                        flex
                                        shrink-0
                                        items-end
                                        gap-2
                                        sm:mt-5
                                    "
                                >
                                    <span
                                        className="
                                            font-sans!
                                            text-[25px]
                                            font-semibold!
                                            leading-none
                                            tracking-[-0.04em]
                                            text-[#EEF1F5]!
                                            sm:text-[27px]
                                            lg:text-[30px]
                                        "
                                    >
                                        {campaignCount}
                                    </span>

                                    <span
                                        className="
                                            mb-0.5
                                            font-sans!
                                            text-[12px]
                                            font-medium!
                                            text-[#697586]!
                                            sm:text-[12px]
                                        "
                                    >
                                        {campaignCount === 1
                                            ? 'campaign'
                                            : 'campaigns'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="
                        px-5
                        py-6
                        sm:px-6
                        sm:py-7
                        lg:px-9
                        lg:py-9
                        xl:px-10
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            gap-3.5
                            border
                            border-[#29323E]
                            bg-[#121821]
                            px-4
                            py-4
                            sm:gap-4
                            sm:px-5
                            sm:py-5
                            lg:px-6
                            lg:py-6
                        "
                    >
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
                                sm:h-10
                                sm:w-10
                            "
                        >
                            <HeartHandshake size={16} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0 pt-px">
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
                                        font-sans!
                                        text-[14px]
                                        font-semibold!
                                        text-[#B8C0CA]!
                                        sm:text-[14px]
                                    "
                                >
                                    No volunteer profile
                                </p>

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        font-sans!
                                        text-[12px]
                                        font-medium!
                                        text-[#697586]!
                                    "
                                >
                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-[#465261]
                                        "
                                    />
                                    Not enrolled
                                </span>
                            </div>

                            <p
                                className="
                                    mt-1.5
                                    max-w-[620px]
                                    font-sans!
                                    text-[13px]
                                    font-normal!
                                    leading-[1.7]
                                    text-[#697586]!
                                    sm:mt-2
                                    sm:text-[12px]
                                    lg:text-[14px]
                                "
                            >
                                This member has not joined the Stand For People
                                volunteer network and has no volunteer campaign
                                participation yet.
                            </p>
                        </div>
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
mt-5
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
                    eyebrow="Profile"
                    title="Personal information"
                    description="Personal details, location and preferences provided by this member."
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
                        gap-y-6
                        @[780px]:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.4fr)]
                        sm:gap-x-0
                    "
                >
                    {/* DATE OF BIRTH */}

                    <div
                        className="
                            min-w-0
                            sm:border-r
                            md:border-[#252D38]
                            sm:pr-8
                            lg:pr-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <Calendar
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#697586]!
                                "
                            >
                                Date of birth
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
                                sm:text-[14px]
                                ${
                                    individualProfile?.date_of_birth
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {individualProfile?.date_of_birth
                                ? formatDate(individualProfile.date_of_birth)
                                : 'Not provided'}
                        </p>
                    </div>

                    {/* DISTRICT */}

                    <div
                        className="
                            min-w-0
                            border-t
                            border-[#202832]
                            pt-5
                            sm:border-t-0
                            sm:border-r
                            md:border-[#252D38]
                            sm:px-8
                            sm:pt-0
                            lg:px-10
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
                                    text-[12px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#697586]!
                                "
                            >
                                District
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
                                sm:text-[14px]
                                ${
                                    individualProfile?.district
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {individualProfile?.district || 'Not provided'}
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
                            <Home
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
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
                                sm:text-[14px]
                                ${
                                    individualProfile?.address
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {individualProfile?.address || 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* PREFERENCES */}

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
                        gap-6
                        @[720px]:grid-cols-[180px_minmax(0,1fr)]
                        sm:gap-8
                         @[950px]:grid-cols-[200px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <HeartHandshake
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.15em]
                                    text-[#8792A1]!
                                "
                            >
                                Preferences
                            </p>
                        </div>

                        <p
                            className="
                                mt-2.5
                                max-w-[240px] md:max-w-[180px] lg:max-w-[190px]
                                font-sans!
                                text-[13px]
                                font-normal!
                                leading-[1.65]
                                text-[#697586]!
                            "
                        >
                            Participation choices and causes this member is
                            interested in.
                        </p>
                    </div>

                    <div
                        className="
                            min-w-0
                            border-t
                            border-[#29323E]
                            sm:border-t-0
                        "
                    >
                        <div
                            className="
                                grid
                                gap-3
                                border-b
                                border-[#29323E]
                                py-5
                                first:pt-0
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                sm:first:pt-0
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <HeartHandshake
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Participation
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            font-sans!
                                            text-[12px]
                                            font-normal!
                                            text-[#5E6978]!
                                        "
                                    >
                                        Ways to contribute
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 sm:pt-0.5">
                                <TagList values={participationPreferences} />
                            </div>
                        </div>

                        <div
                            className="
                                grid
                                gap-3
                                py-5
                                pb-0
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <Tags
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Categories
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            font-sans!
                                            text-[12px]
                                            font-normal!
                                            text-[#5E6978]!
                                        "
                                    >
                                        Causes followed
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 sm:pt-0.5">
                                <TagList values={categoryPreferences} />
                            </div>
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

const OrganizationInformation = ({ organization }) => {
    return (
        <section
            className="
                overflow-hidden
                border
                border-[#252D38]
                my-12
            "
        >
            {/* SAME HEADING STRUCTURE AS PERSONAL INFORMATION */}

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
                    description="Organization identity, registration and contact information."
                />
            </div>

            {/* =================================================
                ORGANIZATION DETAILS
                Same visual language as personal details
            ================================================== */}

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
                        gap-y-6
                        @[850px]:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.2fr)]
                        sm:gap-x-0
                    "
                >
                    {/* ORGANIZATION TYPE */}

                    <div
                        className="
                            min-w-0
                            sm:border-r
                            md:border-[#252D38]
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
                                    text-[12px]
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
                                sm:text-[14px]
                                ${
                                    organization?.type
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {organization?.type
                                ? formatType(organization.type)
                                : 'Not provided'}
                        </p>
                    </div>

                    {/* REGISTRATION */}

                    <div
                        className="
                            min-w-0
                            border-t
                            border-[#202832]
                            pt-5
                            sm:border-t-0
                            md:border-[#252D38]
                            sm:px-8
                            sm:pt-0
                            lg:px-10
                        "
                    >
                        <div className="flex items-center gap-2.5">
                            <FileText
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#697586]!
                                "
                            >
                                Registration number
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
                                sm:text-[14px]
                                ${
                                    organization?.registration_number
                                        ? 'text-[#D6DBE1]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {organization?.registration_number ||
                                'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* =================================================
                CONTACT INFORMATION
                Same secondary band as individual preferences
            ================================================== */}

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
                        gap-6
                        @[720px]:grid-cols-[180px_minmax(0,1fr)]
                        sm:gap-8
                         @[950px]:grid-cols-[200px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    {/* LEFT LABEL */}

                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <Phone
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.15em]
                                    text-[#8792A1]!
                                "
                            >
                                Contact
                            </p>
                        </div>

                        <p
                            className="
                                mt-2.5
                                max-w-[240px] md:max-w-[180px] lg:max-w-[190px]
                                font-sans!
                                text-[13px]
                                font-normal!
                                leading-[1.65]
                                text-[#697586]!
                            "
                        >
                            Contact channels and registered organization
                            location.
                        </p>
                    </div>

                    {/* RIGHT CONTENT */}

                    <div
                        className="
                            min-w-0
                            border-t
                            border-[#29323E]
                            sm:border-t-0
                        "
                    >
                        {/* PHONE */}

                        <div
                            className="
                                grid
                                gap-3
                                border-b
                                border-[#29323E]
                                py-5
                                first:pt-0
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                sm:first:pt-0
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <Phone
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Phone
                                    </p>
                                </div>
                            </div>

                            <p
                                className={`
                                    min-w-0
                                    wrap-break-word
                                    font-sans!
                                    text-[14px]
                                    font-medium!
                                    leading-[1.65]
                                    sm:pt-0.5
                                    ${
                                        organization?.phone
                                            ? 'text-[#B8C0CA]!'
                                            : 'text-[#5E6978]!'
                                    }
                                `}
                            >
                                {organization?.phone || 'Not provided'}
                            </p>
                        </div>

                        {/* WEBSITE */}

                        <div
                            className="
                                grid
                                gap-3
                                border-b
                                border-[#29323E]
                                py-5
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <Globe
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Website
                                    </p>
                                </div>
                            </div>

                            <p
                                className={`
                                    min-w-0
                                    wrap-break-word
                                    font-sans!
                                    text-[14px]
                                    font-medium!
                                    leading-[1.65]
                                    sm:pt-0.5
                                    ${
                                        organization?.website
                                            ? 'text-[#B8C0CA]!'
                                            : 'text-[#5E6978]!'
                                    }
                                `}
                            >
                                {organization?.website || 'Not provided'}
                            </p>
                        </div>

                        {/* ADDRESS */}

                        <div
                            className="
                                grid
                                gap-3
                                py-5
                                pb-0
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <Home
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Address
                                    </p>
                                </div>
                            </div>

                            <p
                                className={`
                                    min-w-0
                                    wrap-break-word
                                    font-sans!
                                    text-[14px]
                                    font-medium!
                                    leading-[1.65]
                                    sm:pt-0.5
                                    ${
                                        organization?.address
                                            ? 'text-[#B8C0CA]!'
                                            : 'text-[#5E6978]!'
                                    }
                                `}
                            >
                                {organization?.address || 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>
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
mt-5
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            {/* SAME HEADING STRUCTURE */}

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
                    description="The organization's mission, focus areas and communities served."
                />
            </div>

            {/* =================================================
                MISSION
            ================================================== */}

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
                        @[720px]:grid-cols-[180px_minmax(0,1fr)]
                        sm:gap-8
                         @[950px]:grid-cols-[200px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <Target
                                size={14}
                                strokeWidth={1.65}
                                className="shrink-0 text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
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
                                max-w-[240px] md:max-w-[180px] lg:max-w-[190px]
                                font-sans!
                                text-[13px]
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
                                text-[12px]
                                font-normal!
                                leading-[1.8]
                                sm:text-[14px]
                                ${
                                    organization?.mission
                                        ? 'text-[#B8C0CA]!'
                                        : 'text-[#5E6978]!'
                                }
                            `}
                        >
                            {organization?.mission || 'Not provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* =================================================
                FOCUS / COMMUNITIES
                Mirrors PersonalInformation preferences
            ================================================== */}

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
                        gap-6
                        @[720px]:grid-cols-[180px_minmax(0,1fr)]
                        sm:gap-8
                         @[950px]:grid-cols-[200px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    {/* LEFT LABEL */}

                    <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                            <Tags
                                size={14}
                                strokeWidth={1.7}
                                className="shrink-0 text-[#8792A1]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[12px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.15em]
                                    text-[#8792A1]!
                                "
                            >
                                Focus
                            </p>
                        </div>

                        <p
                            className="
                                mt-2.5
                                max-w-[240px] md:max-w-[180px] lg:max-w-[190px]
                                font-sans!
                                text-[13px]
                                font-normal!
                                leading-[1.65]
                                text-[#697586]!
                            "
                        >
                            Priority causes and communities this organization
                            serves.
                        </p>
                    </div>

                    {/* RIGHT CONTENT */}

                    <div
                        className="
                            min-w-0
                            border-t
                            border-[#29323E]
                            sm:border-t-0
                        "
                    >
                        {/* FOCUS AREAS */}

                        <div
                            className="
                                grid
                                gap-3
                                border-b
                                border-[#29323E]
                                py-5
                                first:pt-0
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                sm:first:pt-0
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <Tags
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Focus areas
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 sm:pt-0.5">
                                <TagList values={organization?.focus_areas} />
                            </div>
                        </div>

                        {/* COMMUNITIES */}

                        <div
                            className="
                                grid
                                gap-3
                                py-5
                                pb-0
                                @[720px]:grid-cols-[150px_minmax(0,1fr)]
                                sm:items-start
                                sm:gap-6
                                 @[950px]:grid-cols-[170px_minmax(0,1fr)]
                                lg:gap-8
                            "
                        >
                            <div className="flex items-center gap-2.5">
                                <Users
                                    size={13}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#697586]"
                                />

                                <div>
                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.12em]
                                            text-[#8792A1]!
                                        "
                                    >
                                        Communities
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 sm:pt-0.5">
                                <TagList
                                    values={organization?.communities_served}
                                />
                            </div>
                        </div>
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
    const hasTeamSize =
        organization?.team_size !== undefined &&
        organization?.team_size !== null &&
        organization?.team_size !== '';

    return (
        <section
            className="
mt-5
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            {/* SAME HEADING STRUCTURE AS VOLUNTEER */}

            <div
                className="
                    px-5
                    pt-6
                    sm:px-6
                    sm:pt-7
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

            {/* =================================================
                OPERATIONS
                Mirrors VolunteerSection composition
            ================================================== */}

            <div
                className="
                    px-5
                    py-6
                    sm:px-6
                    sm:py-7
                    lg:px-9
                    lg:py-9
                    xl:px-10
                "
            >
                <div
                    className="
                        grid
                        overflow-hidden
                        border
                        border-[#29323E]
                        bg-[#121821]
                        @[850px]:grid-cols-[minmax(0,1fr)_240px]
                        @[1100px]:grid-cols-[minmax(0,1fr)_270px]
                    "
                >
                    {/* =========================================
                        PRIMARY ACTIVITIES
                    ========================================= */}

                    <div
                        className="
                            relative
                            min-w-0
                            px-4
                            py-5
                            sm:px-5
                            sm:py-6
                            lg:px-6
                            lg:py-7
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                bottom-0
                                left-0
                                top-0
                                w-[2px]
                                bg-[#465261]
                            "
                        />

                        <div className="flex items-start gap-3.5 sm:gap-4">
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
                                    sm:h-11
                                    sm:w-11
                                "
                            >
                                <HeartHandshake size={18} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3
                                    className="
                                        font-sans!
                                        text-[14px]
                                        font-semibold!
                                        leading-5
                                        text-[#EEF1F5]!
                                        sm:text-[13px]
                                    "
                                >
                                    Primary activities
                                </h3>

                                <p
                                    className="
                                        mt-2
                                        max-w-[560px]
                                        font-sans!
                                        text-[13px]
                                        font-normal!
                                        leading-[1.7]
                                        text-[#8792A1]!
                                        sm:text-[12px]
                                        lg:text-[14px]
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
                                        sm:mt-5
                                        sm:pt-5
                                    "
                                >
                                    <TagList
                                        values={
                                            organization?.primary_activities
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================
                        TEAM SIZE
                    ========================================= */}

                    <div
                        className="
                            border-t
                            border-[#29323E]
                            bg-[#1A222D]
                            px-4
                            py-5
                            sm:px-5
                            sm:py-6
                            sm:border-l
                            sm:border-t-0
                            lg:px-6
                            lg:py-7
                        "
                    >
                        <div
                            className="
                                flex
                                h-full
                                items-center
                                justify-between
                                gap-5
                                sm:flex-col
                                sm:items-start
                                sm:justify-center
                                sm:gap-0
                            "
                        >
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <Users
                                        size={14}
                                        strokeWidth={1.7}
                                        className="
                                            shrink-0
                                            text-[#697586]
                                        "
                                    />

                                    <p
                                        className="
                                            font-sans!
                                            text-[12px]
                                            font-semibold!
                                            uppercase
                                            tracking-[0.14em]
                                            text-[#697586]!
                                            sm:text-[12px]
                                        "
                                    >
                                        Team size
                                    </p>
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-end
                                    gap-2
                                    sm:mt-5
                                "
                            >
                                <span
                                    className={`
                                        font-sans!
                                        font-semibold!
                                        leading-none
                                        tracking-[-0.04em]
                                        ${
                                            hasTeamSize
                                                ? `
                                                    text-[25px]
                                                    text-[#EEF1F5]!
                                                    sm:text-[27px]
                                                    lg:text-[30px]
                                                `
                                                : `
                                                    text-[12px]
                                                    tracking-normal
                                                    text-[#5E6978]!
                                                `
                                        }
                                    `}
                                >
                                    {hasTeamSize
                                        ? organization.team_size
                                        : 'Not provided'}
                                </span>

                                {hasTeamSize && (
                                    <span
                                        className="
                                            mb-0.5
                                            font-sans!
                                            text-[12px]
                                            font-medium!
                                            text-[#697586]!
                                            sm:text-[12px]
                                        "
                                    >
                                        members
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   USER DETAILS VIEW
============================================================ */

const UserDetailsView = ({ user }) => {
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

    const accountStatus =
        user.status === 'active'
            ? 'Active account'
            : user.status === 'suspended'
              ? 'Suspended account'
              : 'Inactive account';

    const accountTone =
        user.status === 'active'
            ? 'text-[#A3C5AF]'
            : user.status === 'suspended'
              ? 'text-[#D7A4A7]'
              : 'text-[#A5AFBC]';

    return (
        <div className="@container min-w-0 space-y-6 font-sans! sm:space-y-8">
            {/* SHARED IDENTITY HEADER — INDIVIDUAL & ORGANIZATION */}
            <section className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]">
                <div className="border-b border-[#252D38] px-5 py-4 sm:px-7 lg:px-9">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                            {isOrganization ? (
                                <Building2
                                    size={15}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#8492A3]"
                                />
                            ) : (
                                <UserRound
                                    size={15}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#8492A3]"
                                />
                            )}
                            <span className="text-[11px] font-semibold! uppercase tracking-[0.11em] text-[#A9B4C2]!">
                                {isOrganization
                                    ? 'Organization account'
                                    : 'Individual account'}
                            </span>
                        </div>
                        <span className="text-[11px] tabular-nums text-[#758294]!">
                            Account ID · {user.id ?? '—'}
                        </span>
                    </div>
                </div>

                <div className="grid min-w-0 @[850px]:grid-cols-[minmax(0,1fr)_290px] @[1100px]:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0 px-5 py-7 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
                        <div className="flex min-w-0 flex-col items-start gap-5 @[620px]:flex-row @[620px]:gap-6">
                            <div className="flex h-17 w-17 shrink-0 items-center justify-center overflow-hidden border border-[#37414E] bg-[#1B2430] text-[23px] font-semibold! text-[#D5DDE7]! sm:h-20 sm:w-20">
                                {user.photo ? (
                                    <img
                                        src={user.photo}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : userInitial ? (
                                    userInitial
                                ) : isOrganization ? (
                                    <Building2 size={28} strokeWidth={1.5} />
                                ) : (
                                    <UserRound size={28} strokeWidth={1.5} />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span
                                        className={`text-[12px] font-medium! ${accountTone}`}
                                    >
                                        {accountStatus}
                                    </span>
                                    <span className="text-[#465260]">·</span>
                                    <span className="text-[12px] text-[#8996A6]!">
                                        {roleLabel}
                                    </span>
                                </div>
                                <h1 className="mt-2 break-words text-[24px] font-semibold! leading-[1.25] tracking-[-0.025em] text-[#E5EAF0]! sm:text-[29px] lg:text-[32px]">
                                    {user.name ||
                                        (isOrganization
                                            ? 'Unnamed organization'
                                            : 'Unnamed user')}
                                </h1>
                                <div className="mt-4 flex min-w-0 flex-col gap-2.5">
                                    <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#A2ADBA]">
                                        <Mail
                                            size={15}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-[#778596]"
                                        />
                                        <span className="min-w-0 break-all">
                                            {user.email || 'No email address'}
                                        </span>
                                    </div>
                                    {user.phone && (
                                        <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#A2ADBA]">
                                            <Phone
                                                size={15}
                                                strokeWidth={1.7}
                                                className="shrink-0 text-[#778596]"
                                            />
                                            <span className="break-words">
                                                {user.phone}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#A2ADBA]">
                                        <Calendar
                                            size={15}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-[#778596]"
                                        />
                                        <span>
                                            Joined {formatDate(user.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="min-w-0 border-t border-[#29323E] bg-[#121821] px-5 py-6 sm:px-7 @[850px]:border-t-0 @[850px]:border-l lg:px-7 lg:py-9">
                        <div className="flex items-center gap-2.5">
                            <Shield
                                size={16}
                                strokeWidth={1.7}
                                className="text-[#8C9AAA]"
                            />
                            <h2 className="text-[14px] font-semibold! text-[#D8E0E9]!">
                                Account standing
                            </h2>
                        </div>
                        <div className="mt-5 divide-y divide-[#27303C] border-t border-[#27303C]">
                            <StatusLine
                                label="Account access"
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
                                label="Email verification"
                                value={
                                    emailVerified ? 'Verified' : 'Unverified'
                                }
                                tone={emailVerified ? 'positive' : 'warning'}
                            />
                            {isOrganization && (
                                <StatusLine
                                    label="Organization verification"
                                    value={
                                        organizationVerified
                                            ? 'Verified'
                                            : 'Pending review'
                                    }
                                    tone={
                                        organizationVerified
                                            ? 'positive'
                                            : 'warning'
                                    }
                                />
                            )}
                        </div>
                    </aside>
                </div>
            </section>

            {/* ROLE-SPECIFIC DETAILS — KEEP ALL EXISTING DATA SECTIONS */}
            {!isOrganization ? (
                <div className="min-w-0 space-y-6 sm:space-y-8">
                    <PersonalInformation
                        individualProfile={individualProfile}
                    />
                    <VolunteerSection
                        isVolunteer={isVolunteer}
                        volunteerCampaignCount={volunteerCampaignCount}
                    />
                </div>
            ) : (
                <div className="min-w-0 space-y-6 sm:space-y-8">
                    <OrganizationInformation
                        organization={organization}
                        organizationVerified={organizationVerified}
                    />
                    <OrganizationPurpose organization={organization} />
                    <OrganizationOperations organization={organization} />
                </div>
            )}
        </div>
    );
};

export default UserDetailsView;
