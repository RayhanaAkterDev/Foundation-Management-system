import React, { useState } from 'react';

import {
    TbArrowDown,
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
        title: 'প্রয়োজনের কথা জানান',
        description:
            'আপনার পরিস্থিতি ও কী ধরনের সহায়তা প্রয়োজন, তা নিজের ভাষায় লিখুন।',
    },
    {
        icon: TbSearch,
        number: '০২',
        title: 'তথ্য যাচাই করুন',
        description:
            'আপনার দেওয়া তথ্য সাজানো হবে। পাঠানোর আগে সবকিছু পর্যালোচনা ও সংশোধন করতে পারবেন।',
    },
    {
        icon: TbHeartHandshake,
        number: '০৩',
        title: 'সহায়তার পথে এগিয়ে যান',
        description:
            'আবেদন যাচাইয়ের পর প্রয়োজন অনুযায়ী সহায়তার সঙ্গে সংযোগ তৈরির প্রক্রিয়া শুরু হবে।',
    },
];

const RequestHelp = () => {
    const [success, setSuccess] = useState(false);

    return (
        <main className="min-h-screen bg-background pt-24 pb-20 sm:pt-28 sm:pb-28">
            {/* =========================================================
                PAGE INTRO
            ========================================================== */}

            <section className="container-width">
                <div className="relative border-b border-border pb-10 sm:pb-14 lg:pb-16">
                    {/* Eyebrow */}

                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-px w-8 bg-primary" />

                        <p className="font-bengali text-sm font-semibold tracking-wide text-primary">
                            সাহায্যের আবেদন
                        </p>
                    </div>

                    {/* Heading */}

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-12">
                        <div>
                            <h1
                                className="
                                    max-w-3xl
                                    font-bengali
                                    text-[2rem]
                                    font-semibold
                                    leading-[1.5]
                                    tracking-normal
                                    text-text-primary

                                    sm:text-[2.7rem]
                                    sm:leading-[1.4]

                                    lg:text-[3.25rem]
                                    lg:leading-[1.35]
                                "
                            >
                                আপনার প্রয়োজনের কথা জানান,
                                <span className="text-primary">
                                    {' '}
                                    আমরা পাশে আছি।
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    font-bengali
                                    text-[15px]
                                    leading-8
                                    text-text-muted

                                    sm:text-base
                                    sm:leading-9
                                "
                            >
                                জীবনের কঠিন সময়ে সহায়তা চাওয়া আপনার অধিকার।
                                আপনার পরিস্থিতি সম্পর্কে বিস্তারিত জানান, যাতে
                                প্রয়োজন অনুযায়ী সহায়তার ব্যবস্থা করা যায়। আবেদন
                                পাঠানোর আগে প্রতিটি তথ্য আপনি নিজেই যাচাই করতে
                                পারবেন।
                            </p>
                        </div>

                        {/* Privacy assurance */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                border-t
                                border-border
                                pt-5

                                lg:border-l
                                lg:border-t-0
                                lg:pl-6
                                lg:pt-0
                            "
                        >
                            <TbShieldCheck
                                size={21}
                                className="mt-0.5 shrink-0 text-primary"
                            />

                            <div>
                                <p className="font-bengali text-sm font-semibold text-text-primary">
                                    আপনার তথ্যের গোপনীয়তা
                                </p>

                                <p className="mt-1.5 font-bengali text-xs leading-6 text-text-muted">
                                    আপনার সম্মতি ছাড়া কোনো আবেদন জমা দেওয়া হবে
                                    না। পাঠানোর আগে সব তথ্য আপনার নিয়ন্ত্রণেই
                                    থাকবে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                APPLICATION PROCESS
            ========================================================== */}

            <section className="container-width pt-10 sm:pt-14">
                <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-bengali text-xs font-semibold uppercase tracking-wider text-primary">
                            কীভাবে কাজ করে
                        </p>

                        <h2 className="mt-2 font-bengali text-xl font-semibold leading-relaxed text-text-primary sm:text-2xl">
                            আবেদন থেকে সহায়তা — তিনটি ধাপ
                        </h2>
                    </div>

                    <p className="max-w-md font-bengali text-sm leading-7 text-text-muted">
                        পুরো প্রক্রিয়াটি সহজ ও স্বচ্ছ রাখার চেষ্টা করা হয়েছে,
                        যেন আপনি প্রতিটি ধাপ বুঝে এগিয়ে যেতে পারেন।
                    </p>
                </div>

                {/* Horizontal process */}

                <div className="grid border-y border-border sm:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className={`
                                    relative
                                    flex
                                    gap-4
                                    py-6
                                    sm:gap-5
                                    sm:px-5
                                    sm:py-7
                                    lg:px-7
                                    ${index === 0 ? 'sm:pl-0' : ''}
                                    ${index === 2 ? 'sm:pr-0' : ''}
                                    ${index !== 0 ? 'border-t border-border sm:border-l sm:border-t-0' : ''}
                                `}
                            >
                                {/* Step number */}

                                <div className="shrink-0">
                                    <span className="font-bengali text-2xl font-medium leading-none text-primary/35 sm:text-3xl">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Step content */}

                                <div className="min-w-0">
                                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/8 text-primary">
                                        <Icon size={17} strokeWidth={1.8} />
                                    </div>

                                    <h3 className="font-bengali text-base font-semibold leading-7 text-text-primary">
                                        {step.title}
                                    </h3>

                                    <p className="mt-2 max-w-sm font-bengali text-[13px] leading-6 text-text-muted">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* =========================================================
                FORM INTRODUCTION
            ========================================================== */}

            <section
                id="request-form"
                className="container-width scroll-mt-24 pt-12 sm:pt-16 lg:pt-20"
            >
                <div className="mb-7 flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />

                            <p className="font-bengali text-xs font-semibold text-primary">
                                আবেদনপত্র
                            </p>
                        </div>

                        <h2 className="font-bengali text-2xl font-semibold leading-relaxed text-text-primary sm:text-[1.8rem]">
                            আপনার প্রয়োজনটি বিস্তারিত লিখুন
                        </h2>

                        <p className="mt-2 max-w-xl font-bengali text-sm leading-7 text-text-muted">
                            যতটা সম্ভব নির্ভুল তথ্য দিন। এতে আপনার পরিস্থিতি
                            বুঝতে এবং আবেদনটি যথাযথভাবে পর্যালোচনা করতে সুবিধা
                            হবে।
                        </p>
                    </div>

                    <a
                        href="#request-form-fields"
                        className="
                            inline-flex
                            w-fit
                            shrink-0
                            items-center
                            gap-2
                            font-bengali
                            text-sm
                            font-semibold
                            text-primary
                            transition-colors
                            hover:text-primary-dark
                        "
                    >
                        আবেদন শুরু করুন
                        <TbArrowDown size={17} />
                    </a>
                </div>

                {/* Form surface */}

                <div
                    id="request-form-fields"
                    className="
                        relative
                        border
                        border-border
                        bg-surface
                        shadow-[0_8px_35px_rgba(15,23,42,0.035)]
                    "
                >
                    <RequestForm setSuccess={setSuccess} />
                </div>

                {/* Closing reassurance */}

                <div className="mt-6 flex items-start gap-3 sm:items-center">
                    <TbShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-primary sm:mt-0"
                    />

                    <p className="font-bengali text-xs leading-6 text-text-muted">
                        আপনার আবেদন জমা দেওয়ার আগে সব তথ্য পুনরায় যাচাই করার
                        সুযোগ থাকবে। কোনো তথ্য ভুল হলে তা সংশোধন করে তারপর
                        পাঠাতে পারবেন।
                    </p>
                </div>
            </section>

            {/* =========================================================
                SUCCESS
            ========================================================== */}

            {success && <RequestSuccessModal />}
        </main>
    );
};

export default RequestHelp;
