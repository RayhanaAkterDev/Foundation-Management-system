import React from 'react';
import { Link } from 'react-router-dom';
import {
    TbArrowRight,
    TbArrowUpRight,
    TbHeartHandshake,
    TbShieldCheck,
    TbTargetArrow,
    TbUsers,
    TbBuildingCommunity,
    TbCheck,
} from 'react-icons/tb';

import aboutHeroImage from '@/assets/about/aboutHero.png';
import aboutIntro from '@/assets/about/aboutIntro.png';

const peopleImage =
    'https://www.carefrance.org/app/uploads/2022/03/bangladesh-refugies.jpg';

const container =
    'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10';

const values = [
    {
        number: '০১',
        icon: TbShieldCheck,
        title: 'বিশ্বাস ও স্বচ্ছতা',
        description:
            'সহায়তার প্রয়োজন, উদ্যোগের অগ্রগতি ও গুরুত্বপূর্ণ তথ্য স্পষ্টভাবে তুলে ধরে দায়িত্বশীল সহযোগিতার পরিবেশ গড়ে তোলা।',
    },
    {
        number: '০২',
        icon: TbUsers,
        title: 'মানুষের মর্যাদা',
        description:
            'প্রতিটি উদ্যোগে মানুষের বাস্তব প্রয়োজন, সম্মান, নিরাপত্তা ও ব্যক্তিগত অভিজ্ঞতাকে গুরুত্ব দেওয়া।',
    },
    {
        number: '০৩',
        icon: TbTargetArrow,
        title: 'অর্থপূর্ণ সহযোগিতা',
        description:
            'শুধু সহায়তা পৌঁছে দেওয়া নয়, বরং সঠিক প্রয়োজনের সঙ্গে উপযুক্ত মানুষ ও সক্ষমতাকে যুক্ত করা।',
    },
];

const steps = [
    {
        number: '০১',
        title: 'প্রয়োজন জানানো',
        description:
            'সহায়তার প্রয়োজন রয়েছে এমন ব্যক্তি বা কমিউনিটি তাঁদের পরিস্থিতি তুলে ধরেন।',
    },
    {
        number: '০২',
        title: 'সঠিক সংযোগ',
        description:
            'প্রয়োজন অনুযায়ী স্বেচ্ছাসেবক, সহায়তাকারী ও সংগঠনের সঙ্গে সংযোগ তৈরি হয়।',
    },
    {
        number: '০৩',
        title: 'সম্মিলিত সহযোগিতা',
        description:
            'সংশ্লিষ্ট সবাই সময়, দক্ষতা, সম্পদ বা সাংগঠনিক সক্ষমতা নিয়ে অংশ নেন।',
    },
    {
        number: '০৪',
        title: 'ইতিবাচক পরিবর্তন',
        description:
            'সমন্বিত উদ্যোগ মানুষের বাস্তব সমস্যার সমাধানে নতুন সম্ভাবনা তৈরি করে।',
    },
];

function SectionLabel({ number, children, light = false }) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className={`h-px w-6 shrink-0 ${
                    light ? 'bg-[#dfb98c]' : 'bg-primary'
                }`}
            />
            <span
                className={`text-[0.78rem] font-medium! leading-relaxed ${
                    light ? 'text-[#e8c49d]' : 'text-primary'
                }`}
            >
                {number ? `${number} / ` : ''}
                {children}
            </span>
        </div>
    );
}

function TextLink({ to, children, light = false }) {
    return (
        <Link
            to={to}
            className={`group inline-flex min-h-10 items-center gap-2 border-b pb-1 text-[0.88rem] font-semibold! transition-colors ${
                light
                    ? 'border-white/40 text-white! hover:border-white'
                    : 'border-primary/40 text-primary hover:border-primary'
            }`}
        >
            {children}
            <TbArrowUpRight
                size={17}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
        </Link>
    );
}

