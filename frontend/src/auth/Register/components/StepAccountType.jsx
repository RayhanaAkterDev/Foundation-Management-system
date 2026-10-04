import React from 'react';
import {
    Building2,
    Check,
    HandHeart,
    UserRound,
    UsersRound,
} from 'lucide-react';

const ACCOUNT_TYPES = [
    {
        value: 'individual',
        icon: UserRound,
        eyebrow: 'ব্যক্তিগত অ্যাকাউন্ট',
        title: 'একজন ব্যক্তি হিসেবে',
        description:
            'সহায়তা দিন, স্বেচ্ছাসেবায় যুক্ত হোন অথবা প্রয়োজনের সময় সহায়তা খুঁজুন।',
        points: ['সহায়তা দিন', 'স্বেচ্ছাসেবায় যুক্ত হোন', 'সহায়তা খুঁজুন'],
    },
    {
        value: 'organization',
        icon: Building2,
        eyebrow: 'সংস্থার অ্যাকাউন্ট',
        title: 'একটি সংস্থার পক্ষ থেকে',
        description:
            'মানবিক কার্যক্রম, ক্যাম্পেইন ও স্বেচ্ছাসেবকদের সমন্বয় করুন।',
        points: [
            'ক্যাম্পেইন পরিচালনা',
            'স্বেচ্ছাসেবক সমন্বয়',
            'কমিউনিটির সঙ্গে কাজ',
        ],
    },
];

