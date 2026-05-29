import React from 'react';
import { HiArrowSmRight } from 'react-icons/hi';
import {
    TbBottleFilled,
    TbBread,
    TbHeartFilled,
    TbAlertTriangle,
    TbDroplet,
    TbMapPin
} from 'react-icons/tb';
import Button from '@/components/Button';
import heroCampaignStatData from './data/heroCampaignStatData';
import featuredCampaign from '@/assets/home/featuredCampaign.png';
import SectionHeading from '@/components/SectionHeading';

const FeaturedCampaign = () => {
    return (
        <section className="relative">
            <div className="container-width flex gap-6">
                <div className="w-3/4 flex border border-border rounded-3xl bg-surface">
                    <div className="w-1/2 rounded-l-xl ">
                        <img
                            src={featuredCampaign}
                            alt="featuredCampaign image"
                            className="h-full object-cover rounded-l-xl "
                        />
                        <div className="relative -left-38 -top-115">
                            <SectionHeading
                                badge="Urgent"
                                badgeIcon={TbAlertTriangle}
                                badgeClass="badge-accent"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 py-6 px-5 flex flex-col justify-center gap-8">
                        <SectionHeading
                            // gap="sm"
                            align="left"
                            headingTag="h4"
                            headingSize="sub"
                            // badge="Flood Relief"
                            // badgeClass="badge-primary"
                            // badgeIcon={TbFlameFilled}

                            badges={[
                                {
                                    label: 'Flood Relief',
                                    icon: TbDroplet,
                                    className: 'badge-primary',
                                },
                                {
                                    label: 'Khulna',
                                    icon: TbMapPin,
                                    className: 'badge-default',
                                },
                            ]}
                            title={
                                <>
                                    Emergency Food Support —{' '}
                                    <span className="inline sm:block">
                                        Khulna Flood Response
                                    </span>
                                </>
                            }
                            description="When floods hit Khulna, CareLink volunteers and donors
stepped in together. Within 72 hours, essential food
packages reached 1,200 families."
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
                    </div>
                </div>

                <div className="w-1/4 border border-primary/20 bg-primary/5 shadow-sm px-6 py-8 rounded-3xl flex flex-col justify-center">
                    <h4 className="text-primary text-xl font-medium">
                        Your support provides
                    </h4>
                    <ul className="flex flex-col gap-3 text-text-secondary my-8">
                        <li className="flex items-center gap-3">
                            <span className="text-primary w-10 h-10 text-lg rounded-full bg-primary/10 flex items-center justify-center">
                                <TbBottleFilled />
                            </span>{' '}
                            Clean Drinking Water
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-primary w-10 h-10 text-lg rounded-full bg-primary/10 flex items-center justify-center">
                                <TbBread />
                            </span>{' '}
                            Nutritious Food
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-primary w-10 h-10 text-lg rounded-full bg-primary/10 flex items-center justify-center">
                                <TbBottleFilled />
                            </span>{' '}
                            Medical Assistance
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-primary w-10 h-10 text-lg rounded-full bg-primary/10 flex items-center justify-center">
                                <TbBottleFilled />
                            </span>{' '}
                            Shelter & Protection
                        </li>
                    </ul>

                    {/* cta buttons */}
                    <div className="flex flex-col gap-4">
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
        </section>
    );
};

export default FeaturedCampaign;
