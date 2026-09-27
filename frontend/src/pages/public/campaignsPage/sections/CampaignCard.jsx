import { Link } from 'react-router-dom';

import { HiArrowSmRight, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiClock, FiUsers } from 'react-icons/fi';

import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

/* =========================================================
    HELPERS
========================================================== */

const formatAmount = (amount) => Number(amount || 0).toLocaleString('en-BD');

const toBengaliNumber = (value) =>
    String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[digit]);

/* =========================================================
    CAMPAIGN IMAGE
========================================================== */

function CampaignImage({ imageUrl, title, feature = false }) {
    return (
        <img
            src={imageUrl}
            alt={title || 'মানবিক উদ্যোগ'}
            className={`
                h-full
                w-full
                object-cover
                transition-transform
                duration-1200
                ease-[cubic-bezier(.16,1,.3,1)]
                group-hover:scale-[1.035]
                ${feature ? 'object-center' : ''}
            `}
            onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultCampaignImage;
            }}
        />
    );
}

/* =========================================================
    IMAGE META
========================================================== */

function ImageMeta({ campaign, dark = true }) {
    return (
        <>
            <div
                className={`
                    absolute
                    inset-x-0
                    bottom-0
                    h-[48%]
                    bg-linear-to-t
                    ${
                        dark
                            ? 'from-black/75 via-black/25 to-transparent'
                            : 'from-black/55 via-black/10 to-transparent'
                    }
                `}
            />

            {campaign.category && (
                <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6 lg:left-7 lg:top-7">
                    <span
                        className="
                            border
                            border-white/30
                            bg-black/10
                            px-2.5
                            py-1.5
                            font-bengali
                            text-[10px]
                            font-medium
                            leading-none
                            text-white
                            backdrop-blur-[3px]
                            sm:px-3
                            sm:text-[11px]
                            lg:px-3.5
                            lg:py-2
                            lg:text-[12px]
                        "
                    >
                        {campaign.category}
                    </span>
                </div>
            )}

            {campaign.daysLeft != null && (
                <div
                    className="
                        absolute
                        right-4
                        top-4
                        z-20
                        flex
                        items-center
                        gap-1.5
                        text-white
                        sm:right-6
                        sm:top-6
                        lg:right-7
                        lg:top-7
                        lg:gap-2
                    "
                >
                    <FiClock className="shrink-0 text-[11px] sm:text-[12px] lg:text-[14px]" />

                    <span className="font-bengali text-[10px] leading-none sm:text-[11px] lg:text-[12px]">
                        {campaign.daysLeft > 0
                            ? `${toBengaliNumber(campaign.daysLeft)} দিন বাকি`
                            : 'আজ শেষ'}
                    </span>
                </div>
            )}
        </>
    );
}

/* =========================================================
    PROGRESS
========================================================== */

function Progress({ progress, light = false }) {
    const safeProgress = Math.min(100, Math.max(0, Number(progress ?? 0)));

    return (
        <div>
            <div className="mb-2.5 flex items-center justify-between gap-4 lg:mb-3">
                <span
                    className={`
                        font-bengali
                        text-[10px]
                        leading-none
                        sm:text-[11px]
                        lg:text-[12px]
                        ${light ? 'text-white/55' : 'text-text-muted'}
                    `}
                >
                    সহায়তার অগ্রগতি
                </span>

                <span
                    className={`
                        text-[10px]
                        font-semibold
                        leading-none
                        sm:text-[11px]
                        lg:text-[13px]
                        ${light ? 'text-white' : 'text-primary'}
                    `}
                >
                    {toBengaliNumber(safeProgress)}%
                </span>
            </div>

            <div
                className={`
                    h-px
                    w-full
                    lg:h-[2px]
                    ${light ? 'bg-white/20' : 'bg-border'}
                `}
            >
                <div
                    className={`
                        h-full
                        transition-all
                        duration-1000
                        ${light ? 'bg-white' : 'bg-primary'}
                    `}
                    style={{
                        width: `${safeProgress}%`,
                    }}
                />
            </div>
        </div>
    );
}

/* =========================================================
    MAIN CAMPAIGN CARD
========================================================== */

