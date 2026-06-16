import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CategorySidebar = ({ categories, activeCategoryId }) => {
    return (
        <div className="space-y-3">
            {/* ALL */}
            <Link to="/categories" className="relative block py-2 transition">
                {!activeCategoryId && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 h-full w-1 bg-black rounded"
                    />
                )}
                All Categories
            </Link>

            {/* URGENT */}
            <Link
                to="/categories/urgent"
                className="relative block py-2 transition"
            >
                {activeCategoryId === 'urgent' && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded"
                    />
                )}
                Urgent
            </Link>

            {/* CATEGORY LIST */}
            <div className="pt-4 space-y-2">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        to={`/categories/${cat.id}`}
                        className="relative block py-2 transition"
                    >
                        {activeCategoryId === cat.id && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-0 h-full w-1 rounded"
                                style={{ backgroundColor: cat.color }}
                            />
                        )}
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySidebar;
