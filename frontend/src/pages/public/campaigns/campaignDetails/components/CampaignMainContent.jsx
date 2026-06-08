import Badge from '@/components/Badge';
import CampaignStory from './CampaignStory';
import SectionHeading from '@/components/SectionHeading';

const CampaignMainContent = ({ campaign }) => {
    return (
        <div>
            {/* META */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge
                    variant={
                        campaign.urgency === 'Critical' ? 'urgent' : 'primary'
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
            {campaign.updates?.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-3xl font-semibold text-text-primary mb-10">
                        Latest Updates
                    </h2>

                    <div className="space-y-10">
                        {campaign.updates.map((update, index) => (
                            <div
                                key={index}
                                className="border-b border-border pb-8 last:border-0"
                            >
                                <p className="text-sm text-text-secondary mb-2">
                                    {update.date}
                                </p>

                                <h3 className="text-xl font-semibold text-text-primary">
                                    {update.title}
                                </h3>

                                <p className="mt-3 text-text-secondary leading-8">
                                    {update.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default CampaignMainContent;
