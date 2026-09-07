import React from 'react';

const HelpRequestCategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <div className="w-full mt-6">
            <div className="space-y-1">
                {tabs.map((tab) => {
                    const active = activeCategory === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={`
                                group flex w-full items-center justify-between
                                rounded-xl border px-3.5 py-3
                                text-left transition-all duration-200
                                ${
                                    active
                                        ? 'border-primary/15 bg-primary/[0.07] text-primary'
                                        : 'border-transparent text-text-secondary hover:border-border/70 hover:bg-white hover:text-text-primary'
                                }
                            `}
                        >
                            <span
                                className={`
                                    min-w-0 truncate text-[12px]
                                    ${
                                        active
                                            ? 'font-bold text-primary'
                                            : 'font-medium'
                                    }
                                `}
                            >
                                {tab.label}
                            </span>

                            <span
                                className={`
                                    ml-3 flex h-6 min-w-6 shrink-0 items-center
                                    justify-center rounded-md px-1.5
                                    text-[10px] font-bold
                                    ${
                                        active
                                            ? 'bg-primary text-white'
                                            : 'bg-background-alt text-text-secondary group-hover:bg-primary/10 group-hover:text-primary'
                                    }
                                `}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HelpRequestCategoryTabs;
