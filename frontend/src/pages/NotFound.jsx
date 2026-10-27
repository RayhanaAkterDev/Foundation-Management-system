import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    TbArrowLeft,
    TbArrowRight,
    TbArrowUpRight,
    TbHome,
    TbSearch,
    TbHeartHandshake,
    TbCategory,
} from 'react-icons/tb';

import logo from '@/assets/shared/logo.png';

const quickLinks = [
    {
        to: '/campaigns',
        title: 'চলমান উদ্যোগ',
        description: 'মানুষের পাশে দাঁড়ানোর সুযোগ',
        icon: TbHeartHandshake,
    },
    {
        to: '/categories',
        title: 'সহায়তার বিভাগ',
        description: 'প্রয়োজন অনুযায়ী উদ্যোগ খুঁজুন',
        icon: TbCategory,
    },
    {
        to: '/about',
        title: 'আমাদের সম্পর্কে',
        description: 'আমাদের লক্ষ্য ও কার্যক্রম জানুন',
        icon: TbHome,
    },
];

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <main
            lang="bn"
            className="flex min-h-[100dvh] flex-col bg-background font-bengali text-text-primary"
        >
            {/* Header */}
            <header className="border-b border-border/70">
                <div className="container-width flex min-h-[76px] items-center justify-between gap-4 py-3">
                    <Link
                        to="/"
                        aria-label="Stand For People — হোমপেজ"
                        className="inline-flex items-center"
                    >
                        <img
                            src={logo}
                            alt="Stand For People"
                            className="h-11 w-auto max-w-[125px] object-contain sm:h-12"
                        />
                    </Link>

                    <span className="flex items-center gap-2.5 text-[11px] font-medium text-text-secondary sm:text-[12px]">
                        <span className="h-1.5 w-1.5 bg-[#d49b48]" />
                        পৃষ্ঠা খুঁজে পাওয়া যায়নি
                    </span>
                </div>
            </header>

            {/* Main content */}
            <section className="container-width flex w-full flex-1 items-center py-12 sm:py-16 lg:py-20">
                <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-16 xl:gap-24">
                    {/* Left content */}
                    <div className="min-w-0">
                        <div className="mb-7 flex items-center gap-2.5">
                            <span className="h-px w-6 bg-[#d49b48]" />
                            <span className="text-[12px] font-semibold text-primary">
                                অনুরোধ করা পৃষ্ঠাটি পাওয়া যায়নি
                            </span>
                        </div>

                        {/* Error number */}
                        <div
                            className="mb-5 select-none font-sans text-[clamp(5.5rem,11vw,8rem)] font-bold leading-[0.95] tracking-[-0.075em] text-primary/20"
                            aria-label="ত্রুটি ৪০৪"
                        >
                            ৪০৪
                        </div>

                        <div className="mb-7 h-[2px] w-16 bg-[#d49b48]" />

                        <h1 className="max-w-[630px] text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.5] tracking-tight text-text-primary">
                            মনে হচ্ছে, আপনি
                            <span className="block">
                                ভুল ঠিকানায় পৌঁছেছেন।
                            </span>
                        </h1>

                        <p className="mt-4 max-w-[510px] text-[13px] leading-[1.95] text-text-secondary sm:text-[14px]">
                            আপনি যে পৃষ্ঠাটি খুঁজছেন, সেটি সরিয়ে ফেলা হয়ে
                            থাকতে পারে অথবা ঠিকানায় কোনো ভুল রয়েছে। নিচের
                            বিকল্পগুলো থেকে আপনার প্রয়োজনীয় তথ্য খুঁজে নিতে
                            পারেন।
                        </p>

                        {/* Main actions */}
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <Link
                                to="/"
                                className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 bg-primary px-5 py-3 text-[12px] font-semibold !text-white transition-colors hover:bg-primary-hover sm:text-[13px]"
                            >
                                <TbHome size={18} strokeWidth={1.7} />
                                হোমপেজে ফিরে যান
                                <TbArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="inline-flex min-h-[46px] items-center justify-center gap-2 border border-border px-5 py-3 text-[12px] font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary sm:text-[13px]"
                            >
                                <TbArrowLeft size={18} />
                                আগের পৃষ্ঠায় যান
                            </button>
                        </div>
                    </div>

                    {/* Right navigation */}
                    <aside
                        aria-label="বিকল্প পৃষ্ঠা"
                        className="min-w-0 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:py-4 lg:pl-10 xl:pl-12"
                    >
                        <div className="mb-6">
                            <div className="mb-3 flex items-center gap-2 text-primary">
                                <TbSearch size={18} strokeWidth={1.7} />
                                <span className="text-[11px] font-semibold">
                                    আপনার পরবর্তী গন্তব্য
                                </span>
                            </div>

                            <h2 className="text-[clamp(1.35rem,2vw,1.75rem)] font-semibold leading-[1.5] text-text-primary">
                                এখান থেকে শুরু করুন
                            </h2>

                            <p className="mt-2 text-[12px] leading-6 text-text-secondary">
                                প্রয়োজনীয় তথ্য ও উদ্যোগগুলো সহজেই খুঁজে নিন।
                            </p>
                        </div>

                        <nav className="border-t border-border">
                            {quickLinks.map(
                                ({ to, title, description, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className="group flex min-w-0 items-center gap-4 border-b border-border py-5 transition-colors hover:text-primary"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                                            <Icon size={21} strokeWidth={1.5} />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[14px] font-semibold text-text-primary transition-colors group-hover:text-primary">
                                                {title}
                                            </span>

                                            <span className="mt-1 block text-[12px] leading-5 text-text-secondary">
                                                {description}
                                            </span>
                                        </span>

                                        <TbArrowUpRight
                                            size={19}
                                            className="shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </Link>
                                ),
                            )}
                        </nav>

                        <p className="mt-6 border-l-2 border-[#d49b48] pl-4 text-[12px] leading-6 text-text-secondary">
                            সঠিক উদ্যোগ খুঁজে পেতে আমরা আপনার পাশে আছি।
                        </p>
                    </aside>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/70">
                <div className="container-width flex flex-col gap-2 py-5 text-[11px] text-text-secondary sm:flex-row sm:items-center sm:justify-between">
                    <span>মানুষের প্রয়োজনে, মানুষের পাশে।</span>
                    <span className="font-sans">Stand For People</span>
                </div>
            </footer>
        </main>
    );
};

export default NotFound;
