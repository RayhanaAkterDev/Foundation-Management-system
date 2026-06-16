import { useState } from 'react';

export const useActiveCategory = (defaultId) => {
    const [active, setActive] = useState(defaultId);

    return {
        activeCategory: active,
        setActiveCategory: setActive,
    };
};