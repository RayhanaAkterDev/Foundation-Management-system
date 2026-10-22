import { useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Check,
    CheckCircle2,
    ChevronDown,
    ClipboardCheck,
    LoaderCircle,
    MapPin,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';

const hiddenScrollbar =
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

const getOrganizationId = (organization) =>
    String(organization?.id ?? organization?.organization_id ?? '');

const getOrganizationName = (organization) =>
    organization?.name ||
    organization?.organization_name ||
    `Organization #${getOrganizationId(organization)}`;

const getOrganizationDistrict = (organization) =>
    organization?.district ||
    organization?.address?.district ||
    organization?.location?.district ||
    '';

const getAssignments = (request) => {
    if (Array.isArray(request?.assignments)) {
        return request.assignments;
    }

    return request?.assignment ? [request.assignment] : [];
};

const formatValue = (value) =>
    String(value || '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());

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

function OrganizationOption({ organization, selected, disabled, onSelect }) {
    const name = getOrganizationName(organization);
    const district = getOrganizationDistrict(organization);

    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={onSelect}
            className={[
                'group flex w-full min-w-0 items-center gap-3 border px-3.5 py-3.5 text-left transition-colors sm:gap-4 sm:px-4',
                selected
                    ? 'border-[#7389A5] bg-[#202C3B]'
                    : 'border-[#303A47] bg-[#151C25] hover:border-[#4A5A6E] hover:bg-[#1B2531]',
                disabled ? 'cursor-not-allowed opacity-50' : '',
                'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#8297B8]',
            ].join(' ')}
        >
            <span
                className={[
                    'flex h-10 w-10 shrink-0 items-center justify-center border',
                    selected
                        ? 'border-[#536C89] bg-[#304158] text-[#D0DDF0]'
                        : 'border-[#364352] bg-[#202A36] text-[#B8C5D3]',
                ].join(' ')}
            >
                <Building2 size={19} strokeWidth={1.7} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold! leading-5 text-[#EEF1F5]!">
                    {name}
                </span>

                <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] leading-5 text-[#96A2B1]">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck size={13} />
                        Verified organization
                    </span>

                    {district && (
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                            <MapPin size={12} className="shrink-0" />
                            <span className="truncate">{district}</span>
                        </span>
                    )}
                </span>
            </span>

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
        </button>
    );
}

function RejectedOrganizations({ organizations }) {
    const [expanded, setExpanded] = useState(false);

    if (!organizations.length) return null;

    return (
        <div className="mt-7 border-t border-[#303A47] pt-5">
            <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-3 text-left"
            >
                <span className="flex min-w-0 items-center gap-2.5">
                    <AlertCircle
                        size={16}
                        className="shrink-0 text-[#D18E94]"
                    />

                    <span className="text-[13px] font-semibold! text-[#D9E1EB]">
                        Previous rejections
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2 text-[12px] text-[#AAB8C8]">
                    {organizations.length} · {expanded ? 'Hide' : 'View'}
                    <ChevronDown
                        size={15}
                        className={`transition-transform ${
                            expanded ? 'rotate-180' : ''
                        }`}
                    />
                </span>
            </button>

            {expanded && (
                <div className="mt-4">
                    <p className="mb-3 text-[12px] leading-5 text-[#8792A1]">
                        These organizations previously rejected this request and
                        cannot be selected again.
                    </p>

                    <div className="overflow-hidden border border-[#303A47] bg-[#121922]">
                        {organizations.map((organization, index) => (
                            <div
                                key={getOrganizationId(organization)}
                                className={[
                                    'flex min-w-0 items-center gap-3 px-3.5 py-3',
                                    index > 0
                                        ? 'border-t border-[#303A47]'
                                        : '',
                                ].join(' ')}
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#34404F] bg-[#202A36] text-[#AAB8C8]">
                                    <Building2 size={15} />
                                </span>

                                <span className="min-w-0 flex-1 truncate text-[12px] font-medium! text-[#EEF1F5]!">
                                    {getOrganizationName(organization)}
                                </span>

                                <span className="shrink-0 text-[11px] text-[#D18E94]">
                                    Rejected
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AssignmentForm({
    request,
    availableOrganizations,
    rejectedOrganizations,
    initialOrganization,
    loading,
    error,
    onClose,
    onConfirm,
}) {
    const [selectedOrganization, setSelectedOrganization] = useState(() =>
        availableOrganizations.some(
            (organization) =>
                getOrganizationId(organization) === String(initialOrganization),
        )
            ? String(initialOrganization)
            : '',
    );

    const [search, setSearch] = useState('');

    const filteredOrganizations = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return availableOrganizations;

        return availableOrganizations.filter((organization) =>
            [
                getOrganizationName(organization),
                getOrganizationDistrict(organization),
            ]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [availableOrganizations, search]);

    const selectedOrganizationData = availableOrganizations.find(
        (organization) =>
            getOrganizationId(organization) === selectedOrganization,
    );

    const canSubmit = Boolean(selectedOrganizationData);

    const handleClose = () => {
        if (!loading) onClose?.();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canSubmit || loading || !onConfirm) return;

        onConfirm({
            organization_id: Number(selectedOrganization),
        });
    };

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
                aria-labelledby="organization-assignment-title"
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
                                    id="organization-assignment-title"
                                    className="font-sans m-0 text-[18px] font-semibold! leading-6 tracking-[-0.025em] text-[#EEF1F5]!"
                                >
                                    Assign organization
                                </h2>

                                <p className="mt-1.5 truncate text-[15px] font-semibold! leading-5 text-[#9BA8B7]">
                                    {request.title || 'Help request'}
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
                            {/* Organization selection */}
                            <section className="min-w-0 px-5 py-6 sm:px-7 sm:py-7">
                                <SectionTitle
                                    icon={Building2}
                                    title="Select organization"
                                    description="Choose one verified organization for this request."
                                    trailing={
                                        <span className="mt-1 text-[12px] tabular-nums text-[#AAB8C8]">
                                            {availableOrganizations.length}{' '}
                                            available
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
                                            placeholder="Search organizations or districts"
                                            aria-label="Search organizations"
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
                                                ? `${filteredOrganizations.length} matching organizations`
                                                : 'Available for assignment'}
                                        </span>

                                        {canSubmit && (
                                            <button
                                                type="button"
                                                disabled={loading}
                                                onClick={() =>
                                                    setSelectedOrganization('')
                                                }
                                                className="text-[12px] font-medium! text-[#B6C8E0] hover:text-white disabled:opacity-40"
                                            >
                                                Clear selection
                                            </button>
                                        )}
                                    </div>

                                    <div
                                        role="radiogroup"
                                        aria-label="Select organization"
                                        className={`mt-3 max-h-[370px] space-y-2 overflow-y-auto ${hiddenScrollbar}`}
                                    >
                                        {filteredOrganizations.length > 0 ? (
                                            filteredOrganizations.map(
                                                (organization) => {
                                                    const id =
                                                        getOrganizationId(
                                                            organization,
                                                        );

                                                    return (
                                                        <OrganizationOption
                                                            key={id}
                                                            organization={
                                                                organization
                                                            }
                                                            selected={
                                                                selectedOrganization ===
                                                                id
                                                            }
                                                            disabled={loading}
                                                            onSelect={() =>
                                                                setSelectedOrganization(
                                                                    id,
                                                                )
                                                            }
                                                        />
                                                    );
                                                },
                                            )
                                        ) : (
                                            <div className="border border-[#303A47] bg-[#141B24] px-5 py-12 text-center">
                                                <Building2
                                                    size={25}
                                                    className="mx-auto text-[#718093]"
                                                />

                                                <p className="mt-3 text-[13px] font-semibold! text-[#D5DDE6]">
                                                    {search
                                                        ? 'No matching organizations'
                                                        : 'No eligible organizations'}
                                                </p>

                                                <p className="mt-1.5 text-[12px] leading-5 text-[#8792A1]">
                                                    {search
                                                        ? 'Try another organization name or district.'
                                                        : 'No verified organizations are currently available for this request.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <RejectedOrganizations
                                    organizations={rejectedOrganizations}
                                />
                            </section>

                            {/* Assignment sidebar */}
                            <aside className="min-w-0 border-t border-[#303A47] bg-[#17202A] px-5 py-6 sm:px-7 sm:py-7 md:border-l md:border-t-0">
                                <SectionTitle
                                    icon={ClipboardCheck}
                                    title="Assignment details"
                                    description="Review the organization and request information."
                                />

                                <div className="mt-6 border border-[#39485B] bg-[#202D3C] px-4 py-4">
                                    <div className="flex items-center gap-2 text-[#B6C8E0]">
                                        <CheckCircle2 size={16} />

                                        <span className="text-[12px] font-medium!">
                                            Selected organization
                                        </span>
                                    </div>

                                    {selectedOrganizationData ? (
                                        <>
                                            <p className="mt-3 break-words text-[15px] font-semibold! leading-6 text-[#EEF1F5]!">
                                                {getOrganizationName(
                                                    selectedOrganizationData,
                                                )}
                                            </p>

                                            <p className="mt-2 text-[12px] leading-5 text-[#AAB8C8]">
                                                Ready to receive this assignment
                                                request.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="mt-3 text-[17px] font-semibold! text-[#EEF1F5]!">
                                                Not selected
                                            </p>

                                            <p className="mt-2 text-[12px] leading-5 text-[#AAB8C8]">
                                                Choose an organization from the
                                                list to continue.
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="mt-6">
                                    <h4 className="m-0 text-[13px] font-semibold! text-[#EEF1F5]!">
                                        Request overview
                                    </h4>

                                    <div className="mt-3 divide-y divide-[#34404D] border-y border-[#34404D]">
                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <span className="shrink-0 text-[12px] text-[#AAB8C8]">
                                                Category
                                            </span>

                                            <span className="min-w-0 text-right text-[12px] font-medium! text-[#EEF1F5]!">
                                                {formatValue(
                                                    request.category ||
                                                        'General assistance',
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-start justify-between gap-3 py-3">
                                            <span className="shrink-0 text-[12px] text-[#AAB8C8]">
                                                Priority
                                            </span>

                                            <span className="min-w-0 text-right text-[12px] font-medium! text-[#EEF1F5]!">
                                                {formatValue(
                                                    request.priority ||
                                                        request.urgency ||
                                                        'Normal',
                                                )}
                                            </span>
                                        </div>

                                        {request.district && (
                                            <div className="flex items-start justify-between gap-3 py-3">
                                                <span className="shrink-0 text-[12px] text-[#AAB8C8]">
                                                    District
                                                </span>

                                                <span className="min-w-0 text-right text-[12px] font-medium! text-[#EEF1F5]!">
                                                    {request.district}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="shrink-0 border-t border-[#303A47] bg-[#19212B] px-5 py-3.5 sm:px-7 sm:py-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-2.5 text-[12px] text-[#AAB8C8]">
                                <ShieldCheck size={16} />

                                <span className="min-w-0 truncate">
                                    {selectedOrganizationData
                                        ? getOrganizationName(
                                              selectedOrganizationData,
                                          )
                                        : 'Select an organization to continue'}
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
                                        loading || !canSubmit || !onConfirm
                                    }
                                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 border border-[#0F766E] bg-[#0F766E] px-5 text-[12px] font-semibold! text-white transition-colors hover:bg-[#115E59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8297B8] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                                >
                                    {loading ? (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <ArrowRight size={15} />
                                    )}

                                    {loading ? 'Sending...' : 'Send assignment'}
                                </button>
                            </div>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default function AssignmentModal({
    request,
    organizations = [],
    loading = false,
    error = '',
    onClose,
    onConfirm,
}) {
    const initialOrganization = String(
        request?.assignment?.organization_id ?? request?.organization_id ?? '',
    );

    const { availableOrganizations, rejectedOrganizations } = useMemo(() => {
        const assignments = getAssignments(request);

        const rejectedIds = new Set(
            assignments
                .filter(
                    (assignment) =>
                        String(assignment?.status || '')
                            .trim()
                            .toLowerCase() === 'rejected' &&
                        assignment?.organization_id != null,
                )
                .map((assignment) => String(assignment.organization_id)),
        );

        const available = [];
        const rejected = [];

        organizations.forEach((organization) => {
            const id = getOrganizationId(organization);

            if (!id) return;

            if (rejectedIds.has(id)) {
                rejected.push(organization);
                return;
            }

            const verificationStatus =
                organization.verification_status ??
                organization.verificationStatus ??
                organization.status;

            if (
                !verificationStatus ||
                String(verificationStatus).toLowerCase() === 'verified'
            ) {
                available.push(organization);
            }
        });

        return {
            availableOrganizations: available,
            rejectedOrganizations: rejected,
        };
    }, [organizations, request]);

    if (!request) return null;

    return (
        <AssignmentForm
            key={request.id ?? 'new-request'}
            request={request}
            availableOrganizations={availableOrganizations}
            rejectedOrganizations={rejectedOrganizations}
            initialOrganization={initialOrganization}
            loading={loading}
            error={error}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    );
}
