import React from 'react';

const FooterBottom = () => {
    return (
        <div className="py-14 border-t border-border">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[15px]">
                <p className="text-text-secondary">
                    Need help?{' '}
                    <a
                        href="#"
                        className="font-medium text-primary transition-colors hover:text-primary-hover"
                    >
                        Get support →
                    </a>
                </p>

                <p className="text-text-secondary">
                    CareLink Foundation Management System
                </p>
            </div>

            <div className="mt-3 flex flex-col gap-2 text-xs text-text-secondary/70 md:flex-row md:justify-between">
                <p>© 2026 CareLink. All rights reserved.</p>
                <p className="tracking-wide">
                    Built for clarity, coordination, and impact
                </p>
            </div>

        </div>
    );
};

export default FooterBottom;