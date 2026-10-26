import React from 'react';

import { Link } from 'react-router-dom';
import { ArrowDown, HeartHandshake } from 'lucide-react';
import {
    TbFingerprint,
    TbMapPinCheck,
    TbSparkles,
    TbMedicalCross,
} from 'react-icons/tb';
import networkNodes from './data';

import {
    TbArrowDown,
    TbArrowRight,
    TbArrowUpRight,
    TbCheck,
    TbHeartHandshake,
    TbMapPin,
    TbRobot,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

// UnderstandingDiagram — merged into the main page
const insights = [
    {
        label: 'অবস্থান',
        value: 'ঢাকা',
        icon: TbMapPin,
    },
    {
        label: 'প্রয়োজনের ধরন',
        value: 'চিকিৎসা সহায়তা',
        icon: TbMedicalCross,
    },
    {
        label: 'জরুরিতা',
        value: 'উচ্চ',
        emphasis: true,
    },
    {
        label: 'বিভাগ',
        value: 'স্বাস্থ্যসেবা',
    },
];

const UnderstandingDiagram = () => {
    return (
        <div className="mx-auto w-full max-w-140 font-bengali">
            {/* RAW REQUEST */}

            <div
                className="
                    border-l-2
                    border-primary
                    bg-[#f7f6f1]
                    px-5
                    py-5

                    sm:px-6
                    sm:py-6
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-5
                    "
                >
                    <span
                        className="
                            text-[0.72rem]
                            font-semibold
                            text-text-muted
                        "
                    >
                        আসা অনুরোধ
                    </span>

                    <span
                        className="
                            flex
                            items-center
                            gap-2
                            text-[0.7rem]
                            font-medium!
                            text-primary
                        "
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        প্রাথমিক তথ্য
                    </span>
                </div>

                <p
                    className="
                        mt-5
                        text-[1.05rem]
                        font-medium!
                        leading-[1.75]

                        sm:text-[1.05rem]
                    "
                >
                    “ঢাকায় আমার বাবার জন্য জরুরি ওষুধ প্রয়োজন।”
                </p>
            </div>

            {/* FLOW */}

            <div
                className="
                    flex
                    h-16
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-1
                        text-primary
                    "
                >
                    <TbSparkles size={17} />

                    <TbArrowDown size={15} />
                </div>
            </div>

            {/* STRUCTURED */}

            <div className="border border-black/10 bg-white">
                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        border-black/10
                        px-5
                        py-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-6
                    "
                >
                    <div>
                        <span
                            className="
                                text-[0.72rem]
                                text-text-muted
                            "
                        >
                            প্রযুক্তিগত বিশ্লেষণের পর
                        </span>

                        <h4
                            className="
                                mt-1
                                text-[1rem]
                                font-semibold
                            "
                        >
                            সংগঠিত প্রয়োজনের তথ্য
                        </h4>
                    </div>

                    <span
                        className="
                            text-[0.78rem]
                            font-semibold
                            text-primary
                        "
                    >
                        আস্থা ৯৬%
                    </span>
                </div>

                <div className="grid grid-cols-2">
                    {insights.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className={`
                                    min-h-22
                                    px-5
                                    py-5

                                    ${
                                        index % 2 === 1
                                            ? 'border-l border-black/10'
                                            : ''
                                    }

                                    ${
                                        index >= 2
                                            ? 'border-t border-black/10'
                                            : ''
                                    }

                                    ${item.emphasis ? 'bg-[#edf4f1]' : ''}
                                `}
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    {Icon && (
                                        <Icon
                                            size={15}
                                            className="text-primary"
                                        />
                                    )}

                                    <span
                                        className="
                                            text-[0.7rem]
                                            text-text-muted
                                        "
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                <strong
                                    className="
                                        mt-3
                                        block
                                        text-[0.95rem]
                                        font-semibold
                                    "
                                >
                                    {item.value}
                                </strong>
                            </div>
                        );
                    })}
                </div>

                <div className="px-5 py-5 sm:px-6">
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            text-[0.72rem]
                            text-text-muted
                        "
                    >
                        <span>তথ্যের স্পষ্টতা</span>
                        <span>৯৬%</span>
                    </div>

                    <div
                        className="
                            mt-3
                            h-1.5
                            overflow-hidden
                            bg-[#e6e9e7]
                        "
                    >
                        <div className="h-full w-[96%] bg-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// TrustDiagram — merged into the main page
const checks = [
    {
        number: '০১',
        title: 'পরিচয় যাচাই',
        description: 'প্রয়োজনীয় পরিচয়সংক্রান্ত তথ্য যাচাই',
        icon: TbFingerprint,
    },
    {
        number: '০২',
        title: 'ডুপ্লিকেট শনাক্তকরণ',
        description: 'একই বা পুনরাবৃত্ত অনুরোধ শনাক্ত করা',
        icon: TbShieldCheck,
    },
    {
        number: '০৩',
        title: 'অবস্থান যাচাই',
        description: 'প্রদত্ত অবস্থানের প্রাসঙ্গিকতা যাচাই',
        icon: TbMapPinCheck,
    },
    {
        number: '০৪',
        title: 'মানবিক পর্যালোচনা',
        description: 'চূড়ান্ত সিদ্ধান্তে মানুষের পর্যালোচনা',
        icon: TbUsers,
    },
];

const TrustDiagram = () => {
    return (
        <div className="mx-auto w-full max-w-140 font-bengali">
            <div
                className="
                    flex
                    items-end
                    justify-between
                    gap-6
                    border-b
                    border-black/10
                    pb-5
                "
            >
                <div>
                    <span
                        className="
                            text-[0.72rem]
                            text-text-muted
                        "
                    >
                        যাচাইয়ের অবস্থা
                    </span>

                    <h4
                        className="
                            mt-1
                            text-[1.05rem]
                            font-semibold
                        "
                    >
                        বহুস্তর যাচাই
                    </h4>
                </div>

                <div className="text-right">
                    <strong
                        className="
                            text-[2rem]
                            font-medium!
                            leading-none
                            text-primary
                        "
                    >
                        ৯৪
                    </strong>

                    <span
                        className="
                            mt-1
                            block
                            text-[0.68rem]
                            text-text-muted
                        "
                    >
                        বিশ্বাসযোগ্যতা সূচক
                    </span>
                </div>
            </div>

            <div>
                {checks.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.number}
                            className="
                                grid
                                grid-cols-[20px_32px_minmax(0,1fr)_24px]
                                items-center
                                gap-3
                                border-b
                                border-black/8
                                py-5
                            "
                        >
                            <span
                                className="
                                    text-[0.7rem]
                                    text-text-muted
                                "
                            >
                                {item.number}
                            </span>

                            <span
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#eaf2ee]
                                    text-primary
                                "
                            >
                                <Icon size={17} strokeWidth={1.4} />
                            </span>

                            <div>
                                <h5
                                    className="
                                        text-[0.9rem]
                                        font-semibold
                                    "
                                >
                                    {item.title}
                                </h5>

                                <p
                                    className="
                                        mt-1
                                        text-[0.72rem]
                                        leading-[1.6]
                                        text-text-muted
                                    "
                                >
                                    {item.description}
                                </p>
                            </div>

                            <span
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-primary
                                    text-white
                                "
                            >
                                <TbCheck size={14} />
                            </span>
                        </div>
                    );
                })}
            </div>

            <p
                className="
                    mt-5
                    text-[0.72rem]
                    leading-[1.7]
                    text-text-muted
                "
            >
                পরবর্তী ধাপে যাওয়ার আগে একাধিক যাচাই সংকেত বিবেচনা করা হয়।
            </p>
        </div>
    );
};

