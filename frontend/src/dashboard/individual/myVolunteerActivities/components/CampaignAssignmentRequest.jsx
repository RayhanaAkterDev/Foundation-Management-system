import React from 'react';
import { Clock3, MapPin, CalendarDays, XCircle, CheckCircle2 } from 'lucide-react';
import { formatDate, getCampaignLocation } from '../utils/volunteerHelpers';
const CampaignAssignmentRequest = ({
    assignment,
    actionLoading,
    onAccept,
    onReject,
}) => {
    const campaign = assignment?.campaign;
    const isLoading = actionLoading === assignment?.id;

    return (
        <div className="overflow-hidden border border-[#344150] bg-[#151C25] transition-colors hover:border-[#536173]">
            <div className="border-b border-[#29323E] bg-[#19232E] px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#788595]">
                            Campaign Assignment
                        </p>

                        <h3 className="font-sans! text-[17px] font-semibold! leading-7 text-[#EEF1F5]!">
                            {campaign?.title || 'Untitled campaign'}
                        </h3>
                    </div>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-sm border border-[#72552B] bg-[#2B2318] px-3 py-1.5 text-xs font-semibold text-[#D8B47B]">
                        <Clock3 className="h-3.5 w-3.5" />
                        Pending Response
                    </span>
                </div>
            </div>

            <div className="grid gap-6 px-5 py-6 sm:grid-cols-2 sm:px-7 xl:grid-cols-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#303A47] bg-[#202B37] text-[#8792A1]">
                        <MapPin className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-medium! text-[#788595]">
                            Location
                        </p>

                        <p className="mt-1 text-sm font-medium! text-[#CDD5DF]">
                            {getCampaignLocation(campaign)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#303A47] bg-[#202B37] text-[#8792A1]">
                        <CalendarDays className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-xs font-medium! text-[#788595]">
                            Assigned
                        </p>

                        <p className="mt-1 text-sm font-medium! text-[#CDD5DF]">
                            {formatDate(assignment?.assigned_at)}
                        </p>
                    </div>
                </div>

                {assignment?.assignment_note && (
                    <div className="sm:col-span-2 lg:col-span-1">
                        <p className="text-xs font-medium! text-[#788595]">
                            Assignment Note
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#AAB3BF]">
                            {assignment.assignment_note}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 border-t border-[#303A47] bg-[#111821] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onReject(assignment)}
                    className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#6D373B] hover:bg-[#321D22] hover:text-[#E7A1A5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <XCircle className="mr-2 h-4 w-4" />

                    {isLoading ? 'Processing...' : 'Decline'}
                </button>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onAccept(assignment)}
                    className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#526173] bg-[#D7DEE7] px-5 text-sm font-semibold !text-[#111821] transition hover:bg-[#F0F3F7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />

                    {isLoading ? 'Processing...' : 'Accept Assignment'}
                </button>
            </div>
        </div>
    );
};


export default CampaignAssignmentRequest;
