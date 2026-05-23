import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

const FooterLinks = ({ title, links }) => {
    return (
        <div className="flex flex-col gap-10">
            {/* TITLE */}
            <h4 className="relative w-fit text-xl font-semibold text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-primary">
                {title}
            </h4>

            {/* LINKS */}
            <ul className="flex flex-col gap-4">
                {links.map((link) => (
                    <li key={link.id}>
                        <a
                            href="#"
                            className="group flex items-center gap-2 text-[15px] text-text-secondary transition-colors duration-200 hover:text-accent"
                        >
                            <TbChevronRight
                                size={16}
                                className="opacity-60 transition-colors duration-200 group-hover:text-accent"
                            />
                            <span>{link.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FooterLinks;
