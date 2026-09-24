import React from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  HandCoins,
  UserRound,
} from "lucide-react";

const formatAmount = (amount) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatPayment = (payment) => {
  if (!payment) {
    return "Not specified";
  }

  return String(payment)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDonorName = (donation) => {
  return (
    donation?.user?.name ||
    donation?.donor?.name ||
    donation?.donor_name ||
    "Guest donor"
  );
};

const getDonorEmail = (donation) => {
  return (
    donation?.user?.email ||
    donation?.donor?.email ||
    donation?.donor_email ||
    null
  );
};

const getCampaignTitle = (donation) => {
  return (
    donation?.campaign?.title ||
    donation?.campaign?.name ||
    donation?.campaign_title ||
    "Campaign unavailable"
  );
};

const DonationTable = ({
  donations,
  onViewDonation,
  onViewDonor,
  onViewCampaign,
}) => {
  if (!donations.length) {
    return (
      <div className="px-6 py-16 mt-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-text-secondary">
          <HandCoins size={21} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-text">
          No donations found
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-text-secondary">
          Donation records will appear here after contributions are made.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-12 border border-border">
      <table className="w-full min-w-[950px] border-collapse">
        <thead>
          <tr className="border-b border-border bg-background-alt">
            <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Donor
            </th>

            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Campaign
            </th>

            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Amount
            </th>

            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Payment
            </th>

            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Date
            </th>

            <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {donations.map((donation) => {
            const donorName = getDonorName(donation);

            const donorEmail = getDonorEmail(donation);

            const campaignTitle = getCampaignTitle(donation);

            const hasDonor = Boolean(donation?.user?.id || donation?.donor?.id);

            const hasCampaign = Boolean(donation?.campaign?.id);

            return (
              <tr
                key={donation.id}
                className="group border-b border-border last:border-b-0 hover:bg-background-alt bg-background">
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onViewDonor(donation)}
                    className="flex max-w-[240px] items-center gap-3 text-left">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserRound size={16} strokeWidth={1.7} />
                    </span>

                    <span className="min-w-0">
                      <span className="flex items-center gap-1 text-sm font-semibold text-text group-hover:text-primary">
                        <span className="truncate">{donorName}</span>

                        {hasDonor && (
                          <ArrowUpRight
                            size={12}
                            className="shrink-0 opacity-0 transition group-hover:opacity-100"
                          />
                        )}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-text-secondary">
                        {donorEmail || "Guest donation"}
                      </span>
                    </span>
                  </button>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onViewCampaign(donation)}
                    disabled={!hasCampaign}
                    className="group/campaign flex max-w-[250px] items-center gap-2 text-left disabled:cursor-default">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <HandCoins size={14} strokeWidth={1.7} />
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block truncate text-sm font-medium ${
                          hasCampaign
                            ? "text-text group-hover/campaign:text-primary"
                            : "text-text-secondary"
                        }`}>
                        {campaignTitle}
                      </span>

                      {hasCampaign && (
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-text-secondary">
                          Campaign details
                          <ArrowUpRight size={10} />
                        </span>
                      )}
                    </span>
                  </button>
                </td>

                <td className="px-4 py-4">
                  <span className="text-sm font-bold tabular-nums text-text">
                    {formatAmount(donation.amount)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
                    <CreditCard size={14} strokeWidth={1.7} />

                    {formatPayment(
                      donation.payment_method || donation.paymentMethod,
                    )}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-text-secondary">
                    <CalendarDays size={14} strokeWidth={1.7} />

                    {formatDate(donation.created_at)}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDonation(donation)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10">
                    View
                    <ArrowUpRight size={13} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;
