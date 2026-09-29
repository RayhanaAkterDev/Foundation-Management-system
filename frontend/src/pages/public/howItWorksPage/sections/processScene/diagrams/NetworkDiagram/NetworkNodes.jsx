import React from 'react';

import { HeartHandshake } from 'lucide-react';
import { TbUsers } from 'react-icons/tb';

export const TopNode = ({ icon, title, subtitle }) => {
    const Icon = icon;

    return (
        <div
            className="
                flex
                max-w-[190px]
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

export const FoundationNode = () => {
    return (
        <div
            className="
                relative
                w-full
                max-w-[390px]
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
                        SP সমন্বয় ব্যবস্থা
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

export const CommunityNode = () => {
    return (
        <div
            className="
                w-full
                max-w-[310px]
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
