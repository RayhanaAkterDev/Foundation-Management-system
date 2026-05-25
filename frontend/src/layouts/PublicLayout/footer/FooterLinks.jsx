import React from 'react';

const FooterLinks = ({ title, links }) => {
    return (
        <div className="flex flex-col gap-4 sm:gap-5">
            <h4 className="text-[13px] sm:text-[14px] font-semibold text-primary/90">
                {title}
            </h4>

            <div className="w-8 h-px bg-primary/20" />

            <ul className="flex flex-col gap-2.5 sm:gap-3">
                {links.map((link) => (
                    <li key={link.id}>
                        <a
                            href="#"
                            className="text-[13px] sm:text-[14px] text-text-secondary hover:text-primary transition-colors duration-200"
                        >
                            {link.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FooterLinks;
