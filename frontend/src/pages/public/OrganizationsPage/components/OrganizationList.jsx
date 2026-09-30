import { useEffect, useRef, useState } from 'react';

import { TbBuildingCommunity, TbMapPin, TbShieldCheck } from 'react-icons/tb';

import { apiRequest } from '@/api/client';

/* =========================================================
   ILLUSTRATIVE ORGANIZATION IMAGES

   These are visual placeholders only.

   Backend images take priority:
   1. organization.banner
   2. organization.photo
   3. organization.user?.photo
   4. fallback image
========================================================= */

const organizationImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1400&q=85',
];

/* =========================================================
   ORGANIZATION LIST
========================================================= */

const OrganizationList = () => {
    const sectionRef = useRef(null);
    const requestStartedRef = useRef(false);

    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestStarted, setRequestStarted] = useState(false);
    const [error, setError] = useState('');

    /* =====================================================
       LOAD ORGANIZATIONS
    ====================================================== */

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) {
            return undefined;
        }

        let isMounted = true;

        const loadOrganizations = async () => {
            if (requestStartedRef.current) {
                return;
            }

            requestStartedRef.current = true;

            try {
                setRequestStarted(true);
                setLoading(true);
                setError('');

                const data = await apiRequest('/organizations');

                if (!isMounted) {
                    return;
                }

                setOrganizations(
                    Array.isArray(data?.organizations)
                        ? data.organizations
                        : [],
                );
            } catch (err) {
                console.error('Failed to load public organizations:', err);

                if (isMounted) {
                    setOrganizations([]);

                    setError('প্রতিষ্ঠানগুলোর তথ্য এখন দেখানো যাচ্ছে না।');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        /* =================================================
           LOAD JUST BEFORE SECTION ENTERS VIEW
        ================================================= */

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry?.isIntersecting) {
                    loadOrganizations();
                    observer.disconnect();
                }
            },
            {
                root: null,
                rootMargin: '300px 0px',
                threshold: 0,
            },
        );

        observer.observe(section);

        return () => {
            isMounted = false;
            observer.disconnect();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="organizations"
            className="
                scroll-mt-24
                overflow-hidden
                bg-background
            "
        >
            <div
                className="
                    container-width

                    py-14
                    sm:py-16
                    lg:py-20
                    xl:py-24
                "
            >
                {/* =================================================
                    INTRO
                ================================================= */}

                <div
                    className="
                        grid
                        gap-7

                        md:grid-cols-[minmax(0,1fr)_minmax(250px,350px)]
                        md:items-end
                        md:gap-12

                        lg:gap-16
                    "
                >
                    {/* LEFT */}

                    <div className="max-w-[720px]">
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <span
                                className="
                                    h-px
                                    w-9
                                    bg-primary
                                "
                            />

                            <p
                                className="
                                    font-bengali

                                    text-[12px]
                                    font-medium

                                    text-primary

                                    sm:text-[13px]
                                "
                            >
                                প্রতিষ্ঠানসমূহ
                            </p>
                        </div>

                        <h2
                            className="
                                mt-4

                                max-w-[650px]

                                font-bengali

                                text-[1.85rem]
                                font-medium
                                leading-[1.42]
                                tracking-normal

                                text-text-primary

                                sm:text-[2.15rem]
                                lg:text-[2.5rem]
                            "
                        >
                            মানুষের পাশে কাজ করা
                            <span className="text-primary">
                                {' '}
                                প্রতিষ্ঠানগুলোকে জানুন
                            </span>
                        </h2>
                    </div>

                    {/* RIGHT */}

                    <div>
                        <p
                            className="
                                font-bengali

                                text-[13px]
                                leading-7

                                text-text-secondary

                                sm:text-[14px]
                            "
                        >
                            স্ট্যান্ড ফর পিপলের সঙ্গে যুক্ত প্রতিষ্ঠানগুলো
                            বিভিন্ন প্রয়োজন, উদ্যোগ ও মানবিক কার্যক্রমে মানুষের
                            পাশে কাজ করছে।
                        </p>

                        {!loading && organizations.length > 0 && (
                            <div
                                className="
                                    mt-4

                                    flex
                                    items-center
                                    gap-2

                                    border-t
                                    border-border

                                    pt-3

                                    font-bengali

                                    text-[11px]
                                    text-text-muted

                                    sm:text-[12px]
                                "
                            >
                                <span
                                    className="
                                        size-1.5

                                        rounded-full

                                        bg-primary
                                    "
                                />
                                বর্তমানে
                                <span
                                    className="
                                        font-medium

                                        text-text-primary
                                    "
                                >
                                    {organizations.length}
                                </span>
                                টি প্রতিষ্ঠান
                            </div>
                        )}
                    </div>
                </div>

                {/* =================================================
                    INTRO DIVIDER
                ================================================= */}

                <div
                    className="
                        mt-8

                        h-px
                        w-full

                        bg-border

                        lg:mt-10
                    "
                />

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <div
                        className="
                            grid
                            grid-cols-1

                            gap-x-5
                            gap-y-7

                            pt-10

                            sm:grid-cols-2
                            sm:gap-6

                            lg:grid-cols-12
                            lg:gap-6
                            lg:pt-14
                        "
                    >
                        {/* LARGE */}

                        <div
                            className="
                                animate-pulse

                                lg:col-span-7
                            "
                        >
                            <div
                                className="
                                    aspect-[16/10]

                                    bg-border

                                    lg:aspect-[16/9]
                                "
                            />

                            <div
                                className="
                                    mt-3

                                    h-3
                                    w-32

                                    rounded

                                    bg-border
                                "
                            />
                        </div>

                        {/* TALL */}

                        <div
                            className="
                                animate-pulse

                                lg:col-span-5
                                lg:pt-20
                            "
                        >
                            <div
                                className="
                                    aspect-[4/5]

                                    bg-border

                                    lg:aspect-[4/4.4]
                                "
                            />

                            <div
                                className="
                                    mt-3

                                    h-3
                                    w-28

                                    rounded

                                    bg-border
                                "
                            />
                        </div>

                        {/* SMALL TALL */}

                        <div
                            className="
                                animate-pulse

                                lg:col-span-4
                                lg:ml-10
                            "
                        >
                            <div
                                className="
                                    aspect-[4/5]

                                    bg-border
                                "
                            />

                            <div
                                className="
                                    mt-3

                                    h-3
                                    w-28

                                    rounded

                                    bg-border
                                "
                            />
                        </div>

                        {/* LARGE WIDE */}

                        <div
                            className="
                                animate-pulse

                                lg:col-span-8
                                lg:pt-12
                            "
                        >
                            <div
                                className="
                                    aspect-[16/9]

                                    bg-border

                                    lg:aspect-[16/8]
                                "
                            />

                            <div
                                className="
                                    mt-3

                                    h-3
                                    w-36

                                    rounded

                                    bg-border
                                "
                            />
                        </div>
                    </div>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (
                    <div
                        className="
                            py-14

                            sm:py-16
                            lg:py-20
                        "
                    >
                        <div
                            className="
                                flex
                                max-w-xl
                                items-start
                                gap-4
                            "
                        >
                            <div
                                className="
                                    flex
                                    size-11
                                    shrink-0
                                    items-center
                                    justify-center

                                    bg-primary-soft

                                    text-primary
                                "
                            >
                                <TbBuildingCommunity size={21} />
                            </div>

                            <div>
                                <h3
                                    className="
                                        font-bengali

                                        text-[17px]
                                        font-medium

                                        text-text-primary
                                    "
                                >
                                    প্রতিষ্ঠানগুলোর তথ্য পাওয়া যায়নি
                                </h3>

                                <p
                                    className="
                                        mt-1.5

                                        font-bengali

                                        text-[13px]
                                        leading-7

                                        text-text-secondary
                                    "
                                >
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    organizations.length === 0 &&
                    requestStarted && (
                        <div
                            className="
                                py-14

                                sm:py-16
                                lg:py-20
                            "
                        >
                            <div
                                className="
                                    flex
                                    max-w-xl
                                    items-start
                                    gap-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        size-11
                                        shrink-0
                                        items-center
                                        justify-center

                                        bg-primary-soft

                                        text-primary
                                    "
                                >
                                    <TbBuildingCommunity size={21} />
                                </div>

                                <div>
                                    <h3
                                        className="
                                            font-bengali

                                            text-[17px]
                                            font-medium

                                            text-text-primary
                                        "
                                    >
                                        এখনো কোনো প্রতিষ্ঠান যুক্ত হয়নি
                                    </h3>

                                    <p
                                        className="
                                            mt-1.5

                                            font-bengali

                                            text-[13px]
                                            leading-7

                                            text-text-secondary
                                        "
                                    >
                                        নতুন প্রতিষ্ঠান যুক্ত হলে এখানে তাদের
                                        তথ্য দেখা যাবে।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                {/* =================================================
                    ABSTRACT ORGANIZATION GALLERY
                ================================================= */}

                {!loading && !error && organizations.length > 0 && (
                    <div
                        className="
                                relative

                                pt-10

                                sm:pt-12
                                lg:pt-16
                            "
                    >
                        {/* =====================================
                                GALLERY
                            ====================================== */}

                        <div
                            className="
                                    grid
                                    grid-cols-1

                                    gap-x-5
                                    gap-y-8

                                    sm:grid-cols-2
                                    sm:gap-x-6
                                    sm:gap-y-10

                                    lg:grid-cols-12
                                    lg:gap-x-6
                                    lg:gap-y-8
                                "
                        >
                            {organizations.map((organization, index) => {
                                const fallbackImage =
                                    organizationImages[
                                        index % organizationImages.length
                                    ];

                                /*
                                 * Backend image structure:
                                 *
                                 * organization.banner
                                 * organization.photo
                                 * organization.user?.photo
                                 *
                                 * Keep fallback image for
                                 * organizations that do not
                                 * have uploaded media.
                                 */

                                const image =
                                    organization.banner ||
                                    organization.photo ||
                                    organization.user?.photo ||
                                    fallbackImage;

                                /*
                                 * Presentation only.
                                 *
                                 * Repeats every six items
                                 * and creates the abstract
                                 * gallery rhythm.
                                 */

                                const galleryPosition = index % 6;

                                const layouts = [
                                    {
                                        wrapper: `
                                                    lg:col-span-7
                                                `,
                                        image: `
                                                    aspect-[16/10]

                                                    lg:aspect-[16/9]
                                                `,
                                    },

                                    {
                                        wrapper: `
                                                    lg:col-span-5
                                                    lg:pt-20
                                                `,
                                        image: `
                                                    aspect-[4/5]

                                                    lg:aspect-[4/4.4]
                                                `,
                                    },

                                    {
                                        wrapper: `
                                                    lg:col-span-4
                                                    lg:ml-10
                                                `,
                                        image: `
                                                    aspect-[4/5]
                                                `,
                                    },

                                    {
                                        wrapper: `
                                                    lg:col-span-8
                                                    lg:pt-12
                                                `,
                                        image: `
                                                    aspect-[16/9]

                                                    lg:aspect-[16/8]
                                                `,
                                    },

                                    {
                                        wrapper: `
                                                    lg:col-span-6
                                                    lg:pt-4
                                                `,
                                        image: `
                                                    aspect-[16/11]
                                                `,
                                    },

                                    {
                                        wrapper: `
                                                    lg:col-span-5
                                                    lg:col-start-8
                                                    lg:-mt-10
                                                `,
                                        image: `
                                                    aspect-[4/5]

                                                    lg:aspect-[4/4.5]
                                                `,
                                    },
                                ];

                                const layout = layouts[galleryPosition];

                                return (
                                    <article
                                        key={organization.id}
                                        className={`
                                                    group

                                                    relative
                                                    min-w-0

                                                    ${layout.wrapper}
                                                `}
                                    >
                                        {/* =============================
                                                    IMAGE FIELD
                                                ============================== */}

                                        <div
                                            className={`
                                                        relative

                                                        overflow-hidden

                                                        bg-background-alt

                                                        ${layout.image}
                                                    `}
                                        >
                                            <img
                                                src={image}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                className="
                                                            absolute
                                                            inset-0

                                                            h-full
                                                            w-full

                                                            object-cover

                                                            transition-transform
                                                            duration-[900ms]
                                                            ease-out

                                                            group-hover:scale-[1.035]
                                                        "
                                            />

                                            {/* =========================
                                                        IMAGE TONE
                                                    ========================== */}

                                            <div
                                                aria-hidden="true"
                                                className="
                                                            pointer-events-none

                                                            absolute
                                                            inset-0

                                                            bg-[#092f2a]/[0.05]
                                                        "
                                            />

                                            <div
                                                aria-hidden="true"
                                                className="
                                                            pointer-events-none

                                                            absolute
                                                            inset-x-0
                                                            bottom-0

                                                            h-[65%]

                                                            bg-linear-to-t

                                                            from-[#082c28]/90
                                                            via-[#082c28]/30
                                                            to-transparent
                                                        "
                                            />

                                            {/* =========================
                                                        TOP INDEX
                                                    ========================== */}

                                            <div
                                                className="
                                                            absolute
                                                            left-5
                                                            top-5

                                                            flex
                                                            items-center
                                                            gap-2.5

                                                            sm:left-6
                                                            sm:top-6
                                                        "
                                            >
                                                <span
                                                    className="
                                                                h-px
                                                                w-6

                                                                bg-white/65
                                                            "
                                                />

                                                <span
                                                    className="
                                                                font-poppins

                                                                text-[10px]
                                                                font-medium

                                                                tracking-[0.16em]

                                                                text-white/85
                                                            "
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>

                                            {/* =========================
                                                        VERIFIED MARK
                                                    ========================== */}

                                            <div
                                                className="
                                                            absolute
                                                            right-5
                                                            top-5

                                                            flex
                                                            size-8
                                                            items-center
                                                            justify-center

                                                            border
                                                            border-white/25

                                                            bg-black/10

                                                            text-white!

                                                            backdrop-blur-md

                                                            sm:right-6
                                                            sm:top-6
                                                        "
                                            >
                                                <TbShieldCheck
                                                    size={16}
                                                    strokeWidth={1.7}
                                                />
                                            </div>

                                            {/* =========================
                                                        ORGANIZATION CONTENT
                                                    ========================== */}

                                            <div
                                                className="
                                                            absolute
                                                            inset-x-0
                                                            bottom-0

                                                            p-5

                                                            sm:p-6
                                                            lg:p-7
                                                        "
                                            >
                                                {/* TYPE */}

                                                {organization.organization_type && (
                                                    <div
                                                        className="
                                                                    mb-3

                                                                    flex
                                                                    items-center
                                                                    gap-2
                                                                "
                                                    >
                                                        <span
                                                            className="
                                                                        size-1

                                                                        rounded-full

                                                                        bg-accent
                                                                    "
                                                        />

                                                        <p
                                                            className="
                                                                        font-bengali

                                                                        text-[10.5px]
                                                                        font-medium

                                                                        text-white/70

                                                                        sm:text-[11px]
                                                                    "
                                                        >
                                                            {
                                                                organization.organization_type
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                {/* NAME */}

                                                <h3
                                                    className="
                                                                max-w-[520px]

                                                                font-bengali

                                                                text-[20px]
                                                                font-medium
                                                                leading-[1.45]

                                                                text-white!

                                                                sm:text-[22px]

                                                                lg:text-[24px]

                                                                xl:text-[25px]
                                                            "
                                                >
                                                    {organization.name}
                                                </h3>

                                                {/* LOCATION */}

                                                <div
                                                    className="
                                                                mt-3

                                                                flex
                                                                max-w-[450px]
                                                                items-start
                                                                gap-2
                                                            "
                                                >
                                                    <TbMapPin
                                                        size={14}
                                                        strokeWidth={1.8}
                                                        className="
                                                                    mt-[4px]

                                                                    shrink-0

                                                                    text-white/60
                                                                "
                                                    />

                                                    <p
                                                        className="
                                                                    line-clamp-1

                                                                    font-bengali

                                                                    text-[11px]
                                                                    leading-5

                                                                    text-white/70

                                                                    sm:text-[12px]
                                                                "
                                                    >
                                                        {organization.address ||
                                                            'ঠিকানা উল্লেখ করা হয়নি'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* =============================
                                                    IDENTITY STRIP
                                                ============================== */}

                                        <div
                                            className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-5

                                                        border-b
                                                        border-border

                                                        px-1
                                                        py-3.5
                                                    "
                                        >
                                            <div
                                                className="
                                                            flex
                                                            min-w-0
                                                            items-center
                                                            gap-2
                                                        "
                                            >
                                                <TbShieldCheck
                                                    size={14}
                                                    strokeWidth={1.7}
                                                    className="
                                                                shrink-0

                                                                text-primary
                                                            "
                                                />

                                                <span
                                                    className="
                                                                truncate

                                                                font-bengali

                                                                text-[10.5px]
                                                                font-medium

                                                                text-text-secondary
                                                            "
                                                >
                                                    যাচাইকৃত প্রতিষ্ঠান
                                                </span>
                                            </div>

                                            <div
                                                className="
                                                            flex
                                                            shrink-0
                                                            items-center
                                                            gap-2
                                                        "
                                            >
                                                <span
                                                    className="
                                                                hidden

                                                                font-bengali

                                                                text-[10px]

                                                                text-text-muted

                                                                sm:inline
                                                            "
                                                >
                                                    SP নেটওয়ার্ক
                                                </span>

                                                <span
                                                    className="
                                                                h-px
                                                                w-4

                                                                bg-border-strong
                                                            "
                                                />

                                                <span
                                                    className="
                                                                font-poppins

                                                                text-[9px]
                                                                font-medium

                                                                tracking-[0.14em]

                                                                text-text-muted
                                                            "
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* =====================================
                                GALLERY END
                            ====================================== */}

                        <div
                            className="
                                    mt-12

                                    flex
                                    items-center
                                    gap-4

                                    sm:mt-14
                                    lg:mt-16
                                "
                        >
                            <span
                                className="
                                        h-px
                                        flex-1

                                        bg-border
                                    "
                            />

                            <div
                                className="
                                        flex
                                        shrink-0
                                        items-center
                                        gap-2
                                    "
                            >
                                <TbBuildingCommunity
                                    size={15}
                                    strokeWidth={1.6}
                                    className="
                                            text-primary
                                        "
                                />

                                <p
                                    className="
                                            font-bengali

                                            text-[10.5px]

                                            text-text-muted

                                            sm:text-[11px]
                                        "
                                >
                                    স্ট্যান্ড ফর পিপল নেটওয়ার্ক
                                </p>
                            </div>

                            <span
                                className="
                                        h-px
                                        w-8

                                        bg-primary/40
                                    "
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrganizationList;
