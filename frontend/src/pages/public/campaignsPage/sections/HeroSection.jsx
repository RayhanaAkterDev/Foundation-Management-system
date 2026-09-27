import React from 'react';

import { HiArrowSmRight } from 'react-icons/hi';
import { FiArrowDown } from 'react-icons/fi';

import Button from '@/components/Button';

import campaignsHeroImage from '@/assets/campaigns/campaignsHeroImage.png';

const HeroSection = () => {
    const handleScroll = () => {
        document.getElementById('explore')?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    return (
        <div className="container-width section-gap mt-20">
            {/* LARGE EDITORIAL HEADING */}
            <div className="relative">
                {/* IMAGE AS PART OF THE EDITORIAL CANVAS */}
                <div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[410px] lg:h-[500px]">
                    <img
                        src={campaignsHeroImage}
                        alt="মানবিক সহায়তার উদ্যোগ"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6 sm:p-8 lg:p-10">
                        <p className="max-w-[570px] font-bengali text-[17px] font-medium leading-[1.7] text-white sm:text-[21px]">
                            একটি মানুষের প্রয়োজন থেকে একটি উদ্যোগের জন্ম হয়।
                            আর মানুষের পাশে দাঁড়ানো থেকেই শুরু হয় পরিবর্তন।
                        </p>
                    </div>
                </div>

                <p className="max-w-150 mt-16 font-bengali text-[14px] leading-[2.1] text-text-secondary sm:text-[15px]">
                    যাচাই করা মানবিক উদ্যোগগুলো খুঁজে দেখুন এবং আপনার সামর্থ্য
                    অনুযায়ী জরুরি প্রয়োজন, চিকিৎসা, শিক্ষা ও দীর্ঘমেয়াদি
                    পরিবর্তনের পাশে দাঁড়ান।
                </p>

                <div className="my-7 flex flex-wrap items-center gap-x-7 gap-y-4">
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
                                        gap-3
                                        font-bengali
                                        text-[13px]
                                        font-semibold
                                        text-text-primary
                                        transition-colors
                                        hover:text-primary
                                    "
                    >
                        <span>উদ্যোগগুলো দেখুন</span>

                        <FiArrowDown className="transition-transform duration-300 group-hover:translate-y-1" />
                    </button>
                </div>

                {/* BOTTOM EDITORIAL LINE */}
                <div className="mt-1 flex items-center justify-between border-t border-primary/15 pt-4">
                    <span className="font-bengali text-[11px] text-text-secondary">
                        মানুষের প্রয়োজন • সম্মিলিত সহায়তা • বাস্তব পরিবর্তন
                    </span>

                    <span className="h-px w-10 bg-accent sm:w-16" />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
