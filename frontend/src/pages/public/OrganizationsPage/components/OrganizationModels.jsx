import { useState } from 'react';

import {
    TbBuildingCommunity,
    TbHeartHandshake,
    TbTargetArrow,
    TbUsers,
    TbChartDots3,
} from 'react-icons/tb';

const data = [
    {
        icon: TbHeartHandshake,
        title: 'মানবিক উদ্যোগ পরিচালনা',
        desc: 'সংযুক্ত প্রতিষ্ঠানগুলো স্ট্যান্ড ফর পিপলের মাধ্যমে বিভিন্ন মানবিক উদ্যোগ ও ক্যাম্পেইন পরিচালনা করে এবং প্রয়োজনীয় সহায়তা মানুষের কাছে পৌঁছে দিতে কাজ করে।',
        best: 'ক্যাম্পেইন ও সহায়তা কার্যক্রম',
    },
    {
        icon: TbTargetArrow,
        title: 'স্থানীয় প্রয়োজনের সঙ্গে যুক্ত হওয়া',
        desc: 'প্রতিষ্ঠানগুলো যাচাইকৃত সহায়তার প্রয়োজনের সঙ্গে যুক্ত হয়ে নির্দিষ্ট মানুষ ও কমিউনিটির জন্য কার্যকর সহায়তা কার্যক্রম পরিচালনা করতে পারে।',
        best: 'স্থানীয় ও কমিউনিটি পর্যায়ের কাজ',
    },
    {
        icon: TbUsers,
        title: 'স্বেচ্ছাসেবী সমন্বয়',
        desc: 'চলমান উদ্যোগের জন্য স্বেচ্ছাসেবীদের সঙ্গে সমন্বয় করে মাঠপর্যায়ের কাজ আরও সংগঠিতভাবে পরিচালনা করা যায়।',
        best: 'স্বেচ্ছাসেবী ও মাঠপর্যায়ের কার্যক্রম',
    },
    {
        icon: TbBuildingCommunity,
        title: 'কমিউনিটির পাশে থাকা',
        desc: 'নিজস্ব অভিজ্ঞতা, সক্ষমতা ও স্থানীয় উপস্থিতি কাজে লাগিয়ে প্রতিষ্ঠানগুলো দীর্ঘমেয়াদি মানবিক সহায়তা ও কমিউনিটি উন্নয়নে ভূমিকা রাখে।',
        best: 'স্থানীয় প্রতিষ্ঠান ও কমিউনিটি সংগঠন',
    },
    {
        icon: TbChartDots3,
        title: 'সমন্বিতভাবে কাজ করা',
        desc: 'একটি কেন্দ্রীয় প্ল্যাটফর্মে উদ্যোগ, স্বেচ্ছাসেবী ও সহায়তার তথ্য সমন্বয় করে প্রতিষ্ঠানগুলো তাদের কার্যক্রম আরও সুসংগঠিতভাবে পরিচালনা করতে পারে।',
        best: 'প্রতিষ্ঠান ও মানবিক উদ্যোগ',
    },
];

const PartnerModels = () => {
    const [active, setActive] = useState(0);

    return (
        <section className="mt-14 bg-primary py-12 text-white sm:mt-20 sm:py-20">
            <div className="container-width">
                {/* HEADER */}
                <div className="px-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-sm">
                        কীভাবে প্রতিষ্ঠানগুলো কাজ করে
                    </p>

                    <h2
                        className="
                            mt-3
                            max-w-3xl
                            text-xl
                            font-semibold
                            leading-tight
                            sm:text-3xl
                            lg:text-5xl
                        "
                    >
                        মানবিক সহায়তায় একসঙ্গে কাজ করার বিভিন্ন উপায়
                    </h2>

                    <p
                        className="
                            mt-3
                            max-w-2xl
                            text-xs
                            leading-relaxed
                            text-white/70
                            sm:text-sm
                            lg:text-base
                        "
                    >
                        সংযুক্ত প্রতিষ্ঠানগুলো তাদের নিজস্ব সক্ষমতা ও অভিজ্ঞতা
                        অনুযায়ী বিভিন্ন মানবিক কার্যক্রমে অংশগ্রহণ করে।
                    </p>
                </div>

                {/* LIST */}
                <div className="mt-8 divide-y divide-white/10 px-4 sm:mt-12">
                    {data.map((item, index) => {
                        const isActive = active === index;
                        const Icon = item.icon;

                        return (
                            <div key={item.title} className="py-4 sm:py-6">
                                <button
                                    type="button"
                                    onClick={() => setActive(index)}
                                    aria-expanded={isActive}
                                    className="
                                        flex
                                        w-full
                                        items-start
                                        justify-between
                                        gap-4
                                        text-left
                                        sm:gap-6
                                    "
                                >
                                    {/* LEFT */}
                                    <div className="flex min-w-0 gap-3 sm:gap-5">
                                        <div className="mt-0.5 shrink-0 text-white/80">
                                            <Icon className="text-base sm:text-xl" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    leading-snug
                                                    sm:text-lg
                                                    lg:text-2xl
                                                "
                                            >
                                                {item.title}
                                            </h3>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[10px]
                                                    leading-snug
                                                    text-white/50
                                                    sm:text-xs
                                                    lg:text-sm
                                                "
                                            >
                                                {item.best}
                                            </p>
                                        </div>
                                    </div>

                                    {/* TOGGLE */}
                                    <div
                                        className="
                                            shrink-0
                                            text-lg
                                            leading-none
                                            text-white/50
                                            sm:text-2xl
                                        "
                                        aria-hidden="true"
                                    >
                                        {isActive ? '−' : '+'}
                                    </div>
                                </button>

                                {/* CONTENT */}
                                <div
                                    className={`
                                        overflow-hidden
                                        transition-all
                                        duration-300
                                        ease-in-out
                                        ${
                                            isActive
                                                ? 'mt-2 max-h-40 sm:mt-3'
                                                : 'max-h-0'
                                        }
                                    `}
                                >
                                    <p
                                        className="
                                            max-w-2xl
                                            pl-7
                                            text-xs
                                            leading-relaxed
                                            text-white/70
                                            sm:pl-10
                                            sm:text-sm
                                            lg:text-base
                                        "
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PartnerModels;
