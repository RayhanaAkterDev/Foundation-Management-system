import React from 'react';

const FooterLinks = ({ title, links }) => {
    return (
        <div className="flex flex-col gap-8">

            <div className="space-y-3">

                <h4 className="text-[19px] font-semibold tracking-tight text-primary">
                    {title}
                </h4>

                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <div className="h-px w-10 bg-primary/10" />
                </div>

            </div>

            <ul className="flex flex-col gap-4">

                {links.map((link) => (
                    <li key={link.id}>
                        <a
                            href="#"
                            className="
                                inline-flex items-center
                                text-[15.5px]
                                text-text-secondary
                                transition-all duration-300
                                hover:translate-x-1
                                hover:text-accent
                            "
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