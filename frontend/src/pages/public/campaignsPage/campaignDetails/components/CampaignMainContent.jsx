import Badge from '@/components/Badge';
import CampaignStory from './CampaignStory';
import SectionHeading from '@/components/SectionHeading';

import { TbCircleCheck, TbStethoscope, TbTruckDelivery } from 'react-icons/tb';

const iconMap = {
    TbCircleCheck,
    TbStethoscope,
    TbTruckDelivery,
};

const CampaignMainContent = ({ campaign }) => {
    const updates = campaign?.updates || [];

    return (
        <div className="space-y-6">
            {/* META (compact) */}
            <div className="flex flex-wrap items-center gap-2">
                <Badge
                    variant={
                        campaign.urgency === 'Critical' ? 'urgent' : 'primary'
                    }
                >
                    {campaign.urgency}
                </Badge>

                <span className="text-text-secondary">
                    <span className="uppercase">{campaign.category} • </span>
                    {campaign.location}
                </span>
            </div>

            <SectionHeading
                gap="sm"
                align="left"
                title={campaign.title}
                headingSize="sectionHero"
                description={campaign.shortDescription}
                descriptionSize="hero"
            />

            {/* IMAGE (reduced height) */}
            <div className="relative overflow-hidden rounded-2xl">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-80 object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>

            {/* STORY (compact container) */}
            <CampaignStory story={campaign.story} />

            {/* UPDATES */}
            {updates.length > 0 && (
                <section className="pt-2">
                    {/* HEADER (tight) */}
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
                            Updates
                        </h2>

                        <p className="text-xs text-text-secondary mt-1">
                            Field reports & progress
                        </p>
                    </div>

                    {/* TIMELINE (compact UI) */}
                    <div className="relative">
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-border/60" />

                        {updates.map((update, index) => {
                            const Icon = iconMap?.[update.icon];

                            return (
                                <div
                                    key={index}
                                    className="relative flex gap-4 pb-6 last:pb-0"
                                >
                                    {/* ICON (smaller) */}
                                    <div className="z-10">
                                        <div
                                            className="
                                            w-9 h-9 rounded-xl
                                            bg-surface border border-border
                                            flex items-center justify-center
                                            text-primary
                                        "
                                        >
                                            {Icon ? (
                                                <Icon size={16} />
                                            ) : (
                                                <TbCircleCheck size={16} />
                                            )}
                                        </div>
                                    </div>

                                    {/* CONTENT (compact text) */}
                                    <div className="flex-1">
                                        <div className="flex justify-between gap-3">
                                            <h3 className="text-sm font-medium text-text-primary">
                                                {update.title}
                                            </h3>

                                            <span className="text-[11px] text-text-secondary whitespace-nowrap">
                                                {update.date}
                                            </span>
                                        </div>

                                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                            {update.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default CampaignMainContent;
