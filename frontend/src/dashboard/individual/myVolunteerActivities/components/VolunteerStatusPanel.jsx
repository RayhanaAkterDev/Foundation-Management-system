import React from 'react';
import { UserRound, Clock3, XCircle, CheckCircle2, LogOut } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { volunteerStatusCopy, getRequestDirection } from '../utils/volunteerHelpers';
const VolunteerStatusPanel = ({
    volunteer,
    request,
    actionLoading,
    onSendRequest,
    onAcceptRequest,
    onRejectRequest,
    onCancelRequest,
    onRequestReactivation,
    onResign,
}) => {
    // ===========================================================
    // NO VOLUNTEER PROFILE
    // ===========================================================

    if (!volunteer) {
        const requestDirection = getRequestDirection(request);
        const pendingRequest = request?.status === 'pending';

        const isOwnApplication =
            pendingRequest && requestDirection === 'application';

        const isAdminInvitation =
            pendingRequest && requestDirection === 'invitation';

        return (
            <section className="border border-[#29323E] bg-[#0E1219] p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-[#142B29] text-[#80BFB4]">
                            <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#EEF1F5]">
                                Volunteer with Stand For People
                            </h2>

                            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#8792A1]">
                                Join humanitarian campaigns and contribute your
                                skills to people and communities who need
                                support.
                            </p>
                        </div>
                    </div>

                    {isOwnApplication ? (
                        <div className="flex flex-col gap-2 sm:items-end">
                            <div className="flex w-fit items-center gap-2 border border-[#72552B] bg-[#2B2318] px-4 py-2.5 text-sm font-semibold text-[#D8B47B]">
                                <Clock3 className="h-4 w-4" />
                                Request Pending
                            </div>

                            <button
                                type="button"
                                disabled={actionLoading === 'request-cancel'}
                                onClick={onCancelRequest}
                                className="inline-flex min-h-10 items-center justify-center border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#6D373B] hover:bg-[#321D22] hover:text-[#E7A1A5] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <XCircle className="mr-2 h-4 w-4" />

                                {actionLoading === 'request-cancel'
                                    ? 'Cancelling...'
                                    : 'Cancel Application'}
                            </button>
                        </div>
                    ) : isAdminInvitation ? (
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                disabled={actionLoading === 'request-reject'}
                                onClick={onRejectRequest}
                                className="inline-flex min-h-10 items-center justify-center border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#6D373B] hover:bg-[#321D22] hover:text-[#E7A1A5] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <XCircle className="mr-2 h-4 w-4" />

                                {actionLoading === 'request-reject'
                                    ? 'Declining...'
                                    : 'Decline'}
                            </button>

                            <button
                                type="button"
                                disabled={actionLoading === 'request-accept'}
                                onClick={onAcceptRequest}
                                className="inline-flex min-h-10 items-center justify-center bg-[#0f766e] px-4 text-sm font-semibold text-white! transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />

                                {actionLoading === 'request-accept'
                                    ? 'Accepting...'
                                    : 'Accept Request'}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            disabled={actionLoading === 'request'}
                            onClick={onSendRequest}
                            className="inline-flex min-h-10 w-full items-center justify-center rounded-none bg-[#0f766e] px-5 text-sm font-semibold text-white! transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {actionLoading === 'request'
                                ? 'Sending...'
                                : 'Join As Volunteer'}
                        </button>
                    )}
                </div>

                {isOwnApplication && (
                    <div className="mt-5 border-t border-[#252D38] pt-5">
                        <p className="text-sm leading-6 text-[#8792A1]">
                            Your volunteer application is currently under
                            review. You can cancel the application while it is
                            still pending.
                        </p>
                    </div>
                )}

                {isAdminInvitation && (
                    <div className="mt-5 border-t border-[#252D38] pt-5">
                        <p className="text-sm leading-6 text-[#8792A1]">
                            An administrator has invited you to become a
                            volunteer. Accept the request to join the volunteer
                            program, or decline if you are unavailable.
                        </p>
                    </div>
                )}
            </section>
        );
    }

    // ===========================================================
    // EXISTING VOLUNTEER PROFILE
    // ===========================================================

    const status = volunteer?.status || 'inactive';

    const availability =
        volunteer?.availability === 'available' ? 'Available' : 'Unavailable';

    const statusCopy =
        volunteerStatusCopy[status] || volunteerStatusCopy.inactive;

    const isActiveVolunteer = status === 'active';
    const isInactiveVolunteer = status === 'inactive';
    const isSuspendedVolunteer = status === 'suspended';

    // A reactivation request is a pending request created by the
    // volunteer themselves.
    const hasPendingReactivationRequest =
        isInactiveVolunteer &&
        request?.status === 'pending' &&
        Number(request?.user_id) === Number(request?.requested_by);

    return (
        <section className="overflow-hidden rounded-none border border-[#29323E] bg-[#0E1219] shadow-sm">
            <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-[#142B29] text-[#80BFB4]">
                        <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold text-[#EEF1F5]">
                                Volunteer Profile
                            </h2>

                            <StatusBadge status={status} />
                        </div>

                        <p className="mt-1 text-sm text-[#8792A1]">
                            {statusCopy.title}
                        </p>
                    </div>
                </div>

                {isActiveVolunteer ? (
                    <div className="inline-flex w-fit items-center gap-2 rounded-none border border-[#315A49] bg-[#172A23] px-4 py-2.5 text-sm font-semibold text-[#9AD1AE]">
                        <span className="h-2 w-2 rounded-sm bg-[#172A23]0" />

                        {availability}
                    </div>
                ) : (
                    <div className="inline-flex w-fit items-center gap-2 rounded-none border border-[#29323E] bg-[#1A222D] px-4 py-2.5 text-sm font-semibold text-[#AAB3BF]">
                        <span className="h-2 w-2 rounded-sm bg-slate-400" />

                        {availability}
                    </div>
                )}
            </div>

            <div className="border-t border-[#252D38] bg-[#1A222D] px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-2xl text-sm leading-6 text-[#8792A1]">
                        {isInactiveVolunteer
                            ? hasPendingReactivationRequest
                                ? 'Your reactivation request has been sent to the admin and is currently awaiting review.'
                                : 'Your previous volunteer profile is inactive. You can request admin approval to reactivate your volunteer account.'
                            : isSuspendedVolunteer
                              ? 'Your volunteer account has been suspended. You cannot request reactivation yourself.'
                              : statusCopy.description}
                    </p>

                    <div className="flex shrink-0 flex-wrap gap-2">
                        {/* ACTIVE VOLUNTEER */}
                        {isActiveVolunteer && (
                            <button
                                type="button"
                                disabled={actionLoading === 'resign'}
                                onClick={onResign}
                                className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#6D373B] hover:bg-[#321D22] hover:text-[#E7A1A5] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />

                                {actionLoading === 'resign'
                                    ? 'Resigning...'
                                    : 'Resign as Volunteer'}
                            </button>
                        )}

                        {/* INACTIVE + NO PENDING REACTIVATION */}
                        {isInactiveVolunteer &&
                            !hasPendingReactivationRequest && (
                                <button
                                    type="button"
                                    disabled={actionLoading === 'reactivation'}
                                    onClick={onRequestReactivation}
                                    className="inline-flex min-h-10 items-center justify-center rounded-none bg-[#0f766e] px-5 text-sm font-semibold text-white! transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <UserRound className="mr-2 h-4 w-4" />

                                    {actionLoading === 'reactivation'
                                        ? 'Sending...'
                                        : 'Request Reactivation'}
                                </button>
                            )}

                        {/* INACTIVE + PENDING REACTIVATION */}
                        {isInactiveVolunteer &&
                            hasPendingReactivationRequest && (
                                <>
                                    <div className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#72552B] bg-[#2B2318] px-4 text-sm font-semibold text-[#D8B47B]">
                                        <Clock3 className="mr-2 h-4 w-4" />
                                        Reactivation Pending
                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading === 'request-cancel'
                                        }
                                        onClick={onCancelRequest}
                                        className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#29323E] bg-[#0E1219] px-4 text-sm font-semibold text-[#AAB3BF] transition hover:border-[#6D373B] hover:bg-[#321D22] hover:text-[#E7A1A5] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />

                                        {actionLoading === 'request-cancel'
                                            ? 'Cancelling...'
                                            : 'Cancel Request'}
                                    </button>
                                </>
                            )}

                        {/* SUSPENDED */}
                        {isSuspendedVolunteer && (
                            <div className="inline-flex min-h-10 items-center justify-center rounded-none border border-[#6D373B] bg-[#321D22] px-4 text-sm font-semibold text-[#E7A1A5]">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reactivation Unavailable
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};


export default VolunteerStatusPanel;
