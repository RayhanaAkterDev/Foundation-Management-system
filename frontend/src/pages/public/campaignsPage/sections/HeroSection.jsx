import React from 'react';

import { HiArrowSmRight } from 'react-icons/hi';
import { FiArrowUp } from 'react-icons/fi';

import Button from '@/components/Button';

const HeroSection = () => {
    const handleScroll = () => {
        document.getElementById('explore')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <section className="container-width pb-12">
            {/* =====================================================
                NEWSPAPER-LIKE CLOSING LINE
            ====================================================== */}
            <div className="border-t border-text-primary/20 pt-4">
                <div className="flex items-center gap-4">
                    <span className="font-bengali text-[9px] text-text-muted">
                        প্রয়োজন
                    </span>

                    <HiArrowSmRight className="text-[11px] text-accent" />

                    <span className="font-bengali text-[9px] text-text-muted">
                        উদ্যোগ
                    </span>

                    <HiArrowSmRight className="text-[11px] text-accent" />

                    <span className="font-bengali text-[9px] font-semibold text-primary">
                        পরিবর্তন
                    </span>

                    <span className="h-px flex-1 bg-border" />

                    <span className="hidden font-serif text-[9px] italic text-text-muted sm:block">
                        From people, for people.
                    </span>
                </div>
            </div>



            {/* =====================================================
                MAIN STATEMENT
            ====================================================== */}
            <div className="mx-auto max-w-[900px] py-14 sm:py-16 lg:py-20">
                <span className="font-serif text-[18px] font-semibold italic text-text-primary/40">
                    একটি ছোট অংশগ্রহণ · একটি বড় পরিবর্তন
                </span>

                <h2
                    className="
                        mx-auto
                        mt-5
                        max-w-[780px]
                        font-bengali
                        text-[30px]
                        font-semibold
                        leading-[1.45]
                        tracking-[-0.035em]
                        text-text-primary

                        sm:text-[36px]
                        lg:text-[42px]
                    "
                >
                    মানুষের পাশে দাঁড়াতে
                    <br className="hidden sm:block" />
                    সবসময় অনেক কিছুর প্রয়োজন হয় না।
                </h2>

                {/* SMALL EDITORIAL MARK */}
                <div className="mx-auto mt-7 flex w-fit items-center gap-2">
                    <span className="h-[3px] w-[3px] rounded-full bg-accent" />
                    <span className="h-px w-14 bg-text-primary/20" />
                    <span className="h-[3px] w-[3px] rounded-full bg-accent" />
                </div>

                {/* PULL QUOTE */}
                <p
                    className="
                        mx-auto
                        mt-7
                        max-w-[560px]
                        font-bengali
                        text-[13px]
                        leading-[2]
                        text-text-secondary

                        sm:text-[14px]
                    "
                >
                    কখনো আপনার সময়, কখনো আপনার দক্ষতা, আবার কখনো সামান্য একটি
                    সহায়তাই কারও সামনে এগিয়ে যাওয়ার পথ তৈরি করতে পারে।
                </p>

                {/* =================================================
                    ACTIONS
                ================================================== */}
                <div
                    className="
                        mt-8
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-x-6
                        gap-y-4
                    "
                >
                    <Button size="lg" to="/volunteer" variant="accent">
                        স্বেচ্ছাসেবক হিসেবে যুক্ত হন
                        <HiArrowSmRight className="text-xl" />
                    </Button>

                    <button
                        type="button"
                        onClick={handleScroll}
                        className="
                            group
                            inline-flex
                            items-center
                            gap-2.5
                            font-bengali
                            text-[11px]
                            font-semibold
                            text-text-primary
                            transition-colors

                            hover:text-primary
                        "
                    >
                        <span>উদ্যোগগুলো আবার দেখুন</span>

                        <FiArrowUp
                            className="
                                text-[13px]
                                transition-transform
                                duration-300

                                group-hover:-translate-y-0.5
                            "
                        />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
