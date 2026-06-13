import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';

import navLinks from './data/navLinks';
import DropdownMenu from './DropdownMenu';

const NavMenu = ({ mobile = false, onClose }) => {
    const [open, setOpen] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const isParentActive = (link) => {
        if (!link.groups) return false;

        return link.groups.some((group) =>
            group.items.some((item) =>
                location.pathname.startsWith(item.path),
            ),
        );
    };

    // ================= MOBILE =================

    if (mobile) {
        return (
            <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                    const isActive =
                        link.path === '/'
                            ? location.pathname === '/'
                            : isParentActive(link);

                    return (
                        <li key={link.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (link.groups) {
                                        setOpen((prev) =>
                                            prev === link.id
                                                ? null
                                                : link.id,
                                        );
                                    } else {
                                        if (link.path)
                                            navigate(link.path);

                                        onClose?.();
                                    }
                                }}
                                className={`
                                    w-full

                                    px-4 py-4

                                    flex items-center justify-between

                                    rounded-lg

                                    text-[15px]
                                    font-medium

                                    transition-all duration-300

                                    ${
                                        isActive
                                            ? 'text-primary bg-primary/5'
                                            : 'text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                                    }
                                `}
                            >
                                <span>{link.name}</span>

                                {link.groups && (
                                    <IoChevronDown
                                        className={`
                                            transition-all duration-300

                                            ${
                                                open === link.id
                                                    ? 'rotate-180 text-primary'
                                                    : 'opacity-60'
                                            }
                                        `}
                                    />
                                )}
                            </button>

                            {link.groups && open === link.id && (
                                <div className="px-3 pb-3">
                                    <DropdownMenu
                                        groups={link.groups}
                                        mobile
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    }

    // ================= DESKTOP =================

    return (
        <ul className="flex items-center gap-10 whitespace-nowrap">
            {navLinks.map((link) => {
                const isHome = link.id === 'home';

                const homeActive =
                    location.pathname === '/';

                const parentActive =
                    isParentActive(link);

                const isActive = isHome
                    ? homeActive
                    : parentActive;

                return (
                    <li
                        key={link.id}
                        className="relative"
                        onMouseEnter={() =>
                            setOpen(link.id)
                        }
                        onMouseLeave={() =>
                            setOpen(null)
                        }
                    >
                        <NavLink
                            to={link.path || '#'}
                            className={`
                                group

                                relative

                                flex items-center gap-1

                                py-3

                                transition-all duration-300

                                ${
                                    isActive
                                        ? `
                                            text-primary
                                            font-semibold
                                        `
                                        : `
                                            text-text-primary/70

                                            hover:text-text-primary

                                            hover:font-semibold
                                        `
                                }
                            `}
                        >
                            <span className="relative z-10">
                                {link.name}
                            </span>

                            {link.groups && (
                                <IoChevronDown
                                    className={`
                                        text-[14px]

                                        transition-all duration-300

                                        ${
                                            open === link.id
                                                ? `
                                                    rotate-180
                                                    text-primary
                                                `
                                                : `
                                                    opacity-60

                                                    group-hover:opacity-100
                                                `
                                        }
                                    `}
                                />
                            )}

                            {/* Bottom Border */}

                            <span
                                className={`
                                    absolute

                                    left-0
                                    bottom-0

                                    h-0.5

                                    rounded-full

                                    bg-primary

                                    transition-all duration-300 ease-out

                                    ${
                                        isActive
                                            ? `
                                                w-full

                                                opacity-100
                                            `
                                            : `
                                                w-0

                                                opacity-0

                                                group-hover:w-full

                                                group-hover:opacity-100
                                            `
                                    }
                                `}
                            />
                        </NavLink>

                        {link.groups &&
                            open === link.id && (
                                <DropdownMenu
                                    groups={link.groups}
                                />
                            )}
                    </li>
                );
            })}
        </ul>
    );
};

export default NavMenu;