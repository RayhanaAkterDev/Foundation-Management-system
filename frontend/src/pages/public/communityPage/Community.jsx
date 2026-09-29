import React, { useState } from 'react';

import {
    TbArrowDownRight,
    TbArrowUpRight,
    TbCheck,
    TbHeartHandshake,
    TbMessageCircle,
    TbQuote,
    TbSend,
    TbUsers,
} from 'react-icons/tb';

const experienceTypes = [
    'সহায়তা পেয়েছি',
    'স্বেচ্ছাসেবক হিসেবে যুক্ত ছিলাম',
    'অনুদান দিয়েছি',
    'সংগঠনের মাধ্যমে যুক্ত ছিলাম',
    'অন্যভাবে যুক্ত ছিলাম',
];

const Community = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        message: '',
        consent: false,
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        /*
         * Testimonial backend is not implemented yet.
         * Keep the form UI ready without pretending that
         * the submission has been stored.
         */
        setSubmitted(true);
    };

    return (
        <main className="overflow-hidden bg-background text-text-primary">
            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="relative mt-20 overflow-hidden bg-[#f4f1e9]">
                <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24 xl:px-16">
                    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-24">
                        <div>
                            <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold tracking-[0.17em] text-primary sm:text-[11px]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ed864a]" />
                                <span>OUR COMMUNITY</span>
                            </div>

                            <h1 className="max-w-[1000px] font-bengali text-[3rem] font-medium leading-[1.04] tracking-[-0.05em] sm:text-[4.2rem] lg:text-[5.4rem] xl:text-[6.1rem]">
                                মানুষের অংশগ্রহণেই
                                <br />
                                <span className="text-primary">
                                    তৈরি হয় কমিউনিটি।
                                </span>
                            </h1>

                            <p className="mt-8 max-w-[700px] font-bengali text-[15px] leading-[1.9] text-text-secondary sm:text-[17px]">
                                যারা সাহায্য করেন, সাহায্য পান, সময় দেন বা
                                কোনোভাবে Stand For People-এর সঙ্গে যুক্ত হন—
                                তাদের অভিজ্ঞতা ও অংশগ্রহণ আমাদের কমিউনিটির
                                গুরুত্বপূর্ণ অংশ।
                            </p>
                        </div>

                        <div className="hidden lg:block">
                            <div className="border-t border-black/10 pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] tracking-[0.15em] text-text-muted">
                                        SP / COMMUNITY
                                    </span>

                                    <span className="font-mono text-[10px] tracking-[0.12em] text-text-muted">
                                        2026
                                    </span>
                                </div>

                                <div className="relative mt-8 h-[190px]">
                                    <div className="absolute left-0 top-4 h-[145px] w-[145px] rounded-full border border-primary/15" />

                                    <div className="absolute left-[26px] top-[30px] flex h-[110px] w-[110px] items-center justify-center rounded-full bg-primary text-[#f8f7f2]">
                                        <TbUsers
                                            size={50}
                                            strokeWidth={1.1}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="absolute bottom-3 right-2 h-12 w-12 rounded-full bg-[#ed864a]/80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-1.5 w-24 bg-[#ed864a] sm:w-32" />
            </section>

            {/* =========================================================
                INTRO
            ========================================================= */}
            <section className="bg-background">
                <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
                    <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.16em] text-text-muted sm:text-[11px]">
                                <span>০১</span>
                                <span className="h-px w-8 bg-border" />
                                <span>কমিউনিটি</span>
                            </div>
                        </div>

                        <div className="max-w-[920px]">
                            <h2 className="font-bengali text-[2rem] font-medium leading-[1.24] tracking-[-0.035em] sm:text-[2.8rem] lg:text-[3.5rem]">
                                একটি প্ল্যাটফর্ম শুধু
                                <br />
                                <span className="text-primary">
                                    তার প্রযুক্তি দিয়ে তৈরি হয় না।
                                </span>
                            </h2>

                            <p className="mt-8 max-w-[760px] font-bengali text-[15px] leading-[1.9] text-text-secondary sm:text-[17px]">
                                মানুষের অংশগ্রহণ, পারস্পরিক সহযোগিতা এবং বাস্তব
                                অভিজ্ঞতাই একটি মানবিক কমিউনিটিকে তৈরি করে। তাই
                                এখানে আমরা শুধু কীভাবে SP কাজ করে তা নয়—মানুষের
                                অভিজ্ঞতাও তুলে ধরতে চাই।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                REVIEW / EXPERIENCE FORM
            ========================================================= */}
            <section className="border-y border-black/[0.07] bg-white">
                <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
                    <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.16em] text-text-muted sm:text-[11px]">
                                <span>০২</span>
                                <span className="h-px w-8 bg-border" />
                                <span>আপনার অভিজ্ঞতা</span>
                            </div>

                            <div className="mt-8 hidden lg:block">
                                <TbMessageCircle
                                    size={34}
                                    strokeWidth={1.15}
                                    className="text-primary"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="max-w-[850px]">
                                <h2 className="font-bengali text-[2rem] font-medium leading-[1.22] tracking-[-0.035em] sm:text-[2.8rem] lg:text-[3.5rem]">
                                    আপনার অভিজ্ঞতা
                                    <br />
                                    <span className="text-primary">
                                        আমাদের সঙ্গে শেয়ার করুন।
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-[700px] font-bengali text-[15px] leading-[1.9] text-text-secondary sm:text-[16px]">
                                    আপনি কীভাবে SP-এর সঙ্গে যুক্ত হয়েছেন, আপনার
                                    অভিজ্ঞতা কেমন ছিল, কিংবা এই প্ল্যাটফর্ম
                                    সম্পর্কে আপনার মতামত— আমাদের জানাতে পারেন।
                                </p>
                            </div>

                            <div className="mt-12 max-w-[850px] border-t border-black/10 pt-10">
                                {submitted ? (
                                    <div className="border border-primary/15 bg-[#f4f1e9] px-6 py-8 sm:px-8 sm:py-10">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                                            <TbCheck
                                                size={24}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <h3 className="mt-6 font-bengali text-[22px] font-semibold">
                                            ধন্যবাদ।
                                        </h3>

                                        <p className="mt-3 max-w-[600px] font-bengali text-[14px] leading-[1.85] text-text-secondary">
                                            আপনার অভিজ্ঞতা শেয়ার করার জন্য
                                            ধন্যবাদ। বর্তমানে testimonial
                                            submission system চালু করা হয়নি। তাই
                                            এই ফর্মটি এখনো কোনো তথ্য সংরক্ষণ
                                            করছে না।
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => setSubmitted(false)}
                                            className="mt-6 border-b border-primary pb-1 font-bengali text-[13px] font-semibold text-primary"
                                        >
                                            আবার লিখুন
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-8"
                                    >
                                        <div className="grid gap-8 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="font-bengali text-[13px] font-semibold text-text-primary"
                                                >
                                                    আপনার নাম
                                                </label>

                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="নাম লিখুন"
                                                    className="mt-3 w-full border-0 border-b border-black/15 bg-transparent px-0 py-3 font-bengali text-[14px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="type"
                                                    className="font-bengali text-[13px] font-semibold text-text-primary"
                                                >
                                                    আপনি কীভাবে যুক্ত ছিলেন?
                                                </label>

                                                <select
                                                    id="type"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                    className="mt-3 w-full border-0 border-b border-black/15 bg-transparent px-0 py-3 font-bengali text-[14px] text-text-primary outline-none transition-colors focus:border-primary"
                                                >
                                                    <option value="">
                                                        একটি নির্বাচন করুন
                                                    </option>

                                                    {experienceTypes.map(
                                                        (type) => (
                                                            <option
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {type}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="message"
                                                className="font-bengali text-[13px] font-semibold text-text-primary"
                                            >
                                                আপনার অভিজ্ঞতা
                                            </label>

                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="আপনার অভিজ্ঞতা বা মতামত লিখুন..."
                                                className="mt-3 w-full resize-none border border-black/10 bg-[#faf9f5] px-4 py-4 font-bengali text-[14px] leading-[1.8] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary"
                                            />
                                        </div>

                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                name="consent"
                                                checked={formData.consent}
                                                onChange={handleChange}
                                                className="mt-1 h-4 w-4 accent-[#0f6258]"
                                            />

                                            <span className="max-w-[700px] font-bengali text-[13px] leading-[1.75] text-text-secondary">
                                                আমি সম্মতি দিচ্ছি যে আমার
                                                অভিজ্ঞতা ভবিষ্যতে SP-এর
                                                Community/Testimonial section-এ
                                                প্রকাশ করা হতে পারে।
                                            </span>
                                        </label>

                                        <button
                                            type="submit"
                                            disabled={
                                                !formData.name.trim() ||
                                                !formData.type ||
                                                !formData.message.trim() ||
                                                !formData.consent
                                            }
                                            className="group inline-flex items-center gap-3 bg-primary px-6 py-3.5 font-bengali text-[13px] font-semibold text-white transition-colors hover:bg-[#083c36] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <span>অভিজ্ঞতা জমা দিন</span>

                                            <TbSend
                                                size={18}
                                                strokeWidth={1.7}
                                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <p className="max-w-[620px] font-bengali text-[11px] leading-[1.7] text-text-muted">
                                            প্রকাশের আগে অভিজ্ঞতাগুলো পর্যালোচনা
                                            করা হবে। বর্তমানে এটি একটি
                                            প্রস্তুতিমূলক ফর্ম UI; কোনো
                                            submission backend-এ সংরক্ষণ করা
                                            হচ্ছে না।
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                EXISTING TESTIMONIALS
            ========================================================= */}
            <section className="bg-[#164f49] text-[#f8f7f2]">
                <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
                    <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.16em] text-white/45 sm:text-[11px]">
                                <span>০৩</span>
                                <span className="h-px w-8 bg-white/20" />
                                <span>কমিউনিটির অভিজ্ঞতা</span>
                            </div>

                            <TbQuote
                                size={34}
                                strokeWidth={1.15}
                                className="mt-8 text-[#edb07f]"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h2 className="font-bengali text-[2rem] font-medium leading-[1.22] tracking-[-0.035em] sm:text-[2.8rem] lg:text-[3.5rem]">
                                        যারা আমাদের সঙ্গে
                                        <br />
                                        <span className="text-[#edb07f]">
                                            যুক্ত হয়েছেন।
                                        </span>
                                    </h2>

                                    <p className="mt-5 max-w-[650px] font-bengali text-[14px] leading-[1.85] text-white/55 sm:text-[16px]">
                                        কমিউনিটির মানুষের অভিজ্ঞতা এখানে তুলে
                                        ধরা হবে—তাদের অনুমতি ও পর্যালোচনার পর।
                                    </p>
                                </div>

                                <div className="font-mono text-[10px] tracking-[0.15em] text-white/35">
                                    TESTIMONIALS
                                </div>
                            </div>

                            <div className="mt-12 border-t border-white/10">
                                <div className="grid gap-8 py-10 sm:grid-cols-[80px_minmax(0,1fr)_180px] sm:items-start">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10">
                                        <TbHeartHandshake
                                            size={24}
                                            strokeWidth={1.2}
                                            className="text-[#edb07f]"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="font-bengali text-[16px] leading-[1.9] text-white/70 sm:text-[17px]">
                                            এখনো কোনো অনুমোদিত testimonial
                                            প্রকাশ করা হয়নি। ভবিষ্যতে community
                                            members-এর অনুমোদিত অভিজ্ঞতাগুলো
                                            এখানে প্রদর্শিত হবে।
                                        </p>

                                        <div className="mt-5">
                                            <span className="font-bengali text-[13px] font-medium text-white/45">
                                                Community testimonials
                                            </span>
                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <span className="font-mono text-[10px] tracking-[0.12em] text-white/30">
                                            00 / PUBLISHED
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center gap-3 text-[12px] text-white/40">
                                <TbArrowDownRight
                                    size={17}
                                    strokeWidth={1.4}
                                    aria-hidden="true"
                                />

                                <span className="font-bengali">
                                    আপনার অভিজ্ঞতাও শেয়ার করতে পারেন।
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                MODERATION / TRUST NOTE
            ========================================================= */}
            <section className="bg-[#f4f1e9]">
                <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 xl:px-16">
                    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.16em] text-text-muted sm:text-[11px]">
                                <span>০৪</span>
                                <span className="h-px w-8 bg-border" />
                                <span>প্রকাশের আগে</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                            <div className="max-w-[760px]">
                                <h2 className="font-bengali text-[1.8rem] font-medium leading-[1.3] tracking-[-0.025em] sm:text-[2.4rem] lg:text-[2.9rem]">
                                    প্রতিটি অভিজ্ঞতা প্রকাশের আগে
                                    <span className="text-primary">
                                        {' '}
                                        পর্যালোচনা করা হবে।
                                    </span>
                                </h2>

                                <p className="mt-5 max-w-[700px] font-bengali text-[14px] leading-[1.9] text-text-secondary sm:text-[15px]">
                                    Community section-এ প্রকাশিত testimonial হবে
                                    অনুমোদিত submission। এর মাধ্যমে ব্যক্তিগত
                                    মতামত এবং প্রকাশিত content-এর মধ্যে একটি
                                    দায়িত্বশীল review process রাখা যাবে।
                                </p>
                            </div>

                            <TbArrowUpRight
                                size={30}
                                strokeWidth={1.2}
                                className="shrink-0 text-primary"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Community;
