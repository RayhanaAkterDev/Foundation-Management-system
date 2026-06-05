import campaigns from './data/campaignsData';
import CampaignCard from './CampaignCard';

export default function ActiveCampaigns() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20">
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Ongoing Initiatives
                </p>

                <h2 className="mt-2 text-4xl font-bold text-zinc-900">
                    Active Campaigns
                </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign) => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                    />
                ))}
            </div>
        </section>
    );
}