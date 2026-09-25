import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiX } from 'react-icons/fi';

const MegaMenu = ({ item, onClose }) => {
    const menuRef = useRef(null);

    if (!item) return null;

    const preview = item.preview;

    return (
        <div
            className="
                fixed
                top-[84px]
                left-0
                z-[1000]
                flex
                w-full
                justify-center
                px-4
                pointer-events-none
            "
        >
            {/* =====================================================
                BACKDROP
            ===================================================== */}

            <div
                className="
                    fixed
                    inset-0
                    z-[999]
                    bg-slate-950/20
                    backdrop-blur-[2px]
                    pointer-events-auto
                "
                onClick={onClose}
                aria-hidden="true"
            />

            {/* =====================================================
                MEGA MENU
            ===================================================== */}

            <div
                ref={menuRef}
                className="
                    relative
                    z-[1001]
                    mt-3
                    w-[min(1120px,94vw)]
                    max-h-[calc(100vh-7rem)]
                    overflow-y-auto
                    overflow-x-hidden
                    rounded-xl
                    border
                    border-border
                    bg-surface
                    shadow-[0_24px_70px_rgba(15,23,42,0.12)]
                    pointer-events-auto
                    animate-[fadeIn_0.18s_ease-out]
                "
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-6
                        py-4
                        lg:px-8
                    "
                >
                    <div>
                        <p
                            className="
                                text-[11px]
                                font-semibold
                                tracking-[0.14em]
                                text-text-muted
                            "
                        >
                            {item.name === 'অংশ নিন'
                                ? 'অংশগ্রহণ'
                                : item.name === 'দেখুন'
                                  ? 'কার্যক্রম'
                                  : 'পরিচিতি'}
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-text-primary
                            "
                        >
                            {item.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="মেনু বন্ধ করুন"
                        onClick={onClose}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-border
                            text-text-secondary
                            transition-colors
                            duration-200
                            hover:border-primary
                            hover:bg-background-teal
                            hover:text-primary
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                        "
                    >
                        <FiX className="text-[17px]" />
                    </button>
                </div>

                {/* =================================================
                    BODY
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        p-6
                        lg:grid-cols-12
                        lg:gap-10
                        lg:p-8
                    "
                >
                    {/* =================================================
                        LEFT — NAVIGATION GROUPS
                    ================================================= */}

                    <div className="lg:col-span-8">
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-7
                                md:grid-cols-2
                            "
                        >
                            {item.groups.map((group) => (
                                <div key={group.title}>
                                    {/* Group heading */}

                                    <h4
                                        className="
                                            mb-3
                                            text-[11px]
                                            font-semibold
                                            tracking-[0.12em]
                                            text-text-muted
                                        "
                                    >
                                        {group.title}
                                    </h4>

                                    {/* Group links */}

                                    <div className="space-y-1">
                                        {group.items.map((link) => (
                                            <Link
                                                key={link.id}
                                                to={link.path}
                                                onClick={onClose}
                                                className="
                                                    group
                                                    flex
                                                    items-start
                                                    justify-between
                                                    gap-4
                                                    rounded-lg
                                                    px-3
                                                    py-3
                                                    transition-colors
                                                    duration-200
                                                    hover:bg-background-teal
                                                "
                                            >
                                                <div className="min-w-0">
                                                    <h5
                                                        className="
                                                            text-[14px]
                                                            font-medium
                                                            leading-[1.5]
                                                            text-text-primary
                                                            transition-colors
                                                            duration-200
                                                            group-hover:text-primary
                                                        "
                                                    >
                                                        {link.name}
                                                    </h5>

                                                    {link.desc && (
                                                        <p
                                                            className="
                                                                mt-1
                                                                max-w-[34rem]
                                                                text-[12px]
                                                                font-normal
                                                                leading-[1.7]
                                                                text-text-muted
                                                            "
                                                        >
                                                            {link.desc}
                                                        </p>
                                                    )}
                                                </div>

                                                <FiArrowRight
                                                    className="
                                                        mt-0.5
                                                        shrink-0
                                                        text-[16px]
                                                        text-text-muted
                                                        opacity-0
                                                        -translate-x-1
                                                        transition-all
                                                        duration-200
                                                        group-hover:translate-x-0
                                                        group-hover:text-primary
                                                        group-hover:opacity-100
                                                    "
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT — FEATURE / PREVIEW
                    ================================================= */}

                    <div className="lg:col-span-4">
                        <div
                            className="
                                flex
                                h-full
                                flex-col
                                overflow-hidden
                                rounded-xl
                                border
                                border-border
                                bg-background
                            "
                        >
                            {/* Preview image */}

                            {preview?.image && (
                                <div
                                    className="
                                        h-40
                                        w-full
                                        overflow-hidden
                                        bg-background-alt
                                    "
                                >
                                    <img
                                        src={preview.image}
                                        alt=""
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />
                                </div>
                            )}

                            {/* Preview content */}

                            <div
                                className="
                                    flex
                                    flex-1
                                    flex-col
                                    justify-between
                                    p-5
                                    lg:p-6
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            tracking-[0.14em]
                                            text-primary
                                        "
                                    >
                                        {item.name}
                                    </p>

                                    {preview?.title && (
                                        <h3
                                            className="
                                                mt-2
                                                text-lg
                                                font-semibold
                                                leading-[1.45]
                                                text-text-primary
                                            "
                                        >
                                            {preview.title}
                                        </h3>
                                    )}

                                    {preview?.desc && (
                                        <p
                                            className="
                                                mt-3
                                                text-[13px]
                                                font-normal
                                                leading-[1.8]
                                                text-text-secondary
                                            "
                                        >
                                            {preview.desc}
                                        </p>
                                    )}

                                    {preview?.highlight && (
                                        <div
                                            className="
                                                mt-4
                                                border-l-2
                                                border-accent
                                                pl-3
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[12px]
                                                    font-medium
                                                    leading-[1.7]
                                                    text-text-secondary
                                                "
                                            >
                                                {preview.highlight}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}

                                {preview?.cta && (
                                    <Link
                                        to={preview.cta}
                                        onClick={onClose}
                                        className="
                                            mt-6
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-2
                                            text-sm
                                            font-semibold
                                            text-primary
                                            transition-all
                                            duration-200
                                            hover:gap-3
                                            hover:text-primary-hover
                                            focus:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-primary
                                            focus-visible:ring-offset-2
                                            rounded-sm
                                        "
                                    >
                                        আরও দেখুন
                                        <FiArrowRight className="text-[16px]" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
