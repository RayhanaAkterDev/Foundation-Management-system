import React, { useState, useEffect, useRef } from 'react';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

import categories from './data/categories';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const ExploreCategories = () => {
    const [active, setActive] = useState(categories[0]);
    const current = active;

    const itemRefs = useRef({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('data-id');
                        const found = categories.find((c) => c.id === id);
                        if (found) setActive(found);
                    }
                });
            },
            {
                root: null,
                threshold: 0.6,
            },
        );

        Object.values(itemRefs.current).forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <motion.section
            animate={{ backgroundColor: current.color + '08' }}
            transition={{ duration: 0.6 }}
            className="section-gap"
        >
            <div className="container-width">
                {/* HEADER */}
                <Motion variant="fadeUp">
                    <SectionHeading
                        title="Where would you like your help to go?"
                        headingSize="sectionHero"
                        description="Every category represents real people and real situations. Choose where your support should make a difference."
                    />
                </Motion>

                <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <LeftPanel current={current} />

                    <RightPanel
                        categories={categories}
                        active={active}
                        setActive={setActive}
                        current={current}
                        itemRefs={itemRefs}
                    />
                </div>
            </div>
        </motion.section>
    );
};

export default ExploreCategories;
