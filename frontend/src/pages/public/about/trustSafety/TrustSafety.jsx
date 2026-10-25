import React from 'react';
import { Link } from 'react-router-dom';
import {
    TbAlertTriangle,
    TbArrowRight,
    TbArrowUpRight,
    TbCircleCheck,
    TbHeartHandshake,
    TbLock,
    TbShieldCheck,
    TbUsers,
    TbInfoCircle,
    TbClipboardCheck,
    TbFileDescription,
    TbBuildingCommunity,
    TbUserHeart,
} from 'react-icons/tb';

const principles = [
    {
        number: '০১',
        icon: TbShieldCheck,
        label: 'পরিচয় ও তথ্য',
        title: 'যাচাইকে গুরুত্ব দেওয়া',
        description:
            'যেখানে পরিচয়, ভূমিকা বা অংশগ্রহণ যাচাই করার ব্যবস্থা রয়েছে, সেখানে যাচাই করা তথ্যকে অগ্রাধিকার দেওয়া হয়।',
    },
    {
        number: '০২',
        icon: TbUsers,
        label: 'পারস্পরিক দায়িত্ব',
        title: 'দায়িত্বশীল অংশগ্রহণ',
        description:
            'স্বেচ্ছাসেবক, সংগঠন এবং সহায়তাপ্রত্যাশী—প্রত্যেকের জন্য নিজের ভূমিকা ও দায়িত্ব সম্পর্কে পরিষ্কার থাকা গুরুত্বপূর্ণ।',
    },
    {
        number: '০৩',
        icon: TbLock,
        label: 'ব্যক্তিগত গোপনীয়তা',
        title: 'প্রয়োজনীয় তথ্যের ব্যবহার',
        description:
            'মানুষের সঙ্গে সম্পর্কিত তথ্য দায়িত্বশীলভাবে পরিচালনা করা এবং অপ্রয়োজনীয় তথ্য প্রকাশ না করাই আমাদের নীতির অংশ।',
    },
];

const roles = [
    {
        number: '০১',
        icon: TbUserHeart,
        title: 'সহায়তার অনুরোধ',
        description:
            'কোনো সহায়তার প্রয়োজন জানালে তথ্য সঠিকভাবে দেওয়া এবং প্রয়োজন অনুযায়ী যোগাযোগের জন্য প্রস্তুত থাকা গুরুত্বপূর্ণ।',
    },
    {
        number: '০২',
        icon: TbHeartHandshake,
        title: 'স্বেচ্ছাসেবক',
        description:
            'স্বেচ্ছাসেবী হিসেবে যুক্ত হওয়ার আগে নিজের দক্ষতা, সময় এবং দায়িত্বের সীমা সম্পর্কে বাস্তবসম্মত থাকা প্রয়োজন।',
    },
    {
        number: '০৩',
        icon: TbBuildingCommunity,
        title: 'সংগঠন',
        description:
            'কোনো সংগঠন প্ল্যাটফর্মে যুক্ত হলে তার পরিচয়, সক্ষমতা এবং ভূমিকা সম্পর্কে যথাযথ তথ্য প্রদান করা গুরুত্বপূর্ণ।',
    },
];

const checklist = [
    'পরিচয় ও প্রাসঙ্গিক তথ্য যাচাই করুন',
    'অপ্রয়োজনীয় ব্যক্তিগত তথ্য প্রকাশ করবেন না',
    'সন্দেহজনক আচরণ হলে সতর্ক থাকুন',
    'গুরুত্বপূর্ণ সিদ্ধান্তের আগে প্রয়োজনীয় যাচাই করুন',
];

const container =
    'mx-auto w-full max-w-[1240px] px-5 sm:px-7 md:px-9 lg:px-11 xl:px-12';

function Kicker({ children, inverse = false }) {
    return (
        <span
            className={`inline-flex items-center gap-2.5 text-[0.84rem] font-semibold! ${inverse ? 'text-[#b9dcd2]' : 'text-[#0f766e]'}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${inverse ? 'bg-[#f2b66d]' : 'bg-[#df9b52]'}`}
            />
            {children}
        </span>
    );
}

