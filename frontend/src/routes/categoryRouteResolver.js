import { categories } from '@/data/categories';

export const getCategoryRouteState = (categoryId) => {
    const activeCategory = categories.find(
        (c) => c.id === categoryId
    );

    const isAll = !categoryId;
    const isUrgent = categoryId === 'urgent';

    return {
        mode: isAll
            ? 'all'
            : isUrgent
            ? 'urgent'
            : activeCategory
            ? 'category'
            : 'unknown',

        activeCategory,
        isAll,
        isUrgent,
    };
};