import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';

const DropdownMenu = ({ items, scrolled, mobile = false, title = 'Menu' }) => {
    const [open, setOpen] = useState(false);

    // MOBILE / TABLET DROPDOWN
    if (mobile) {
        return (
            <div className="w-full">
                {/* Parent Menu */}
                <button
                    onClick={() => setOpen(!open)}
                    className="
                        flex w-full items-center justify-between
                        rounded-lg py-3
                        text-left text-text-primary
                        transition-all duration-200
                    "
                >
                    <span className="font-medium">{title}</span>

                    <IoChevronDown
                        className={`text-lg transition-transform duration-300 ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {/* Accordion Dropdown */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <ul className="space-y-1 border-l border-border pl-4 pb-2">
                        {items?.map((child) => (
                            <li key={child.id}>
                                <NavLink
                                    to={child.path}
                                    className={({ isActive }) =>
                                        `
                                        block rounded-lg px-3 py-2
                                        text-sm transition-all duration-200

                                        ${
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : '!text-text-secondary hover:!text-primary'
                                        }
                                    `
                                    }
                                >
                                    {child.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    // DESKTOP DROPDOWN
    const positionClass = scrolled ? 'top-16' : 'top-20';

    const bgClass = scrolled
        ? 'bg-[#EDF4F7]/95 backdrop-blur'
        : 'bg-[#FAFAFB]/95 backdrop-blur';

    return (
        <div
            className={`
                absolute left-1/2 ${positionClass}
                z-50 w-64 -translate-x-1/2

                rounded-xl border border-border
                p-3 shadow-lg

                transition-all duration-200 ease-out

                invisible translate-y-3 opacity-0
                pointer-events-none

                group-hover:pointer-events-auto
                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100

                ${bgClass}
            `}
        >
            <ul className="space-y-1">
                {items?.map((child) => (
                    <li key={child.id}>
                        <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                                `
                                block rounded-lg px-4 py-2.5
                                text-sm font-medium
                                transition-all duration-200

                                hover:bg-primary/10
                                hover:text-primary

                                ${
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary!'
                                }
                            `
                            }
                        >
                            {child.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DropdownMenu;
