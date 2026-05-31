import React from 'react';
import ExploreAllCategoriesCta from './ExploreAllCategoriesCta';

const RightPanel = ({ categories, active, setActive }) => {
    return (
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = active.id === cat.id;

                return (
                    <div
                        key={cat.id}
                        onClick={() => setActive(cat)}
                        className={`
                            relative cursor-pointer overflow-hidden rounded-xl group
                            transition-all duration-300
                            ${isActive ? 'py-5 sm:py-6' : 'py-3 sm:py-4 opacity-70 hover:opacity-100'}
                        `}
                    >
                        {/* LEFT BAR */}
                        <div
                            className="absolute left-0 top-0 h-full w-0.5 sm:w-0.75 transition-all"
                            style={{
                                backgroundColor: cat.color,
                                opacity: isActive ? 1 : 0.25,
                            }}
                        />

                        {/* GLOW */}
                        {isActive && (
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    background: `radial-gradient(circle at left, ${cat.color}, transparent 70%)`,
                                }}
                            />
                        )}

                        <div className="pl-4 sm:pl-5 pr-3 sm:pr-4">
                            {/* TOP ROW */}
                            <div className="flex items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: cat.color + '15',
                                            color: cat.color,
                                        }}
                                    >
                                        <Icon size={15} />
                                    </div>

                                    <h4
                                        className="text-sm sm:text-[15px] font-medium truncate"
                                        style={{
                                            color: isActive
                                                ? cat.color
                                                : '#111827',
                                        }}
                                    >
                                        {cat.title}
                                    </h4>
                                </div>

                                <div
                                    className="text-[10px] sm:text-[11px] uppercase tracking-wide whitespace-nowrap"
                                    style={{
                                        color: isActive ? cat.color : '#6b7280',
                                    }}
                                >
                                    {cat.urgency}
                                </div>
                            </div>

                            {/* EXPAND AREA (smooth + stable) */}
                            <div
                                className={`
                                    overflow-hidden transition-all duration-300
                                    ${isActive ? 'max-h-32 mt-3' : 'max-h-0'}
                                `}
                            >
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    {cat.description}
                                </p>

                                <div className="mt-2 text-[11px] text-gray-500 flex gap-3 flex-wrap">
                                    <span>{cat.activeCases} active</span>
                                    <span>•</span>
                                    <span>{cat.avgResponseTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <ExploreAllCategoriesCta />
        </div>
    );
};

export default RightPanel;
