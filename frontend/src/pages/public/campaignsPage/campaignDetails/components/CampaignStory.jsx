import React, { useState } from 'react';

import { HiArrowSmDown, HiArrowSmUp } from 'react-icons/hi';

const CampaignStory = ({ story = [] }) => {
    const [expanded, setExpanded] = useState(false);

    if (!story?.length) {
        return null;
    }

    const visibleStory = expanded ? story : story.slice(0, 3);

    return (
        <section className="py-12 sm:py-14">
            {/* HEADER */}
            <div className="flex items-end justify-between gap-6 border-b border-border pb-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-accent" />

                        <span className="font-bengali text-[9px] font-semibold text-accent">
                            পেছনের গল্প
                        </span>
                    </div>

                    <h2
                        className="
                            mt-3
                            font-bengali
                            text-[27px]
                            font-semibold
                            tracking-[-0.025em]
                            text-text-primary

                            sm:text-[31px]
                        "
                    >
                        এই উদ্যোগের গল্প
                    </h2>
                </div>

                <span className="hidden font-serif text-[9px] italic text-text-muted sm:block">
                    The Story
                </span>
            </div>

            {/* STORY */}
            <div className="mx-auto mt-8 max-w-[720px]">
                <div className="space-y-6">
                    {visibleStory.map((paragraph, index) => (
                        <p
                            key={index}
                            className="
                                font-bengali
                                text-[13px]
                                leading-[2.05]
                                text-text-secondary

                                sm:text-[14px]
                            "
                        >
                            {index === 0 && (
                                <span
                                    className="
                                        float-left
                                        mr-2
                                        mt-2
                                        font-bengali
                                        text-[38px]
                                        font-semibold
                                        leading-[0.75]
                                        text-primary
                                    "
                                >
                                    {paragraph.charAt(0)}
                                </span>
                            )}

                            {index === 0 ? paragraph.slice(1) : paragraph}
                        </p>
                    ))}
                </div>

                {story.length > 3 && (
                    <div className="mt-8 border-t border-border pt-4">
                        <button
                            type="button"
                            onClick={() => setExpanded((current) => !current)}
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                font-bengali
                                text-[10px]
                                font-semibold
                                text-primary
                                transition-colors

                                hover:text-primary-hover
                            "
                        >
                            {expanded ? (
                                <>
                                    সংক্ষিপ্ত করুন
                                    <HiArrowSmUp
                                        className="
                                            text-base
                                            transition-transform

                                            group-hover:-translate-y-0.5
                                        "
                                    />
                                </>
                            ) : (
                                <>
                                    পুরো গল্প পড়ুন
                                    <HiArrowSmDown
                                        className="
                                            text-base
                                            transition-transform

                                            group-hover:translate-y-0.5
                                        "
                                    />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CampaignStory;
