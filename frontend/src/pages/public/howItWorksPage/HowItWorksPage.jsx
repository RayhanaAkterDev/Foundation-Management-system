import React from 'react';

import { Link } from 'react-router-dom';
import {
    TbArrowDown,
    TbArrowRight,
    TbArrowUpRight,
    TbCheck,
    TbHeartHandshake,
    TbMapPin,
    TbRobot,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

import UnderstandingDiagram from './sections/processScene/diagrams/UnderstandingDiagram';
import TrustDiagram from './sections/processScene/diagrams/TrustDiagram';
import PriorityDiagram from './sections/processScene/diagrams/PriorityDiagram';
import NetworkDiagram from './sections/processScene/diagrams/NetworkDiagram/NetworkDiagram';

const pageWidth =
    'mx-auto w-full max-w-[1440px] px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 2xl:px-20';

const processSteps = [
    {
        number: '০১',
        short: 'প্রয়োজন বোঝা',
        title: 'মানুষ তার প্রয়োজন নিজের ভাষাতেই জানায়।',
        description:
            'সহায়তা প্রত্যাশী মানুষকে জটিল কোনো কাঠামোয় নিজের পরিস্থিতি ব্যাখ্যা করতে হয় না। স্বাভাবিক ভাষায় দেওয়া অনুরোধ থেকে AI প্রয়োজনের ধরন, অবস্থান এবং জরুরিতার মতো গুরুত্বপূর্ণ সংকেত শনাক্ত করে তথ্যকে পরবর্তী কাজের উপযোগী করে সাজায়।',
        bullets: [
            'স্বাভাবিক ভাষায় অনুরোধ গ্রহণ',
            'AI-এর মাধ্যমে প্রয়োজনের উদ্দেশ্য শনাক্তকরণ',
            'অবস্থান সম্পর্কিত তথ্য শনাক্তকরণ',
            'জরুরিতার সংকেত চিহ্নিতকরণ',
        ],
        icon: TbRobot,
        diagram: <UnderstandingDiagram />,
    },
    {
        number: '০২',
        short: 'যাচাই ও বিশ্বাস',
        title: 'শুধু তথ্য পাওয়া নয়, তার বিশ্বাসযোগ্যতাও গুরুত্বপূর্ণ।',
        description:
            'প্রতিটি অনুরোধ বিভিন্ন সিস্টেম যাচাইয়ের মধ্য দিয়ে যায়। AI-সহায়ক সংকেতের পাশাপাশি মানুষের পর্যালোচনা যুক্ত থাকে, যাতে একই অনুরোধের পুনরাবৃত্তি কমানো, পরিচয় যাচাই এবং সিদ্ধান্তের স্বচ্ছতা বজায় রাখা যায়।',
        bullets: [
            'AI-সহায়ক ডুপ্লিকেট শনাক্তকরণ',
            'পরিচয় যাচাই',
            'মানবিক পর্যালোচনা',
            'সিদ্ধান্তের স্বচ্ছতা',
        ],
        icon: TbShieldCheck,
        diagram: <TrustDiagram />,
    },
    {
        number: '০৩',
        short: 'অগ্রাধিকার',
        title: 'সব প্রয়োজন গুরুত্বপূর্ণ, কিন্তু সব প্রয়োজন সমান জরুরি নয়।',
        description:
            'AI জরুরিতা, সম্ভাব্য প্রভাব এবং পরিস্থিতির প্রাসঙ্গিক সংকেত বিশ্লেষণ করে কোন অনুরোধগুলো দ্রুত মনোযোগ প্রয়োজন তা নির্ধারণে সহায়তা করে। একই সঙ্গে উপলভ্য সম্পদও বিবেচনায় নেওয়া হয়।',
        bullets: [
            'AI-ভিত্তিক জরুরিতা মূল্যায়ন',
            'সম্ভাব্য প্রভাব বিশ্লেষণ',
            'উপলভ্য সম্পদ যাচাই',
            'ন্যায্য অগ্রাধিকার ব্যবস্থা',
        ],
        icon: TbArrowUpRight,
        diagram: <PriorityDiagram />,
    },
    {
        number: '০৪',
        short: 'সহায়তার সংযোগ',
        title: 'যাচাইকৃত প্রয়োজনকে উপযুক্ত মানুষের সঙ্গে যুক্ত করা হয়।',
        description:
            'সহায়তাকারী, স্বেচ্ছাসেবক এবং সহযোগী সংগঠনকে একটি সমন্বিত ব্যবস্থার মাধ্যমে প্রয়োজনের সঙ্গে যুক্ত করা হয়—যাতে সহায়তা শুধু প্রতিশ্রুতিতে আটকে না থেকে বাস্তব মানুষের কাছে পৌঁছাতে পারে।',
        bullets: [
            'প্রয়োজন অনুযায়ী স্মার্ট ম্যাচিং',
            'স্বেচ্ছাসেবক সমন্বয়',
            'সহায়তা পৌঁছানোর পথ নির্ধারণ',
            'ডেলিভারি অগ্রগতি অনুসরণ',
        ],
        icon: TbHeartHandshake,
        diagram: <NetworkDiagram />,
    },
];

const roles = [
    {
        number: '০১',
        title: 'সহায়তার অনুরোধকারী',
        eyebrow: 'Request Source',
        description:
            'বাস্তব প্রয়োজন বা জরুরি পরিস্থিতির ভিত্তিতে সহায়তার অনুরোধ জানায় এবং প্রয়োজনীয় তথ্য প্রদান করে।',
        icon: TbHeartHandshake,
    },
    {
        number: '০২',
        title: 'সহায়তাকারী',
        eyebrow: 'Resource Provider',
        description:
            'যাচাইকৃত ও অগ্রাধিকারপ্রাপ্ত প্রয়োজনের জন্য অর্থ, প্রয়োজনীয় উপকরণ বা অন্যান্য সম্পদ দিয়ে সহযোগিতা করে।',
        icon: TbUsers,
    },
    {
        number: '০৩',
        title: 'স্বেচ্ছাসেবক',
        eyebrow: 'Field Executor',
        description:
            'অবস্থান ও অগ্রাধিকারের ভিত্তিতে দায়িত্ব গ্রহণ করে মাঠপর্যায়ে সহায়তা পৌঁছে দিতে অংশ নেয়।',
        icon: TbMapPin,
    },
    {
        number: '০৪',
        title: 'প্ল্যাটফর্ম টিম',
        eyebrow: 'System Guardian',
        description:
            'যাচাই, বিশ্বাসযোগ্যতা, সমন্বয় এবং দায়িত্বশীল কার্যপ্রবাহ বজায় রাখতে কাজ করে।',
        icon: TbShieldCheck,
    },
];

const HowItWorksPage = () => {
    return (
        <main
            lang="bn"
            className="
                overflow-hidden
                bg-[#f7f6f1]
                font-bengali
                text-text-primary
            "
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="mt-20 bg-[#f7f6f1]">
                <div className={pageWidth}>
                    <div
                        className="
                            relative
                            border-b
                            border-black/10
                            pb-14
                            pt-14

                            sm:pb-18
                            sm:pt-18

                            lg:min-h-[650px]
                            lg:pb-20
                            lg:pt-20
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                                border-b
                                border-black/10
                                pb-4
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-[0.76rem]
                                    font-semibold
                                    text-primary
                                "
                            >
                                <span className="h-2 w-2 rounded-full bg-accent" />

                                <span>কীভাবে কাজ করে</span>
                            </div>

                            <span
                                className="
                                    hidden
                                    text-[0.72rem]
                                    text-text-muted

                                    sm:block
                                "
                            >
                                প্রয়োজন → যাচাই → অগ্রাধিকার → সহায়তা
                            </span>
                        </div>

                        <div
                            className="
                                grid
                                gap-12
                                pt-12

                                lg:grid-cols-[minmax(0,1fr)_340px]
                                lg:items-end
                                lg:gap-20
                                lg:pt-16
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[1rem]
                                        font-medium!
                                        text-primary
                                    "
                                >
                                    Stand For People-এর কার্যপ্রবাহ
                                </p>

                                <h1
                                    className="
                                        mt-5
                                        max-w-[920px]
                                        text-[2.65rem]
                                        font-medium!
                                        leading-[1.3]

                                        sm:text-[3.3rem]

                                        lg:text-[3.9rem]

                                        xl:text-[4.25rem]
                                    "
                                >
                                    জরুরি প্রয়োজনকে
                                    <span className="block text-primary">
                                        যাচাইকৃত সহায়তায় রূপ দেওয়া।
                                    </span>
                                </h1>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[1rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    মানুষ তার প্রয়োজন জানানো থেকে শুরু করে
                                    যাচাই, অগ্রাধিকার নির্ধারণ এবং বাস্তব সহায়তা
                                    পৌঁছানো পর্যন্ত—SP পুরো প্রক্রিয়াকে একটি
                                    স্বচ্ছ ও সমন্বিত ব্যবস্থায় যুক্ত করে।
                                </p>

                                <a
                                    href="#process"
                                    className="
                                        group
                                        mt-7
                                        inline-flex
                                        items-center
                                        gap-3
                                        text-[0.88rem]
                                        font-semibold
                                        text-primary
                                    "
                                >
                                    প্রক্রিয়াটি দেখুন
                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-primary/25
                                            transition-colors

                                            group-hover:bg-primary
                                            group-hover:text-white
                                        "
                                    >
                                        <TbArrowDown size={16} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div
                            className="
                                mt-14
                                grid
                                border-t
                                border-black/10

                                sm:grid-cols-2

                                lg:mt-20
                                lg:grid-cols-4
                            "
                        >
                            {processSteps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className={`
                                        flex
                                        min-h-[84px]
                                        items-center
                                        gap-4
                                        border-b
                                        border-black/10
                                        py-5

                                        sm:px-5

                                        lg:border-b-0
                                        lg:px-7

                                        ${
                                            index > 0
                                                ? 'lg:border-l lg:border-black/10'
                                                : ''
                                        }

                                        ${index === 0 ? 'sm:pl-0 lg:pl-0' : ''}
                                    `}
                                >
                                    <span
                                        className="
                                            text-[0.78rem]
                                            font-semibold
                                            text-primary
                                        "
                                    >
                                        {step.number}
                                    </span>

                                    <span
                                        className="
                                            text-[0.9rem]
                                            font-medium!
                                        "
                                    >
                                        {step.short}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                WHY IT EXISTS
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                grid
                                gap-14

                                lg:grid-cols-[0.72fr_1.28fr]
                                lg:gap-24
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[0.78rem]
                                        font-semibold
                                        text-primary
                                    "
                                >
                                    কেন এই ব্যবস্থা প্রয়োজন
                                </span>

                                <div
                                    className="
                                        mt-7
                                        h-px
                                        w-14
                                        bg-accent
                                    "
                                />
                            </div>

                            <div>
                                <h2
                                    className="
                                        max-w-[900px]
                                        text-[2rem]
                                        font-medium!
                                        leading-[1.5]

                                        sm:text-[2.65rem]

                                        lg:text-[3rem]
                                    "
                                >
                                    সাহায্য করার ইচ্ছা আছে।
                                    <span className="text-primary">
                                        {' '}
                                        প্রয়োজনও আছে।
                                    </span>
                                    <br />
                                    মাঝখানে ঘাটতি থাকে সঠিক তথ্য ও সমন্বয়ের।
                                </h2>

                                <div
                                    className="
                                        mt-10
                                        grid
                                        gap-7
                                        border-t
                                        border-black/10
                                        pt-8

                                        md:grid-cols-2
                                        md:gap-12
                                    "
                                >
                                    <p
                                        className="
                                            text-[1rem]
                                            leading-[1.95]
                                            text-text-secondary
                                        "
                                    >
                                        জরুরি পরিস্থিতিতে সহায়তা প্রয়োজন এমন
                                        মানুষ দ্রুত সঠিক সহায়তার কাছে পৌঁছাতে
                                        পারেন না। তথ্য বিভিন্ন জায়গায় ছড়িয়ে
                                        থাকে, যোগাযোগ বিচ্ছিন্ন থাকে এবং
                                        প্রয়োজনের প্রকৃত অবস্থা বোঝা কঠিন হয়ে
                                        পড়ে।
                                    </p>

                                    <p
                                        className="
                                            text-[1rem]
                                            leading-[1.95]
                                            text-text-secondary
                                        "
                                    >
                                        একই সময়ে সাহায্য করতে আগ্রহী মানুষ,
                                        স্বেচ্ছাসেবক ও সংগঠনও সবসময় বুঝতে পারে
                                        না কোথায় তাদের সময়, অর্থ বা সম্পদ সবচেয়ে
                                        বেশি প্রয়োজন। SP এই ব্যবধানটি কমানোর
                                        জন্য একটি সমন্বিত কাঠামো তৈরি করে।
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PROBLEM / ANSWER */}

                        <div
                            className="
                                mt-16
                                grid
                                border-y
                                border-black/10

                                md:grid-cols-3

                                lg:mt-24
                            "
                        >
                            <div
                                className="
                                    py-7

                                    md:pr-8

                                    lg:py-9
                                "
                            >
                                <span
                                    className="
                                        text-[0.75rem]
                                        font-semibold
                                        text-text-muted
                                    "
                                >
                                    সমস্যা
                                </span>

                                <p
                                    className="
                                        mt-3
                                        text-[1rem]
                                        font-medium!
                                        leading-[1.7]
                                    "
                                >
                                    প্রয়োজনের তথ্য ছড়িয়ে-ছিটিয়ে থাকে।
                                </p>
                            </div>

                            <div
                                className="
                                    border-t
                                    border-black/10
                                    py-7

                                    md:border-l
                                    md:border-t-0
                                    md:px-8

                                    lg:py-9
                                "
                            >
                                <span
                                    className="
                                        text-[0.75rem]
                                        font-semibold
                                        text-text-muted
                                    "
                                >
                                    ব্যবধান
                                </span>

                                <p
                                    className="
                                        mt-3
                                        text-[1rem]
                                        font-medium!
                                        leading-[1.7]
                                    "
                                >
                                    সহায়তাকারী ও প্রয়োজনের মধ্যে সমন্বয় কম।
                                </p>
                            </div>

                            <div
                                className="
                                    border-t
                                    border-black/10
                                    py-7

                                    md:border-l
                                    md:border-t-0
                                    md:pl-8

                                    lg:py-9
                                "
                            >
                                <span
                                    className="
                                        text-[0.75rem]
                                        font-semibold
                                        text-primary
                                    "
                                >
                                    SP-এর ভূমিকা
                                </span>

                                <p
                                    className="
                                        mt-3
                                        text-[1rem]
                                        font-medium!
                                        leading-[1.7]
                                        text-primary
                                    "
                                >
                                    যাচাই, অগ্রাধিকার ও সমন্বয়ের মাধ্যমে
                                    দুপক্ষকে যুক্ত করা।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PROCESS INTRO
            ====================================================== */}

            <section id="process" className="bg-primary">
                <div className={pageWidth}>
                    <div className="py-16 sm:py-20 lg:py-24">
                        <div
                            className="
                                grid
                                gap-10

                                lg:grid-cols-[0.95fr_1.05fr]
                                lg:items-end
                                lg:gap-20
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[0.78rem]
                                        font-semibold
                                        text-white/55
                                    "
                                >
                                    চারটি সংযুক্ত ধাপ
                                </span>

                                <h2
                                    className="
                                        mt-5
                                        max-w-[650px]
                                        text-[2.15rem]
                                        font-medium!
                                        leading-[1.45]
                                        text-white

                                        sm:text-[2.8rem]

                                        lg:text-[3.2rem]
                                    "
                                >
                                    একটি অনুরোধ কীভাবে
                                    <span className="block text-[#f1b17d]">
                                        বাস্তব সহায়তার দিকে এগোয়।
                                    </span>
                                </h2>
                            </div>

                            <p
                                className="
                                    max-w-[590px]
                                    text-[0.95rem]
                                    leading-[1.95]
                                    text-white/65

                                    lg:justify-self-end
                                "
                            >
                                প্রতিটি ধাপ আগের ধাপের তথ্যের ওপর দাঁড়িয়ে কাজ
                                করে। লক্ষ্য শুধু দ্রুত সিদ্ধান্ত নেওয়া
                                নয়—প্রয়োজনকে ভালোভাবে বোঝা, বিশ্বাসযোগ্যতা যাচাই
                                করা এবং ন্যায্যভাবে সহায়তা পৌঁছানো।
                            </p>
                        </div>

                        <div
                            className="
                                mt-12
                                flex
                                flex-wrap
                                gap-x-8
                                gap-y-4
                                border-t
                                border-white/15
                                pt-6

                                lg:mt-16
                            "
                        >
                            {processSteps.map((step) => (
                                <div
                                    key={step.number}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            text-[0.72rem]
                                            font-semibold
                                            text-[#f1b17d]
                                        "
                                    >
                                        {step.number}
                                    </span>

                                    <span
                                        className="
                                            text-[0.8rem]
                                            text-white/65
                                        "
                                    >
                                        {step.short}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                DETAILED PROCESS
            ====================================================== */}

            <section className="bg-[#f7f6f1]">
                {processSteps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                        <article
                            key={step.number}
                            className="
                                border-b
                                border-black/10
                            "
                        >
                            <div className={pageWidth}>
                                <div
                                    className="
                                        py-20

                                        sm:py-24

                                        lg:py-28

                                        xl:py-32
                                    "
                                >
                                    {/* STEP HEADER */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-5
                                            border-b
                                            border-black/10
                                            pb-5
                                        "
                                    >
                                        <span
                                            className="
                                                text-[1rem]
                                                font-semibold
                                                text-primary
                                            "
                                        >
                                            {step.number}
                                        </span>

                                        <span
                                            className="
                                                text-[0.8rem]
                                                font-medium!
                                                text-text-muted
                                            "
                                        >
                                            {step.short}
                                        </span>

                                        <span
                                            className="
                                                ml-auto
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-primary/20
                                                text-primary
                                            "
                                        >
                                            <Icon size={19} strokeWidth={1.3} />
                                        </span>
                                    </div>

                                    {/* STEP 1 / 3 */}

                                    {index % 2 === 0 ? (
                                        <div
                                            className="
                                                mt-10
                                                grid
                                                gap-12

                                                lg:grid-cols-[0.82fr_1.18fr]
                                                lg:items-center
                                                lg:gap-20

                                                xl:gap-28
                                            "
                                        >
                                            <div>
                                                <h3
                                                    className="
                                                        max-w-[570px]
                                                        text-[2rem]
                                                        font-medium!
                                                        leading-[1.5]

                                                        sm:text-[2.45rem]
                                                    "
                                                >
                                                    {step.title}
                                                </h3>

                                                <p
                                                    className="
                                                        mt-6
                                                        max-w-[570px]
                                                        text-[0.98rem]
                                                        leading-[1.95]
                                                        text-text-secondary
                                                    "
                                                >
                                                    {step.description}
                                                </p>

                                                <div
                                                    className="
                                                        mt-9
                                                        border-t
                                                        border-black/10
                                                    "
                                                >
                                                    {step.bullets.map(
                                                        (bullet) => (
                                                            <div
                                                                key={bullet}
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-4
                                                                    border-b
                                                                    border-black/[0.07]
                                                                    py-4
                                                                "
                                                            >
                                                                <TbCheck
                                                                    size={17}
                                                                    className="
                                                                        shrink-0
                                                                        text-primary
                                                                    "
                                                                />

                                                                <span
                                                                    className="
                                                                        text-[0.9rem]
                                                                        text-text-secondary
                                                                    "
                                                                >
                                                                    {bullet}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    relative
                                                    min-h-[430px]
                                                    border
                                                    border-black/10
                                                    bg-white
                                                    p-5

                                                    sm:min-h-[520px]
                                                    sm:p-8

                                                    lg:p-10
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        min-h-[390px]
                                                        w-full
                                                        items-center
                                                        justify-center

                                                        sm:min-h-[455px]
                                                    "
                                                >
                                                    {step.diagram}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* STEP 2 / 4 — intentionally different */

                                        <div
                                            className="
                                                mt-10
                                                grid
                                                gap-12

                                                lg:grid-cols-[1.16fr_0.84fr]
                                                lg:gap-20

                                                xl:gap-28
                                            "
                                        >
                                            <div
                                                className="
                                                    relative
                                                    min-h-[430px]
                                                    border
                                                    border-black/10
                                                    bg-white
                                                    p-5

                                                    sm:min-h-[520px]
                                                    sm:p-8

                                                    lg:p-10
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        min-h-[390px]
                                                        w-full
                                                        items-center
                                                        justify-center

                                                        sm:min-h-[455px]
                                                    "
                                                >
                                                    {step.diagram}
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    lg:flex
                                                    lg:flex-col
                                                    lg:justify-between
                                                    lg:py-5
                                                "
                                            >
                                                <div>
                                                    <h3
                                                        className="
                                                            max-w-[570px]
                                                            text-[2rem]
                                                            font-medium!
                                                            leading-[1.5]

                                                            sm:text-[2.45rem]
                                                        "
                                                    >
                                                        {step.title}
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-6
                                                            max-w-[560px]
                                                            text-[0.98rem]
                                                            leading-[1.95]
                                                            text-text-secondary
                                                        "
                                                    >
                                                        {step.description}
                                                    </p>
                                                </div>

                                                <div
                                                    className="
                                                        mt-9
                                                        border-t
                                                        border-black/10
                                                    "
                                                >
                                                    {step.bullets.map(
                                                        (bullet) => (
                                                            <div
                                                                key={bullet}
                                                                className="
                                                                    flex
                                                                    items-center
                                                                    gap-4
                                                                    border-b
                                                                    border-black/[0.07]
                                                                    py-4
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        h-1.5
                                                                        w-1.5
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-accent
                                                                    "
                                                                />

                                                                <span
                                                                    className="
                                                                        text-[0.9rem]
                                                                        text-text-secondary
                                                                    "
                                                                >
                                                                    {bullet}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>

            {/* =====================================================
                HUMAN + TECHNOLOGY STATEMENT
            ====================================================== */}

            <section className="bg-[#e9efeb]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-12
                            py-20

                            sm:py-24

                            lg:grid-cols-[0.55fr_1.45fr]
                            lg:gap-20
                            lg:py-28
                        "
                    >
                        <div>
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary
                                    text-white
                                "
                            >
                                <TbShieldCheck size={23} strokeWidth={1.25} />
                            </div>
                        </div>

                        <div>
                            <p
                                className="
                                    max-w-[930px]
                                    text-[1.7rem]
                                    font-medium!
                                    leading-[1.65]

                                    sm:text-[2.15rem]

                                    lg:text-[2.55rem]
                                "
                            >
                                প্রযুক্তি সিদ্ধান্তকে সহায়তা করতে পারে।
                                <span className="text-primary">
                                    {' '}
                                    কিন্তু মানুষের বাস্তব পরিস্থিতি বোঝা এবং
                                    দায়িত্বশীল পর্যালোচনার জায়গা মানুষেরই।
                                </span>
                            </p>

                            <p
                                className="
                                    mt-7
                                    max-w-[690px]
                                    text-[0.95rem]
                                    leading-[1.95]
                                    text-text-secondary
                                "
                            >
                                তাই SP-এর প্রক্রিয়ায় AI-সহায়ক বিশ্লেষণের
                                পাশাপাশি মানবিক যাচাই ও সমন্বয়ের ধাপও রাখা
                                হয়েছে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                ROLES
            ====================================================== */}

            <section className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
                                max-w-[850px]

                                lg:ml-[15%]
                            "
                        >
                            <span
                                className="
                                    text-[0.78rem]
                                    font-semibold
                                    text-primary
                                "
                            >
                                কারা এই ব্যবস্থার অংশ
                            </span>

                            <h2
                                className="
                                    mt-5
                                    text-[2rem]
                                    font-medium!
                                    leading-[1.5]

                                    sm:text-[2.65rem]

                                    lg:text-[3rem]
                                "
                            >
                                চারটি আলাদা ভূমিকা।
                                <span className="text-primary">
                                    {' '}
                                    একটি সমন্বিত মানবিক ব্যবস্থা।
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-6
                                    max-w-[650px]
                                    text-[0.95rem]
                                    leading-[1.9]
                                    text-text-secondary
                                "
                            >
                                বাস্তব প্রয়োজনকে যাচাইকৃত কার্যক্রমে রূপ দিতে
                                প্রত্যেক অংশগ্রহণকারীর নির্দিষ্ট ভূমিকা রয়েছে।
                            </p>
                        </div>

                        <div
                            className="
                                mt-14
                                border-t
                                border-black/10

                                lg:mt-20
                            "
                        >
                            {roles.map((role) => {
                                const Icon = role.icon;

                                return (
                                    <article
                                        key={role.number}
                                        className="
                                            group
                                            grid
                                            gap-6
                                            border-b
                                            border-black/10
                                            py-7

                                            sm:grid-cols-[52px_1fr]

                                            lg:grid-cols-[70px_240px_1fr_52px]
                                            lg:items-center
                                            lg:gap-8
                                            lg:py-9
                                        "
                                    >
                                        <span
                                            className="
                                                text-[0.78rem]
                                                font-semibold
                                                text-primary
                                            "
                                        >
                                            {role.number}
                                        </span>

                                        <div>
                                            <span
                                                className="
                                                    text-[0.7rem]
                                                    text-text-muted
                                                "
                                            >
                                                {role.eyebrow}
                                            </span>

                                            <h3
                                                className="
                                                    mt-1
                                                    text-[1.1rem]
                                                    font-semibold
                                                "
                                            >
                                                {role.title}
                                            </h3>
                                        </div>

                                        <p
                                            className="
                                                max-w-[650px]
                                                text-[0.9rem]
                                                leading-[1.85]
                                                text-text-secondary

                                                sm:col-start-2

                                                lg:col-start-auto
                                            "
                                        >
                                            {role.description}
                                        </p>

                                        <div
                                            className="
                                                hidden
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-primary/15
                                                text-primary
                                                transition-colors

                                                group-hover:bg-primary
                                                group-hover:text-white

                                                lg:flex
                                            "
                                        >
                                            <Icon
                                                size={19}
                                                strokeWidth={1.25}
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                FINAL CTA
            ====================================================== */}

            <section className="bg-[#173f3b]">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-28">
                        <div
                            className="
                                grid
                                gap-14

                                lg:grid-cols-[1.05fr_0.95fr]
                                lg:items-end
                                lg:gap-24
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[0.75rem]
                                        font-semibold
                                        text-[#efb17d]
                                    "
                                >
                                    এখন আপনার ভূমিকা
                                </span>

                                <h2
                                    className="
                                        mt-5
                                        max-w-[700px]
                                        text-[2.15rem]
                                        font-medium!
                                        leading-[1.45]
                                        text-white

                                        sm:text-[2.8rem]

                                        lg:text-[3.15rem]
                                    "
                                >
                                    বাস্তব প্রয়োজন আছে?
                                    <span className="block text-white/60">
                                        অথবা কারও পাশে দাঁড়াতে চান?
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-6
                                        max-w-[580px]
                                        text-[0.95rem]
                                        leading-[1.95]
                                        text-white/60
                                    "
                                >
                                    প্রয়োজন জানানো, স্বেচ্ছাসেবী হিসেবে যুক্ত
                                    হওয়া অথবা যাচাইকৃত প্রয়োজনকে সহায়তা
                                    করা—আপনার জন্য উপযুক্ত পথটি বেছে নিন।
                                </p>
                            </div>

                            <div className="border-t border-white/15 lg:border-t-0">
                                <Link
                                    to="/request-help"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-5
                                        text-white
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                block
                                                text-[0.72rem]
                                                text-white/40
                                            "
                                        >
                                            সহায়তা প্রয়োজন
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[1rem]
                                                font-medium!
                                            "
                                        >
                                            সহায়তার অনুরোধ করুন
                                        </span>
                                    </div>

                                    <TbArrowUpRight
                                        size={19}
                                        className="
                                            text-[#efb17d]
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>

                                <Link
                                    to="/volunteer"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-5
                                        text-white
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                block
                                                text-[0.72rem]
                                                text-white/40
                                            "
                                        >
                                            সময় ও দক্ষতা দিতে চান
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[1rem]
                                                font-medium!
                                            "
                                        >
                                            স্বেচ্ছাসেবী হিসেবে যুক্ত হোন
                                        </span>
                                    </div>

                                    <TbArrowUpRight
                                        size={19}
                                        className="
                                            text-[#efb17d]
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>

                                <Link
                                    to="/donate"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        py-5
                                        text-white
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                block
                                                text-[0.72rem]
                                                text-white/40
                                            "
                                        >
                                            সম্পদ দিয়ে পাশে দাঁড়াতে চান
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[1rem]
                                                font-medium!
                                            "
                                        >
                                            যাচাইকৃত প্রয়োজনে সহায়তা করুন
                                        </span>
                                    </div>

                                    <TbArrowRight
                                        size={19}
                                        className="
                                            text-[#efb17d]
                                            transition-transform

                                            group-hover:translate-x-1
                                        "
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;
