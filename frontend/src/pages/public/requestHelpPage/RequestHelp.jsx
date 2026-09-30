import React, { useState } from 'react';

import {
    TbArrowDown,
    TbArrowUpRight,
    TbClipboardCheck,
    TbHeartHandshake,
    TbSearch,
    TbShieldCheck,
} from 'react-icons/tb';

import RequestForm from './components/RequestForm';
import RequestSuccessModal from './components/RequestSuccessModal';

const steps = [
    {
        icon: TbClipboardCheck,
        number: '০১',
        title: 'প্রয়োজন জানান',
        description:
            'কী ধরনের সহায়তা প্রয়োজন এবং বর্তমান পরিস্থিতি সম্পর্কে প্রয়োজনীয় তথ্য দিন।',
    },
    {
        icon: TbSearch,
        number: '০২',
        title: 'তথ্য যাচাই করুন',
        description:
            'আবেদন পাঠানোর আগে আপনার দেওয়া তথ্য দেখে প্রয়োজন হলে সংশোধন করুন।',
    },
    {
        icon: TbHeartHandshake,
        number: '০৩',
        title: 'আবেদন পাঠান',
        description:
            'আবেদন পর্যালোচনার পর প্রাসঙ্গিক সহায়তার সঙ্গে সংযোগ তৈরির প্রক্রিয়া শুরু হবে।',
    },
];

