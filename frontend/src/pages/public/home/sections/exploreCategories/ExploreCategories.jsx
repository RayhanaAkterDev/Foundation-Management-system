import React, { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { fetchCategories } from '@/api/categories';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const ExploreCategories = ({ campaigns = [] }) => {
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState(null);

    const leftPanelRef = useRef(null);
    const lastActiveId = useRef(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();

                const featuredCategories = data.filter(
                    (category) => category.featured === true,
                );

                setCategories(featuredCategories);

                if (featuredCategories.length > 0) {
                    setActive(featuredCategories[0]);
                    lastActiveId.current = featuredCategories[0].id;
                }
            } catch (error) {
                console.error('Failed to load featured categories:', error);

                setCategories([]);
                setActive(null);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        if (!active) return;

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
        }
    }, [active]);

    if (!active || categories.length === 0) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="section-gap bg-background"
        >
            <div className="container-width">
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-12
                        lg:grid-cols-12
                        lg:items-start
                        lg:gap-14
                        xl:gap-20
                    "
                >
                    {/* FEATURED CATEGORY */}
                    <div
                        ref={leftPanelRef}
                        className="
                            min-w-0
                            transition-all
                            duration-300
                            lg:col-span-8
                            lg:order-1
                        "
                    >
                        <LeftPanel
                            current={active}
                            campaigns={campaigns}
                        />
                    </div>

                    {/* CATEGORY NAVIGATION */}
                    <div
                        className="
                            min-w-0
                            lg:col-span-4
                            lg:order-2
                        "
                    >
                        <RightPanel
                            categories={categories}
                            active={active}
                            setActive={setActive}
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ExploreCategories;