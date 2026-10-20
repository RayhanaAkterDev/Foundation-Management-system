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
        <div className="overflow-hidden rounded-none border border-[#29323E] bg-[#0E1219] shadow-sm">
            <div className="border-b border-[#252D38] px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#788595]">
                            Campaign Assignment
                        </p>

                        <h3 className="text-lg font-semibold leading-7 text-[#EEF1F5]">
                            {campaign?.title || 'Untitled campaign'}
                        </h3>
                    </div>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-sm border border-[#72552B] bg-[#2B2318] px-3 py-1.5 text-xs font-semibold text-[#D8B47B]">
                        <Clock3 className="h-3.5 w-3.5" />
                        Pending Response
                    </span>
                </div>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-[#1A222D] text-[#8792A1]">
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
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-[#1A222D] text-[#8792A1]">
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

            <div className="flex flex-col gap-2 border-t border-[#252D38] bg-[#1A222D] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
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
                    className="inline-flex min-h-10 items-center justify-center rounded-none bg-[#0f766e] px-5 text-sm font-semibold text-white! transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" />

                    {isLoading ? 'Processing...' : 'Accept Assignment'}
                </button>
            </div>
        </div>
    );
};


export default CampaignAssignmentRequest;
