import React from 'react';
import { NavLink } from 'react-router-dom';

const DropdownMenu = ({ items, scrolled }) => {
    const positionClass = scrolled ? 'top-16' : 'top-18';

    const bgClass = scrolled ? 'bg-[#EDF4F7]' : 'bg-[#FAFAFB]';

    return (
        <div
            className={`
                absolute left-1/2 ${positionClass}
                w-60 -translate-x-1/2

                rounded-md border border-border
                p-4 shadow-md

                transition-all duration-200 ease-out

                opacity-0 invisible translate-y-2

                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0

                group-hover:pointer-events-auto
                pointer-events-none

                ${bgClass}
            `}
        >
            <ul className="space-y-1">
                {items?.map((child) => (
                    <li key={child.id}>
                        <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 transition-all duration-200 hover:bg-primary/10 hover:text-primary-hover ${
                                    isActive
                                        ? 'text-primary font-semibold'
                                        : 'text-text-primary'
                                }`
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
