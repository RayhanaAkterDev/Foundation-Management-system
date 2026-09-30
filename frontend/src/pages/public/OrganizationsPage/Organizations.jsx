import { Link } from 'react-router-dom';

import {
    TbArrowDown,
    TbArrowUpRight,
    TbBuildingCommunity,
    TbHeartHandshake,
    TbMapPin,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

import OrganizationList from './components/OrganizationList';
import OrganizationFAQ from './components/OrganizationFAQ';

const roles = [
    {
        number: '০১',
        icon: TbHeartHandshake,
        title: 'মানবিক উদ্যোগ',
        description:
            'প্রয়োজনকে কেন্দ্র করে ক্যাম্পেইন ও সহায়তা কার্যক্রম পরিচালনা।',
    },
    {
        number: '০২',
        icon: TbUsers,
        title: 'স্বেচ্ছাসেবী সমন্বয়',
        description:
            'স্বেচ্ছাসেবী ও স্থানীয় মানুষের সঙ্গে সমন্বয় করে কাজ এগিয়ে নেওয়া।',
    },
    {
        number: '০৩',
        icon: TbMapPin,
        title: 'স্থানীয় সহায়তা',
        description:
            'স্থানীয় উপস্থিতি ও সক্ষমতা কাজে লাগিয়ে মানুষের কাছে সহায়তা পৌঁছানো।',
    },
];

const Organizations = () => {
    return (
        <main
            lang="bn"
            className="
                min-h-screen
                bg-background
                pt-20
                font-bengali
            "
        >
            {/* =========================================================
                HERO
            ========================================================== */}

            <section
                className="
                    border-b
                    border-border
                    bg-surface
                "
            >
                <div className="container-width">
                    <div
                        className="
                            grid
                            gap-10
                            py-12

                            sm:py-16

                            lg:grid-cols-[minmax(0,1fr)_360px]
                            lg:items-center
                            lg:gap-16
                            lg:py-20

                            xl:grid-cols-[minmax(0,1fr)_400px]
                            xl:gap-24
                            xl:py-24
                        "
                    >
                        {/* LEFT */}

                        <div className="max-w-[780px]">
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <span className="h-px w-8 bg-primary" />

                                <p
                                    className="
                                        text-[12px]
                                        font-medium
                                        text-primary

                                        sm:text-[13px]
                                    "
                                >
                                    সংযুক্ত প্রতিষ্ঠান
                                </p>
                            </div>

                            <h1
                                className="
                                    font-bengali
                                    text-[2.15rem]
                                    font-medium
                                    leading-[1.4]
                                    tracking-normal
                                    text-text-primary

                                    sm:text-[2.7rem]

                                    md:text-[3rem]

                                    lg:text-[3.3rem]
                                    lg:leading-[1.34]

                                    xl:text-[3.55rem]
                                "
                            >
                                মানুষের পাশে কাজ করা
                                <br className="hidden sm:block" />
                                <span className="text-primary">
                                    {' '}
                                    প্রতিষ্ঠানগুলোকে জানুন
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-[650px]

                                    text-[14px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[15px]
                                    sm:leading-8

                                    lg:mt-6
                                    lg:text-base
                                "
                            >
                                স্ট্যান্ড ফর পিপলের সঙ্গে যুক্ত যাচাইকৃত
                                প্রতিষ্ঠানগুলো মানবিক উদ্যোগ পরিচালনা এবং
                                প্রয়োজনীয় মানুষের কাছে সহায়তা পৌঁছে দিতে কাজ
                                করে।
                            </p>

                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3

                                    sm:mt-8
                                "
                            >
                                <a
                                    href="#organizations"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-lg
                                        bg-primary

                                        px-5
                                        py-3

                                        text-[13px]
                                        font-medium
                                        text-white!

                                        transition-colors

                                        hover:bg-primary-hover

                                        sm:px-6
                                        sm:py-3.5
                                        sm:text-[14px]
                                    "
                                >
                                    প্রতিষ্ঠান দেখুন
                                    <TbArrowDown size={17} />
                                </a>

                                <Link
                                    to="/register"
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-lg
                                        border
                                        border-border-strong

                                        bg-surface

                                        px-5
                                        py-3

                                        text-[13px]
                                        font-medium
                                        text-text-primary

                                        transition-colors

                                        hover:border-primary/30
                                        hover:text-primary

                                        sm:px-6
                                        sm:py-3.5
                                        sm:text-[14px]
                                    "
                                >
                                    প্রতিষ্ঠান হিসেবে যুক্ত হন
                                    <TbArrowUpRight size={17} />
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT */}

                        <div
                            className="
                                border-t
                                border-border
                                pt-7

                                lg:border-t-0
                                lg:border-l
                                lg:pl-10
                                lg:pt-0
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3

                                    border-b
                                    border-border

                                    pb-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        size-11
                                        shrink-0
                                        items-center
                                        justify-center

                                        rounded-xl
                                        bg-primary-soft
                                        text-primary
                                    "
                                >
                                    <TbShieldCheck size={22} />
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-[14px]
                                            font-medium
                                            text-text-primary
                                        "
                                    >
                                        যাচাইকৃত প্রতিষ্ঠান
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[12px]
                                            leading-5
                                            text-text-muted
                                        "
                                    >
                                        প্রয়োজনীয় তথ্য যাচাইয়ের পর প্ল্যাটফর্মে
                                        যুক্ত হয়
                                    </p>
                                </div>
                            </div>

                            <div className="py-5">
                                <p
                                    className="
                                        text-[11px]
                                        font-medium
                                        text-text-muted
                                    "
                                >
                                    একসঙ্গে কাজ
                                </p>

                                <p
                                    className="
                                        mt-2

                                        text-[17px]
                                        font-medium
                                        leading-7
                                        text-text-primary

                                        sm:text-[18px]
                                    "
                                >
                                    প্রতিষ্ঠান, স্বেচ্ছাসেবী ও মানুষের মধ্যে
                                    সমন্বিত মানবিক উদ্যোগ।
                                </p>
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2

                                    border-t
                                    border-border

                                    pt-5

                                    text-[12px]
                                    text-text-secondary
                                "
                            >
                                <TbBuildingCommunity
                                    size={17}
                                    className="text-primary"
                                />
                                Stand For People নেটওয়ার্ক
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                ORGANIZATION LIST
            ========================================================== */}

            <OrganizationList />

            {/* =========================================================
                ROLE / IMPACT
            ========================================================== */}

            <section
                className="
                    border-y
                    border-border
                    bg-background-warm
                "
            >
                <div
                    className="
                        container-width

                        py-12

                        sm:py-14
                        lg:py-16
                    "
                >
                    <div
                        className="
                            grid
                            gap-5

                            border-b
                            border-border

                            pb-7

                            sm:pb-8

                            lg:grid-cols-[minmax(0,1fr)_380px]
                            lg:items-end
                            lg:gap-12
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[12px]
                                    font-medium
                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                প্রতিষ্ঠানের ভূমিকা
                            </p>

                            <h2
                                className="
                                    mt-2

                                    max-w-[650px]

                                    font-bengali
                                    text-[1.7rem]
                                    font-medium
                                    leading-[1.45]
                                    tracking-normal
                                    text-text-primary

                                    sm:text-[2rem]

                                    lg:text-[2.2rem]
                                "
                            >
                                একসঙ্গে কাজ করলে সহায়তা আরও সংগঠিত হয়
                            </h2>
                        </div>

                        <p
                            className="
                                max-w-md

                                text-[13px]
                                leading-7
                                text-text-secondary

                                sm:text-[14px]

                                lg:justify-self-end
                            "
                        >
                            সংযুক্ত প্রতিষ্ঠানগুলো নিজেদের অভিজ্ঞতা ও স্থানীয়
                            সক্ষমতা নিয়ে মানবিক কার্যক্রমে অংশ নেয়।
                        </p>
                    </div>

                    <div
                        className="
                            divide-y
                            divide-border

                            md:grid
                            md:grid-cols-3
                            md:divide-x
                            md:divide-y-0
                        "
                    >
                        {roles.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <article
                                    key={item.title}
                                    className={`
                                        py-7

                                        md:px-6
                                        md:py-9

                                        lg:px-8

                                        ${index === 0 ? 'md:pl-0 lg:pl-0' : ''}

                                        ${
                                            index === roles.length - 1
                                                ? 'md:pr-0 lg:pr-0'
                                                : ''
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-5
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                size-10
                                                items-center
                                                justify-center

                                                rounded-lg

                                                bg-primary-soft
                                                text-primary
                                            "
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <span
                                            className="
                                                text-[12px]
                                                font-medium
                                                text-primary/45
                                            "
                                        >
                                            {item.number}
                                        </span>
                                    </div>

                                    <h3
                                        className="
                                            mt-5

                                            text-[16px]
                                            font-medium
                                            text-text-primary

                                            sm:text-[17px]
                                        "
                                    >
                                        {item.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-2

                                            max-w-[300px]

                                            text-[12.5px]
                                            leading-6
                                            text-text-secondary

                                            sm:text-[13px]
                                        "
                                    >
                                        {item.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            

            {/* =========================================================
                FAQ
            ========================================================== */}

            <OrganizationFAQ />
        </main>
    );
};

export default Organizations;
