import React from 'react';
import {
    ArrowRight,
    Check,
    Clock3,
    LogOut,
    RotateCcw,
    X,
    UsersRound,
    ShieldAlert,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

import {
    volunteerStatusCopy,
    getRequestDirection,
} from '../utils/volunteerHelpers';

const baseButton =
    'inline-flex min-h-10 min-w-0 w-full items-center justify-center gap-2 border px-3 py-2.5 text-center text-[12px] font-semibold leading-5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-4';

const primaryButton = `${baseButton} border-[#526173] bg-[#D7DEE7] !text-[#111821] hover:bg-[#F0F3F7]`;

const secondaryButton = `${baseButton} border-[#35404E] bg-[#1A222D] !text-[#C5CED9] hover:border-[#536173] hover:bg-[#25303D]`;

const quietButton = `${baseButton} border-[#35404E] bg-transparent !text-[#AAB3BF] hover:border-[#6D373B] hover:bg-[#321D22] hover:!text-[#E7A1A5]`;

function StatusLine({ children, tone = 'neutral' }) {
    const tones = {
        neutral: {
            dot: 'bg-[#91A0B0]',
            text: '!text-[#AAB3BF]',
        },
        amber: {
            dot: 'bg-[#D8B47B]',
            text: '!text-[#D8B47B]',
        },
        green: {
            dot: 'bg-[#9AD1AE]',
            text: '!text-[#9AD1AE]',
        },
        red: {
            dot: 'bg-[#E7A1A5]',
            text: '!text-[#E7A1A5]',
        },
    };

    const selectedTone = tones[tone] || tones.neutral;

    return (
        <span
            className={`inline-flex min-w-0 max-w-full items-center gap-2 text-[11px] font-medium leading-5 sm:text-[12px] ${selectedTone.text}`}
        >
            <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${selectedTone.dot}`}
            />
            <span className="min-w-0 break-words">{children}</span>
        </span>
    );
}

function ActionButton({
    children,
    variant = 'secondary',
    loading = false,
    onClick,
}) {
    const buttonClass =
        variant === 'primary'
            ? primaryButton
            : variant === 'danger'
              ? quietButton
              : secondaryButton;

    return (
        <button
            type="button"
            disabled={loading}
            onClick={onClick}
            className={buttonClass}
        >
            {children}
        </button>
    );
}

function MembershipPanel({
    status,
    eyebrow = 'VOLUNTEER ACTIVITIES',
    title,
    description,
    children,
    note,
    variant = 'default',
}) {
    const isWarning = variant === 'warning';

    return (
        <section
            className="w-full min-w-0 overflow-hidden border border-[#303A47] bg-[#10161F]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            {/* HEADER CONTENT */}
            <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
                {/* Identity and status */}
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#364454] bg-[#18212C] text-[#A7B5C5] sm:h-11 sm:w-11">
                            {isWarning ? (
                                <ShieldAlert size={20} strokeWidth={1.6} />
                            ) : (
                                <UsersRound size={20} strokeWidth={1.6} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="break-words text-[9px] font-semibold uppercase tracking-[0.12em] !text-[#8998AA] sm:text-[10px] sm:tracking-[0.14em]">
                                {eyebrow}
                            </p>

                            <p className="mt-1 break-words text-[12px] font-medium leading-5 !text-[#C5CED9] sm:text-[13px]">
                                Volunteer membership
                            </p>
                        </div>
                    </div>

                    {/* Status labels */}
                    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:max-w-[55%] sm:justify-end sm:pt-1">
                        {status}
                    </div>
                </div>

                {/* Main message */}
                <div className="mt-5 min-w-0 sm:mt-7">
                    <h2 className="!m-0 break-words !text-[18px] !font-semibold !leading-[1.45] tracking-[-0.025em] !text-[#E5EAF0] sm:!text-[21px] sm:tracking-[-0.035em] lg:!text-[24px]">
                        {title}
                    </h2>

                    <p className="mt-2.5 max-w-[680px] break-words text-[12px] leading-[1.85] !text-[#9EACBC] sm:text-[13px] sm:leading-[1.9]">
                        {description}
                    </p>

                    {note && (
                        <p className="mt-3 break-words text-[11px] leading-6 !text-[#8998AA] sm:text-[12px]">
                            {note}
                        </p>
                    )}
                </div>
            </div>

            {/* ACTION FOOTER */}
            {children && (
                <div className="min-w-0 border-t border-[#29333F] bg-[#131B25] px-4 py-4 sm:px-6 sm:py-4 lg:px-8">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                        <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] !text-[#718196] sm:text-[10px]">
                            Next step
                        </p>

                        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default function VolunteerStatusPanel({
    volunteer,
    request,
    actionLoading,
    onSendRequest,
    onAcceptRequest,
    onRejectRequest,
    onCancelRequest,
    onRequestReactivation,
    onResign,
}) {
    if (!volunteer) {
        const requestDirection = getRequestDirection(request);
        const pendingRequest = request?.status === 'pending';

        const isOwnApplication =
            pendingRequest && requestDirection === 'application';

        const isAdminInvitation =
            pendingRequest && requestDirection === 'invitation';

        if (isOwnApplication) {
            return (
                <MembershipPanel
                    status={
                        <StatusLine tone="amber">Awaiting approval</StatusLine>
                    }
                    title="Your application is under review"
                    description="Your application has been received and is waiting for approval. Once accepted, you'll be able to participate in volunteer campaigns and activities."
                >
                    <ActionButton
                        variant="danger"
                        loading={actionLoading === 'request-cancel'}
                        onClick={onCancelRequest}
                    >
                        <X size={15} className="shrink-0" />
                        {actionLoading === 'request-cancel'
                            ? 'Cancelling...'
                            : 'Cancel application'}
                    </ActionButton>
                </MembershipPanel>
            );
        }

        if (isAdminInvitation) {
            return (
                <MembershipPanel
                    status={
                        <StatusLine tone="amber">
                            Your response is needed
                        </StatusLine>
                    }
                    title="You've been invited to volunteer"
                    description="An administrator has invited you to join Stand For People. Review the invitation and choose whether you'd like to become a volunteer."
                >
                    <ActionButton
                        loading={actionLoading === 'request-reject'}
                        onClick={onRejectRequest}
                    >
                        <X size={15} className="shrink-0" />
                        {actionLoading === 'request-reject'
                            ? 'Declining...'
                            : 'Decline invitation'}
                    </ActionButton>

                    <ActionButton
                        variant="primary"
                        loading={actionLoading === 'request-accept'}
                        onClick={onAcceptRequest}
                    >
                        <Check size={15} className="shrink-0" />
                        {actionLoading === 'request-accept'
                            ? 'Accepting...'
                            : 'Accept invitation'}
                    </ActionButton>
                </MembershipPanel>
            );
        }

        return (
            <MembershipPanel
                status={<StatusLine>Not enrolled</StatusLine>}
                title="Make a difference as a volunteer"
                description="Join Stand For People to contribute to humanitarian campaigns, support communities in need, and take part in meaningful volunteer activities."
            >
                <ActionButton
                    variant="primary"
                    loading={actionLoading === 'request'}
                    onClick={onSendRequest}
                >
                    {actionLoading === 'request'
                        ? 'Sending...'
                        : 'Join as volunteer'}
                    <ArrowRight size={16} className="shrink-0" />
                </ActionButton>
            </MembershipPanel>
        );
    }

    const status = volunteer?.status || 'inactive';

    const availability =
        volunteer?.availability === 'available' ? 'Available' : 'Unavailable';

    const statusCopy =
        volunteerStatusCopy[status] || volunteerStatusCopy.inactive;

    const isActiveVolunteer = status === 'active';
    const isInactiveVolunteer = status === 'inactive';
    const isSuspendedVolunteer = status === 'suspended';

    const hasPendingReactivationRequest =
        isInactiveVolunteer &&
        request?.status === 'pending' &&
        Number(request?.user_id) === Number(request?.requested_by);

    const description = isInactiveVolunteer
        ? hasPendingReactivationRequest
            ? 'Your reactivation request has been sent to the admin and is awaiting review. You can cancel it while it is pending.'
            : 'Your volunteer membership is currently inactive. You can request admin approval to reactivate your account.'
        : isSuspendedVolunteer
          ? 'Your volunteer account has been suspended. Reactivation is unavailable through self-service.'
          : statusCopy.description;

    return (
        <MembershipPanel
            status={
                <>
                    <StatusBadge status={status} />

                    <StatusLine
                        tone={
                            volunteer?.availability === 'available'
                                ? 'green'
                                : 'amber'
                        }
                    >
                        {availability}
                    </StatusLine>
                </>
            }
            title={statusCopy.title}
            description={description}
            variant={isSuspendedVolunteer ? 'warning' : 'default'}
        >
            {isActiveVolunteer && (
                <ActionButton
                    variant="danger"
                    loading={actionLoading === 'resign'}
                    onClick={onResign}
                >
                    <LogOut size={15} className="shrink-0" />
                    {actionLoading === 'resign'
                        ? 'Resigning...'
                        : 'Resign as volunteer'}
                </ActionButton>
            )}

            {isInactiveVolunteer && !hasPendingReactivationRequest && (
                <ActionButton
                    variant="primary"
                    loading={actionLoading === 'reactivation'}
                    onClick={onRequestReactivation}
                >
                    <RotateCcw size={15} className="shrink-0" />
                    {actionLoading === 'reactivation'
                        ? 'Sending...'
                        : 'Request reactivation'}
                </ActionButton>
            )}

            {isInactiveVolunteer && hasPendingReactivationRequest && (
                <>
                    <span className="flex min-w-0 items-center gap-2 py-2 text-[11px] leading-5 !text-[#D8B47B] sm:mr-2 sm:text-[12px]">
                        <Clock3 size={15} className="shrink-0" />
                        <span className="break-words">
                            Reactivation pending
                        </span>
                    </span>

                    <ActionButton
                        variant="danger"
                        loading={actionLoading === 'request-cancel'}
                        onClick={onCancelRequest}
                    >
                        <X size={15} className="shrink-0" />
                        {actionLoading === 'request-cancel'
                            ? 'Cancelling...'
                            : 'Cancel request'}
                    </ActionButton>
                </>
            )}

            {isSuspendedVolunteer && (
                <span className="flex min-w-0 items-center gap-2 py-2 text-[11px] leading-5 !text-[#E7A1A5] sm:text-[12px]">
                    <X size={15} className="shrink-0" />
                    <span className="break-words">
                        Reactivation unavailable
                    </span>
                </span>
            )}
        </MembershipPanel>
    );
}
