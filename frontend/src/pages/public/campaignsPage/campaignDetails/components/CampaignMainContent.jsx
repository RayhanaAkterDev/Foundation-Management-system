import React from 'react';

import {
    TbCircleCheck,
    TbMapPin,
    TbStethoscope,
    TbTruckDelivery,
} from 'react-icons/tb';

import CampaignStory from './CampaignStory';

const iconMap = {
    TbCircleCheck,
    TbStethoscope,
    TbTruckDelivery,
};

const CampaignMainContent = ({ campaign }) => {
    const updates = campaign?.updates || [];

    return (
        <article className="min-w-0">
            {/* =====================================================
                CAMPAIGN MASTHEAD
            ====================================================== */}
            <header>
                {/* TOP META RULE */}
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-x-4
                        gap-y-2
                        border-y
                        border-border
                        py-3
                    "
                >
                    {campaign.urgency && (
                        <span
                            className={`
                                font-bengali
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]

                                ${
                                    campaign.urgency === 'Critical'
                                        ? 'text-accent'
                                        : 'text-primary'
                                }
                            `}
                        >
                            {campaign.urgency}
                        </span>
                    )}

                    <span className="h-3 w-px bg-border" />

                    {campaign.category && (
                        <span className="font-bengali text-[9px] text-text-secondary">
                            {campaign.category}
                        </span>
                    )}

                    {campaign.location && (
                        <>
                            <span className="hidden h-[3px] w-[3px] rounded-full bg-text-muted sm:block" />

                            <span className="flex items-center gap-1.5 font-bengali text-[9px] text-text-secondary">
                                <TbMapPin size={12} />

                                {campaign.location}
                            </span>
                        </>
                    )}

                    <span className="ml-auto hidden text-[8px] uppercase tracking-[0.2em] text-text-muted sm:block">
                        Stand For People
                    </span>
                </div>

                {/* TITLE */}
                <div className="py-9 sm:py-11 lg:py-12">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-9 bg-accent" />

                        <span className="font-bengali text-[10px] font-semibold text-accent">
                            মানুষের পাশে দাঁড়ানোর একটি উদ্যোগ
                        </span>
                    </div>

                    <h1
                        className="
                            mt-5
                            max-w-[850px]
                            font-bengali
                            text-[2.25rem]
                            font-medium
                            leading-[1.3]
                            tracking-[-0.04em]
                            text-text-primary

                            sm:text-[2.8rem]
                            lg:text-[3.25rem]
                            xl:text-[3.6rem]
                        "
                    >
                        {campaign.title}
                    </h1>

                    {campaign.shortDescription && (
                        <p
                            className="
                                mt-5
                                max-w-[680px]
                                font-bengali
                                text-[13px]
                                leading-[2]
                                text-text-secondary

                                sm:text-[14px]
                            "
                        >
                            {campaign.shortDescription}
                        </p>
                    )}
                </div>
            </header>

            {/* =====================================================
                FEATURE IMAGE
            ====================================================== */}
            {campaign.image && (
                <figure>
                    <div
                        className="
                            relative
                            h-[330px]
                            overflow-hidden

                            sm:h-[430px]
                            lg:h-[500px]
                        "
                    >
                        <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent" />

                        {campaign.location && (
                            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
                                <div className="flex items-center gap-2 text-white">
                                    <TbMapPin size={14} />

                                    <span className="font-bengali text-[10px]">
                                        {campaign.location}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <figcaption
                        className="
                            flex
                            items-center
                            gap-4
                            border-b
                            border-border
                            py-3
                        "
                    >
                        <span className="font-bengali text-[8px] text-text-muted">
                            চলমান মানবিক উদ্যোগ
                        </span>

                        <span className="h-px flex-1 bg-border" />

                        <span className="text-[8px] uppercase tracking-[0.16em] text-text-muted">
                            Stand For People
                        </span>
                    </figcaption>
                </figure>
            )}

            {/* =====================================================
                STORY
            ====================================================== */}
            <CampaignStory story={campaign.story} />

            {/* =====================================================
                UPDATES
            ====================================================== */}
            {updates.length > 0 && (
                <section className="border-t border-border py-12 sm:py-14">
                    <div className="mb-8 flex items-end justify-between gap-5">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-accent" />

                                <span className="font-bengali text-[9px] font-semibold text-accent">
                                    সর্বশেষ খবর
                                </span>
                            </div>

                            <h2
                                className="
                                    mt-3
                                    font-bengali
                                    text-[26px]
                                    font-semibold
                                    text-text-primary

                                    sm:text-[30px]
                                "
                            >
                                উদ্যোগের অগ্রগতি
                            </h2>
                        </div>

                        <span className="hidden text-[8px] uppercase tracking-[0.18em] text-text-muted sm:block">
                            Field Updates
                        </span>
                    </div>

                    {/* TIMELINE */}
                    <div className="relative">
                        <div className="absolute bottom-0 left-[17px] top-0 w-px bg-border" />

                        {updates.map((update, index) => {
                            const Icon =
                                iconMap?.[update.icon] || TbCircleCheck;

                            return (
                                <div
                                    key={index}
                                    className="
                                        relative
                                        flex
                                        gap-5
                                        pb-8

                                        last:pb-0
                                    "
                                >
                                    <div
                                        className="
                                            relative
                                            z-10
                                            flex
                                            h-[35px]
                                            w-[35px]
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-border
                                            bg-surface
                                            text-primary
                                        "
                                    >
                                        <Icon size={15} />
                                    </div>

                                    <div className="min-w-0 flex-1 border-b border-border/70 pb-7">
                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-1

                                                sm:flex-row
                                                sm:items-start
                                                sm:justify-between
                                                sm:gap-5
                                            "
                                        >
                                            <h3 className="font-bengali text-[14px] font-semibold text-text-primary">
                                                {update.title}
                                            </h3>

                                            <span className="shrink-0 text-[9px] text-text-muted">
                                                {update.date}
                                            </span>
                                        </div>

                                        <p className="mt-2 font-bengali text-[11px] leading-[1.9] text-text-secondary">
                                            {update.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </article>
    );
};

export default CampaignMainContent;
