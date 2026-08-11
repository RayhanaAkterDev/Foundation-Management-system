import React from 'react';

const UserCategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex max-w-full overflow-x-auto rounded-xl border border-border bg-white p-1">
                {tabs.map((tab) => {
                    const active = activeCategory === tab.key;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => onChange(tab.key)}
                            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                                active
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:bg-background-alt hover:text-text-primary'
                            }`}
                        >
                            <span>{tab.label}</span>

                            <span
                                className={`min-w-5 rounded-full px-1.5 py-0.5 text-[10px] ${
                                    active
                                        ? 'bg-white/15 text-white'
                                        : 'bg-background-alt text-text-secondary'
                                }`}
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

export default UserCategoryTabs;
