import React from 'react';

import {
    Check,
    GraduationCap,
    HandHeart,
    HeartPulse,
    HelpingHand,
    Leaf,
    LifeBuoy,
    Users,
    Utensils,
} from 'lucide-react';

/* =========================================================
   OPTIONS
========================================================= */

const participationOptions = [
    {
        value: 'hr',
        title: 'সহায়তা ব্যবস্থাপনায় যুক্ত হতে চাই',
        description: 'মানবিক সহায়তা সমন্বয় ও ব্যবস্থাপনায় অংশ নিতে চাই',
        icon: HelpingHand,
    },
    {
        value: 'volunteer',
        title: 'স্বেচ্ছাসেবায় যুক্ত হতে চাই',
        description: 'সময় ও দক্ষতা দিয়ে মানুষের পাশে কাজ করতে চাই',
        icon: Users,
    },
    {
        value: 'donor',
        title: 'সহায়তা দিতে চাই',
        description: 'মানবিক উদ্যোগে আর্থিক বা প্রয়োজনীয় সহায়তা দিতে চাই',
        icon: HandHeart,
    },
];

const causes = [
    {
        value: 'food-assistance',
        label: 'খাদ্য',
        icon: Utensils,
    },
    {
        value: 'education',
        label: 'শিক্ষা',
        icon: GraduationCap,
    },
    {
        value: 'healthcare',
        label: 'স্বাস্থ্যসেবা',
        icon: HeartPulse,
    },
    {
        value: 'disaster-relief',
        label: 'দুর্যোগ সহায়তা',
        icon: LifeBuoy,
    },
    {
        value: 'livelihood',
        label: 'জীবিকা',
        icon: HandHeart,
    },
    {
        value: 'child-support',
        label: 'শিশু সহায়তা',
        icon: HelpingHand,
    },
    {
        value: 'water-sanitation',
        label: 'বিশুদ্ধ পানি',
        icon: LifeBuoy,
    },
    {
        value: 'women-support',
        label: 'নারী সহায়তা',
        icon: Users,
    },
    {
        value: 'disability-support',
        label: 'প্রতিবন্ধী সহায়তা',
        icon: HelpingHand,
    },
    {
        value: 'emergency-relief',
        label: 'জরুরি সহায়তা',
        icon: LifeBuoy,
    },
    {
        value: 'other',
        label: 'অন্যান্য',
        icon: Leaf,
    },
];

/* =========================================================
   SECTION LABEL
========================================================= */

const SectionLabel = ({ title, description }) => (
    <div className="mb-4">
        <h2 className="font-['Noto_Sans_Bengali'] text-[15px] font-semibold leading-6 text-[#263b38] sm:text-[16px]">
            {title}
        </h2>

        {description && (
            <p className="mt-1 font-['Noto_Sans_Bengali'] text-[13px] leading-6 text-[#7a8985]">
                {description}
            </p>
        )}
    </div>
);

/* =========================================================
   STEP
========================================================= */