const StepAccountType = ({ accountType, onSelect, error }) => {
    return (
        <div className="w-full">
            {/* =====================================================
                INTRO
            ====================================================== */}
            <header className="max-w-[720px]">
                <div className="flex items-center gap-2.5">
                    <span className="h-[2px] w-7 rounded-full bg-[#0f766e]" />

                    <p className="font-['Noto_Sans_Bengali'] text-[14px] font-semibold text-[#0f766e]">
                        অ্যাকাউন্ট নির্বাচন
                    </p>
                </div>

                <h1 className="mt-3.5 max-w-[680px] font-['Noto_Sans_Bengali'] text-[27px] font-semibold leading-[1.45] tracking-[-0.012em] text-[#0f172a] sm:text-[31px]">
                    আপনি কীভাবে Stand For People-এর
                    <br className="hidden sm:block" /> সঙ্গে যুক্ত হতে চান?
                </h1>

                <p className="mt-3 max-w-[610px] font-['Noto_Sans_Bengali'] text-[15px] leading-7 text-[#64748b]">
                    আপনার ভূমিকার সঙ্গে মিল রেখে একটি অ্যাকাউন্টের ধরন নির্বাচন
                    করুন।
                </p>
            </header>

            {/* =====================================================
                ERROR
            ====================================================== */}
            {error && (
                <div
                    role="alert"
                    className="mt-5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3"
                >
                    <p className="font-['Noto_Sans_Bengali'] text-[14px] leading-6 text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* =====================================================
                ACCOUNT TYPE CARDS
            ====================================================== */}
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:gap-5">
                {ACCOUNT_TYPES.map((option) => {
                    const Icon = option.icon;
                    const selected = accountType === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSelect(option.value)}
                            aria-pressed={selected}
                            className={`
                                group
                                relative
                                flex
                                min-h-[305px]
                                overflow-hidden
                                rounded-[18px]
                                border
                                text-left
                                outline-none
                                transition-all
                                duration-200

                                focus-visible:ring-4
                                focus-visible:ring-[#0f766e]/10

                                ${
                                    selected
                                        ? 'border-[#0f766e] bg-[#f7fbfa] shadow-[0_14px_35px_rgba(15,78,74,0.08)]'
                                        : 'border-[#dce5e4] bg-white hover:border-[#9fc3bd] hover:shadow-[0_12px_32px_rgba(15,23,42,0.05)]'
                                }
                            `}
                        >
                            {/* =================================================
                                SELECTED TOP LINE
                            ================================================== */}
                            <span
                                className={`
                                    absolute
                                    left-0
                                    right-0
                                    top-0
                                    h-[4px]
                                    bg-[#0f766e]
                                    transition-opacity
                                    duration-200

                                    ${selected ? 'opacity-100' : 'opacity-0'}
                                `}
                            />

                            <div className="flex h-full w-full flex-col p-5 sm:p-6 lg:p-6">
                                {/* =================================================
                                    TOP
                                ================================================== */}
                                <div className="flex items-start justify-between gap-4">
                                    {/* Icon */}
                                    <span
                                        className={`
                                            flex
                                            h-[52px]
                                            w-[52px]
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-[12px]
                                            border
                                            transition-all
                                            duration-200

                                            ${
                                                selected
                                                    ? 'border-[#0f766e] bg-[#0f766e] text-white'
                                                    : 'border-[#dbe5e3] bg-[#edf4f2] text-[#315e58] group-hover:border-[#bfd5d1] group-hover:bg-[#e6f3f1]'
                                            }
                                        `}
                                    >
                                        <Icon
                                            className="h-[23px] w-[23px]"
                                            strokeWidth={1.7}
                                        />
                                    </span>

                                    {/* Radio */}
                                    <span
                                        className={`
                                            flex
                                            h-[27px]
                                            w-[27px]
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border-[1.5px]
                                            transition-all
                                            duration-200

                                            ${
                                                selected
                                                    ? 'border-[#0f766e] bg-[#0f766e] text-white'
                                                    : 'border-[#c7d3d1] bg-white group-hover:border-[#7faea6]'
                                            }
                                        `}
                                    >
                                        {selected && (
                                            <Check
                                                className="h-[14px] w-[14px]"
                                                strokeWidth={2.8}
                                            />
                                        )}
                                    </span>
                                </div>

                                {/* =================================================
                                    COPY
                                ================================================== */}
                                <div className="mt-5">
                                    <p
                                        className={`
                                            font-['Noto_Sans_Bengali']
                                            text-[13px]
                                            font-semibold
                                            transition-colors

                                            ${
                                                selected
                                                    ? 'text-[#0f766e]'
                                                    : 'text-[#73837f]'
                                            }
                                        `}
                                    >
                                        {option.eyebrow}
                                    </p>

                                    <h2 className="mt-1.5 font-['Noto_Sans_Bengali'] text-[21px] font-semibold leading-[1.55] text-[#0f172a] sm:text-[22px]">
                                        {option.title}
                                    </h2>

                                    <p className="mt-2 max-w-[330px] font-['Noto_Sans_Bengali'] text-[14px] leading-[1.8] text-[#64748b]">
                                        {option.description}
                                    </p>
                                </div>

                                {/* =================================================
                                    CAPABILITIES
                                ================================================== */}
                                <div
                                    className={`
                                        mt-5
                                        border-t
                                        pt-4

                                        ${
                                            selected
                                                ? 'border-[#d5e7e3]'
                                                : 'border-[#e7eceb]'
                                        }
                                    `}
                                >
                                    <div className="grid gap-2">
                                        {option.points.map((point) => (
                                            <div
                                                key={point}
                                                className="flex items-center gap-2.5"
                                            >
                                                <span
                                                    className={`
                                                        flex
                                                        h-[18px]
                                                        w-[18px]
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full

                                                        ${
                                                            selected
                                                                ? 'bg-[#dcefeb] text-[#0f766e]'
                                                                : 'bg-[#eef3f2] text-[#758884]'
                                                        }
                                                    `}
                                                >
                                                    <Check
                                                        className="h-[10px] w-[10px]"
                                                        strokeWidth={2.6}
                                                    />
                                                </span>

                                                <span className="font-['Noto_Sans_Bengali'] text-[13px] font-medium! leading-6 text-[#596b68]">
                                                    {point}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* =================================================
                                    BOTTOM STATE
                                ================================================== */}
                                <div className="mt-auto pt-4">
                                    <div
                                        className={`
                                            flex
                                            items-center
                                            gap-2.5
                                            border-t
                                            pt-3.5

                                            ${
                                                selected
                                                    ? 'border-[#d5e7e3]'
                                                    : 'border-[#e7eceb]'
                                            }
                                        `}
                                    >
                                        {option.value === 'individual' ? (
                                            <HandHeart
                                                className={`
                                                    h-[16px]
                                                    w-[16px]
                                                    shrink-0

                                                    ${
                                                        selected
                                                            ? 'text-[#0f766e]'
                                                            : 'text-[#7d8e8a]'
                                                    }
                                                `}
                                                strokeWidth={1.8}
                                            />
                                        ) : (
                                            <UsersRound
                                                className={`
                                                    h-[16px]
                                                    w-[16px]
                                                    shrink-0

                                                    ${
                                                        selected
                                                            ? 'text-[#0f766e]'
                                                            : 'text-[#7d8e8a]'
                                                    }
                                                `}
                                                strokeWidth={1.8}
                                            />
                                        )}

                                        <span
                                            className={`
                                                font-['Noto_Sans_Bengali']
                                                text-[13px]
                                                font-semibold
                                                leading-6

                                                ${
                                                    selected
                                                        ? 'text-[#0f766e]'
                                                        : 'text-[#657572]'
                                                }
                                            `}
                                        >
                                            {selected
                                                ? 'নির্বাচিত'
                                                : 'এই অ্যাকাউন্ট নির্বাচন করুন'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* =====================================================
                CONTEXT
            ====================================================== */}
            <div className="mt-5 flex items-start gap-2.5">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#91a39f]" />

                <p className="font-['Noto_Sans_Bengali'] text-[13px] leading-6 text-[#7b8987]">
                    পরবর্তী ধাপে আপনার নির্বাচিত অ্যাকাউন্ট অনুযায়ী প্রয়োজনীয়
                    তথ্য চাওয়া হবে।
                </p>
            </div>
        </div>
    );
};

export default StepAccountType;
