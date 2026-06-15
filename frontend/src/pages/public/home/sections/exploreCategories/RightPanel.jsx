import React from 'react';
import ExploreAllCategoriesCta from './ExploreAllCategoriesCta';

const RightPanel = ({ categories, active, setActive }) => {
    return (
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
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
                            className="absolute left-0 top-0 h-full w-0.5"
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

                        <div className="pl-4 sm:pl-5 pr-3 sm:pr-5">
                            {/* TOP ROW */}
                            <div className="flex items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                            backgroundColor: cat.color + '15',
                                            color: cat.color,
                                        }}
                                    >
                                        <Icon size={16} />
                                    </div>

                                    <h4
                                        className="text-sm sm:text-base font-medium truncate leading-snug"
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
                                    className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] whitespace-nowrap"
                                    style={{
                                        color: isActive ? cat.color : '#6b7280',
                                    }}
                                >
                                    {cat.urgency}
                                </div>
                            </div>

                            {/* EXPAND AREA */}
                            <div
                                className={`
                                    overflow-hidden transition-all duration-300
                                    ${isActive ? 'max-h-40 mt-4' : 'max-h-0'}
                                `}
                            >
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-prose">
                                    {cat.description}
                                </p>

                                <div className="mt-3 text-[11px] sm:text-xs text-gray-500 flex gap-3 flex-wrap leading-relaxed">
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
