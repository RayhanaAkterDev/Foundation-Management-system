import React, { useMemo, useState } from 'react';
import {
    X,
    Search,
    UserRound,
    UsersRound,
    Check,
    CheckCircle2,
    ClipboardCheck,
    AlertCircle,
    LoaderCircle,
    MapPin,
} from 'lucide-react';

const scrollbarHidden =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

const ACTIVE_STATUSES = [
    'assigned',
    'accepted',
    'in_progress',
    'withdrawal_requested',
];

const getVolunteerId = (volunteer) =>
    String(
        volunteer?.user_id ??
            volunteer?.user?.id ??
            volunteer?.volunteer_id ??
            volunteer?.volunteer?.id ??
            volunteer?.id ??
            '',
    );

const getVolunteerName = (volunteer) =>
    volunteer?.name ||
    volunteer?.user?.name ||
    volunteer?.volunteer?.name ||
    'SP Volunteer';

const getVolunteerEmail = (volunteer) =>
    volunteer?.email ||
    volunteer?.user?.email ||
    volunteer?.volunteer?.email ||
    '';

const getVolunteerDistrict = (volunteer) =>
    volunteer?.district ||
    volunteer?.volunteer?.district ||
    volunteer?.user?.district ||
    '';

const getStatusLabel = (status) => {
    const labels = {
        assigned: 'Awaiting response',
        accepted: 'Accepted',
        in_progress: 'In progress',
        withdrawal_requested: 'Withdrawal pending',
        completed: 'Completed',
        withdrawn: 'Withdrawn',
        rejected: 'Rejected',
    };

    return labels[status] || status?.replace(/_/g, ' ') || 'Assigned';
};

