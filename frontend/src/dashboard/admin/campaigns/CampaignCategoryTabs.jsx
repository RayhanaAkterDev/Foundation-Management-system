import React from 'react';

const CampaignCategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <div className="flex overflow-x-auto border-b border-border">
            {tabs.map((tab) => {
                const active = activeCategory === tab.key;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={`relative shrink-0 px-4 pb-3 text-sm font-semibold transition-colors ${
                            active
                                ? 'text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            {tab.label}

                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-background-alt text-text-secondary'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </span>

                        {active && (
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default CampaignCategoryTabs;
