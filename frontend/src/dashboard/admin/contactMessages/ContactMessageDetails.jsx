import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    Clock3,
    Mail,
    MessageSquare,
    RefreshCw,
    Send,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

import { apiRequest } from '@/api/client';

const STATUS_OPTIONS = [
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'resolved', label: 'Resolved' },
];

const STATUS_STYLES = {
    new: 'border-[#315B73] bg-[#162B38] text-[#A8D9F2]',
    in_progress: 'border-[#62502F] bg-[#302719] text-[#E9CB91]',
    resolved: 'border-[#28594A] bg-[#172D25] text-[#9DD8BC]',
};

const getMessage = (response) =>
    response?.data?.data ||
    response?.data?.message ||
    response?.data ||
    response?.message ||
    response;

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

const formatStatus = (status) => {
    const labels = {
        new: 'New',
        in_progress: 'In progress',
        resolved: 'Resolved',
    };

    return labels[status] || status || 'New';
};

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-medium ${
            STATUS_STYLES[status] ||
            'border-[#343E4B] bg-[#171E28] text-[#AEB7C3]'
        }`}
    >
        {formatStatus(status)}
    </span>
);

const ContactMessageDetails = () => {
    const { messageId } = useParams();

    const [message, setMessage] = useState(null);
    const [status, setStatus] = useState('new');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const [reply, setReply] = useState('');
    const [replyError, setReplyError] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [success, setSuccess] = useState({
        open: false,
        title: '',
        message: '',
    });

    const fetchMessage = useCallback(
        async ({ showLoader = false } = {}) => {
            if (showLoader) setRefreshing(true);

            try {
                const response = await apiRequest(
                    `/admin/contact-messages/${messageId}`,
                );

                const record = getMessage(response);

                if (!record || typeof record !== 'object' || !record.id) {
                    throw new Error('The contact message could not be found.');
                }

                setMessage(record);
                setStatus(record.status || 'new');
                setError('');
            } catch (err) {
                setError(
                    err?.message ||
                        'Unable to load this contact message. Please try again.',
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [messageId],
    );

    useEffect(() => {
        let cancelled = false;

        const loadMessage = async () => {
            try {
                const response = await apiRequest(
                    `/admin/contact-messages/${messageId}`,
                );

                const record = getMessage(response);

                if (!record || typeof record !== 'object' || !record.id) {
                    throw new Error('The contact message could not be found.');
                }

                if (!cancelled) {
                    setMessage(record);
                    setStatus(record.status || 'new');
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Unable to load this contact message. Please try again.',
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadMessage();

        return () => {
            cancelled = true;
        };
    }, [messageId]);

    const handleStatusUpdate = async (event) => {
        event.preventDefault();

        if (!message || status === message.status || updatingStatus) return;

        setUpdatingStatus(true);
        setError('');

        try {
            await apiRequest(`/admin/contact-messages/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            setMessage((current) =>
                current ? { ...current, status } : current,
            );

            setSuccess({
                open: true,
                title: 'Status updated',
                message: `The message status is now "${formatStatus(status)}".`,
            });
        } catch (err) {
            setError(
                err?.message ||
                    'Unable to update the message status. Please try again.',
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSendReply = async (event) => {
        event.preventDefault();

        const trimmedReply = reply.trim();

        if (!trimmedReply || sendingReply) {
            setReplyError('Please write a reply before sending.');
            return;
        }

        setSendingReply(true);
        setReplyError('');
        setError('');

        try {
            await apiRequest(`/admin/contact-messages/${messageId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reply: trimmedReply }),
            });

            setReply('');

            setSuccess({
                open: true,
                title: 'Reply sent',
                message: `Your reply has been sent to ${message?.email || 'the sender'}.`,
            });

            await fetchMessage();
        } catch (err) {
            setReplyError(
                err?.message || 'Unable to send the reply. Please try again.',
            );
        } finally {
            setSendingReply(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Contact Message"
                    subtitle="Review the enquiry and respond to the sender."
                />
                <LoadingUI
                    variant="page"
                    title="Loading message..."
                    description="Please wait while we retrieve the message details."
                />
            </div>
        );
    }

    if (error && !message) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Contact Message"
                    subtitle="Review the enquiry and respond to the sender."
                    action={
                        <Link
                            to="/admin/dashboard/contact-messages"
                            className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-3.5 text-xs font-medium text-[#D5DDE6] transition hover:border-[#4B596A] hover:bg-[#1C232D]"
                        >
                            <ArrowLeft size={14} />
                            Back to inbox
                        </Link>
                    }
                />

                <LoadingError
                    title="Unable to load contact message"
                    message={error}
                />

                <button
                    type="button"
                    onClick={() => fetchMessage({ showLoader: true })}
                    disabled={refreshing}
                    className="inline-flex h-10 items-center gap-2 border border-[#343E4B] px-4 text-xs font-medium text-[#D5DDE6] transition hover:bg-[#1C232D] disabled:opacity-50"
                >
                    <RefreshCw
                        size={14}
                        className={refreshing ? 'animate-spin' : ''}
                    />
                    Retry
                </button>
            </div>
        );
    }

    if (!message) return null;

    return (
        <>
            <div className="space-y-8 lg:space-y-10">
                <PageHeader
                    title="Contact Message"
                    subtitle="Review the enquiry and respond to the sender."
                    action={
                        <Link
                            to="/admin/dashboard/contact-messages"
                            className="inline-flex h-10 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-3.5 text-xs font-medium text-[#B8C2CF] transition hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#EEF1F5]"
                        >
                            <ArrowLeft size={14} />
                            Back to inbox
                        </Link>
                    }
                />

                {error && (
                    <div className="flex flex-col gap-3 border border-[#684044] bg-[#27191D] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-[#F0B4B7]">{error}</p>
                        <button
                            type="button"
                            onClick={() => fetchMessage({ showLoader: true })}
                            disabled={refreshing}
                            className="shrink-0 text-xs font-medium text-[#F0B4B7] underline underline-offset-4 hover:text-white disabled:opacity-50"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_350px]">
                    <div className="min-w-0 space-y-6">
                        <section className="border border-[#252D38] bg-[#0E1219]">
                            <div className="flex flex-col gap-4 border-b border-[#252D38] bg-[#1A222D] px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#303A47] bg-[#0E1219] text-[#AAB3BF]">
                                        <MessageSquare
                                            size={17}
                                            strokeWidth={1.7}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="break-words font-sans! text-base font-semibold! text-[#EEF1F5]!">
                                            {message.topic || 'General enquiry'}
                                        </h2>
                                        <p className="mt-1 break-words text-xs text-[#8792A1]">
                                            Received{' '}
                                            {formatDate(message.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <StatusBadge status={message.status} />
                            </div>

                            <div className="space-y-6 px-5 py-6 sm:px-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#697586]">
                                            Sender
                                        </p>
                                        <p className="mt-2 break-words text-sm font-medium text-[#EEF1F5]">
                                            {message.name || 'Unknown sender'}
                                        </p>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#697586]">
                                            Email address
                                        </p>
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm text-[#A7DCD0] transition hover:text-[#C4EEE4]"
                                        >
                                            <Mail
                                                size={14}
                                                className="shrink-0"
                                            />
                                            {message.email || 'Not provided'}
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t border-[#252D38]" />

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#697586]">
                                        Message
                                    </p>
                                    <div className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-7 text-[#C4CCD6]">
                                        {message.message ||
                                            'No message content.'}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="border border-[#252D38] bg-[#0E1219]">
                            <div className="border-b border-[#252D38] bg-[#1A222D] px-5 py-4 sm:px-6">
                                <h2 className="font-sans! text-base font-semibold! text-[#EEF1F5]!">
                                    Reply to sender
                                </h2>
                                <p className="mt-1 text-xs leading-relaxed text-[#8792A1]">
                                    Send a response to the sender's email
                                    address.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSendReply}
                                className="space-y-4 px-5 py-5 sm:px-6 sm:py-6"
                            >
                                <div>
                                    <label
                                        htmlFor="contact-reply"
                                        className="mb-2 block text-xs font-medium text-[#C4CCD6]"
                                    >
                                        Your reply
                                    </label>

                                    <textarea
                                        id="contact-reply"
                                        name="reply"
                                        rows={7}
                                        value={reply}
                                        onChange={(event) => {
                                            setReply(event.target.value);
                                            if (replyError) setReplyError('');
                                        }}
                                        placeholder="Write your response here..."
                                        disabled={sendingReply}
                                        required
                                        className="w-full resize-y border border-[#29323E] bg-[#0A0E14] px-3.5 py-3 font-sans! text-[13px] leading-6 text-[#EEF1F5] outline-none transition placeholder:text-[#5E6978] hover:border-[#394553] focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/30 disabled:cursor-not-allowed disabled:opacity-60"
                                    />

                                    {replyError && (
                                        <p className="mt-2 text-xs text-[#F0B4B7]">
                                            {replyError}
                                        </p>
                                    )}

                                    <p className="mt-2 text-[11px] leading-relaxed text-[#697586]">
                                        The reply will be sent to{' '}
                                        <span className="break-all text-[#AAB3BF]">
                                            {message.email || 'the sender'}
                                        </span>
                                        .
                                    </p>
                                </div>

                                <div className="flex flex-col-reverse gap-3 border-t border-[#252D38] pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-[11px] text-[#697586]">
                                        Check your response before sending.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={sendingReply || !reply.trim()}
                                        className="inline-flex h-10 items-center justify-center gap-2 border border-[#0F766E] bg-[#0F766E] px-4 text-xs font-semibold text-white transition hover:border-[#115E59] hover:bg-[#115E59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1219] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {sendingReply ? (
                                            <RefreshCw
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Send size={14} />
                                        )}
                                        {sendingReply
                                            ? 'Sending reply...'
                                            : 'Send reply'}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    <aside className="min-w-0 space-y-6">
                        <section className="border border-[#252D38] bg-[#0E1219]">
                            <div className="border-b border-[#252D38] bg-[#1A222D] px-5 py-4">
                                <h2 className="font-sans! text-sm font-semibold! text-[#EEF1F5]!">
                                    Message status
                                </h2>
                                <p className="mt-1 text-xs leading-relaxed text-[#8792A1]">
                                    Update the current handling status.
                                </p>
                            </div>

                            <form
                                onSubmit={handleStatusUpdate}
                                className="space-y-4 p-5"
                            >
                                <div>
                                    <label
                                        htmlFor="message-status"
                                        className="mb-2 block text-xs font-medium text-[#C4CCD6]"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="message-status"
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(event.target.value)
                                        }
                                        disabled={updatingStatus}
                                        className="h-10 w-full border border-[#29323E] bg-[#0A0E14] px-3 font-sans! text-xs text-[#EEF1F5] outline-none transition hover:border-[#394553] focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/30 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        updatingStatus ||
                                        status === message.status
                                    }
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 border border-[#343E4B] bg-[#171E28] px-4 text-xs font-medium text-[#D5DDE6] transition hover:border-[#4B596A] hover:bg-[#1C2632] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {updatingStatus ? (
                                        <RefreshCw
                                            size={14}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Check size={14} />
                                    )}
                                    {updatingStatus
                                        ? 'Saving status...'
                                        : 'Save status'}
                                </button>
                            </form>
                        </section>

                        <section className="border border-[#252D38] bg-[#0E1219] p-5">
                            <div className="flex items-center gap-2">
                                <Clock3 size={15} className="text-[#8792A1]" />
                                <h2 className="text-xs font-semibold text-[#EEF1F5]">
                                    Message details
                                </h2>
                            </div>

                            <dl className="mt-5 space-y-4">
                                <div>
                                    <dt className="text-[10px] uppercase tracking-[0.08em] text-[#697586]">
                                        Message ID
                                    </dt>
                                    <dd className="mt-1.5 break-all text-xs text-[#C4CCD6]">
                                        #{message.id}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[10px] uppercase tracking-[0.08em] text-[#697586]">
                                        Submitted
                                    </dt>
                                    <dd className="mt-1.5 text-xs leading-relaxed text-[#C4CCD6]">
                                        {formatDate(message.created_at)}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[10px] uppercase tracking-[0.08em] text-[#697586]">
                                        Last updated
                                    </dt>
                                    <dd className="mt-1.5 text-xs leading-relaxed text-[#C4CCD6]">
                                        {formatDate(message.updated_at)}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[10px] uppercase tracking-[0.08em] text-[#697586]">
                                        Current status
                                    </dt>
                                    <dd className="mt-2">
                                        <StatusBadge status={message.status} />
                                    </dd>
                                </div>
                            </dl>
                        </section>
                    </aside>
                </div>
            </div>

            <SuccessDialog
                open={success.open}
                title={success.title}
                message={success.message}
                onClose={() =>
                    setSuccess({
                        open: false,
                        title: '',
                        message: '',
                    })
                }
            />
        </>
    );
};

export default ContactMessageDetails;
