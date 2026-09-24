import {
  Activity,
  ArrowUpRight,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
  Wallet,
  ChevronRight,
} from "lucide-react";

import UrgencyBadge from "./UrgencyBadge";

const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return "Not specified";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return String(amount);
  }

  return `৳${numericAmount.toLocaleString("en-BD")}`;
};

const MetaItem = ({ icon: Icon, label, value, highlight = false }) => (
  <div className="min-w-0">
    <div className="flex items-center gap-2">
      {Icon && (
        <Icon
          className="h-3.5 w-3.5 shrink-0 text-[#82918e]"
          strokeWidth={1.7}
        />
      )}

      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#899692]">
        {label}
      </span>
    </div>

    <p
      className={`mt-2 truncate text-[12px] font-semibold ${
        highlight ? "text-primary" : "text-[#263b40]"
      }`}>
      {value}
    </p>
  </div>
);

const PriorityQueue = ({ pending, counts, onViewCase, onRespond }) => {
  if (!pending) {
    return null;
  }

  const pendingCount = Number(counts?.pending) || 0;

  return (
    <section className="mt-16">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-primary" strokeWidth={1.8} />

            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
              Operations
            </span>
          </div>

          <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-[#142d33]">
            Priority queue
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#7d8c89]">
          <span className="font-semibold text-[#354c50]">{pendingCount}</span>

          <span>
            {pendingCount === 1 ? "request" : "requests"} awaiting response
          </span>
        </div>
      </header>

      {/* =========================================================
          CASE
      ========================================================== */}
      <article className="relative overflow-hidden bg-white">
        {/* top rule */}
        <div className="h-[3px] w-full bg-[#173f3d]" />

        {/* =======================================================
            CASE HEADER
        ======================================================== */}
        <div className="flex flex-col border-b border-[#e5ebe9] sm:flex-row sm:items-stretch sm:justify-between">
          <div className="flex items-center gap-4 px-5 py-5 sm:px-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#173f3d]">
              <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-white">
                01
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#354c50]">
                  Help request
                </span>

                <span className="h-1 w-1 bg-[#c3cdca]" />

                <span className="text-[10px] text-[#8b9996]">
                  Pending response
                </span>
              </div>

              <p className="mt-1 text-[10px] text-[#9aa6a3]">
                Case requires organizational action
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#e5ebe9] px-5 py-4 sm:border-l sm:border-t-0 sm:px-8">
            <Clock3 className="h-4 w-4 text-[#9a8350]" strokeWidth={1.7} />

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9a9990]">
                Waiting
              </p>

              <p className="mt-1 text-[11px] font-semibold text-[#526366]">
                {pending.assignmentAge || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            MAIN CASE CONTENT
        ======================================================== */}
        <div className="px-5 pb-0 pt-8 sm:px-8 sm:pt-10 lg:px-12">
          {/* category */}
          <div className="flex flex-wrap items-center gap-3">
            <UrgencyBadge urgency={pending.urgency} />

            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#7c8b88]">
              {pending.category || "General assistance"}
            </span>
          </div>

          {/* title */}
          <h3 className="mt-5 max-w-[900px] text-[32px] font-semibold leading-[1.08] tracking-[-0.05em] text-[#132d33] sm:text-[42px] lg:text-[48px]">
            {pending.title || "Untitled help request"}
          </h3>

          {/* description */}
          <p className="mt-6 max-w-[760px] text-[13px] leading-7 text-[#687976]">
            {pending.description || "No description provided."}
          </p>

          {/* =====================================================
              INFORMATION STRIP
          ====================================================== */}
          <div className="mt-10 grid border-y border-[#e1e9e6] sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-b border-[#e1e9e6] px-0 py-5 sm:border-r sm:px-5 lg:border-b-0 lg:pl-0">
              <MetaItem
                icon={UserRound}
                label="Requester"
                value={pending.individual || "Not specified"}
              />
            </div>

            <div className="border-b border-[#e1e9e6] py-5 sm:border-r sm:px-5 lg:border-b-0">
              <MetaItem
                icon={MapPin}
                label="Location"
                value={pending.location || "Not specified"}
              />
            </div>

            <div className="border-b border-[#e1e9e6] py-5 sm:border-r sm:px-5 lg:border-b-0">
              <MetaItem
                label="Support needed"
                value={pending.supportType || "Not specified"}
              />
            </div>

            <div className="py-5 sm:px-5 lg:pr-0">
              <MetaItem
                icon={Wallet}
                label="Amount needed"
                value={formatAmount(pending.amountNeeded)}
                highlight
              />
            </div>
          </div>

          {/* =====================================================
              BOTTOM ACTION AREA
          ====================================================== */}
          <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            {/* status */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center bg-[#f4f7f6]">
                <span className="h-2 w-2 rounded-full bg-[#c59a3d]" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#806d3d]">
                  Response required
                </p>

                <p className="mt-1 text-[10px] text-[#8b9895]">
                  Review this request before committing support.
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={onViewCase}
                className="group flex h-11 items-center justify-center gap-3 border border-[#ccd9d5] bg-white px-5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#53676a] transition-all hover:border-[#9eb9b2] hover:text-[#193d3d]">
                View full case
                <ChevronRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                onClick={onRespond}
                className="group flex h-11 items-center justify-center gap-4 bg-primary px-6 text-[10px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-primary-hover">
                Respond to request
                <span className="flex h-6 w-6 items-center justify-center bg-white/10">
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* =======================================================
            SUBTLE FOOTER LINE
        ======================================================== */}
        <div className="flex items-center justify-between border-t border-[#edf1f0] bg-[#fafcfb] px-5 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-[#81928e]" strokeWidth={1.7} />

            <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#8b9996]">
              Verified humanitarian request
            </span>
          </div>

          <span className="hidden text-[8px] uppercase tracking-[0.1em] text-[#a0aaa7] sm:block">
            Organization review
          </span>
        </div>
      </article>
    </section>
  );
};

export default PriorityQueue;
