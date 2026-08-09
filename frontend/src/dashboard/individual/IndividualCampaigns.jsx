import React from 'react';
import { Megaphone } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { mockActiveCampaigns } from '@/data/mockIndividual';

const CampaignCard = ({ campaign }) => (
  <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-['Fraunces'] text-base font-semibold text-text-primary truncate">
          {campaign.title}
        </p>
        <p className="mt-0.5 text-xs text-[#6b7280]">{campaign.category}</p>
      </div>
      <StatusBadge status="active" />
    </div>

    {/* Progress */}
    <div className="mt-4">
      <div className="flex justify-between text-xs text-[#6b7280] mb-1.5">
        <span>₱{campaign.raised.toLocaleString()} raised</span>
        <span>{campaign.progress}% of ₱{campaign.goal.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef3f6]">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(campaign.progress, 100)}%` }}
        />
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <p className="text-xs text-[#6b7280]">Deadline: {campaign.deadline}</p>
      <button
        type="button"
        className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
      >
        Donate
      </button>
    </div>
  </div>
);

const IndividualCampaigns = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle="Discover and support active campaigns from Stand For People and its partner organizations."
      />

      {mockActiveCampaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No active campaigns"
          message="Check back soon for campaigns you can support."
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mockActiveCampaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IndividualCampaigns;
