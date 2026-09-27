import React from 'react';

import { CircleCheck, Eye, HeartHandshake } from 'lucide-react';

const trustItems = [
    {
        icon: CircleCheck,
        title: 'যাচাই করা আবেদন',
        description: 'প্রয়োজন যাচাই করে সহায়তার পথ তৈরি করা হয়।',
    },
    {
        icon: Eye,
        title: 'স্বচ্ছ অগ্রগতি',
        description: 'সহায়তার প্রতিটি ধাপ সম্পর্কে জানা যায়।',
    },
    {
        icon: HeartHandshake,
        title: 'একসাথে এগিয়ে যাওয়া',
        description: 'মানুষ, দাতা, স্বেচ্ছাসেবী ও সংগঠন যুক্ত হয়।',
    },
];

const HeroTrustLine = () => {
    return (
        <section
            aria-label="Stand For People কীভাবে কাজ করে"
            lang="bn"
        >
            <div className="container-width">
                <div
                    className="
                        py-10

                        sm:py-11

                        lg:py-13

                        xl:py-20
                    "
                >
                    {/* Section introduction */}
                    <div
                        className="
                            mb-8
                            flex
                            items-center
                            gap-4

                            sm:mb-9

                            lg:mb-10
                        "
                    >
                        <span
                            className="
                                h-px
                                w-8
                                shrink-0
                                bg-primary

                                sm:w-10

                                lg:w-12
                            "
                        />

                        <p
                            className="
                                text-[14px]
                                font-medium
                                text-text-secondary

                                sm:text-[15px]

                                lg:text-base
                            "
                        >
                            সাহায্যকে কার্যকর করার তিনটি ভিত্তি
                        </p>
                    </div>

                    {/* Proof points */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-8

                            sm:grid-cols-3
                            sm:gap-0
                        "
                    >
                        {trustItems.map(
                            ({ icon: Icon, title, description }, index) => (
                                <div
                                    key={title}
                                    className={`
                                        flex
                                        items-start
                                        gap-4

                                        sm:px-7
                                        lg:px-9
                                        xl:px-10

                                        ${
                                            index > 0
                                                ? 'border-t border-border pt-8 sm:border-l sm:border-t-0 sm:pt-0'
                                                : ''
                                        }

                                        ${index === 0 ? 'sm:pl-0' : ''}

                                        ${
                                            index === trustItems.length - 1
                                                ? 'sm:pr-0'
                                                : ''
                                        }
                                    `}
                                >
                                    {/* Icon */}
                                    <Icon
                                        className="
                                            mt-0.5
                                            h-[21px]
                                            w-[21px]
                                            shrink-0
                                            text-primary

                                            lg:h-[22px]
                                            lg:w-[22px]
                                        "
                                        strokeWidth={1.7}
                                    />

                                    {/* Text */}
                                    <div className="min-w-0">
                                        <h3
                                            className="
                                                text-[16px]
                                                font-semibold
                                                leading-[1.4]
                                                text-text-primary

                                                lg:text-[17px]

                                                xl:text-[18px]
                                            "
                                        >
                                            {title}
                                        </h3>

                                        <p
                                            className="
                                                mt-1.5
                                                max-w-[21rem]
                                                text-[13px]
                                                leading-[1.65]
                                                text-text-secondary

                                                lg:text-[14px]
                                                lg:leading-[1.7]

                                                xl:text-[15px]
                                            "
                                        >
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroTrustLine;