// PriorityDiagram — merged into the main page
const cases = [
    {
        rank: '০১',
        title: 'জরুরি চিকিৎসা',
        level: 'তাৎক্ষণিক ব্যবস্থা',
        score: '৯৮',
        width: '98%',
        tone: 'bg-[#c86f63]',
        text: 'text-[#b65f54]',
    },
    {
        rank: '০২',
        title: 'খাদ্য সহায়তা',
        level: 'উচ্চ অগ্রাধিকার',
        score: '৯২',
        width: '92%',
        tone: 'bg-accent',
        text: 'text-[#b97918]',
    },
    {
        rank: '০৩',
        title: 'আশ্রয় সহায়তা',
        level: 'সাধারণ অগ্রাধিকার',
        score: '৮৪',
        width: '84%',
        tone: 'bg-primary',
        text: 'text-primary',
    },
];

const PriorityDiagram = () => {
    return (
        <div className="mx-auto w-full max-w-147.5 font-bengali">
            <div
                className="
                    flex
                    items-end
                    justify-between
                    gap-6
                    border-b
                    border-black/10
                    pb-5
                "
            >
                <div>
                    <span
                        className="
                            text-[0.72rem]
                            text-text-muted
                        "
                    >
                        অগ্রাধিকার বিশ্লেষণ
                    </span>

                    <h4
                        className="
                            mt-1
                            text-[1.05rem]
                            font-semibold
                        "
                    >
                        কোন প্রয়োজন আগে মনোযোগ পাবে?
                    </h4>
                </div>

                <span
                    className="
                        text-[0.72rem]
                        text-text-muted
                    "
                >
                    প্রযুক্তিসহায়ক মূল্যায়ন
                </span>
            </div>

            <div>
                {cases.map((item) => (
                    <div
                        key={item.rank}
                        className="
                            grid
                            grid-cols-[24px_minmax(0,1fr)_42px]
                            gap-4
                            border-b
                            border-black/8
                            py-6

                            sm:grid-cols-[40px_minmax(0,1fr)_60px]
                        "
                    >
                        <span
                            className="
                                pt-1
                                text-[0.72rem]
                                font-semibold
                                text-text-muted
                            "
                        >
                            {item.rank}
                        </span>

                        <div>
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <h5
                                    className="
                                        text-[0.95rem]
                                        font-semibold
                                    "
                                >
                                    {item.title}
                                </h5>

                                <span
                                    className={`
                                        text-[0.7rem]
                                        font-medium!
                                        ${item.text}
                                    `}
                                >
                                    {item.level}
                                </span>
                            </div>

                            <div
                                className="
                                    mt-4
                                    h-1.5
                                    overflow-hidden
                                    bg-[#e8e9e6]
                                "
                            >
                                <div
                                    className={`h-full ${item.tone}`}
                                    style={{
                                        width: item.width,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="text-right">
                            <strong
                                className={`
                                    text-[1.55rem]
                                    font-medium!
                                    leading-none

                                    sm:text-[1.9rem]

                                    ${item.text}
                                `}
                            >
                                {item.score}
                            </strong>

                            <span
                                className="
                                    mt-1
                                    block
                                    text-[0.62rem]
                                    text-text-muted
                                "
                            >
                                স্কোর
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="
                    mt-5
                    flex
                    items-start
                    gap-3
                "
            >
                <span
                    className="
                        mt-2
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        bg-primary
                    "
                />

                <p
                    className="
                        text-[0.72rem]
                        leading-[1.7]
                        text-text-muted
                    "
                >
                    জরুরিতা, সম্ভাব্য প্রভাব, পরিস্থিতি এবং উপলভ্য সম্পদের মতো
                    সংকেত অগ্রাধিকার নির্ধারণে বিবেচিত হয়।
                </p>
            </div>
        </div>
    );
};

// NetworkNodes — merged into the main page
const TopNode = ({ icon, title, subtitle }) => {
    const Icon = icon;

    return (
        <div
            className="
                flex
                max-w-47.5
                flex-col
                items-center
                text-center
            "
        >
            <div
                className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-primary/15
                    bg-[#edf4f1]
                "
            >
                <Icon className="h-5 w-5 text-primary" />
            </div>

            <h4
                className="
                    mt-3
                    text-[0.9rem]
                    font-semibold
                "
            >
                {title}
            </h4>

            <p
                className="
                    mt-1
                    text-[0.68rem]
                    leading-[1.6]
                    text-text-muted
                "
            >
                {subtitle}
            </p>
        </div>
    );
};

const FoundationNode = () => {
    return (
        <div
            className="
                relative
                w-full
                max-w-97.5
                overflow-hidden
                bg-primary
                px-6
                py-6
                text-white

                sm:px-7
            "
        >
            <div className="flex items-start gap-4">
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                    "
                >
                    <TbUsers className="h-5 w-5" />
                </div>

                <div>
                    <span
                        className="
                            text-[0.68rem]
                            text-white/50
                        "
                    >
                        সমন্বয় ব্যবস্থা
                    </span>

                    <h3
                        className="
                            mt-1
                            text-[1.05rem]
                            font-semibold
                        "
                    >
                        সমন্বয়ের কেন্দ্র
                    </h3>

                    <p
                        className="
                            mt-2
                            text-[0.72rem]
                            leading-[1.7]
                            text-white/65
                        "
                    >
                        অনুরোধ যাচাই, অগ্রাধিকার নির্ধারণ এবং সহায়তাকারী,
                        স্বেচ্ছাসেবক ও সহযোগী সংগঠনকে একটি সমন্বিত কার্যপ্রবাহে
                        যুক্ত করে।
                    </p>
                </div>
            </div>
        </div>
    );
};

const CommunityNode = () => {
    return (
        <div
            className="
                w-full
                max-w-77.5
                border
                border-black/10
                bg-[#f7f6f1]
                px-6
                py-5
                text-center
            "
        >
            <HeartHandshake
                className="
                    mx-auto
                    h-6
                    w-6
                    text-primary
                "
            />

            <h3
                className="
                    mt-3
                    text-[0.95rem]
                    font-semibold
                "
            >
                সহায়তার প্রভাব
            </h3>

            <p
                className="
                    mt-2
                    text-[0.7rem]
                    leading-[1.65]
                    text-text-muted
                "
            >
                সমন্বিত ও স্বচ্ছ ব্যবস্থার মাধ্যমে যাচাইকৃত সহায়তা প্রয়োজনের
                কাছে পৌঁছে যায়।
            </p>
        </div>
    );
};

// NetworkDiagram — merged into the main page
const NetworkDiagram = () => {
    return (
        <div
            className="
                w-full
                font-bengali
            "
        >
            <div
                className="
                    mb-9
                    border-b
                    border-black/10
                    pb-5
                "
            >
                <span
                    className="
                        text-[0.72rem]
                        text-text-muted
                    "
                >
                    সমন্বিত সহায়তা নেটওয়ার্ক
                </span>

                <h4
                    className="
                        mt-1
                        text-[1.05rem]
                        font-semibold
                        text-primary
                    "
                >
                    মানুষের পাশে, একসঙ্গে
                </h4>

                <p
                    className="
                        mt-2
                        max-w-140
                        text-[0.72rem]
                        leading-[1.7]
                        text-text-muted
                    "
                >
                    সহায়তাকারী, স্বেচ্ছাসেবক ও সহযোগী সংগঠন একটি সমন্বিত
                    ব্যবস্থার মাধ্যমে যাচাইকৃত প্রয়োজনের সঙ্গে যুক্ত হয়।
                </p>
            </div>

            {/* DESKTOP */}

            <div className="hidden lg:block">
                <div className="relative">
                    <div
                        className="
                            absolute
                            left-1/2
                            top-6
                            h-px
                            w-[67%]
                            -translate-x-1/2
                            bg-black/10
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            grid
                            grid-cols-3
                            gap-6
                        "
                    >
                        {networkNodes.map((node) => (
                            <div
                                key={node.title}
                                className="
                                    flex
                                    flex-col
                                    items-center
                                "
                            >
                                <TopNode {...node} />

                                <div
                                    className="
                                        mt-4
                                        h-10
                                        w-px
                                        bg-black/10
                                    "
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="-mt-px flex justify-center">
                    <FoundationNode />
                </div>

                <div
                    className="
                        flex
                        flex-col
                        items-center
                    "
                >
                    <div className="h-7 w-px bg-black/10" />

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-black/10
                            bg-white
                        "
                    >
                        <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    </div>

                    <div className="h-7 w-px bg-black/10" />
                </div>

                <div className="flex justify-center">
                    <CommunityNode />
                </div>
            </div>

            {/* MOBILE */}

            <div
                className="
                    flex
                    flex-col
                    items-center

                    lg:hidden
                "
            >
                {networkNodes.map((node) => (
                    <React.Fragment key={node.title}>
                        <TopNode {...node} />

                        <div
                            className="
                                my-4
                                h-7
                                w-px
                                bg-black/10
                            "
                        />
                    </React.Fragment>
                ))}

                <FoundationNode />

                <div className="h-7 w-px bg-black/10" />

                <div
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-black/10
                    "
                >
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                </div>

                <div className="h-7 w-px bg-black/10" />

                <CommunityNode />
            </div>
        </div>
    );
};

const pageWidth =
    'mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

const processSteps = [
    {
        number: '০১',
        short: 'প্রয়োজন বোঝা',
        title: 'মানুষ তার প্রয়োজন নিজের ভাষাতেই জানায়।',
        description:
            'সহায়তা প্রত্যাশী মানুষকে জটিল কোনো কাঠামোয় নিজের পরিস্থিতি ব্যাখ্যা করতে হয় না। স্বাভাবিক ভাষায় দেওয়া অনুরোধ থেকে কৃত্রিম বুদ্ধিমত্তা প্রয়োজনের ধরন, অবস্থান এবং জরুরিতার মতো গুরুত্বপূর্ণ সংকেত শনাক্ত করে তথ্যকে পরবর্তী কাজের উপযোগী করে সাজায়।',
        bullets: [
            'স্বাভাবিক ভাষায় অনুরোধ গ্রহণ',
            'কৃত্রিম বুদ্ধিমত্তার মাধ্যমে প্রয়োজনের উদ্দেশ্য শনাক্তকরণ',
            'অবস্থান সম্পর্কিত তথ্য শনাক্তকরণ',
            'জরুরিতার সংকেত চিহ্নিতকরণ',
        ],
        icon: TbRobot,
        diagram: <UnderstandingDiagram />,
    },
    {
        number: '০২',
        short: 'যাচাই ও বিশ্বাস',
        title: 'শুধু তথ্য পাওয়া নয়, তার বিশ্বাসযোগ্যতাও গুরুত্বপূর্ণ।',
        description:
            'প্রতিটি অনুরোধ বিভিন্ন সিস্টেম যাচাইয়ের মধ্য দিয়ে যায়। কৃত্রিম বুদ্ধিমত্তা-সহায়ক সংকেতের পাশাপাশি মানুষের পর্যালোচনা যুক্ত থাকে, যাতে একই অনুরোধের পুনরাবৃত্তি কমানো, পরিচয় যাচাই এবং সিদ্ধান্তের স্বচ্ছতা বজায় রাখা যায়।',
        bullets: [
            'কৃত্রিম বুদ্ধিমত্তা-সহায়ক ডুপ্লিকেট শনাক্তকরণ',
            'পরিচয় যাচাই',
            'মানবিক পর্যালোচনা',
            'সিদ্ধান্তের স্বচ্ছতা',
        ],
        icon: TbShieldCheck,
        diagram: <TrustDiagram />,
    },
    {
        number: '০৩',
        short: 'অগ্রাধিকার',
        title: 'সব প্রয়োজন গুরুত্বপূর্ণ, কিন্তু সব প্রয়োজন সমান জরুরি নয়।',
        description:
            'কৃত্রিম বুদ্ধিমত্তা জরুরিতা, সম্ভাব্য প্রভাব এবং পরিস্থিতির প্রাসঙ্গিক সংকেত বিশ্লেষণ করে কোন অনুরোধগুলো দ্রুত মনোযোগ প্রয়োজন তা নির্ধারণে সহায়তা করে। একই সঙ্গে উপলভ্য সম্পদও বিবেচনায় নেওয়া হয়।',
        bullets: [
            'কৃত্রিম বুদ্ধিমত্তা-ভিত্তিক জরুরিতা মূল্যায়ন',
            'সম্ভাব্য প্রভাব বিশ্লেষণ',
            'উপলভ্য সম্পদ যাচাই',
            'ন্যায্য অগ্রাধিকার ব্যবস্থা',
        ],
        icon: TbArrowUpRight,
        diagram: <PriorityDiagram />,
    },
    {
        number: '০৪',
        short: 'সহায়তার সংযোগ',
        title: 'যাচাইকৃত প্রয়োজনকে উপযুক্ত মানুষের সঙ্গে যুক্ত করা হয়।',
        description:
            'সহায়তাকারী, স্বেচ্ছাসেবক এবং সহযোগী সংগঠনকে একটি সমন্বিত ব্যবস্থার মাধ্যমে প্রয়োজনের সঙ্গে যুক্ত করা হয়—যাতে সহায়তা শুধু প্রতিশ্রুতিতে আটকে না থেকে বাস্তব মানুষের কাছে পৌঁছাতে পারে।',
        bullets: [
            'প্রয়োজন অনুযায়ী উপযুক্ত সহায়তাকারী নির্বাচন',
            'স্বেচ্ছাসেবক সমন্বয়',
            'সহায়তা পৌঁছানোর পথ নির্ধারণ',
            'সহায়তা পৌঁছানোর অগ্রগতি অনুসরণ',
        ],
        icon: TbHeartHandshake,
        diagram: <NetworkDiagram />,
    },
];

const HowItWorksPage = () => {
    return (
        <main
            lang="bn"
            className="
                overflow-x-clip
                bg-[#f7f6f1]
                font-bengali mt-20
                text-text-primary
            "
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="bg-[#f7f6f1]">
                <div className={pageWidth}>
                    <div
                        className="
                            relative
                            border-b
                            border-black/10
                            pb-10
                            pt-12

                            sm:pb-18
                            sm:pt-18

                            lg:min-h-0
                            lg:pb-14
                            lg:pt-14
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                                border-b
                                border-black/10
                                pb-4
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-[0.76rem]
                                    font-semibold
                                    text-primary
                                "
                            >
                                <span className="h-2 w-2 rounded-full bg-accent" />

                                <span>কীভাবে কাজ করে</span>
                            </div>

                            <span
                                className="
                                    hidden
                                    text-[0.72rem]
                                    text-text-muted

                                    sm:block
                                "
                            >
                                প্রয়োজন → যাচাই → অগ্রাধিকার → সহায়তা
                            </span>
                        </div>

                        <div
                            className="
                                grid
                                gap-8
                                pt-9

                                lg:grid-cols-[minmax(0,1fr)_340px]
                                lg:items-end
                                lg:gap-20
                                lg:pt-12
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[0.94rem]
                                        font-medium!
                                        text-primary
                                    "
                                >
                                    Stand For People-এর কার্যপ্রবাহ
                                </p>

                                <h1
                                    className="
                                        mt-5
                                        max-w-230
                                        text-[1.8rem]
                                        font-medium!
                                        leading-[1.3]

                                        sm:text-[2.3rem]

                                        lg:text-[3.1rem]

                                        xl:text-[3.4rem]
                                    "
                                >
                                    জরুরি প্রয়োজনকে
                                    <span className="block text-primary">
                                        যাচাইকৃত সহায়তায় রূপ দেওয়া।
                                    </span>
                                </h1>
                            </div>

                            <div>
                                <p
                                    className="
                                        text-[0.94rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    মানুষ তার প্রয়োজন জানানো থেকে শুরু করে
                                    যাচাই, অগ্রাধিকার নির্ধারণ এবং বাস্তব সহায়তা
                                    পৌঁছানো পর্যন্ত—প্ল্যাটফর্মটি পুরো
                                    প্রক্রিয়াকে একটি স্বচ্ছ ও সমন্বিত ব্যবস্থায়
                                    যুক্ত করে।
                                </p>

                                <a
                                    href="#process"
                                    className="
                                        group
                                        mt-7
                                        inline-flex
                                        items-center
                                        gap-3
                                        text-[0.88rem]
                                        font-semibold
                                        text-primary
                                    "
                                >
                                    প্রক্রিয়াটি দেখুন
                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-primary/25
                                            transition-colors

                                            group-hover:bg-primary
                                            group-hover:text-white
                                        "
                                    >
                                        <TbArrowDown size={16} />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                DETকৃত্রিম বুদ্ধিমত্তাLED PROCESS
            ====================================================== */}

            <section
                id="process"
                className="bg-[#f7f6f1]"
                aria-label="সহায়তার চারটি ধাপ"
            >
                <div className={pageWidth}>
                    <div className="pt-14 pb-4 sm:pt-20 sm:pb-8">
                        <span className="text-xs font-semibold text-primary">
                            সহায়তা পৌঁছানোর প্রক্রিয়া
                        </span>
                        <h2 className="mt-3 max-w-2xl text-[1.65rem] font-semibold leading-[1.45] sm:text-[2rem] lg:text-[2.3rem]">
                            প্রয়োজন জানানো থেকে সহায়তা পৌঁছানো পর্যন্ত
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
                            চারটি সহজ ধাপে অনুরোধ বোঝা, যাচাই, অগ্রাধিকার
                            নির্ধারণ এবং সহায়তার সমন্বয় করা হয়।
                        </p>
                    </div>
                    {processSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <article
                                key={step.number}
                                className="border-b border-black/10 py-10 sm:py-14 lg:py-16"
                            >
                                <div className="mb-7 flex items-center gap-3 text-primary sm:mb-9">
                                    <span className="text-sm font-semibold">
                                        {step.number}
                                    </span>
                                    <span className="h-px w-7 bg-primary/30" />
                                    <span className="text-xs font-medium">
                                        {step.short}
                                    </span>
                                    <Icon
                                        className="ml-auto"
                                        size={19}
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-20">
                                    <div
                                        className={`min-w-0 ${index % 2 ? 'lg:order-2' : ''}`}
                                    >
                                        <h3 className="max-w-xl text-[1.45rem] font-semibold leading-normal sm:text-[1.75rem] lg:text-[1.95rem]">
                                            {step.title}
                                        </h3>
                                        <p className="mt-4 max-w-xl text-sm leading-[1.9] text-text-secondary sm:text-[0.95rem]">
                                            {step.description}
                                        </p>
                                        <div className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                            {step.bullets
                                                .slice(0, 3)
                                                .map((bullet) => (
                                                    <div
                                                        key={bullet}
                                                        className="flex min-w-0 items-start gap-2.5 text-[0.84rem] leading-6 text-text-secondary"
                                                    >
                                                        <TbCheck
                                                            className="mt-1 shrink-0 text-primary"
                                                            size={15}
                                                        />
                                                        <span>{bullet}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div
                                        className={`min-w-0 overflow-hidden border border-black/10 bg-white p-4 sm:p-6 lg:p-7 ${index % 2 ? 'lg:order-1' : ''}`}
                                    >
                                        {step.diagram}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* =====================================================
                FINAL CTA
            ====================================================== */}

            <section className="bg-[#173f3b]">
                <div className={pageWidth}>
                    <div className="py-14 sm:py-18 lg:py-14">
                        <div
                            className="
                                grid
                                gap-9

                                lg:grid-cols-[1.05fr_0.95fr]
                                lg:items-end
                                lg:gap-14
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[0.75rem]
                                        font-semibold
                                        text-[#efb17d]
                                    "
                                >
                                    এখন আপনার ভূমিকা
                                </span>

                                <h2
                                    className="
                                        mt-5
                                        max-w-175
                                        text-[1.85rem]
                                        font-medium!
                                        leading-[1.45]
                                        text-white!

                                        sm:text-[2.3rem]

                                        lg:text-[2.3rem]
                                    "
                                >
                                    বাস্তব প্রয়োজন আছে?
                                    <span className="block text-white/60">
                                        অথবা কারও পাশে দাঁড়াতে চান?
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-6
                                        max-w-145
                                        text-[0.95rem]
                                        leading-[1.95]
                                        text-white/60
                                    "
                                >
                                    প্রয়োজন জানানো, স্বেচ্ছাসেবী হিসেবে যুক্ত
                                    হওয়া অথবা যাচাইকৃত প্রয়োজনকে সহায়তা
                                    করা—আপনার জন্য উপযুক্ত পথটি বেছে নিন।
                                </p>
                            </div>

                            <div className="border-t border-white/15 lg:border-t-0">
                                <Link
                                    to="/request-help"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-5
                                        text-white
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                block
                                                text-[0.72rem]
                                                text-white/40
                                            "
                                        >
                                            সহায়তা প্রয়োজন
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[0.94rem]
                                                font-medium!
                                            "
                                        >
                                            সহায়তার অনুরোধ করুন
                                        </span>
                                    </div>

                                    <TbArrowUpRight
                                        size={19}
                                        className="
                                            text-[#efb17d]
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>

                                <Link
                                    to="/volunteer"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        border-b
                                        border-white/15
                                        py-5
                                        text-white
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                block
                                                text-[0.72rem]
                                                text-white/40
                                            "
                                        >
                                            সময় ও দক্ষতা দিতে চান
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[0.94rem]
                                                font-medium!
                                            "
                                        >
                                            স্বেচ্ছাসেবী হিসেবে যুক্ত হোন
                                        </span>
                                    </div>

                                    <TbArrowUpRight
                                        size={19}
                                        className="
                                            text-[#efb17d]
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                            group-hover:translate-x-0.5
                                        "
                                    />
                                </Link>

                                <Link
                                    to="/donate"
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        gap-5
                                        py-5
                                        text-white
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                block
                                                text-[0.72rem]
                                                text-white/40
                                            "
                                        >
                                            সম্পদ দিয়ে পাশে দাঁড়াতে চান
                                        </span>

                                        <span
                                            className="
                                                mt-1
                                                block
                                                text-[0.94rem]
                                                font-medium!
                                            "
                                        >
                                            যাচাইকৃত প্রয়োজনে সহায়তা করুন
                                        </span>
                                    </div>

                                    <TbArrowRight
                                        size={19}
                                        className="
                                            text-[#efb17d]
                                            transition-transform

                                            group-hover:translate-x-1
                                        "
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;
