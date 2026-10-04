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
                            text-[10px]
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
                            text-[12.5px]
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
                items-center
                justify-between
                gap-5
                border-b

                            border-[#29323E]
                py-4
                last:border-b-0
            "
        >
            <span
                className="
                    font-sans!
                    text-[11px]
                    font-normal!
                    text-[#8792A1]!
                "
            >
                {label}
            </span>

            <span
                className={`
                    flex
                    shrink-0
                    items-center
                    gap-2
                    font-sans!
                    text-[11px]
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
                mt-8
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            {/* =================================================
                SECTION HEADER
            ================================================== */}

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
                    icon={HeartHandshake}
                />
            </div>

            {/* =================================================
                VOLUNTEER
            ================================================== */}

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

                            md:grid-cols-[minmax(0,1fr)_220px]

                            lg:grid-cols-[minmax(0,1fr)_240px]
                        "
                    >
                        {/* =========================================
                            VOLUNTEER STATUS
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

                                    bg-[#6FA58A]
                                "
                            />

                            <div
                                className="
                                    flex
                                    items-start

                                    gap-3.5

                                    sm:gap-4
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

                                                text-[12.5px]
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

                                                text-[9.5px]
                                                font-medium!

                                                text-[#9FC4AF]!

                                                sm:text-[10px]
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

                                            text-[10.5px]
                                            font-normal!
                                            leading-[1.7]

                                            text-[#8792A1]!

                                            sm:text-[11px]

                                            lg:text-[11.5px]
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
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >
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

                                                    text-[10px]
                                                    font-medium!

                                                    text-[#AEB7C3]!

                                                    sm:text-[10.5px]
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

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >
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

                                                    text-[10px]
                                                    font-normal!

                                                    text-[#697586]!

                                                    sm:text-[10.5px]
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

                        {/* =========================================
                            CAMPAIGN INVOLVEMENT
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

                                md:border-l
                                md:border-t-0

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

                                    md:flex-col
                                    md:items-start
                                    md:justify-center
                                    md:gap-0
                                "
                            >
                                <div>
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2.5
                                        "
                                    >
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

                                                text-[8.5px]
                                                font-semibold!
                                                uppercase
                                                tracking-[0.14em]

                                                text-[#697586]!

                                                sm:text-[9px]
                                            "
                                        >
                                            Campaign involvement
                                        </p>
                                    </div>

                                    <p
                                        className="
                                            mt-2

                                            font-sans!

                                            text-[10px]
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

                                        md:mt-5
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

                                            text-[9.5px]
                                            font-medium!

                                            text-[#697586]!

                                            sm:text-[10px]
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
                /* =================================================
                   NOT A VOLUNTEER
                ================================================== */

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

                                        text-[11.5px]
                                        font-semibold!

                                        text-[#B8C0CA]!

                                        sm:text-[12.5px]
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

                                        text-[9.5px]
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

                                    text-[10.5px]
                                    font-normal!
                                    leading-[1.7]

                                    text-[#697586]!

                                    sm:mt-2
                                    sm:text-[11px]

                                    lg:text-[11.5px]
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
                mt-8
                overflow-hidden
                border
                border-[#252D38]
                bg-[#0E1219]
            "
        >
            {/* =================================================
                SECTION HEADING — UNCHANGED
            ================================================== */}

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
                    icon={UserRound}
                />
            </div>

            {/* =================================================
                PERSONAL DETAILS
            ================================================== */}
            <div
                className="
        px-5
        py-6
        sm:px-7
        sm:py-7
        md:px-8
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
            md:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.4fr)]
            md:gap-x-0
        "
                >
                    {/* DATE OF BIRTH */}

                    <div
                        className="
                min-w-0
                md:border-r
                md:border-[#252D38]
                md:pr-8
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
                        text-[9px]
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
                    md:mt-3
                    md:text-[12.5px]
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
                md:border-t-0
                md:border-r
                md:border-[#252D38]
                md:px-8
                md:pt-0
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
                        text-[9px]
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
                    md:mt-3
                    md:text-[12.5px]
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
                md:border-t-0
                md:pl-8
                md:pt-0
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
                        text-[9px]
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
                    md:mt-3
                    md:text-[12.5px]
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

            {/* =================================================
                PREFERENCES
            ================================================== */}

            <div
                className="
                    border-t
                    border-[#252D38]
                    bg-[#121821]
                    px-5
                    py-6
                    sm:px-7
                    sm:py-7
                    md:px-8
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
                        md:grid-cols-[180px_minmax(0,1fr)]
                        md:gap-8
                        lg:grid-cols-[200px_minmax(0,1fr)]
                        lg:gap-10
                    "
                >
                    {/* LEFT LABEL */}

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
                                    text-[9px]
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
                                max-w-[190px]
                                font-sans!
                                text-[10.5px]
                                font-normal!
                                leading-[1.65]
                                text-[#697586]!
                            "
                        >
                            Participation choices and causes this member is
                            interested in.
                        </p>
                    </div>

                    {/* RIGHT CONTENT */}

                    <div
                        className="
                            min-w-0
                            border-t
                            border-[#29323E]
                            md:border-t-0
                        "
                    >
                        {/* PARTICIPATION */}

                        <div
                            className="
                                grid
                                gap-3
                                border-b
                                border-[#29323E]
                                py-5
                                first:pt-0
                                md:grid-cols-[150px_minmax(0,1fr)]
                                md:items-start
                                md:gap-6
                                md:first:pt-0
                                lg:grid-cols-[170px_minmax(0,1fr)]
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
                                            text-[9px]
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
                                            text-[9.5px]
                                            font-normal!
                                            text-[#5E6978]!
                                        "
                                    >
                                        Ways to contribute
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 md:pt-0.5">
                                <TagList values={participationPreferences} />
                            </div>
                        </div>

                        {/* CATEGORIES */}

                        <div
                            className="
                                grid
                                gap-3
                                py-5
                                pb-0
                                md:grid-cols-[150px_minmax(0,1fr)]
                                md:items-start
                                md:gap-6
                                lg:grid-cols-[170px_minmax(0,1fr)]
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
                                            text-[9px]
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
                                            text-[9.5px]
                                            font-normal!
                                            text-[#5E6978]!
                                        "
                                    >
                                        Causes followed
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 md:pt-0.5">
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

const OrganizationInformation = ({ organization, organizationVerified }) => {
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
                    description="Contact and organizational identity information."
                    icon={Building2}
                />
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-x-12
                    gap-y-8
                    px-6
                    py-8
                    sm:grid-cols-2
                    sm:px-8
                    sm:py-9
                    lg:px-9
                    lg:py-10
                    xl:gap-x-16
                    xl:px-10
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
                mt-8
                border
                border-[#252D38]
                bg-[#0E1219]
                px-6
                py-7
                sm:px-8
                sm:py-8
                lg:px-9
                lg:py-9
                xl:px-10
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
                    mt-8
                    grid
                    gap-8
                    xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]
                    xl:gap-10
                "
            >
                <div
                    className="
                        border-l-2
                        border-[#465261]
                        bg-[#121821]
                        px-5
                        py-5
                        sm:px-6
                        sm:py-6
                    "
                >
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

                    <p
                        className={`
                            mt-3
                            font-sans!
                            text-[12.5px]
                            font-normal!
                            leading-[1.8]
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

                <div
                    className="
                        grid
                        gap-8
                        sm:grid-cols-2
                        xl:grid-cols-1
                    "
                >
                    <div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <Tags
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#8792A1]!
                                "
                            >
                                Focus areas
                            </p>
                        </div>

                        <TagList values={organization?.focus_areas} />
                    </div>

                    <div>
                        <div className="mb-4 flex items-center gap-2.5">
                            <Users
                                size={14}
                                strokeWidth={1.7}
                                className="text-[#697586]"
                            />

                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.13em]
                                    text-[#8792A1]!
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
                mt-8
                border
                border-[#252D38]
                bg-[#0E1219]
                px-6
                py-7
                sm:px-8
                sm:py-8
                lg:px-9
                lg:py-9
                xl:px-10
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
                    mt-8
                    grid
                    gap-8
                    lg:grid-cols-[230px_minmax(0,1fr)]
                    lg:gap-9
                "
            >
                <div
                    className="
                        border-b
                        border-[#252D38]
                        pb-8
                        lg:border-r
                        lg:border-b-0
                        lg:pr-9
                        lg:pb-0
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            border
                            border-[#303A47]
                            bg-[#151B24]
                            text-[#8792A1]
                        "
                    >
                        <Users size={16} strokeWidth={1.7} />
                    </div>

                    <p
                        className="
                            mt-5
                            font-sans!
                            text-[9px]
                            font-semibold!
                            uppercase
                            tracking-[0.14em]
                            text-[#697586]!
                        "
                    >
                        Team size
                    </p>

                    <p
                        className={`
                            mt-2
                            font-sans!
                            text-[18px]
                            font-semibold!
                            leading-[1.3]
                            tracking-[-0.02em]
                            ${
                                organization?.team_size
                                    ? 'text-[#EEF1F5]!'
                                    : 'text-[#5E6978]!'
                            }
                        `}
                    >
                        {organization?.team_size || 'Not provided'}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2.5">
                        <HeartHandshake
                            size={14}
                            strokeWidth={1.7}
                            className="text-[#697586]"
                        />

                        <p
                            className="
                                font-sans!
                                text-[9px]
                                font-semibold!
                                uppercase
                                tracking-[0.13em]
                                text-[#8792A1]!
                            "
                        >
                            Primary activities
                        </p>
                    </div>

                    <div className="mt-4">
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
        <div className="font-sans!">
            {/* =================================================
                SUCCESS MESSAGE
            ================================================== */}

            {successMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="
                        mb-8
                        flex
                        items-start
                        justify-between
                        gap-4
                        border
                        border-[#294437]
                        bg-[#16251F]
                        px-5
                        py-4
                    "
                >
                    <div className="flex items-start gap-3.5">
                        <CheckCircle2
                            size={16}
                            strokeWidth={1.8}
                            className="
                                mt-0.5
                                shrink-0
                                text-[#8EC5A3]
                            "
                        />

                        <div className="min-w-0">
                            <p
                                className="
                                    font-sans!
                                    text-[9px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#8EC5A3]!
                                "
                            >
                                Changes saved
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    font-sans!
                                    text-[11.5px]
                                    font-medium!
                                    leading-[1.6]
                                    text-[#D8E5DD]!
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
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            text-[#739181]
                            transition-colors
                            duration-150
                            hover:bg-[#1D3128]
                            hover:text-[#D8E5DD]
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
            ================================================== */}

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
                        md:grid-cols-[minmax(0,1fr)_280px]
                        lg:grid-cols-[minmax(0,1fr)_300px]
                        xl:grid-cols-[minmax(0,1fr)_330px]
                    "
                >
                    {/* =========================================
                        IDENTITY
                    ========================================== */}

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
                            <div
                                className="
                                    flex
                                    h-[72px]
                                    w-[72px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    border-[#303A47]
                                    bg-[#151B24]
                                    font-sans!
                                    text-[22px]
                                    font-semibold!
                                    text-[#DCE1E7]
                                "
                            >
                                {userInitial ? (
                                    userInitial
                                ) : isOrganization ? (
                                    <Building2 size={25} strokeWidth={1.55} />
                                ) : (
                                    <UserRound size={25} strokeWidth={1.55} />
                                )}
                            </div>

                            <div className="min-w-0 flex-1 pt-0.5">
                                <p
                                    className="
                                        font-sans!
                                        text-[9px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#8792A1]!
                                    "
                                >
                                    {roleLabel}
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
                                    {user.name || 'User'}
                                </h1>

                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <Calendar
                                        size={13}
                                        strokeWidth={1.65}
                                        className="text-[#697586]"
                                    />

                                    <span
                                        className="
                                            font-sans!
                                            text-[10.5px]
                                            font-normal!
                                            text-[#697586]!
                                        "
                                    >
                                        Member since
                                    </span>

                                    <span
                                        className="
                                            font-sans!
                                            text-[10.5px]
                                            font-medium!
                                            text-[#AEB7C3]!
                                        "
                                    >
                                        {formatDate(user.created_at)}
                                    </span>
                                </div>

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
                                            text-[11.5px]
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
                                            {user.email || 'Not provided'}
                                        </span>
                                    </span>

                                    {user.phone && (
                                        <span
                                            className="
                                                flex
                                                items-center
                                                gap-2.5
                                                font-sans!
                                                text-[11.5px]
                                                font-normal!
                                                text-[#8792A1]!
                                            "
                                        >
                                            <Phone
                                                size={14}
                                                strokeWidth={1.65}
                                                className="text-[#697586]"
                                            />

                                            {user.phone}
                                        </span>
                                    )}
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

                    text-[8.5px]
                    font-semibold!
                    uppercase
                    tracking-[0.13em]

                    text-[#8792A1]!

                    sm:text-[9px]
                    sm:tracking-[0.14em]
                "
                                >
                                    Access & verification
                                </p>
                            </div>

                            <span
                                className="
                shrink-0

                font-sans!

                text-[9px]
                font-medium!
                tabular-nums

                text-[#697586]!

                sm:text-[9.5px]
            "
                            >
                                ID #{user.id}
                            </span>
                        </div>

                        <div
                            className="
            mt-4

            sm:mt-5

            lg:mt-6
        "
                        >
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

                            {/* <StatusLine label="Role" value={roleLabel} /> */}
                        </div>

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
        </div>
    );
};

export default UserDetailsView;
