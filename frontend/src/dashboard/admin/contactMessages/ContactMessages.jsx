import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Mail,
    MessageSquare,
    RefreshCw,
    Search,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import { apiRequest } from '@/api/client';

const PAGE_SIZE = 15;

const STATUS_OPTIONS = [
    { value: 'all', label: 'All messages' },
    { value: 'new', label: 'New' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'resolved', label: 'Resolved' },
];

const STATUS_STYLES = {
    new: 'border-[#315B73] bg-[#162B38] text-[#A8D9F2]',
    in_progress: 'border-[#62502F] bg-[#302719] text-[#E9CB91]',
    resolved: 'border-[#28594A] bg-[#172D25] text-[#9DD8BC]',
};

const getMessages = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.messages)) return response.messages;
    if (Array.isArray(response?.data?.messages)) {
        return response.data.messages;
    }

    return [];
};

const formatDate = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
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
        className={`inline-flex items-center whitespace-nowrap border px-2.5 py-1 text-[10px] font-medium ${
            STATUS_STYLES[status] ||
            'border-[#343E4B] bg-[#171E28] text-[#AEB7C3]'
        }`}
    >
        {formatStatus(status)}
    </span>
);

const SummaryItem = ({ label, value }) => (
    <div className="min-w-0 border-l border-[#303A47] pl-4 first:border-l-0 first:pl-0">
        <p className="text-[11px] text-[#8792A1]">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-[#EEF1F5]">
            {value}
        </p>
    </div>
);

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    const loadMessages = useCallback(async ({ showLoader = false } = {}) => {
        if (showLoader) setRefreshing(true);

        try {
            const response = await apiRequest('/admin/contact-messages');
            setMessages(getMessages(response));
            setError('');
        } catch (err) {
            setError(
                err?.message ||
                    'Unable to load contact messages. Please try again.',
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadInitialMessages = async () => {
            try {
                const response = await apiRequest('/admin/contact-messages');

                if (!cancelled) {
                    setMessages(getMessages(response));
                    setError('');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.message ||
                            'Unable to load contact messages. Please try again.',
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadInitialMessages();

        return () => {
            cancelled = true;
        };
    }, []);

    const statistics = useMemo(
        () => ({
            total: messages.length,
            new: messages.filter((item) => item.status === 'new').length,
            inProgress: messages.filter((item) => item.status === 'in_progress')
                .length,
            resolved: messages.filter((item) => item.status === 'resolved')
                .length,
        }),
        [messages],
    );

    const filteredMessages = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return messages.filter((message) => {
            const matchesStatus =
                statusFilter === 'all' || message.status === statusFilter;

            const matchesSearch =
                !query ||
                [
                    message.name,
                    message.email,
                    message.topic,
                    message.message,
                ].some((value) =>
                    String(value || '')
                        .toLowerCase()
                        .includes(query),
                );

            return matchesStatus && matchesSearch;
        });
    }, [messages, searchTerm, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredMessages.length / PAGE_SIZE),
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedMessages = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredMessages.slice(start, start + PAGE_SIZE);
    }, [filteredMessages, safePage]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Contact Messages"
                    subtitle="Review enquiries and respond to messages submitted through the contact form."
                />
                <LoadingUI
                    variant="page"
                    title="Loading contact messages..."
                    description="Please wait while we retrieve the inbox."
                />
            </div>
        );
    }

    if (error && messages.length === 0) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Contact Messages"
                    subtitle="Review enquiries and respond to messages submitted through the contact form."
                    action={
                        <button
                            type="button"
                            onClick={() => loadMessages({ showLoader: true })}
                            disabled={refreshing}
                            className="inline-flex h-10 items-center gap-2 border border-[#343E4B] bg-[#171E28] px-4 text-xs font-medium text-[#D5DDE6] transition hover:border-[#4B596A] hover:bg-[#1C2632] disabled:opacity-50"
                        >
                            <RefreshCw
                                size={14}
                                className={refreshing ? 'animate-spin' : ''}
                            />
                            Retry
                        </button>
                    }
                />
                <LoadingError
                    title="Unable to load contact messages"
                    message={error}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 lg:space-y-10">
            <PageHeader
                title="Contact Messages"
                subtitle="Review enquiries and respond to messages submitted through the contact form."
                action={
                    <button
                        type="button"
                        onClick={() => loadMessages({ showLoader: true })}
                        disabled={refreshing}
                        className="inline-flex h-10 items-center justify-center gap-2 border border-[#343E4B] bg-transparent px-4 text-xs font-medium text-[#B8C2CF] transition hover:border-[#4B596A] hover:bg-[#1C232D] hover:text-[#EEF1F5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={14}
                            className={refreshing ? 'animate-spin' : ''}
                        />
                        Refresh
                    </button>
                }
            />

            {error && (
                <div className="flex flex-col gap-3 border border-[#684044] bg-[#27191D] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[#F0B4B7]">{error}</p>
                    <button
                        type="button"
                        onClick={() => loadMessages({ showLoader: true })}
                        className="shrink-0 text-xs font-medium text-[#F0B4B7] underline underline-offset-4 hover:text-white"
                    >
                        Try again
                    </button>
                </div>
            )}

            <section className="border border-[#252D38] bg-[#0E1219] px-5 py-5 sm:px-6">
                <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-5">
                    <SummaryItem
                        label="Total messages"
                        value={statistics.total}
                    />
                    <SummaryItem label="New" value={statistics.new} />
                    <SummaryItem
                        label="In progress"
                        value={statistics.inProgress}
                    />
                    <SummaryItem label="Resolved" value={statistics.resolved} />
                </div>
            </section>

            <section className="min-w-0 overflow-hidden border border-[#252D38] bg-[#0E1219]">
                <div className="border-b border-[#252D38] bg-[#1A222D] px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="font-sans! text-[18px] font-semibold! tracking-tight text-[#EEF1F5]!">
                                Message Inbox
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-[#8792A1]">
                                {filteredMessages.length}{' '}
                                {filteredMessages.length === 1
                                    ? 'message'
                                    : 'messages'}{' '}
                                found
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <label className="relative block min-w-0 sm:w-[270px]">
                                <Search
                                    size={15}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#697586]"
                                />
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search messages..."
                                    aria-label="Search contact messages"
                                    className="h-10 w-full border border-[#29323E] bg-[#0A0E14] pl-9 pr-3 font-sans! text-xs text-[#EEF1F5] outline-none transition placeholder:text-[#5E6978] hover:border-[#394553] focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/30"
                                />
                            </label>

                            <select
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                aria-label="Filter messages by status"
                                className="h-10 w-full border border-[#29323E] bg-[#0A0E14] px-3 font-sans! text-xs text-[#D5DDE6] outline-none transition hover:border-[#394553] focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/30 sm:w-[165px]"
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
                    </div>
                </div>

                {paginatedMessages.length === 0 ? (
                    <div className="flex min-h-[250px] flex-col items-center justify-center px-5 py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center border border-[#303A47] bg-[#171E28] text-[#8792A1]">
                            <MessageSquare size={20} strokeWidth={1.6} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold text-[#EEF1F5]">
                            {messages.length === 0
                                ? 'No contact messages yet'
                                : 'No matching messages'}
                        </h3>
                        <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#8792A1]">
                            {messages.length === 0
                                ? 'Messages submitted through the public contact form will appear here.'
                                : 'Try another search term or change the selected status filter.'}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setCurrentPage(1);
                                }}
                                className="mt-4 text-xs font-medium text-[#6FC8B5] transition hover:text-[#9BE3D4]"
                            >
                                Clear search and filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] border-collapse text-left">
                                <thead className="border-b border-[#252D38] bg-[#10151D]">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]">
                                            Sender
                                        </th>
                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]">
                                            Topic
                                        </th>
                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]">
                                            Received
                                        </th>
                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8792A1]">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#202833]">
                                    {paginatedMessages.map((message) => (
                                        <tr
                                            key={message.id}
                                            className="transition-colors hover:bg-[#141B24]"
                                        >
                                            <td className="max-w-[260px] px-5 py-4">
                                                <p className="truncate text-xs font-medium text-[#EEF1F5]">
                                                    {message.name ||
                                                        'Unknown sender'}
                                                </p>
                                                <a
                                                    href={`mailto:${message.email}`}
                                                    className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-[11px] text-[#8792A1] transition hover:text-[#A7DCD0]"
                                                >
                                                    <Mail
                                                        size={12}
                                                        className="shrink-0"
                                                    />
                                                    <span className="truncate">
                                                        {message.email ||
                                                            'No email provided'}
                                                    </span>
                                                </a>
                                            </td>

                                            <td className="max-w-[230px] px-5 py-4">
                                                <p className="truncate text-xs text-[#D5DDE6]">
                                                    {message.topic ||
                                                        'General enquiry'}
                                                </p>
                                                <p className="mt-1 truncate text-[11px] text-[#697586]">
                                                    {String(
                                                        message.message || '',
                                                    ).slice(0, 90)}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-[11px] text-[#AAB3BF]">
                                                {formatDate(message.created_at)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={message.status}
                                                />
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    to={`/admin/dashboard/contact-messages/${message.id}`}
                                                    className="inline-flex h-8 items-center gap-2 border border-[#343E4B] px-3 text-[11px] font-medium text-[#D5DDE6] transition hover:border-[#0F766E] hover:bg-[#142723] hover:text-[#B7E6DB]"
                                                >
                                                    View
                                                    <ArrowRight size={13} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-[#252D38] bg-[#1A222D] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <p className="text-[11px] text-[#8792A1]">
                                Showing {(safePage - 1) * PAGE_SIZE + 1}–
                                {Math.min(
                                    safePage * PAGE_SIZE,
                                    filteredMessages.length,
                                )}{' '}
                                of {filteredMessages.length}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={safePage <= 1}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1),
                                        )
                                    }
                                    className="h-8 border border-[#343E4B] px-3 text-[11px] text-[#D5DDE6] transition hover:bg-[#252D38] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <span className="min-w-[76px] text-center text-[11px] tabular-nums text-[#AAB3BF]">
                                    Page {safePage} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(totalPages, page + 1),
                                        )
                                    }
                                    className="h-8 border border-[#343E4B] px-3 text-[11px] text-[#D5DDE6] transition hover:bg-[#252D38] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default ContactMessages;