function ShieldArtwork() {
    return (
        <div
            aria-hidden="true"
            className="relative mx-auto flex h-[255px] w-full max-w-[360px] items-center justify-center sm:h-[300px] lg:h-[340px]"
        >
            <div className="absolute h-[225px] w-[225px] rounded-full border border-[#b9d1c8] sm:h-[270px] sm:w-[270px] lg:h-[305px] lg:w-[305px]" />
            <div className="absolute h-[178px] w-[178px] rounded-full border border-dashed border-[#c3d9d0] sm:h-[215px] sm:w-[215px] lg:h-[242px] lg:w-[242px]" />
            <div className="absolute flex h-[120px] w-[120px] items-center justify-center rounded-[30px] bg-[#0f766e] text-white sm:h-[145px] sm:w-[145px]">
                <TbShieldCheck size={69} strokeWidth={1.1} />
            </div>
            <span className="absolute left-0 top-[18%] bg-[#eaf2ed] px-2 py-1 text-[0.8rem] font-medium! text-[#0f766e]">
                যাচাই
            </span>
            <span className="absolute bottom-[15%] right-0 bg-[#eaf2ed] px-2 py-1 text-[0.8rem] font-medium! text-[#0f766e]">
                দায়িত্ব
            </span>
            <span className="absolute right-[10%] top-[12%] h-2.5 w-2.5 rounded-full bg-[#e2a057]" />
        </div>
    );
}

