import React from "react";

import { CheckCircle2, LockKeyhole } from "lucide-react";

const DonationTrustBar = () => {
  return (
    <div className="grid grid-cols-1 border-t border-slate-200 bg-white sm:grid-cols-2">
      <div className="flex items-center gap-3 px-6 py-3.5 sm:px-7">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
        </div>

        <div>
          <p className="text-[11px] font-semibold text-slate-800">
            Account information
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
            Your registered donor details are used automatically.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-3.5 sm:border-l sm:border-t-0 sm:px-7">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <LockKeyhole className="h-4 w-4" strokeWidth={1.9} />
        </div>

        <div>
          <p className="text-[11px] font-semibold text-slate-800">
            Secure payment
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
            Payment is completed securely through SSLCOMMERZ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationTrustBar;
