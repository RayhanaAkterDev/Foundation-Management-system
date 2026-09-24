import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  HandCoins,
  ReceiptText,
  TrendingUp,
} from "lucide-react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

import { getMyDonations } from "./api/donationApi";

const formatAmount = (amount) => {
  const value = Number(amount || 0);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-BD");
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const columns = [
  {
    key: "campaign",
    header: "Campaign",
    render: (val) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-text-primary">{val}</p>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (val) => (
      <span className="whitespace-nowrap font-semibold text-text-primary">
        ৳{formatAmount(val)}
      </span>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (val) => (
      <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
        <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
        {val}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (val) => <StatusBadge status={val} />,
  },
];

const MyDonations = () => {
  const [donations, setDonations] = useState([]);

  const [summary, setSummary] = useState({
    totalDonated: 0,
    donationCount: 0,
    lastDonation: "—",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDonations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyDonations();

        if (!mounted) {
          return;
        }

        const donationData = Array.isArray(response?.donations)
          ? response.donations
          : [];

        setDonations(donationData);

        setSummary({
          totalDonated: Number(response?.summary?.totalDonated || 0),
          donationCount: Number(response?.summary?.donationCount || 0),
          lastDonation: response?.summary?.lastDonation || "—",
        });
      } catch (err) {
        console.error("Failed to load donations:", err);

        if (mounted) {
          setError("Unable to load your donation history. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDonations();

    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    return donations.map((donation) => ({
      id: donation.id,

      campaign:
        donation.campaign?.title || donation.campaign?.name || "Campaign",

      amount: Number(donation.amount || 0),

      date: formatDate(donation.created_at),

      status: donation.status || "completed",
    }));
  }, [donations]);

  const latestDonation = donations[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="My Donations"
        subtitle="See the causes you have supported and the difference your contributions make."
        action={
          <Link
            to="/individual/dashboard/campaigns"
            className="group inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            <HandCoins className="h-4 w-4" />
            Donate Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        }
      />

      {/* Contribution overview */}
      <section className="relative overflow-hidden bg-primary px-6 py-7 text-white md:px-8 md:py-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 right-16 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <CircleDollarSign className="h-4 w-4" />
              Your contribution
            </div>

            <div className="text-3xl font-semibold tracking-tight md:text-4xl">
              ৳{formatAmount(summary.totalDonated)}
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
              Every contribution helps connect resources with people and
              communities who need support.
            </p>
          </div>

          <div className="border-l border-white/15 pl-6 lg:min-w-[190px]">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/60">
              Contributions
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {summary.donationCount}
            </p>

            <p className="mt-1 text-sm text-white/65">completed transactions</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Donated"
          value={`৳${formatAmount(summary.totalDonated)}`}
          icon={HandCoins}
          subtext="all time"
        />

        <StatCard
          label="Donations Made"
          value={summary.donationCount}
          icon={ReceiptText}
          iconColor="bg-blue-50"
          subtext="total transactions"
        />

        <StatCard
          label="Last Donation"
          value={summary.lastDonation}
          icon={TrendingUp}
          iconColor="bg-amber-50"
          subtext="most recent"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Latest contribution */}
      {!loading && !error && latestDonation && (
        <section className="border border-border bg-white">
          <div className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-primary">
                <HandCoins className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  Most recent contribution
                </p>

                <h2 className="mt-1 truncate text-base font-semibold text-text-primary">
                  {latestDonation.campaign?.title ||
                    latestDonation.campaign?.name ||
                    "Campaign"}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {formatDate(latestDonation.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 md:text-right">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-text-secondary">
                  Amount
                </p>
                <p className="mt-1 text-xl font-semibold text-text-primary">
                  ৳{formatAmount(latestDonation.amount)}
                </p>
              </div>

              <StatusBadge status={latestDonation.status || "completed"} />
            </div>
          </div>
        </section>
      )}

      {/* Donation history */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Your giving history
            </p>

            <h2 className="mt-1 text-xl font-semibold text-text-primary">
              Donation History
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              A record of the campaigns and causes you have supported.
            </p>
          </div>

          {!loading && donations.length > 0 && (
            <span className="hidden text-sm text-text-secondary sm:block">
              {donations.length}{" "}
              {donations.length === 1 ? "donation" : "donations"}
            </span>
          )}
        </div>

        <DataTable
          title=""
          columns={columns}
          rows={rows}
          loading={loading}
          empty={{
            icon: HandCoins,
            title: "No donations yet",
            message:
              "Your donation history will appear here once you contribute to a campaign.",
          }}
        />
      </section>
    </div>
  );
};

export default MyDonations;