export default function CampaignCard({
    campaign,
    index = 0,
    variant = 'portrait',
}) {
    const imageUrl =
        campaign.image || campaign.cover_image || defaultCampaignImage;

    const raisedAmount = Number(
        campaign.raised ?? campaign.collected_amount ?? 0,
    );

    const targetAmount = Number(
        campaign.goal ?? campaign.target ?? campaign.target_amount ?? 0,
    );

    const supporterCount = Number(campaign.supporters ?? 0);

    const descriptionText =
        campaign.shortDescription || campaign.description || '';

    const location = campaign.location || campaign.district || '';

    const campaignNumber = toBengaliNumber(String(index + 1).padStart(2, '0'));

    const isLandscape = variant === 'landscape';
    const isFeature = variant === 'feature';

    /* =====================================================
        PORTRAIT
    ====================================================== */

    if (!isLandscape && !isFeature) {
        return (
            <Link
                to={`/campaign/${campaign.id}`}
                className="group block h-full"
            >
                <article
                    className="
                        relative
                        flex
                        h-full
                        min-h-[560px]
                        flex-col
                        overflow-hidden
                        border
                        border-border/70
                        bg-[#faf8f3]
                        sm:min-h-[590px]
                        lg:min-h-[630px]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-border/70
                            px-4
                            py-3.5
                            sm:px-6
                            sm:py-4
                            lg:px-7
                            lg:py-5
                        "
                    >
                        <span
                            className="
                                font-serif
                                text-[26px]
                                font-light
                                leading-none
                                tracking-[-0.04em]
                                text-text-primary/75
                                sm:text-[30px]
                                lg:text-[36px]
                            "
                        >
                            {campaignNumber}
                        </span>

                        <span
                            className="
                                text-[8px]
                                font-medium
                                uppercase
                                tracking-[0.18em]
                                text-text-muted
                                sm:text-[9px]
                                sm:tracking-[0.22em]
                                lg:text-[10px]
                                lg:tracking-[0.25em]
                            "
                        >
                            Stand For People
                        </span>
                    </div>

                    <div
                        className="
                            relative
                            aspect-[1.25/1]
                            shrink-0
                            overflow-hidden
                            bg-background-alt
                        "
                    >
                        <CampaignImage
                            imageUrl={imageUrl}
                            title={campaign.title}
                        />

                        <ImageMeta campaign={campaign} />

                        <div
                            className="
                                absolute
                                inset-x-4
                                bottom-4
                                z-20
                                flex
                                items-center
                                justify-between
                                gap-4
                                sm:inset-x-6
                                sm:bottom-5
                                lg:inset-x-7
                                lg:bottom-6
                            "
                        >
                            {location ? (
                                <div className="flex min-w-0 items-center gap-1.5 text-white lg:gap-2">
                                    <HiOutlineLocationMarker className="shrink-0 text-[12px] lg:text-[14px]" />

                                    <span className="truncate font-bengali text-[10px] leading-none sm:text-[11px] lg:text-[12px]">
                                        {location}
                                    </span>
                                </div>
                            ) : (
                                <span />
                            )}

                            <HiArrowSmRight
                                className="
                                    shrink-0
                                    text-[18px]
                                    text-white
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-1
                                    sm:text-[19px]
                                    lg:text-[21px]
                                "
                            />
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            flex-1
                            flex-col
                            px-4
                            pb-5
                            pt-5
                            sm:px-6
                            sm:pb-6
                            sm:pt-6
                            lg:px-7
                            lg:pb-8
                            lg:pt-7
                        "
                    >
                        <h3
                            className="
                                font-bengali
                                text-[19px]
                                font-semibold
                                leading-[1.55]
                                tracking-[-0.015em]
                                text-text-primary
                                sm:text-[21px]
                                lg:text-[25px]
                                xl:text-[27px]
                            "
                        >
                            {campaign.title}
                        </h3>

                        {descriptionText && (
                            <p
                                className="
                                    mt-2.5
                                    line-clamp-2
                                    font-bengali
                                    text-[11px]
                                    leading-[1.9]
                                    text-text-secondary
                                    sm:mt-3
                                    sm:text-[12px]
                                    lg:mt-3.5
                                    lg:text-[13px]
                                    lg:leading-[1.95]
                                "
                            >
                                {descriptionText}
                            </p>
                        )}

                        <div className="mt-auto pt-6 sm:pt-7 lg:pt-9">
                            <Progress progress={campaign.progress} />

                            <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4 sm:gap-5 lg:mt-6 lg:gap-7">
                                <div>
                                    <p className="font-bengali text-[10px] leading-none text-text-muted sm:text-[11px] lg:text-[12px]">
                                        সংগ্রহ হয়েছে
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[18px]
                                            font-semibold
                                            tracking-[-0.03em]
                                            text-text-primary
                                            sm:text-[20px]
                                            lg:text-[24px]
                                            xl:text-[26px]
                                        "
                                    >
                                        ৳{formatAmount(raisedAmount)}
                                    </p>

                                    {targetAmount > 0 && (
                                        <p className="mt-1 font-bengali text-[9px] leading-none text-text-muted sm:text-[10px] lg:text-[11px]">
                                            লক্ষ্য ৳{formatAmount(targetAmount)}
                                        </p>
                                    )}
                                </div>

                                <div className="border-l border-border pl-4 text-right sm:pl-5 lg:pl-6">
                                    <p className="font-bengali text-[10px] leading-none text-text-muted sm:text-[11px] lg:text-[12px]">
                                        সহায়তাকারী
                                    </p>

                                    <div className="mt-1 flex items-center justify-end gap-1.5 lg:mt-1.5 lg:gap-2">
                                        <FiUsers className="text-[12px] text-primary lg:text-[14px]" />

                                        <span className="text-[14px] font-semibold text-text-primary sm:text-[15px] lg:text-[18px]">
                                            {toBengaliNumber(supporterCount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    /* =====================================================
        LANDSCAPE
    ====================================================== */

    if (isLandscape) {
        return (
            <Link
                to={`/campaign/${campaign.id}`}
                className="group block h-full"
            >
                <article
                    className="
                        relative
                        grid
                        h-full
                        min-h-[560px]
                        overflow-hidden
                        border
                        border-border/70
                        bg-[#f4efe4]
                        sm:min-h-[590px]
                        sm:grid-cols-[1.12fr_0.88fr]
                        lg:min-h-[630px]
                    "
                >
                    <div
                        className="
                            relative
                            min-h-[300px]
                            overflow-hidden
                            bg-background-alt
                            sm:min-h-full
                        "
                    >
                        <CampaignImage
                            imageUrl={imageUrl}
                            title={campaign.title}
                        />

                        <ImageMeta campaign={campaign} />

                        <span
                            className="
                                absolute
                                bottom-5
                                left-5
                                z-20
                                font-serif
                                text-[48px]
                                font-light
                                leading-none
                                tracking-[-0.055em]
                                text-white/90
                                sm:bottom-6
                                sm:left-6
                                sm:text-[58px]
                                lg:bottom-8
                                lg:left-8
                                lg:text-[72px]
                            "
                        >
                            {campaignNumber}
                        </span>

                        {location && (
                            <div
                                className="
                                    absolute
                                    bottom-6
                                    right-5
                                    z-20
                                    flex
                                    max-w-[50%]
                                    items-center
                                    gap-1.5
                                    text-white
                                    sm:right-6
                                    lg:bottom-8
                                    lg:right-8
                                    lg:gap-2
                                "
                            >
                                <HiOutlineLocationMarker className="shrink-0 text-[12px] lg:text-[14px]" />

                                <span className="truncate font-bengali text-[10px] leading-none sm:text-[11px] lg:text-[12px]">
                                    {location}
                                </span>
                            </div>
                        )}
                    </div>

                    <div
                        className="
                            relative
                            flex
                            flex-col
                            px-5
                            py-6
                            sm:px-7
                            sm:py-8
                            lg:px-10
                            lg:py-10
                            xl:px-11
                            xl:py-12
                        "
                    >
                        <div className="flex items-center justify-between gap-4">
                            <span
                                className="
                                    text-[8px]
                                    font-medium
                                    uppercase
                                    tracking-[0.2em]
                                    text-text-muted
                                    sm:text-[9px]
                                    lg:text-[10px]
                                    lg:tracking-[0.24em]
                                "
                            >
                                Stand For People
                            </span>

                            <span className="h-px flex-1 bg-border" />
                        </div>

                        <h3
                            className="
                                mt-7
                                font-bengali
                                text-[22px]
                                font-semibold
                                leading-[1.52]
                                tracking-[-0.02em]
                                text-text-primary
                                sm:mt-9
                                sm:text-[25px]
                                lg:mt-10
                                lg:text-[30px]
                                xl:text-[33px]
                            "
                        >
                            {campaign.title}
                        </h3>

                        {descriptionText && (
                            <p
                                className="
                                    mt-3.5
                                    line-clamp-3
                                    font-bengali
                                    text-[11px]
                                    leading-[1.95]
                                    text-text-secondary
                                    sm:mt-4
                                    sm:text-[12px]
                                    lg:mt-5
                                    lg:text-[13px]
                                    lg:leading-[2]
                                "
                            >
                                {descriptionText}
                            </p>
                        )}

                        <div className="mt-auto pt-7 sm:pt-8 lg:pt-10">
                            <div className="border-y border-border/80 py-4 sm:py-5 lg:py-6">
                                <p className="font-bengali text-[10px] leading-none text-text-muted sm:text-[11px] lg:text-[12px]">
                                    সংগ্রহ হয়েছে
                                </p>

                                <div className="mt-1 flex items-end justify-between gap-4 lg:mt-2">
                                    <p
                                        className="
                                            text-[21px]
                                            font-semibold
                                            tracking-[-0.035em]
                                            text-text-primary
                                            sm:text-[23px]
                                            lg:text-[28px]
                                            xl:text-[31px]
                                        "
                                    >
                                        ৳{formatAmount(raisedAmount)}
                                    </p>

                                    {targetAmount > 0 && (
                                        <p className="pb-0.5 font-bengali text-[9px] leading-none text-text-muted sm:text-[10px] lg:text-[11px]">
                                            লক্ষ্য ৳{formatAmount(targetAmount)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 lg:mt-6">
                                <Progress progress={campaign.progress} />
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6 lg:mt-7">
                                <div className="flex min-w-0 items-center gap-2 lg:gap-2.5">
                                    <FiUsers className="shrink-0 text-[13px] text-primary lg:text-[15px]" />

                                    <span className="font-bengali text-[10px] leading-[1.5] text-text-secondary sm:text-[11px] lg:text-[12px]">
                                        {toBengaliNumber(supporterCount)} জন
                                        পাশে আছেন
                                    </span>
                                </div>

                                <span
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-text-primary/20
                                        text-text-primary
                                        transition-all
                                        duration-300
                                        group-hover:border-primary
                                        group-hover:bg-primary
                                        group-hover:text-white
                                        sm:h-10
                                        sm:w-10
                                        lg:h-11
                                        lg:w-11
                                    "
                                >
                                    <HiArrowSmRight className="text-[16px] sm:text-[17px] lg:text-[18px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    /* =====================================================
        FEATURE
    ====================================================== */

    return (
        <Link to={`/campaign/${campaign.id}`} className="group block">
            <article
                className="
                    relative
                    overflow-hidden
                    border
                    border-border/70
                    bg-[#171b18]
                    text-white
                "
            >
                <div className="grid lg:min-h-[560px] lg:grid-cols-[1.18fr_0.82fr] xl:min-h-[600px]">
                    <div
                        className="
                            relative
                            min-h-[360px]
                            overflow-hidden
                            sm:min-h-[430px]
                            lg:min-h-full
                        "
                    >
                        <CampaignImage
                            imageUrl={imageUrl}
                            title={campaign.title}
                            feature
                        />

                        <div
                            className="
                                absolute
                                inset-0
                                bg-linear-to-r
                                from-black/15
                                via-transparent
                                to-black/20
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-x-0
                                bottom-0
                                h-[55%]
                                bg-linear-to-t
                                from-black/65
                                via-black/15
                                to-transparent
                                lg:hidden
                            "
                        />

                        {campaign.category && (
                            <div className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8 lg:left-10 lg:top-10">
                                <span
                                    className="
                                        border
                                        border-white/35
                                        bg-black/10
                                        px-2.5
                                        py-1.5
                                        font-bengali
                                        text-[10px]
                                        leading-none
                                        text-white
                                        backdrop-blur-[3px]
                                        sm:px-3
                                        sm:text-[11px]
                                        lg:px-3.5
                                        lg:py-2
                                        lg:text-[12px]
                                    "
                                >
                                    {campaign.category}
                                </span>
                            </div>
                        )}

                        <span
                            className="
                                absolute
                                bottom-6
                                left-5
                                z-20
                                font-serif
                                text-[56px]
                                font-light
                                leading-none
                                tracking-[-0.06em]
                                text-white/90
                                sm:bottom-8
                                sm:left-8
                                sm:text-[72px]
                                lg:bottom-10
                                lg:left-10
                                lg:text-[88px]
                                xl:text-[96px]
                            "
                        >
                            {campaignNumber}
                        </span>

                        {location && (
                            <div
                                className="
                                    absolute
                                    bottom-7
                                    right-5
                                    z-20
                                    flex
                                    items-center
                                    gap-1.5
                                    sm:bottom-9
                                    sm:right-8
                                    lg:bottom-11
                                    lg:right-10
                                    lg:gap-2
                                "
                            >
                                <HiOutlineLocationMarker className="text-[12px] sm:text-[13px] lg:text-[15px]" />

                                <span className="font-bengali text-[10px] leading-none sm:text-[11px] lg:text-[12px]">
                                    {location}
                                </span>
                            </div>
                        )}
                    </div>

                    <div
                        className="
                            relative
                            flex
                            flex-col
                            px-6
                            py-7
                            sm:px-8
                            sm:py-9
                            lg:px-11
                            lg:py-12
                            xl:px-14
                            xl:py-14
                        "
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 sm:pb-5 lg:pb-6">
                            <span
                                className="
                                    text-[8px]
                                    font-medium
                                    uppercase
                                    tracking-[0.2em]
                                    text-white/50
                                    sm:text-[9px]
                                    sm:tracking-[0.24em]
                                    lg:text-[10px]
                                "
                            >
                                Stand For People
                            </span>

                            {campaign.daysLeft != null && (
                                <div className="flex items-center gap-1.5 text-white/65 lg:gap-2">
                                    <FiClock className="text-[11px] lg:text-[14px]" />

                                    <span className="font-bengali text-[10px] leading-none sm:text-[11px] lg:text-[12px]">
                                        {campaign.daysLeft > 0
                                            ? `${toBengaliNumber(campaign.daysLeft)} দিন বাকি`
                                            : 'আজ শেষ'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <h3
                            className="
                                mt-7
                                max-w-[560px]
                                font-bengali
                                text-[25px]
                                font-semibold
                                leading-[1.5]
                                tracking-[-0.025em]
                                text-white
                                sm:mt-9
                                sm:text-[29px]
                                lg:mt-11
                                lg:text-[37px]
                                lg:leading-[1.48]
                                xl:text-[42px]
                            "
                        >
                            {campaign.title}
                        </h3>

                        {descriptionText && (
                            <p
                                className="
                                    mt-4
                                    line-clamp-3
                                    max-w-[500px]
                                    font-bengali
                                    text-[11px]
                                    leading-[2]
                                    text-white/60
                                    sm:mt-5
                                    sm:text-[12px]
                                    lg:mt-6
                                    lg:text-[14px]
                                    lg:leading-[2.05]
                                "
                            >
                                {descriptionText}
                            </p>
                        )}

                        <div className="mt-auto pt-8 sm:pt-10 lg:pt-12">
                            <Progress progress={campaign.progress} light />

                            <div className="mt-6 grid grid-cols-2 gap-5 sm:mt-7 sm:gap-6 lg:mt-8 lg:gap-8">
                                <div>
                                    <p className="font-bengali text-[10px] leading-none text-white/45 sm:text-[11px] lg:text-[12px]">
                                        সংগ্রহ হয়েছে
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[22px]
                                            font-semibold
                                            tracking-[-0.04em]
                                            text-white
                                            sm:text-[25px]
                                            lg:text-[31px]
                                            xl:text-[34px]
                                        "
                                    >
                                        ৳{formatAmount(raisedAmount)}
                                    </p>

                                    {targetAmount > 0 && (
                                        <p className="mt-1 font-bengali text-[9px] leading-none text-white/40 sm:text-[10px] lg:text-[11px]">
                                            লক্ষ্য ৳{formatAmount(targetAmount)}
                                        </p>
                                    )}
                                </div>

                                <div className="border-l border-white/15 pl-5 sm:pl-6 lg:pl-7">
                                    <p className="font-bengali text-[10px] leading-none text-white/45 sm:text-[11px] lg:text-[12px]">
                                        সহায়তাকারী
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 lg:mt-2.5 lg:gap-2.5">
                                        <FiUsers className="text-[13px] text-white/70 sm:text-[14px] lg:text-[16px]" />

                                        <span className="text-[17px] font-semibold text-white sm:text-[19px] lg:text-[22px]">
                                            {toBengaliNumber(supporterCount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 flex items-center justify-between gap-5 border-t border-white/15 pt-5 sm:mt-8 sm:pt-6 lg:mt-9 lg:pt-7">
                                <span className="font-bengali text-[10px] font-semibold leading-[1.6] text-white/85 sm:text-[11px] lg:text-[13px]">
                                    উদ্যোগটির সম্পূর্ণ গল্প দেখুন
                                </span>

                                <span
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        text-[#171b18]
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                        sm:h-11
                                        sm:w-11
                                        lg:h-12
                                        lg:w-12
                                    "
                                >
                                    <HiArrowSmRight className="text-[17px] sm:text-[18px] lg:text-[19px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
