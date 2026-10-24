import React from 'react';
import {
    MapPin,
    CalendarDays,
    PlayCircle,
    CheckCircle2,
    LogOut,
    Clock3,
    ArrowUpRight,
    UsersRound,
} from 'lucide-react';

import { formatDate, getCampaignLocation } from '../utils/volunteerHelpers';

import AssignmentStatusBadge from './AssignmentStatusBadge';

// Original button styles — unchanged.
const buttonBase =
    'inline-flex min-h-10 w-full min-w-0 items-center justify-center gap-2 border px-4 py-2.5 text-center text-[12px] font-semibold leading-5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto';

const primaryButton = `${buttonBase} border-[#526173] bg-[#D7DEE7] !text-[#111821] hover:bg-[#F0F3F7]`;

const secondaryButton = `${buttonBase} border-[#35404E] bg-[#1A222D] !text-[#C5CED9] hover:border-[#536173] hover:bg-[#25303D]`;

function ActionButton({ children, variant = 'secondary', ...props }) {
    return (
        <button
            type="button"
            className={variant === 'primary' ? primaryButton : secondaryButton}
            {...props}
        >
            {children}
        </button>
    );
}

export default function CurrentActivities({
    assignments,
    actionLoading,
    onStart,
    onComplete,
    onWithdraw,
}) {
    return (
        <section
            aria-labelledby="current-activities-heading"
            className="min-w-0 space-y-5 font-sans"
        >
            {/* SECTION HEADING */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                    id="current-activities-heading"
                    className="!m-0 !font-sans !text-[18px] !font-semibold !leading-7 !tracking-[-0.02em] !text-[#EEF1F5]"
                >
                    Current activities
                </h2>

                {assignments?.length > 0 && (
                    <span className="text-[12px] text-[#8792A1]">
                        {assignments.length}{' '}
                        {assignments.length === 1
                            ? 'assignment'
                            : 'assignments'}
                    </span>
                )}
            </div>

            {/* ASSIGNMENT LIST */}
            <div className="grid min-w-0 gap-5">
                {assignments?.map((assignment) => {
                    const campaign = assignment?.campaign;
                    const isLoading = actionLoading === assignment?.id;

                    const assignmentStatus = assignment?.status;

                    const hasActions = [
                        'accepted',
                        'in_progress',
                        'withdrawal_requested',
                    ].includes(assignmentStatus);

                    const description =
                        campaign?.shortDescription ||
                        campaign?.short_description ||
                        campaign?.description ||
                        '';

                    return (
                        <article
                            key={assignment.id}
                            className="min-w-0 overflow-hidden border border-[#303A47] bg-[#151C25]"
                        >
                            {/* CAMPAIGN CONTENT */}
                            <div className="px-5 py-6 sm:px-7 sm:py-8">
                                {/* TITLE + STATUS */}
                                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                    <div className="min-w-0 flex-1">
                                        <p className="!font-sans text-[10px] font-semibold uppercase tracking-[0.13em] !text-[#8792A1]">
                                            Campaign assignment
                                        </p>

                                        <h3 className="mt-2.5 break-words !font-sans !text-[17px] !font-semibold !leading-[1.5] !tracking-[-0.02em] !text-[#EEF1F5] sm:!text-[19px]">
                                            {campaign?.title ||
                                                'Untitled campaign'}
                                        </h3>
                                    </div>

                                    <div className="shrink-0 self-start sm:pt-1">
                                        <AssignmentStatusBadge
                                            status={assignmentStatus}
                                        />
                                    </div>
                                </div>

                                {/* CAMPAIGN METADATA */}
                                <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <MapPin
                                            size={15}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-[#8190A2]"
                                            aria-hidden="true"
                                        />

                                        <span className="break-words text-[12px] leading-5 text-[#AAB5C3] sm:text-[13px]">
                                            {getCampaignLocation(campaign) ||
                                                'Not specified'}
                                        </span>
                                    </div>

                                    <div className="flex min-w-0 items-center gap-2">
                                        <CalendarDays
                                            size={15}
                                            strokeWidth={1.7}
                                            className="shrink-0 text-[#8190A2]"
                                            aria-hidden="true"
                                        />

                                        <span className="text-[12px] leading-5 text-[#AAB5C3] sm:text-[13px]">
                                            Assigned{' '}
                                            {formatDate(
                                                assignment?.assigned_at,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* CAMPAIGN DESCRIPTION */}
                                {description && (
                                    <div className="mt-6 border-t border-[#29323E] pt-5">
                                        <p className="!font-sans text-[10px] font-semibold uppercase tracking-[0.12em] !text-[#8792A1]">
                                            About the campaign
                                        </p>

                                        <p className="mt-2.5 max-w-[850px] overflow-hidden break-words !font-sans text-[13px] leading-[1.85] !text-[#A3AFBD] sm:text-[14px] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                                            {description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ACTION AREA */}
                            {hasActions && (
                                <div className="border-t border-[#303A47] bg-[#111821] px-5 py-4 sm:px-7 sm:py-5">
                                    {assignmentStatus === 'accepted' && (
                                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                                            <ActionButton
                                                variant="primary"
                                                disabled={isLoading}
                                                onClick={() =>
                                                    onStart(assignment)
                                                }
                                            >
                                                <PlayCircle
                                                    size={16}
                                                    className="shrink-0"
                                                />

                                                {isLoading
                                                    ? 'Processing...'
                                                    : 'Start activity'}

                                                {!isLoading && (
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="shrink-0"
                                                    />
                                                )}
                                            </ActionButton>

                                            <ActionButton
                                                disabled={isLoading}
                                                onClick={() =>
                                                    onWithdraw(assignment)
                                                }
                                            >
                                                <LogOut
                                                    size={15}
                                                    className="shrink-0"
                                                />

                                                {isLoading
                                                    ? 'Processing...'
                                                    : 'Request withdrawal'}
                                            </ActionButton>
                                        </div>
                                    )}

                                    {assignmentStatus === 'in_progress' && (
                                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                                            <ActionButton
                                                variant="primary"
                                                disabled={isLoading}
                                                onClick={() =>
                                                    onComplete(assignment)
                                                }
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className="shrink-0"
                                                />

                                                {isLoading
                                                    ? 'Processing...'
                                                    : 'Mark completed'}
                                            </ActionButton>

                                            <ActionButton
                                                disabled={isLoading}
                                                onClick={() =>
                                                    onWithdraw(assignment)
                                                }
                                            >
                                                <LogOut
                                                    size={15}
                                                    className="shrink-0"
                                                />

                                                {isLoading
                                                    ? 'Processing...'
                                                    : 'Request withdrawal'}
                                            </ActionButton>
                                        </div>
                                    )}

                                    {assignmentStatus ===
                                        'withdrawal_requested' && (
                                        <div className="flex min-w-0 items-start gap-3">
                                            <Clock3
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#D8B47B]"
                                            />

                                            <div className="min-w-0">
                                                <p className="!font-sans text-[13px] font-semibold !text-[#D8B47B]">
                                                    Withdrawal under review
                                                </p>

                                                <p className="mt-1 text-[12px] leading-6 text-[#AAB3BF]">
                                                    Your withdrawal request is
                                                    awaiting admin review. You
                                                    remain assigned to this
                                                    campaign until a decision is
                                                    made.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}

                {/* EMPTY STATE */}
                {(!assignments || assignments.length === 0) && (
                    <div className="border border-[#303A47] bg-[#151C25] px-5 py-10 text-center sm:px-8">
                        <UsersRound
                            size={20}
                            strokeWidth={1.6}
                            className="mx-auto text-[#8792A1]"
                        />

                        <h3 className="mt-3 !font-sans !text-[15px] !font-semibold !text-[#E5EAF0]">
                            No current activities
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#8792A1]">
                            You don't have any accepted or ongoing campaign
                            assignments right now. Your next assignment will
                            appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
