import React, { useEffect, useState } from "react";

import { Loader2, Megaphone } from "lucide-react";

import { apiRequest } from "@/api/client";
import EmptyState from "@/components/dashboard/EmptyState";
import PageHeader from "@/components/dashboard/PageHeader";

import CampaignCard from "./components/CampaignCard";
import DonationModal from "./components/DonationModal/DonationModal";

const IndividualCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/campaigns");

        const data = Array.isArray(response?.campaigns)
          ? response.campaigns
          : [];

        setCampaigns(data);
      } catch (err) {
        setError(err?.message || "Unable to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <>
      <div className="min-h-full bg-background">
        <PageHeader
          title="Campaigns"
          description="Support humanitarian campaigns and help communities in need."
        />

        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Loading campaigns...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No campaigns available"
              description="There are currently no active campaigns available for donation."
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onDonate={setSelectedCampaign}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedCampaign && (
        <DonationModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </>
  );
};

export default IndividualCampaigns;
