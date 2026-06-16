import React, { useState, useEffect, useRef } from 'react';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import { featuredCategories } from '@/data/selectors';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const ExploreCategories = () => {
    const [active, setActive] = useState(featuredCategories[0]);
    const current = active;

    const itemRefs = useRef({});
    const leftPanelRef = useRef(null);

    const lastActiveId = useRef(active.id);

    // Intersection observer (unchanged, stable)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('data-id');
                        const found = featuredCategories.find(
                            (c) => c.id === id,
                        );
                        if (found) setActive(found);
                    }
                });
            },
            { threshold: 0.6 },
        );

        Object.values(itemRefs.current).forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // ✅ improved mobile focus behavior
    useEffect(() => {
        const isMobile = window.innerWidth < 1024;

        if (
            isMobile &&
            leftPanelRef.current &&
            lastActiveId.current !== active.id
        ) {
            lastActiveId.current = active.id;

            leftPanelRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });

            // small UX enhancement: brief highlight feel
            leftPanelRef.current.classList.add('ring-2', 'ring-black/5');

            setTimeout(() => {
                leftPanelRef.current?.classList.remove(
                    'ring-2',
                    'ring-black/5',
                );
            }, 500);
        }
    }, [active]);

    return (
        <motion.section
            animate={{ backgroundColor: current.color + '08' }}
            transition={{ duration: 0.6 }}
            className="section-gap"
        >
            <div className="container-width">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* RIGHT */}
                    <div className="lg:col-span-4 lg:order-2">
                        <RightPanel
                            categories={featuredCategories}
                            active={active}
                            setActive={setActive}
                            current={current}
                            itemRefs={itemRefs}
                        />
                    </div>

                    {/* LEFT */}
                    <div
                        ref={leftPanelRef}
                        className="
                            lg:col-span-8
                            transition-all
                            duration-300
                        "
                    >
                        <LeftPanel current={current} />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ExploreCategories;
