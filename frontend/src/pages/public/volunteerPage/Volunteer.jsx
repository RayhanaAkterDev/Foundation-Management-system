import { useEffect, useState } from 'react';

import {
    TbArrowRight,
    TbClockHour4,
    TbHeartHandshake,
    TbMapPin,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

import hero from '@/assets/volunteer/hero.png';
import { fetchPublicVolunteers } from '@/api/volunteerApi';
import VolunteerCommunityVisual from './components/VolunteerCommunityVisual';

import Button from '@/components/Button';

import VolunteerForm from './components/VolunteerForm';

/* =========================================================
   PAGE DATA
========================================================= */

const roles = [
    {
        number: '০১',
        eyebrow: 'সরাসরি মানুষের সঙ্গে',
        title: 'মাঠ পর্যায়ে স্বেচ্ছাসেবা',
        description:
            'খাদ্য, প্রয়োজনীয় সামগ্রী ও মানবিক সহায়তা মানুষের কাছে পৌঁছে দেওয়ার কাজে সরাসরি অংশ নিন।',
        meta: ['মাঠ পর্যায়ে কাজ', 'সময় অনুযায়ী অংশগ্রহণ'],
        image: 'https://images.unsplash.com/photo-1710093072228-8c3129f27357?auto=format&fit=crop&w=1400&q=85',
        position: 'center',
    },
    {
        number: '০২',
        eyebrow: 'যেখান থেকেই সম্ভব',
        title: 'দূরবর্তী সহায়তা',
        description:
            'তথ্য যাচাই, প্রয়োজনীয় যোগাযোগ এবং সহায়তার অনুরোধ সমন্বয়ের কাজে দূর থেকেই যুক্ত থাকুন।',
        meta: ['দূর থেকে কাজ', 'নমনীয় সময়'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85',
        position: 'center',
    },
    {
        number: '০৩',
        eyebrow: 'প্রয়োজনের গুরুত্বপূর্ণ সময়ে',
        title: 'জরুরি সাড়া',
        description:
            'দুর্যোগ বা জরুরি পরিস্থিতিতে দ্রুত সাড়া দেওয়া মানবিক কার্যক্রমে দায়িত্বশীলভাবে অংশ নিন।',
        meta: ['জরুরি কার্যক্রম', 'প্রয়োজনভিত্তিক অংশগ্রহণ'],
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85',
        position: 'center',
    },
];

const journey = [
    {
        number: '০১',
        title: 'আবেদন করুন',
        description:
            'আপনার নিবন্ধিত ব্যক্তিগত অ্যাকাউন্ট থেকে স্বেচ্ছাসেবক হওয়ার আবেদন পাঠান।',
    },
    {
        number: '০২',
        title: 'আবেদন পর্যালোচনা',
        description:
            'আমাদের দল আপনার আবেদন ও অ্যাকাউন্টের প্রয়োজনীয় তথ্য যাচাই করবে।',
    },
    {
        number: '০৩',
        title: 'উপযুক্ত কাজে যুক্ত হোন',
        description:
            'অনুমোদনের পর প্রয়োজন, স্থান ও সুযোগ অনুযায়ী স্বেচ্ছাসেবী কার্যক্রমে অংশ নিন।',
    },
    {
        number: '০৪',
        title: 'মানুষের পাশে থাকুন',
        description:
            'নিজের সময় ও সামর্থ্য অনুযায়ী মানুষের প্রয়োজনের মুহূর্তে বাস্তব সহায়তায় অংশ নিন।',
    },
];

const benefits = [
    {
        number: '০১',
        title: 'বাস্তব কাজের অভিজ্ঞতা',
        description:
            'মানুষ ও কমিউনিটির সঙ্গে কাজ করে মানবিক সহায়তার বাস্তব প্রক্রিয়া সম্পর্কে জানুন।',
    },
    {
        number: '০২',
        title: 'অবদানের স্বীকৃতি',
        description:
            'আপনার স্বেচ্ছাসেবী অবদানের জন্য স্বীকৃতি ও প্রাসঙ্গিক সনদ পাওয়ার সুযোগ থাকবে।',
    },
    {
        number: '০৩',
        title: 'দক্ষতা ও অভিজ্ঞতা',
        description:
            'সমন্বয়, নেতৃত্ব, যোগাযোগ এবং সমস্যা সমাধানের দক্ষতা আরও সমৃদ্ধ করুন।',
    },
    {
        number: '০৪',
        title: 'নিজের সময় অনুযায়ী',
        description: 'নিজের সময় ও সুযোগ অনুযায়ী মানবিক কার্যক্রমে অবদান রাখুন।',
    },
];

const faqs = [
    {
        question: 'স্বেচ্ছাসেবক হতে কি পূর্ব অভিজ্ঞতা প্রয়োজন?',
        answer: 'না। প্রয়োজনীয় নির্দেশনা ও সহায়তার মাধ্যমে নতুন স্বেচ্ছাসেবকদের কাজের সঙ্গে পরিচিত করা হবে।',
    },
    {
        question: 'কতটুকু সময় দিতে হবে?',
        answer: 'নির্দিষ্ট সময় সবার জন্য এক নয়। আপনার সময় ও সুযোগ অনুযায়ী উপযুক্ত কার্যক্রমে অংশ নিতে পারবেন।',
    },
    {
        question: 'স্বেচ্ছাসেবী কাজের জন্য কি অর্থ প্রদান করা হয়?',
        answer: 'না। এটি স্বেচ্ছাসেবী অংশগ্রহণ। এর মূল উদ্দেশ্য হলো নিজের সময় ও সামর্থ্য দিয়ে মানুষের পাশে দাঁড়ানো।',
    },
];

/* =========================================================
   PAGE
========================================================= */

const Volunteer = () => {
    const [focusForm, setFocusForm] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const [volunteers, setVolunteers] = useState([]);
    const [volunteersLoading, setVolunteersLoading] = useState(true);

    /* =====================================================
       LOAD PUBLIC VOLUNTEERS
    ====================================================== */

    useEffect(() => {
        let mounted = true;

        const loadVolunteers = async () => {
            try {
                const response = await fetchPublicVolunteers();

                if (!mounted) {
                    return;
                }

                setVolunteers(
                    Array.isArray(response?.volunteers)
                        ? response.volunteers
                        : [],
                );
            } catch (error) {
                console.error('Failed to load public volunteers:', error);

                if (mounted) {
                    setVolunteers([]);
                }
            } finally {
                if (mounted) {
                    setVolunteersLoading(false);
                }
            }
        };

        loadVolunteers();

        return () => {
            mounted = false;
        };
    }, []);

    /* =====================================================
       FORM SCROLL
    ====================================================== */

    const goToForm = () => {
        setFocusForm(true);

        setTimeout(() => {
            document.getElementById('volunteer-form')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 50);
    };

    return (
        <main
            lang="bn"
            className="
                overflow-hidden
                bg-surface
                font-bengali
            "
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <section
                className="
                    border-b
                    border-border
                    bg-surface
                    pt-20
                "
            >
                <div className="container-width">
                    <div
                        className="
                            grid
                            gap-9

                            py-10

                            sm:py-12

                            lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.72fr)]
                            lg:items-center
                            lg:gap-14
                            lg:py-16

                            xl:grid-cols-[minmax(0,1fr)_500px]
                            xl:gap-20
                            xl:py-20
                        "
                    >
                        {/* COPY */}

                        <div className="max-w-[760px]">
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <span className="h-px w-8 bg-primary" />

                                <p
                                    className="
                                        text-[12px]
                                        font-medium
                                        text-primary

                                        sm:text-[13px]
                                    "
                                >
                                    স্বেচ্ছাসেবক হিসেবে যুক্ত হোন
                                </p>
                            </div>

                            <h1
                                className="
                                    max-w-[720px]

                                    text-[2.15rem]
                                    font-medium
                                    leading-[1.42]
                                    tracking-normal
                                    text-text-primary

                                    sm:text-[2.75rem]
                                    sm:leading-[1.37]

                                    md:text-[3rem]

                                    lg:text-[3.3rem]
                                    lg:leading-[1.34]

                                    xl:text-[3.55rem]
                                "
                            >
                                আপনার সময় হতে পারে
                                <span
                                    className="
                                        block
                                        text-primary
                                    "
                                >
                                    কারও প্রয়োজনের সহায়তা।
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-[610px]

                                    text-[14px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[15px]
                                    sm:leading-8

                                    lg:mt-6
                                    lg:text-base
                                "
                            >
                                Stand For People-এর সঙ্গে যুক্ত হয়ে নিজের সময় ও
                                দক্ষতা দিয়ে মানুষের পাশে কাজ করুন।
                            </p>

                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-col
                                    gap-3

                                    min-[440px]:flex-row

                                    sm:mt-8
                                "
                            >
                                <Button
                                    size="lg"
                                    onClick={goToForm}
                                    className="
                                        w-full
                                        min-[440px]:w-auto
                                    "
                                >
                                    স্বেচ্ছাসেবক হতে আবেদন করুন
                                </Button>

                                <Button
                                    to="/how-it-works"
                                    variant="outline"
                                    size="lg"
                                    className="
                                        w-full
                                        min-[440px]:w-auto
                                    "
                                >
                                    কীভাবে কাজ করে
                                </Button>
                            </div>

                            <div
                                className="
                                    mt-7
                                    flex
                                    items-start
                                    gap-2.5

                                    sm:mt-8
                                "
                            >
                                <TbShieldCheck
                                    size={17}
                                    className="
                                        mt-1
                                        shrink-0
                                        text-primary
                                    "
                                />

                                <p
                                    className="
                                        max-w-md

                                        text-[11.5px]
                                        leading-6
                                        text-text-muted

                                        sm:text-[12.5px]
                                    "
                                >
                                    আবেদন পর্যালোচনার পর প্রয়োজন ও সুযোগ অনুযায়ী
                                    স্বেচ্ছাসেবী কাজে যুক্ত হওয়ার সুযোগ পাবেন।
                                </p>
                            </div>
                        </div>

                        {/* IMAGE */}

                        <div
                            className="
                                relative

                                lg:justify-self-end
                            "
                        >
                            <div
                                className="
        relative

        aspect-[4/3]
        overflow-hidden

        sm:aspect-[16/10]

        lg:aspect-[4/5]
        lg:max-h-[560px]

        xl:h-[560px]
        xl:w-[480px]
    "
                            >
                                {/* IMAGE */}
                                <img
                                    src={hero}
                                    alt="মানুষের কাছে সহায়তা পৌঁছে দিচ্ছেন স্বেচ্ছাসেবকেরা"
                                    className="
            h-full
            w-full
            object-cover
            object-center
        "
                                />

                                {/* FULL IMAGE OVERLAY */}
                                <div
                                    className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-black/65
            via-black/15
            to-transparent
        "
                                />

                                {/* BOTTOM CONTENT */}
                                <div
                                    className="
            absolute
            inset-x-0
            bottom-0

            px-5
            pb-5

            sm:px-6
            sm:pb-6
        "
                                >
                                    <div
                                        className="
                flex
                items-end
                justify-between
                gap-6
            "
                                    >
                                        <p
                                            className="
                    max-w-[290px]

                    text-[12px]
                    leading-6
                    text-white!

                    sm:text-[13px]
                "
                                        >
                                            মানুষের পাশে থাকা শুরু হয় উপস্থিতি ও
                                            দায়িত্ব নেওয়ার ইচ্ছা থেকে।
                                        </p>

                                        <TbHeartHandshake
                                            size={25}
                                            className="
                    shrink-0
                    text-white
                "
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                className="
                                    ml-auto

                                    flex
                                    w-[88%]
                                    items-center
                                    justify-between

                                    border-x
                                    border-b
                                    border-border

                                    bg-background-warm

                                    px-4
                                    py-3.5

                                    sm:px-5
                                "
                            >
                                <span
                                    className="
                                        text-[11px]
                                        text-text-muted

                                        sm:text-[12px]
                                    "
                                >
                                    সময় · দক্ষতা · দায়িত্ব
                                </span>

                                <span
                                    className="
                                        size-1.5
                                        rounded-full
                                        bg-accent
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ROLES
            ====================================================== */}

            <section
                className="
                    border-b
                    border-border
                    bg-background
                "
            >
                <div
                    className="
                        container-width

                        py-12
                        sm:py-16
                        lg:py-20
                        xl:py-24
                    "
                >
                    {/* HEADING */}

                    <div
                        className="
                            grid
                            gap-4

                            border-b
                            border-border

                            pb-7

                            md:grid-cols-[minmax(0,1fr)_340px]
                            md:items-end
                            md:gap-12

                            lg:pb-9
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[12px]
                                    font-medium
                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                অংশগ্রহণের ক্ষেত্র
                            </p>

                            <h2
                                className="
                                    mt-2
                                    max-w-[650px]

                                    text-[1.8rem]
                                    font-medium
                                    leading-[1.45]
                                    tracking-normal
                                    text-text-primary

                                    sm:text-[2.15rem]
                                    lg:text-[2.4rem]
                                "
                            >
                                যেভাবে মানুষের পাশে
                                <span className="text-primary">
                                    {' '}
                                    কাজ করতে পারেন
                                </span>
                            </h2>
                        </div>

                        <p
                            className="
                                max-w-sm

                                text-[13px]
                                leading-7
                                text-text-secondary

                                sm:text-[14px]

                                md:justify-self-end
                            "
                        >
                            আপনার সময়, অবস্থান ও সক্ষমতার সঙ্গে মানানসই কাজে অংশ
                            নিন।
                        </p>
                    </div>

                    {/* ROLE STORIES */}

                    <div>
                        {roles.map((role, index) => {
                            const reverse = index % 2 === 1;

                            return (
                                <article
                                    key={role.title}
                                    className="
                                        grid
                                        gap-6

                                        border-b
                                        border-border

                                        py-8

                                        sm:py-10

                                        lg:grid-cols-2
                                        lg:items-center
                                        lg:gap-14
                                        lg:py-14

                                        xl:gap-20
                                    "
                                >
                                    {/* IMAGE */}

                                    <div
                                        className={`
                                            relative

                                            ${reverse ? 'lg:order-2' : ''}
                                        `}
                                    >
                                        <div
                                            className="
                                                aspect-[16/10]
                                                overflow-hidden

                                                sm:aspect-[16/9]

                                                lg:aspect-[4/3]
                                            "
                                        >
                                            <img
                                                src={role.image}
                                                alt={role.title}
                                                loading="lazy"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover

                                                    transition-transform
                                                    duration-700

                                                    hover:scale-[1.025]
                                                "
                                                style={{
                                                    objectPosition:
                                                        role.position,
                                                }}
                                            />
                                        </div>

                                        <div
                                            className="
                                                absolute
                                                top-0
                                                left-0

                                                bg-primary

                                                px-3.5
                                                py-2

                                                text-[11px]
                                                font-medium
                                                text-white!

                                                sm:px-4
                                                sm:text-[12px]
                                            "
                                        >
                                            {role.number}
                                        </div>
                                    </div>

                                    {/* COPY */}

                                    <div
                                        className={`
                                            max-w-[560px]

                                            ${
                                                reverse
                                                    ? 'lg:justify-self-start'
                                                    : 'lg:justify-self-end'
                                            }
                                        `}
                                    >
                                        <p
                                            className="
                                                text-[11.5px]
                                                font-medium
                                                text-primary

                                                sm:text-[12.5px]
                                            "
                                        >
                                            {role.eyebrow}
                                        </p>

                                        <h3
                                            className="
                                                mt-2

                                                text-[1.55rem]
                                                font-medium
                                                leading-[1.45]
                                                text-text-primary

                                                sm:text-[1.8rem]
                                                lg:text-[2rem]
                                            "
                                        >
                                            {role.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-3

                                                text-[13px]
                                                leading-7
                                                text-text-secondary

                                                sm:text-[14px]
                                                sm:leading-8
                                            "
                                        >
                                            {role.description}
                                        </p>

                                        <div
                                            className="
                                                mt-5

                                                flex
                                                flex-wrap
                                                gap-x-6
                                                gap-y-2

                                                border-t
                                                border-border

                                                pt-4
                                            "
                                        >
                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2

                                                    text-[11.5px]
                                                    text-text-muted

                                                    sm:text-[12.5px]
                                                "
                                            >
                                                <TbMapPin
                                                    size={15}
                                                    className="text-primary"
                                                />

                                                {role.meta[0]}
                                            </span>

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2

                                                    text-[11.5px]
                                                    text-text-muted

                                                    sm:text-[12.5px]
                                                "
                                            >
                                                <TbClockHour4
                                                    size={15}
                                                    className="text-primary"
                                                />

                                                {role.meta[1]}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={goToForm}
                                            className="
                                                group

                                                mt-5

                                                inline-flex
                                                items-center
                                                gap-2

                                                text-[13px]
                                                font-medium
                                                text-primary

                                                transition-colors

                                                hover:text-primary-hover

                                                sm:text-[14px]
                                            "
                                        >
                                            এই কাজে যুক্ত হোন
                                            <TbArrowRight
                                                className="
                                                    transition-transform
                                                    duration-200

                                                    group-hover:translate-x-1
                                                "
                                            />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =====================================================
                JOURNEY
            ====================================================== */}

            <section className="bg-background-warm">
                <div
                    className="
                        container-width

                        py-12
                        sm:py-16
                        lg:py-20
                        xl:py-24
                    "
                >
                    <div
                        className="
                            grid
                            gap-9

                            lg:grid-cols-[300px_minmax(0,1fr)]
                            lg:gap-16

                            xl:grid-cols-[330px_minmax(0,1fr)]
                            xl:gap-24
                        "
                    >
                        {/* HEADING */}

                        <div>
                            <p
                                className="
                                    text-[12px]
                                    font-medium
                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                যুক্ত হওয়ার প্রক্রিয়া
                            </p>

                            <h2
                                className="
                                    mt-2

                                    text-[1.75rem]
                                    font-medium
                                    leading-[1.45]
                                    text-text-primary

                                    sm:text-[2.05rem]
                                    lg:text-[2.2rem]
                                "
                            >
                                আবেদন থেকে
                                <span
                                    className="
                                        block
                                        text-primary
                                    "
                                >
                                    সক্রিয় অংশগ্রহণ
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-3
                                    max-w-xs

                                    text-[13px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[14px]
                                "
                            >
                                কয়েকটি পরিষ্কার ধাপ পেরিয়ে স্বেচ্ছাসেবী কাজে
                                যুক্ত হোন।
                            </p>
                        </div>

                        {/* TIMELINE */}

                        <div
                            className="
                                relative

                                border-l
                                border-primary-muted

                                pl-6

                                sm:pl-8
                            "
                        >
                            {journey.map((step, index) => (
                                <div
                                    key={step.number}
                                    className={`
                                        relative

                                        ${
                                            index !== journey.length - 1
                                                ? 'pb-9 sm:pb-11'
                                                : ''
                                        }
                                    `}
                                >
                                    <span
                                        className="
                                            absolute
                                            top-1
                                            -left-[29px]

                                            size-3

                                            rounded-full

                                            border-[3px]
                                            border-background-warm

                                            bg-primary

                                            sm:-left-[37px]
                                        "
                                    />

                                    <div
                                        className="
                                            grid
                                            gap-2

                                            sm:grid-cols-[48px_190px_minmax(0,1fr)]
                                            sm:gap-5

                                            lg:grid-cols-[55px_210px_minmax(0,1fr)]
                                            lg:gap-7
                                        "
                                    >
                                        <span
                                            className="
                                                text-[11px]
                                                font-medium
                                                text-primary
                                            "
                                        >
                                            {step.number}
                                        </span>

                                        <h3
                                            className="
                                                text-[15px]
                                                font-medium
                                                leading-6
                                                text-text-primary

                                                sm:text-[16px]
                                            "
                                        >
                                            {step.title}
                                        </h3>

                                        <p
                                            className="
                                                max-w-lg

                                                text-[12.5px]
                                                leading-6
                                                text-text-secondary

                                                sm:text-[13px]
                                                sm:leading-7
                                            "
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                BENEFITS
            ====================================================== */}

            <section
                className="
                    border-y
                    border-border
                    bg-surface
                "
            >
                <div
                    className="
                        container-width

                        py-12
                        sm:py-16
                        lg:py-20
                        xl:py-24
                    "
                >
                    <div
                        className="
                            grid
                            gap-8

                            lg:grid-cols-[300px_minmax(0,1fr)]
                            lg:gap-16

                            xl:grid-cols-[330px_minmax(0,1fr)]
                            xl:gap-24
                        "
                    >
                        {/* HEADING */}

                        <div>
                            <p
                                className="
                                    text-[12px]
                                    font-medium
                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                আপনার অভিজ্ঞতা
                            </p>

                            <h2
                                className="
                                    mt-2

                                    text-[1.75rem]
                                    font-medium
                                    leading-[1.45]
                                    text-text-primary

                                    sm:text-[2.05rem]
                                "
                            >
                                পাশে থাকার সঙ্গে
                                <span className="block">
                                    নিজেরও শেখার সুযোগ
                                </span>
                            </h2>
                        </div>

                        {/* BENEFIT LIST */}

                        <div className="border-t border-border">
                            {benefits.map((benefit) => (
                                <article
                                    key={benefit.number}
                                    className="
                                        group

                                        grid
                                        gap-2

                                        border-b
                                        border-border

                                        py-5

                                        sm:grid-cols-[48px_210px_minmax(0,1fr)]
                                        sm:gap-5
                                        sm:py-6

                                        lg:grid-cols-[55px_230px_minmax(0,1fr)]
                                        lg:gap-7
                                    "
                                >
                                    <span
                                        className="
                                            text-[11px]
                                            font-medium
                                            text-text-muted

                                            transition-colors

                                            group-hover:text-primary
                                        "
                                    >
                                        {benefit.number}
                                    </span>

                                    <h3
                                        className="
                                            text-[15px]
                                            font-medium
                                            leading-6
                                            text-text-primary

                                            sm:text-[16px]
                                        "
                                    >
                                        {benefit.title}
                                    </h3>

                                    <p
                                        className="
                                            max-w-xl

                                            text-[12.5px]
                                            leading-6
                                            text-text-secondary

                                            sm:text-[13px]
                                            sm:leading-7
                                        "
                                    >
                                        {benefit.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ACTIVE VOLUNTEERS
            ====================================================== */}

            <section className="bg-background">
                <div
                    className="
                        container-width

                        py-12
                        sm:py-16
                        lg:py-20
                        xl:py-24
                    "
                >
                    <div
                        className="
                            grid
                            gap-9

                            lg:grid-cols-[300px_minmax(0,1fr)]
                            lg:gap-16

                            xl:grid-cols-[330px_minmax(0,1fr)]
                            xl:gap-24
                        "
                    >
                        {/* INTRO */}

                        <div>
                            <TbUsers size={27} className="text-primary" />

                            <p
                                className="
                                    mt-5

                                    text-[12px]
                                    font-medium
                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                স্বেচ্ছাসেবক কমিউনিটি
                            </p>

                            <h2
                                className="
                                    mt-2

                                    text-[1.75rem]
                                    font-medium
                                    leading-[1.45]
                                    text-text-primary

                                    sm:text-[2.05rem]
                                "
                            >
                                যারা ইতিমধ্যে
                                <span className="block">পাশে দাঁড়িয়েছেন</span>
                            </h2>

                            <p
                                className="
                                    mt-3
                                    max-w-xs

                                    text-[13px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[14px]
                                "
                            >
                                Stand For People-এর সঙ্গে যুক্ত সক্রিয়
                                স্বেচ্ছাসেবকদের একটি অংশ।
                            </p>
                        </div>

                        {/* DIRECTORY */}

                        <VolunteerCommunityVisual
                            volunteers={volunteers}
                            volunteersLoading={volunteersLoading}
                            onJoin={goToForm}
                        />
                    </div>
                </div>
            </section>

            {/* =====================================================
                CTA
            ====================================================== */}

            <section className="bg-background-dark">
                <div
                    className="
                        container-width

                        py-11
                        sm:py-14
                        lg:py-16
                    "
                >
                    <div
                        className="
                            grid
                            gap-7

                            lg:grid-cols-[minmax(0,1fr)_auto]
                            lg:items-center
                            lg:gap-14
                        "
                    >
                        <div className="max-w-[700px]">
                            <p
                                className="
                                    text-[12px]
                                    font-medium
                                    text-primary-muted

                                    sm:text-[13px]
                                "
                            >
                                আপনার সময়ও গুরুত্বপূর্ণ
                            </p>

                            <h2
                                className="
                                    mt-2

                                    text-[1.8rem]
                                    font-medium
                                    leading-[1.45]
                                    text-white!

                                    sm:text-[2.15rem]
                                "
                            >
                                মানুষের পাশে থাকার
                                <span className="block">যাত্রা শুরু করুন।</span>
                            </h2>

                            <p
                                className="
                                    mt-3
                                    max-w-xl

                                    text-[13px]
                                    leading-7
                                    text-white/60

                                    sm:text-[14px]
                                "
                            >
                                আপনার সময় ও সামর্থ্য অনুযায়ী মানবিক কাজে যুক্ত
                                হোন।
                            </p>
                        </div>

                        <Button
                            size="lg"
                            variant="accent"
                            onClick={goToForm}
                            className="
                                w-full

                                sm:w-fit
                                lg:shrink-0
                            "
                        >
                            স্বেচ্ছাসেবক হতে আবেদন করুন
                        </Button>
                    </div>
                </div>
            </section>

            {/* =====================================================
                EXISTING APPLICATION FORM
            ====================================================== */}

            <VolunteerForm focus={focusForm} />

            {/* =====================================================
                FAQ
            ====================================================== */}

            <section
                className="
                    border-t
                    border-border
                    bg-surface
                "
            >
                <div
                    className="
                        container-width

                        py-12
                        sm:py-16
                        lg:py-20
                        xl:py-24
                    "
                >
                    <div
                        className="
                            grid
                            gap-8

                            lg:grid-cols-[300px_minmax(0,1fr)]
                            lg:gap-16

                            xl:grid-cols-[330px_minmax(0,720px)]
                            xl:justify-between
                            xl:gap-24
                        "
                    >
                        {/* HEADING */}

                        <div>
                            <p
                                className="
                                    text-[12px]
                                    font-medium
                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                সাধারণ প্রশ্ন
                            </p>

                            <h2
                                className="
                                    mt-2

                                    text-[1.75rem]
                                    font-medium
                                    leading-[1.45]
                                    text-text-primary

                                    sm:text-[2.05rem]
                                "
                            >
                                যুক্ত হওয়ার আগে
                                <span className="block">যা জানতে পারেন</span>
                            </h2>

                            <p
                                className="
                                    mt-3
                                    max-w-xs

                                    text-[13px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[14px]
                                "
                            >
                                স্বেচ্ছাসেবী হিসেবে যুক্ত হওয়া নিয়ে সাধারণ কিছু
                                প্রশ্নের উত্তর।
                            </p>
                        </div>

                        {/* FAQ */}

                        <div className="border-t border-border">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;

                                return (
                                    <div
                                        key={faq.question}
                                        className="
                                            border-b
                                            border-border
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenFaq(
                                                    isOpen ? null : index,
                                                )
                                            }
                                            aria-expanded={isOpen}
                                            className="
                                                flex
                                                w-full
                                                items-start
                                                justify-between
                                                gap-6

                                                py-5

                                                text-left

                                                sm:py-6
                                            "
                                        >
                                            <span
                                                className="
                                                    text-[14px]
                                                    font-medium
                                                    leading-7
                                                    text-text-primary

                                                    sm:text-[15px]
                                                    lg:text-[16px]
                                                "
                                            >
                                                {faq.question}
                                            </span>

                                            <span
                                                className={`
                                                    mt-0.5

                                                    text-[20px]
                                                    font-light
                                                    leading-none
                                                    text-primary

                                                    transition-transform
                                                    duration-300

                                                    ${isOpen ? 'rotate-45' : ''}
                                                `}
                                                aria-hidden="true"
                                            >
                                                +
                                            </span>
                                        </button>

                                        <div
                                            className={`
                                                grid

                                                transition-all
                                                duration-300

                                                ${
                                                    isOpen
                                                        ? 'grid-rows-[1fr] opacity-100'
                                                        : 'grid-rows-[0fr] opacity-0'
                                                }
                                            `}
                                        >
                                            <div className="overflow-hidden">
                                                <p
                                                    className="
                                                        max-w-2xl

                                                        pb-5

                                                        text-[13px]
                                                        leading-7
                                                        text-text-secondary

                                                        sm:pb-6
                                                        sm:text-[14px]
                                                    "
                                                >
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Volunteer;
