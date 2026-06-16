import React from 'react';

// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import CategoryGrid from './CategoryGrid';
import { getCampaignsByCategory } from '@/data/selectors';

const CategoryView = ({ category }) => {
    const campaigns = getCampaignsByCategory(category.id);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.35,
                    ease: 'easeOut',
                }}
            >
                <CategoryGrid
                    category={{
                        ...category,
                        campaigns,
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default CategoryView;
