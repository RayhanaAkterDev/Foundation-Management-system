import React from 'react';

import { Link } from 'react-router-dom';

import {
    TbAlertTriangle,
    TbBook,
    TbDots,
    TbFirstAidKit,
    TbHome,
    TbToolsKitchen2,
    TbBuildingCommunity,
    TbDroplet,
    TbBabyCarriage,
    TbWoman,
    TbDisabled,
    TbBolt,
} from 'react-icons/tb';

const categoryVisuals = {
    education: TbBook,
    healthcare: TbFirstAidKit,
    'food-assistance': TbToolsKitchen2,
    shelter: TbHome,
    livelihood: TbBuildingCommunity,
    'disaster-relief': TbAlertTriangle,
    'water-sanitation': TbDroplet,
    'child-support': TbBabyCarriage,
    'women-support': TbWoman,
    'disability-support': TbDisabled,
    'emergency-relief': TbBolt,
    other: TbDots,
};

const AllCategoriesView = ({ categories }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
                const Icon = categoryVisuals[cat.slug] || TbDots;

                return (
                    <Link
                        key={cat.id}
                        to={`/campaigns/category/${cat.slug}`}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-xl
                            border border-gray-200
                            bg-white
                            hover:shadow-lg
                            transition-all duration-300
                        "
                    >
                        <div className="h-40 overflow-hidden bg-primary/5">
                            <div className="w-full h-full flex items-center justify-center">
                                <div
                                    className="
                                        flex h-20 w-20
                                        items-center justify-center
                                        rounded-2xl
                                        bg-primary/10
                                        text-primary
                                        transition-transform duration-300
                                        group-hover:scale-110
                                    "
                                >
                                    <Icon size={40} />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 space-y-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="
                                        w-9 h-9
                                        flex items-center justify-center
                                        rounded-lg
                                        bg-primary/10
                                        text-primary
                                    "
                                >
                                    <Icon size={20} />
                                </div>

                                <h3 className="font-semibold text-text-primary">
                                    {cat.name}
                                </h3>
                            </div>

                            <p className="text-sm text-text-secondary line-clamp-2">
                                {cat.description}
                            </p>

                            <div className="flex justify-between text-xs text-text-secondary pt-2">
                                <span>
                                    {cat.featured
                                        ? 'Featured cause'
                                        : 'Humanitarian cause'}
                                </span>

                                <span className="capitalize">
                                    {cat.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default AllCategoriesView;
