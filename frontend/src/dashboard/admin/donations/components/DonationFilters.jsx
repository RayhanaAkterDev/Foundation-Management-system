import React, { useMemo } from 'react';
import {
    Check,
    CreditCard,
    HandCoins,
    RotateCcw,
    UserRound,
    Users,
    UserRoundPlus,
} from 'lucide-react';

const getPaymentMethod = (donation) =>
    String(
        donation?.payment_method || donation?.paymentMethod || 'Not specified',
    )
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const isRegisteredDonor = (donation) => {
    // Prefer the linked user ID to distinguish registered users from guests.
    // Adjust these fields if your API uses a different user identifier.
    return Boolean(
        donation?.user_id ??
        donation?.userId ??
        donation?.donor?.id ??
        donation?.user?.id,
    );
};

const FilterOption = ({
    label,
    count,
    selected,
    onClick,
    Icon = CreditCard,
    primary = false,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className={`
                group relative flex w-full items-center
                gap-2.5 px-3 text-left
                transition-[background-color,color]
                duration-150
                focus:outline-none focus:ring-0
                ${primary ? 'min-h-11 py-2.5' : 'min-h-[38px] py-2'}
                ${selected ? 'bg-[#1A222D]' : 'bg-transparent hover:bg-[#151B24]'}
            `}
        >
            {selected && (
                <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-0.5 bg-[#718096]"
                />
            )}

            <Icon
                size={primary ? 15 : 14}
                strokeWidth={1.8}
                className={`
                    shrink-0 transition-colors
                    ${
                        selected
                            ? 'text-[#C2CBD6]'
                            : 'text-[#697586] group-hover:text-[#AEB7C3]'
                    }
                `}
            />

            <span
                className={`
                    min-w-0 flex-1 truncate
                    text-[11px] leading-5
                    ${
                        selected
                            ? 'font-semibold! text-[#EEF1F5]'
                            : 'font-medium! text-[#8792A1] group-hover:text-[#B8C0CA]'
                    }
                `}
            >
                {label}
            </span>

            {count !== undefined && (
                <span
                    className={`
                        shrink-0 text-[10px] tabular-nums
                        ${
                            selected
                                ? 'font-semibold! text-[#B8C0CA]'
                                : 'font-medium! text-[#697586]'
                        }
                    `}
                >
                    {count}
                </span>
            )}

            {!primary && (
                <span
                    aria-hidden="true"
                    className={`
                        flex h-3.5 w-3.5 shrink-0
                        items-center justify-center
                        rounded-full border
                        transition-colors duration-150
                        ${
                            selected
                                ? 'border-[#8493A6] bg-[#8493A6]'
                                : 'border-[#455160] bg-transparent group-hover:border-[#697586]'
                        }
                    `}
                >
                    {selected && (
                        <Check
                            size={9}
                            strokeWidth={2.5}
                            className="text-[#0E1219]"
                        />
                    )}
                </span>
            )}
        </button>
    );
};

const FilterSection = ({ title, children }) => (
    <section className="border-t border-[#252D38] px-4 py-4">
        <h4 className="mb-3 px-1 font-sans! text-[10px] font-semibold! uppercase tracking-normal text-[#697586]!">
            {title}
        </h4>

        <div className="space-y-0.5">{children}</div>
    </section>
);

const DonationFilters = ({
    donations = [],
    method = 'all',
    onMethodChange,
    donorIdentity = 'all',
    onDonorIdentityChange,
    onClear,
}) => {
    const methods = useMemo(() => {
        const counts = new Map();

        donations.forEach((donation) => {
            const name = getPaymentMethod(donation);
            counts.set(name, (counts.get(name) || 0) + 1);
        });

        return [...counts.entries()]
            .sort(([first], [second]) => first.localeCompare(second))
            .map(([name, count]) => ({ name, count }));
    }, [donations]);

    const donorCounts = useMemo(() => {
        const registered = donations.filter(isRegisteredDonor).length;

        return {
            all: donations.length,
            guest: donations.length - registered,
            registered,
        };
    }, [donations]);

    const activeFilterCount =
        (method !== 'all' ? 1 : 0) + (donorIdentity !== 'all' ? 1 : 0);

    const handleClear = () => {
        onMethodChange?.('all');
        onDonorIdentityChange?.('all');
        onClear?.();
    };

    return (
        <aside className="flex h-full min-w-0 flex-col bg-[#0E1219]">
            {/* FILTER HEADER */}
            <div className="bg-[#1A222D] p-4 sm:p-[22px]">
                <div className="flex min-h-8 items-center justify-between gap-4">
                    <h3 className="font-sans! text-[15px] font-semibold! leading-8 text-[#EEF1F5]!">
                        Filter
                    </h3>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="
                                group inline-flex shrink-0
                                items-center gap-1.5
                                text-[10px] font-medium!
                                text-[#8792A1]
                                transition-colors duration-150
                                hover:text-[#EEF1F5]
                                focus-visible:outline
                                focus-visible:outline-1
                                focus-visible:outline-[#697586]
                            "
                        >
                            <RotateCcw
                                size={11}
                                strokeWidth={1.8}
                                className="transition-transform duration-200 group-hover:-rotate-45"
                            />
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* ALL DONATIONS */}
            <FilterSection title="Donation records">
                <FilterOption
                    label="All donations"
                    count={donations.length}
                    selected={method === 'all'}
                    onClick={() => onMethodChange?.('all')}
                    Icon={HandCoins}
                    primary
                />
            </FilterSection>

            {/* DONOR IDENTITY */}
            <FilterSection title="Donor identity">
                <FilterOption
                    label="All donors"
                    count={donorCounts.all}
                    selected={donorIdentity === 'all'}
                    onClick={() => onDonorIdentityChange?.('all')}
                    Icon={Users}
                    primary
                />

                <FilterOption
                    label="Guest donors"
                    count={donorCounts.guest}
                    selected={donorIdentity === 'guest'}
                    onClick={() => onDonorIdentityChange?.('guest')}
                    Icon={UserRoundPlus}
                />

                <FilterOption
                    label="Registered users"
                    count={donorCounts.registered}
                    selected={donorIdentity === 'registered'}
                    onClick={() => onDonorIdentityChange?.('registered')}
                    Icon={UserRound}
                />
            </FilterSection>

            {/* PAYMENT METHODS */}
            <FilterSection title="Payment method">
                {methods.length ? (
                    methods.map(({ name, count }) => (
                        <FilterOption
                            key={name}
                            label={name}
                            count={count}
                            selected={method === name}
                            onClick={() => onMethodChange?.(name)}
                            Icon={CreditCard}
                        />
                    ))
                ) : (
                    <p className="px-3 py-3 text-[11px] text-[#697586]">
                        No payment methods available.
                    </p>
                )}
            </FilterSection>
        </aside>
    );
};

export default DonationFilters;
