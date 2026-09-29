import { useState } from 'react';

import {
    TbArrowRight,
    TbClockHour4,
    TbHeartHandshake,
    TbMapPin,
    TbQuote,
    TbShieldCheck,
} from 'react-icons/tb';

import Button from '@/components/Button';

import VolunteerForm from './components/VolunteerForm';

/* =========================================================
   PAGE DATA
========================================================= */

const roles = [
    {
        title: 'মাঠ পর্যায়ে স্বেচ্ছাসেবা',
        description:
            'খাদ্য, ওষুধ ও প্রয়োজনীয় সামগ্রী সরাসরি মানুষের কাছে পৌঁছে দিতে মাঠ পর্যায়ের কার্যক্রমে যুক্ত হোন।',
        meta: ['সরাসরি মাঠে কাজ', 'সময় অনুযায়ী অংশগ্রহণ'],
        image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=1600&auto=format&fit=crop',
    },
    {
        title: 'দূরবর্তী সহায়তা',
        description:
            'যেকোনো স্থান থেকে সাহায্যের অনুরোধ সমন্বয়, তথ্য যাচাই এবং প্রয়োজনীয় যোগাযোগে সহায়তা করুন।',
        meta: ['দূর থেকে কাজ', 'নমনীয় সময়'],
    },
    {
        title: 'জরুরি সাড়া',
        description:
            'বন্যা, অগ্নিকাণ্ড বা অন্য জরুরি পরিস্থিতিতে দ্রুত সাড়া দেওয়া দলের সঙ্গে কাজ করুন।',
        meta: ['জরুরি কার্যক্রম', 'অগ্রাধিকারভিত্তিক ভূমিকা'],
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
        title: 'বাস্তব মানবিক কাজের অভিজ্ঞতা',
        description:
            'মানুষ ও কমিউনিটির সঙ্গে সরাসরি কাজ করে মানবিক সহায়তার বাস্তব প্রক্রিয়া সম্পর্কে জানুন।',
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
            'সমন্বয়, নেতৃত্ব, যোগাযোগ, সহমর্মিতা এবং সমস্যা সমাধানের দক্ষতা আরও সমৃদ্ধ করুন।',
    },
    {
        number: '০৪',
        title: 'নিজের সময় অনুযায়ী অংশগ্রহণ',
        description:
            'চাপ ছাড়াই নিজের সময় ও সুযোগ অনুযায়ী মানবিক কার্যক্রমে অবদান রাখুন।',
    },
];

