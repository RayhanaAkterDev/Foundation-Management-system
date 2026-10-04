import React from 'react';

import {
    TbArrowDown,
    TbMapPin,
    TbMedicalCross,
    TbSparkles,
} from 'react-icons/tb';

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
        <div className="mx-auto w-full max-w-[560px] font-bengali">
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

                        sm:text-[1.15rem]
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
                            AI বিশ্লেষণের পর
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
                                    min-h-[110px]
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

export default UnderstandingDiagram;
