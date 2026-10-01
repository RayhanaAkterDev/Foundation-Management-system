import React from 'react';

import { Check, HeartHandshake, UsersRound, Workflow } from 'lucide-react';

/* =========================================================
   OPTIONS
   IMPORTANT:
   Internal values remain unchanged.
========================================================= */

const focusAreaOptions = [
    { value: 'Medical Aid', label: 'চিকিৎসা সহায়তা' },
    { value: 'Education', label: 'শিক্ষা' },
    { value: 'Food Relief', label: 'খাদ্য সহায়তা' },
    { value: 'Shelter & Housing', label: 'আশ্রয় ও আবাসন' },
    { value: 'Disaster Response', label: 'দুর্যোগ মোকাবিলা' },
    { value: 'Clean Water', label: 'বিশুদ্ধ পানি' },
    {
        value: 'Women & Child Welfare',
        label: 'নারী ও শিশু কল্যাণ',
    },
    {
        value: 'Livelihood Support',
        label: 'জীবিকা সহায়তা',
    },
    { value: 'Environment', label: 'পরিবেশ' },
    { value: 'Elderly Care', label: 'প্রবীণ সেবা' },
    {
        value: 'Disability Support',
        label: 'প্রতিবন্ধী ব্যক্তিদের সহায়তা',
    },
    {
        value: 'Youth Development',
        label: 'যুব উন্নয়ন',
    },
];

const communityOptions = [
    {
        value: 'Rural Communities',
        label: 'গ্রামীণ জনগোষ্ঠী',
    },
    {
        value: 'Urban Slums',
        label: 'শহরের বস্তিবাসী',
    },
    {
        value: 'Refugees',
        label: 'শরণার্থী',
    },
    {
        value: 'Children',
        label: 'শিশু',
    },
    {
        value: 'Women',
        label: 'নারী',
    },
    {
        value: 'Elderly',
        label: 'প্রবীণ',
    },
    {
        value: 'Persons with Disabilities',
        label: 'প্রতিবন্ধী ব্যক্তি',
    },
    {
        value: 'Low-Income Families',
        label: 'স্বল্প আয়ের পরিবার',
    },
    {
        value: 'Indigenous Groups',
        label: 'আদিবাসী জনগোষ্ঠী',
    },
];

const teamSizeOptions = [
    { value: '1-10', label: '১–১০' },
    { value: '11-50', label: '১১–৫০' },
    { value: '51-200', label: '৫১–২০০' },
    { value: '201-500', label: '২০১–৫০০' },
    { value: '500+', label: '৫০০+' },
];

const activityOptions = [
    {
        value: 'Direct Aid Distribution',
        label: 'সরাসরি সহায়তা বিতরণ',
        description: 'মানুষের কাছে সরাসরি প্রয়োজনীয় সহায়তা পৌঁছে দেওয়া',
    },
    {
        value: 'Volunteer Coordination',
        label: 'স্বেচ্ছাসেবক সমন্বয়',
        description: 'স্বেচ্ছাসেবকদের সংগঠিত ও কার্যক্রমে যুক্ত করা',
    },
    {
        value: 'Fundraising Campaigns',
        label: 'তহবিল সংগ্রহ',
        description: 'মানবিক উদ্যোগের জন্য অর্থ ও সহায়তা সংগ্রহ',
    },
    {
        value: 'Community Training',
        label: 'কমিউনিটি প্রশিক্ষণ',
        description: 'স্থানীয় জনগোষ্ঠীর দক্ষতা ও সক্ষমতা উন্নয়ন',
    },
    {
        value: 'Medical Outreach',
        label: 'চিকিৎসা কার্যক্রম',
        description: 'স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা মানুষের কাছে পৌঁছে দেওয়া',
    },
    {
        value: 'Educational Programs',
        label: 'শিক্ষামূলক কার্যক্রম',
        description: 'শিক্ষা, প্রশিক্ষণ ও শেখার সুযোগ তৈরি করা',
    },
    {
        value: 'Advocacy & Awareness',
        label: 'সচেতনতা ও অ্যাডভোকেসি',
        description: 'গুরুত্বপূর্ণ সামাজিক বিষয়ে সচেতনতা তৈরি করা',
    },
    {
        value: 'Disaster Relief',
        label: 'দুর্যোগকালীন সহায়তা',
        description: 'দুর্যোগে ক্ষতিগ্রস্ত মানুষের জরুরি সহায়তায় কাজ করা',
    },
];

