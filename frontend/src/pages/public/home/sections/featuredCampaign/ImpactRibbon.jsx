import React from 'react';
import impactItems from './data/impactRibbonData';

const ImpactRibbon = () => {
    return (
        <div className="mt-14 sm:mt-16 lg:mt-20">
            <div
                className="
            flex flex-wrap items-center
            gap-x-7 gap-y-4
        "
            >
                {/* heading */}
                <p
                    className="
                mr-1 text-sm font-medium
                text-text-primary
            "
                >
                    Emergency aid includes
                </p>

                {/* items */}
                {impactItems.map((item, index) => (
                    <div
                        key={item.label}
                        className="
                    flex items-center gap-3
                    text-text-secondary
                "
                    >
                        {/* divider */}
                        {index !== 0 && (
                            <span
                                className="
                            hidden lg:block
                            h-1 w-1 rounded-full
                            bg-border
                        "
                            />
                        )}

                        {/* icon */}
                        <span
                            className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-primary/8 text-primary
                    "
                        >
                            {React.createElement(item.icon, {
                                className: 'text-[18px]',
                            })}
                        </span>

                        {/* label */}
                        <span className="text-sm font-medium">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImpactRibbon;
