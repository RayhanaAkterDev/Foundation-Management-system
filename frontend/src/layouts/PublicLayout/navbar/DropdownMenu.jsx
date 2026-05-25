import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const DropdownMenu = ({ groups, mobile = false }) => {
    // =========================
    // ✅ MOBILE VERSION (NEW)
    // =========================
    if (mobile) {
        return (
            <div className="flex flex-col gap-4 p-2">
                {groups.map((group) => (
                    <div
                        key={group.title}
                        className="bg-surface border border-border/40 rounded-xl p-3 shadow-sm"
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
                                    onClick={() => {}}
                                    className={({ isActive }) =>
                                        `
        flex justify-between gap-3
        p-3 rounded-lg

        transition-all duration-200

        active:scale-[0.98]

        ${
            isActive
                ? 'bg-primary/15 text-primary font-semibold shadow-sm'
                : 'bg-transparent text-text-primary/80'
        }

        hover:bg-primary/5
    `
                                    }
                                >
                                    <div>
                                        <h4 className="text-[14px] font-semibold">
                                            {item.name}
                                        </h4>

                                        <p className="text-[12px] text-text-secondary mt-1">
                                            {item.desc}
                                        </p>
                                    </div>

                                    <FiArrowUpRight className="text-text-secondary mt-1" />
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // =========================
    // ✅ DESKTOP VERSION (UNCHANGED)
    // =========================
    return (
        <div className="absolute left-0 top-full z-50">
            {/* hover bridge */}
            <div className="absolute left-0 -top-5 w-full h-5" />

            <div className="min-w-190 bg-surface border border-border rounded-2xl shadow-[0_24px_70px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="grid grid-cols-2">
                    {groups.map((group, index) => (
                        <div
                            key={group.title}
                            className={`
                                p-7
                                ${index !== groups.length - 1 ? 'border-r border-border' : ''}
                            `}
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
                                            `
                                                group relative flex justify-between gap-4
                                                p-4 rounded-xl
                                                border border-transparent
                                                transition-all duration-200

                                                ${
                                                    isActive
                                                        ? 'bg-primary/10 border-primary/15'
                                                        : 'hover:bg-background hover:border-border'
                                                }
                                            `
                                        }
                                    >
                                        <div>
                                            <h4 className="text-[15px] font-semibold text-text-primary/80 group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h4>

                                            <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <FiArrowUpRight className="text-text-secondary group-hover:text-primary transition-colors mt-1" />
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
