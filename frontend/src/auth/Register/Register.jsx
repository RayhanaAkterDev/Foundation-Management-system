import React, { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    HeartHandshake,
    Loader2,
    MailCheck,
    ShieldCheck,
} from 'lucide-react';

import StepAccountType from './components/StepAccountType';
import StepCredentials from './components/StepCredentials';
import StepIndividualProfile from './components/StepIndividualProfile';
import StepIndividualPreferences from './components/StepIndividualPreferences';
import StepOrganizationProfile from './components/StepOrganizationProfile';
import StepOrganizationDetails from './components/StepOrganizationDetails';

import logo from '@/assets/shared/logo.png';

/* ==========================================================================
   HELPERS
============================================================================ */

const toBanglaDigits = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

/* ==========================================================================
   API
============================================================================ */

async function submitRegistration(payload) {
    const formData = new FormData();

    formData.append('accountType', payload.accountType);

    formData.append('credentials[name]', payload.credentials.name);

    formData.append('credentials[email]', payload.credentials.email);

    formData.append('credentials[password]', payload.credentials.password);

    formData.append(
        'credentials[password_confirmation]',
        payload.credentials.confirmPassword,
    );

    if (payload.accountType === 'individual') {
        formData.append('profile[phone]', payload.profile.phone || '');

        formData.append('profile[district]', payload.profile.district || '');

        formData.append('profile[address]', payload.profile.address || '');

        formData.append('profile[dob]', payload.profile.dob || '');

        if (payload.profile.profilePhoto instanceof File) {
            formData.append(
                'profile[profilePhoto]',
                payload.profile.profilePhoto,
            );
        }

        if (payload.preferences?.participationTypes) {
            payload.preferences.participationTypes.forEach((value) => {
                formData.append('preferences[participationTypes][]', value);
            });
        }

        if (payload.preferences?.causes) {
            payload.preferences.causes.forEach((value) => {
                formData.append('preferences[causes][]', value);
            });
        }
    } else {
        formData.append('profile[phone]', payload.profile.phone || '');

        formData.append(
            'profile[organizationType]',
            payload.profile.organizationType || '',
        );

        /*
         * Registration number is intentionally NOT collected during
         * organization registration.
         *
         * The existing database column remains available for the
         * SP-assigned registration number after admin verification.
         */

        formData.append('profile[address]', payload.profile.address || '');

        formData.append('profile[website]', payload.profile.website || '');

        if (payload.profile.organizationLogo instanceof File) {
            formData.append(
                'profile[organizationLogo]',
                payload.profile.organizationLogo,
            );
        }

        formData.append('details[mission]', payload.details.mission || '');

        payload.details.focusAreas?.forEach((value) => {
            formData.append('details[focusAreas][]', value);
        });

        payload.details.communitiesServed?.forEach((value) => {
            formData.append('details[communitiesServed][]', value);
        });

        formData.append('details[teamSize]', payload.details.teamSize || '');

        payload.details.primaryActivities?.forEach((value) => {
            formData.append('details[primaryActivities][]', value);
        });
    }

    console.log('নিবন্ধনের তথ্য পাঠানো হচ্ছে:');

    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(
                key,
                `ফাইল: ${value.name} (${value.type}, ${value.size} বাইট)`,
            );
        } else {
            console.log(key, value);
        }
    }

    const response = await fetch(
        `${
            import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
        }/register`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        },
    );

    let data = {};

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const serverText = await response.text();

        console.error('সার্ভার থেকে অপ্রত্যাশিত উত্তর পাওয়া গেছে:', serverText);

        throw new Error(
            `সার্ভার থেকে অপ্রত্যাশিত উত্তর পাওয়া গেছে (${toBanglaDigits(
                response.status,
            )})।`,
        );
    }

    console.log('নিবন্ধনের সার্ভার স্ট্যাটাস:', response.status);

    console.log('নিবন্ধনের সার্ভার উত্তর:', data);

    if (!response.ok) {
        if (data.errors) {
            const firstError = Object.values(data.errors).flat().find(Boolean);

            throw new Error(
                firstError ||
                    data.message ||
                    'নিবন্ধন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।',
            );
        }

        throw new Error(
            data.message || 'নিবন্ধন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।',
        );
    }

    return data;
}

