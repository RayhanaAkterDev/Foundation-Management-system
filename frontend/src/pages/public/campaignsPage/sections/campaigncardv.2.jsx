import { Link } from 'react-router-dom';

import { HiArrowSmRight, HiOutlineLocationMarker } from 'react-icons/hi';

import { FiClock, FiUsers } from 'react-icons/fi';

import defaultCampaignImage from '@/assets/campaigns/campaignsHeroImage.png';

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

    const progressPercent = Number(campaign.progress ?? 0);

    const supporterCount = Number(campaign.supporters ?? 0);

    const descriptionText =
        campaign.shortDescription || campaign.description || '';

    const location = campaign.location || campaign.district || '';

    const safeProgress = Math.min(100, Math.max(0, progressPercent));

    const campaignNumber = String(index + 1).padStart(2, '0');

    /*
     * =========================================================
     * LANDSCAPE
     * Reference direction: card 05
     * =========================================================
     */
    if (variant === 'landscape') {
        return (
            <Link
                to={`/campaign/${campaign.id}`}
                className="group block h-full"
            >
                <article
                    className="
                        relative
                        min-h-[500px]
                        overflow-hidden
                        bg-[#1f2923]
                        sm:min-h-[560px]
                        lg:min-h-[620px]
                    "
                >
                    {/* IMAGE */}
                    <img
                        src={imageUrl}
                        alt={campaign.title || 'Campaign'}
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-[1400ms]
                            ease-[cubic-bezier(.16,1,.3,1)]
                            group-hover:scale-[1.045]
                        "
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultCampaignImage;
                        }}
                    />

                    {/* IMAGE TREATMENT */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-black/75
                            via-black/35
                            to-black/5
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/65
                            via-transparent
                            to-black/15
                        "
                    />

                    {/* NUMBER */}
                    <div
                        className="
                            absolute
                            left-6
                            top-6
                            sm:left-8
                            sm:top-8
                        "
                    >
                        <span
                            className="
                                font-serif
                                text-[50px]
                                font-light
                                leading-none
                                tracking-[-0.05em]
                                text-white/90
                                sm:text-[62px]
                            "
                        >
                            {campaignNumber}
                        </span>
                    </div>

                    {/* CATEGORY */}
                    {campaign.category && (
                        <div
                            className="
                                absolute
                                left-[94px]
                                top-8
                                flex
                                items-center
                                gap-3
                                sm:left-[118px]
                                sm:top-10
                            "
                        >
                            <span
                                className="
                                    font-bengali
                                    text-[11px]
                                    font-medium
                                    text-white/85
                                "
                            >
                                {campaign.category}
                            </span>

                            <span className="h-px w-10 bg-white/45" />
                        </div>
                    )}

                    {/* MAIN STORY */}
                    <div
                        className="
                            absolute
                            bottom-[145px]
                            left-6
                            right-6
                            sm:bottom-[155px]
                            sm:left-8
                            sm:right-8
                            lg:left-10
                        "
                    >
                        <h3
                            className="
                                max-w-[620px]
                                font-bengali
                                text-[31px]
                                font-semibold
                                leading-[1.42]
                                tracking-[-0.035em]
                                text-white

                                sm:text-[38px]
                                lg:text-[43px]
                            "
                        >
                            {campaign.title}
                        </h3>

                        <div
                            className="
                                mt-5
                                flex
                                flex-wrap
                                items-center
                                gap-x-6
                                gap-y-2
                                text-white/85
                            "
                        >
                            {location && (
                                <div className="flex items-center gap-2">
                                    <HiOutlineLocationMarker className="text-[16px]" />

                                    <span className="font-bengali text-[11px]">
                                        {location}
                                    </span>
                                </div>
                            )}

                            {campaign.daysLeft != null && (
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-[14px]" />

                                    <span className="font-bengali text-[11px]">
                                        {campaign.daysLeft > 0
                                            ? `${campaign.daysLeft} দিন বাকি`
                                            : 'আজ শেষ'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BOTTOM PAPER STRIP */}
                    <div
                        className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            bg-[#f4f0e7]
                            px-6
                            py-5
                            sm:px-8
                        "
                    >
                        <div
                            className="
                                grid
                                grid-cols-[1fr_auto]
                                items-end
                                gap-6
                            "
                        >
                            <div>
                                <div
                                    className="
                                        flex
                                        items-end
                                        gap-5
                                    "
                                >
                                    <div>
                                        <span
                                            className="
                                                font-bengali
                                                text-[10px]
                                                text-text-muted
                                            "
                                        >
                                            সংগ্রহ হয়েছে
                                        </span>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[22px]
                                                font-semibold
                                                tracking-[-0.03em]
                                                text-text-primary
                                            "
                                        >
                                            ৳{raisedAmount.toLocaleString()}
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            mb-1
                                            text-[11px]
                                            font-semibold
                                            text-primary
                                        "
                                    >
                                        {safeProgress}%
                                    </span>
                                </div>

                                <div
                                    className="
                                        mt-3
                                        h-[3px]
                                        max-w-[330px]
                                        bg-black/10
                                    "
                                >
                                    <div
                                        className="
                                            h-full
                                            bg-primary
                                            transition-all
                                            duration-1000
                                        "
                                        style={{
                                            width: `${safeProgress}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-5
                                "
                            >
                                <div
                                    className="
                                        hidden
                                        items-center
                                        gap-2
                                        sm:flex
                                    "
                                >
                                    <FiUsers className="text-[14px] text-primary" />

                                    <span
                                        className="
                                            font-bengali
                                            text-[10px]
                                            text-text-secondary
                                        "
                                    >
                                        {supporterCount} জন পাশে আছেন
                                    </span>
                                </div>

                                <span
                                    className="
                                        flex
                                        h-11
                                        w-11
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
                                    "
                                >
                                    <HiArrowSmRight className="text-[20px]" />
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    /*
     * =========================================================
     * PORTRAIT
     * Reference direction: card 02
     * =========================================================
     */

    return (
        <Link to={`/campaign/${campaign.id}`} className="group block h-full">
            <article
                className="
                    relative
                    h-full
                    min-h-[500px]
                    overflow-hidden
                    bg-[#f2eee4]
                    sm:min-h-[560px]
                    lg:min-h-[620px]
                "
            >
                {/* LARGE NUMBER */}
                <span
                    className="
                        absolute
                        left-6
                        top-6
                        z-20
                        font-serif
                        text-[52px]
                        font-light
                        leading-none
                        tracking-[-0.05em]
                        text-text-primary/75
                        sm:left-7
                        sm:top-7
                        sm:text-[62px]
                    "
                >
                    {campaignNumber}
                </span>

                {/* CATEGORY */}
                {campaign.category && (
                    <div
                        className="
                            absolute
                            left-6
                            top-[92px]
                            z-20
                            flex
                            items-center
                            gap-3
                            sm:left-7
                            sm:top-[105px]
                        "
                    >
                        <span
                            className="
                                font-bengali
                                text-[11px]
                                font-semibold
                                text-primary
                            "
                        >
                            {campaign.category}
                        </span>

                        <span className="h-px w-8 bg-accent/70" />
                    </div>
                )}

                {/* IMAGE — RIGHT SIDE */}
                <div
                    className="
                        absolute
                        bottom-[155px]
                        right-0
                        top-0
                        w-[56%]
                        overflow-hidden
                    "
                >
                    <img
                        src={imageUrl}
                        alt={campaign.title || 'Campaign'}
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-[1400ms]
                            ease-[cubic-bezier(.16,1,.3,1)]
                            group-hover:scale-[1.05]
                        "
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultCampaignImage;
                        }}
                    />

                    <div
                        className="
                            absolute
                            inset-y-0
                            left-0
                            w-24
                            bg-gradient-to-r
                            from-[#f2eee4]
                            to-transparent
                        "
                    />
                </div>

                {/* STORY */}
                <div
                    className="
                        absolute
                        bottom-[175px]
                        left-6
                        z-20
                        w-[59%]
                        sm:left-7
                    "
                >
                    <h3
                        className="
                            font-bengali
                            text-[27px]
                            font-semibold
                            leading-[1.42]
                            tracking-[-0.035em]
                            text-text-primary

                            sm:text-[31px]
                            lg:text-[34px]
                        "
                    >
                        {campaign.title}
                    </h3>

                    {descriptionText && (
                        <p
                            className="
                                mt-4
                                line-clamp-3
                                max-w-[300px]
                                font-bengali
                                text-[11px]
                                leading-[1.9]
                                text-text-secondary
                            "
                        >
                            {descriptionText}
                        </p>
                    )}

                    <div
                        className="
                            mt-5
                            flex
                            flex-wrap
                            gap-x-4
                            gap-y-2
                        "
                    >
                        {location && (
                            <div className="flex items-center gap-1.5">
                                <HiOutlineLocationMarker className="text-[14px] text-primary" />

                                <span className="font-bengali text-[10px] text-text-secondary">
                                    {location}
                                </span>
                            </div>
                        )}

                        {campaign.daysLeft != null && (
                            <div className="flex items-center gap-1.5">
                                <FiClock className="text-[13px] text-primary" />

                                <span className="font-bengali text-[10px] text-text-secondary">
                                    {campaign.daysLeft > 0
                                        ? `${campaign.daysLeft} দিন বাকি`
                                        : 'আজ শেষ'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* FUNDING FOOTER */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        z-30
                        border-t
                        border-black/[0.08]
                        bg-[#f7f3eb]
                        px-6
                        py-5
                        sm:px-7
                    "
                >
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <span
                                className="
                                    font-bengali
                                    text-[9px]
                                    text-text-muted
                                "
                            >
                                সংগ্রহ হয়েছে
                            </span>

                            <p
                                className="
                                    mt-1
                                    text-[21px]
                                    font-semibold
                                    tracking-[-0.03em]
                                    text-text-primary
                                "
                            >
                                ৳{raisedAmount.toLocaleString()}
                            </p>
                        </div>

                        <span
                            className="
                                text-[11px]
                                font-semibold
                                text-primary
                            "
                        >
                            {safeProgress}% সম্পন্ন
                        </span>
                    </div>

                    <div className="mt-3 h-[3px] bg-black/10">
                        <div
                            className="
                                h-full
                                bg-primary
                                transition-all
                                duration-1000
                            "
                            style={{
                                width: `${safeProgress}%`,
                            }}
                        />
                    </div>

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <div className="flex items-center gap-2">
                            <FiUsers className="text-[13px] text-primary" />

                            <span
                                className="
                                    font-bengali
                                    text-[9px]
                                    text-text-secondary
                                "
                            >
                                {supporterCount} জন পাশে আছেন
                            </span>
                        </div>

                        <HiArrowSmRight
                            className="
                                text-[21px]
                                text-text-primary
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                                group-hover:text-primary
                            "
                        />
                    </div>
                </div>
            </article>
        </Link>
    );
}
