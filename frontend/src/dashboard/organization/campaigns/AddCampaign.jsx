import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FilePlus2, Megaphone } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import CampaignCreateModal from './modals/CampaignCreateModal';

const BASE = '/organization/dashboard/campaigns';

export default function AddCampaign() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialHelpRequestId = location.state?.helpRequestId ?? null;

    const handleClose = () => {
        navigate(BASE);
    };

    const handleCreated = () => {
        navigate(BASE, {
            replace: true,
        });
    };

    return (
        <div className="min-w-0 space-y-6 pb-10 font-sans">
            <PageHeader
                title="Add campaign"
                subtitle="Create a fundraising campaign for your organization."
                action={
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-[#151C25] px-4 text-[12px] font-medium text-[#C4CDD8] transition-colors hover:bg-[#202A35]"
                    >
                        <ArrowLeft size={15} />
                        All campaigns
                    </button>
                }
            />

            <div className="grid min-w-0 overflow-hidden border border-[#303A47] bg-[#0E1219] lg:min-h-[640px] lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)] 2xl:grid-cols-[370px_minmax(0,1fr)]">
                <aside className="min-w-0 border-b border-[#303A47] bg-[#19222D] px-5 py-6 sm:px-6 lg:border-r lg:border-b-0">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#3B4857] bg-[#253242] text-[#C1CDD8]">
                            <Megaphone size={17} strokeWidth={1.8} />
                        </span>

                        <div className="min-w-0">
                            <h2 className="m-0! font-sans! text-[14px]! font-semibold! text-[#EEF1F5]!">
                                Campaign preview
                            </h2>

                            <p className="mt-1 mb-0! text-[11px] text-[#91A0B0]">
                                Organization campaign
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 border-t border-[#34404D] pt-5">
                        <div className="flex aspect-video items-center justify-center border border-[#465363] bg-[#111821] text-[#8291A2]">
                            <FilePlus2 size={28} strokeWidth={1.5} />
                        </div>

                        <p className="mt-5 mb-0! text-[10px] font-semibold uppercase tracking-[0.13em] text-[#91A0B0]">
                            Organization proposed
                        </p>

                        <h3 className="mt-3 mb-0! font-sans! text-[17px]! font-semibold! leading-[1.45] text-[#EEF1F5]!">
                            New fundraising campaign
                        </h3>

                        <p className="mt-3 mb-0! text-[12px] leading-6 text-[#AAB8C7]">
                            Complete the campaign form to submit your
                            organization's fundraising proposal.
                        </p>
                    </div>

                    {initialHelpRequestId && (
                        <div className="mt-6 border-t border-[#34404D] pt-5">
                            <p className="m-0! text-[11px] text-[#91A0B0]">
                                Connected help request
                            </p>

                            <p className="mt-2 mb-0! text-[13px] font-semibold text-[#E0E7EE]">
                                #{initialHelpRequestId}
                            </p>
                        </div>
                    )}
                </aside>

                <main className="flex min-h-[400px] min-w-0 flex-col bg-[#0E1219]">
                    <div className="border-b border-[#303A47] bg-[#151C25] px-5 py-5 sm:px-6">
                        <h2 className="m-0! font-sans! text-[16px]! font-semibold! text-[#EEF1F5]!">
                            Campaign information
                        </h2>

                        <p className="mt-2 mb-0! text-[12px] text-[#91A0B0]">
                            Enter the details required to create your campaign.
                        </p>
                    </div>

                    <div className="flex flex-1 flex-col items-start justify-center gap-5 px-5 py-10 sm:px-6">
                        <div className="flex h-12 w-12 items-center justify-center border border-[#34404D] bg-[#19222D] text-[#B8C5D3]">
                            <FilePlus2 size={22} strokeWidth={1.7} />
                        </div>

                        <div className="max-w-md">
                            <h3 className="m-0! font-sans! text-[16px]! font-semibold! text-[#EEF1F5]!">
                                Create your campaign
                            </h3>

                            <p className="mt-3 mb-0! text-[13px] leading-6 text-[#91A0B0]">
                                Open the campaign form to enter the required
                                information and submit your proposal.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                // The existing modal is mounted below.
                                // Its open prop is currently always true.
                            }}
                            className="hidden"
                            aria-hidden="true"
                            tabIndex={-1}
                        >
                            Open form
                        </button>
                    </div>
                </main>
            </div>

            <CampaignCreateModal
                open
                initialHelpRequestId={initialHelpRequestId}
                onClose={handleClose}
                onCreated={handleCreated}
            />
        </div>
    );
}