export default function TrustSafety() {
    return (
        <main
            lang="bn"
            className="min-w-0 overflow-x-clip bg-white font-bengali text-[#172b29]"
        >
            {/* Distinct handbook-style cover */}
            <section className="mt-20 bg-[#eaf2ed]">
                <div className={container}>
                    <div className="grid gap-8 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)] lg:items-center lg:gap-14 lg:pb-16 lg:pt-14">
                        <div>
                            <p className="mb-5 text-[0.84rem] font-medium! text-[#5c796f]">
                                মানুষের প্রতি শ্রদ্ধা। তথ্যের প্রতি দায়িত্ব।
                            </p>
                            <h1 className="max-w-[680px] text-[clamp(2rem,3.15vw,3.15rem)] font-semibold! leading-[1.42] tracking-[-0.02em]">
                                সাহায্যের সঙ্গে প্রয়োজন{' '}
                                <span className="text-[#0f766e]">
                                    আস্থা, সতর্কতা ও দায়িত্ব।
                                </span>
                            </h1>
                            <p className="mt-5 max-w-[590px] text-[0.99rem] leading-[1.95] text-[#546961]">
                                Stand For People-এ মানুষের প্রয়োজন ও অংশগ্রহণকে
                                দায়িত্বশীলভাবে পরিচালনা করার জন্য কিছু মৌলিক
                                নীতি অনুসরণ করা হয়। এখানে সেই নীতি,
                                অংশগ্রহণকারীদের দায়িত্ব এবং নিজের নিরাপত্তায়
                                করণীয় বিষয়গুলো সহজভাবে তুলে ধরা হয়েছে।
                            </p>
                            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#c9dcd1] pt-5">
                                {['যাচাই', 'দায়িত্ব', 'তথ্যের সুরক্ষা'].map(
                                    (item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center gap-2 text-[0.85rem] text-[#345d51]"
                                        >
                                            <TbCircleCheck
                                                size={17}
                                                className="text-[#0f766e]"
                                            />
                                            {item}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                        <div className="border-t border-[#c9dcd1] pt-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                            <ShieldArtwork />
                            <p className="mx-auto max-w-[300px] text-center text-[0.84rem] leading-[1.75] text-[#62796e]">
                                সচেতন সিদ্ধান্তই নিরাপদ সহযোগিতার প্রথম ধাপ।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial statement rather than standard split headline */}
            <section className="bg-white py-14 sm:py-16 lg:py-20">
                <div className={container}>
                    <div className="grid gap-7 md:grid-cols-[0.36fr_0.64fr] md:gap-12 lg:gap-20">
                        <div>
                            <Kicker>আমাদের দৃষ্টিভঙ্গি</Kicker>
                            <div className="mt-5 hidden h-px w-16 bg-[#df9b52] md:block" />
                        </div>
                        <div>
                            <h2 className="max-w-[760px] text-[clamp(1.65rem,2.4vw,2.4rem)] font-semibold! leading-[1.55]">
                                বিশ্বাস কোনো প্রতিশ্রুতির শব্দ নয়—
                                <span className="text-[#0f766e]">
                                    এটি দায়িত্বশীল আচরণের ফল।
                                </span>
                            </h2>
                            <div className="mt-6 grid gap-5 border-t border-[#e0e8e2] pt-6 sm:grid-cols-2 sm:gap-8">
                                <p className="text-[0.94rem] leading-[1.95] text-[#5d6e66]">
                                    একটি মানবিক প্ল্যাটফর্মে কেউ সহায়তা চান, কেউ
                                    সময় দেন, আবার কোনো সংগঠন নিজের সক্ষমতা নিয়ে
                                    পাশে দাঁড়ায়। এই অংশগ্রহণ যেন দায়িত্বশীলভাবে
                                    হয়, সেটিই আমাদের নিরাপত্তা নীতির উদ্দেশ্য।
                                </p>
                                <p className="text-[0.94rem] leading-[1.95] text-[#5d6e66]">
                                    কোনো অনলাইন প্ল্যাটফর্মই সব ঝুঁকি সম্পূর্ণ
                                    দূর করতে পারে না। তাই যাচাই, সতর্কতা এবং
                                    দায়িত্বশীল ব্যবহার—তিনটিই গুরুত্বপূর্ণ।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* A reference manual with featured principle + two supporting columns */}
            <section className="bg-[#f5f6f1] py-14 sm:py-16 lg:py-20">
                <div className={container}>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-10">
                        <div>
                            <Kicker>নিরাপত্তার ভিত্তি</Kicker>
                            <h2 className="mt-4 text-[clamp(1.7rem,2.5vw,2.45rem)] font-semibold! leading-[1.5]">
                                আমাদের কাজের{' '}
                                <span className="text-[#0f766e]">
                                    তিনটি মূল নীতি
                                </span>
                            </h2>
                        </div>
                        <p className="max-w-[350px] text-[0.92rem] leading-[1.85] text-[#64736b]">
                            প্রতিটি অংশগ্রহণে স্বচ্ছতা, দায়িত্ব ও তথ্যের যথাযথ
                            ব্যবহারকে গুরুত্ব দেওয়া হয়।
                        </p>
                    </div>
                    <div className="mt-9 grid gap-4 md:grid-cols-2 lg:mt-11 lg:grid-cols-[1.1fr_1fr_1fr] lg:gap-5">
                        {principles.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <article
                                    key={item.number}
                                    className={`flex min-w-0 flex-col p-6 sm:p-7 ${index === 0 ? 'bg-[#15594f] text-white md:row-span-2 lg:row-span-1' : 'border border-[#d9e3d9] bg-white'}`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center ${index === 0 ? 'bg-white/12 text-white' : 'bg-[#e8f1eb] text-[#0f766e]'}`}
                                        >
                                            <Icon size={25} strokeWidth={1.4} />
                                        </div>
                                        <span
                                            className={`text-[0.82rem] ${index === 0 ? 'text-white/65' : 'text-[#87978b]'}`}
                                        >
                                            {item.number}
                                        </span>
                                    </div>
                                    <div className="mt-8 lg:mt-11">
                                        <p
                                            className={`text-[0.8rem] ${index === 0 ? 'text-[#b8d7cb]' : 'text-[#0f766e]'}`}
                                        >
                                            {item.label}
                                        </p>
                                        <h3
                                            className={`mt-2 text-[1.18rem] font-semibold! leading-[1.6] ${index === 0 ? 'text-white!' : 'text-[#172b29]'}`}
                                        >
                                            {item.title}
                                        </h3>
                                        <p
                                            className={`mt-3 text-[0.92rem] leading-[1.9] ${index === 0 ? 'text-white/80' : 'text-[#617168]'}`}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Participation: separate document-like panels */}
            <section className="bg-white py-14 sm:py-16 lg:py-20">
                <div className={container}>
                    <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
                        <div>
                            <Kicker>অংশগ্রহণকারীদের জন্য</Kicker>
                            <h2 className="mt-4 max-w-[450px] text-[clamp(1.7rem,2.5vw,2.45rem)] font-semibold! leading-[1.55]">
                                ভূমিকা আলাদা,{' '}
                                <span className="text-[#0f766e]">
                                    দায়িত্ব সবার।
                                </span>
                            </h2>
                            <p className="mt-4 max-w-[430px] text-[0.94rem] leading-[1.9] text-[#637168]">
                                নিজের ভূমিকা, সক্ষমতা এবং সীমা সম্পর্কে পরিষ্কার
                                থাকা নিরাপদ ও কার্যকর সহযোগিতার একটি
                                গুরুত্বপূর্ণ শর্ত।
                            </p>
                            <div className="mt-7 hidden border-l-[3px] border-[#d99a55] pl-4 lg:block">
                                <p className="max-w-[320px] text-[0.91rem] leading-[1.85] text-[#5f7268]">
                                    সহযোগিতা তখনই অর্থবহ হয়, যখন প্রত্যেকে নিজের
                                    দায়িত্ব সম্পর্কে সচেতন থাকেন।
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-[#d6e1d9]">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <article
                                        key={role.number}
                                        className="grid gap-4 border-b border-[#d6e1d9] py-6 sm:grid-cols-[56px_1fr] sm:gap-6 sm:py-7"
                                    >
                                        <div className="flex items-center gap-3 sm:block">
                                            <span className="text-[0.8rem] text-[#84988a]">
                                                {role.number}
                                            </span>
                                            <Icon
                                                size={25}
                                                strokeWidth={1.3}
                                                className="text-[#0f766e] sm:mt-4"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-[1.15rem] font-semibold! leading-[1.6]">
                                                {role.title}
                                            </h3>
                                            <p className="mt-2 max-w-[570px] text-[0.93rem] leading-[1.9] text-[#607068]">
                                                {role.description}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Visually distinctive practical safety board */}
            <section className="bg-[#163f39] py-14 text-white sm:py-16 lg:py-20">
                <div className={container}>
                    <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
                        <div>
                            <Kicker inverse>নিজের নিরাপত্তায় করণীয়</Kicker>
                            <h2 className="mt-4 max-w-[480px] text-[clamp(1.75rem,2.6vw,2.55rem)] font-semibold! leading-[1.5] text-white!">
                                একটু সতর্কতা{' '}
                                <span className="text-[#efbb80]">
                                    অনেক ঝুঁকি কমাতে পারে।
                                </span>
                            </h2>
                            <p className="mt-5 max-w-[440px] text-[0.94rem] leading-[1.95] text-white/75">
                                কোনো ব্যক্তি, সংগঠন বা সহায়তার পরিস্থিতি
                                সম্পর্কে গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার আগে
                                প্রয়োজনীয় তথ্য নিজে যাচাই করুন। সংবেদনশীল
                                ব্যক্তিগত ও আর্থিক তথ্য অপ্রয়োজনে প্রকাশ করবেন
                                না।
                            </p>
                            <div className="mt-7 flex items-center gap-3 text-[#f0bf87]">
                                <TbAlertTriangle size={23} strokeWidth={1.5} />
                                <span className="text-[0.9rem] font-medium!">
                                    সিদ্ধান্তের আগে যাচাই করুন
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#f8f8f3] p-5 text-[#172b29] sm:p-7 lg:p-8">
                            <div className="flex items-center justify-between gap-4 border-b border-[#d9e2da] pb-5">
                                <div className="flex items-center gap-3">
                                    <TbClipboardCheck
                                        size={23}
                                        className="text-[#0f766e]"
                                    />
                                    <h3 className="text-[1.13rem] font-semibold!">
                                        নিরাপত্তা যাচাইতালিকা
                                    </h3>
                                </div>
                                <span className="text-[0.82rem] text-[#7c8d82]">
                                    চারটি বিষয়
                                </span>
                            </div>
                            <ol className="divide-y divide-[#e1e7df]">
                                {checklist.map((item, index) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-4 py-4 sm:py-5"
                                    >
                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-[#e5f0e9] text-[#0f766e]">
                                            <TbCircleCheck size={18} />
                                        </span>
                                        <span className="flex-1 text-[0.94rem] leading-[1.85]">
                                            {item}
                                        </span>
                                        <span className="shrink-0 text-[0.79rem] text-[#8c9b90]">
                                            {'০১২৩৪৫৬৭৮৯'[0]}
                                            {'০১২৩৪৫৬৭৮৯'[index + 1]}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* Caution notice */}
            <section className="bg-[#f7f2e9] py-12 sm:py-14 lg:py-16">
                <div className={container}>
                    <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-12">
                        <div className="flex items-start gap-3 text-[#9b622f]">
                            <TbInfoCircle size={24} strokeWidth={1.5} />
                            <span className="pt-0.5 text-[0.88rem] font-semibold!">
                                গুরুত্বপূর্ণ সীমাবদ্ধতা
                            </span>
                        </div>
                        <div>
                            <h2 className="max-w-[790px] text-[clamp(1.5rem,2.1vw,2.1rem)] font-semibold! leading-[1.55]">
                                প্রযুক্তি সহায়তা করতে পারে,{' '}
                                <span className="text-[#0f766e]">
                                    কিন্তু সব ঝুঁকি দূর করতে পারে না।
                                </span>
                            </h2>
                            <p className="mt-4 max-w-[820px] text-[0.94rem] leading-[1.95] text-[#626e62]">
                                Stand For People-এর পরিচয় যাচাই বা প্ল্যাটফর্ম
                                পর্যায়ের সুরক্ষাব্যবস্থা কোনো ব্যক্তি, সংগঠন বা
                                পরিস্থিতি সম্পর্কে সম্পূর্ণ নিশ্চয়তা দেয় না।
                                বাস্তব পরিস্থিতিতে প্রয়োজনীয় সতর্কতা ও নিজস্ব
                                যাচাই সবসময় গুরুত্বপূর্ণ।
                            </p>
                            <p className="mt-4 max-w-[820px] border-l-[3px] border-[#d9a16b] pl-4 text-[0.92rem] leading-[1.9] text-[#626e62]">
                                বিশেষ করে অর্থ, ব্যক্তিগত নিরাপত্তা, চিকিৎসা বা
                                অন্য কোনো গুরুতর বিষয়ে সিদ্ধান্ত নেওয়ার আগে
                                যথাযথ স্থানীয় কর্তৃপক্ষ বা উপযুক্ত পেশাদার উৎসের
                                সহায়তা নেওয়া প্রয়োজন হতে পারে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing as a slim guide continuation */}
            <section className="bg-white py-12 sm:py-14 lg:py-16">
                <div className={container}>
                    <div className="flex flex-col gap-6 border-t border-[#d7e2d9] pt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                        <div>
                            <Kicker>পরবর্তী ধাপ</Kicker>
                            <h2 className="mt-3 text-[clamp(1.45rem,2.1vw,2.05rem)] font-semibold! leading-[1.55]">
                                নিরাপদ অংশগ্রহণ শুরু হয়{' '}
                                <span className="text-[#0f766e]">
                                    সঠিকভাবে জানার মাধ্যমে।
                                </span>
                            </h2>
                        </div>
                        <Link
                            to="/how-it-works"
                            className="group inline-flex w-fit shrink-0 items-center gap-3 border-b border-[#0f766e] pb-2 text-[0.93rem] font-semibold! text-[#0f766e] transition-colors hover:text-[#095f58] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
                        >
                            কীভাবে কাজ করে দেখুন{' '}
                            <TbArrowUpRight
                                size={19}
                                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
