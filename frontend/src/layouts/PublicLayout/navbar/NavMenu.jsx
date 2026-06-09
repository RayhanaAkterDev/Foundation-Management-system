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
            group.items.some((item) => location.pathname.startsWith(item.path)),
        );
    };

    if (mobile) {
        return (
            <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                    <li key={link.id}>
                        <button
                            type="button"
                            onClick={() => {
                                if (link.groups) {
                                    setOpen((prev) =>
                                        prev === link.id ? null : link.id,
                                    );
                                } else {
                                    if (link.path) navigate(link.path);
                                    onClose?.();
                                }
                            }}
                            className="
                                w-full p-4 flex items-center justify-between
                                rounded-xl
                                text-[15px] font-semibold
                            "
                        >
                            <span>{link.name}</span>
                            {link.groups && <IoChevronDown />}
                        </button>

                        {link.groups && open === link.id && (
                            <div className="px-3 pb-3">
                                <DropdownMenu groups={link.groups} mobile />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <ul className="flex items-center gap-3 xl:gap-4 whitespace-nowrap">
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
                                flex items-center gap-2
                                px-3 py-2
                                rounded-lg
                                text-[15px]
                                font-medium
                                transition-colors
                                ${
                                    isHome
                                        ? homeActive
                                            ? 'text-primary'
                                            : 'text-text-primary/70 hover:text-text-primary'
                                        : parentActive
                                          ? 'text-primary'
                                          : 'text-text-primary/70 hover:text-text-primary'
                                }
                                hover:bg-black/5 dark:hover:bg-white/5
                            `}
                        >
                            <span>{link.name}</span>

                            {link.groups && (
                                <IoChevronDown
                                    className={`
                                        text-[0.8rem]
                                        transition-transform
                                        ${
                                            open === link.id
                                                ? 'rotate-180 text-primary'
                                                : ''
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
