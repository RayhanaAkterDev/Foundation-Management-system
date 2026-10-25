import React from 'react';
import { Link } from 'react-router-dom';
import {
    TbArrowRight,
    TbArrowUpRight,
    TbHeartHandshake,
    TbArrowDown,
    TbCheck,
    TbShieldCheck,
    TbUsersGroup,
    TbNetwork,
} from 'react-icons/tb';

const heroImage =
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=85';

const fieldImage =
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85';

const container = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10';
const challenges = [
    {
        number: '০১',
        title: 'প্রয়োজনের তথ্য ছড়িয়ে থাকে',
        description:
            'কার কোথায় কী ধরনের সহায়তা প্রয়োজন, সেই তথ্য অনেক সময় বিভিন্ন ব্যক্তি, সংগঠন ও মাধ্যমে ছড়িয়ে থাকে। ফলে সঠিক সময়ে সঠিক তথ্য খুঁজে পাওয়া কঠিন হয়ে পড়ে।',
    },
    {
        number: '০২',
        title: 'অনেক উদ্যোগ সবার কাছে পৌঁছায় না',
        description:
            'অনেক ব্যক্তি ও সংগঠন মানুষের পাশে কাজ করলেও তাঁদের উদ্যোগ সম্পর্কে সম্ভাব্য স্বেচ্ছাসেবক ও সহায়তাকারীরা সবসময় জানতে পারেন না।',
    },
    {
        number: '০৩',
        title: 'অংশগ্রহণের পথ সবসময় স্পষ্ট নয়',
        description:
            'সহযোগিতার ইচ্ছা থাকলেও কোথায় সাহায্য সবচেয়ে বেশি প্রয়োজন কিংবা কীভাবে অংশ নেওয়া যায়, তা অনেকের কাছে পরিষ্কার থাকে না।',
    },
];

const actions = [
    {
        number: '০১',
        title: 'প্রয়োজন দেখুন',
        description:
            'কোথায়, কার এবং কী ধরনের সহায়তা প্রয়োজন, তা সম্পর্কে জানুন।',
    },
    {
        number: '০২',
        title: 'উদ্যোগ খুঁজুন',
        description:
            'মানুষের বাস্তব প্রয়োজনকে কেন্দ্র করে চলমান মানবিক উদ্যোগগুলো দেখুন।',
    },
    {
        number: '০৩',
        title: 'বিস্তারিত জানুন',
        description:
            'উদ্যোগের উদ্দেশ্য, সংশ্লিষ্ট সংগঠন ও সহায়তার প্রয়োজন সম্পর্কে ধারণা নিন।',
    },
    {
        number: '০৪',
        title: 'সহযোগিতায় যুক্ত হোন',
        description:
            'নিজের সময়, দক্ষতা কিংবা সামর্থ্য অনুযায়ী মানুষের পাশে দাঁড়ান।',
    },
];

const principles = [
    {
        number: '০১',
        icon: TbNetwork,
        title: 'সমন্বয়',
        description:
            'একই মানবিক প্রয়োজনকে ঘিরে কাজ করা মানুষ ও সংগঠন যেন পরস্পরের সঙ্গে যুক্ত হয়ে আরও কার্যকরভাবে সহযোগিতা করতে পারেন।',
    },
    {
        number: '০২',
        icon: TbShieldCheck,
        title: 'স্বচ্ছতা',
        description:
            'মানুষ যেন সহায়তার প্রয়োজন, উদ্যোগের উদ্দেশ্য ও অংশগ্রহণের সুযোগ সম্পর্কে পরিষ্কার তথ্য পান এবং সচেতনভাবে সিদ্ধান্ত নিতে পারেন।',
    },
    {
        number: '০৩',
        icon: TbUsersGroup,
        title: 'মানবিক মর্যাদা',
        description:
            'প্রতিটি উদ্যোগ ও সহায়তার অনুরোধের পেছনে একজন বাস্তব মানুষ আছেন। তাঁর সম্মান, নিরাপত্তা ও পরিস্থিতিকে সর্বোচ্চ গুরুত্ব দেওয়া।',
    },
];

