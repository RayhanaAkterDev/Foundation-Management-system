import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { FiArrowRight } from 'react-icons/fi';

const MegaMenu = ({ item, onClose }) => {
    const location = useLocation();

    if (!item) return null;

    const preview = item.preview;

    return (
        <>
            {/* =============================================
                BACKDROP
            ============================================= */}
            <button
                type="button"
                aria-label="মেনু বন্ধ করুন"
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    z-[998]
                    cursor-default
                    bg-text-primary/10
                    backdrop-blur-[1px]
                "
            />

            {/* =============================================
                MEGA MENU
            ============================================= */}
            <div
                className="
                    fixed
                    inset-x-0
                    top-[89px]
                    z-[1000]
                    border-b
                    border-border
                    bg-surface
                    shadow-[0_24px_55px_-38px_rgba(15,23,42,0.28)]
                "
            >
                <div
                    className="
                        container-width
                        relative
                        grid
                        grid-cols-12
                        gap-0
                    "
                >
                    {/* =============================================
                        INTRO
                    ============================================= */}
                    <div
                        className="
                            col-span-3
                            border-r
                            border-border
                            py-8
                            pr-9
                        "
                    >
                        <p
                            className="
                                font-bengali
                                text-[12px]
                                font-medium!!
                                text-primary
                            "
                        >
                            {item.name}
                        </p>

                        <h2
                            className="
                                mt-3
                                max-w-[270px]
                                font-bengali!
                                text-[24px]
                                font-medium!!
                                leading-[1.4]!
                                tracking-normal!
                                text-text-primary
                            "
                        >
                            {preview?.title || item.name}
                        </h2>

                        {preview?.desc && (
                            <p
                                className="
                                    mt-3
                                    max-w-[285px]
                                    font-bengali
                                    text-[13px]
                                    leading-[1.8]
                                    text-text-secondary
                                "
                            >
                                {preview.desc}
                            </p>
                        )}

                        {preview?.cta && (
                            <Link
                                to={preview.cta}
                                onClick={onClose}
                                className="
                                    group
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    font-bengali
                                    text-[13px]
                                    font-medium!!
                                    text-primary
                                    transition-colors
                                    hover:text-primary-hover
                                "
                            >
                                আরও দেখুন
                                <FiArrowRight
                                    className="
                                        text-[15px]
                                        transition-transform
                                        duration-200
                                        group-hover:translate-x-1
                                    "
                                />
                            </Link>
                        )}
                    </div>

                    {/* =============================================
                        NAVIGATION
                    ============================================= */}
                    <div
                        className="
                            col-span-6
                            grid
                            grid-cols-2
                            gap-x-10
                            px-9
                            py-8
                            xl:gap-x-12
                            xl:px-11
                        "
                    >
                        {item.groups.map((group) => (
                            <section key={group.title}>
                                <div
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2.5
                                    "
                                >
                                    <span
                                        className="
                                            h-[2px]
                                            w-5
                                            bg-accent
                                        "
                                    />

                                    <p
                                        className="
                                            font-bengali
                                            text-[12px]
                                            font-medium!!
                                            text-text-secondary
                                        "
                                    >
                                        {group.title}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    {group.items.map((link) => {
                                        const isActive =
                                            location.pathname === link.path ||
                                            location.pathname.startsWith(
                                                `${link.path}/`,
                                            );

                                        return (
                                            <Link
                                                key={link.id}
                                                to={link.path}
                                                onClick={onClose}
                                                className={`
                                                    group
                                                    relative
                                                    block
                                                    rounded-lg
                                                    px-3
                                                    py-2.5
                                                    transition-colors
                                                    duration-200

                                                    ${
                                                        isActive
                                                            ? 'bg-primary-soft'
                                                            : 'hover:bg-primary-soft'
                                                    }
                                                `}
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-4
                                                    "
                                                >
                                                    <h3
                                                        className={`
                                                            font-bengali!
                                                            text-[14px]
                                                            font-medium!!
                                                            leading-[1.5]!
                                                            tracking-normal!
                                                            transition-colors
                                                            duration-200

                                                            ${
                                                                isActive
                                                                    ? 'text-primary-deep'
                                                                    : 'text-text-primary group-hover:text-primary-deep'
                                                            }
                                                        `}
                                                    >
                                                        {link.name}
                                                    </h3>

                                                    <FiArrowRight
                                                        className={`
                                                            shrink-0
                                                            text-[14px]
                                                            text-primary
                                                            transition-all
                                                            duration-200

                                                            ${
                                                                isActive
                                                                    ? 'translate-x-0 opacity-100'
                                                                    : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                                            }
                                                        `}
                                                    />
                                                </div>

                                                {link.desc && (
                                                    <p
                                                        className={`
                                                            mt-1
                                                            max-w-[300px]
                                                            font-bengali
                                                            text-[11.5px]
                                                            leading-[1.7]
                                                            transition-colors

                                                            ${
                                                                isActive
                                                                    ? 'text-text-secondary'
                                                                    : 'text-text-muted group-hover:text-text-secondary'
                                                            }
                                                        `}
                                                    >
                                                        {link.desc}
                                                    </p>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* =============================================
                        PREVIEW
                    ============================================= */}
                    <div
                        className="
                            col-span-3
                            py-6
                            pl-2
                        "
                    >
                        <div
                            className="
                                relative
                                h-full
                                min-h-[300px]
                                overflow-hidden
                                rounded-lg
                                bg-background-alt
                            "
                        >
                            {preview?.image && (
                                <img
                                    src={preview.image}
                                    alt="Stand For People"
                                    className="
                                        absolute
                                        inset-0
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />
                            )}

                            <div
                                className="
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    bg-background-dark/92
                                    p-5
                                "
                            >
                                <span
                                    className="
                                        mb-3
                                        block
                                        h-[2px]
                                        w-7
                                        bg-accent
                                    "
                                />

                                <p
                                    className="
                                        font-bengali
                                        text-[13px]
                                        font-medium!!
                                        leading-[1.7]
                                        text-text-on-dark
                                    "
                                >
                                    {preview?.highlight}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MegaMenu;
