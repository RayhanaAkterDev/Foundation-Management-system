import React from 'react';

const FooterLinks = ({ title, links }) => {
    return (
        <div className="flex flex-col gap-6">
            <h4 className="text-[16px] sm:text-[17px] font-semibold text-primary">
                {title}
            </h4>

            <div className="w-12 h-px bg-primary/30" />

            <ul className="flex flex-col gap-4">
                {links.map((link) => (
                    <li key={link.id}>
                        <a
                            href="#"
                            className="text-[15px] sm:text-[16px]
                                       text-text-secondary
                                       hover:text-primary
                                       transition"
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
