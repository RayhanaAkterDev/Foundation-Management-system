import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';
import navLinks from './data/navLinks';

const NavMenu = ({ mobile = false, onClose, activeMenu, setActiveMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // =============================
    // ACTIVE LINK CHECKER
    // =============================
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

    // MOBILE MENU
    const [openId, setOpenId] = React.useState(null);

    if (mobile) {
        return (
            <ul className="flex flex-col">
                {navLinks.map((link) => {
                    const active = isActiveLink(link);
                    const isOpen = openId === link.id;

                    return (
                        <li key={link.id} className="select-none">
                            {/* MAIN ITEM */}
                            <button
                                onClick={() => {
                                    if (link.type === 'single') {
                                        navigate(link.path);
                                        onClose?.();
                                        return;
                                    }
                                    setOpenId(isOpen ? null : link.id);
                                }}
                                className={`w-full flex items-center justify-between px-5 py-4 text-[16px] leading-[1.4] font-medium transition-colors duration-200 ${
                                    active
                                        ? 'text-primary'
                                        : 'text-text-primary'
                                } hover:text-primary`}
                            >
                                <span className="flex items-center gap-2">
                                    {active && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                    {link.name}
                                </span>

                                {link.type === 'mega' && (
                                    <IoChevronDown
                                        className={`text-[18px] text-text-secondary transition-transform duration-200 ${
                                            isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                )}
                            </button>

                            {/* SUBMENU */}
                            {link.type === 'mega' && isOpen && (
                                <div className="ml-6 pl-4 border-l border-border/50 mt-1 mb-3 space-y-4">
                                    {link.groups.map((group) => (
                                        <div key={group.title}>
                                            {/* GROUP LABEL */}
                                            <p className="text-[11px] leading-[1.6] tracking-[0.14em] uppercase text-text-secondary mb-3">
                                                {group.title}
                                            </p>

                                            {/* ITEMS */}
                                            <div className="space-y-2">
                                                {group.items.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            navigate(item.path);
                                                            onClose?.();
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-[14px] leading-[1.6] font-normal text-text-secondary hover:text-text-primary transition-colors"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    }

    // =============================
    // DESKTOP MENU (USES PARENT STATE)
    // =============================
    return (
        <ul className="flex items-center gap-10">
            {navLinks.map((link) => {
                const active = isActiveLink(link);
                const isOpen = activeMenu === link.id;

                return (
                    <li key={link.id}>
                        {link.type === 'single' ? (
                            <NavLink
                                to={link.path}
                                className={`py-2 text-[15px] transition-all ${
                                    active
                                        ? 'text-primary font-semibold'
                                        : 'text-text-primary/70 hover:text-text-primary'
                                }`}
                            >
                                {link.name}
                            </NavLink>
                        ) : (
                            <button
                                onMouseEnter={() =>
                                    window.innerWidth >= 1024 &&
                                    setActiveMenu?.(link.id)
                                }
                                onClick={() =>
                                    setActiveMenu?.(isOpen ? null : link.id)
                                }
                                className={`py-2 flex items-center gap-1 text-[15px] transition-all ${
                                    active
                                        ? 'text-primary font-semibold'
                                        : 'text-text-primary/70 hover:text-text-primary'
                                }`}
                            >
                                <span>{link.name}</span>
                                <IoChevronDown
                                    className={`text-sm transition-transform ${
                                        isOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default NavMenu;
