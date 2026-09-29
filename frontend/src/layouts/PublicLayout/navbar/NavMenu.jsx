import React from 'react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { IoChevronDown } from 'react-icons/io5';

import navLinks from './data/navLinks';

const NavMenu = ({ mobile = false, onClose, activeMenu, setActiveMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [openId, setOpenId] = React.useState(null);

    const isActiveLink = (link) => {
        if (link.type === 'single') {
            return location.pathname === link.path;
        }

        if (link.type === 'mega') {
            return link.groups?.some((group) =>
                group.items.some((item) =>
                    location.pathname.startsWith(item.path),
                ),
            );
        }

        return false;
    };

    /* =========================================================
       MOBILE — REDESIGNED
    ========================================================= */

    if (mobile) {
        return (
            <nav aria-label="মোবাইল নেভিগেশন" className="font-bengali">
                <ul>
                    {navLinks.map((link) => {
                        const active = isActiveLink(link);
                        const isOpen = openId === link.id;

                        return (
                            <li
                                key={link.id}
                                className="
                                    border-b
                                    border-border
                                    last:border-b-0
                                "
                            >
                                {/* =================================
                                    MAIN ITEM
                                ================================= */}

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (link.type === 'single') {
                                            navigate(link.path);
                                            onClose?.();
                                            return;
                                        }

                                        setOpenId(isOpen ? null : link.id);
                                    }}
                                    aria-expanded={
                                        link.type === 'mega'
                                            ? isOpen
                                            : undefined
                                    }
                                    className="
                                        group
                                        relative

                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        gap-6

                                        py-[18px]

                                        text-left
                                    "
                                >
                                    <span
                                        className={`
                                            font-bengali
                                            text-[16px]
                                            font-medium!
                                            leading-[1.5]

                                            transition-colors
                                            duration-200

                                            ${
                                                active || isOpen
                                                    ? 'text-primary-deep'
                                                    : 'text-text-primary group-hover:text-primary'
                                            }
                                        `}
                                    >
                                        {link.name}
                                    </span>

                                    {link.type === 'mega' && (
                                        <IoChevronDown
                                            className={`
                                                shrink-0

                                                text-[15px]

                                                transition-[transform,color]
                                                duration-200

                                                ${
                                                    isOpen
                                                        ? 'rotate-180 text-primary'
                                                        : 'text-text-muted group-hover:text-primary'
                                                }
                                            `}
                                        />
                                    )}
                                </button>

                                {/* =================================
                                    SUB NAVIGATION
                                ================================= */}

                                {link.type === 'mega' && isOpen && (
                                    <div
                                        className="
                                            pb-5
                                            pt-0.5
                                        "
                                    >
                                        {link.groups.map(
                                            (group, groupIndex) => (
                                                <div
                                                    key={group.title}
                                                    className={
                                                        groupIndex > 0
                                                            ? 'mt-5'
                                                            : ''
                                                    }
                                                >
                                                    {/* GROUP TITLE */}

                                                    <p
                                                        className="
                                                            mb-1.5

                                                            font-bengali
                                                            text-[11px]
                                                            font-medium!
                                                            leading-[1.5]
                                                            text-text-muted
                                                        "
                                                    >
                                                        {group.title}
                                                    </p>

                                                    {/* GROUP LINKS */}

                                                    <div
                                                        className="
                                                            relative
                                                            ml-[2px]

                                                            border-l
                                                            border-primary-muted

                                                            pl-4
                                                        "
                                                    >
                                                        {group.items.map(
                                                            (item) => {
                                                                const itemActive =
                                                                    location.pathname.startsWith(
                                                                        item.path,
                                                                    );

                                                                return (
                                                                    <button
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigate(
                                                                                item.path,
                                                                            );

                                                                            onClose?.();
                                                                        }}
                                                                        className={`
                                                                            relative

                                                                            block
                                                                            w-full

                                                                            py-[8px]

                                                                            text-left

                                                                            font-bengali
                                                                            text-[13.5px]
                                                                            font-medium!
                                                                            leading-[1.55]

                                                                            transition-colors
                                                                            duration-200

                                                                            ${
                                                                                itemActive
                                                                                    ? 'text-primary-deep'
                                                                                    : 'text-text-secondary hover:text-primary'
                                                                            }
                                                                        `}
                                                                    >
                                                                        {itemActive && (
                                                                            <span
                                                                                aria-hidden="true"
                                                                                className="
                                                                                    absolute
                                                                                    -left-[17px]
                                                                                    top-1/2

                                                                                    h-5
                                                                                    w-[2px]

                                                                                    -translate-y-1/2

                                                                                    bg-primary
                                                                                "
                                                                            />
                                                                        )}

                                                                        {
                                                                            item.name
                                                                        }
                                                                    </button>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    /* =========================================================
       DESKTOP — UNTOUCHED
    ========================================================= */

    return (
        <nav aria-label="প্রধান নেভিগেশন" className="h-full font-bengali">
            <ul
                className="
                    flex
                    h-full
                    items-center
                    gap-7
                    xl:gap-9
                "
            >
                {navLinks.map((link) => {
                    const active = isActiveLink(link);
                    const isOpen = activeMenu === link.id;
                    const selected = active || isOpen;

                    if (link.type === 'single') {
                        return (
                            <li key={link.id} className="h-full">
                                <NavLink
                                    to={link.path}
                                    className={`
                                        group
                                        relative
                                        flex
                                        h-full
                                        items-center
                                        font-bengali
                                        text-[15px]
                                        leading-none
                                        transition-colors
                                        duration-200
                                        xl:text-[16px]

                                        ${
                                            active
                                                ? 'text-primary-deep'
                                                : 'text-text-body hover:text-primary'
                                        }
                                    `}
                                >
                                    <span>{link.name}</span>

                                    <span
                                        aria-hidden="true"
                                        className={`
                                            absolute
                                            bottom-0
                                            left-0
                                            h-[3px]
                                            bg-primary
                                            transition-all
                                            duration-200

                                            ${
                                                active
                                                    ? 'w-full opacity-100'
                                                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                            }
                                        `}
                                    />
                                </NavLink>
                            </li>
                        );
                    }

                    return (
                        <li key={link.id} className="h-full">
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveMenu?.(isOpen ? null : link.id)
                                }
                                aria-expanded={isOpen}
                                className={`
                                    group
                                    relative
                                    flex
                                    h-full
                                    items-center
                                    gap-1.5
                                    font-bengali
                                    text-[15px]
                                    font-medium!
                                    leading-none
                                    transition-colors
                                    duration-200
                                    xl:text-[16px]

                                    ${
                                        selected
                                            ? 'text-primary-deep'
                                            : 'text-text-body hover:text-primary'
                                    }
                                `}
                            >
                                <span>{link.name}</span>

                                <IoChevronDown
                                    className={`
                                        mt-[1px]
                                        text-[14px]
                                        transition-all
                                        duration-200

                                        ${
                                            isOpen
                                                ? 'rotate-180 text-primary'
                                                : selected
                                                  ? 'text-primary'
                                                  : 'text-text-muted group-hover:text-primary'
                                        }
                                    `}
                                />

                                <span
                                    aria-hidden="true"
                                    className={`
                                        absolute
                                        bottom-0
                                        left-0
                                        h-[3px]
                                        bg-primary
                                        transition-all
                                        duration-200

                                        ${
                                            selected
                                                ? 'w-full opacity-100'
                                                : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                        }
                                    `}
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default NavMenu;
