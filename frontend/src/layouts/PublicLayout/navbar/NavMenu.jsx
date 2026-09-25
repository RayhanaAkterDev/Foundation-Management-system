import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";

import navLinks from "./data/navLinks";

const NavMenu = ({ mobile = false, onClose, activeMenu, setActiveMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openId, setOpenId] = React.useState(null);

  /* =========================================================
       ACTIVE LINK CHECKER
    ========================================================= */

  const isActiveLink = (link) => {
    if (link.type === "single") {
      return location.pathname === link.path;
    }

    if (link.type === "mega") {
      return link.groups?.some((group) =>
        group.items.some((item) => location.pathname.startsWith(item.path)),
      );
    }

    return false;
  };

  /* =========================================================
       MOBILE MENU
    ========================================================= */

  if (mobile) {
    return (
      <nav aria-label="Mobile navigation">
        <ul className="flex flex-col">
          {navLinks.map((link) => {
            const active = isActiveLink(link);
            const isOpen = openId === link.id;

            return (
              <li
                key={link.id}
                className="
                                    border-b
                                    border-border/70
                                    last:border-b-0
                                ">
                {/* =====================================
                                    MAIN ITEM
                                ===================================== */}

                <button
                  type="button"
                  onClick={() => {
                    if (link.type === "single") {
                      navigate(link.path);
                      onClose?.();
                      return;
                    }

                    setOpenId(isOpen ? null : link.id);
                  }}
                  aria-expanded={link.type === "mega" ? isOpen : undefined}
                  className={`
                                        group
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        px-2
                                        py-4
                                        text-left
                                        text-[15px]
                                        leading-[1.6]
                                        font-medium
                                        transition-colors
                                        duration-200
                                        ${
                                          active
                                            ? "text-primary"
                                            : "text-text-primary"
                                        }
                                        hover:text-primary
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-primary
                                        focus-visible:ring-inset
                                    `}>
                  <span className="flex items-center gap-3">
                    {/* Active indicator */}
                    <span
                      className={`
                                                h-1.5
                                                w-1.5
                                                shrink-0
                                                rounded-full
                                                bg-primary
                                                transition-all
                                                duration-200
                                                ${
                                                  active
                                                    ? "scale-100 opacity-100"
                                                    : "scale-0 opacity-0"
                                                }
                                            `}
                      aria-hidden="true"
                    />

                    <span>{link.name}</span>
                  </span>

                  {link.type === "mega" && (
                    <IoChevronDown
                      className={`
                                                shrink-0
                                                text-[17px]
                                                text-text-muted
                                                transition-transform
                                                duration-200
                                                ${
                                                  isOpen
                                                    ? "rotate-180 text-primary"
                                                    : ""
                                                }
                                            `}
                    />
                  )}
                </button>

                {/* =====================================
                                    SUBMENU
                                ===================================== */}

                {link.type === "mega" && isOpen && (
                  <div
                    className="
                                            mb-4
                                            ml-3
                                            border-l
                                            border-primary/20
                                            pl-4
                                        ">
                    <div className="space-y-6">
                      {link.groups.map((group) => (
                        <div key={group.title}>
                          {/* Group label */}

                          <p
                            className="
                                                            mb-2
                                                            text-[11px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-[0.12em]
                                                            text-text-muted
                                                        ">
                            {group.title}
                          </p>

                          {/* Group items */}

                          <div className="space-y-0.5">
                            {group.items.map((item) => {
                              const itemActive = location.pathname.startsWith(
                                item.path,
                              );

                              return (
                                <button
                                  type="button"
                                  key={item.id}
                                  onClick={() => {
                                    navigate(item.path);
                                    onClose?.();
                                  }}
                                  className={`
                                                                            flex
                                                                            w-full
                                                                            items-center
                                                                            rounded-md
                                                                            px-3
                                                                            py-2.5
                                                                            text-left
                                                                            text-[14px]
                                                                            leading-[1.6]
                                                                            transition-colors
                                                                            duration-200
                                                                            ${
                                                                              itemActive
                                                                                ? "bg-background-teal text-primary font-medium"
                                                                                : "text-text-secondary font-normal"
                                                                            }
                                                                            hover:bg-background-teal
                                                                            hover:text-primary
                                                                        `}>
                                  {item.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  /* =========================================================
       DESKTOP MENU
    ========================================================= */

  return (
    <nav aria-label="Primary navigation">
      <ul className="flex items-center gap-7 xl:gap-9">
        {navLinks.map((link) => {
          const active = isActiveLink(link);
          const isOpen = activeMenu === link.id;

          return (
            <li key={link.id} className="relative">
              {link.type === "single" ? (
                <NavLink
                  to={link.path}
                  className={`
                                        relative
                                        inline-flex
                                        items-center
                                        py-2
                                        text-[14px]
                                        xl:text-[15px]
                                        leading-none
                                        transition-colors
                                        duration-200
                                        ${
                                          active
                                            ? "font-semibold text-primary"
                                            : "font-medium text-text-secondary hover:text-primary"
                                        }
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-primary
                                        focus-visible:ring-offset-4
                                        rounded-sm
                                    `}>
                  {link.name}

                  {/* Active underline */}
                  <span
                    className={`
                                            absolute
                                            -bottom-1
                                            left-0
                                            h-[2px]
                                            rounded-full
                                            bg-primary
                                            transition-all
                                            duration-200
                                            ${
                                              active
                                                ? "w-full opacity-100"
                                                : "w-0 opacity-0"
                                            }
                                        `}
                    aria-hidden="true"
                  />
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveMenu?.(isOpen ? null : link.id)}
                  aria-expanded={isOpen}
                  className={`
                                        relative
                                        flex
                                        items-center
                                        gap-1.5
                                        py-2
                                        text-[14px]
                                        xl:text-[15px]
                                        leading-none
                                        transition-colors
                                        duration-200
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-primary
                                        focus-visible:ring-offset-4
                                        rounded-sm
                                        ${
                                          active || isOpen
                                            ? "font-semibold text-primary"
                                            : "font-medium text-text-secondary hover:text-primary"
                                        }
                                    `}>
                  <span>{link.name}</span>

                  <IoChevronDown
                    className={`
                                            text-[15px]
                                            transition-transform
                                            duration-200
                                            ${isOpen ? "rotate-180" : ""}
                                        `}
                  />

                  {/* Active/open underline */}

                  <span
                    className={`
                                            absolute
                                            -bottom-1
                                            left-0
                                            h-[2px]
                                            rounded-full
                                            bg-primary
                                            transition-all
                                            duration-200
                                            ${
                                              active || isOpen
                                                ? "w-full opacity-100"
                                                : "w-0 opacity-0"
                                            }
                                        `}
                    aria-hidden="true"
                  />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavMenu;
