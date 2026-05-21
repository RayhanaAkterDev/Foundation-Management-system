import { NavLink } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';
import React, { useState } from 'react';

import navLinks from './data/navLinks';
import DropdownMenu from './DropdownMenu';

const NavMenu = ({ scrolled, mobile = false, onItemClick }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <ul
            className={
                mobile
                    ? 'flex flex-col gap-4'
                    : 'flex items-center justify-center gap-6'
            }
        >
            {navLinks.map((link) => (
                <li key={link.id} className={!mobile ? 'group relative' : ''}>
                    {/* MOBILE BEHAVIOR */}
                    {mobile ? (
                        <div>
                            <button
                                onClick={() =>
                                    link.children
                                        ? toggleDropdown(link.id)
                                        : onItemClick?.()
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-left"
                            >
                                {link.name}

                                {link.children && (
                                    <IoChevronDown
                                        className={`transition-transform duration-300 ${
                                            openDropdown === link.id
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                )}
                            </button>

                            {/* MOBILE DROPDOWN */}
                            {link.children && openDropdown === link.id && (
                                <div className="ml-4 mt-2 flex flex-col gap-2">
                                    {link.children.map((child) => (
                                        <NavLink
                                            key={child.id}
                                            to={child.path}
                                            onClick={onItemClick}
                                            className="text-sm text-text-primary hover:text-primary"
                                        >
                                            {child.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* DESKTOP BEHAVIOR */
                        <div
                            onMouseEnter={() => setOpenDropdown(link.id)}
                            onMouseLeave={() => setOpenDropdown(null)}
                            className="relative"
                        >
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `
            relative flex items-center gap-1 px-3 py-3
            text-sm font-medium
            transition-all duration-300

            hover:bg-primary/10
            hover:text-primary

            after:absolute
            after:bottom-0
            after:left-0
            after:h-0.5
            after:w-0
            after:bg-primary
            after:transition-all
            after:duration-300

            hover:after:w-full

            ${isActive ? 'text-primary after:w-full' : 'text-text-primary'}
        `
                                }
                            >
                                {link.name}

                                {link.children && (
                                    <IoChevronDown
                                        className={`mt-0.5 text-sm transition-transform duration-300 ${
                                            openDropdown === link.id
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                )}
                            </NavLink>

                            {link.children && openDropdown === link.id && (
                                <DropdownMenu
                                    items={link.children}
                                    scrolled={scrolled}
                                />
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default NavMenu;
