import React from 'react';
import { Link } from 'react-router-dom';
import {
    TbArrowRight,
    TbArrowUpRight,
    TbArrowDown,
    TbHeartHandshake,
} from 'react-icons/tb';

const heroImage =
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1800&q=85';

const originImage =
    'https://images.unsplash.com/photo-1494386346843-e12284507169?auto=format&fit=crop&w=1400&q=85';

const peopleImage =
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85';

const container = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10';
const storyChapters = [
    {
        number: '০১',
        label: 'শুরু',
        title: 'আমরা একটি প্রযুক্তি বানানোর কথা দিয়ে শুরু করিনি।',
        description:
            'শুরু হয়েছিল একটি সমস্যাকে বোঝার চেষ্টা দিয়ে। মানুষের প্রয়োজনে পাশে দাঁড়াতে চাওয়া মানুষ এবং বাস্তবে সহায়তার প্রয়োজন থাকা মানুষের মধ্যে সংযোগটি অনেক সময় সহজ নয়।',
    },
    {
        number: '০২',
        label: 'প্রথম উপলব্ধি',
        title: 'সমস্যাটি শুধু সাহায্যের অভাব নয়।',
        description:
            'অনেক সময় প্রয়োজন এবং সহায়তার মধ্যে সংযোগ তৈরি করার মতো একটি পরিষ্কার, বোধগম্য এবং নির্ভরযোগ্য পথই অনুপস্থিত থাকে।',
    },
    {
        number: '০৩',
        label: 'ভাবনা',
        title: 'সমস্যাটিকে নতুনভাবে দেখা',
        description:
            'প্রয়োজন, মানবিক উদ্যোগ এবং মানুষের অংশগ্রহণকে আলাদা আলাদা বিষয় হিসেবে না দেখে একটি সংযুক্ত অভিজ্ঞতা হিসেবে ভাবার শুরু হয়।',
    },
    {
        number: '০৪',
        label: 'নির্মাণ',
        title: 'ধারণাকে বাস্তব রূপ দেওয়া',
        description:
            'প্রয়োজন দেখা, উদ্যোগ খোঁজা, সংগঠন সম্পর্কে জানা এবং নিজের সামর্থ্য অনুযায়ী পাশে দাঁড়ানোর পথগুলোকে একই অভিজ্ঞতার মধ্যে আনার কাজ শুরু হয়।',
    },
    {
        number: '০৫',
        label: 'শেখা',
        title: 'বাস্তব অভিজ্ঞতা থেকে শেখা',
        description:
            'একটি মানবিক প্ল্যাটফর্ম শুধু প্রযুক্তি দিয়ে তৈরি হয় না। মানুষের বাস্তব অভিজ্ঞতা, প্রয়োজন এবং অংশগ্রহণ থেকে কীভাবে আরও ভালো করা যায়—সেই শেখার প্রক্রিয়াটিও এর অংশ।',
    },
    {
        number: '০৬',
        label: 'আজ',
        title: 'আরও অর্থপূর্ণ সংযোগের দিকে',
        description:
            'Stand For People এখন মানুষের প্রয়োজন, মানবিক উদ্যোগ এবং অংশগ্রহণের পথগুলোকে আরও পরিষ্কার ও সহজভাবে একই অভিজ্ঞতায় যুক্ত করার দিকে এগিয়ে যাচ্ছে।',
    },
];

const lessons = [
    {
        number: '০১',
        title: 'মানুষের প্রয়োজন আগে',
        description:
            'প্রযুক্তি কিংবা উদ্যোগের চেয়ে গুরুত্বপূর্ণ হলো মানুষের বাস্তব প্রয়োজনকে বোঝা।',
    },
    {
        number: '০২',
        title: 'পরিষ্কার তথ্য গুরুত্বপূর্ণ',
        description:
            'সহায়তার প্রয়োজন ও অংশগ্রহণের সুযোগ সম্পর্কে স্পষ্ট তথ্য মানুষকে সিদ্ধান্ত নিতে সাহায্য করে।',
    },
    {
        number: '০৩',
        title: 'আস্থা সময় নিয়ে তৈরি হয়',
        description:
            'দায়িত্বশীল আচরণ, স্বচ্ছতা ও ধারাবাহিক প্রচেষ্টার মাধ্যমেই মানুষের বিশ্বাস অর্জন সম্ভব।',
    },
    {
        number: '০৪',
        title: 'শেখা কখনো শেষ নয়',
        description:
            'বাস্তব অভিজ্ঞতা থেকে শেখা এবং প্রয়োজন অনুযায়ী উন্নতি করাই এগিয়ে যাওয়ার পথ।',
    },
];

