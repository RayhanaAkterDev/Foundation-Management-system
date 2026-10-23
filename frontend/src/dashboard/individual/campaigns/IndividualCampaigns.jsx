import React, { useEffect, useState } from "react";

import { Megaphone } from "lucide-react";

import { apiRequest } from "@/api/client";
import LoadingUI from "@/components/dashboard/LoadingUI";
import LoadingError from "@/components/dashboard/LoadingError";
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
      <div className="min-h-full bg-transparent">
        <PageHeader
          title="Campaigns"
          subtitle="Support humanitarian campaigns and help communities in need."
        />

        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingUI variant="page" title="Loading campaigns..." description="Retrieving available campaigns." />
          ) : error ? (
            <LoadingError title="Unable to load campaigns" message={error} />
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No campaigns available"
              description="There are currently no active campaigns available for donation."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
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
