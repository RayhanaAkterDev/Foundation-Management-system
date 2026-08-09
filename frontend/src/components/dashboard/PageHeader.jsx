import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
    return (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
                <h1 className="font-['Fraunces'] text-2xl font-semibold text-text-primary md:text-3xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-sm text-[#6b7280] leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
};

export default PageHeader;