const RequestHelp = () => {
    const [success, setSuccess] = useState(false);

    return (
        <main
            lang="bn"
            className="
                min-h-screen
                bg-background
                pt-20
                font-bengali
            "
        >
            {/* =========================================================
                HERO
            ========================================================== */}

            <section
                className="
                    border-b
                    border-border
                    bg-surface
                "
            >
                <div className="container-width">
                    <div
                        className="
                            grid
                            gap-8

                            py-12

                            sm:py-14
                            md:py-16

                            lg:grid-cols-[minmax(0,1fr)_300px]
                            lg:items-center
                            lg:gap-14
                            lg:py-[72px]

                            xl:grid-cols-[minmax(0,1fr)_330px]
                            xl:gap-20
                            xl:py-20
                        "
                    >
                        {/* Main copy */}

                        <div className="max-w-[820px]">
                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-3

                                    sm:mb-5
                                "
                            >
                                <span
                                    className="
                                        h-px
                                        w-8
                                        bg-primary

                                        sm:w-10
                                    "
                                />

                                <p
                                    className="
                                        text-[12px]
                                        font-medium
                                        text-primary

                                        sm:text-[13px]
                                    "
                                >
                                    সাহায্যের আবেদন
                                </p>
                            </div>

                            <h1
                                className="
                                    font-bengali
                                    text-[2.1rem]
                                    font-medium
                                    leading-[1.4]
                                    tracking-normal
                                    text-text-primary

                                    sm:text-[2.65rem]
                                    sm:leading-[1.38]

                                    md:text-[3rem]

                                    lg:text-[3.35rem]
                                    lg:leading-[1.34]

                                    xl:text-[3.6rem]
                                "
                            >
                                আপনার প্রয়োজনের কথা জানান।
                                <br className="hidden sm:block" />
                                <span className="text-primary">
                                    {' '}
                                    আমরা পাশে আছি।
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-[650px]

                                    text-[14px]
                                    leading-7
                                    text-text-secondary

                                    sm:mt-6
                                    sm:text-[15px]
                                    sm:leading-8

                                    lg:text-base
                                "
                            >
                                কী ধরনের সহায়তা প্রয়োজন এবং বর্তমান পরিস্থিতি
                                সম্পর্কে সংক্ষেপে জানান। প্রয়োজনীয় তথ্য দিয়ে
                                আবেদনটি পূরণ করুন।
                            </p>

                            <a
                                href="#request-form"
                                className="
                                    mt-7
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-2

                                    rounded-lg
                                    bg-primary
                                    px-5
                                    py-3

                                    text-[13px]
                                    font-medium
                                    text-white!

                                    transition-all
                                    duration-200

                                    hover:bg-primary-hover
                                    hover:-translate-y-0.5

                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-primary
                                    focus-visible:ring-offset-2

                                    sm:mt-8
                                    sm:px-5.5
                                    sm:py-3.5
                                    sm:text-[14px]
                                "
                            >
                                আবেদন শুরু করুন
                                <TbArrowDown size={17} strokeWidth={1.8} />
                            </a>
                        </div>

                        {/* Trust note */}

                        <div
                            className="
                                border-t
                                border-border
                                pt-5

                                sm:max-w-md

                                lg:border-l
                                lg:border-t-0
                                lg:pl-7
                                lg:pt-0

                                xl:pl-8
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
                                        size-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-primary-soft
                                        text-primary
                                    "
                                >
                                    <TbShieldCheck
                                        size={21}
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-[13px]
                                            font-medium
                                            text-text-primary

                                            sm:text-[14px]
                                        "
                                    >
                                        আপনার তথ্য আপনার নিয়ন্ত্রণে
                                    </p>

                                    <p
                                        className="
                                            mt-1.5

                                            text-[12px]
                                            leading-6
                                            text-text-secondary

                                            sm:text-[13px]
                                        "
                                    >
                                        আবেদন পাঠানোর আগে দেওয়া তথ্য পর্যালোচনা
                                        ও প্রয়োজন হলে সংশোধন করতে পারবেন।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                PROCESS
            ========================================================== */}

            <section
                className="
                    border-b
                    border-border
                    bg-background-warm
                "
            >
                <div
                    className="
                        container-width

                        py-10

                        sm:py-12
                        md:py-14

                        lg:py-16
                    "
                >
                    {/* Section heading */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-2.5

                            border-b
                            border-border
                            pb-6

                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                            sm:gap-8

                            sm:pb-7
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
                                কীভাবে করবেন
                            </p>

                            <h2
                                className="
                                    mt-1.5

                                    font-bengali
                                    text-[1.6rem]
                                    font-medium
                                    leading-[1.4]
                                    text-text-primary

                                    sm:text-[1.8rem]

                                    lg:text-[2rem]
                                "
                            >
                                আবেদন করার ধাপ
                            </h2>
                        </div>

                        <p
                            className="
                                max-w-[300px]

                                text-[12.5px]
                                leading-6
                                text-text-secondary

                                sm:text-right
                                sm:text-[13px]
                            "
                        >
                            তিনটি সহজ ধাপে আপনার আবেদন সম্পন্ন করুন।
                        </p>
                    </div>

                    {/* Steps */}

                    <div
                        className="
                            divide-y
                            divide-border

                            md:grid
                            md:grid-cols-3
                            md:divide-x
                            md:divide-y-0
                        "
                    >
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <article
                                    key={step.number}
                                    className={`
                                        relative
                                        py-6

                                        sm:py-7

                                        md:px-6
                                        md:py-8

                                        lg:px-7
                                        lg:py-9

                                        ${index === 0 ? 'md:pl-0' : ''}

                                        ${
                                            index === steps.length - 1
                                                ? 'md:pr-0'
                                                : ''
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                size-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-primary-soft
                                                text-primary

                                                sm:size-11
                                            "
                                        >
                                            <Icon size={20} strokeWidth={1.7} />
                                        </div>

                                        <span
                                            className="
                                                text-[1.7rem]
                                                font-medium
                                                leading-none
                                                text-primary/20

                                                sm:text-[1.9rem]
                                            "
                                        >
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3
                                        className="
                                            mt-5

                                            font-bengali
                                            text-[15px]
                                            font-medium
                                            leading-6
                                            text-text-primary

                                            sm:text-[16px]

                                            md:mt-6
                                        "
                                    >
                                        {step.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-1.5
                                            max-w-[300px]

                                            text-[12px]
                                            leading-6
                                            text-text-secondary

                                            sm:text-[13px]
                                        "
                                    >
                                        {step.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
                REQUEST FORM
            ========================================================== */}

            <section
                id="request-form"
                className="
                    scroll-mt-24
                    bg-background
                "
            >
                <div
                    className="
                        container-width

                        py-11

                        sm:py-14
                        md:py-16

                        lg:py-20
                    "
                >
                    {/* Form intro */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3

                            lg:flex-row
                            lg:items-end
                            lg:justify-between
                            lg:gap-10
                        "
                    >
                        <div className="max-w-[700px]">
                            <div
                                className="
                                    mb-3
                                    flex
                                    items-center
                                    gap-2.5
                                "
                            >
                                <span
                                    className="
                                        size-1.5
                                        rounded-full
                                        bg-accent
                                    "
                                />

                                <p
                                    className="
                                        text-[12px]
                                        font-medium
                                        text-primary

                                        sm:text-[13px]
                                    "
                                >
                                    আবেদনপত্র
                                </p>
                            </div>

                            <h2
                                className="
                                    font-bengali
                                    text-[1.7rem]
                                    font-medium
                                    leading-[1.42]
                                    text-text-primary

                                    sm:text-[2rem]

                                    lg:text-[2.25rem]
                                "
                            >
                                প্রয়োজনীয় তথ্য দিন
                            </h2>

                            <p
                                className="
                                    mt-2
                                    max-w-[620px]

                                    text-[13px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[14px]
                                "
                            >
                                সঠিক ও প্রয়োজনীয় তথ্য দিয়ে নিচের ফর্মটি পূরণ
                                করুন।
                            </p>
                        </div>

                        <p
                            className="
                                hidden
                                max-w-[300px]

                                text-[12px]
                                leading-6
                                text-text-muted

                                lg:block
                                lg:text-right
                            "
                        >
                            আবেদন পাঠানোর আগে আপনার দেওয়া তথ্য আবার যাচাই করার
                            সুযোগ থাকবে।
                        </p>
                    </div>

                    {/* Form */}

                    <div
                        className="
                            mt-7
                            overflow-hidden
                            rounded-xl
                            border
                            border-border
                            bg-surface
                            shadow-[0_10px_35px_rgba(15,23,42,0.035)]

                            sm:mt-8
                            sm:rounded-2xl

                            lg:mt-10
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                h-[3px]
                                w-full
                                bg-primary
                            "
                        />

                        <RequestForm setSuccess={setSuccess} />
                    </div>

                    {/* Bottom note */}

                    <div
                        className="
                            mt-5
                            flex
                            items-start
                            gap-2.5

                            sm:mt-6
                        "
                    >
                        <TbShieldCheck
                            size={17}
                            strokeWidth={1.7}
                            className="
                                mt-[3px]
                                shrink-0
                                text-primary
                            "
                        />

                        <p
                            className="
                                max-w-2xl

                                text-[11.5px]
                                leading-6
                                text-text-muted

                                sm:text-[12.5px]
                            "
                        >
                            আবেদন জমা দেওয়ার আগে তথ্যগুলো আরেকবার যাচাই করে নিন।
                            প্রয়োজন নেই এমন ব্যক্তিগত তথ্য দেওয়া এড়িয়ে চলুন।
                        </p>
                    </div>
                </div>
            </section>

            {/* =========================================================
                SUCCESS MODAL
            ========================================================== */}

            {success && <RequestSuccessModal />}
        </main>
    );
};

export default RequestHelp;
