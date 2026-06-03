import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const DropdownMenu = ({ groups, mobile = false }) => {
    // =========================
    // MOBILE VERSION
    // =========================
    if (mobile) {
        return (
            <div className="flex flex-col gap-4 p-2">
                {groups.map((group) => (
                    <div
                        key={group.title}
                        className="p-3"
                    >
                        {/* GROUP TITLE */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-text-secondary">
                                {group.title}
                            </p>
                        </div>

                        {/* ITEMS */}
                        <div className="flex flex-col gap-2">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex justify-between gap-3 p-3 rounded-lg transition-all duration-200 ease-out active:scale-[0.98]

                                        ${
                                            isActive
                                                ? 'bg-primary/15 text-primary font-semibold shadow-sm'
                                                : 'bg-transparent text-text-primary/80 hover:bg-primary/5'
                                        }

                                        hover:translate-x-0.5`
                                    }
                                >
                                    <div>
                                        <h4 className="text-[14px] font-semibold transition-colors duration-200 group-hover:text-primary">
                                            {item.name}
                                        </h4>
                                        <p className="text-[12px] text-text-secondary mt-1">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <FiArrowUpRight className="text-text-secondary mt-1 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-1px" />
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // =========================
    // DESKTOP VERSION
    // =========================
    return (
        <div className="absolute lg:-left-20 xl:-left-90 top-full z-50">
            {/* hover bridge */}
            <div className="absolute left-0 -top-5 w-full h-5" />

            <div
                className="
                    dropdown-scroll
                    lg:w-110 xl:w-210
                    bg-surface border border-border
                    rounded-2xl shadow-lg
                    overflow-hidden

                    lg:max-h-[70vh] lg:overflow-y-auto
                    xl:max-h-none xl:overflow-visible
                "
            >
                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {groups.map((group, index) => (
                        <div
                            key={group.title}
                            className={`p-7 ${
                                index !== groups.length - 1
                                    ? 'border-r border-border'
                                    : ''
                            }`}
                        >
                            {/* GROUP TITLE */}
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-text-secondary">
                                    {group.title}
                                </p>
                            </div>

                            {/* ITEMS */}
                            <div className="flex flex-col gap-2">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.id}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `group relative flex justify-between gap-4 p-4 rounded-xl border transition-all duration-300 ease-out

                                            ${
                                                isActive
                                                    ? 'bg-primary/10 border-primary/20 shadow-sm'
                                                    : 'border-transparent hover:bg-background hover:border-border/60 hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]'
                                            }

                                            hover:-translate-y-1px`
                                        }
                                    >
                                        <div>
                                            <h4
                                                className="
                                                    text-[15px]
                                                    font-semibold
                                                    text-text-primary/80
                                                    transition-colors duration-300
                                                    group-hover:text-primary
                                                "
                                            >
                                                {item.name}
                                            </h4>

                                            <p
                                                className="
                                                    text-[13px]
                                                    text-text-secondary
                                                    mt-1
                                                    leading-relaxed
                                                    transition-colors duration-300
                                                    group-hover:text-text-primary/70
                                                "
                                            >
                                                {item.desc}
                                            </p>
                                        </div>

                                        <FiArrowUpRight
                                            className="
                                                text-text-secondary
                                                mt-1
                                                transition-all duration-300
                                                group-hover:text-primary
                                                group-hover:translate-x-0.5
                                                group-hover:-translate-y-px
                                            "
                                        />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DropdownMenu;
