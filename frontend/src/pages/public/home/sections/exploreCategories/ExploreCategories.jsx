import React, { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

import { fetchCategories } from '@/api/categories';
import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const ExploreCategories = ({ campaigns = [] }) => {
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState(null);
    const [publicCampaigns, setPublicCampaigns] = useState([]);

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
        if (campaigns.length > 0) {
            return;
        }

        const loadPublicCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();

                if (Array.isArray(data)) {
                    setPublicCampaigns(data);
                } else if (Array.isArray(data?.campaigns)) {
                    setPublicCampaigns(data.campaigns);
                } else if (Array.isArray(data?.data)) {
                    setPublicCampaigns(data.data);
                } else {
                    setPublicCampaigns([]);
                }
            } catch (error) {
                console.error('Failed to load public campaigns:', error);
                setPublicCampaigns([]);
            }
        };

        loadPublicCampaigns();
    }, [campaigns]);

    useEffect(() => {
        if (!active) {
            return;
        }

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

    const campaignData = campaigns.length > 0 ? campaigns : publicCampaigns;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="section-gap bg-background border-y border-border"
        >
            <div className="container-width">
                {/* MOBILE / TABLET */}
                <div className="lg:hidden">
                    <RightPanel
                        categories={categories}
                        active={active}
                        setActive={setActive}
                        campaigns={campaignData}
                    />

                    <div ref={leftPanelRef} className="mt-12 sm:mt-14">
                        <LeftPanel current={active} campaigns={campaignData} />
                    </div>
                </div>

                {/* DESKTOP / LAPTOP */}
                <div
                    className="
                        hidden
                        lg:grid
                        lg:grid-cols-12
                        lg:items-start
                        lg:gap-16
                        xl:gap-20
                    "
                >
                    <div
                        ref={leftPanelRef}
                        className="
                            min-w-0
                            lg:col-span-7
                            xl:col-span-8
                        "
                    >
                        <LeftPanel current={active} campaigns={campaignData} />
                    </div>

                    <div
                        className="
                            min-w-0
                            lg:col-span-5
                            xl:col-span-4
                        "
                    >
                        <RightPanel
                            categories={categories}
                            active={active}
                            setActive={setActive}
                            campaigns={campaignData}
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ExploreCategories;
