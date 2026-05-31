import React from 'react';

const FooterLinks = ({ title, links }) => {
    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            <h4 className="text-[14px] sm:text-[15px] font-semibold text-primary/90">
                {title}
            </h4>

            <div className="w-10 h-px bg-primary/20" />

            <ul className="flex flex-col gap-3 sm:gap-3.5">
                {links.map((link) => (
                    <li key={link.id}>
                        <a
                            href="#"
                            className="text-[14px] sm:text-[15px] text-text-secondary
                                       hover:text-primary transition-colors
                                       leading-relaxed"
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
