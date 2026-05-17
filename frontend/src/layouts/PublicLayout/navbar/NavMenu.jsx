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
                <li key={link.id} className="relative">
                    {/* MOBILE BEHAVIOR */}
                    {mobile ? (
                        <div>
                            <button
                                onClick={() =>
                                    link.children
                                        ? toggleDropdown(link.id)
                                        : onItemClick?.()
                                }
                                className="flex items-center gap-2 px-3 py-2 w-full text-left"
                            >
                                {link.name}
                                {link.children && (
                                    <IoChevronDown
                                        className={`transition-transform ${
                                            openDropdown === link.id
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                )}
                            </button>

                            {/* Mobile dropdown */}
                            {link.children && openDropdown === link.id && (
                                <div className="ml-4 flex flex-col gap-2">
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
                        /* DESKTOP BEHAVIOR (your original) */
                        <div className="group relative">
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-1 rounded-md px-3 py-2 transition-all duration-300 hover:bg-primary/10 hover:text-primary-hover ${
                                        isActive
                                            ? 'font-semibold text-primary'
                                            : 'text-text-primary'
                                    }`
                                }
                            >
                                {link.name}

                                {link.children && (
                                    <IoChevronDown className="mt-0.5 text-sm transition-transform duration-300 group-hover:rotate-180" />
                                )}
                            </NavLink>

                            {/* Desktop dropdown */}
                            {link.children && (
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
