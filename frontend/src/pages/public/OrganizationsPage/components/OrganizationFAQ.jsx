import { useState } from 'react';
import { Link } from 'react-router-dom';

import { TbArrowUpRight } from 'react-icons/tb';

import { TbChevronDown } from 'react-icons/tb';

const faqs = [
    {
        q: 'কোন প্রতিষ্ঠানগুলো এখানে দেখা যায়?',
        a: 'স্ট্যান্ড ফর পিপলে নিবন্ধিত ও যাচাইকৃত প্রতিষ্ঠানগুলো এখানে দেখা যায়।',
    },
    {
        q: 'একটি প্রতিষ্ঠান কীভাবে যুক্ত হয়?',
        a: 'নিবন্ধনের পর প্রয়োজনীয় তথ্য যাচাই করা হয়। যাচাই সম্পন্ন হলে প্রতিষ্ঠানটি প্ল্যাটফর্মে যুক্ত হয়।',
    },
    {
        q: 'সংযুক্ত প্রতিষ্ঠানগুলো কী করতে পারে?',
        a: 'প্রতিষ্ঠানগুলো মানবিক উদ্যোগ পরিচালনা, সহায়তা কার্যক্রম এবং স্বেচ্ছাসেবী সমন্বয়ে কাজ করতে পারে।',
    },
    {
        q: 'আমি কি তাদের কার্যক্রমে সহায়তা করতে পারি?',
        a: 'হ্যাঁ। প্রতিষ্ঠানের সক্রিয় উদ্যোগে প্রযোজ্য উপায়ে সহায়তা করা যায়।',
    },
];

const OrganizationFAQ = () => {
    const [active, setActive] = useState(0);

    return (
        <section
            className="
                border-t
                border-border
                bg-background
            "
        >
            <div
                className="
                    container-width

                    py-12

                    sm:py-14
                    lg:py-16
                    xl:py-20
                "
            >
                <div
                    className="
                        grid
                        gap-8

                        lg:grid-cols-[320px_minmax(0,1fr)]
                        lg:gap-16

                        xl:grid-cols-[360px_minmax(0,720px)]
                        xl:justify-between
                    "
                >
                    {/* LEFT */}

                    <div>
                        <p
                            className="
                                text-[12px]
                                font-medium!
                                text-primary

                                sm:text-[13px] mt-6
                            "
                        >
                            সাধারণ প্রশ্ন
                        </p>

                        <h2
                            className="
                                mt-2

                                font-bengali
                                text-[1.65rem]
                                font-medium!
                                leading-[1.45]
                                text-text-primary

                                sm:text-[1.9rem]
                                lg:text-[2rem]
                            "
                        >
                            প্রতিষ্ঠান সম্পর্কে
                            <br className="hidden lg:block" /> জানতে চান?
                        </h2>

                        <p
                            className="
                                mt-3

                                max-w-sm

                                text-[13px]
                                leading-7
                                text-text-secondary

                                sm:text-[14px]
                            "
                        >
                            সংযুক্ত প্রতিষ্ঠান ও তাদের কার্যক্রম সম্পর্কে সাধারণ
                            কিছু প্রশ্নের উত্তর।
                        </p>
                    </div>

                    {/* QUESTIONS */}

                    <div className="border-t border-border">
                        {faqs.map((item, index) => {
                            const isOpen = active === index;

                            return (
                                <div
                                    key={item.q}
                                    className="
                                        border-b
                                        border-border
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActive(isOpen ? null : index)
                                        }
                                        aria-expanded={isOpen}
                                        className="
                                            flex
                                            w-full
                                            items-start
                                            justify-between
                                            gap-5

                                            py-5

                                            text-left

                                            sm:py-6
                                        "
                                    >
                                        <span
                                            className="
                                                font-bengali
                                                text-[14px]
                                                font-medium!
                                                leading-7
                                                text-text-primary

                                                sm:text-[15px]

                                                lg:text-[16px]
                                            "
                                        >
                                            {item.q}
                                        </span>

                                        <TbChevronDown
                                            size={18}
                                            className={`
                                                mt-1
                                                shrink-0

                                                text-text-muted

                                                transition-transform
                                                duration-200

                                                ${
                                                    isOpen
                                                        ? 'rotate-180 text-primary'
                                                        : ''
                                                }
                                            `}
                                        />
                                    </button>

                                    <div
                                        className={`
                                            grid
                                            transition-all
                                            duration-300

                                            ${
                                                isOpen
                                                    ? 'grid-rows-[1fr] opacity-100'
                                                    : 'grid-rows-[0fr] opacity-0'
                                            }
                                        `}
                                    >
                                        <div className="overflow-hidden">
                                            <p
                                                className="
                                                    max-w-[620px]

                                                    pb-5

                                                    text-[13px]
                                                    leading-7
                                                    text-text-secondary

                                                    sm:pb-6
                                                    sm:text-[14px]
                                                "
                                            >
                                                {item.a}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =========================================================
                ORGANIZATION CTA
            ========================================================== */}

            <section className="">
                <div className="container-width">
                    <div
                        className=" flex flex-col gap-12
                            py-12
                            sm:py-14
                            lg:py-16
                        "
                    >
                        <div className="max-w-[680px]">
                            <p
                                className="
                                    text-[12px]
                                    font-medium!
                                    text-primary
                                "
                            >
                                আপনার প্রতিষ্ঠান
                            </p>

                            <h2
                                className="
                                    mt-2

                                    font-bengali
                                    text-[1.6rem]
                                    font-medium!
                                    leading-[1.45]
                                    text-text-primary

                                    sm:text-[1.9rem]
                                "
                            >
                                মানবিক কাজে যুক্ত হতে চান?
                            </h2>

                            <p
                                className="
                                    mt-2

                                    text-[13px]
                                    leading-7
                                    text-text-secondary

                                    sm:text-[14px]
                                "
                            >
                                প্রতিষ্ঠান হিসেবে নিবন্ধন করে Stand For
                                People-এর মাধ্যমে মানবিক উদ্যোগে অংশ নিন।
                            </p>
                        </div>

                        <Link
                            to="/register"
                            className="
                                inline-flex
                                w-fit
                                items-center
                                justify-center
                                gap-2

                                rounded-lg

                                bg-primary

                                px-5
                                py-3

                                text-[13px]
                                font-medium!
                                text-white!

                                transition-colors

                                hover:bg-primary-hover

                                sm:px-6
                                sm:py-3.5
                                sm:text-[14px]
                            "
                        >
                            প্রতিষ্ঠান নিবন্ধন করুন
                            <TbArrowUpRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default OrganizationFAQ;
