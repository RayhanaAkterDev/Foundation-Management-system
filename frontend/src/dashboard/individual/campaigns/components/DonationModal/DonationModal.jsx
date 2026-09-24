import React, { useState } from "react";

import { HandCoins, X } from "lucide-react";

import { initiateDonation } from "@/dashboard/individual/myDonations/api/donationApi";

import DonationAmountForm from "./DonationAmountForm";
import DonationCampaignSummary from "./DonationCampaignSummary";
import DonationTrustBar from "./DonationTrustBar";

const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const getErrorMessage = (error) => {
  if (!error) {
    return "Unable to start the payment process. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.errors && typeof error.errors === "object") {
    const messages = Object.values(error.errors).flat().filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (error.data?.message) {
    return error.data.message;
  }

  if (error.data?.errors && typeof error.data.errors === "object") {
    const messages = Object.values(error.data.errors).flat().filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return "Unable to start the payment process. Please try again.";
};

const DonationModal = ({ campaign, onClose }) => {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAmountChange = (value) => {
    setAmount(value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      setError("Please enter a valid donation amount.");
      return;
    }

    if (numericAmount < 10) {
      setError("Please enter a donation amount of at least ৳10.");
      return;
    }

    if (!campaign?.id) {
      setError("Campaign information is missing. Please try again.");
      return;
    }

    const user = getStoredUser();

    const donorPhone = user?.phone || "";
    const donorName = user?.name || "";
    const donorEmail = user?.email || "";

    if (!donorPhone) {
      setError(
        "Your account does not have a valid phone number. Please update your phone number before making a donation.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      console.log("Starting donation:", {
        campaignId: campaign.id,
        amount: numericAmount,
        donorName,
        donorEmail,
        donorPhone,
      });

      const response = await initiateDonation({
        campaignId: campaign.id,
        amount: numericAmount,
        donorName,
        donorEmail,
        donorPhone,
      });

      console.log("Donation API response:", response);

      if (!response) {
        throw new Error("The server returned an empty response.");
      }

      if (!response.payment_url) {
        throw new Error(
          response.message ||
            response.error ||
            "Payment URL was not returned by the server.",
        );
      }

      window.location.href = response.payment_url;
    } catch (err) {
      console.error("Donation initiation failed:", err);

      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-[3px] sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}>
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.30)] sm:max-h-[calc(100dvh-2.5rem)]">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HandCoins className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                Make a donation
              </p>

              <p className="truncate text-[11px] text-slate-400">
                Support a humanitarian campaign
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close donation modal"
            className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[0.92fr_1.08fr]">
          <div className="min-h-0 overflow-y-auto border-b border-slate-200 md:border-b-0 md:border-r">
            <DonationCampaignSummary campaign={campaign} />
          </div>

          <div className="min-h-0 overflow-y-auto">
            <DonationAmountForm
              amount={amount}
              setAmount={handleAmountChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white">
          <DonationTrustBar />
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
