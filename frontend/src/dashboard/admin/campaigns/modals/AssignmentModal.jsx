import { useMemo, useState } from 'react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ClipboardCheck,
    LoaderCircle,
    MapPin,
    Search,
    UserRound,
    UsersRound,
    X,
} from 'lucide-react';

const hiddenScrollbar =
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

function SectionTitle({ icon: Icon, title, description, trailing }) {
    return (
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#354251] bg-[#202A36] text-[#AAB8C8]">
                    <Icon size={17} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                    <h3 className="m-0 text-[14px] font-semibold! leading-6 text-[#EEF1F5]!">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-0.5 text-[12px] leading-5 text-[#8792A1]">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {trailing}
        </div>
    );
}

function VolunteerOption({ volunteer, selected, disabled, onToggle }) {
    const name = getVolunteerName(volunteer);
    const email = getVolunteerEmail(volunteer);
    const district = getVolunteerDistrict(volunteer);

    return (
        <label
            className={[
                'group flex min-w-0 cursor-pointer items-center gap-3 border px-3.5 py-3.5 transition-colors sm:gap-4 sm:px-4',
                selected
                    ? 'border-[#7389A5] bg-[#202C3B]'
                    : 'border-[#303A47] bg-[#151C25] hover:border-[#4A5A6E] hover:bg-[#1B2531]',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                'focus-within:outline focus-within:outline-1 focus-within:outline-[#8297B8]',
            ].join(' ')}
        >
            <input
                type="checkbox"
                checked={selected}
                disabled={disabled}
                onChange={onToggle}
                className="sr-only"
                aria-label={`Select ${name}`}
            />

            <div
                className={[
                    'flex h-10 w-10 shrink-0 items-center justify-center border',
                    selected
                        ? 'border-[#536C89] bg-[#304158] text-[#D0DDF0]'
                        : 'border-[#364352] bg-[#202A36] text-[#B8C5D3]',
                ].join(' ')}
            >
                <UserRound size={19} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold! leading-5 text-[#EEF1F5]!">
                    {name}
                </p>

                {email && (
                    <p className="mt-0.5 truncate text-[12px] leading-5 text-[#A1ACB9]">
                        {email}
                    </p>
                )}

                {district && (
                    <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-[#8792A1]">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{district}</span>
                    </div>
                )}
            </div>

            <span
                aria-hidden="true"
                className={[
                    'flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
                    selected
                        ? 'border-[#AFC3DD] bg-[#AFC3DD] text-[#182332]'
                        : 'border-[#68788B] bg-[#111821] text-transparent group-hover:border-[#AFC3DD]',
                ].join(' ')}
            >
                <Check size={12} strokeWidth={3} />
            </span>
        </label>
    );
}

function HistoryGroup({ title, assignments }) {
    if (!assignments.length) return null;

    return (
        <div>
            <div className="mb-2.5 flex items-center justify-between gap-3">
                <h4 className="m-0 text-[12px] font-semibold! text-[#C5CFDB]">
                    {title}
                </h4>

                <span className="text-[11px] tabular-nums text-[#8792A1]">
                    {assignments.length}
                </span>
            </div>

            <div className="overflow-hidden border border-[#303A47] bg-[#121922]">
                {assignments.map((assignment, index) => {
                    const volunteer =
                        assignment.volunteer || assignment.user || assignment;

                    return (
                        <div
                            key={
                                assignment.id ??
                                `${title}-${assignment._volunteerId}-${index}`
                            }
                            className={[
                                'flex min-w-0 items-center gap-3 px-3.5 py-3',
                                index > 0 ? 'border-t border-[#303A47]' : '',
                            ].join(' ')}
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#34404F] bg-[#202A36] text-[#AAB8C8]">
                                <UserRound size={15} />
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[12px] font-medium! text-[#EEF1F5]!">
                                    {getVolunteerName(volunteer)}
                                </p>

                                {getVolunteerEmail(volunteer) && (
                                    <p className="mt-0.5 truncate text-[11px] text-[#8792A1]">
                                        {getVolunteerEmail(volunteer)}
                                    </p>
                                )}
                            </div>

                            <span className="max-w-[110px] shrink-0 text-right text-[11px] leading-4 text-[#AAB8C8]">
                                {getStatusLabel(assignment.status)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

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
    const [showHistory, setShowHistory] = useState(false);

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

    const historyGroups = [
        { key: 'connected', title: 'Connected', items: connected },
        { key: 'rejected', title: 'Rejected', items: rejected },
        { key: 'previous', title: 'Previous', items: previous },
    ].filter((group) => group.items.length > 0);

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
            // Parent handles assignment errors.
        }
    };

    if (!campaign) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070A]/80 p-0 backdrop-blur-[3px] sm:p-4 lg:p-6">
            <button
                type="button"
                aria-label="Close assignment modal"
                disabled={loading}
                onClick={handleClose}
                className="absolute inset-0 cursor-default"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="assignment-title"
                className="relative z-10 flex h-[100dvh] w-full max-w-[1060px] flex-col overflow-hidden border border-[#303A47] bg-[#0E1219] font-['Poppins',sans-serif] shadow-[0_28px_90px_rgba(0,0,0,0.5)] sm:h-auto sm:max-h-[92dvh]"
            >
                {/* Header */}
                <header className="shrink-0 border-b border-[#303A47] bg-[#19212B] px-5 py-4 sm:px-7 sm:py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#3B4858] bg-[#253140] text-[#C3CFDD]">
                                <ClipboardCheck size={19} strokeWidth={1.8} />
                            </span>

                            <div className="min-w-0">
                                <h2
                                    id="assignment-title"
                                    className="m-0 text-[18px] font-semibold! leading-6 tracking-[-0.025em] text-[#EEF1F5]!"
                                >
                                    Assign volunteers
                                </h2>

                                <p className="mt-1.5 truncate text-[12px] leading-5 text-[#9BA8B7]">
                                    {campaign.title || 'Campaign'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            aria-label="Close"
                            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#3B4654] text-[#AAB5C3] transition-colors hover:bg-[#2A3542] hover:text-[#EEF1F5]! disabled:opacity-40"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div
                        className={`min-h-0 flex-1 overflow-y-auto ${hiddenScrollbar}`}
                    >
                        {error && (
                            <div className="px-5 pt-5 sm:px-7">
                                <div
                                    role="alert"
                                    className="flex items-start gap-3 border border-[#59343B] bg-[#38272C] px-4 py-3.5"
                                >
                                    <AlertCircle
                                        size={17}
                                        className="mt-0.5 shrink-0 text-[#E9A6AF]"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-[13px] font-semibold! text-[#F2B8BF]">
                                            Assignment failed
                                        </p>

                                        <p className="mt-1 text-[12px] leading-5 text-[#E9A6AF]">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.9fr)]">
                            {/* Main selection area */}
                            <section className="min-w-0 px-5 py-6 sm:px-7 sm:py-7">
                                <SectionTitle
                                    icon={UsersRound}
                                    title="Select volunteers"
                                    description="Choose the volunteers you want to assign to this campaign."
                                    trailing={
                                        <span className="mt-1 text-[12px] tabular-nums text-[#AAB8C8]">
                                            {available.length} available
                                        </span>
                                    }
                                />

                                <div className="mt-6">
                                    <div className="flex h-11 items-center gap-3 border border-[#394554] bg-[#151C25] px-3.5 transition-colors focus-within:border-[#8297B8]">
                                        <Search
                                            size={17}
                                            className="shrink-0 text-[#8792A1]"
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Search name, email or district"
                                            aria-label="Search volunteers"
                                            className="min-w-0 flex-1 bg-transparent text-[13px] text-[#EEF1F5]! outline-none placeholder:text-[#748193]"
                                        />

                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch('')}
                                                className="text-[12px] text-[#B8C5D3] hover:text-white"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-[12px] text-[#AAB8C8]">
                                            {search
                                                ? `${filtered.length} matching volunteers`
                                                : 'Available for assignment'}
                                        </span>

                                        {selectedCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedIds([])
                                                }
                                                disabled={loading}
                                                className="text-[12px] font-medium! text-[#B6C8E0] hover:text-white disabled:opacity-40"
                                            >
                                                Clear selection
                                            </button>
                                        )}
                                    </div>

                                    <div
                                        className={`mt-3 max-h-[370px] space-y-2 overflow-y-auto ${hiddenScrollbar}`}
                                    >
                                        {filtered.length > 0 ? (
                                            filtered.map((volunteer) => {
                                                const id =
                                                    getVolunteerId(volunteer);

                                                return (
                                                    <VolunteerOption
                                                        key={id}
                                                        volunteer={volunteer}
                                                        selected={selectedIds.includes(
                                                            id,
                                                        )}
                                                        disabled={loading}
                                                        onToggle={() =>
                                                            toggleVolunteer(id)
                                                        }
                                                    />
                                                );
                                            })
                                        ) : (
                                            <div className="border border-[#303A47] bg-[#141B24] px-5 py-12 text-center">
                                                <UsersRound
                                                    size={25}
                                                    className="mx-auto text-[#718093]"
                                                />

                                                <p className="mt-3 text-[13px] font-semibold! text-[#D5DDE6]">
                                                    {search
                                                        ? 'No matching volunteers'
                                                        : 'No volunteers available'}
                                                </p>

                                                <p className="mt-1.5 text-[12px] leading-5 text-[#8792A1]">
                                                    {search
                                                        ? 'Try another name, email or district.'
                                                        : 'There are no additional volunteers to assign.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {historyGroups.length > 0 && (
                                    <div className="mt-7 border-t border-[#303A47] pt-5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowHistory(
                                                    (current) => !current,
                                                )
                                            }
                                            aria-expanded={showHistory}
                                            className="flex w-full items-center justify-between gap-3 text-left"
                                        >
                                            <span className="text-[13px] font-semibold! text-[#D9E1EB]">
                                                Existing assignments
                                            </span>

                                            <span className="text-[12px] text-[#AAB8C8]">
                                                {existingAssignments.length}{' '}
                                                total ·{' '}
                                                {showHistory ? 'Hide' : 'View'}
                                            </span>
                                        </button>

                                        {showHistory && (
                                            <div className="mt-5 space-y-5">
                                                {historyGroups.map((group) => (
                                                    <HistoryGroup
                                                        key={group.key}
                                                        title={group.title}
                                                        assignments={
                                                            group.items
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            {/* Sidebar */}
                            <aside className="min-w-0 border-t border-[#303A47] bg-[#17202A] px-5 py-6 sm:px-7 sm:py-7 md:border-l md:border-t-0">
                                <SectionTitle
                                    icon={ClipboardCheck}
                                    title="Assignment details"
                                    description="Review the selection and add instructions."
                                />

                                <div className="mt-6 border border-[#39485B] bg-[#202D3C] px-4 py-4">
                                    <div className="flex items-center gap-2 text-[#B6C8E0]">
                                        <CheckCircle2 size={16} />

                                        <span className="text-[12px] font-medium!">
                                            Selected volunteers
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-baseline gap-2.5">
                                        <span className="text-[34px] font-semibold! leading-none tabular-nums tracking-[-0.045em] text-[#EEF1F5]!">
                                            {selectedCount}
                                        </span>

                                        <span className="text-[12px] text-[#AAB8C8]">
                                            {selectedCount === 1
                                                ? 'volunteer'
                                                : 'volunteers'}
                                        </span>
                                    </div>

                                    <p className="mt-3 text-[12px] leading-5 text-[#AAB8C8]">
                                        {selectedCount > 0
                                            ? 'Ready to assign to this campaign.'
                                            : 'Choose volunteers from the list to continue.'}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <h4 className="m-0 text-[13px] font-semibold! text-[#EEF1F5]!">
                                        Assignment overview
                                    </h4>

                                    <div className="mt-3 divide-y divide-[#34404D] border-y border-[#34404D]">
                                        {[
                                            {
                                                label: 'Connected',
                                                value: connected.length,
                                            },
                                            {
                                                label: 'Rejected',
                                                value: rejected.length,
                                            },
                                            {
                                                label: 'Previous',
                                                value: previous.length,
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between gap-3 py-3"
                                            >
                                                <span className="text-[12px] text-[#AAB8C8]">
                                                    {item.label}
                                                </span>

                                                <span className="text-[13px] font-semibold! tabular-nums text-[#EEF1F5]!">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-7">
                                    <div className="flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="assignment-note"
                                            className="text-[13px] font-semibold! text-[#EEF1F5]!"
                                        >
                                            Assignment note
                                        </label>

                                        <span className="text-[11px] text-[#8792A1]">
                                            Optional
                                        </span>
                                    </div>

                                    <p className="mt-1.5 text-[12px] leading-5 text-[#96A2B1]">
                                        Add instructions for the selected
                                        volunteers.
                                    </p>

                                    <textarea
                                        id="assignment-note"
                                        rows={5}
                                        value={note}
                                        onChange={(event) =>
                                            setNote(event.target.value)
                                        }
                                        disabled={loading}
                                        placeholder="Write assignment instructions..."
                                        className="mt-3 block min-h-[130px] w-full resize-y border border-[#394554] bg-[#10161F] px-3.5 py-3 text-[13px] leading-6 text-[#EEF1F5]! outline-none transition-colors placeholder:text-[#748193] hover:border-[#4A5A6E] focus:border-[#8297B8] disabled:opacity-50"
                                    />
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="shrink-0 border-t border-[#303A47] bg-[#19212B] px-5 py-3.5 sm:px-7 sm:py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2.5 text-[12px] text-[#AAB8C8]">
                                <UsersRound size={16} />

                                <span>
                                    <strong className="font-semibold! tabular-nums text-[#EEF1F5]!">
                                        {selectedCount}
                                    </strong>{' '}
                                    {selectedCount === 1
                                        ? 'volunteer selected'
                                        : 'volunteers selected'}
                                </span>
                            </div>

                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="inline-flex h-10 flex-1 items-center justify-center border border-[#3B4654] px-5 text-[12px] font-medium! text-[#C2CBD6] transition-colors hover:bg-[#283340] hover:text-white disabled:opacity-40 sm:flex-none"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        selectedCount === 0 ||
                                        !onConfirm
                                    }
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 border border-[#0F766E] bg-[#0F766E] px-5 text-[12px] font-semibold! text-white transition-colors hover:bg-[#115E59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8297B8] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
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
