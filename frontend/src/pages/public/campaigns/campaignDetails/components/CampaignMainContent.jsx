import Badge from '@/components/Badge';
import CampaignStory from './CampaignStory';
import SectionHeading from '@/components/SectionHeading';

import {
    TbCircleCheck,
    TbStethoscope,
    TbTruckDelivery,
} from 'react-icons/tb';

const iconMap = {
    TbCircleCheck,
    TbStethoscope,
    TbTruckDelivery,
};

const CampaignMainContent = ({ campaign }) => {
    const updates = campaign?.updates || [];

    return (
        <div>
            {/* META */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge
                    variant={
                        campaign.urgency === 'Critical'
                            ? 'urgent'
                            : 'primary'
                    }
                    size="sm"
                >
                    {campaign.urgency}
                </Badge>

                <p className="text-primary text-sm">
                    {campaign.category} • {campaign.location}
                </p>
            </div>

            {/* TITLE */}
            <SectionHeading
                align="left"
                title={campaign.title}
                headingSize="hero"
                headingClass="leading-18! tracking-normal"
                description={campaign.shortDescription}
                descriptionSize="hero"
                descriptionClass="leading-9! tracking-wide"
            />

            {/* HERO IMAGE */}
            <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full mt-10 rounded-3xl object-cover"
            />

            {/* STORY */}
            <CampaignStory story={campaign.story} />

            {/* UPDATES */}
            {updates.length > 0 && (
                <section className="mt-20">
                    <div className="mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                            Campaign Updates
                        </h2>
                        <div className="mt-3 h-1 w-16 bg-primary rounded-full" />
                    </div>

                    <div className="relative">
                        {updates.map((update, index) => {
                            const Icon = iconMap?.[update.icon];

                            return (
                                <div
                                    key={index}
                                    className="relative flex gap-6 pb-10 last:pb-0"
                                >
                                    {/* Timeline */}
                                    <div className="relative flex flex-col items-center shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                                            {Icon ? (
                                                <Icon size={22} />
                                            ) : (
                                                <TbCircleCheck size={22} />
                                            )}
                                        </div>

                                        {index !== updates.length - 1 && (
                                            <div className="w-px flex-1 bg-border mt-2 min-h-[70px]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                        <div className="max-w-2xl">
                                            <h3 className="text-lg font-semibold text-text-primary">
                                                {update.title}
                                            </h3>

                                            <p className="mt-2 text-text-secondary leading-7">
                                                {update.content}
                                            </p>
                                        </div>

                                        <div className="shrink-0 text-sm text-text-secondary md:text-right">
                                            {update.date}
                                        </div>
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