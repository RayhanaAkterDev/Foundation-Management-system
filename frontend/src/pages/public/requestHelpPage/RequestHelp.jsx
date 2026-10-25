import React, { useState } from 'react';
import {
    TbCheck,
    TbClipboardText,
    TbHeartHandshake,
    TbLockCheck,
    TbSearch,
    TbShieldCheck,
} from 'react-icons/tb';

import RequestForm from './components/RequestForm';
import RequestSuccessModal from './components/RequestSuccessModal';

const pageWidth = 'mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10';

const steps = [
    {
        number: '০১',
        icon: TbClipboardText,
        title: 'প্রয়োজন জানান',
        description: 'আপনার পরিস্থিতি ও প্রয়োজন লিখুন।',
    },
    {
        number: '০২',
        icon: TbSearch,
        title: 'তথ্য যাচাই করুন',
        description: 'বিশ্লেষিত তথ্য দেখে সংশোধন করুন।',
    },
    {
        number: '০৩',
        icon: TbCheck,
        title: 'আবেদন পাঠান',
        description: 'সব তথ্য নিশ্চিত করে জমা দিন।',
    },
];

export default function RequestHelp() {
    const [success, setSuccess] = useState(false);

    return (
        <main
            lang="bn"
            className="min-h-screen bg-[#f7faf8] pt-20 font-bengali text-[#0f172a]"
        >
            <section className="relative overflow-hidden bg-white">
                <div className={pageWidth}>
                    <div className="grid gap-9 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_285px] lg:items-end lg:gap-16 lg:py-24">
                        <div className="min-w-0">
                            <div className="mb-6 flex items-center gap-3 text-[13px] font-semibold text-[#0f766e]">
                                <span className="h-px w-9 bg-[#0f766e]" />{' '}
                                সাহায্যের আবেদন
                            </div>
                            <h1 className="max-w-[820px] text-[2.15rem] font-semibold leading-[1.45] tracking-tight sm:text-[2.8rem] lg:text-[3.15rem]">
                                আপনার প্রয়োজনের কথা জানান।
                                <span className="block text-[#0f766e]">
                                    আমরা পাশে আছি।
                                </span>
                            </h1>
                            <p className="mt-7 max-w-[660px] text-[15px] leading-[2.05] text-[#64748b] sm:text-[16px]">
                                আপনার পরিস্থিতি ও প্রয়োজন নিজের ভাষায় জানান।
                                তথ্য বিশ্লেষণ ও পর্যালোচনার পর সহজেই সাহায্যের
                                আবেদন জমা দিতে পারবেন।
                            </p>
                        </div>
                        <div className="border-t border-[#dce8e2] pt-6 lg:border-l lg:border-t-0 lg:py-2 lg:pl-7">
                            <div className="flex items-start gap-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4f2] text-[#0f766e]">
                                    <TbShieldCheck
                                        size={24}
                                        strokeWidth={1.7}
                                    />
                                </span>
                                <div>
                                    <h2 className="text-[15px] font-semibold">
                                        নিরাপদ ও স্বচ্ছ আবেদন
                                    </h2>
                                    <p className="mt-2 text-[13px] leading-[1.95] text-[#64748b]">
                                        আবেদন পাঠানোর আগে তথ্য যাচাই ও
                                        প্রয়োজনমতো সংশোধন করার সুযোগ রয়েছে।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="request-form"
                className="scroll-mt-24 border-t border-[#e5ece8]"
            >
                <div className={`${pageWidth} py-14 sm:py-20 lg:py-24`}>
                    <div className="mb-11 max-w-[750px] sm:mb-14">
                        <div className="mb-5 flex items-center gap-2.5 text-[13px] font-semibold text-[#0f766e]">
                            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />{' '}
                            আবেদনপত্র
                        </div>
                        <h2 className="text-[2rem] font-semibold leading-[1.5] sm:text-[2.4rem]">
                            আপনার সাহায্যের আবেদন
                        </h2>
                        <p className="mt-4 text-[15px] leading-[2] text-[#64748b]">
                            আপনার প্রয়োজন সম্পর্কে জানান। আবেদন তৈরির প্রতিটি
                            ধাপে প্রয়োজনীয় নির্দেশনা পাবেন।
                        </p>
                    </div>

                    <div className="grid items-start gap-10 lg:grid-cols-[285px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[310px_minmax(0,1fr)] xl:gap-16">
                        <aside className="order-2 lg:order-1 lg:sticky lg:top-28">
                            <div className="border-t-[3px] border-[#0f766e] pt-7">
                                <p className="text-[13px] font-semibold text-[#0f766e]">
                                    আবেদনের প্রক্রিয়া
                                </p>
                                <h3 className="mt-3 text-[1.65rem] font-semibold leading-[1.5]">
                                    তিনটি সহজ ধাপ
                                </h3>
                                <p className="mt-3 text-[14px] leading-[1.95] text-[#64748b]">
                                    আপনার আবেদন সম্পন্ন করার প্রক্রিয়া।
                                </p>
                            </div>
                            <div className="relative mt-9 space-y-8 before:absolute before:bottom-6 before:left-[21px] before:top-5 before:w-px before:bg-[#d9e8e1]">
                                {steps.map((step) => {
                                    const Icon = step.icon;
                                    return (
                                        <div
                                            key={step.number}
                                            className="relative flex items-start gap-4"
                                        >
                                            <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d9e8e1] bg-white text-[#0f766e]">
                                                <Icon
                                                    size={21}
                                                    strokeWidth={1.7}
                                                />
                                            </span>
                                            <div className="min-w-0 pt-0.5">
                                                <span className="text-[12px] font-semibold text-[#0f766e]">
                                                    ধাপ {step.number}
                                                </span>
                                                <h4 className="mt-1 text-[15px] font-semibold">
                                                    {step.title}
                                                </h4>
                                                <p className="mt-2 text-[13px] leading-[1.9] text-[#64748b]">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-10 border-t border-[#dfe9e4] pt-7">
                                <div className="flex items-start gap-3">
                                    <TbHeartHandshake
                                        size={23}
                                        strokeWidth={1.6}
                                        className="mt-0.5 shrink-0 text-[#0f766e]"
                                    />
                                    <div>
                                        <p className="text-[14px] font-semibold">
                                            আমরা আপনার পাশে আছি
                                        </p>
                                        <p className="mt-2 text-[13px] leading-[1.95] text-[#64748b]">
                                            Stand For People প্রয়োজন ও সহায়তার
                                            মধ্যে সংযোগ তৈরিতে কাজ করে।
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className="order-1 min-w-0 lg:order-2">
                            <div className="overflow-hidden rounded-2xl border border-[#dce8e1] bg-white shadow-[0_14px_45px_rgba(15,55,45,0.045)]">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4ede8] px-6 py-6 sm:px-10 lg:px-12">
                                    <div className="flex items-center gap-3.5">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf4f2] text-[#0f766e]">
                                            <TbClipboardText
                                                size={22}
                                                strokeWidth={1.7}
                                            />
                                        </span>
                                        <h3 className="text-[17px] font-semibold">
                                            সাহায্যের আবেদনপত্র
                                        </h3>
                                    </div>
                                    <span className="inline-flex items-center gap-2 text-[12px] text-[#64748b]">
                                        <TbLockCheck
                                            size={17}
                                            className="text-[#0f766e]"
                                        />{' '}
                                        নিরাপদ আবেদন
                                    </span>
                                </div>
                                <RequestForm setSuccess={setSuccess} />
                            </div>
                            <div className="mt-6 flex items-start gap-3 px-1">
                                <TbShieldCheck
                                    size={20}
                                    className="mt-0.5 shrink-0 text-[#0f766e]"
                                />
                                <p className="text-[13px] leading-[1.95] text-[#64748b]">
                                    আবেদন পাঠানোর আগে সব তথ্য যাচাই করুন।
                                    প্রয়োজন ছাড়া সংবেদনশীল ব্যক্তিগত তথ্য শেয়ার
                                    করবেন না।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {success && <RequestSuccessModal />}
        </main>
    );
}