const About = () => {
    return (
        <main
            lang="bn"
            className="min-w-0 overflow-x-clip bg-[#faf9f6] font-bengali text-[#172b29]"
        >
            {/* HERO */}
            <section className="relative mt-20 bg-[#f0f3ee]">
                <div className={container}>
                    <div className="grid items-center gap-9 py-11 sm:gap-11 sm:py-14 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12 lg:py-16 xl:gap-16">
                        <div className="max-w-[560px]">
                            <div className="flex items-center gap-2.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#d9a25e]" />
                                <span className="text-[0.8rem] font-medium! text-primary">
                                    Stand For People — আমাদের কথা
                                </span>
                            </div>

                            <h1 className="mt-5 text-[clamp(2rem,3.15vw,3.1rem)] font-medium! leading-[1.4] tracking-[-0.015em]">
                                মানবিকতার শক্তিতে
                                <span className="block text-primary">
                                    একসঙ্গে পরিবর্তনের পথে।
                                </span>
                            </h1>

                            <p className="mt-5 max-w-[510px] text-[0.96rem] leading-[1.95] text-[#596a62]">
                                Stand For People একটি মানবিক সহযোগিতা ও সমন্বয়ের
                                প্ল্যাটফর্ম। এখানে সহায়তাপ্রার্থী মানুষ,
                                স্বেচ্ছাসেবক, দাতা ও সংগঠন একসঙ্গে কাজ করার
                                সুযোগ পান। আমাদের লক্ষ্য, মানুষের বাস্তব
                                প্রয়োজনের সঙ্গে সঠিক সহায়তার সংযোগ তৈরি করা।
                            </p>

                            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
                                <Link
                                    to="/campaigns"
                                    className="group inline-flex min-h-11 items-center justify-center gap-3 bg-primary px-5 py-3 text-[0.88rem] font-medium! text-white! transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                >
                                    উদ্যোগগুলো দেখুন
                                    <TbArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                <TextLink to="/how-it-works">
                                    কীভাবে কাজ করে
                                </TextLink>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative h-[290px] overflow-hidden bg-[#dce5dd] sm:h-[370px] md:h-[400px] lg:h-[410px] xl:h-[440px]">
                                <img
                                    src={aboutHeroImage}
                                    alt="মানবিক সহযোগিতায় মানুষের পাশে দাঁড়ানোর উদ্যোগ"
                                    fetchPriority="high"
                                    className="h-full w-full object-cover object-center"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2.5 text-white sm:bottom-6 sm:left-6">
                                    <TbHeartHandshake
                                        size={22}
                                        strokeWidth={1.5}
                                    />
                                    <span className="text-[0.86rem] font-medium!">
                                        মানুষের জন্য, মানুষের সঙ্গে
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR STORY */}
            <section className="bg-white">
                <div className={container}>
                    <div className="py-16 sm:py-20 lg:py-24">
                        <div className="grid gap-5 lg:grid-cols-[0.32fr_1fr] lg:gap-12">
                            <SectionLabel number="০১">আমরা কারা</SectionLabel>

                            <h2 className="max-w-[790px] text-[clamp(1.75rem,2.65vw,2.55rem)] font-medium! leading-[1.5]">
                                মানুষের পাশে দাঁড়ানোর ইচ্ছা অনেকেরই আছে।
                                <span className="text-primary">
                                    {' '}
                                    প্রয়োজন সেই ইচ্ছাকে সঠিক জায়গায় পৌঁছে দেওয়া।
                                </span>
                            </h2>
                        </div>

                        <div className="mt-10 grid items-center gap-9 sm:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-16">
                            <div className="relative overflow-hidden bg-[#e8ece6]">
                                <img
                                    src={aboutIntro}
                                    alt="মানবিক উদ্যোগে সহযোগিতা ও অংশগ্রহণ"
                                    loading="lazy"
                                    className="aspect-[5/4] w-full object-cover object-center sm:aspect-[6/4] lg:aspect-[5/4]"
                                />
                                <div className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center bg-primary text-white sm:h-14 sm:w-14">
                                    <TbHeartHandshake
                                        size={25}
                                        strokeWidth={1.4}
                                    />
                                </div>
                            </div>

                            <div className="max-w-[590px]">
                                <p className="text-[0.96rem] leading-[2] text-[#596a62]">
                                    অনেক মানুষ অন্যের পাশে দাঁড়াতে চান। কিন্তু
                                    কোথায় সহায়তা প্রয়োজন, কীভাবে অংশ নিতে হবে
                                    কিংবা কার সঙ্গে যোগাযোগ করতে হবে—সেই তথ্য
                                    সবসময় সহজে পাওয়া যায় না।
                                </p>

                                <p className="mt-4 text-[0.96rem] leading-[2] text-[#596a62]">
                                    অন্যদিকে, সহায়তাপ্রার্থী মানুষ ও কমিউনিটিও
                                    অনেক সময় উপযুক্ত সহযোগিতার সঙ্গে যুক্ত হতে
                                    পারেন না। Stand For People এই ব্যবধান কমিয়ে
                                    প্রয়োজন ও সামর্থ্যের মধ্যে একটি দায়িত্বশীল
                                    সেতু গড়ে তুলতে চায়।
                                </p>

                                <div className="mt-6 border-l-[3px] border-[#d6a466] pl-5">
                                    <p className="text-[1.02rem] font-medium! leading-[1.85] text-[#28483d]">
                                        আমরা বিশ্বাস করি, একটি সঠিক সংযোগও
                                        মানুষের জীবনে অর্থপূর্ণ পরিবর্তনের সূচনা
                                        করতে পারে।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PURPOSE */}
            <section className="bg-[#183e39] text-white">
                <div className={container}>
                    <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-24 xl:gap-20">
                        <div>
                            <SectionLabel number="০২" light>
                                আমাদের উদ্দেশ্য
                            </SectionLabel>

                            <h2 className="mt-5 max-w-[470px] text-[clamp(1.8rem,2.75vw,2.65rem)] font-medium! leading-[1.5] text-white!">
                                সহায়তার প্রতিটি প্রচেষ্টা
                                <span className="block text-[#e8b77f]">
                                    আরও সংগঠিত ও অর্থপূর্ণ হোক।
                                </span>
                            </h2>

                            <p className="mt-5 max-w-[450px] text-[0.94rem] leading-[1.95] text-white/70">
                                আমাদের উদ্দেশ্য নতুন করে মানবিকতা তৈরি করা নয়।
                                মানুষের মধ্যে থাকা সহমর্মিতা, সদিচ্ছা ও
                                সক্ষমতাকে একত্র করে সহযোগিতার পথ আরও সহজ ও
                                কার্যকর করা।
                            </p>
                        </div>

                        <div className="border-t border-white/20">
                            {[
                                {
                                    number: '০১',
                                    title: 'প্রয়োজনকে দৃশ্যমান করা',
                                    description:
                                        'সহায়তার বাস্তব প্রয়োজন ও সংশ্লিষ্ট তথ্য দায়িত্বশীলভাবে মানুষের সামনে তুলে ধরা।',
                                },
                                {
                                    number: '০২',
                                    title: 'অংশগ্রহণের সুযোগ তৈরি করা',
                                    description:
                                        'স্বেচ্ছাসেবক, দাতা ও সংগঠনকে তাঁদের সামর্থ্য অনুযায়ী সহযোগিতায় যুক্ত হওয়ার পথ দেখানো।',
                                },
                                {
                                    number: '০৩',
                                    title: 'সহযোগিতাকে সমন্বিত করা',
                                    description:
                                        'বিচ্ছিন্ন উদ্যোগের পরিবর্তে মানুষ, প্রয়োজন ও সক্ষমতার মধ্যে কার্যকর সম্পর্ক তৈরি করা।',
                                },
                            ].map((item) => (
                                <article
                                    key={item.number}
                                    className="grid grid-cols-[40px_1fr] gap-4 border-b border-white/20 py-5 sm:grid-cols-[58px_1fr] sm:gap-6 sm:py-6"
                                >
                                    <span className="pt-0.5 text-[1.5rem] font-medium! text-[#e8b77f]">
                                        {item.number}
                                    </span>

                                    <div>
                                        <h3 className="text-[1.08rem] font-semibold! leading-[1.5] text-white!">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 max-w-[510px] text-[0.91rem] leading-[1.85] text-white/65">
                                            {item.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="bg-[#f5f2eb]">
                <div className={container}>
                    <div className="py-16 sm:py-20 lg:py-24">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                            <div>
                                <SectionLabel number="০৩">
                                    সংযোগের পথ
                                </SectionLabel>

                                <h2 className="mt-5 max-w-[610px] text-[clamp(1.8rem,2.7vw,2.55rem)] font-medium! leading-[1.5]">
                                    একটি প্রয়োজন থেকে
                                    <span className="block text-primary">
                                        সম্মিলিত উদ্যোগ পর্যন্ত।
                                    </span>
                                </h2>
                            </div>

                            <p className="max-w-[370px] text-[0.92rem] leading-[1.9] text-[#62716b]">
                                সঠিক মানুষ, প্রয়োজন ও সক্ষমতার মধ্যে সংযোগ তৈরি
                                করাই আমাদের কাজের মূল ভাবনা।
                            </p>
                        </div>

                        <div className="relative mt-10 sm:mt-12 lg:mt-14">
                            <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-primary/20 lg:block" />

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                                {steps.map((step, index) => (
                                    <article
                                        key={step.number}
                                        className={`relative border-t border-[#d9ddd4] py-6 sm:px-5 sm:py-7 lg:border-t-0 lg:px-6 lg:py-0 ${
                                            index === 0
                                                ? 'sm:pl-0 lg:pl-0'
                                                : 'lg:border-l lg:border-[#d9ddd4]'
                                        }`}
                                    >
                                        <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-[#f5f2eb]">
                                            <span className="text-[0.83rem] font-semibold! text-primary">
                                                {step.number}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 text-[1.08rem] font-semibold! leading-[1.5]">
                                            {step.title}
                                        </h3>

                                        <p className="mt-2 max-w-[270px] text-[0.9rem] leading-[1.85] text-[#62716b]">
                                            {step.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="mt-9 border-t border-[#d9ddd4] pt-5">
                            <TextLink to="/how-it-works">
                                কাজের পদ্ধতি বিস্তারিত জানুন
                            </TextLink>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="bg-white">
                <div className={container}>
                    <div className="grid gap-9 py-16 sm:py-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14 lg:py-24 xl:gap-20">
                        <div>
                            <SectionLabel number="০৪">
                                আমাদের মূল্যবোধ
                            </SectionLabel>

                            <h2 className="mt-5 max-w-[430px] text-[clamp(1.8rem,2.55vw,2.45rem)] font-medium! leading-[1.5]">
                                কাজের ধরন বদলাতে পারে।
                                <span className="block text-primary">
                                    আমাদের বিশ্বাস বদলায় না।
                                </span>
                            </h2>

                            <p className="mt-4 max-w-[380px] text-[0.92rem] leading-[1.9] text-[#62716b]">
                                মানুষের কল্যাণে কাজ করার প্রতিটি পর্যায়ে কিছু
                                মৌলিক মূল্যবোধ আমাদের পথ দেখায়।
                            </p>
                        </div>

                        <div className="border-t border-[#e1e7e1]">
                            {values.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={item.number}
                                        className="grid grid-cols-[42px_1fr] gap-4 border-b border-[#e1e7e1] py-5 sm:grid-cols-[48px_1fr_auto] sm:gap-5 sm:py-6"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center bg-[#eaf2ed] text-primary">
                                            <Icon size={23} strokeWidth={1.5} />
                                        </div>

                                        <div>
                                            <h3 className="text-[1.07rem] font-semibold!">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 max-w-[550px] text-[0.91rem] leading-[1.85] text-[#62716b]">
                                                {item.description}
                                            </p>
                                        </div>

                                        <span className="hidden text-[0.8rem] text-[#9aa9a0] sm:block">
                                            {item.number}
                                        </span>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* PEOPLE */}
            <section className="bg-[#eaf0eb]">
                <div className={container}>
                    <div className="grid items-center gap-9 py-16 sm:py-20 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-24 xl:gap-16">
                        <div>
                            <figure>
                                <div className="relative overflow-hidden bg-[#dce5dd]">
                                    <img
                                        src={peopleImage}
                                        alt="বাংলাদেশে মানবিক সহায়তা পৌঁছে দিচ্ছেন একজন স্বেচ্ছাসেবক"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        className="aspect-[5/4] w-full object-cover object-center sm:aspect-[6/4] lg:aspect-[5/4]"
                                    />
                                </div>
                                <figcaption className="mt-2 text-[0.75rem] text-[#718078]">
                                    আলোকচিত্র: কেয়ার ফ্রান্স। এটি Stand For
                                    People-এর নিজস্ব কার্যক্রমের ছবি নয়।
                                </figcaption>
                            </figure>
                        </div>

                        <div>
                            <SectionLabel number="০৫">
                                আমাদের শক্তি
                            </SectionLabel>

                            <h2 className="mt-5 max-w-[550px] text-[clamp(1.8rem,2.7vw,2.55rem)] font-medium! leading-[1.5]">
                                প্রযুক্তি সংযোগ তৈরি করে।
                                <span className="block text-primary">
                                    পরিবর্তন নিয়ে আসেন মানুষ।
                                </span>
                            </h2>

                            <p className="mt-5 max-w-[550px] text-[0.94rem] leading-[1.95] text-[#596a62]">
                                Stand For People-এর সবচেয়ে বড় শক্তি সেই
                                মানুষগুলো, যাঁরা অন্যের পাশে দাঁড়াতে চান। কেউ
                                নিজের প্রয়োজন জানান, কেউ সময় দেন, কেউ দক্ষতা ভাগ
                                করে নেন, আবার কেউ আর্থিক বা সাংগঠনিক সহযোগিতা
                                করেন।
                            </p>

                            <p className="mt-4 max-w-[550px] text-[0.94rem] leading-[1.95] text-[#596a62]">
                                প্রত্যেকের অংশগ্রহণই গুরুত্বপূর্ণ। ছোট একটি
                                উদ্যোগও সম্মিলিত প্রচেষ্টায় বড় পরিবর্তনের ভিত্তি
                                হয়ে উঠতে পারে।
                            </p>

                            <div className="mt-6 grid gap-5 border-t border-primary/15 pt-5 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <TbUsers
                                        size={21}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-primary"
                                    />
                                    <div>
                                        <h3 className="text-[0.94rem] font-semibold!">
                                            ব্যক্তি ও স্বেচ্ছাসেবক
                                        </h3>
                                        <p className="mt-1 text-[0.85rem] leading-[1.75] text-[#65756c]">
                                            সময়, দক্ষতা ও সহমর্মিতা দিয়ে পাশে
                                            দাঁড়ান।
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <TbBuildingCommunity
                                        size={21}
                                        strokeWidth={1.5}
                                        className="mt-0.5 shrink-0 text-primary"
                                    />
                                    <div>
                                        <h3 className="text-[0.94rem] font-semibold!">
                                            সংগঠন ও সহায়তাকারী
                                        </h3>
                                        <p className="mt-1 text-[0.85rem] leading-[1.75] text-[#65756c]">
                                            সম্পদ, অভিজ্ঞতা ও সমন্বয়ে উদ্যোগ
                                            এগিয়ে নেন।
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMMITMENT */}
            <section className="bg-white">
                <div className={container}>
                    <div className="grid gap-7 py-16 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-14 lg:py-24">
                        <div>
                            <SectionLabel number="০৬">
                                আমাদের অঙ্গীকার
                            </SectionLabel>

                            <h2 className="mt-5 max-w-[430px] text-[clamp(1.8rem,2.5vw,2.4rem)] font-medium! leading-[1.5]">
                                প্রতিটি উদ্যোগে
                                <span className="block text-primary">
                                    দায়িত্বশীলতার চর্চা।
                                </span>
                            </h2>
                        </div>

                        <div>
                            <p className="max-w-[670px] text-[0.97rem] leading-[2] text-[#596a62]">
                                আমরা এমন একটি পরিবেশ গড়ে তুলতে চাই, যেখানে
                                সাহায্য চাওয়া হবে সম্মানের সঙ্গে, সহযোগিতা করা
                                হবে দায়িত্ববোধ থেকে এবং প্রতিটি মানুষের অংশগ্রহণ
                                মূল্য পাবে। স্বচ্ছ তথ্য, পারস্পরিক বিশ্বাস ও
                                সম্মিলিত উদ্যোগই আমাদের পথচলার ভিত্তি।
                            </p>

                            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#e1e7e1] pt-5">
                                {[
                                    'মানুষের প্রতি সম্মান',
                                    'দায়িত্বশীল অংশগ্রহণ',
                                    'স্বচ্ছ সহযোগিতা',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2"
                                    >
                                        <TbCheck
                                            size={18}
                                            className="shrink-0 text-primary"
                                        />
                                        <span className="text-[0.88rem] font-medium! text-[#344c43]">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary">
                <div className={container}>
                    <div className="grid gap-7 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10 lg:py-20">
                        <div>
                            <div className="flex items-center gap-2.5 text-[#d2e9e1]">
                                <TbHeartHandshake size={19} strokeWidth={1.5} />
                                <span className="text-[0.82rem] font-medium!">
                                    আপনিও হতে পারেন এই পথচলার অংশ
                                </span>
                            </div>

                            <h2 className="mt-5 max-w-[650px] text-[clamp(1.85rem,2.8vw,2.7rem)] font-medium! leading-[1.5] text-white!">
                                আপনার একটি উদ্যোগ,
                                <span className="block text-white/75">
                                    কারও জীবনে নতুন আশার সূচনা।
                                </span>
                            </h2>

                            <p className="mt-4 max-w-[560px] text-[0.93rem] leading-[1.9] text-white/75">
                                সময়, দক্ষতা কিংবা সামর্থ্য অনুযায়ী সহযোগিতা
                                করুন। মানুষের পাশে দাঁড়ানোর প্রতিটি আন্তরিক
                                প্রচেষ্টাই গুরুত্বপূর্ণ।
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <Link
                                to="/campaigns"
                                className="group inline-flex min-h-11 items-center justify-center gap-3 bg-white px-5 py-3 text-[0.88rem] font-semibold! text-primary transition-colors hover:bg-[#f1f3ed] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                সহায়তায় অংশ নিন
                                <TbArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                to="/volunteer"
                                className="group inline-flex min-h-11 items-center justify-center gap-3 border border-white/40 px-5 py-3 text-[0.88rem] font-semibold! text-white! transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                স্বেচ্ছাসেবী হোন
                                <TbArrowUpRight
                                    size={17}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
