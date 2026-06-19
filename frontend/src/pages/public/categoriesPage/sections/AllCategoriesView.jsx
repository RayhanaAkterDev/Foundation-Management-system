import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryCount } from '@/data/selectors';

const AllCategoriesView = ({ categories }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
                const Icon = cat.icon;

                return (
                    <Link
                        key={cat.id}
                        to={`/campaigns/category/${cat.id}`}
                        className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
                    >
                        {/* IMAGE BACKGROUND */}
                        <div className="h-40 overflow-hidden">
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 space-y-2">
                            {/* ICON + TITLE */}
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-9 h-9 flex items-center justify-center rounded-lg"
                                    style={{
                                        backgroundColor: `${cat.color}20`,
                                    }}
                                >
                                    <Icon
                                        style={{ color: cat.color }}
                                        className="text-lg"
                                    />
                                </div>

                                <h3 className="font-semibold">{cat.name}</h3>
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-sm text-text-secondary line-clamp-2">
                                {cat.description}
                            </p>

                            {/* META */}
                            <div className="flex justify-between text-xs text-text-secondary pt-2">
                                <span>
                                    {getCategoryCount(cat.id)} campaigns
                                </span>
                                <span>{cat.avgResponseTime}</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default AllCategoriesView;
