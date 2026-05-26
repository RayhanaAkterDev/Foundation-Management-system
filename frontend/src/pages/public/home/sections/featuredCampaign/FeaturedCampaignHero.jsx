import React from 'react';
import { HiArrowSmRight } from 'react-icons/hi';
import {
    TbFlameFilled,
    TbHeartFilled,
    TbHomeHeart,
    TbUsers,
    TbCalendarEvent,
    TbHeartHandshake,
} from 'react-icons/tb';
import Button from '@/components/Button';
import heroCampaignStatData from './data/heroCampaignStatData';
import featuredCampaign from '@/assets/home/featuredCampaign.png';
import SectionHeading from '@/components/SectionHeading';
import StatCard from '@/components/StatCard';

const FeaturedCampaignHero = () => {
    return (
        <div className="bg-surface rounded-xl shadow-sm border border-border flex">
            <div className="w-1/2 rounded-l-xl">
                <img
                    src={featuredCampaign}
                    alt="featuredCampaign image"
                    className="h-full object-cover rounded-l-xl"
                />
            </div>

            <div className="w-1/2 py-6 px-5 flex flex-col justify-center gap-8">
                <SectionHeading
                    // gap="sm"
                    align="left"
                    headingTag="h4"
                    headingSize="sub"
                    badge="Urgent Need"
                    badgeIcon={TbFlameFilled}
                    badgeClass="badge-accent"
                    title="Emergency flood relief for coastal families"
                    description="Severe flooding has displaced thousand of families. Your
                    support provides food, clean water, shelter, and essential
                    medical aid."
                />

                {/* progress bar */}
                <div className="progress-bar flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h5 className="text-primary text-xl font-bold">
                                $12,500
                            </h5>
                            <p className="text-sm text-text-secondary font-medium leading-none">
                                raised of $20,000 goal
                            </p>
                        </div>
                        <div>
                            <p className="text-primary text-xl font-bold">
                                62%
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-primary-hover rounded-3xl"></div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-4 divide-x divide-border">
                    {heroCampaignStatData.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.id}
                                className="flex flex-col items-center text-center px-4"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stat.iconBg}`}
                                >
                                    <Icon
                                        className={`text-xl ${stat.iconColor}`}
                                    />
                                </div>

                                <h6 className="text-lg font-bold text-text-primary">
                                    {stat.value}
                                </h6>

                                <p className="text-xs text-text-secondary">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* cta buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-start items-start">
                    <Button className="w-full sm:w-auto">
                        <TbHeartFilled />
                        Donate Now
                    </Button>

                    <Button variant="outline" className="w-full sm:w-auto">
                        Learn More
                        <HiArrowSmRight className="mt-0.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCampaignHero;