const StepIndividualPreferences = ({ formData, onChange }) => {
    const toggle = (key, value) => {
        const current = formData[key] || [];

        onChange(
            key,
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );
    };

    const participationTypes = formData.participationTypes || [];

    const selectedCauses = formData.causes || [];

    return (
        <div className="w-full">
            {/* =================================================
                HEADER
            ================================================== */}

            <header className="max-w-170">
                <div className="flex items-center gap-2.5">
                    <span className="h-0.5 w-7 rounded-full bg-primary" />

                    <span className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-primary">
                        আপনার আগ্রহ
                    </span>

                    <span className="font-['Noto_Sans_Bengali'] text-[13px] font-medium text-[#899793]">
                        ঐচ্ছিক
                    </span>
                </div>

                <h1 className="mt-3.5 font-['Noto_Sans_Bengali'] text-[27px] font-semibold leading-[1.45] tracking-[-0.012em] text-text-primary sm:text-[30px]">
                    আপনি কীভাবে মানুষের পাশে থাকতে চান?
                </h1>

                <p className="mt-2.5 max-w-145 font-['Noto_Sans_Bengali'] text-[15px] leading-7 text-[#6c7c78]">
                    আপনার আগ্রহ অনুযায়ী এক বা একাধিক বিষয় নির্বাচন করুন।
                </p>
            </header>

            {/* =================================================
                PARTICIPATION
            ================================================== */}

            <section className="mt-8">
                <SectionLabel
                    title="কীভাবে যুক্ত হতে চান"
                    description="প্রয়োজনে একাধিক মাধ্যম নির্বাচন করতে পারেন"
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {participationOptions.map(
                        ({ value, title, description, icon: Icon }) => {
                            const selected = participationTypes.includes(value);

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() =>
                                        toggle('participationTypes', value)
                                    }
                                    className={`
                                        group
                                        relative
                                        flex
                                        min-h-[176px]
                                        flex-col
                                        overflow-hidden
                                        rounded-[12px]
                                        border
                                        p-4
                                        text-left
                                        outline-none
                                        transition-all
                                        duration-200

                                        focus-visible:ring-4
                                        focus-visible:ring-primary/8

                                        sm:p-[18px]

                                        ${
                                            selected
                                                ? `
                                                    border-primary
                                                    bg-[#f5faf8]
                                                `
                                                : `
                                                    border-[#dbe4e2]
                                                    bg-white

                                                    hover:border-[#a8c6c0]
                                                    hover:bg-[#fbfdfc]
                                                `
                                        }
                                    `}
                                >
                                    {/* TOP */}

                                    <div className="flex w-full items-start justify-between gap-4">
                                        <span
                                            className={`
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-[9px]
                                                transition-colors
                                                duration-200

                                                ${
                                                    selected
                                                        ? `
                                                            bg-[#e2f1ee]
                                                            text-primary
                                                        `
                                                        : `
                                                            bg-[#f0f4f3]
                                                            text-[#637873]

                                                            group-hover:bg-[#eaf3f1]
                                                            group-hover:text-[#315f57]
                                                        `
                                                }
                                            `}
                                        >
                                            <Icon
                                                className="h-[19px] w-[19px]"
                                                strokeWidth={1.8}
                                            />
                                        </span>

                                        {/* CHECKBOX */}

                                        <span
                                            className={`
                                                flex
                                                h-[22px]
                                                w-[22px]
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-[6px]
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
                                                            border-[#cbd7d4]
                                                            bg-white
                                                            text-transparent
                                                        `
                                                }
                                            `}
                                        >
                                            <Check
                                                className="h-3.5 w-3.5"
                                                strokeWidth={2.7}
                                            />
                                        </span>
                                    </div>

                                    {/* CONTENT */}

                                    <div className="mt-5">
                                        <h3 className="font-['Noto_Sans_Bengali'] text-[15px] font-semibold leading-[1.6] text-[#213330]">
                                            {title}
                                        </h3>

                                        <p className="mt-1.5 font-['Noto_Sans_Bengali'] text-[13px] leading-[1.8] text-[#71817d]">
                                            {description}
                                        </p>
                                    </div>

                                    {/* SUBTLE SELECTED EDGE */}

                                    {selected && (
                                        <span
                                            aria-hidden="true"
                                            className="
                                                absolute
                                                inset-x-0
                                                bottom-0
                                                h-[3px]
                                                bg-primary
                                            "
                                        />
                                    )}
                                </button>
                            );
                        },
                    )}
                </div>
            </section>

            {/* =================================================
                CAUSES
            ================================================== */}

            <section className="mt-8 border-t border-[#e1e8e6] pt-7">
                <SectionLabel
                    title="আপনার আগ্রহের ক্ষেত্র"
                    description="যেসব বিষয়ে কাজ করতে আগ্রহী সেগুলো নির্বাচন করুন"
                />

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                    {causes.map(({ value, label, icon: Icon }) => {
                        const selected = selectedCauses.includes(value);

                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => toggle('causes', value)}
                                className={`
                                        group
                                        flex
                                        min-h-[52px]
                                        items-center
                                        gap-2.5
                                        rounded-[10px]
                                        border
                                        px-3
                                        py-2.5
                                        text-left
                                        outline-none
                                        transition-all
                                        duration-200

                                        focus-visible:ring-4
                                        focus-visible:ring-primary/8

                                        ${
                                            selected
                                                ? `
                                                    border-[#8dbdb5]
                                                    bg-[#edf7f4]
                                                `
                                                : `
                                                    border-[#dbe4e2]
                                                    bg-white

                                                    hover:border-[#abc8c2]
                                                    hover:bg-[#fbfdfc]
                                                `
                                        }
                                    `}
                            >
                                {/* ICON */}

                                <span
                                    className={`
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            transition-colors

                                            ${
                                                selected
                                                    ? `
                                                        bg-[#dcefeb]
                                                        text-primary
                                                    `
                                                    : `
                                                        bg-[#f1f5f4]
                                                        text-[#71837f]

                                                        group-hover:text-[#426d65]
                                                    `
                                            }
                                        `}
                                >
                                    <Icon
                                        className="h-4 w-4"
                                        strokeWidth={1.8}
                                    />
                                </span>

                                {/* LABEL */}

                                <span className="min-w-0 flex-1 font-['Noto_Sans_Bengali'] text-[13px] font-semibold leading-5 text-[#344743] sm:text-[14px]">
                                    {label}
                                </span>

                                {/* SELECTED CHECK */}

                                <span
                                    className={`
                                            flex
                                            h-[18px]
                                            w-[18px]
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            transition-all

                                            ${
                                                selected
                                                    ? `
                                                        bg-primary
                                                        text-white
                                                        opacity-100
                                                    `
                                                    : `
                                                        bg-transparent
                                                        text-transparent
                                                        opacity-0
                                                    `
                                            }
                                        `}
                                >
                                    <Check
                                        className="h-3 w-3"
                                        strokeWidth={2.8}
                                    />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default StepIndividualPreferences;