/* ==========================================================================
   VALIDATION
============================================================================ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BD_PHONE_RE = /^01[0-9]{9}$/;

function validateStep(step, accountType, formData) {
    const errs = {};

    /* ----------------------------------------------------------------------
       STEP 1
    ---------------------------------------------------------------------- */

    if (step === 1) {
        if (!accountType) {
            errs.accountType =
                'এগিয়ে যেতে একটি অ্যাকাউন্টের ধরন নির্বাচন করুন।';
        }
    }

    /* ----------------------------------------------------------------------
       STEP 2
    ---------------------------------------------------------------------- */

    if (step === 2) {
        if (!formData.credentials.name?.trim()) {
            errs.name = 'এই তথ্যটি দেওয়া আবশ্যক।';
        }

        if (!formData.credentials.email?.trim()) {
            errs.email = 'ইমেইল ঠিকানা দিন।';
        } else if (!EMAIL_RE.test(formData.credentials.email)) {
            errs.email = 'সঠিক ইমেইল ঠিকানা লিখুন।';
        }

        if (!formData.credentials.password) {
            errs.password = 'পাসওয়ার্ড দিন।';
        } else if (formData.credentials.password.length < 8) {
            errs.password = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।';
        }

        if (!formData.credentials.confirmPassword) {
            errs.confirmPassword = 'পাসওয়ার্ডটি আবার লিখুন।';
        } else if (
            formData.credentials.password !==
            formData.credentials.confirmPassword
        ) {
            errs.confirmPassword = 'পাসওয়ার্ড দুটি মিলছে না।';
        }
    }

    /* ----------------------------------------------------------------------
       STEP 3
    ---------------------------------------------------------------------- */

    if (step === 3) {
        if (accountType === 'individual') {
            const p = formData.individualProfile;

            if (!p.phone?.trim()) {
                errs.phone = 'মোবাইল নম্বর দিন।';
            } else if (!BD_PHONE_RE.test(p.phone.trim())) {
                errs.phone =
                    '০১ দিয়ে শুরু হওয়া সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।';
            }

            if (!p.district?.trim()) {
                errs.district = 'জেলার নাম দিন।';
            }

            if (!p.address?.trim()) {
                errs.address = 'ঠিকানা দিন।';
            }
        } else {
            const p = formData.organizationProfile;

            if (!p.phone?.trim()) {
                errs.phone = 'মোবাইল নম্বর দিন।';
            } else if (!BD_PHONE_RE.test(p.phone.trim())) {
                errs.phone =
                    '০১ দিয়ে শুরু হওয়া সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।';
            }

            if (!p.organizationType) {
                errs.organizationType = 'সংস্থার ধরন নির্বাচন করুন।';
            }

            /*
             * Registration number intentionally removed.
             *
             * It will be assigned by SP administration after
             * organization verification.
             */

            if (!p.address?.trim()) {
                errs.address = 'সংস্থার ঠিকানা দিন।';
            }
        }
    }

    /* ----------------------------------------------------------------------
       STEP 4 — ORGANIZATION
    ---------------------------------------------------------------------- */

    if (step === 4 && accountType === 'organization') {
        const d = formData.organizationDetails;

        if (!d.mission?.trim()) {
            errs.mission = 'আপনার সংস্থার লক্ষ্য সম্পর্কে লিখুন।';
        }

        if (!d.focusAreas?.length) {
            errs.focusAreas = 'অন্তত একটি কাজের ক্ষেত্র নির্বাচন করুন।';
        }

        if (!d.communitiesServed?.length) {
            errs.communitiesServed = 'অন্তত একটি জনগোষ্ঠী নির্বাচন করুন।';
        }
    }

    return errs;
}

/* ==========================================================================
   STEPS
============================================================================ */

const DEFAULT_STEPS = [
    {
        number: '০১',
        title: 'অ্যাকাউন্টের ধরন',
    },
    {
        number: '০২',
        title: 'অ্যাকাউন্ট তথ্য',
    },
    {
        number: '০৩',
        title: 'প্রোফাইল',
    },
    {
        number: '০৪',
        title: 'আপনার আগ্রহ',
    },
];

const getSteps = (accountType) =>
    DEFAULT_STEPS.map((item, index) =>
        index === 3 && accountType === 'organization'
            ? {
                  ...item,
                  title: 'সংস্থার বিস্তারিত',
              }
            : item,
    );

/* ==========================================================================
   DESKTOP SIDEBAR
============================================================================ */

