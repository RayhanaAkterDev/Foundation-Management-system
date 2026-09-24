import React, { useEffect, useMemo, useState } from "react";
import { HandCoins } from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import DonationSummary from "./components/DonationSummary";
import DonationTable from "./components/DonationTable";
import DonationDetailsModal from "./modals/DonationDetailsModal";

import { apiRequest } from "@/api/client";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState({
    type: null,
    data: null,
    donation: null,
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/admin/donations");

        const donationData = Array.isArray(response)
          ? response
          : response?.donations || response?.data || [];

        setDonations(donationData);
      } catch (err) {
        setError(err?.message || "Unable to load donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const summary = useMemo(() => {
    const totalAmount = donations.reduce((sum, donation) => {
      const amount = Number(donation?.amount);

      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const totalDonations = donations.length;

    const averageDonation =
      totalDonations > 0 ? totalAmount / totalDonations : 0;

    return {
      totalAmount,
      totalDonations,
      averageDonation,
    };
  }, [donations]);

  const handleViewDonation = (donation) => {
    setModal({
      type: "donation",
      data: donation,
      donation,
    });
  };

  const handleViewDonor = (donation) => {
    const donor = donation?.user || donation?.donor || null;

    if (!donor) {
      return;
    }

    setModal({
      type: "donor",
      data: donor,
      donation,
    });
  };

  const handleViewCampaign = (donation) => {
    const campaign = donation?.campaign || null;

    if (!campaign) {
      return;
    }

    setModal({
      type: "campaign",
      data: campaign,
      donation,
    });
  };

  const handleCloseModal = () => {
    setModal({
      type: null,
      data: null,
      donation: null,
    });
  };

  return (
    <div className="min-h-full bg-bg">
      <PageHeader
        title="Donations"
        description="Monitor contributions and the funds received through the platform."
        icon={HandCoins}
      />

      <div className="space-y-6">
        <DonationSummary summary={summary} />

        <DonationTable
          donations={donations}
          loading={loading}
          error={error}
          onViewDonation={handleViewDonation}
          onViewDonor={handleViewDonor}
          onViewCampaign={handleViewCampaign}
        />
      </div>

      {modal.type && (
        <DonationDetailsModal
          type={modal.type}
          data={modal.data}
          donation={modal.donation}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Donations;
