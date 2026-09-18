import React from 'react';

import { ArrowRight, CheckCircle2, Home, XCircle } from 'lucide-react';

import { Link, useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();

    const status = searchParams.get('status') || 'failed';

    const isSuccess = status === 'success';
    const isCancelled = status === 'cancelled';

    const content = isSuccess
        ? {
              icon: CheckCircle2,
              title: 'Donation Successful',
              message:
                  'Thank you for your contribution. Your donation has been successfully recorded.',
              actionLabel: 'View My Donations',
              actionTo: '/individual/dashboard/donations',
          }
        : isCancelled
          ? {
                icon: XCircle,
                title: 'Donation Cancelled',
                message:
                    'Your donation payment was cancelled. No donation was recorded.',
                actionLabel: 'Try Again',
                actionTo: '/campaigns',
            }
          : {
                icon: XCircle,
                title: 'Payment Failed',
                message:
                    'We could not complete your donation payment. No donation was recorded.',
                actionLabel: 'Try Again',
                actionTo: '/campaigns',
            };

    const Icon = content.icon;

    return (
        <main className="min-h-screen bg-[#f6f8fb] px-4 py-16 sm:px-6">
            <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
                <div className="w-full rounded-2xl border border-[#e2e8f0] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef2f6]">
                        <Icon
                            size={42}
                            strokeWidth={1.8}
                            className={
                                isSuccess ? 'text-[#0f766e]' : 'text-[#64748b]'
                            }
                        />
                    </div>

                    <p className="mt-7 text-sm font-medium uppercase tracking-[0.18em] text-[#64748b]">
                        Stand For People
                    </p>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
                        {content.title}
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#64748b]">
                        {content.message}
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            to={content.actionTo}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59]"
                        >
                            {content.actionLabel}
                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-5 text-sm font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
                        >
                            <Home size={17} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PaymentResult;
