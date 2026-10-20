import React from 'react';
import { MapPin, CalendarDays, PlayCircle, CheckCircle2, LogOut, Clock3 } from 'lucide-react';
import { formatDate, getCampaignLocation } from '../utils/volunteerHelpers';
import AssignmentStatusBadge from './AssignmentStatusBadge';
export default function CurrentActivities({ assignments, actionLoading, onStart, onComplete, onWithdraw }) {
return (
                    
                        <section className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#EEF1F5]">
                                    Current Activities
                                </h2>

                                <p className="mt-1 text-sm text-[#8792A1]">
                                    Campaign assignments you have accepted or
                                    started.
                                </p>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                {assignments.map((assignment) => {
                                    const campaign = assignment?.campaign;
                                    const isLoading =
                                        actionLoading === assignment?.id;

                                    

                                    return (
                                        <div
                                            key={assignment.id}
                                            className="rounded-none border border-[#29323E] bg-[#0E1219] p-5 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#788595]">
                                                        Active Campaign
                                                    </p>

                                                    <h3 className="mt-1 text-base font-semibold leading-6 text-[#EEF1F5]">
                                                        {campaign?.title ||
                                                            'Untitled campaign'}
                                                    </h3>
                                                </div>

                                                <AssignmentStatusBadge status={assignment?.status} />
                                            </div>

                                            <div className="mt-5 space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-[#AAB3BF]">
                                                    <MapPin className="h-4 w-4 text-[#788595]" />

                                                    {getCampaignLocation(campaign)}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-[#AAB3BF]">
                                                    <CalendarDays className="h-4 w-4 text-[#788595]" />
                                                    Assigned{' '}
                                                    {formatDate(
                                                        assignment?.assigned_at,
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-wrap gap-2 border-t border-[#252D38] pt-4">
                                                {assignment?.status ===
                                                    'accepted' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() =>
                                                                onStart(
                                                                    assignment,
                                                                )
                                                            }
                                                            className="inline-flex min-h-10 items-center justify-center rounded-none bg-[#0f766e] px-4 text-sm font-semibold text-white! transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <PlayCircle className="mr-2 h-4 w-4" />

                                                            {isLoading
                                                                ? 'Processing...'
                                                                : 'Start Activity'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() =>
                                                                onWithdraw(
                                                                    assignment,
                                                                )
                                                            }
                                                            className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#72552B] hover:bg-[#2B2318] hover:text-[#D8B47B] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <LogOut className="mr-2 h-4 w-4" />

                                                            {isLoading
                                                                ? 'Processing...'
                                                                : 'Request Withdrawal'}
                                                        </button>
                                                    </>
                                                )}

                                                {assignment?.status ===
                                                    'in_progress' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() =>
                                                                onComplete(
                                                                    assignment,
                                                                )
                                                            }
                                                            className="inline-flex min-h-10 items-center justify-center rounded-none bg-emerald-600 px-4 text-sm font-semibold text-white! transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <CheckCircle2 className="mr-2 h-4 w-4" />

                                                            {isLoading
                                                                ? 'Processing...'
                                                                : 'Mark Completed'}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() =>
                                                                onWithdraw(
                                                                    assignment,
                                                                )
                                                            }
                                                            className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#72552B] hover:bg-[#2B2318] hover:text-[#D8B47B] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <LogOut className="mr-2 h-4 w-4" />

                                                            {isLoading
                                                                ? 'Processing...'
                                                                : 'Request Withdrawal'}
                                                        </button>
                                                    </>
                                                )}

                                                {assignment?.status ===
                                                    'withdrawal_requested' && (
                                                    <div className="flex w-full items-center gap-2 rounded-none border border-[#72552B] bg-[#2B2318] px-4 py-3 text-sm font-medium! text-[#D8B47B]">
                                                        <Clock3 className="h-4 w-4 shrink-0" />
                                                        Your withdrawal request
                                                        is awaiting admin
                                                        review.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

);
}
