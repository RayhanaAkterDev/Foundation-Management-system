import React from 'react';

import { ArrowDown } from 'lucide-react';

import nodes from './data';
import { CommunityNode, FoundationNode, TopNode } from './NetworkNodes';

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
                        max-w-[560px]
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

            <div className="hidden md:block">
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
                        {nodes.map((node) => (
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

                    md:hidden
                "
            >
                {nodes.map((node) => (
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

export default NetworkDiagram;
