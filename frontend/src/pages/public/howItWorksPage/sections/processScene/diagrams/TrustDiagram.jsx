import React from 'react';

import {
    TbCheck,
    TbFingerprint,
    TbMapPinCheck,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

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
        <div className="mx-auto w-full max-w-[560px] font-bengali">
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
                            text-[2.8rem]
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
                                grid-cols-[32px_40px_1fr_28px]
                                items-center
                                gap-3
                                border-b
                                border-black/[0.08]
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

export default TrustDiagram;