function Eyebrow({ children, light = false }) {
    return (
        <div className="flex items-center gap-3">
            <span
                className={`h-[2px] w-7 shrink-0 ${
                    light ? 'bg-[#e6b47b]' : 'bg-[#d4a15e]'
                }`}
            />
            <span
                className={`text-[0.8rem] font-medium! tracking-[0.01em] ${
                    light ? 'text-[#e8c49d]' : 'text-primary'
                }`}
            >
                {children}
            </span>
        </div>
    );
}

const Mission = () => {
    return (
        <main
            lang="bn"
            className="min-w-0 overflow-x-clip bg-white font-bengali text-[#172b29]"
        >
            {/* STATEMENT-LED HERO */}
            <section className="mt-20 bg-[#f7f6f1]">
                <div className={container}>
                    <div className="relative pb-12 pt-14 sm:pb-14 sm:pt-17 lg:pb-16 lg:pt-20">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <Eyebrow>আমাদের লক্ষ্য</Eyebrow>

                            <span className="text-[0.78rem] font-medium! text-[#7b8980]">
                                Stand For People
                            </span>
                        </div>

                        <div className="mt-9 grid gap-7 lg:mt-11 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-12">
                            <h1 className="max-w-[880px] text-[clamp(2.15rem,4vw,3.85rem)] font-medium! leading-[1.36] tracking-[-0.02em]">
                                যে মানুষটির সহায়তা প্রয়োজন,
                                <span className="block text-primary">
                                    আর যিনি পাশে দাঁড়াতে চান—
                                </span>
                                তাঁদের দূরত্ব কমানোই আমাদের কাজ।
                            </h1>

                            <div className="max-w-[340px] lg:pb-3">
                                <p className="text-[0.96rem] leading-[1.95] text-[#596a62]">
                                    Stand For People এমন একটি মানবিক সহযোগিতার
                                    পরিবেশ গড়ে তুলতে চায়, যেখানে প্রয়োজন
                                    দৃশ্যমান হবে, উদ্যোগ সম্পর্কে জানা সহজ হবে
                                    এবং সবাই নিজের সামর্থ্য অনুযায়ী অংশ নিতে
                                    পারবেন।
                                </p>

                                <a
                                    href="#mission-challenge"
                                    className="mt-6 inline-flex items-center gap-2 text-[0.86rem] font-semibold! text-primary transition-colors hover:text-[#095f58]"
                                >
                                    আমাদের ভাবনা জানুন
                                    <TbArrowDown size={17} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IMMERSIVE DOCUMENTARY IMAGE */}
                <div className={container}>
                    <div className="relative h-[300px] overflow-hidden bg-[#dce6de] sm:h-[390px] md:h-[450px] lg:h-[500px] xl:h-[530px]">
                        <img
                            src={heroImage}
                            alt="মানবিক সহায়তার প্রয়োজন রয়েছে এমন মানুষের জীবন ও বাস্তবতা"
                            fetchPriority="high"
                            className="h-full w-full object-cover object-center"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-9">
                            <div className="max-w-[620px]">
                                <p className="text-[1.05rem] font-medium! leading-[1.8] text-white! sm:text-[1.2rem]">
                                    মানবিক সহায়তার শুরু হয় মানুষের বাস্তব
                                    প্রয়োজনকে দেখা ও বোঝার মাধ্যমে।
                                </p>
                            </div>

                            <span className="hidden text-[0.78rem] font-medium! text-white/80 sm:block">
                                মানুষের জন্য, মানুষের সঙ্গে
                            </span>
                        </div>
                    </div>
                </div>

                <div className={container}>
                    <div className="flex items-center justify-between gap-4 border-b border-[#dce3da] py-5">
                        <p className="text-[0.84rem] leading-[1.8] text-[#738077]">
                            প্রয়োজন থেকে সহযোগিতা—একটি সংযুক্ত মানবিক পথচলা।
                        </p>

                        <TbHeartHandshake
                            size={22}
                            strokeWidth={1.5}
                            className="shrink-0 text-primary"
                        />
                    </div>
                </div>
            </section>

            {/* PROBLEM ANALYSIS */}
            <section id="mission-challenge" className="scroll-mt-24 bg-white">
                <div className={container}>
                    <div className="py-17 sm:py-20 lg:py-24">
                        <div className="grid gap-5 lg:grid-cols-[0.38fr_1fr] lg:gap-12">
                            <Eyebrow>যে বাস্তবতা বদলাতে চাই</Eyebrow>

                            <div>
                                <h2 className="max-w-[750px] text-[clamp(1.9rem,2.9vw,2.75rem)] font-medium! leading-[1.45]">
                                    মানবিক সহায়তার পথে
                                    <span className="text-primary">
                                        {' '}
                                        সদিচ্ছাই সবসময় যথেষ্ট নয়।
                                    </span>
                                </h2>

                                <p className="mt-5 max-w-[650px] text-[0.96rem] leading-[1.95] text-[#647168]">
                                    অনেক সময় মূল বাধা হয়ে দাঁড়ায় তথ্যের
                                    বিচ্ছিন্নতা, উদ্যোগের খবর মানুষের কাছে না
                                    পৌঁছানো এবং প্রয়োজনের সঙ্গে উপযুক্ত সহায়তার
                                    সংযোগ তৈরি না হওয়া।
                                </p>
                            </div>
                        </div>

                        {/* THREE-COLUMN EDITORIAL ANALYSIS */}
                        <div className="mt-11 grid gap-0 border-y border-[#dce3da] md:grid-cols-3 lg:mt-14">
                            {challenges.map((item, index) => (
                                <article
                                    key={item.number}
                                    className={`relative border-b border-[#dce3da] py-7 md:border-b-0 md:px-7 md:py-9 lg:px-9 ${
                                        index === 0 ? 'md:pl-0' : 'md:border-l'
                                    }`}
                                >
                                    <span className="text-[2.1rem] font-medium! leading-none text-[#a9c6b7]">
                                        {item.number}
                                    </span>

                                    <div className="mt-8">
                                        <h3 className="max-w-[280px] text-[1.19rem] font-semibold! leading-[1.55]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-4 max-w-[330px] text-[0.93rem] leading-[1.95] text-[#647168]">
                                            {item.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION MANIFESTO */}
            <section className="relative overflow-hidden bg-[#173d38] text-white">
                <div className={container}>
                    <div className="relative py-17 sm:py-20 lg:py-24">
                        <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr] lg:gap-12">
                            <Eyebrow light>আমাদের অবস্থান</Eyebrow>

                            <div className="max-w-[860px]">
                                <h2 className="text-[clamp(2rem,3.45vw,3.35rem)] font-medium! leading-[1.43] text-white!">
                                    বিচ্ছিন্ন প্রচেষ্টার বদলে
                                    <span className="block text-[#e8b77f]">
                                        আমরা চাই সম্মিলিত সহযোগিতা।
                                    </span>
                                </h2>

                                <p className="mt-7 max-w-[680px] text-[1rem] leading-[2] text-white/70">
                                    Stand For People এমন একটি প্ল্যাটফর্ম গড়ে
                                    তুলতে চায়, যেখানে মানুষ সহায়তার প্রয়োজন
                                    জানতে পারবেন, চলমান উদ্যোগ খুঁজে পাবেন,
                                    সংশ্লিষ্ট সংগঠন সম্পর্কে ধারণা নিতে পারবেন
                                    এবং নিজের সামর্থ্য অনুযায়ী সহযোগিতার পথ বেছে
                                    নিতে পারবেন।
                                </p>

                                <div className="mt-9 flex items-start gap-4 border-t border-white/20 pt-7">
                                    <TbHeartHandshake
                                        size={28}
                                        strokeWidth={1.4}
                                        className="mt-1 shrink-0 text-[#e8b77f]"
                                    />

                                    <p className="max-w-[590px] text-[1.08rem] font-medium! leading-[1.85] text-white/90">
                                        আমাদের লক্ষ্য শুধু তথ্য একত্র করা নয়,
                                        মানুষের মধ্যে আস্থা ও সহযোগিতার সম্পর্ক
                                        তৈরি করা।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARTICIPATION JOURNEY */}
            <section className="bg-[#f3f5ef]">
                <div className={container}>
                    <div className="py-17 sm:py-20 lg:py-24">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                            <div>
                                <Eyebrow>সহযোগিতার পথ</Eyebrow>

                                <h2 className="mt-5 max-w-[650px] text-[clamp(1.85rem,2.75vw,2.65rem)] font-medium! leading-[1.45]">
                                    একটি প্রয়োজন থেকে
                                    <span className="block text-primary">
                                        অর্থপূর্ণ অংশগ্রহণ পর্যন্ত।
                                    </span>
                                </h2>
                            </div>

                            <p className="max-w-[350px] text-[0.94rem] leading-[1.9] text-[#647168]">
                                সহায়তার প্রয়োজন বোঝা থেকে শুরু করে বাস্তব
                                উদ্যোগে অংশ নেওয়া পর্যন্ত একটি সহজ পথ।
                            </p>
                        </div>

                        {/* HORIZONTAL JOURNEY */}
                        <div className="mt-12 grid gap-0 border-t border-[#d3ded4] sm:grid-cols-2 lg:grid-cols-4">
                            {actions.map((item, index) => (
                                <article
                                    key={item.number}
                                    className={`relative border-b border-[#d3ded4] py-7 sm:px-6 lg:border-b-0 lg:px-7 lg:py-9 ${
                                        index === 0 ? 'sm:pl-0 lg:pl-0' : ''
                                    } ${index % 2 === 1 ? 'sm:border-l' : ''} ${
                                        index === 2 ? 'lg:border-l' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[1.6rem] font-medium! text-primary">
                                            {item.number}
                                        </span>

                                        {index < actions.length - 1 && (
                                            <TbArrowRight
                                                size={19}
                                                strokeWidth={1.5}
                                                className="hidden text-primary/50 lg:block"
                                            />
                                        )}
                                    </div>

                                    <h3 className="mt-6 text-[1.12rem] font-semibold! leading-[1.5]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 max-w-[280px] text-[0.91rem] leading-[1.9] text-[#647168]">
                                        {item.description}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-start lg:mt-10">
                            <Link
                                to="/how-it-works"
                                className="group inline-flex items-center gap-2 border-b border-primary/40 pb-2 text-[0.9rem] font-semibold! text-primary hover:border-primary"
                            >
                                কাজের পদ্ধতি বিস্তারিত জানুন
                                <TbArrowUpRight
                                    size={18}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* HUMAN FIRST - PHOTO ESSAY */}
            <section className="bg-white">
                <div className={container}>
                    <div className="grid gap-9 py-17 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14 lg:py-24 xl:gap-20">
                        <div>
                            <Eyebrow>মানুষই আমাদের অগ্রাধিকার</Eyebrow>

                            <h2 className="mt-6 max-w-[490px] text-[clamp(1.9rem,2.9vw,2.75rem)] font-medium! leading-[1.45]">
                                প্রযুক্তি পথ তৈরি করে।
                                <span className="block text-primary">
                                    মানবিকতা আসে মানুষ থেকে।
                                </span>
                            </h2>

                            <p className="mt-6 max-w-[480px] text-[0.96rem] leading-[1.95] text-[#647168]">
                                প্রযুক্তি তথ্যকে সংগঠিত করতে পারে, সহযোগিতার পথ
                                সহজ করতে পারে এবং মানুষকে কাছাকাছি আনতে পারে।
                            </p>

                            <p className="mt-4 max-w-[480px] text-[0.96rem] leading-[1.95] text-[#647168]">
                                কিন্তু মানবিকতার প্রকৃত শক্তি আসে মানুষের
                                সহমর্মিতা, বিশ্বাস ও দায়িত্ববোধ থেকে। প্রতিটি
                                উদ্যোগের পেছনে রয়েছে বাস্তব মানুষের প্রয়োজন, আশা
                                এবং ভালো থাকার আকাঙ্ক্ষা।
                            </p>

                            <div className="mt-7 border-l-[3px] border-[#d9a765] pl-5">
                                <p className="text-[1.04rem] font-medium! leading-[1.85] text-[#24483d]">
                                    প্রতিটি উদ্যোগের কেন্দ্রে থাকবেন মানুষ—এটাই
                                    আমাদের বিশ্বাস।
                                </p>
                            </div>
                        </div>

                        <figure className="relative">
                            <div className="h-[320px] overflow-hidden bg-[#dfe8e0] sm:h-[420px] lg:h-[460px] xl:h-[490px]">
                                <img
                                    src={fieldImage}
                                    alt="মানবিক উদ্যোগে মানুষের পাশে কাজ করছেন স্বেচ্ছাসেবকেরা"
                                    loading="lazy"
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>

                            <figcaption className="mt-3 text-[0.81rem] leading-[1.8] text-[#7c8980]">
                                মানবিক সহায়তার প্রতিটি প্রচেষ্টার পেছনে আছেন
                                বাস্তব মানুষ।
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            {/* GUIDING PRINCIPLES */}
            <section className="bg-[#f8f7f2]">
                <div className={container}>
                    <div className="py-17 sm:py-20 lg:py-24">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                            <div>
                                <Eyebrow>আমাদের কাজের ভিত্তি</Eyebrow>

                                <h2 className="mt-5 max-w-[650px] text-[clamp(1.85rem,2.7vw,2.6rem)] font-medium! leading-[1.45]">
                                    তিনটি মূল্যবোধ
                                    <span className="block text-primary">
                                        আমাদের সিদ্ধান্তকে পথ দেখায়।
                                    </span>
                                </h2>
                            </div>

                            <p className="max-w-[360px] text-[0.93rem] leading-[1.9] text-[#647168]">
                                মানুষের কল্যাণে প্রতিটি উদ্যোগ দায়িত্বশীলভাবে
                                এগিয়ে নিতে আমরা এই নীতিগুলোকে গুরুত্ব দিই।
                            </p>
                        </div>

                        <div className="mt-11 grid gap-4 md:grid-cols-3 lg:mt-13 lg:gap-5">
                            {principles.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={item.number}
                                        className="relative flex flex-col border border-[#e0e6dc] bg-white px-6 py-7 sm:px-7 sm:py-8"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex h-11 w-11 items-center justify-center bg-[#eaf2ed] text-primary">
                                                <Icon
                                                    size={24}
                                                    strokeWidth={1.5}
                                                />
                                            </div>

                                            <span className="text-[0.84rem] font-medium! text-[#9aa99f]">
                                                {item.number}
                                            </span>
                                        </div>

                                        <h3 className="mt-7 text-[1.2rem] font-semibold! leading-[1.5]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-3 text-[0.93rem] leading-[1.95] text-[#647168]">
                                            {item.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL COMMITMENT */}
            <section className="bg-[#e8f0e9]">
                <div className={container}>
                    <div className="grid gap-8 py-14 sm:py-17 lg:grid-cols-[1fr_0.55fr] lg:items-end lg:gap-16 lg:py-20">
                        <div>
                            <Eyebrow>আমাদের অঙ্গীকার</Eyebrow>

                            <h2 className="mt-5 max-w-[700px] text-[clamp(1.9rem,3vw,2.9rem)] font-medium! leading-[1.45]">
                                প্রযুক্তি সংযোগ তৈরি করতে পারে।
                                <span className="block text-primary">
                                    আস্থা তৈরি করে মানুষ।
                                </span>
                            </h2>
                        </div>

                        <div>
                            <p className="max-w-[400px] text-[0.95rem] leading-[1.95] text-[#647168]">
                                সেই আস্থার ভিত্তিতে আরও সংযুক্ত, স্বচ্ছ ও মানবিক
                                সহযোগিতার পরিবেশ গড়ে তোলাই আমাদের লক্ষ্য।
                            </p>

                            <div className="mt-5 flex items-center gap-2.5 text-primary">
                                <TbCheck size={19} />
                                <span className="text-[0.9rem] font-medium!">
                                    মানুষের মর্যাদা সবার আগে
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Mission;
