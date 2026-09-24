import React from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  FileText,
  Hash,
  Mail,
  MapPin,
  Phone,
  Tag,
  UserRound,
  Building2,
  Clock3,
  ShieldCheck,
  X,
  WalletCards,
} from "lucide-react";

import StatusBadge from "@/components/dashboard/StatusBadge";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatAmount = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "৳0";
  }

  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPaymentMethod = (value) => {
  if (!value) return "—";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatStatus = (value) => {
  if (!value) return "—";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

/* -------------------------------------------------------------------------- */
/* Main Modal                                                                 */
/* -------------------------------------------------------------------------- */

const DonationDetailsModal = ({ type, data, donation, onClose }) => {
  const isDonation = type === "donation";
  const isDonor = type === "donor";
  const isCampaign = type === "campaign";

  if (!data && !donation) {
    return null;
  }

  const title = isDonation
    ? "Donation details"
    : isDonor
      ? "User details"
      : "Campaign details";

  const eyebrow = isDonation
    ? "Donation record"
    : isDonor
      ? "Donor account"
      : "Campaign record";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <div className="flex max-h-[90vh] w-full max-w-195 flex-col overflow-hidden bg-white shadow-[0_30px_100px_rgba(15,23,42,0.25)]">
        {/* ---------------------------------------------------------------- */}
        {/* Modal header                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>

            <h2 className="mt-1 font-jost text-[23px] font-semibold tracking-tight text-text">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-text">
            <X size={18} strokeWidth={1.7} />
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Modal body                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div className="min-h-0 overflow-y-auto">
          {isDonation && <DonationView donation={donation || data} />}

          {isDonor && <UserView user={data} />}

          {isCampaign && <CampaignView campaign={data} />}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* DONATION                                                                  */
/* ========================================================================= */

const DonationView = ({ donation }) => {
  const donor = donation?.user || donation?.donor || null;
  const campaign = donation?.campaign || null;

  const donorName =
    donor?.name || donation?.donor_name || donation?.donorName || "Guest donor";

  const donorEmail =
    donor?.email || donation?.donor_email || donation?.donorEmail || null;

  const donorPhone =
    donor?.phone || donation?.donor_phone || donation?.donorPhone || null;

  const campaignTitle =
    campaign?.title ||
    campaign?.name ||
    donation?.campaign_title ||
    donation?.campaignTitle ||
    "Campaign unavailable";

  const campaignCategory =
    campaign?.category || donation?.campaign_category || null;

  const campaignLocation =
    campaign?.location ||
    campaign?.district ||
    campaign?.address ||
    donation?.campaign_location ||
    null;

  const organization =
    campaign?.organization?.name ||
    campaign?.organization_name ||
    donation?.organization_name ||
    null;

  const transactionId =
    donation?.transaction_id ||
    donation?.transactionId ||
    donation?.tran_id ||
    donation?.transaction ||
    null;

  const paymentMethod =
    donation?.payment_method || donation?.paymentMethod || null;

  const donationStatus =
    donation?.status ||
    donation?.payment_status ||
    donation?.paymentStatus ||
    null;

  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* Donation amount banner                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="bg-primary px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Contribution amount
            </p>

            <p className="mt-2 font-jost text-[42px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[48px]">
              {formatAmount(donation?.amount)}
            </p>
          </div>

          {donationStatus && (
            <div className="self-start sm:self-auto">
              <StatusBadge status={donationStatus} />
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Donor                                                             */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle>Donor</SectionTitle>

        <div className="mt-4 border border-slate-200">
          <div className="flex items-center gap-4 px-5 py-5">
            <Avatar name={donorName} icon={UserRound} />

            <div className="min-w-0">
              <p className="font-jost text-lg font-semibold text-text">
                {donorName}
              </p>

              <p className="mt-0.5 text-xs text-text-secondary">
                {donorEmail || "Guest donor"}
              </p>
            </div>
          </div>

          <div className="grid border-t border-slate-200 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={donorEmail} />

            <InfoRow icon={Phone} label="Phone" value={donorPhone} />

            <InfoRow
              icon={ShieldCheck}
              label="Donor type"
              value={
                donor?.id || donation?.user_id || donation?.donor_id
                  ? "Registered donor"
                  : "Guest donor"
              }
            />

            <InfoRow
              icon={Hash}
              label="User ID"
              value={
                donor?.id
                  ? `#${donor.id}`
                  : donation?.user_id
                    ? `#${donation.user_id}`
                    : "—"
              }
            />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Campaign                                                         */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle className="mt-8">Campaign</SectionTitle>

        <div className="mt-4 border border-slate-200">
          <div className="px-5 py-5">
            <p className="font-jost text-lg font-semibold text-text">
              {campaignTitle}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary">
              {campaignCategory && (
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={13} />
                  {campaignCategory}
                </span>
              )}

              {campaignLocation && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />
                  {campaignLocation}
                </span>
              )}

              {organization && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={13} />
                  {organization}
                </span>
              )}
            </div>
          </div>

          <div className="grid border-t border-slate-200 sm:grid-cols-2">
            <InfoRow
              icon={Hash}
              label="Campaign ID"
              value={
                campaign?.id
                  ? `#${campaign.id}`
                  : donation?.campaign_id
                    ? `#${donation.campaign_id}`
                    : "—"
              }
            />

            <InfoRow icon={Tag} label="Category" value={campaignCategory} />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Payment                                                          */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle className="mt-8">Payment information</SectionTitle>

        <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
          <InfoRow
            icon={WalletCards}
            label="Payment method"
            value={formatPaymentMethod(paymentMethod)}
          />

          <InfoRow
            icon={CreditCard}
            label="Transaction ID"
            value={transactionId}
          />

          <InfoRow
            icon={CircleDollarSign}
            label="Amount"
            value={formatAmount(donation?.amount)}
            emphasis
          />

          <InfoRow
            icon={CheckCircle2}
            label="Payment status"
            value={
              donationStatus ? <StatusBadge status={donationStatus} /> : "—"
            }
          />

          {donation?.currency && (
            <InfoRow
              icon={CircleDollarSign}
              label="Currency"
              value={String(donation.currency).toUpperCase()}
            />
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Donation record                                                  */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle className="mt-8">Donation record</SectionTitle>

        <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
          <InfoRow
            icon={Hash}
            label="Donation ID"
            value={donation?.id ? `#${donation.id}` : "—"}
          />

          <InfoRow
            icon={CalendarDays}
            label="Created"
            value={formatDateTime(donation?.created_at || donation?.createdAt)}
          />

          {donation?.updated_at && (
            <InfoRow
              icon={Clock3}
              label="Last updated"
              value={formatDateTime(donation.updated_at)}
            />
          )}

          {donation?.status && (
            <InfoRow
              icon={ShieldCheck}
              label="Record status"
              value={<StatusBadge status={donation.status} />}
            />
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Note                                                              */}
        {/* ---------------------------------------------------------------- */}

        {donation?.note && (
          <>
            <SectionTitle className="mt-8">Donor note</SectionTitle>

            <div className="mt-4 border border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex gap-3">
                <FileText size={16} className="mt-0.5 shrink-0 text-primary" />

                <p className="text-sm leading-6 text-text-secondary">
                  {donation.note}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* USER / DONOR                                                              */
/* ========================================================================= */

const UserView = ({ user }) => {
  const name = user?.name || "Unnamed user";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* User identity                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="bg-primary px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-white/10 font-jost text-xl font-semibold text-white">
            {initials || <UserRound size={25} />}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              User profile
            </p>

            <h3 className="mt-1 font-jost text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
              {name}
            </h3>

            {user?.email && (
              <p className="mt-1 truncate text-xs text-white/70">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Account information                                              */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle>Account information</SectionTitle>

        <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
          <InfoRow
            icon={Hash}
            label="User ID"
            value={user?.id ? `#${user.id}` : "—"}
          />

          <InfoRow icon={UserRound} label="Full name" value={user?.name} />

          <InfoRow icon={Mail} label="Email" value={user?.email} />

          <InfoRow icon={Phone} label="Phone" value={user?.phone} />

          <InfoRow
            icon={ShieldCheck}
            label="Role"
            value={formatStatus(user?.role)}
          />

          <InfoRow
            icon={CheckCircle2}
            label="Account status"
            value={user?.status ? <StatusBadge status={user.status} /> : "—"}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Verification                                                      */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle className="mt-8">Verification</SectionTitle>

        <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
          <InfoRow
            icon={Mail}
            label="Email verification"
            value={
              user?.email_verified_at ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <CheckCircle2 size={15} />
                  Verified
                </span>
              ) : (
                <span className="font-medium text-amber-700">Unverified</span>
              )
            }
          />

          <InfoRow
            icon={ShieldCheck}
            label="Verification method"
            value={
              user?.verification_method
                ? formatStatus(user.verification_method)
                : "—"
            }
          />

          <InfoRow
            icon={CalendarDays}
            label="Verified on"
            value={formatDateTime(user?.email_verified_at)}
          />

          <InfoRow
            icon={CalendarDays}
            label="Joined"
            value={formatDateTime(user?.created_at)}
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Additional details                                               */}
        {/* ---------------------------------------------------------------- */}

        {(user?.address || user?.district || user?.updated_at) && (
          <>
            <SectionTitle className="mt-8">Additional details</SectionTitle>

            <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
              {user?.address && (
                <InfoRow icon={MapPin} label="Address" value={user.address} />
              )}

              {user?.district && (
                <InfoRow icon={MapPin} label="District" value={user.district} />
              )}

              {user?.updated_at && (
                <InfoRow
                  icon={Clock3}
                  label="Last updated"
                  value={formatDateTime(user.updated_at)}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* CAMPAIGN                                                                  */
/* ========================================================================= */

const CampaignView = ({ campaign }) => {
  const title = campaign?.title || campaign?.name || "Untitled campaign";

  const goal =
    campaign?.goal_amount ?? campaign?.target_amount ?? campaign?.goal ?? null;

  const raised =
    campaign?.raised_amount ??
    campaign?.total_raised ??
    campaign?.raised ??
    null;

  const organization =
    campaign?.organization?.name ||
    campaign?.organization_name ||
    campaign?.organizationName ||
    null;

  const location =
    campaign?.location || campaign?.district || campaign?.address || null;

  const progress =
    goal != null && Number(goal) > 0 && raised != null
      ? Math.min((Number(raised) / Number(goal)) * 100, 100)
      : null;

  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* Campaign identity                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="bg-primary px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Campaign
            </p>

            <h3 className="mt-1.5 font-jost text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[29px]">
              {title}
            </h3>

            {organization && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                <Building2 size={13} />
                {organization}
              </p>
            )}
          </div>

          {campaign?.status && (
            <div className="shrink-0">
              <StatusBadge status={campaign.status} />
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {/* ---------------------------------------------------------------- */}
        {/* Funding                                                           */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle>Funding</SectionTitle>

        <div className="mt-4 border border-slate-200">
          <div className="grid sm:grid-cols-3">
            <Metric
              label="Goal"
              value={goal != null ? formatAmount(goal) : "—"}
            />

            <Metric
              label="Raised"
              value={raised != null ? formatAmount(raised) : "—"}
            />

            <Metric
              label="Progress"
              value={progress != null ? `${Math.round(progress)}%` : "—"}
            />
          </div>

          {progress != null && (
            <div className="border-t border-slate-200 px-5 py-5">
              <div className="h-2 overflow-hidden bg-slate-100">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Campaign information                                             */}
        {/* ---------------------------------------------------------------- */}

        <SectionTitle className="mt-8">Campaign information</SectionTitle>

        <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
          <InfoRow
            icon={Hash}
            label="Campaign ID"
            value={campaign?.id ? `#${campaign.id}` : "—"}
          />

          <InfoRow icon={Tag} label="Category" value={campaign?.category} />

          <InfoRow icon={Building2} label="Organization" value={organization} />

          <InfoRow icon={MapPin} label="Location" value={location} />

          <InfoRow
            icon={ShieldCheck}
            label="Status"
            value={
              campaign?.status ? <StatusBadge status={campaign.status} /> : "—"
            }
          />

          <InfoRow
            icon={CalendarDays}
            label="Created"
            value={formatDateTime(campaign?.created_at)}
          />

          {campaign?.updated_at && (
            <InfoRow
              icon={Clock3}
              label="Last updated"
              value={formatDateTime(campaign.updated_at)}
            />
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Description                                                       */}
        {/* ---------------------------------------------------------------- */}

        {campaign?.description && (
          <>
            <SectionTitle className="mt-8">Description</SectionTitle>

            <div className="mt-4 border border-slate-200 px-5 py-5">
              <p className="whitespace-pre-line text-sm leading-7 text-text-secondary">
                {campaign.description}
              </p>
            </div>
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Campaign timeline                                                */}
        {/* ---------------------------------------------------------------- */}

        {(campaign?.start_date || campaign?.end_date) && (
          <>
            <SectionTitle className="mt-8">Campaign timeline</SectionTitle>

            <div className="mt-4 grid border-y border-slate-200 sm:grid-cols-2">
              <InfoRow
                icon={CalendarDays}
                label="Start date"
                value={formatDate(campaign.start_date)}
              />

              <InfoRow
                icon={CalendarDays}
                label="End date"
                value={formatDate(campaign.end_date)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* Shared UI                                                                 */
/* ========================================================================= */

const SectionTitle = ({ children, className = "" }) => {
  return (
    <p
      className={`text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 ${className}`}>
      {children}
    </p>
  );
};

const InfoRow = ({ icon: Icon, label, value, emphasis = false }) => {
  return (
    <div className="flex min-w-0 gap-3 border-b border-slate-200 px-1 py-4.5 last:border-b-0 sm:even:border-l sm:even:pl-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-slate-50 text-slate-500">
        <Icon size={15} strokeWidth={1.7} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
          {label}
        </p>

        <div
          className={`mt-1.5 wrap-break-word ${
            emphasis
              ? "text-base font-semibold text-text"
              : "text-sm font-medium text-text"
          }`}>
          {value !== null && value !== undefined && value !== "" ? value : "—"}
        </div>
      </div>
    </div>
  );
};

const Avatar = ({ name, icon: Icon }) => {
  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 font-jost text-sm font-semibold text-primary">
      {initials || <Icon size={19} />}
    </div>
  );
};

const Metric = ({ label, value }) => {
  return (
    <div className="border-b border-slate-200 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 font-jost text-xl font-semibold tracking-tight text-text">
        {value}
      </p>
    </div>
  );
};

export default DonationDetailsModal;
