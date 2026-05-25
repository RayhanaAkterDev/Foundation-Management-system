import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';

import navLinks from './data/navLinks';
import DropdownMenu from './DropdownMenu';

const NavMenu = ({ mobile = false, onClose }) => {
    const [open, setOpen] = useState(null);
    const location = useLocation();

    const isParentActive = (link) => {
        if (!link.groups) return false;

        return link.groups.some((group) =>
            group.items.some((item) => location.pathname.startsWith(item.path)),
        );
    };

    if (mobile) {
        return (
            <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                    const isHome = link.id === 'home';
                    const homeActive = location.pathname === '/';
                    const parentActive = isParentActive(link);

                    return (
                        <li key={link.id}>
                            <button
                                onClick={() => {
                                    if (link.groups) {
                                        setOpen((prev) =>
                                            prev === link.id ? null : link.id,
                                        );
                                    } else {
                                        onClose?.();
                                    }
                                }}
                                className={`
                                w-full p-4
                                flex items-center justify-between
                                rounded-xl
                                transition-colors duration-200

                                ${
                                    isHome
                                        ? homeActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-background text-text-primary/70'
                                        : parentActive
                                          ? 'bg-primary/10 text-primary'
                                          : 'hover:bg-background text-text-primary/70'
                                }
                            `}
                            >
                                <span className="text-[15px] font-semibold">
                                    {link.name}
                                </span>

                                {link.groups && (
                                    <IoChevronDown className="text-text-secondary" />
                                )}
                            </button>

                            {link.groups && open === link.id && (
                                <div className="px-3 pb-3">
                                    <div className="mt-2">
                                        <DropdownMenu
                                            groups={link.groups}
                                            mobile
                                        />
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <ul className="flex items-center gap-9 xl:gap-11">
            {navLinks.map((link) => {
                const isHome = link.id === 'home';
                const homeActive = location.pathname === '/';
                const parentActive = isParentActive(link);

                return (
                    <li
                        key={link.id}
                        className="relative"
                        onMouseEnter={() => setOpen(link.id)}
                        onMouseLeave={() => setOpen(null)}
                    >
                        <NavLink
                            to={link.path || '#'}
                            className={`
                                relative flex items-center gap-2
                                h-24
                                text-[15px]
                                font-medium
                                transition-colors duration-200

                                ${
                                    isHome
                                        ? homeActive
                                            ? 'text-primary font-sem'
                                            : 'text-text-primary/70 hover:text-primary'
                                        : parentActive
                                          ? 'text-primary'
                                          : 'text-text-primary/70 hover:text-primary'
                                }
                            `}
                        >
                            {link.name}

                            {link.groups && (
                                <IoChevronDown
                                    className={`
                                        text-[0.82rem]
                                        transition-transform duration-300
                                        ${
                                            open === link.id
                                                ? 'rotate-180 text-primary'
                                                : 'text-text-secondary'
                                        }
                                    `}
                                />
                            )}
                        </NavLink>

                        {link.groups && open === link.id && (
                            <DropdownMenu groups={link.groups} />
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default NavMenu;
