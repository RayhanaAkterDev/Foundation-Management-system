import React from 'react';

const OrganizationCategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <div className="border-b border-border">
            <div className="flex items-center gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = activeCategory === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={`relative inline-flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                                isActive
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <span>{tab.label}</span>

                            <span
                                className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-background-alt text-text-secondary'
                                }`}
                            >
                                {tab.count}
                            </span>

                            {isActive && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OrganizationCategoryTabs;