function AssignmentModal({
    campaign,
    volunteers = [],
    assignments = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState('');
    const [note, setNote] = useState('');

    const existingAssignments = useMemo(() => {
        if (!Array.isArray(assignments)) return [];

        return assignments
            .filter(Boolean)
            .map((assignment) => {
                const id =
                    assignment?.volunteer_id ??
                    assignment?.volunteer?.id ??
                    assignment?.user_id ??
                    assignment?.user?.id;

                if (id == null) return null;

                return {
                    ...assignment,
                    _volunteerId: String(id),
                };
            })
            .filter(Boolean);
    }, [assignments]);

    const assignedIds = useMemo(
        () =>
            new Set(
                existingAssignments.map(
                    (assignment) => assignment._volunteerId,
                ),
            ),
        [existingAssignments],
    );

    const connected = useMemo(
        () =>
            existingAssignments.filter((assignment) =>
                ACTIVE_STATUSES.includes(assignment.status),
            ),
        [existingAssignments],
    );

    const rejected = useMemo(
        () =>
            existingAssignments.filter(
                (assignment) => assignment.status === 'rejected',
            ),
        [existingAssignments],
    );

    const previous = useMemo(
        () =>
            existingAssignments.filter((assignment) =>
                ['completed', 'withdrawn'].includes(assignment.status),
            ),
        [existingAssignments],
    );

    const available = useMemo(
        () =>
            (Array.isArray(volunteers) ? volunteers : []).filter(
                (volunteer) => {
                    const id = getVolunteerId(volunteer);
                    return id && !assignedIds.has(id);
                },
            ),
        [volunteers, assignedIds],
    );

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return available;

        return available.filter((volunteer) =>
            [
                getVolunteerName(volunteer),
                getVolunteerEmail(volunteer),
                getVolunteerDistrict(volunteer),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [available, search]);

    const selectedCount = selectedIds.length;

    const toggleVolunteer = (id) => {
        if (loading) return;

        const value = String(id);

        setSelectedIds((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );
    };

    const handleClose = () => {
        if (!loading) onClose?.();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading || selectedCount === 0 || !onConfirm) return;

        try {
            await onConfirm({
                volunteer_ids: selectedIds.map(Number),
                assignment_note: note.trim() || null,
            });

            onClose?.();
        } catch {
            // Assignment errors are handled by the parent.
        }
    };

    if (!campaign) return null;

    const overviewItems = [
        { label: 'Connected', value: connected.length },
        { label: 'Rejected', value: rejected.length },
        { label: 'Previous', value: previous.length },
    ];

    const historyGroups = [
        { key: 'connected', title: 'Connected', items: connected },
        { key: 'rejected', title: 'Rejected', items: rejected },
        { key: 'previous', title: 'Previous', items: previous },
    ].filter((group) => group.items.length > 0);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070A]/80 p-0 backdrop-blur-[3px] sm:p-5">
            {/* BACKDROP */}

            <button
                type="button"
                aria-label="Close assignment modal"
                onClick={handleClose}
                disabled={loading}
                className="absolute inset-0 cursor-default"
            />

            {/* MODAL */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="assignment-title"
                className="
                    relative z-10 flex w-full max-w-[1040px]
                    flex-col overflow-hidden
                    border border-[#303A47]
                    bg-[#0E1219]
                    font-['Poppins',sans-serif]
                    shadow-[0_28px_90px_rgba(0,0,0,0.5)]
                    max-sm:h-[100dvh]
                    sm:max-h-[90dvh]
                "
            >
                {/* ================================================
                    HEADER
                ================================================ */}

                <header className="shrink-0 border-b border-[#303A47] bg-[#1A222D] px-5 py-5 sm:px-7">
                    <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <div className="hidden h-10 w-10 shrink-0 items-center justify-center border border-[#394656] bg-[#222D3A] text-[#B9C6D5] sm:flex">
                                    <ClipboardCheck
                                        size={19}
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="assignment-title"
                                        className="
                                            !m-0
                                            !font-['Poppins',sans-serif]
                                            !text-[19px]
                                            !font-semibold
                                            !leading-[1.4]
                                            !tracking-[-0.025em]
                                            !text-[#EEF1F5]
                                        "
                                    >
                                        Assign volunteers
                                    </h2>

                                    <p className="mt-1 text-[12px] leading-5 text-[#96A2B1]">
                                        {campaign.title || 'Campaign'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            aria-label="Close"
                            className="
                                flex h-9 w-9 shrink-0
                                items-center justify-center
                                border border-[#343E4B]
                                text-[#8792A1]
                                transition-colors
                                hover:bg-[#252F3B]
                                hover:text-[#EEF1F5]
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#8297B8]
                                disabled:opacity-40
                            "
                        >
                            <X size={17} />
                        </button>
                    </div>
                </header>

                {/* ================================================
                    FORM
                ================================================ */}

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* MAIN SCROLL AREA */}

                    <div
                        className={`
                            min-h-0 flex-1 overflow-y-auto
                            ${scrollbarHidden}
                        `}
                    >
                        {error && (
                            <div className="px-5 pt-5 sm:px-7">
                                <div
                                    role="alert"
                                    className="flex items-start gap-3 border border-[#59343B] bg-[#38272C] px-4 py-3"
                                >
                                    <AlertCircle
                                        size={17}
                                        className="mt-0.5 shrink-0 text-[#E9A6AF]"
                                    />

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#F2B8BF]">
                                            Assignment failed
                                        </p>

                                        <p className="mt-1 break-words text-[12px] text-[#E9A6AF]">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TWO-COLUMN WORKSPACE */}

                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                            {/* =====================================
                                LEFT — VOLUNTEER SELECTION
                            ===================================== */}

                            <section className="min-w-0 px-5 py-6 sm:px-7 sm:py-7">
                                {/* SECTION HEADER */}

                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <UsersRound
                                            size={17}
                                            className="text-[#AAB8C8]"
                                        />

                                        <h3 className="!m-0 !font-['Poppins',sans-serif] !text-[14px] !font-semibold !text-[#EEF1F5]">
                                            Available volunteers
                                        </h3>
                                    </div>

                                    <span className="shrink-0 text-[12px] tabular-nums text-[#96A2B1]">
                                        {available.length} available
                                    </span>
                                </div>

                                {/* SEARCH */}

                                <div className="flex h-11 items-center gap-3 border border-[#343E4B] bg-[#151C25] px-3.5 transition-colors focus-within:border-[#8297B8]">
                                    <Search
                                        size={16}
                                        className="shrink-0 text-[#8792A1]"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search volunteers..."
                                        aria-label="Search volunteers"
                                        className="
                                            min-w-0 flex-1
                                            bg-transparent
                                            text-[13px] text-[#EEF1F5]
                                            outline-none
                                            placeholder:text-[#697586]
                                        "
                                    />

                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="shrink-0 text-[12px] text-[#AEB7C3] hover:text-[#EEF1F5]"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* VOLUNTEER LIST */}

                                <div
                                    className={`
                                        mt-4 max-h-[330px]
                                        space-y-2.5 overflow-y-auto
                                        ${scrollbarHidden}
                                    `}
                                >
                                    {filtered.length > 0 ? (
                                        filtered.map((volunteer) => {
                                            const id =
                                                getVolunteerId(volunteer);

                                            const checked =
                                                selectedIds.includes(id);

                                            const name =
                                                getVolunteerName(volunteer);

                                            const email =
                                                getVolunteerEmail(volunteer);

                                            const district =
                                                getVolunteerDistrict(volunteer);

                                            return (
                                                <label
                                                    key={id}
                                                    className={`
                                                        group flex cursor-pointer
                                                        items-center gap-3.5
                                                        border px-4 py-4
                                                        transition-colors
                                                        ${
                                                            checked
                                                                ? 'border-[#647C9D] bg-[#202B3A]'
                                                                : 'border-[#303A47] bg-[#141B24] hover:border-[#455469] hover:bg-[#1A2430]'
                                                        }
                                                        ${
                                                            loading
                                                                ? 'cursor-not-allowed opacity-50'
                                                                : ''
                                                        }
                                                        focus-within:outline
                                                        focus-within:outline-1
                                                        focus-within:outline-[#8297B8]
                                                    `}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() =>
                                                            toggleVolunteer(id)
                                                        }
                                                        disabled={loading}
                                                        className="sr-only"
                                                    />

                                                    {/* AVATAR */}

                                                    <div
                                                        className={`
                                                            flex h-10 w-10
                                                            shrink-0 items-center
                                                            justify-center border
                                                            ${
                                                                checked
                                                                    ? 'border-[#526783] bg-[#2B3B50] text-[#C0D1E9]'
                                                                    : 'border-[#343E4B] bg-[#202A36] text-[#B8C5D3]'
                                                            }
                                                        `}
                                                    >
                                                        <UserRound
                                                            size={18}
                                                            strokeWidth={1.7}
                                                        />
                                                    </div>

                                                    {/* VOLUNTEER INFORMATION */}

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-[13px] font-semibold text-[#EEF1F5]">
                                                            {name}
                                                        </p>

                                                        {email && (
                                                            <p className="mt-1 truncate text-[12px] text-[#96A2B1]">
                                                                {email}
                                                            </p>
                                                        )}

                                                        {district && (
                                                            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#96A2B1]">
                                                                <MapPin
                                                                    size={12}
                                                                    className="shrink-0"
                                                                />
                                                                <span className="truncate">
                                                                    {district}
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* CIRCULAR CHECKBOX */}

                                                    <div
                                                        aria-hidden="true"
                                                        className={`
                                                            flex h-[22px] w-[22px]
                                                            shrink-0 items-center
                                                            justify-center
                                                            rounded-full
                                                            border-[1.5px]
                                                            transition-colors
                                                            ${
                                                                checked
                                                                    ? 'border-[#A5B9D8] bg-[#A5B9D8] text-[#182332]'
                                                                    : 'border-[#637184] bg-[#111821] text-transparent group-hover:border-[#A5B9D8]'
                                                            }
                                                        `}
                                                    >
                                                        <Check
                                                            size={13}
                                                            strokeWidth={2.8}
                                                        />
                                                    </div>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <div className="border border-[#303A47] bg-[#141B24] px-5 py-10 text-center">
                                            <UsersRound
                                                size={23}
                                                className="mx-auto text-[#697586]"
                                            />

                                            <p className="mt-3 text-[13px] font-semibold text-[#D5DDE6]">
                                                {search
                                                    ? 'No matching volunteers'
                                                    : 'No volunteers available'}
                                            </p>

                                            <p className="mt-1.5 text-[12px] text-[#8792A1]">
                                                {search
                                                    ? 'Try a different search term.'
                                                    : 'There are no additional volunteers to assign.'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* ASSIGNMENT HISTORY */}

                                {historyGroups.length > 0 && (
                                    <div className="mt-7 border-t border-[#303A47] pt-6">
                                        <h3 className="!m-0 !font-['Poppins',sans-serif] !text-[13px] !font-semibold !text-[#EEF1F5]">
                                            Existing assignments
                                        </h3>

                                        <div className="mt-4 space-y-4">
                                            {historyGroups.map((group) => (
                                                <div key={group.key}>
                                                    <div className="mb-2 flex items-center justify-between gap-3">
                                                        <span className="text-[12px] font-medium text-[#B8C2CF]">
                                                            {group.title}
                                                        </span>

                                                        <span className="text-[12px] tabular-nums text-[#8792A1]">
                                                            {group.items.length}
                                                        </span>
                                                    </div>

                                                    <div className="overflow-hidden border border-[#303A47] bg-[#141B24]">
                                                        {group.items.map(
                                                            (
                                                                assignment,
                                                                index,
                                                            ) => {
                                                                const volunteer =
                                                                    assignment.volunteer ||
                                                                    assignment.user ||
                                                                    assignment;

                                                                return (
                                                                    <div
                                                                        key={
                                                                            assignment.id ??
                                                                            `${group.key}-${assignment._volunteerId}-${index}`
                                                                        }
                                                                        className={`flex flex-wrap items-center gap-3 px-3.5 py-3 ${
                                                                            index >
                                                                            0
                                                                                ? 'border-t border-[#303A47]'
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#343E4B] bg-[#202A36] text-[#B8C5D3]">
                                                                            <UserRound
                                                                                size={
                                                                                    15
                                                                                }
                                                                            />
                                                                        </div>

                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="truncate text-[12px] font-medium text-[#EEF1F5]">
                                                                                {getVolunteerName(
                                                                                    volunteer,
                                                                                )}
                                                                            </p>

                                                                            {getVolunteerEmail(
                                                                                volunteer,
                                                                            ) && (
                                                                                <p className="mt-1 truncate text-[11px] text-[#8792A1]">
                                                                                    {getVolunteerEmail(
                                                                                        volunteer,
                                                                                    )}
                                                                                </p>
                                                                            )}
                                                                        </div>

                                                                        <span className="text-[11px] text-[#AEB7C3]">
                                                                            {getStatusLabel(
                                                                                assignment.status,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* =====================================
                                RIGHT — ASSIGNMENT DETAILS
                            ===================================== */}

                            <aside className="min-w-0 border-t border-[#303A47] bg-[#151C25] px-5 py-6 sm:px-7 sm:py-7 md:border-l md:border-t-0 md:px-6">
                                {/* PANEL HEADER */}

                                <div className="flex items-center gap-2.5">
                                    <ClipboardCheck
                                        size={17}
                                        className="text-[#AAB8C8]"
                                    />

                                    <h3 className="!m-0 !font-['Poppins',sans-serif] !text-[14px] !font-semibold !text-[#EEF1F5]">
                                        Assignment details
                                    </h3>
                                </div>

                                {/* CAMPAIGN STATUS */}

                                {campaign.status && (
                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className="text-[12px] text-[#96A2B1]">
                                            Campaign status
                                        </span>

                                        <span className="inline-flex items-center gap-2 text-[12px] font-medium capitalize text-[#D7DEE7]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#8196B6]" />
                                            {campaign.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                )}

                                {/* OVERVIEW */}

                                <div className="mt-5 space-y-4 border-t border-[#303A47] pt-5">
                                    {overviewItems.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between gap-3"
                                        >
                                            <span className="text-[12px] text-[#96A2B1]">
                                                {item.label}
                                            </span>

                                            <span className="text-[13px] font-semibold tabular-nums text-[#EEF1F5]">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* SELECTED COUNT */}

                                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#303A47] pt-5">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={15}
                                            className="text-[#A5B9D8]"
                                        />

                                        <span className="text-[12px] font-medium text-[#C5D0DE]">
                                            New selection
                                        </span>
                                    </div>

                                    <span className="text-[14px] font-semibold tabular-nums text-[#EEF1F5]">
                                        {selectedCount}
                                    </span>
                                </div>

                                {/* NOTE */}

                                <div className="mt-7 border-t border-[#303A47] pt-6">
                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <label
                                            htmlFor="assignment-note"
                                            className="text-[13px] font-semibold text-[#EEF1F5]"
                                        >
                                            Assignment note
                                        </label>

                                        <span className="text-[11px] text-[#8792A1]">
                                            Optional
                                        </span>
                                    </div>

                                    <textarea
                                        id="assignment-note"
                                        value={note}
                                        onChange={(event) =>
                                            setNote(event.target.value)
                                        }
                                        disabled={loading}
                                        rows={5}
                                        placeholder="Add instructions for selected volunteers..."
                                        className="
                                            block w-full resize-y
                                            border border-[#343E4B]
                                            bg-[#10161F]
                                            px-3.5 py-3
                                            text-[12px] leading-6
                                            text-[#EEF1F5]
                                            outline-none
                                            placeholder:text-[#697586]
                                            transition-colors
                                            hover:border-[#455469]
                                            focus:border-[#8297B8]
                                            disabled:opacity-50
                                        "
                                    />
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* ================================================
                        FOOTER
                    ================================================ */}

                    <footer className="shrink-0 border-t border-[#303A47] bg-[#1A222D] px-5 py-4 sm:px-7">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[12px] text-[#AEB7C3]">
                                <span className="font-semibold text-[#EEF1F5]">
                                    {selectedCount}
                                </span>{' '}
                                {selectedCount === 1
                                    ? 'volunteer selected'
                                    : 'volunteers selected'}
                            </p>

                            <div className="flex w-full items-center gap-2.5 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="
                                        inline-flex h-10 flex-1
                                        items-center justify-center
                                        border border-[#343E4B]
                                        px-5 text-[12px] font-medium
                                        text-[#B8C2CF]
                                        transition-colors
                                        hover:bg-[#252F3B]
                                        hover:text-[#EEF1F5]
                                        disabled:opacity-40
                                        sm:flex-none
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || !selectedCount}
                                    className="
                                        inline-flex h-10 flex-1
                                        items-center justify-center gap-2
                                        border border-[#0F766E]
                                        bg-[#0F766E]
                                        px-5 text-[12px] font-semibold
                                        text-white
                                        transition-colors
                                        hover:bg-[#115E59]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        sm:flex-none
                                    "
                                >
                                    {loading && (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    {loading
                                        ? 'Assigning...'
                                        : `Assign ${selectedCount} ${
                                              selectedCount === 1
                                                  ? 'volunteer'
                                                  : 'volunteers'
                                          }`}
                                </button>
                            </div>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default AssignmentModal;