const stories = [
    {
        quote: 'শিক্ষার্থী হিসেবে স্বেচ্ছাসেবী কাজ শুরু করেছিলাম। এখন পর্যন্ত দুই শতাধিক পরিবারের কাছে সহায়তা পৌঁছে দেওয়ার কাজে যুক্ত হতে পেরেছি।',
        name: 'আয়েশা রহমান',
        role: 'শিক্ষার্থী স্বেচ্ছাসেবক',
    },
    {
        quote: 'সপ্তাহে মাত্র কয়েক ঘণ্টা সময় দিয়েও বুঝেছি, ছোট একটি অবদানও কারও প্রয়োজনের মুহূর্তে অনেক গুরুত্বপূর্ণ হতে পারে।',
        name: 'তানভীর হাসান',
        role: 'কমিউনিটি স্বেচ্ছাসেবক',
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
        <main className="overflow-hidden bg-surface">
            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="border-b border-border pt-28 sm:pt-32 lg:pt-36">
                <div className="container-width px-4 sm:px-6 lg:px-0">
                    <div className="grid gap-10 pb-14 lg:grid-cols-[1fr_0.82fr] lg:items-end lg:gap-20 lg:pb-20">
                        {/* Copy */}

                        <div className="max-w-3xl">
                            <p className="font-bengali text-sm font-semibold text-primary sm:text-base">
                                স্বেচ্ছাসেবক হিসেবে যুক্ত হোন
                            </p>

                            <h1 className="mt-4 max-w-3xl font-bengali text-[2.6rem] font-semibold leading-[1.25] text-text-primary sm:text-[3.4rem] lg:text-[4.1rem]">
                                মানুষের প্রয়োজনের মুহূর্তে
                                <span className="block">পাশে দাঁড়ান।</span>
                            </h1>

                            <p className="mt-6 max-w-2xl font-bengali text-base leading-8 text-text-muted sm:text-lg sm:leading-9">
                                আপনার সময়, দক্ষতা ও আন্তরিকতা মানুষের জীবনে
                                বাস্তব পরিবর্তন আনতে পারে। Stand For People-এর
                                সঙ্গে যুক্ত হয়ে প্রয়োজনের সময় মানুষের পাশে থাকার
                                কাজে অংশ নিন।
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto"
                                    onClick={goToForm}
                                >
                                    স্বেচ্ছাসেবক হতে আবেদন করুন
                                </Button>

                                <Button
                                    to="/how-it-works"
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    কীভাবে কাজ করে
                                </Button>
                            </div>
                        </div>

                        {/* Image */}

                        <div className="relative lg:translate-y-8">
                            <div className="aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
                                <img
                                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1400&auto=format&fit=crop"
                                    alt="মানুষের পাশে কাজ করছেন স্বেচ্ছাসেবকেরা"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="border-x border-b border-border px-5 py-4 sm:px-6">
                                <div className="flex items-center justify-between gap-5">
                                    <p className="font-bengali text-sm leading-6 text-text-muted">
                                        প্রতিটি অবদান একটি মানুষের প্রয়োজনের
                                        সঙ্গে যুক্ত।
                                    </p>

                                    <TbHeartHandshake className="shrink-0 text-2xl text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                INTRO STATEMENT
            ====================================================== */}

            <section className="bg-background">
                <div className="container-width px-4 py-14 sm:px-6 sm:py-16 lg:px-0 lg:py-20">
                    <div className="grid gap-7 lg:grid-cols-[240px_1fr] lg:gap-20">
                        <p className="font-bengali text-sm font-semibold text-primary">
                            কেন স্বেচ্ছাসেবক
                        </p>

                        <p className="max-w-4xl font-bengali text-2xl font-medium leading-[1.65] text-text-primary sm:text-3xl sm:leading-[1.6] lg:text-[2rem]">
                            সব সহায়তা অর্থ দিয়ে শুরু হয় না। কখনও একজন মানুষের
                            সময়, উপস্থিতি এবং দায়িত্ব নেওয়ার মানসিকতাই অন্য
                            একজন মানুষের কাছে সবচেয়ে গুরুত্বপূর্ণ সহায়তা হয়ে
                            ওঠে।
                        </p>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ROLES
            ====================================================== */}

            <section className="border-b border-border">
                <div className="container-width px-4 py-16 sm:px-6 sm:py-20 lg:px-0 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-20">
                        {/* Heading */}

                        <div>
                            <p className="font-bengali text-sm font-semibold text-primary">
                                অংশগ্রহণের ক্ষেত্র
                            </p>

                            <h2 className="mt-3 font-bengali text-3xl font-semibold leading-[1.35] text-text-primary sm:text-4xl">
                                যেভাবে আপনি
                                <span className="block">পাশে থাকতে পারেন</span>
                            </h2>

                            <p className="mt-4 max-w-sm font-bengali text-base leading-8 text-text-muted">
                                বিশেষ কোনো পরিচয়ের চেয়ে সাহায্য করার মানসিকতা
                                এবং দায়িত্বশীল অংশগ্রহণই এখানে বেশি
                                গুরুত্বপূর্ণ।
                            </p>
                        </div>

                        {/* Roles */}

                        <div>
                            {/* Main role */}

                            <article className="grid border-y border-border py-7 sm:grid-cols-[220px_1fr] sm:gap-8 lg:grid-cols-[260px_1fr]">
                                <div className="mb-6 aspect-[4/3] overflow-hidden sm:mb-0">
                                    <img
                                        src={roles[0].image}
                                        alt="মাঠ পর্যায়ে স্বেচ্ছাসেবী কার্যক্রম"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col justify-center">
                                    <p className="font-bengali text-xs font-semibold text-primary">
                                        সরাসরি মানুষের সঙ্গে
                                    </p>

                                    <h3 className="mt-2 font-bengali text-2xl font-semibold text-text-primary">
                                        {roles[0].title}
                                    </h3>

                                    <p className="mt-3 max-w-xl font-bengali text-sm leading-7 text-text-muted sm:text-base">
                                        {roles[0].description}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-bengali text-sm text-text-muted">
                                        <span className="inline-flex items-center gap-2">
                                            <TbMapPin className="text-primary" />
                                            {roles[0].meta[0]}
                                        </span>

                                        <span className="inline-flex items-center gap-2">
                                            <TbClockHour4 className="text-primary" />
                                            {roles[0].meta[1]}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={goToForm}
                                        className="mt-6 inline-flex w-fit items-center gap-2 font-bengali text-sm font-semibold text-primary transition hover:gap-3"
                                    >
                                        এই কাজে যুক্ত হোন
                                        <TbArrowRight />
                                    </button>
                                </div>
                            </article>

                            {/* Other roles */}

                            {roles.slice(1).map((role, index) => (
                                <article
                                    key={role.title}
                                    className="group grid gap-4 border-b border-border py-7 sm:grid-cols-[56px_1fr_auto] sm:items-start sm:gap-6"
                                >
                                    <span className="font-bengali text-sm text-text-muted">
                                        ০{index + 2}
                                    </span>

                                    <div>
                                        <h3 className="font-bengali text-xl font-semibold text-text-primary transition group-hover:text-primary sm:text-2xl">
                                            {role.title}
                                        </h3>

                                        <p className="mt-2 max-w-xl font-bengali text-sm leading-7 text-text-muted sm:text-base">
                                            {role.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-bengali text-xs text-text-muted">
                                            {role.meta.map((item) => (
                                                <span key={item}>{item}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={goToForm}
                                        aria-label={`${role.title} সম্পর্কে আবেদন করুন`}
                                        className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition hover:border-primary sm:flex"
                                    >
                                        <TbArrowRight />
                                    </button>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                JOURNEY
            ====================================================== */}

            <section className="bg-background">
                <div className="container-width px-4 py-16 sm:px-6 sm:py-20 lg:px-0 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-20">
                        <div>
                            <p className="font-bengali text-sm font-semibold text-primary">
                                যুক্ত হওয়ার প্রক্রিয়া
                            </p>

                            <h2 className="mt-3 font-bengali text-3xl font-semibold leading-[1.4] text-text-primary sm:text-4xl">
                                শুরু থেকে
                                <span className="block">মানুষের পাশে</span>
                            </h2>

                            <p className="mt-4 max-w-xs font-bengali text-base leading-8 text-text-muted">
                                আবেদন থেকে স্বেচ্ছাসেবী কাজে যুক্ত হওয়া পর্যন্ত
                                প্রক্রিয়াটি সহজ রাখা হয়েছে।
                            </p>
                        </div>

                        <div className="border-t border-border">
                            {journey.map((step) => (
                                <div
                                    key={step.number}
                                    className="group grid grid-cols-[44px_1fr] gap-4 border-b border-border py-6 sm:grid-cols-[70px_1fr] sm:gap-6 sm:py-7"
                                >
                                    <span className="font-bengali text-sm font-medium text-text-muted transition group-hover:text-primary">
                                        {step.number}
                                    </span>

                                    <div className="grid gap-2 sm:grid-cols-[220px_1fr] sm:gap-8">
                                        <h3 className="font-bengali text-lg font-semibold text-text-primary sm:text-xl">
                                            {step.title}
                                        </h3>

                                        <p className="max-w-xl font-bengali text-sm leading-7 text-text-muted sm:text-base">
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

            <section>
                <div className="container-width px-4 py-16 sm:px-6 sm:py-20 lg:px-0 lg:py-24">
                    <div className="max-w-2xl">
                        <p className="font-bengali text-sm font-semibold text-primary">
                            আপনার অভিজ্ঞতা
                        </p>

                        <h2 className="mt-3 font-bengali text-3xl font-semibold leading-[1.4] text-text-primary sm:text-4xl">
                            মানুষের পাশে থাকার সঙ্গে
                            <span className="block">নিজেরও শেখার সুযোগ</span>
                        </h2>
                    </div>

                    <div className="mt-10 border-t border-border sm:mt-12">
                        {benefits.map((benefit) => (
                            <article
                                key={benefit.number}
                                className="group grid gap-3 border-b border-border py-6 sm:grid-cols-[70px_260px_1fr] sm:gap-7 sm:py-7 lg:grid-cols-[90px_320px_1fr]"
                            >
                                <span className="font-bengali text-sm text-text-muted transition group-hover:text-primary">
                                    {benefit.number}
                                </span>

                                <h3 className="font-bengali text-lg font-semibold text-text-primary sm:text-xl">
                                    {benefit.title}
                                </h3>

                                <p className="max-w-2xl font-bengali text-sm leading-7 text-text-muted sm:text-base">
                                    {benefit.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* =====================================================
                STORIES
            ====================================================== */}

            <section className="bg-background">
                <div className="container-width px-4 py-16 sm:px-6 sm:py-20 lg:px-0 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-20">
                        <div>
                            <TbQuote className="text-3xl text-primary" />

                            <p className="mt-5 font-bengali text-sm font-semibold text-primary">
                                স্বেচ্ছাসেবকদের অভিজ্ঞতা
                            </p>

                            <h2 className="mt-2 font-bengali text-3xl font-semibold leading-[1.4] text-text-primary">
                                যারা ইতিমধ্যে
                                <span className="block">পাশে দাঁড়িয়েছেন</span>
                            </h2>
                        </div>

                        <div className="border-t border-border">
                            {stories.map((story, index) => (
                                <article
                                    key={story.name}
                                    className="grid gap-5 border-b border-border py-8 sm:grid-cols-[55px_1fr] sm:gap-7"
                                >
                                    <span className="font-bengali text-sm text-text-muted">
                                        ০{index + 1}
                                    </span>

                                    <div>
                                        <blockquote className="max-w-3xl font-bengali text-xl leading-[1.75] text-text-primary sm:text-2xl">
                                            “{story.quote}”
                                        </blockquote>

                                        <div className="mt-5 flex items-center gap-3">
                                            <span className="h-px w-7 bg-primary" />

                                            <div>
                                                <p className="font-bengali text-sm font-semibold text-text-primary">
                                                    {story.name}
                                                </p>

                                                <p className="mt-0.5 font-bengali text-xs text-text-muted">
                                                    {story.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CTA
            ====================================================== */}

            <section className="bg-primary">
                <div className="container-width px-4 py-14 sm:px-6 sm:py-16 lg:px-0">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="font-bengali text-sm font-semibold text-white/70">
                                আপনার সময়ও গুরুত্বপূর্ণ
                            </p>

                            <h2 className="mt-3 font-bengali text-3xl font-semibold leading-[1.45] text-white sm:text-4xl">
                                মানুষের পাশে দাঁড়ানোর
                                <span className="block">যাত্রা শুরু করুন</span>
                            </h2>

                            <p className="mt-4 max-w-xl font-bengali text-base leading-8 text-white/75">
                                আপনার একটি সিদ্ধান্তই প্রয়োজনের মুহূর্তে কারও
                                কাছে বাস্তব সহায়তা পৌঁছানোর অংশ হতে পারে।
                            </p>
                        </div>

                        <Button
                            size="lg"
                            variant="accent"
                            onClick={goToForm}
                            className="shrink-0"
                        >
                            স্বেচ্ছাসেবক হতে আবেদন করুন
                        </Button>
                    </div>
                </div>
            </section>

            {/* =====================================================
                EXISTING APPLICATION LOGIC
            ====================================================== */}

            <VolunteerForm focus={focusForm} />

            {/* =====================================================
                FAQ
            ====================================================== */}

            <section className="border-t border-border">
                <div className="container-width px-4 py-16 sm:px-6 sm:py-20 lg:px-0 lg:py-24">
                    <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-20">
                        <div>
                            <p className="font-bengali text-sm font-semibold text-primary">
                                সাধারণ প্রশ্ন
                            </p>

                            <h2 className="mt-3 font-bengali text-3xl font-semibold leading-[1.4] text-text-primary sm:text-4xl">
                                যুক্ত হওয়ার আগে
                                <span className="block">যা জানতে পারেন</span>
                            </h2>
                        </div>

                        <div className="border-t border-border">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;

                                return (
                                    <div
                                        key={faq.question}
                                        className="border-b border-border"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenFaq(
                                                    isOpen ? null : index,
                                                )
                                            }
                                            className="flex w-full items-start justify-between gap-6 py-6 text-left"
                                        >
                                            <span className="font-bengali text-base font-semibold leading-7 text-text-primary sm:text-lg">
                                                {faq.question}
                                            </span>

                                            <span
                                                className={`mt-1 text-xl leading-none text-primary transition-transform duration-300 ${
                                                    isOpen ? 'rotate-45' : ''
                                                }`}
                                            >
                                                +
                                            </span>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${
                                                isOpen
                                                    ? 'max-h-60 pb-6'
                                                    : 'max-h-0'
                                            }`}
                                        >
                                            <p className="max-w-2xl font-bengali text-sm leading-7 text-text-muted sm:text-base sm:leading-8">
                                                {faq.answer}
                                            </p>
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