/* =========================================================
   HELPERS
========================================================= */

const toBanglaNumber = (number) =>
    String(number).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const ErrorMessage = ({ children }) => {
    if (!children) return null;

    return (
        <p
            className="
                mt-3
                font-['Noto_Sans_Bengali']
                text-[13px]
                leading-5
                text-red-600
            "
        >
            {children}
        </p>
    );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
    number,
    icon: Icon,
    title,
    description,
    required = false,
    optional = false,
}) => (
    <div
        className="
            mb-5
            flex
            items-start
            gap-4
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
                rounded-full
                border
                border-[#cfe2de]
                bg-[#f5faf9]
                text-primary
            "
        >
            {Icon ? (
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
            ) : (
                <span
                    className="
                        font-['Poppins']
                        text-[12px]
                        font-semibold
                    "
                >
                    {number}
                </span>
            )}
        </div>

        <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
                <h2
                    className="
                        font-['Noto_Sans_Bengali']
                        text-[17px]
                        font-semibold
                        leading-7
                        text-[#172a27]
                    "
                >
                    {title}
                </h2>

                {required && <span className="text-red-500">*</span>}

                {optional && (
                    <span
                        className="
                            font-['Noto_Sans_Bengali']
                            text-[12px]
                            font-medium
                            text-[#879591]
                        "
                    >
                        ঐচ্ছিক
                    </span>
                )}
            </div>

            {description && (
                <p
                    className="
                        mt-0.5
                        max-w-[610px]
                        font-['Noto_Sans_Bengali']
                        text-[13px]
                        leading-6
                        text-[#788783]
                    "
                >
                    {description}
                </p>
            )}
        </div>
    </div>
);

/* =========================================================
   STEP
========================================================= */

const StepOrganizationDetails = ({ formData, onChange, errors = {} }) => {
    const toggleItem = (key, value) => {
        const current = formData[key] || [];

        const next = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];

        onChange(key, next);
    };

    const focusAreas = formData.focusAreas || [];

    const communitiesServed = formData.communitiesServed || [];

    const primaryActivities = formData.primaryActivities || [];

    return (
        <div className="w-full">
            {/* =================================================
                PAGE HEADER
            ================================================== */}

            <header className="max-w-[680px]">
                <div className="flex items-center gap-2.5">
                    <span className="h-0.5 w-7 rounded-full bg-primary" />

                    <span
                        className="
                            font-['Noto_Sans_Bengali']
                            text-[14px]
                            font-semibold
                            text-primary
                        "
                    >
                        কাজ ও পরিধি
                    </span>
                </div>

                <h1
                    className="
                        mt-3.5
                        font-['Noto_Sans_Bengali']
                        text-[27px]
                        font-semibold
                        leading-[1.45]
                        tracking-[-0.012em]
                        text-[#0f172a]

                        sm:text-[30px]
                    "
                >
                    আপনার সংস্থার কাজ সম্পর্কে জানান
                </h1>

                <p
                    className="
                        mt-2.5
                        max-w-[620px]
                        font-['Noto_Sans_Bengali']
                        text-[15px]
                        leading-7
                        text-[#6c7c78]
                    "
                >
                    সংস্থার উদ্দেশ্য, কাজের ক্ষেত্র এবং যাদের জন্য কাজ
                    করেন—সেগুলো উল্লেখ করুন।
                </p>
            </header>

            {/* =================================================
                MISSION
                KEEPING PREVIOUS DIRECTION
            ================================================== */}

            <section className="mt-8">
                <div className="mb-3.5">
                    <div className="flex items-center gap-1.5">
                        <h2
                            className="
                                font-['Noto_Sans_Bengali']
                                text-[15px]
                                font-semibold
                                text-[#172a27]
                            "
                        >
                            সংস্থার লক্ষ্য ও উদ্দেশ্য
                        </h2>

                        <span className="text-red-500">*</span>
                    </div>

                    <p
                        className="
                            mt-1
                            font-['Noto_Sans_Bengali']
                            text-[13px]
                            leading-6
                            text-[#788783]
                        "
                    >
                        সংক্ষেপে আপনার সংস্থার মূল উদ্দেশ্য এবং মানবিক কাজের ধরন
                        লিখুন।
                    </p>
                </div>

                <textarea
                    id="mission"
                    rows={5}
                    placeholder="উদাহরণ: সুবিধাবঞ্চিত মানুষের জন্য শিক্ষা, স্বাস্থ্যসেবা ও জরুরি সহায়তা নিশ্চিত করতে আমরা কাজ করি..."
                    value={formData.mission || ''}
                    onChange={(event) =>
                        onChange('mission', event.target.value)
                    }
                    className={`
                        min-h-[138px]
                        w-full
                        resize-none
                        rounded-[11px]
                        border
                        bg-white
                        px-4
                        py-3.5

                        font-['Noto_Sans_Bengali']
                        text-[15px]
                        leading-7
                        text-[#172a27]

                        outline-none
                        transition-all
                        duration-200

                        placeholder:text-[#96a4a1]

                        ${
                            errors.mission
                                ? `
                                    border-red-400
                                    focus:border-red-500
                                    focus:ring-4
                                    focus:ring-red-100/70
                                `
                                : `
                                    border-[#d5dfdd]
                                    hover:border-[#afc6c2]
                                    focus:border-primary
                                    focus:ring-4
                                    focus:ring-primary/8
                                `
                        }
                    `}
                />

                <ErrorMessage>{errors.mission}</ErrorMessage>
            </section>

            {/* =================================================
                01 — FOCUS AREAS
                EDITORIAL SELECTION BOARD
            ================================================== */}

            <section
                className="
        mt-10
        border-t
        border-[#dde6e4]
        pt-8
    "
            >
                <div
                    className="
            mb-5
            flex
            flex-col
            gap-3

            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:gap-6
        "
                >
                    {/* TITLE */}

                    <div className="max-w-[520px]">
                        <div className="flex items-center gap-2">
                            <span
                                className="
                        font-['Noto_Sans_Bengali']
                        text-[17px]
                        font-semibold
                        leading-7
                        text-[#172a27]
                    "
                            >
                                প্রধান কাজের ক্ষেত্র
                            </span>

                            <span className="text-red-500">*</span>
                        </div>

                        <p
                            className="
                    mt-1
                    font-['Noto_Sans_Bengali']
                    text-[13px]
                    leading-6
                    text-[#788783]
                "
                        >
                            আপনার সংস্থা যে মানবিক ক্ষেত্রগুলোতে সক্রিয়ভাবে কাজ
                            করে সেগুলো নির্বাচন করুন।
                        </p>
                    </div>

                    {/* SELECTED COUNT */}

                    {focusAreas.length > 0 && (
                        <div
                            className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    font-['Noto_Sans_Bengali']
                    text-[12px]
                    text-[#71817d]
                "
                        >
                            <span
                                className="
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-[#e2f0ed]
                        px-1.5
                        font-semibold
                        text-primary
                    "
                            >
                                {toBanglaNumber(focusAreas.length)}
                            </span>
                            নির্বাচিত
                        </div>
                    )}
                </div>

                {/* =====================================================
        SELECTION SURFACE
    ====================================================== */}

                <div
                    className="
            relative
            overflow-hidden
            rounded-[16px]
            border
            border-[#dbe5e2]
            bg-[#f7faf9]
            p-2

            sm:p-2.5
        "
                >
                    <div
                        className="
                grid
                grid-cols-1
                gap-1.5

                sm:grid-cols-2

                lg:grid-cols-12
            "
                    >
                        {focusAreaOptions.map(({ value, label }, index) => {
                            const selected = focusAreas.includes(value);

                            /*
                             * Different widths create a more
                             * editorial composition on desktop.
                             */
                            const spanClasses = [
                                'lg:col-span-7',
                                'lg:col-span-5',

                                'lg:col-span-4',
                                'lg:col-span-4',
                                'lg:col-span-4',

                                'lg:col-span-5',
                                'lg:col-span-7',

                                'lg:col-span-6',
                                'lg:col-span-6',

                                'lg:col-span-4',
                                'lg:col-span-5',
                                'lg:col-span-3',
                            ];

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                        toggleItem('focusAreas', value)
                                    }
                                    className={`
                                group
                                relative
                                flex
                                min-h-[58px]
                                items-center
                                gap-3
                                overflow-hidden
                                rounded-[11px]
                                px-3.5
                                py-3
                                text-left
                                outline-none
                                transition-all
                                duration-200

                                focus-visible:ring-4
                                focus-visible:ring-primary/10

                                ${spanClasses[index] || ''}

                                ${
                                    selected
                                        ? `
                                            bg-[#e6f3f1]
                                            shadow-[inset_0_0_0_1px_#a9cec7]
                                        `
                                        : `
                                            bg-white
                                            shadow-[inset_0_0_0_1px_#e1e8e6]

                                            hover:bg-[#fbfdfc]
                                            hover:shadow-[inset_0_0_0_1px_#b8cec9]
                                        `
                                }
                            `}
                                >
                                    {/* LEFT INDICATOR */}

                                    <span
                                        className={`
                                    relative
                                    flex
                                    h-[26px]
                                    w-[26px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    transition-all
                                    duration-200

                                    ${
                                        selected
                                            ? `
                                                border-primary
                                                bg-primary
                                                text-white
                                            `
                                            : `
                                                border-[#cdd9d6]
                                                bg-[#f8faf9]
                                                text-transparent

                                                group-hover:border-[#9ebcb6]
                                            `
                                    }
                                `}
                                    >
                                        <Check
                                            className="
                                        h-3.5
                                        w-3.5
                                    "
                                            strokeWidth={2.8}
                                        />
                                    </span>

                                    {/* LABEL */}

                                    <span
                                        className={`
                                    min-w-0
                                    flex-1
                                    font-['Noto_Sans_Bengali']
                                    text-[14px]
                                    font-semibold
                                    leading-6
                                    transition-colors

                                    ${
                                        selected
                                            ? 'text-[#155f57]'
                                            : 'text-[#3e514c]'
                                    }
                                `}
                                    >
                                        {label}
                                    </span>

                                    {/* QUIET NUMBER */}

                                    <span
                                        className={`
                                    shrink-0
                                    font-['Poppins']
                                    text-[10px]
                                    font-medium
                                    tracking-[0.08em]
                                    transition-colors

                                    ${
                                        selected
                                            ? 'text-[#5d8f87]'
                                            : 'text-[#b1bcb9]'
                                    }
                                `}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    {/* SELECTED EDGE */}

                                    {selected && (
                                        <span
                                            className="
                                        absolute
                                        bottom-0
                                        left-3.5
                                        right-3.5
                                        h-[2px]
                                        rounded-t-full
                                        bg-primary
                                    "
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <ErrorMessage>{errors.focusAreas}</ErrorMessage>
            </section>

            {/* =================================================
                02 — COMMUNITIES
                OPEN SELECTION CANVAS
            ================================================== */}

            <section
                className="
                    mt-10
                    border-t
                    border-[#dde6e4]
                    pt-8
                "
            >
                <SectionHeader
                    number="02"
                    icon={UsersRound}
                    title="যাদের সঙ্গে কাজ করেন"
                    description="আপনার কাজ যেসব মানুষ বা জনগোষ্ঠীকে কেন্দ্র করে পরিচালিত হয় সেগুলো নির্বাচন করুন।"
                    required
                />

                <div
                    className="
                        rounded-[16px]
                        bg-[#f4f7f6]
                        px-4
                        py-5

                        sm:px-5
                        sm:py-6
                    "
                >
                    <div className="flex flex-wrap gap-2.5">
                        {communityOptions.map(({ value, label }) => {
                            const selected = communitiesServed.includes(value);

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                        toggleItem('communitiesServed', value)
                                    }
                                    className={`
                                            group
                                            inline-flex
                                            min-h-[46px]
                                            items-center
                                            gap-2.5
                                            rounded-full
                                            border
                                            px-4
                                            py-2

                                            font-['Noto_Sans_Bengali']
                                            text-[14px]
                                            font-semibold

                                            outline-none
                                            transition-all
                                            duration-200

                                            focus-visible:ring-4
                                            focus-visible:ring-primary/10

                                            ${
                                                selected
                                                    ? `
                                                        border-primary
                                                        bg-primary
                                                        text-white
                                                        shadow-[0_4px_12px_rgba(15,118,110,0.12)]
                                                    `
                                                    : `
                                                        border-[#d6e0dd]
                                                        bg-white
                                                        text-[#455853]

                                                        hover:border-[#9fbfb9]
                                                        hover:text-primary
                                                    `
                                            }
                                        `}
                                >
                                    <span
                                        className={`
                                                flex
                                                h-[18px]
                                                w-[18px]
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border

                                                ${
                                                    selected
                                                        ? `
                                                            border-white/40
                                                            bg-white/15
                                                        `
                                                        : `
                                                            border-[#cad7d4]
                                                            bg-[#f7faf9]
                                                        `
                                                }
                                            `}
                                    >
                                        {selected && (
                                            <Check
                                                className="h-2.5 w-2.5"
                                                strokeWidth={3}
                                            />
                                        )}
                                    </span>

                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {communitiesServed.length > 0 && (
                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                gap-2
                                border-t
                                border-[#dde5e3]
                                pt-4
                            "
                        >
                            <span
                                className="
                                    flex
                                    h-6
                                    min-w-6
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#dcece8]
                                    px-1.5

                                    font-['Noto_Sans_Bengali']
                                    text-[11px]
                                    font-semibold
                                    text-primary
                                "
                            >
                                {toBanglaNumber(communitiesServed.length)}
                            </span>

                            <span
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[12px]
                                    text-[#70807c]
                                "
                            >
                                টি জনগোষ্ঠী নির্বাচন করা হয়েছে
                            </span>
                        </div>
                    )}
                </div>

                <ErrorMessage>{errors.communitiesServed}</ErrorMessage>
            </section>

            {/* =================================================
                03 — TEAM SIZE
                VISUAL SCALE
            ================================================== */}

            <section
                className="
                    mt-10
                    border-t
                    border-[#dde6e4]
                    pt-8
                "
            >
                <SectionHeader
                    number="03"
                    title="টিমের আকার"
                    description="বর্তমানে আপনার সংস্থার সঙ্গে আনুমানিক কতজন সদস্য যুক্ত আছেন?"
                    optional
                />

                <div
                    className="
                        rounded-[16px]
                        border
                        border-[#dce5e3]
                        bg-white
                        px-4
                        pb-5
                        pt-6

                        sm:px-6
                        sm:pb-6
                    "
                >
                    {/* SCALE */}

                    <div className="relative">
                        <div
                            className="
                                absolute
                                left-[10%]
                                right-[10%]
                                top-[15px]
                                h-px
                                bg-[#d8e3e0]
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                                grid
                                grid-cols-5
                            "
                        >
                            {teamSizeOptions.map(({ value, label }, index) => {
                                const selected = formData.teamSize === value;

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() =>
                                            onChange(
                                                'teamSize',
                                                selected ? '' : value,
                                            )
                                        }
                                        className="
                                                group
                                                flex
                                                min-w-0
                                                flex-col
                                                items-center
                                                outline-none
                                            "
                                    >
                                        {/* POINT */}

                                        <span
                                            className={`
                                                    flex
                                                    h-[31px]
                                                    w-[31px]
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    border-[3px]
                                                    transition-all
                                                    duration-200

                                                    ${
                                                        selected
                                                            ? `
                                                                border-[#b9ddd6]
                                                                bg-primary
                                                                shadow-[0_0_0_4px_#edf7f5]
                                                            `
                                                            : `
                                                                border-white
                                                                bg-[#dbe5e2]
                                                                shadow-[0_0_0_1px_#cad7d4]

                                                                group-hover:bg-[#b8d4cf]
                                                            `
                                                    }
                                                `}
                                        >
                                            {selected && (
                                                <Check
                                                    className="h-3.5 w-3.5 text-white"
                                                    strokeWidth={2.8}
                                                />
                                            )}
                                        </span>

                                        {/* NUMBER */}

                                        <span
                                            className={`
                                                    mt-3
                                                    font-['Noto_Sans_Bengali']
                                                    text-[13px]
                                                    font-semibold
                                                    transition-colors

                                                    sm:text-[14px]

                                                    ${
                                                        selected
                                                            ? 'text-primary'
                                                            : 'text-[#52645f]'
                                                    }
                                                `}
                                        >
                                            {label}
                                        </span>

                                        <span
                                            className="
                                                    mt-0.5
                                                    hidden
                                                    font-['Noto_Sans_Bengali']
                                                    text-[10px]
                                                    text-[#95a29f]

                                                    sm:block
                                                "
                                        >
                                            {index ===
                                            teamSizeOptions.length - 1
                                                ? 'জন বা বেশি'
                                                : 'জন'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {formData.teamSize && (
                        <div
                            className="
                                mt-5
                                border-t
                                border-[#e5ebe9]
                                pt-4
                                text-center
                            "
                        >
                            <span
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[13px]
                                    text-[#6f807c]
                                "
                            >
                                নির্বাচিত টিমের আকার:{' '}
                            </span>

                            <strong
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[13px]
                                    font-semibold
                                    text-primary
                                "
                            >
                                {
                                    teamSizeOptions.find(
                                        (option) =>
                                            option.value === formData.teamSize,
                                    )?.label
                                }{' '}
                                জন
                            </strong>
                        </div>
                    )}
                </div>
            </section>

            {/* =================================================
                04 — ACTIVITIES
                EDITORIAL LIST
            ================================================== */}

            <section
                className="
                    mt-10
                    border-t
                    border-[#dde6e4]
                    pt-8
                "
            >
                <SectionHeader
                    number="04"
                    icon={Workflow}
                    title="নিয়মিত কার্যক্রম"
                    description="সংস্থাটি নিয়মিত যে ধরনের কার্যক্রম পরিচালনা করে সেগুলো নির্বাচন করুন।"
                    optional
                />

                <div
                    className="
                        border-y
                        border-[#dce5e3]
                    "
                >
                    {activityOptions.map(
                        ({ value, label, description }, index) => {
                            const selected = primaryActivities.includes(value);

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                        toggleItem('primaryActivities', value)
                                    }
                                    className={`
                                        group
                                        relative
                                        flex
                                        w-full
                                        items-center
                                        gap-3.5
                                        py-4
                                        text-left
                                        outline-none
                                        transition-colors
                                        duration-200

                                        focus-visible:z-10
                                        focus-visible:ring-4
                                        focus-visible:ring-primary/10

                                        ${
                                            index !== 0
                                                ? 'border-t border-[#e5ebe9]'
                                                : ''
                                        }

                                        ${
                                            selected
                                                ? 'bg-[#f4f9f7]'
                                                : 'bg-transparent hover:bg-[#fafcfb]'
                                        }
                                    `}
                                >
                                    {/* INDEX */}

                                    <span
                                        className={`
                                            ml-1
                                            w-7
                                            shrink-0
                                            font-['Poppins']
                                            text-[11px]
                                            font-medium
                                            tracking-[0.08em]

                                            ${
                                                selected
                                                    ? 'text-primary'
                                                    : 'text-[#a0ada9]'
                                            }
                                        `}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    {/* COPY */}

                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={`
                                                block
                                                font-['Noto_Sans_Bengali']
                                                text-[14px]
                                                font-semibold
                                                leading-6

                                                ${
                                                    selected
                                                        ? 'text-[#175f57]'
                                                        : 'text-[#354944]'
                                                }
                                            `}
                                        >
                                            {label}
                                        </span>

                                        <span
                                            className="
                                                mt-0.5
                                                hidden
                                                font-['Noto_Sans_Bengali']
                                                text-[12px]
                                                leading-5
                                                text-[#84928f]

                                                sm:block
                                            "
                                        >
                                            {description}
                                        </span>
                                    </span>

                                    {/* SELECT CONTROL */}

                                    <span
                                        className={`
                                            mr-1
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            transition-all

                                            ${
                                                selected
                                                    ? `
                                                        border-primary
                                                        bg-primary
                                                        text-white
                                                    `
                                                    : `
                                                        border-[#cbd7d4]
                                                        bg-white
                                                        text-transparent

                                                        group-hover:border-[#9ebdb7]
                                                    `
                                            }
                                        `}
                                    >
                                        <Check
                                            className="h-4 w-4"
                                            strokeWidth={2.6}
                                        />
                                    </span>

                                    {selected && (
                                        <span
                                            className="
                                                absolute
                                                bottom-0
                                                left-0
                                                top-0
                                                w-[3px]
                                                bg-primary
                                            "
                                        />
                                    )}
                                </button>
                            );
                        },
                    )}
                </div>

                {primaryActivities.length > 0 && (
                    <p
                        className="
                            mt-3
                            font-['Noto_Sans_Bengali']
                            text-[12px]
                            text-[#7b8b87]
                        "
                    >
                        {toBanglaNumber(primaryActivities.length)} টি কার্যক্রম
                        নির্বাচন করা হয়েছে
                    </p>
                )}
            </section>
        </div>
    );
};

export default StepOrganizationDetails;