const DesktopProgress = ({ currentStep, accountType, identity }) => {
    const steps = getSteps(accountType);

    const descriptions = [
        'আপনি ব্যক্তি নাকি সংস্থা',
        'পরিচয় ও লগইন তথ্য',
        'প্রয়োজনীয় প্রোফাইল তথ্য',
        accountType === 'organization'
            ? 'কাজ ও কার্যক্রমের পরিধি'
            : 'সহায়তার আগ্রহ ও পছন্দ',
    ];

    const showIdentity = currentStep >= 3 && identity?.name?.trim();

    return (
        <aside className="hidden lg:block">
            <div className="sticky top-8">
                {/* =========================================================
                    INTRO
                ========================================================== */}

                <div className="relative pr-7">
                    {/* SMALL BRAND MARK */}

                    <div className="flex items-center gap-3.5">
                        <span
                            className="
                                h-[2px]
                                w-10
                                rounded-full
                                bg-[#ed864a]
                            "
                        />

                        <span
                            className="
                                font-['Noto_Sans_Bengali']
                                text-[14px]
                                font-semibold
                                leading-6
                                text-[#0f766e]
                            "
                        >
                            নতুন সদস্য নিবন্ধন
                        </span>
                    </div>

                    {/* MAIN TITLE */}

                    <h2
                        className="
                            mt-5
                            max-w-[305px]

                            font-['Noto_Sans_Bengali']
                            text-[31px]
                            font-semibold
                            leading-[1.44]
                            tracking-[-0.025em]

                            text-[#123f3a]

                            xl:text-[33px]
                        "
                    >
                        মানুষের পাশে থাকার
                        <span className="block text-[#0f766e]">
                            যাত্রা শুরু করুন
                        </span>
                    </h2>

                    <p
                        className="
                            mt-4
                            max-w-[285px]

                            font-['Noto_Sans_Bengali']
                            text-[14px]
                            font-normal
                            leading-[1.95]

                            text-[#627570]
                        "
                    >
                        কয়েকটি প্রয়োজনীয় তথ্য দিয়ে আপনার Stand For People পরিচয়
                        তৈরি করুন।
                    </p>
                </div>

                {/* =========================================================
                    IDENTITY
                ========================================================== */}

                {showIdentity && (
                    <div
                        className="
                            relative
                            mt-9
                            border-l-[3px]
                            border-[#0f766e]
                            pl-5
                            pr-6
                        "
                    >
                        <div className="flex items-center gap-2">
                            <p
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[12px]
                                    font-semibold
                                    leading-5
                                    text-[#758783]
                                "
                            >
                                {accountType === 'organization'
                                    ? 'সংস্থার পরিচয়'
                                    : 'আপনার পরিচয়'}
                            </p>

                            <span
                                className="
                                    h-1
                                    w-1
                                    rounded-full
                                    bg-[#a7b6b2]
                                "
                            />

                            <span
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[11.5px]
                                    font-semibold
                                    text-[#0f766e]
                                "
                            >
                                সংরক্ষিত
                            </span>
                        </div>

                        <p
                            className="
                                mt-1.5
                                truncate

                                font-['Noto_Sans_Bengali']
                                text-[16px]
                                font-semibold
                                leading-7

                                text-[#173f3a]
                            "
                        >
                            {identity.name}
                        </p>

                        <p
                            className="
                                mt-0.5
                                truncate

                                font-['Poppins']
                                text-[12px]
                                font-normal
                                leading-5

                                text-[#748681]
                            "
                        >
                            {identity.email}
                        </p>
                    </div>
                )}

                {/* =========================================================
                    PROGRESS
                ========================================================== */}

                <div
                    className={`
                        ${showIdentity ? 'mt-9' : 'mt-10'}

                        border-y
                        border-[#d5e1de]
                        py-5
                        pr-7
                    `}
                >
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p
                                className="
                                    mb-2

                                    font-['Noto_Sans_Bengali']
                                    text-[12px]
                                    font-medium
                                    leading-5

                                    text-[#788a86]
                                "
                            >
                                নিবন্ধন অগ্রগতি
                            </p>

                            <div className="flex items-baseline">
                                <span
                                    className="
                                        font-['Poppins']
                                        text-[42px]
                                        font-semibold
                                        leading-[0.9]
                                        tracking-[-0.055em]

                                        text-[#134e4a]
                                    "
                                >
                                    {toBanglaDigits(currentStep)}
                                </span>

                                <span
                                    className="
                                        ml-2

                                        font-['Noto_Sans_Bengali']
                                        text-[13px]
                                        font-medium

                                        text-[#8d9d99]
                                    "
                                >
                                    / ০৪
                                </span>
                            </div>
                        </div>

                        <span
                            className="
                                mb-0.5

                                font-['Noto_Sans_Bengali']
                                text-[13px]
                                font-semibold

                                text-[#c86f42]
                            "
                        >
                            {toBanglaDigits(currentStep * 25)}% সম্পন্ন
                        </span>
                    </div>

                    <div
                        className="
                            mt-5
                            h-[4px]
                            w-full
                            overflow-hidden
                            rounded-full

                            bg-[#dce7e4]
                        "
                    >
                        <div
                            className="
                                h-full
                                rounded-full

                                bg-[#0f766e]

                                transition-all
                                duration-500
                            "
                            style={{
                                width: `${currentStep * 25}%`,
                            }}
                        />
                    </div>
                </div>

                {/* =========================================================
                    STEPS
                ========================================================== */}

                <div className="mt-8 pr-5">
                    <div className="relative">
                        {/* TIMELINE */}

                        <div
                            className="
                                absolute
                                bottom-5
                                left-[11px]
                                top-5

                                w-px
                                bg-[#d2dfdc]
                            "
                        />

                        <div className="relative space-y-7">
                            {steps.map((item, index) => {
                                const number = index + 1;

                                const active = currentStep === number;

                                const completed = currentStep > number;

                                return (
                                    <div
                                        key={item.number}
                                        className="
                                                relative
                                                flex
                                                gap-5
                                            "
                                    >
                                        {/* =================================
                                                TIMELINE MARKER
                                            ================================== */}

                                        <div
                                            className="
                                                    relative
                                                    z-10
                                                    flex
                                                    w-[23px]
                                                    shrink-0
                                                    justify-center
                                                "
                                        >
                                            <span
                                                className={`
                                                        flex
                                                        h-[23px]
                                                        w-[23px]
                                                        items-center
                                                        justify-center

                                                        rounded-full
                                                        border

                                                        transition-all
                                                        duration-300

                                                        ${
                                                            active
                                                                ? `
                                                                    border-[#0f766e]
                                                                    bg-[#0f766e]
                                                                    shadow-[0_0_0_5px_#e6f1ee]
                                                                `
                                                                : completed
                                                                  ? `
                                                                        border-[#8ebbb2]
                                                                        bg-[#dceeea]
                                                                    `
                                                                  : `
                                                                        border-[#c8d7d3]
                                                                        bg-[#f7faf9]
                                                                    `
                                                        }
                                                    `}
                                            >
                                                {completed ? (
                                                    <Check
                                                        className="
                                                                h-3
                                                                w-3
                                                                text-[#0f766e]
                                                            "
                                                        strokeWidth={2.8}
                                                    />
                                                ) : (
                                                    <span
                                                        className={`
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full

                                                                ${
                                                                    active
                                                                        ? 'bg-white'
                                                                        : 'bg-[#91a39e]'
                                                                }
                                                            `}
                                                    />
                                                )}
                                            </span>
                                        </div>

                                        {/* =================================
                                                STEP CONTENT
                                            ================================== */}

                                        <div
                                            className={`
                                                    min-w-0
                                                    flex-1

                                                    ${active ? 'pb-1' : ''}
                                                `}
                                        >
                                            <div
                                                className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                    "
                                            >
                                                <p
                                                    className={`
                                                            font-['Noto_Sans_Bengali']
                                                            leading-6

                                                            ${
                                                                active
                                                                    ? `
                                                                        text-[15px]
                                                                        font-bold
                                                                        text-[#153f3a]
                                                                    `
                                                                    : completed
                                                                      ? `
                                                                            text-[14px]
                                                                            font-semibold
                                                                            text-[#49655f]
                                                                        `
                                                                      : `
                                                                            text-[14px]
                                                                            font-medium
                                                                            text-[#71837e]
                                                                        `
                                                            }
                                                        `}
                                                >
                                                    {item.title}
                                                </p>

                                                {active && (
                                                    <ArrowRight
                                                        className="
                                                                h-4
                                                                w-4
                                                                shrink-0
                                                                text-[#0f766e]
                                                            "
                                                        strokeWidth={2}
                                                    />
                                                )}
                                            </div>

                                            <p
                                                className={`
                                                        mt-1
                                                        max-w-[250px]

                                                        font-['Noto_Sans_Bengali']
                                                        text-[13px]
                                                        leading-[1.75]

                                                        ${
                                                            active
                                                                ? 'text-[#5d746e]'
                                                                : completed
                                                                  ? 'text-[#839691]'
                                                                  : 'text-[#94a29e]'
                                                        }
                                                    `}
                                            >
                                                {descriptions[index]}
                                            </p>

                                            {active && (
                                                <div
                                                    className="
                                                            mt-3
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                >
                                                    <span
                                                        className="
                                                                h-[2px]
                                                                w-7
                                                                rounded-full
                                                                bg-[#0f766e]
                                                            "
                                                    />

                                                    <span
                                                        className="
                                                                font-['Noto_Sans_Bengali']
                                                                text-[11.5px]
                                                                font-semibold
                                                                text-[#0f766e]
                                                            "
                                                    >
                                                        বর্তমান ধাপ
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    HUMANITARIAN MESSAGE
                ========================================================== */}

                <div
                    className="
                        mt-10
                        border-t
                        border-[#d5e1de]
                        pt-6
                        pr-7
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
                                rounded-[10px]

                                bg-[#e5f0ed]
                            "
                        >
                            <HeartHandshake
                                className="
                                    h-[18px]
                                    w-[18px]
                                    text-[#0f766e]
                                "
                                strokeWidth={1.7}
                            />
                        </div>

                        <div>
                            <p
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[14px]
                                    font-semibold
                                    leading-6

                                    text-[#35534d]
                                "
                            >
                                মানুষের জন্য, মানুষের সঙ্গে
                            </p>

                            <p
                                className="
                                    mt-1
                                    max-w-[240px]

                                    font-['Noto_Sans_Bengali']
                                    text-[12.5px]
                                    leading-[1.8]

                                    text-[#758681]
                                "
                            >
                                আপনার তথ্য কেবল প্রয়োজনীয় সেবা ও সমন্বয়ের জন্য
                                ব্যবহার করা হবে।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

/* ==========================================================================
   MOBILE / TABLET PROGRESS
============================================================================ */

const ResponsiveProgress = ({ currentStep, accountType }) => {
    const steps = getSteps(accountType);
    const active = steps[currentStep - 1];

    return (
        <div className="lg:hidden">
            <div className="rounded-[16px] bg-[#eaf4f2] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-['Noto_Sans_Bengali'] text-[13px] font-semibold text-[#0f766e]">
                            ধাপ {active.number} / ০৪
                        </p>

                        <p className="mt-1 font-['Noto_Sans_Bengali'] text-[17px] font-semibold text-[#0f172a]">
                            {active.title}
                        </p>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white font-['Noto_Sans_Bengali'] text-[13px] font-bold text-[#0f766e] shadow-sm">
                        {toBanglaDigits(currentStep * 25)}%
                    </span>
                </div>

                <div className="mt-4 flex gap-2">
                    {steps.map((item, index) => (
                        <span
                            key={item.number}
                            className={`h-1 flex-1 rounded-full ${
                                index + 1 <= currentStep
                                    ? 'bg-[#0f766e]'
                                    : 'bg-[#c8dcda]'
                            }`}
                        />
                    ))}
                </div>

                <div className="mt-4 hidden grid-cols-4 gap-3 sm:grid">
                    {steps.map((item, index) => (
                        <span
                            key={item.number}
                            className={`font-['Noto_Sans_Bengali'] text-[13px] font-medium ${
                                index + 1 <= currentStep
                                    ? 'text-[#315e58]'
                                    : 'text-[#819591]'
                            }`}
                        >
                            {item.title}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   NAVIGATION
============================================================================ */

const RegisterNavigation = ({
    currentStep,
    totalSteps,
    onBack,
    onContinue,
    onSkip,
    isSubmitting,
    canContinue,
    showSkip,
}) => {
    const first = currentStep === 1;
    const final = currentStep === totalSteps;

    return (
        <div className="mt-8 border-t border-[#e4e9ec] pt-6 sm:mt-10">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {!first && (
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isSubmitting}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] px-4 font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#526272] transition hover:bg-[#f2f5f6] hover:text-[#0f766e] disabled:opacity-40 sm:w-auto"
                        >
                            <ArrowLeft className="h-[17px] w-[17px]" />
                            পূর্ববর্তী
                        </button>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
                    {showSkip && (
                        <button
                            type="button"
                            onClick={onSkip}
                            disabled={isSubmitting}
                            className="h-12 rounded-[10px] px-4 font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#64748b] transition hover:bg-[#f4f6f7] hover:text-[#0f766e] disabled:opacity-40"
                        >
                            এখন এড়িয়ে যান
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onContinue}
                        disabled={!canContinue || isSubmitting}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0f766e] px-6 font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-white shadow-[0_8px_22px_rgba(15,118,110,0.14)] transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:bg-[#a9c6c2] disabled:shadow-none sm:w-auto sm:min-w-[150px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                অপেক্ষা করুন
                            </>
                        ) : final ? (
                            <>
                                নিবন্ধন সম্পন্ন করুন
                                <ArrowRight className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                পরবর্তী ধাপ
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   SUCCESS
============================================================================ */

const RegisterSuccess = ({ accountType, onSignIn }) => {
    const isOrganization = accountType === 'organization';

    return (
        <div className="mx-auto flex min-h-[calc(100vh-150px)] max-w-[920px] items-center justify-center py-8 sm:py-12">
            <div
                className="
                    relative
                    w-full
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-[#d8e3e0]
                    bg-white
                    shadow-[0_26px_80px_rgba(15,23,42,0.065)]
                "
            >
                {/* =========================================================
                    SUCCESS HERO
                ========================================================== */}

                <div
                    className="
                        relative
                        grid
                        gap-8
                        px-6
                        pb-9
                        pt-9

                        sm:px-10
                        sm:pb-10
                        sm:pt-10

                        md:grid-cols-[minmax(0,1fr)_170px]
                        md:items-center
                        md:gap-10

                        lg:px-12
                        lg:pb-11
                        lg:pt-11
                    "
                >
                    {/* LEFT CONTENT */}

                    <div className="relative z-10">
                        {/* STATUS */}

                        <div className="flex items-center gap-3">
                            <span
                                className="
                                    h-[2px]
                                    w-9
                                    rounded-full
                                    bg-[#f59e0b]
                                "
                            />

                            <span
                                className="
                                    font-['Noto_Sans_Bengali']
                                    text-[14px]
                                    font-semibold
                                    text-[#0f766e]
                                "
                            >
                                নিবন্ধন সফল হয়েছে
                            </span>
                        </div>

                        {/* HEADING */}

                        <h1
                            className="
                                mt-5
                                max-w-[610px]

                                font-['Noto_Sans_Bengali']
                                text-[30px]
                                font-semibold
                                leading-[1.48]
                                tracking-[-0.025em]
                                text-[#102f2c]

                                sm:text-[34px]
                                lg:text-[36px]
                            "
                        >
                            {isOrganization
                                ? 'আপনার সংস্থার অ্যাকাউন্ট তৈরি হয়েছে'
                                : 'Stand For People-এ আপনার যাত্রা শুরু হলো'}
                        </h1>

                        {/* DESCRIPTION */}

                        <p
                            className="
                                mt-4
                                max-w-[620px]

                                font-['Noto_Sans_Bengali']
                                text-[15px]
                                leading-[1.9]
                                text-[#647672]
                            "
                        >
                            {isOrganization
                                ? 'আপনার তথ্য সফলভাবে জমা হয়েছে। ইমেইল যাচাইকরণের পর প্রশাসনিক পর্যালোচনা সম্পন্ন হলে আপনার সংস্থা কার্যক্রমে যুক্ত হতে পারবে।'
                                : 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। এখন সাইন ইন করে Stand For People-এর কার্যক্রমে যুক্ত হতে পারবেন।'}
                        </p>
                    </div>

                    {/* =====================================================
                        SUCCESS VISUAL
                    ====================================================== */}

                    <div
                        className="
                            relative
                            hidden
                            h-[150px]
                            items-center
                            justify-center

                            md:flex
                        "
                    >
                        {/* OUTER FRAME */}

                        <div
                            className="
                                absolute
                                h-[138px]
                                w-[138px]
                                rounded-full
                                border
                                border-[#d6e6e2]
                            "
                        />

                        <div
                            className="
                                absolute
                                h-[108px]
                                w-[108px]
                                rounded-full
                                border
                                border-[#c7ddd8]
                            "
                        />

                        {/* MAIN MARK */}

                        <div
                            className="
                                relative
                                flex
                                h-[78px]
                                w-[78px]
                                items-center
                                justify-center
                                rounded-full
                                bg-[#134e4a]
                                shadow-[0_14px_32px_rgba(19,78,74,0.18)]
                            "
                        >
                            <Check
                                className="
                                    h-8
                                    w-8
                                    text-white
                                "
                                strokeWidth={2.4}
                            />

                            <span
                                className="
                                    absolute
                                    -right-1
                                    -top-1
                                    h-3
                                    w-3
                                    rounded-full
                                    border-[3px]
                                    border-white
                                    bg-[#f59e0b]
                                "
                            />
                        </div>

                        {/* SMALL SIDE MARK */}

                        <span
                            className="
                                absolute
                                bottom-[17px]
                                left-[18px]
                                h-[7px]
                                w-[7px]
                                rounded-full
                                bg-[#0f766e]
                            "
                        />

                        <span
                            className="
                                absolute
                                right-[13px]
                                top-[21px]
                                h-[5px]
                                w-[5px]
                                rounded-full
                                bg-[#f59e0b]
                            "
                        />
                    </div>
                </div>

                {/* =========================================================
                    ACTION
                ========================================================== */}

                <div
                    className="
                        px-6
                        py-7

                        sm:px-10
                        sm:py-8

                        lg:px-12
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-5

                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        {/* TRUST COPY */}

                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                className="
                                    mt-[3px]
                                    h-[17px]
                                    w-[17px]
                                    shrink-0
                                    text-[#0f766e]
                                "
                                strokeWidth={1.9}
                            />

                            <div>
                                <p
                                    className="
                                        font-['Noto_Sans_Bengali']
                                        text-[14px]
                                        font-semibold
                                        leading-6
                                        text-[#405b56]
                                    "
                                >
                                    সবকিছু প্রস্তুত
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        font-['Noto_Sans_Bengali']
                                        text-[12.5px]
                                        leading-6
                                        text-[#7b8a87]
                                    "
                                >
                                    আপনার অ্যাকাউন্টের তথ্য নিরাপদে সংরক্ষণ করা
                                    হয়েছে।
                                </p>
                            </div>
                        </div>

                        {/* CTA */}

                        <button
                            type="button"
                            onClick={onSignIn}
                            className="
                                group

                                inline-flex
                                h-[52px]
                                w-full
                                shrink-0
                                items-center
                                justify-center
                                gap-3

                                rounded-[10px]
                                bg-[#0f766e]
                                px-8

                                font-['Noto_Sans_Bengali']
                                text-[14px]
                                font-semibold
                                text-white

                                shadow-[0_9px_24px_rgba(15,118,110,0.15)]

                                transition
                                duration-200

                                hover:bg-[#115e59]

                                sm:w-auto
                                sm:min-w-[190px]
                            "
                        >
                            সাইন ইন করুন
                            <ArrowRight
                                className="
                                    h-[17px]
                                    w-[17px]
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-1
                                "
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ==========================================================================
   REGISTER
============================================================================ */

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);

    const [submitError, setSubmitError] = useState('');

    const [stepErrors, setStepErrors] = useState({});

    const [formData, setFormData] = useState({
        credentials: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },

        individualProfile: {
            phone: '',
            district: '',
            address: '',
            dob: '',
            profilePhoto: null,
            profilePhotoPreview: null,
        },

        individualPreferences: {
            participationTypes: [],
            causes: [],
        },

        organizationProfile: {
            phone: '',
            organizationType: '',
            address: '',
            website: '',
            organizationLogo: null,
            organizationLogoPreview: null,
        },

        organizationDetails: {
            mission: '',
            focusAreas: [],
            communitiesServed: [],
            teamSize: '',
            primaryActivities: [],
        },
    });

    const TOTAL_STEPS = 4;

    /* ----------------------------------------------------------------------
       FORM CHANGE
    ---------------------------------------------------------------------- */

    const handleChange = useCallback((slice, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [slice]: {
                ...prev[slice],
                [key]: value,
            },
        }));

        setStepErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    /* ----------------------------------------------------------------------
       CONTINUE
    ---------------------------------------------------------------------- */

    const handleContinue = async () => {
        const errs = validateStep(step, accountType, formData);

        if (Object.keys(errs).length > 0) {
            setStepErrors(errs);
            return;
        }

        setStepErrors({});

        if (step < TOTAL_STEPS) {
            setStep((current) => current + 1);
            return;
        }

        await handleSubmit(false);
    };

    /* ----------------------------------------------------------------------
       SKIP
    ---------------------------------------------------------------------- */

    const handleSkip = async () => {
        setStepErrors({});
        await handleSubmit(true);
    };

    /* ----------------------------------------------------------------------
       SUBMIT
    ---------------------------------------------------------------------- */

    const handleSubmit = async (skipped) => {
        setIsSubmitting(true);
        setSubmitError('');

        const payload = {
            accountType,

            credentials: {
                name: formData.credentials.name,
                email: formData.credentials.email,
                password: formData.credentials.password,
                confirmPassword: formData.credentials.confirmPassword,
            },

            ...(accountType === 'individual'
                ? {
                      profile: formData.individualProfile,

                      preferences: skipped
                          ? null
                          : formData.individualPreferences,
                  }
                : {
                      profile: formData.organizationProfile,

                      details: formData.organizationDetails,
                  }),
        };

        try {
            await submitRegistration(payload);
            setIsSuccess(true);
        } catch (error) {
            console.error('নিবন্ধন সম্পন্ন করার সময় সমস্যা:', error);

            setSubmitError(
                error.message || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ----------------------------------------------------------------------
       BACK
    ---------------------------------------------------------------------- */

    const handleBack = () => {
        if (step > 1) {
            setStepErrors({});

            setStep((current) => current - 1);
        }
    };

    const canContinue = !isSubmitting && (step !== 1 || accountType !== null);

    const showSkip = step === 4 && accountType === 'individual';

    const identity = {
        name: formData.credentials.name,
        email: formData.credentials.email,
    };

    /* ----------------------------------------------------------------------
       RENDER
    ---------------------------------------------------------------------- */

    return (
        <main className="min-h-screen bg-[#f4f7f7]">
            {/* =================================================================
                HEADER
            ================================================================== */}

            <header className="relative z-30 border-b border-[#dde6e4] bg-white">
                <div className="mx-auto flex h-[78px] w-full max-w-[1240px] items-center px-4 sm:px-6 lg:px-8">
                    {/* BRAND */}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="group flex shrink-0 items-center gap-4 text-left"
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="h-20"
                        />
                    </button>

                    {/* PAGE CONTEXT */}
                    {!isSuccess && (
                        <div className="ml-9 hidden items-center lg:flex">
                            <span className="h-8 w-px bg-[#dfe7e5]" />

                            <div className="ml-7">
                                <p className="font-['Noto_Sans_Bengali'] text-[12px] font-medium text-[#85928f]">
                                    নতুন অ্যাকাউন্ট
                                </p>

                                <p className="mt-0.5 font-['Noto_Sans_Bengali'] text-[13px] font-semibold text-[#435854]">
                                    সদস্য নিবন্ধন
                                </p>
                            </div>
                        </div>
                    )}

                    {/* RIGHT */}
                    {!isSuccess && (
                        <div className="ml-auto flex items-center">
                            <div className="hidden items-center gap-2 md:flex">
                                <ShieldCheck
                                    className="h-[16px] w-[16px] text-[#76908b]"
                                    strokeWidth={1.7}
                                />

                                <span className="font-['Noto_Sans_Bengali'] text-[12px] font-medium text-[#778783]">
                                    নিরাপদ নিবন্ধন
                                </span>
                            </div>

                            <span className="mx-5 hidden h-5 w-px bg-[#dce5e3] md:block" />

                            <span className="mr-3 hidden font-['Noto_Sans_Bengali'] text-[13px] text-[#71807d] sm:block">
                                ইতোমধ্যে সদস্য?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/login?role=individual')
                                }
                                className="group/signin inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] border border-[#b8d0cc] bg-[#f8fbfa] px-4 font-['Noto_Sans_Bengali'] text-[13px] font-semibold text-[#0f766e] transition hover:border-[#0f766e] hover:bg-[#eaf4f2]"
                            >
                                <span className="hidden xs:inline">
                                    সাইন ইন করুন
                                </span>

                                <span className="xs:hidden">সাইন ইন</span>

                                <ArrowRight
                                    className="h-[15px] w-[15px] transition-transform group-hover/signin:translate-x-0.5"
                                    strokeWidth={1.8}
                                />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* =================================================================
                CONTENT
            ================================================================== */}

            <div className="mx-auto w-full max-w-[1240px] px-3 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
                {isSuccess ? (
                    <RegisterSuccess
                        accountType={accountType}
                        onSignIn={() => navigate('/login?role=individual')}
                    />
                ) : (
                    <>
                        {/* MOBILE PROGRESS */}
                        <ResponsiveProgress
                            currentStep={step}
                            accountType={accountType}
                        />

                        <div className="mt-4 grid items-start gap-6 lg:mt-0 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-8">
                            {/* DESKTOP PROGRESS */}
                            <DesktopProgress
                                currentStep={step}
                                accountType={accountType}
                                identity={identity}
                            />

                            {/* FORM CARD */}
                            <section className="min-w-0 overflow-hidden rounded-[18px] border border-[#e1e8e7] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.045)] sm:rounded-[22px]">
                                {/* CARD HEADER */}
                                <div className="border-b border-[#e7ecec] bg-[#fbfdfc] px-4 py-4 sm:px-7 lg:px-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f3f1] font-['Noto_Sans_Bengali'] text-[13px] font-bold text-[#0f766e]">
                                                {
                                                    getSteps(accountType)[
                                                        step - 1
                                                    ].number
                                                }
                                            </span>

                                            <span className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#3d5552]">
                                                {
                                                    getSteps(accountType)[
                                                        step - 1
                                                    ].title
                                                }
                                            </span>
                                        </div>

                                        <span className="hidden font-['Noto_Sans_Bengali'] text-[13px] text-[#82908f] sm:block">
                                            প্রয়োজনীয় তথ্য * চিহ্নিত
                                        </span>
                                    </div>
                                </div>

                                {/* FORM CONTENT */}
                                <div className="px-4 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-9 xl:px-10">
                                    {/* STEP 1 */}
                                    {step === 1 && (
                                        <StepAccountType
                                            accountType={accountType}
                                            onSelect={(type) => {
                                                setAccountType(type);
                                                setStepErrors({});
                                            }}
                                            error={stepErrors.accountType}
                                        />
                                    )}

                                    {/* STEP 2 */}
                                    {step === 2 && (
                                        <StepCredentials
                                            accountType={accountType}
                                            formData={formData.credentials}
                                            onChange={(key, value) =>
                                                handleChange(
                                                    'credentials',
                                                    key,
                                                    value,
                                                )
                                            }
                                            errors={stepErrors}
                                        />
                                    )}

                                    {/* STEP 3 — INDIVIDUAL */}
                                    {step === 3 &&
                                        accountType === 'individual' && (
                                            <StepIndividualProfile
                                                formData={
                                                    formData.individualProfile
                                                }
                                                onChange={(key, value) =>
                                                    handleChange(
                                                        'individualProfile',
                                                        key,
                                                        value,
                                                    )
                                                }
                                                errors={stepErrors}
                                            />
                                        )}

                                    {/* STEP 3 — ORGANIZATION */}
                                    {step === 3 &&
                                        accountType === 'organization' && (
                                            <StepOrganizationProfile
                                                formData={
                                                    formData.organizationProfile
                                                }
                                                onChange={(key, value) =>
                                                    handleChange(
                                                        'organizationProfile',
                                                        key,
                                                        value,
                                                    )
                                                }
                                                errors={stepErrors}
                                            />
                                        )}

                                    {/* STEP 4 — INDIVIDUAL */}
                                    {step === 4 &&
                                        accountType === 'individual' && (
                                            <StepIndividualPreferences
                                                formData={
                                                    formData.individualPreferences
                                                }
                                                onChange={(key, value) =>
                                                    handleChange(
                                                        'individualPreferences',
                                                        key,
                                                        value,
                                                    )
                                                }
                                            />
                                        )}

                                    {/* STEP 4 — ORGANIZATION */}
                                    {step === 4 &&
                                        accountType === 'organization' && (
                                            <StepOrganizationDetails
                                                formData={
                                                    formData.organizationDetails
                                                }
                                                onChange={(key, value) =>
                                                    handleChange(
                                                        'organizationDetails',
                                                        key,
                                                        value,
                                                    )
                                                }
                                                errors={stepErrors}
                                            />
                                        )}

                                    {/* SUBMIT ERROR */}
                                    {submitError && (
                                        <div
                                            role="alert"
                                            className="mt-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3"
                                        >
                                            <p className="font-['Noto_Sans_Bengali'] text-[13px] leading-6 text-red-700">
                                                {submitError}
                                            </p>
                                        </div>
                                    )}

                                    {/* NAVIGATION */}
                                    <RegisterNavigation
                                        currentStep={step}
                                        totalSteps={TOTAL_STEPS}
                                        onBack={handleBack}
                                        onContinue={handleContinue}
                                        onSkip={handleSkip}
                                        isSubmitting={isSubmitting}
                                        canContinue={canContinue}
                                        showSkip={showSkip}
                                    />

                                    {/* TERMS */}
                                    <p className="mt-6 font-['Noto_Sans_Bengali'] text-[12px] leading-6 text-[#84909d] sm:text-[13px]">
                                        নিবন্ধনের মাধ্যমে আপনি আমাদের{' '}
                                        <button
                                            type="button"
                                            onClick={() => navigate('/terms')}
                                            className="font-medium text-[#52646a] underline decoration-[#bdc8cc] underline-offset-4 transition hover:text-[#0f766e]"
                                        >
                                            ব্যবহারের শর্তাবলি
                                        </button>{' '}
                                        ও{' '}
                                        <button
                                            type="button"
                                            onClick={() => navigate('/privacy')}
                                            className="font-medium text-[#52646a] underline decoration-[#bdc8cc] underline-offset-4 transition hover:text-[#0f766e]"
                                        >
                                            গোপনীয়তা নীতি
                                        </button>
                                        -তে সম্মতি দিচ্ছেন।
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* MOBILE SIGN IN */}
                        <div className="mt-5 text-center sm:hidden">
                            <p className="font-['Noto_Sans_Bengali'] text-[14px] text-[#64748b]">
                                ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/login?role=individual')
                                    }
                                    className="font-semibold text-[#0f766e]"
                                >
                                    সাইন ইন করুন
                                </button>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default Register;
