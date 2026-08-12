import React from 'react';

const UserCategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <div className="border-b border-border">
            <div className="flex max-w-full gap-6 overflow-x-auto">
                {tabs.map((tab) => {
                    const active = activeCategory === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={`relative flex shrink-0 items-center gap-2.5 pb-3.5 pt-1 text-sm font-semibold transition-colors ${
                                active
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <span>{tab.label}</span>

                            <span
                                className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-background-alt text-text-secondary'
                                }`}
                            >
                                {tab.count}
                            </span>

                            {active && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default UserCategoryTabs;
