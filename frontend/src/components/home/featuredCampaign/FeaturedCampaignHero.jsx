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
import Button from '../../common/Button';
import heroCampaignStatData from './data/heroCampaignStatData';
import featuredCampaign from '../../../assets/images/home/featuredCampaign.png';

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

            <div className="w-1/2 rounded-lg py-6 px-5 flex flex-col gap-4">
                <p className="text-accent bg-accent/10 inline-flex w-2/5 items-center gap-1 rounded-3xl px-4 py-1 font-semibold text-sm">
                    <span className="">
                        <TbFlameFilled />
                    </span>
                    Urgent Need
                </p>
                <h4 className="text-primary text-xl font-bold">
                    Emergency flood relief for coastal families
                </h4>
                <p className="text-text-secondary text-sm">
                    Severe flooding has displaced thousand of families. Your
                    support provides food, clean water, shelter, and essential
                    medical aid.
                </p>

                {/* progress bar */}
                <div className="progress-bar flex flex-col gap-2 mt-2">
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
                <div className="grid grid-cols-4 divide-x divide-border bg-surface rounded-xl mt-4 -mb-4">
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
                <div className="cta-buttons">
                    <Button>
                        <TbHeartFilled aria-hidden="true" />
                        Donate Now
                    </Button>

                    <Button variant="outline">
                        Learn More
                        <HiArrowSmRight aria-hidden="true" className="mt-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCampaignHero;