function SectionLabel({ children, light = false }) {
    return (
        <div className="flex items-center gap-3">
            <span
                className={`h-[2px] w-7 shrink-0 ${
                    light ? 'bg-[#e6b47b]' : 'bg-[#d4a15e]'
                }`}
            />
            <span
                className={`text-[0.81rem] font-medium! ${
                    light ? 'text-[#e8c49d]' : 'text-primary'
                }`}
            >
                {children}
            </span>
        </div>
    );
}

const Story = () => {
    return (
        <main
            lang="bn"
            className="min-w-0 overflow-x-clip bg-white font-bengali text-[#172b29]"
        >
            {/* OPENING */}
            <section className="mt-20 bg-[#f6f7f2]">
                <div className={container}>
                    <div className="grid gap-9 pb-11 pt-12 sm:pb-14 sm:pt-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-16 lg:pb-16 lg:pt-20">
                        <div>
                            <SectionLabel>আমাদের গল্প</SectionLabel>

                            <h1 className="mt-6 max-w-[760px] text-[clamp(2rem,3.35vw,3.25rem)] font-medium! leading-[1.4] tracking-[-0.015em]">
                                একটি প্রশ্ন থেকে শুরু হয়ে
                                <span className="block text-primary">
                                    একটি পথ তৈরি হলো।
                                </span>
                            </h1>
                        </div>

                        <div className="max-w-[370px]">
                            <p className="text-[0.96rem] leading-[1.95] text-[#596a62]">
                                Stand For People-এর গল্প কোনো সম্পূর্ণ হয়ে যাওয়া
                                গল্প নয়। মানুষের প্রয়োজন, সাহায্য করার ইচ্ছা এবং
                                সেই দুটির মধ্যে সংযোগ তৈরি করার চেষ্টা থেকেই এই
                                পথচলার শুরু।
                            </p>

                            <a
                                href="#story-journey"
                                className="mt-5 inline-flex items-center gap-2 text-[0.87rem] font-semibold! text-primary transition-colors hover:text-[#095f58]"
                            >
                                গল্পটি জানুন
                                <TbArrowDown size={17} />
                            </a>
                        </div>
                    </div>

                    {/* DOCUMENTARY IMAGE */}
                    <figure>
                        <div className="relative h-[280px] overflow-hidden bg-[#dce6de] sm:h-[370px] md:h-[420px] lg:h-[470px] xl:h-[500px]">
                            <img
                                src={heroImage}
                                alt="মানুষ একসঙ্গে মানবিক উদ্যোগে কাজ করছেন"
                                fetchPriority="high"
                                className="h-full w-full object-cover object-center"
                            />

                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3 sm:bottom-7 sm:left-8 sm:right-8">
                                <p className="max-w-[610px] text-[0.98rem] font-medium! leading-[1.8] text-white! sm:text-[1.12rem]">
                                    মানুষের পাশে দাঁড়ানোর ইচ্ছা অনেকেরই আছে।
                                    প্রশ্ন ছিল—সেই ইচ্ছাকে সঠিক প্রয়োজনের কাছে
                                    পৌঁছানো যায় কীভাবে?
                                </p>

                                <span className="hidden text-[0.8rem] text-white/80 sm:block">
                                    Stand For People
                                </span>
                            </div>
                        </div>
                    </figure>

                    <div className="flex items-center justify-between gap-4 border-b border-[#dce3da] py-5">
                        <p className="text-[0.84rem] leading-[1.8] text-[#738077]">
                            একটি প্রশ্ন, একটি ভাবনা এবং মানুষের জন্য কিছু করার
                            প্রচেষ্টা।
                        </p>

                        <TbHeartHandshake
                            size={22}
                            strokeWidth={1.5}
                            className="shrink-0 text-primary"
                        />
                    </div>
                </div>
            </section>

            {/* STORY JOURNEY */}
            <section id="story-journey" className="scroll-mt-24 bg-white">
                <div className={container}>
                    <div className="py-16 sm:py-20 lg:py-24">
                        <div className="grid gap-5 lg:grid-cols-[0.35fr_1fr] lg:gap-12">
                            <SectionLabel>পথচলার অধ্যায়</SectionLabel>

                            <div>
                                <h2 className="max-w-[730px] text-[clamp(1.85rem,2.75vw,2.6rem)] font-medium! leading-[1.5]">
                                    একটি ভাবনা কীভাবে
                                    <span className="text-primary">
                                        {' '}
                                        ধীরে ধীরে পথ খুঁজে পেল।
                                    </span>
                                </h2>

                                <p className="mt-4 max-w-[640px] text-[0.95rem] leading-[1.95] text-[#647168]">
                                    একটি সমস্যাকে বোঝা থেকে শুরু করে মানুষের
                                    জন্য আরও কার্যকর সহযোগিতার পথ তৈরি করার
                                    প্রচেষ্টা— এই কয়েকটি অধ্যায়ে আমাদের পথচলার
                                    গল্প।
                                </p>
                            </div>
                        </div>

                        <div className="mt-11 grid gap-10 lg:mt-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 xl:gap-20">
                            {/* STICKY DOCUMENTARY IMAGE */}
                            <div className="lg:sticky lg:top-28 lg:self-start">
                                <figure>
                                    <div className="h-[270px] overflow-hidden bg-[#e3e9df] sm:h-[370px] lg:h-[430px] xl:h-[470px]">
                                        <img
                                            src={originImage}
                                            alt="মানবিক উদ্যোগের সূচনা ও সহযোগিতার ভাবনা"
                                            loading="lazy"
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <figcaption className="mt-4 max-w-[420px] text-[0.83rem] leading-[1.85] text-[#7b887f]">
                                        কোথায় সাহায্য দরকার, কে পাশে দাঁড়াচ্ছেন
                                        এবং কীভাবে যুক্ত হওয়া যায়— এই
                                        প্রশ্নগুলোর উত্তর সবসময় সহজে পাওয়া যায়
                                        না।
                                    </figcaption>
                                </figure>

                                <div className="mt-7 hidden border-t border-[#dce3da] pt-5 lg:block">
                                    <span className="text-[0.82rem] font-medium! text-primary">
                                        আমাদের পথচলা
                                    </span>

                                    <p className="mt-2 max-w-[360px] text-[0.91rem] leading-[1.9] text-[#647168]">
                                        মানুষের প্রয়োজনকে বোঝার চেষ্টা থেকেই
                                        প্রতিটি নতুন ভাবনার শুরু।
                                    </p>
                                </div>
                            </div>

                            {/* COMPACT CHAPTER TIMELINE */}
                            <div className="relative border-l border-[#d4e0d6] pl-6 sm:pl-9">
                                {storyChapters.map((chapter, index) => (
                                    <article
                                        key={chapter.number}
                                        className={`relative pb-9 sm:pb-11 ${
                                            index === storyChapters.length - 1
                                                ? 'pb-0! sm:pb-0!'
                                                : ''
                                        }`}
                                    >
                                        <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[3px] border-white bg-primary sm:-left-[42px]" />

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <span className="text-[0.86rem] font-semibold! text-primary">
                                                {chapter.number}
                                            </span>

                                            <span className="text-[0.81rem] text-[#8b988f]">
                                                {chapter.label}
                                            </span>
                                        </div>

                                        <h3 className="mt-3 max-w-[550px] text-[1.18rem] font-semibold! leading-[1.65] sm:text-[1.35rem]">
                                            {chapter.title}
                                        </h3>

                                        <p className="mt-3 max-w-[560px] text-[0.94rem] leading-[1.95] text-[#647168]">
                                            {chapter.description}
                                        </p>

                                        {index === 1 && (
                                            <blockquote className="mt-6 border-l-[3px] border-[#d5a364] bg-[#f6f4ee] px-5 py-5">
                                                <p className="text-[1.04rem] font-medium! leading-[1.85] text-[#24483d]">
                                                    “প্রয়োজন আর সহায়তার মাঝে
                                                    একটি পরিষ্কার পথ দরকার।”
                                                </p>
                                            </blockquote>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT WE LEARNED */}
            <section className="bg-[#f3f5ef]">
                <div className={container}>
                    <div className="grid gap-9 py-16 sm:py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 lg:py-24 xl:gap-20">
                        <div>
                            <SectionLabel>পথচলার শিক্ষা</SectionLabel>

                            <h2 className="mt-5 max-w-[400px] text-[clamp(1.8rem,2.6vw,2.45rem)] font-medium! leading-[1.5]">
                                এই পথচলা
                                <span className="block text-primary">
                                    আমাদের যা শিখিয়েছে।
                                </span>
                            </h2>

                            <p className="mt-5 max-w-[370px] text-[0.93rem] leading-[1.9] text-[#647168]">
                                কাজ করতে করতে কিছু বিষয় আমাদের চিন্তা ও
                                সিদ্ধান্তের গুরুত্বপূর্ণ ভিত্তি হয়ে উঠেছে।
                            </p>
                        </div>

                        <div className="border-t border-[#cfdad0]">
                            {lessons.map((lesson) => (
                                <article
                                    key={lesson.number}
                                    className="grid gap-3 border-b border-[#cfdad0] py-6 sm:grid-cols-[45px_1fr] sm:gap-5 sm:py-7"
                                >
                                    <span className="text-[0.91rem] font-medium! text-primary">
                                        {lesson.number}
                                    </span>

                                    <div>
                                        <h3 className="text-[1.16rem] font-semibold! leading-[1.6] sm:text-[1.28rem]">
                                            {lesson.title}
                                        </h3>

                                        <p className="mt-2 max-w-[570px] text-[0.93rem] leading-[1.9] text-[#647168]">
                                            {lesson.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* THE STORY CONTINUES */}
            <section className="bg-white">
                <div className={container}>
                    <div className="py-16 sm:py-20 lg:py-24">
                        <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 xl:gap-20">
                            <div>
                                <SectionLabel>আজও</SectionLabel>

                                <h2 className="mt-6 max-w-[530px] text-[clamp(1.9rem,2.9vw,2.8rem)] font-medium! leading-[1.45]">
                                    গল্পটি এখনও
                                    <span className="block text-primary">
                                        লেখা হচ্ছে।
                                    </span>
                                </h2>

                                <p className="mt-5 max-w-[460px] text-[0.96rem] leading-[1.95] text-[#647168]">
                                    মানুষের পাশে দাঁড়ানোর আরও ভালো পথ খোঁজা,
                                    বাস্তব অভিজ্ঞতা থেকে শেখা এবং আরও অর্থপূর্ণ
                                    সংযোগ তৈরি করার কাজও তাই চলছে।
                                </p>

                                <p className="mt-4 max-w-[460px] text-[0.95rem] leading-[1.95] text-[#647168]">
                                    Stand For People-এর এই পথচলায় মানুষের
                                    অংশগ্রহণই সবচেয়ে গুরুত্বপূর্ণ শক্তি।
                                </p>

                                <Link
                                    to="/campaigns"
                                    className="group mt-7 inline-flex min-h-11 items-center gap-3 bg-primary px-5 py-3 text-[0.9rem] font-semibold! text-white! transition-colors hover:bg-[#095f58] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                >
                                    বর্তমান উদ্যোগগুলো দেখুন
                                    <TbArrowUpRight
                                        size={18}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </div>

                            <figure>
                                <div className="relative h-[300px] overflow-hidden bg-[#dce6de] sm:h-[390px] lg:h-[450px] xl:h-[470px]">
                                    <img
                                        src={peopleImage}
                                        alt="মানুষ একসঙ্গে কাজ করছেন এবং একে অপরের পাশে দাঁড়াচ্ছেন"
                                        loading="lazy"
                                        className="h-full w-full object-cover object-center"
                                    />

                                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                                    <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 text-white sm:bottom-7 sm:left-7">
                                        <TbHeartHandshake
                                            size={23}
                                            strokeWidth={1.5}
                                        />

                                        <span className="text-[0.88rem] font-medium!">
                                            মানুষের জন্য, মানুষের সঙ্গে
                                        </span>
                                    </div>
                                </div>

                                <figcaption className="mt-3 text-[0.82rem] leading-[1.8] text-[#7b887f]">
                                    প্রযুক্তি পথ তৈরি করতে পারে। পথটিকে
                                    অর্থপূর্ণ করে মানুষের অংশগ্রহণ।
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="bg-[#173d38]">
                <div className={container}>
                    <div className="grid gap-7 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:py-20">
                        <div>
                            <SectionLabel light>
                                আমাদের সঙ্গে পথ চলুন
                            </SectionLabel>

                            <h2 className="mt-5 max-w-[670px] text-[clamp(1.8rem,2.7vw,2.6rem)] font-medium! leading-[1.5] text-white!">
                                এই গল্পের পরবর্তী অধ্যায়ে
                                <span className="block text-[#e8b77f]">
                                    আপনারও ভূমিকা থাকতে পারে।
                                </span>
                            </h2>

                            <p className="mt-4 max-w-[560px] text-[0.94rem] leading-[1.95] text-white/70">
                                মানুষের প্রয়োজন সম্পর্কে জানুন, মানবিক
                                উদ্যোগগুলো দেখুন এবং নিজের সামর্থ্য অনুযায়ী পাশে
                                দাঁড়ানোর পথ খুঁজে নিন।
                            </p>
                        </div>

                        <Link
                            to="/campaigns"
                            className="group inline-flex min-h-11 items-center justify-center gap-3 bg-white px-5 py-3 text-[0.9rem] font-semibold! text-primary transition-colors hover:bg-[#f1f3ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                            উদ্যোগগুলো দেখুন
                            <TbArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Story;
