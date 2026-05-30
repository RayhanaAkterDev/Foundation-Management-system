import React from 'react';
import ExploreAllCategoriesCta from './ExploreAllCategoriesCta';

const RightPanel = ({ categories, active, setActive, current, itemRefs }) => {
    return (
        <div className="lg:col-span-7 space-y-2 sm:space-y-3">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = active.id === cat.id;

                return (
                    <button
                        key={cat.id}
                        ref={(el) => (itemRefs.current[cat.id] = el)}
                        data-id={cat.id}
                        onClick={() => setActive(cat)}
                        className={`
                            group w-full text-left flex items-start sm:items-center justify-between
                            px-4 sm:px-5 py-5 rounded-xl
                            transition-all duration-300 border
                            ${
                                isActive
                                    ? 'bg-white border-gray-200 scale-[1.01] shadow-sm'
                                    : 'bg-transparent border-transparent hover:bg-white/60 hover:translate-x-0.5'
                            }
                        `}
                    >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                            <div
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition shrink-0"
                                style={{
                                    backgroundColor: isActive
                                        ? current.color + '15'
                                        : '#f3f4f6',
                                    color: isActive ? current.color : '#9ca3af',
                                }}
                            >
                                <Icon size={16} />
                            </div>

                            <div className="min-w-0">
                                <h4
                                    className="font-medium text-[15px] sm:text-base leading-snug sm:leading-normal"
                                    style={{
                                        color: isActive
                                            ? current.color
                                            : '#111827',
                                    }}
                                >
                                    {cat.title}
                                </h4>

                                <p className="text-[13px] sm:text-sm text-gray-500 leading-relaxed mt-1">
                                    {cat.description}
                                </p>
                            </div>
                        </div>

                        <div
                            className="transition opacity-70 group-hover:opacity-100 group-hover:translate-x-1"
                            style={{
                                color: isActive ? current.color : '#d1d5db',
                            }}
                        >
                            →
                        </div>
                    </button>
                );
            })}

            <ExploreAllCategoriesCta current={current} />
        </div>
    );
};

export default RightPanel;
