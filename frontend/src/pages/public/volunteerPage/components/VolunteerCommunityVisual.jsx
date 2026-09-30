import {
    TbArrowRight,
    TbHeartHandshake,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

const VolunteerCommunityVisual = ({
    volunteers = [],
    volunteersLoading = false,
    onJoin,
}) => {
    return (
        <div
            className="
                relative

                min-h-[400px]
                overflow-hidden

                sm:min-h-[440px]
                lg:min-h-[470px]
            "
        >
            {volunteersLoading ? (
                <LoadingState />
            ) : volunteers.length > 0 ? (
                <CommunityField volunteers={volunteers} />
            ) : (
                <EmptyState onJoin={onJoin} />
            )}

            <style>{`
                @keyframes volunteerFadeReveal {
                    0% {
                        opacity: 0;
                        transform: translateY(18px) scale(0.95);
                        filter: blur(5px);
                    }

                    100% {
                        filter: blur(0);
                    }
                }

                .volunteer-fade-card {
                    animation:
                        volunteerFadeReveal
                        700ms
                        cubic-bezier(0.22, 1, 0.36, 1)
                        both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .volunteer-fade-card {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

/* =========================================================
   LOADING
========================================================= */

const LoadingState = () => {
    const positions = [
        'top-[5%] left-[5%]',
        'top-[25%] right-[3%]',
        'top-[48%] left-[14%]',
        'bottom-[3%] right-[14%]',
    ];

    return (
        <div className="absolute inset-0">
            {positions.map((position) => (
                <div
                    key={position}
                    className={`
                        absolute
                        ${position}

                        flex
                        w-[220px]
                        animate-pulse
                        items-center
                        gap-3

                        rounded-2xl
                        border
                        border-border

                        bg-surface/80

                        p-3

                        shadow-sm

                        sm:w-[250px]
                    `}
                >
                    <div
                        className="
                            size-11
                            shrink-0
                            rounded-xl
                            bg-border
                        "
                    />

                    <div className="flex-1">
                        <div
                            className="
                                h-3.5
                                w-3/4
                                rounded
                                bg-border
                            "
                        />

                        <div
                            className="
                                mt-2
                                h-2.5
                                w-1/2
                                rounded
                                bg-border
                            "
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

/* =========================================================
   COMMUNITY FIELD
========================================================= */

const CommunityField = ({ volunteers }) => {
    return (
        <div className="absolute inset-0">
            {/* SOFT BACKGROUND */}

            <div
                className="
                    absolute
                    top-1/2
                    left-1/2

                    h-[250px]
                    w-[250px]

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-primary-soft/60

                    blur-[75px]

                    sm:h-[330px]
                    sm:w-[330px]
                "
            />

            {/* CONNECTIONS */}

            <svg
                viewBox="0 0 650 450"
                fill="none"
                aria-hidden="true"
                className="
                    pointer-events-none

                    absolute
                    inset-0

                    h-full
                    w-full

                    text-primary
                    opacity-25
                "
            >
                <path
                    d="M82 104 C165 85 215 142 292 180 C365 217 428 170 547 119"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                />

                <path
                    d="M111 329 C190 277 238 298 321 252 C405 205 465 263 575 326"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                />

                <path
                    d="M292 180 C305 207 313 225 321 252"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                />

                <circle cx="82" cy="104" r="3" fill="currentColor" />
                <circle cx="292" cy="180" r="3" fill="currentColor" />
                <circle cx="547" cy="119" r="3" fill="currentColor" />
                <circle cx="111" cy="329" r="3" fill="currentColor" />
                <circle cx="321" cy="252" r="3" fill="currentColor" />
                <circle cx="575" cy="326" r="3" fill="currentColor" />
            </svg>

            {/* VOLUNTEER CARDS */}

            {volunteers.slice(0, 6).map((volunteer, index) => (
                <VolunteerCard
                    key={volunteer.id}
                    volunteer={volunteer}
                    index={index}
                />
            ))}

            {/* CENTER NODE */}

            <div
                className="
                    absolute
                    top-1/2
                    left-1/2
                    z-10

                    hidden

                    -translate-x-1/2
                    -translate-y-1/2

                    sm:block
                "
            >
                <div
                    className="
                        relative

                        flex
                        size-12
                        items-center
                        justify-center

                        rounded-full

                        border-[5px]
                        border-background

                        bg-primary

                        text-white!

                        shadow-[0_10px_30px_rgba(15,118,110,0.22)]
                    "
                >
                    <TbHeartHandshake size={20} />

                    <span
                        className="
                            absolute
                            -inset-2
                            -z-10

                            animate-ping

                            rounded-full

                            border
                            border-primary/20
                        "
                    />
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   VOLUNTEER CARD
========================================================= */

const VolunteerCard = ({ volunteer, index }) => {
    const positions = [
        'top-[4%] left-[3%] sm:left-[7%]',
        'top-[10%] right-[1%] sm:right-[4%]',
        'top-[36%] left-[18%] sm:left-[22%]',
        'top-[45%] right-[2%] sm:right-[8%]',
        'bottom-[2%] left-[3%] sm:left-[10%]',
        'bottom-[1%] right-[22%]',
    ];

    const widths = [
        'w-[185px] sm:w-[220px]',
        'w-[165px] sm:w-[200px]',
        'w-[195px] sm:w-[235px]',
        'w-[170px] sm:w-[205px]',
        'w-[160px] sm:w-[195px]',
        'w-[150px] sm:w-[185px]',
    ];

    const rotations = [
        '-rotate-[2deg]',
        'rotate-[2deg]',
        'rotate-[1deg]',
        '-rotate-[1.5deg]',
        'rotate-[2deg]',
        '-rotate-[2deg]',
    ];

    const opacities = [
        'opacity-100',
        'opacity-90',
        'opacity-95',
        'opacity-80',
        'opacity-70',
        'opacity-55',
    ];

    const delays = ['0ms', '120ms', '240ms', '360ms', '480ms', '600ms'];

    const initial = volunteer.name?.trim()?.charAt(0)?.toUpperCase() || 'S';

    return (
        <article
            style={{
                animationDelay: delays[index],
                zIndex: 6 - index,
            }}
            className={`
                volunteer-fade-card

                absolute

                ${positions[index]}
                ${widths[index]}
                ${rotations[index]}
                ${opacities[index]}

                group

                flex
                items-center
                gap-3

                rounded-2xl

                border
                border-white/80

                bg-white/80

                p-2.5

                shadow-[0_14px_45px_rgba(15,23,42,0.07)]

                backdrop-blur-md

                transition-all
                duration-500

                hover:z-20
                hover:rotate-0
                hover:opacity-100
                hover:shadow-[0_18px_55px_rgba(15,23,42,0.12)]

                sm:gap-3.5
                sm:p-3
            `}
        >
            {/* ABSTRACT AVATAR */}

            <div
                className="
                    relative

                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center

                    overflow-hidden

                    rounded-xl

                    bg-primary-soft

                    sm:size-12
                "
            >
                <span
                    className="
                        absolute
                        -top-3
                        -right-3

                        size-8

                        rounded-full

                        bg-primary-muted/70
                    "
                />

                <span
                    className="
                        absolute
                        -bottom-4
                        -left-2

                        size-9

                        rounded-full

                        bg-accent-soft
                    "
                />

                <span
                    className="
                        relative
                        z-10

                        flex
                        size-7
                        items-center
                        justify-center

                        rounded-full

                        bg-primary

                        text-[11px]
                        font-medium
                        text-white!

                        sm:size-8
                        sm:text-[12px]
                    "
                >
                    {initial}
                </span>
            </div>

            {/* IDENTITY */}

            <div className="min-w-0 flex-1">
                <div
                    className="
                        flex
                        items-center
                        gap-1.5
                    "
                >
                    <h3
                        className="
                            min-w-0
                            truncate

                            text-[11.5px]
                            font-medium
                            text-text-primary

                            sm:text-[12.5px]
                        "
                    >
                        {volunteer.name || 'SP স্বেচ্ছাসেবক'}
                    </h3>

                    <TbShieldCheck
                        size={13}
                        className="
                            shrink-0
                            text-primary
                        "
                    />
                </div>

                <p
                    className="
                        mt-1
                        truncate

                        text-[9.5px]
                        text-text-muted

                        sm:text-[10.5px]
                    "
                >
                    {volunteer.skills || 'মানবিক সহায়তায় যুক্ত'}
                </p>
            </div>
        </article>
    );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ onJoin }) => {
    return (
        <div
            className="
                absolute
                top-1/2
                left-1/2

                w-full
                max-w-[360px]

                -translate-x-1/2
                -translate-y-1/2

                text-center
            "
        >
            <div
                className="
                    relative

                    mx-auto

                    flex
                    h-[120px]
                    w-[190px]
                    items-center
                    justify-center
                "
            >
                <div
                    className="
                        absolute
                        top-0
                        left-2

                        size-16

                        -rotate-6

                        rounded-2xl

                        bg-primary-soft
                    "
                />

                <div
                    className="
                        absolute
                        right-2
                        bottom-0

                        size-20

                        rotate-6

                        rounded-2xl

                        bg-background-warm
                    "
                />

                <div
                    className="
                        relative

                        flex
                        size-16
                        items-center
                        justify-center

                        rounded-full

                        bg-primary

                        text-white!
                    "
                >
                    <TbUsers size={25} />
                </div>
            </div>

            <p
                className="
                    mt-4

                    text-[13px]
                    leading-7
                    text-text-secondary
                "
            >
                আমাদের স্বেচ্ছাসেবক কমিউনিটি ধীরে ধীরে আরও বড় হচ্ছে। আপনিও এর
                অংশ হতে পারেন।
            </p>

            <button
                type="button"
                onClick={onJoin}
                className="
                    group

                    mt-5

                    inline-flex
                    items-center
                    gap-2

                    text-[13px]
                    font-medium
                    text-primary
                "
            >
                স্বেচ্ছাসেবক হতে আবেদন করুন
                <TbArrowRight
                    className="
                        transition-transform
                        group-hover:translate-x-1
                    "
                />
            </button>
        </div>
    );
};

export default VolunteerCommunityVisual;
